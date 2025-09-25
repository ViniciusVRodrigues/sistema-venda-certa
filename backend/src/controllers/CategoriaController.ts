import { Request, Response } from 'express';
import { Categoria, Produto } from '../models';
import { validationResult } from 'express-validator';
import { AbstractController } from './AbstractController';

export class CategoriaController extends AbstractController {
  // GET /api/categorias - usando Template Method
  static async getAll(req: Request, res: Response) {
    const controller = new CategoriaController();
    controller.processRequest = async () => {
      return await Categoria.findAll({
        include: [
          { 
            model: Produto, 
            as: 'produtos',
            attributes: ['id', 'nome', 'preco', 'estoque', 'status']
          },
        ],
      });
    };
    
    await controller.handleRequest(req, res);
  }

  // GET /api/categorias/:id - usando Template Method
  static async getById(req: Request, res: Response) {
    const controller = new CategoriaController();
    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const categoria = await Categoria.findByPk(id, {
        include: [
          { model: Produto, as: 'produtos' },
        ],
      });

      if (!categoria) {
        const error = new Error('Categoria não encontrada');
        (error as any).status = 404;
        throw error;
      }

      return categoria;
    };

    await controller.handleRequest(req, res);
  }

  // POST /api/categorias - usando Template Method
  static async create(req: Request, res: Response) {
    const controller = new CategoriaController();

    controller.validateRequest = (req: Request): boolean => {
      const errors = validationResult(req);
      return errors.isEmpty();
    };

    controller.processRequest = async (req: Request) => {
      return await Categoria.create(req.body);
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      const errors = validationResult(req);
      res.status(400).json({ errors: errors.array() });
    };

    await controller.handleRequest(req, res);
  }

  // PUT /api/categorias/:id - usando Template Method
  static async update(req: Request, res: Response) {
    const controller = new CategoriaController();

    controller.validateRequest = (req: Request): boolean => {
      const errors = validationResult(req);
      return errors.isEmpty();
    };

    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const [updated] = await Categoria.update(req.body, {
        where: { id },
      });

      if (updated === 0) {
        const error = new Error('Categoria não encontrada');
        (error as any).status = 404;
        throw error;
      }

      const categoria = await Categoria.findByPk(id);
      return categoria;
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      const errors = validationResult(req);
      res.status(400).json({ errors: errors.array() });
    };

    await controller.handleRequest(req, res);
  }

  // DELETE /api/categorias/:id - usando Template Method
  static async delete(req: Request, res: Response) {
    const controller = new CategoriaController();

    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      
      // Check if category has products
      const produtosCount = await Produto.count({
        where: { fk_categoria_id: id },
      });

      if (produtosCount > 0) {
        const error = new Error('Não é possível deletar categoria que possui produtos associados');
        (error as any).status = 400;
        throw error;
      }

      const deleted = await Categoria.destroy({
        where: { id },
      });

      if (deleted === 0) {
        const error = new Error('Categoria não encontrada');
        (error as any).status = 404;
        throw error;
      }

      return { message: 'Categoria deletada com sucesso' };
    };

    controller.formatResponse = (result: any): any => {
      return {
        success: true,
        message: result.message
      };
    };

    await controller.handleRequest(req, res);
  }

  // GET /api/categorias/ativas - usando Template Method
  static async getAtivas(req: Request, res: Response) {
    const controller = new CategoriaController();

    controller.processRequest = async () => {
      return await Categoria.findAll({
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

    if (error.status === 400) {
      res.status(400).json({ 
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