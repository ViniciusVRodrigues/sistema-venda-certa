import { Request, Response } from 'express';
import { Endereco, Usuario } from '../models';
import { validationResult } from 'express-validator';

export class EnderecoController {
  // GET /api/enderecos
  static async getAll(req: Request, res: Response) {
    try {
      const enderecos = await Endereco.findAll({
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        ],
      });
      res.json(enderecos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar endereços' });
    }
  }

  // GET /api/enderecos/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const endereco = await Endereco.findByPk(id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        ],
      });

      if (!endereco) {
        return res.status(404).json({ error: 'Endereço não encontrado' });
      }

      res.json(endereco);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar endereço' });
    }
  }

  // POST /api/enderecos
  static async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const endereco = await Endereco.create(req.body);
      const enderecoCompleto = await Endereco.findByPk(endereco.id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        ],
      });
      
      res.status(201).json(enderecoCompleto);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar endereço' });
    }
  }

  // PUT /api/enderecos/:id
  static async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const [updated] = await Endereco.update(req.body, {
        where: { id },
      });

      if (updated === 0) {
        return res.status(404).json({ error: 'Endereço não encontrado' });
      }

      const endereco = await Endereco.findByPk(id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        ],
      });
      res.json(endereco);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar endereço' });
    }
  }

  // DELETE /api/enderecos/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await Endereco.destroy({
        where: { id },
      });

      if (deleted === 0) {
        return res.status(404).json({ error: 'Endereço não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar endereço' });
    }
  }

  // GET /api/enderecos/usuario/:usuarioId
  static async getByUsuario(req: Request, res: Response) {
    try {
      const { usuarioId } = req.params;
      const usuario = await Usuario.findByPk(usuarioId);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const enderecos = await Endereco.findAll({
        where: { fk_usuario_id: usuarioId },
        order: [['favorito', 'DESC'], ['id', 'ASC']],
      });

      res.json(enderecos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar endereços do usuário' });
    }
  }

  // PUT /api/enderecos/:id/favorito
  static async setFavorito(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const endereco = await Endereco.findByPk(id);

      if (!endereco) {
        return res.status(404).json({ error: 'Endereço não encontrado' });
      }

      // Remove favorito status from other addresses of the same user
      await Endereco.update(
        { favorito: false },
        { where: { fk_usuario_id: endereco.fk_usuario_id } }
      );

      // Set this address as favorite
      await Endereco.update(
        { favorito: true },
        { where: { id } }
      );

      const enderecoAtualizado = await Endereco.findByPk(id);
      res.json(enderecoAtualizado);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao definir endereço favorito' });
    }
  }
}