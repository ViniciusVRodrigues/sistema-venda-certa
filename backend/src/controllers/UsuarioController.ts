import { Request, Response } from 'express';
import { Usuario, Endereco } from '../models';
import { validationResult } from 'express-validator';
import { AbstractController } from './AbstractController';

export class UsuarioController extends AbstractController {
  // GET /api/usuarios - usando Template Method
  static async getAll(req: Request, res: Response) {
    const controller = new UsuarioController();
    controller.processRequest = async () => {
      return await Usuario.findAll({
        include: [
          { model: Endereco, as: 'enderecos' },
        ],
      });
    };
    
    await controller.handleRequest(req, res);
  }

  // GET /api/usuarios/:id - usando Template Method
  static async getById(req: Request, res: Response) {
    const controller = new UsuarioController();
    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, {
        include: [
          { model: Endereco, as: 'enderecos' },
        ],
      });

      if (!usuario) {
        const error = new Error('Usuário não encontrado');
        (error as any).status = 404;
        throw error;
      }

      return usuario;
    };

    await controller.handleRequest(req, res);
  }

  // POST /api/usuarios - usando Template Method
  static async create(req: Request, res: Response) {
    const controller = new UsuarioController();

    controller.validateRequest = (req: Request): boolean => {
      const errors = validationResult(req);
      return errors.isEmpty();
    };

    controller.processRequest = async (req: Request) => {
      return await Usuario.create(req.body);
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      const errors = validationResult(req);
      res.status(400).json({ errors: errors.array() });
    };

    await controller.handleRequest(req, res);
  }

  // PUT /api/usuarios/:id - usando Template Method
  static async update(req: Request, res: Response) {
    const controller = new UsuarioController();

    controller.validateRequest = (req: Request): boolean => {
      const errors = validationResult(req);
      return errors.isEmpty();
    };

    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const [updated] = await Usuario.update(req.body, {
        where: { id },
      });

      if (updated === 0) {
        const error = new Error('Usuário não encontrado');
        (error as any).status = 404;
        throw error;
      }

      const usuario = await Usuario.findByPk(id);
      return usuario;
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      const errors = validationResult(req);
      res.status(400).json({ errors: errors.array() });
    };

    await controller.handleRequest(req, res);
  }

  // DELETE /api/usuarios/:id - usando Template Method
  static async delete(req: Request, res: Response) {
    const controller = new UsuarioController();

    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const deleted = await Usuario.destroy({
        where: { id },
      });

      if (deleted === 0) {
        const error = new Error('Usuário não encontrado');
        (error as any).status = 404;
        throw error;
      }

      return { message: 'Usuário deletado com sucesso' };
    };

    controller.formatResponse = (result: any): any => {
      return {
        success: true,
        message: result.message
      };
    };

    await controller.handleRequest(req, res);
  }

  // GET /api/usuarios/:id/enderecos - usando Template Method
  static async getEnderecos(req: Request, res: Response) {
    const controller = new UsuarioController();

    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        const error = new Error('Usuário não encontrado');
        (error as any).status = 404;
        throw error;
      }

      const enderecos = await Endereco.findAll({
        where: { fk_usuario_id: id },
      });

      return enderecos;
    };

    await controller.handleRequest(req, res);
  }

  // Sobrescrever tratamento de erro para casos específicos
  protected handleError(error: any, req: Request, res: Response): void {
    if (error.name === 'SequelizeUniqueConstraintError') {
      this.logger.warn('Tentativa de criar usuário com email duplicado');
      res.status(400).json({ 
        success: false, 
        error: 'Email já está em uso' 
      });
      return;
    }

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