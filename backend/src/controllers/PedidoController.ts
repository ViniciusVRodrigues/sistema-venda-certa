import { Request, Response } from 'express';
import { Pedido, Usuario, Endereco, MetodoEntrega, MetodoPagamento, ProdutoPedido, Produto, AtualizacaoPedido } from '../models';
import { validationResult } from 'express-validator';

export class PedidoController {
  // GET /api/pedidos
  static async getAll(req: Request, res: Response) {
    try {
      const pedidos = await Pedido.findAll({
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
          { model: Usuario, as: 'entregador', attributes: ['id', 'nome'] },
          { model: Endereco, as: 'endereco' },
          { model: MetodoEntrega, as: 'metodoEntrega' },
          { model: MetodoPagamento, as: 'metodoPagamento' },
          { 
            model: ProdutoPedido, 
            as: 'produtos',
            include: [
              { model: Produto, as: 'produto', attributes: ['id', 'nome', 'preco'] }
            ]
          },
          { 
            model: AtualizacaoPedido, 
            as: 'atualizacoes',
            include: [
              { model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }
            ]
          },
        ],
        order: [['id', 'DESC']],
      });
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  }

  // GET /api/pedidos/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pedido = await Pedido.findByPk(id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
          { model: Usuario, as: 'entregador', attributes: ['id', 'nome'] },
          { model: Endereco, as: 'endereco' },
          { model: MetodoEntrega, as: 'metodoEntrega' },
          { model: MetodoPagamento, as: 'metodoPagamento' },
          { 
            model: ProdutoPedido, 
            as: 'produtos',
            include: [
              { model: Produto, as: 'produto' }
            ]
          },
          { 
            model: AtualizacaoPedido, 
            as: 'atualizacoes',
            include: [
              { model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }
            ],
            order: [['timestamp', 'ASC']]
          },
        ],
      });

      if (!pedido) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      res.json(pedido);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
  }

  // POST /api/pedidos
  static async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { produtos, ...pedidoData } = req.body;

      // Create the order
      const pedido = await Pedido.create(pedidoData);

      // Add products to order if provided
      if (produtos && produtos.length > 0) {
        const produtosPedido = produtos.map((produto: any) => ({
          ...produto,
          fk_pedido_id: pedido.id,
        }));
        await ProdutoPedido.bulkCreate(produtosPedido);
      }

      // Create initial status update
      await AtualizacaoPedido.create({
        status: pedidoData.status,
        timestamp: new Date(),
        descricao: 'Pedido criado',
        fk_pedido_id: pedido.id,
        fk_usuario_id: pedidoData.fk_usuario_id,
      });

      // Return the complete order
      const pedidoCompleto = await Pedido.findByPk(pedido.id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
          { model: Endereco, as: 'endereco' },
          { model: MetodoEntrega, as: 'metodoEntrega' },
          { model: MetodoPagamento, as: 'metodoPagamento' },
          { 
            model: ProdutoPedido, 
            as: 'produtos',
            include: [
              { model: Produto, as: 'produto' }
            ]
          },
        ],
      });

      res.status(201).json(pedidoCompleto);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  }

  // PUT /api/pedidos/:id
  static async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { produtos, ...pedidoData } = req.body;

      const [updated] = await Pedido.update(pedidoData, {
        where: { id },
      });

      if (updated === 0) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      const pedido = await Pedido.findByPk(id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
          { model: Endereco, as: 'endereco' },
          { model: MetodoEntrega, as: 'metodoEntrega' },
          { model: MetodoPagamento, as: 'metodoPagamento' },
        ],
      });

      res.json(pedido);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
  }

  // DELETE /api/pedidos/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await Pedido.destroy({
        where: { id },
      });

      if (deleted === 0) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar pedido' });
    }
  }

  // PUT /api/pedidos/:id/status
  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, descricao, fk_usuario_id } = req.body;

      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      // Update order status
      await Pedido.update({ status }, { where: { id } });

      // Create status update record
      await AtualizacaoPedido.create({
        status,
        timestamp: new Date(),
        descricao,
        fk_pedido_id: parseInt(id),
        fk_usuario_id,
      });

      const pedidoAtualizado = await Pedido.findByPk(id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
          { 
            model: AtualizacaoPedido, 
            as: 'atualizacoes',
            include: [
              { model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }
            ],
            order: [['timestamp', 'ASC']]
          },
        ],
      });

      res.json(pedidoAtualizado);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
    }
  }

  // GET /api/pedidos/usuario/:usuarioId
  static async getByUsuario(req: Request, res: Response) {
    try {
      const { usuarioId } = req.params;
      const pedidos = await Pedido.findAll({
        where: { fk_usuario_id: usuarioId },
        include: [
          { model: Endereco, as: 'endereco' },
          { model: MetodoEntrega, as: 'metodoEntrega' },
          { model: MetodoPagamento, as: 'metodoPagamento' },
          { 
            model: ProdutoPedido, 
            as: 'produtos',
            include: [
              { model: Produto, as: 'produto', attributes: ['id', 'nome', 'preco'] }
            ]
          },
        ],
        order: [['id', 'DESC']],
      });

      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar pedidos do usuário' });
    }
  }
}