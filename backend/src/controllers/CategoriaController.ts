import { Request, Response } from 'express';
import { Categoria, Produto } from '../models';
import { validationResult } from 'express-validator';

export class CategoriaController {
  // GET /api/categorias
  static async getAll(req: Request, res: Response) {
    try {
      const categorias = await Categoria.findAll({
        include: [
          { 
            model: Produto, 
            as: 'produtos',
            attributes: ['id', 'nome', 'preco', 'estoque', 'status']
          },
        ],
      });
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
  }

  // GET /api/categorias/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findByPk(id, {
        include: [
          { model: Produto, as: 'produtos' },
        ],
      });

      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar categoria' });
    }
  }

  // POST /api/categorias
  static async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const categoria = await Categoria.create(req.body);
      res.status(201).json(categoria);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar categoria' });
    }
  }

  // PUT /api/categorias/:id
  static async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const [updated] = await Categoria.update(req.body, {
        where: { id },
      });

      if (updated === 0) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      const categoria = await Categoria.findByPk(id);
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar categoria' });
    }
  }

  // DELETE /api/categorias/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Check if category has products
      const produtosCount = await Produto.count({
        where: { fk_categoria_id: id },
      });

      if (produtosCount > 0) {
        return res.status(400).json({ 
          error: 'Não é possível deletar categoria que possui produtos associados' 
        });
      }

      const deleted = await Categoria.destroy({
        where: { id },
      });

      if (deleted === 0) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar categoria' });
    }
  }

  // GET /api/categorias/ativas
  static async getAtivas(req: Request, res: Response) {
    try {
      const categorias = await Categoria.findAll({
        where: { estaAtiva: true },
        include: [
          { 
            model: Produto, 
            as: 'produtos',
            where: { status: 1 }, // Only active products
            required: false,
            attributes: ['id', 'nome', 'preco', 'estoque']
          },
        ],
      });
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar categorias ativas' });
    }
  }
}