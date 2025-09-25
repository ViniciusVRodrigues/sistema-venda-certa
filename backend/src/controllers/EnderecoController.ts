import { Request, Response } from 'express';
import { Endereco, Usuario } from '../models';
import { validationResult } from 'express-validator';
import { AbstractController } from './AbstractController';

export class EnderecoController extends AbstractController {
  // GET /api/enderecos - usando Template Method
  static async getAll(req: Request, res: Response) {
    const controller = new EnderecoController();
    controller.processRequest = async () => {
      return await Endereco.findAll({
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        ],
      });
    };
    
    await controller.handleRequest(req, res);
  }

  // GET /api/enderecos/:id - usando Template Method
  static async getById(req: Request, res: Response) {
    const controller = new EnderecoController();
    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const endereco = await Endereco.findByPk(id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        ],
      });

      if (!endereco) {
        const error = new Error('Endereço não encontrado');
        (error as any).status = 404;
        throw error;
      }

      return endereco;
    };

    await controller.handleRequest(req, res);
  }

  // POST /api/enderecos - usando Template Method
  static async create(req: Request, res: Response) {
    const controller = new EnderecoController();

    controller.validateRequest = (req: Request): boolean => {
      const errors = validationResult(req);
      return errors.isEmpty();
    };

    controller.processRequest = async (req: Request) => {
      const endereco = await Endereco.create(req.body);
      const enderecoCompleto = await Endereco.findByPk(endereco.id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        ],
      });
      return enderecoCompleto;
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      const errors = validationResult(req);
      res.status(400).json({ errors: errors.array() });
    };

    await controller.handleRequest(req, res);
  }

  // PUT /api/enderecos/:id - usando Template Method
  static async update(req: Request, res: Response) {
    const controller = new EnderecoController();

    controller.validateRequest = (req: Request): boolean => {
      const errors = validationResult(req);
      return errors.isEmpty();
    };

    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const [updated] = await Endereco.update(req.body, {
        where: { id },
      });

      if (updated === 0) {
        const error = new Error('Endereço não encontrado');
        (error as any).status = 404;
        throw error;
      }

      const endereco = await Endereco.findByPk(id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        ],
      });
      return endereco;
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      const errors = validationResult(req);
      res.status(400).json({ errors: errors.array() });
    };

    await controller.handleRequest(req, res);
  }

  // DELETE /api/enderecos/:id - usando Template Method
  static async delete(req: Request, res: Response) {
    const controller = new EnderecoController();

    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const deleted = await Endereco.destroy({
        where: { id },
      });

      if (deleted === 0) {
        const error = new Error('Endereço não encontrado');
        (error as any).status = 404;
        throw error;
      }

      return { message: 'Endereço deletado com sucesso' };
    };

    controller.formatResponse = (result: any): any => {
      return {
        success: true,
        message: result.message
      };
    };

    await controller.handleRequest(req, res);
  }

  // GET /api/enderecos/usuario/:usuarioId - usando Template Method
  static async getByUsuario(req: Request, res: Response) {
    const controller = new EnderecoController();

    controller.processRequest = async (req: Request) => {
      const { usuarioId } = req.params;
      const usuario = await Usuario.findByPk(usuarioId);

      if (!usuario) {
        const error = new Error('Usuário não encontrado');
        (error as any).status = 404;
        throw error;
      }

      const enderecos = await Endereco.findAll({
        where: { fk_usuario_id: usuarioId },
        order: [['favorito', 'DESC'], ['id', 'ASC']],
      });

      return enderecos;
    };

    await controller.handleRequest(req, res);
  }

  // PUT /api/enderecos/:id/favorito - usando Template Method
  static async setFavorito(req: Request, res: Response) {
    const controller = new EnderecoController();

    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const endereco = await Endereco.findByPk(id);

      if (!endereco) {
        const error = new Error('Endereço não encontrado');
        (error as any).status = 404;
        throw error;
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
      return enderecoAtualizado;
    };

    await controller.handleRequest(req, res);
  }

  // Sobrescrever tratamento de erro para casos específicos
  protected handleError(error: any, req: Request, res: Response): void {
    if (error.status === 404) {
      res.status(404).json({ 
        success: false, 
        error: error.message 
      });
      return;
    }

    // Usar o tratamento padrão para outros erros
    super.handleError(error, req, res);
  }

  // Implementação obrigatória do método abstrato (não usada nos métodos estáticos)
  protected async processRequest(req: Request, res: Response): Promise<any> {
    throw new Error('Este método deve ser sobrescrito em tempo de execução');
  }
}