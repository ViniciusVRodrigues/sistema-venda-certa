import { Request, Response } from 'express';
import { MetodoEntrega } from '../models';
import { validationResult } from 'express-validator';
import { AbstractController } from './AbstractController';

export class MetodoEntregaController extends AbstractController {
  // GET /api/metodos-entrega - usando Template Method
  static async getAll(req: Request, res: Response) {
    const controller = new MetodoEntregaController();
    controller.processRequest = async () => {
      return await MetodoEntrega.findAll({
        order: [['nome', 'ASC']],
      });
    };
    
    await controller.handleRequest(req, res);
  }

  // GET /api/metodos-entrega/:id - usando Template Method
  static async getById(req: Request, res: Response) {
    const controller = new MetodoEntregaController();
    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const metodoEntrega = await MetodoEntrega.findByPk(id);

      if (!metodoEntrega) {
        const error = new Error('Método de entrega não encontrado');
        (error as any).status = 404;
        throw error;
      }

      return metodoEntrega;
    };

    await controller.handleRequest(req, res);
  }

  // POST /api/metodos-entrega - usando Template Method
  static async create(req: Request, res: Response) {
    const controller = new MetodoEntregaController();

    controller.validateRequest = (req: Request): boolean => {
      const errors = validationResult(req);
      return errors.isEmpty();
    };

    controller.processRequest = async (req: Request) => {
      return await MetodoEntrega.create(req.body);
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      const errors = validationResult(req);
      res.status(400).json({ errors: errors.array() });
    };

    await controller.handleRequest(req, res);
  }

  // PUT /api/metodos-entrega/:id - usando Template Method
  static async update(req: Request, res: Response) {
    const controller = new MetodoEntregaController();

    controller.validateRequest = (req: Request): boolean => {
      const errors = validationResult(req);
      return errors.isEmpty();
    };

    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const [updated] = await MetodoEntrega.update(req.body, {
        where: { id },
      });

      if (updated === 0) {
        const error = new Error('Método de entrega não encontrado');
        (error as any).status = 404;
        throw error;
      }

      const metodoEntrega = await MetodoEntrega.findByPk(id);
      return metodoEntrega;
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      const errors = validationResult(req);
      res.status(400).json({ errors: errors.array() });
    };

    await controller.handleRequest(req, res);
  }

  // DELETE /api/metodos-entrega/:id - usando Template Method
  static async delete(req: Request, res: Response) {
    const controller = new MetodoEntregaController();

    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const deleted = await MetodoEntrega.destroy({
        where: { id },
      });

      if (deleted === 0) {
        const error = new Error('Método de entrega não encontrado');
        (error as any).status = 404;
        throw error;
      }

      return { message: 'Método de entrega deletado com sucesso' };
    };

    controller.formatResponse = (result: any): any => {
      return {
        success: true,
        message: result.message
      };
    };

    await controller.handleRequest(req, res);
  }

  // GET /api/metodos-entrega/ativos - usando Template Method
  static async getAtivos(req: Request, res: Response) {
    const controller = new MetodoEntregaController();

    controller.processRequest = async () => {
      return await MetodoEntrega.findAll({
        where: { status: 1 },
        order: [['preco', 'ASC']],
      });
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