import { Request, Response } from 'express';
import { MetodoPagamento } from '../models';
import { validationResult } from 'express-validator';

export class MetodoPagamentoController {
  // GET /api/metodos-pagamento
  static async getAll(req: Request, res: Response) {
    try {
      const metodosPagamento = await MetodoPagamento.findAll({
        order: [['nome', 'ASC']],
      });
      res.json(metodosPagamento);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar métodos de pagamento' });
    }
  }

  // GET /api/metodos-pagamento/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const metodoPagamento = await MetodoPagamento.findByPk(id);

      if (!metodoPagamento) {
        return res.status(404).json({ error: 'Método de pagamento não encontrado' });
      }

      res.json(metodoPagamento);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar método de pagamento' });
    }
  }

  // POST /api/metodos-pagamento
  static async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const metodoPagamento = await MetodoPagamento.create(req.body);
      res.status(201).json(metodoPagamento);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar método de pagamento' });
    }
  }

  // PUT /api/metodos-pagamento/:id
  static async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const [updated] = await MetodoPagamento.update(req.body, {
        where: { id },
      });

      if (updated === 0) {
        return res.status(404).json({ error: 'Método de pagamento não encontrado' });
      }

      const metodoPagamento = await MetodoPagamento.findByPk(id);
      res.json(metodoPagamento);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar método de pagamento' });
    }
  }

  // DELETE /api/metodos-pagamento/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await MetodoPagamento.destroy({
        where: { id },
      });

      if (deleted === 0) {
        return res.status(404).json({ error: 'Método de pagamento não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar método de pagamento' });
    }
  }

  // GET /api/metodos-pagamento/ativos
  static async getAtivos(req: Request, res: Response) {
    try {
      const metodosPagamento = await MetodoPagamento.findAll({
        where: { ativo: 1 },
        order: [['nome', 'ASC']],
      });
      res.json(metodosPagamento);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar métodos de pagamento ativos' });
    }
  }
}