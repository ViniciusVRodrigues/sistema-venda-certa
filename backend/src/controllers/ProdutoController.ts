import { Request, Response } from 'express';
import { Produto, Categoria, AvaliacaoProduto, Usuario } from '../models';
import { AbstractController } from './AbstractController';
import { ProdutoDataProcessor } from '../utils/DataProcessor';
import { ProductSearchEngine, SearchStrategyFactory } from '../utils/SearchStrategy';

export class ProdutoController extends AbstractController {
  private dataProcessor = new ProdutoDataProcessor();

  // GET /api/produtos - usando Template Method
  static async getAll(req: Request, res: Response) {
    const controller = new ProdutoController();
    controller.processRequest = async () => {
      return await Produto.findAll({
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
    };
    
    await controller.handleRequest(req, res);
  }

  // GET /api/produtos/:id - usando Template Method
  static async getById(req: Request, res: Response) {
    const controller = new ProdutoController();
    controller.processRequest = async (req: Request) => {
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
        const error = new Error('Produto não encontrado');
        (error as any).status = 404;
        throw error;
      }

      return produto;
    };
    
    await controller.handleRequest(req, res);
  }

  // POST /api/produtos - usando Template Method com processamento de dados
  static async create(req: Request, res: Response) {
    const controller = new ProdutoController();
    
    controller.validateRequest = (req: Request): boolean => {
      return !!(req.body.nome && req.body.preco && req.body.fk_categoria_id);
    };

    controller.processRequest = async (req: Request) => {
      // Usar DataProcessor para processar os dados
      const processedData = controller.dataProcessor.processData(req.body);
      const produto = await Produto.create(processedData.data);
      return produto;
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      res.status(400).json({ 
        error: 'Dados inválidos. Nome, preço e categoria são obrigatórios.' 
      });
    };
    
    await controller.handleRequest(req, res);
  }

  // PUT /api/produtos/:id - usando Template Method
  static async update(req: Request, res: Response) {
    const controller = new ProdutoController();
    
    controller.validateRequest = (req: Request): boolean => {
      const { id } = req.params;
      return !!(id && req.body && Object.keys(req.body).length > 0);
    };

    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      
      // Usar DataProcessor para processar os dados
      const processedData = controller.dataProcessor.processData(req.body);
      
      const [updated] = await Produto.update(processedData.data, {
        where: { id },
      });

      if (updated === 0) {
        const error = new Error('Produto não encontrado');
        (error as any).status = 404;
        throw error;
      }

      const produto = await Produto.findByPk(id, {
        include: [{ model: Categoria, as: 'categoria' }],
      });
      
      return produto;
    };
    
    await controller.handleRequest(req, res);
  }

  // DELETE /api/produtos/:id - usando Template Method
  static async delete(req: Request, res: Response) {
    const controller = new ProdutoController();
    
    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const deleted = await Produto.destroy({
        where: { id },
      });

      if (deleted === 0) {
        const error = new Error('Produto não encontrado');
        (error as any).status = 404;
        throw error;
      }

      return { message: 'Produto deletado com sucesso' };
    };

    controller.formatResponse = (result: any): any => {
      return {
        success: true,
        message: result.message
      };
    };
    
    await controller.handleRequest(req, res);
  }

  // GET /api/produtos/categoria/:categoriaId - usando Template Method
  static async getByCategoria(req: Request, res: Response) {
    const controller = new ProdutoController();
    
    controller.processRequest = async (req: Request) => {
      const { categoriaId } = req.params;
      return await Produto.findAll({
        where: { fk_categoria_id: categoriaId },
        include: [{ model: Categoria, as: 'categoria' }],
      });
    };
    
    await controller.handleRequest(req, res);
  }

  // GET /api/produtos/search - usando Strategy Pattern para busca
  static async search(req: Request, res: Response) {
    const controller = new ProdutoController();
    
    controller.validateRequest = (req: Request): boolean => {
      return !!(req.query.q && typeof req.query.q === 'string');
    };

    controller.processRequest = async (req: Request) => {
      const { q: query, type = 'simple', limit = 20, offset = 0 } = req.query as any;
      
      // Usar Strategy Pattern para busca
      const searchStrategy = SearchStrategyFactory.createStrategy(type);
      const searchEngine = new ProductSearchEngine(searchStrategy);
      
      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        filters: controller.extractFilters(req.query)
      };

      const result = await searchEngine.search(query, options);
      
      return result;
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      res.status(400).json({ 
        error: 'Parâmetro de busca (q) é obrigatório' 
      });
    };
    
    await controller.handleRequest(req, res);
  }

  // GET /api/produtos/:id/avaliacoes - usando Template Method
  static async getAvaliacoes(req: Request, res: Response) {
    const controller = new ProdutoController();
    
    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const produto = await Produto.findByPk(id);

      if (!produto) {
        const error = new Error('Produto não encontrado');
        (error as any).status = 404;
        throw error;
      }

      return await AvaliacaoProduto.findAll({
        where: { fk_produto_id: id },
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }
        ],
      });
    };
    
    await controller.handleRequest(req, res);
  }

  // Método auxiliar para extrair filtros da query
  private extractFilters(query: any): any {
    const filters: any = {};
    
    if (query.categoria_id) {
      filters.fk_categoria_id = query.categoria_id;
    }
    
    if (query.status) {
      filters.status = query.status;
    }
    
    if (query.preco_min || query.preco_max) {
      filters.preco = {};
      if (query.preco_min) filters.preco.gte = parseFloat(query.preco_min);
      if (query.preco_max) filters.preco.lte = parseFloat(query.preco_max);
    }
    
    return filters;
  }

  // Sobrescrever tratamento de erro para casos específicos
  protected handleError(error: any, req: Request, res: Response): void {
    if (error.name === 'SequelizeUniqueConstraintError') {
      this.logger.warn('Tentativa de criar produto com SKU duplicado');
      res.status(400).json({ 
        success: false, 
        error: 'SKU já está em uso' 
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
