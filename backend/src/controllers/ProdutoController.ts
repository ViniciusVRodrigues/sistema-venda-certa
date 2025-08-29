import { Request, Response } from 'express';
import { Produto, Categoria, AvaliacaoProduto, Usuario } from '../models';
import { validationResult } from 'express-validator';

export class ProdutoController {
  // GET /api/produtos
  static async getAll(req: Request, res: Response) {
    try {
      const produtos = await Produto.findAll({
        include: [
          { model: Categoria, as: 'categoria' },
          { 
            model: AvaliacaoProduto, 
            as: 'avaliacoes',
            include: [
              { model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }
            ]
          },
        ],
      });
      res.json(produtos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  }

  // GET /api/produtos/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const produto = await Produto.findByPk(id, {
        include: [
          { model: Categoria, as: 'categoria' },
          { 
            model: AvaliacaoProduto, 
            as: 'avaliacoes',
            include: [
              { model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }
            ]
          },
        ],
      });

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      res.json(produto);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  }

  // POST /api/produtos
  static async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const produto = await Produto.create(req.body);
      res.status(201).json(produto);
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'SKU já está em uso' });
      } else {
        res.status(500).json({ error: 'Erro ao criar produto' });
      }
    }
  }

  // PUT /api/produtos/:id
  static async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const [updated] = await Produto.update(req.body, {
        where: { id },
      });

      if (updated === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const produto = await Produto.findByPk(id, {
        include: [{ model: Categoria, as: 'categoria' }],
      });
      res.json(produto);
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'SKU já está em uso' });
      } else {
        res.status(500).json({ error: 'Erro ao atualizar produto' });
      }
    }
  }

  // DELETE /api/produtos/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await Produto.destroy({
        where: { id },
      });

      if (deleted === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  }

  // GET /api/produtos/categoria/:categoriaId
  static async getByCategoria(req: Request, res: Response) {
    try {
      const { categoriaId } = req.params;
      const produtos = await Produto.findAll({
        where: { fk_categoria_id: categoriaId },
        include: [{ model: Categoria, as: 'categoria' }],
      });

      res.json(produtos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar produtos da categoria' });
    }
  }

  // GET /api/produtos/:id/avaliacoes
  static async getAvaliacoes(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const produto = await Produto.findByPk(id);

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const avaliacoes = await AvaliacaoProduto.findAll({
        where: { fk_produto_id: id },
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }
        ],
      });

      res.json(avaliacoes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar avaliações do produto' });
    }
  }
}