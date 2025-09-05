import { Request, Response } from 'express';
import { Usuario, Endereco } from '../models';
import { validationResult } from 'express-validator';

export class UsuarioController {
  // GET /api/usuarios
  static async getAll(req: Request, res: Response) {
    try {
      const usuarios = await Usuario.findAll({
        include: [
          { model: Endereco, as: 'enderecos' },
        ],
      });
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  }

  // GET /api/usuarios/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, {
        include: [
          { model: Endereco, as: 'enderecos' },
        ],
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  // POST /api/usuarios
  static async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const usuario = await Usuario.create(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'Email já está em uso' });
      } else {
        res.status(500).json({ error: 'Erro ao criar usuário' });
      }
    }
  }

  // PUT /api/usuarios/:id
  static async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const [updated] = await Usuario.update(req.body, {
        where: { id },
      });

      if (updated === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const usuario = await Usuario.findByPk(id);
      res.json(usuario);
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'Email já está em uso' });
      } else {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
      }
    }
  }

  // DELETE /api/usuarios/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await Usuario.destroy({
        where: { id },
      });

      if (deleted === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }

  // GET /api/usuarios/:id/enderecos
  static async getEnderecos(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const enderecos = await Endereco.findAll({
        where: { fk_usuario_id: id },
      });

      res.json(enderecos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar endereços do usuário' });
    }
  }
}