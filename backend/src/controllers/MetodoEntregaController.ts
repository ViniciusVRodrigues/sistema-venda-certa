import { Request, Response } from 'express';
import { MetodoEntrega } from '../models';
import { validationResult } from 'express-validator';

export class MetodoEntregaController {
  // GET /api/metodos-entrega
  static async getAll(req: Request, res: Response) {
    try {
      const metodosEntrega = await MetodoEntrega.findAll({
        order: [['nome', 'ASC']],
      });
      res.json(metodosEntrega);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar métodos de entrega' });
    }
  }

  // GET /api/metodos-entrega/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const metodoEntrega = await MetodoEntrega.findByPk(id);

      if (!metodoEntrega) {
        return res.status(404).json({ error: 'Método de entrega não encontrado' });
      }

      res.json(metodoEntrega);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar método de entrega' });
    }
  }

  // POST /api/metodos-entrega
  static async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const metodoEntrega = await MetodoEntrega.create(req.body);
      res.status(201).json(metodoEntrega);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar método de entrega' });
    }
  }

  // PUT /api/metodos-entrega/:id
  static async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const [updated] = await MetodoEntrega.update(req.body, {
        where: { id },
      });

      if (updated === 0) {
        return res.status(404).json({ error: 'Método de entrega não encontrado' });
      }

      const metodoEntrega = await MetodoEntrega.findByPk(id);
      res.json(metodoEntrega);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar método de entrega' });
    }
  }

  // DELETE /api/metodos-entrega/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await MetodoEntrega.destroy({
        where: { id },
      });

      if (deleted === 0) {
        return res.status(404).json({ error: 'Método de entrega não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar método de entrega' });
    }
  }

  // GET /api/metodos-entrega/ativos
  static async getAtivos(req: Request, res: Response) {
    try {
      const metodosEntrega = await MetodoEntrega.findAll({
        where: { status: 1 },
        order: [['preco', 'ASC']],
      });
      res.json(metodosEntrega);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar métodos de entrega ativos' });
    }
  }
}