import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Joi from 'joi';
import { Product } from '../models/Product';

// Validation schemas
const createProductSchema = Joi.object({
  nome: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Nome deve ter pelo menos 2 caracteres',
    'string.max': 'Nome deve ter no máximo 255 caracteres',
    'any.required': 'Nome é obrigatório'
  }),
  descricao: Joi.string().optional(),
  preco: Joi.number().positive().required().messages({
    'number.positive': 'Preço deve ser maior que zero',
    'any.required': 'Preço é obrigatório'
  }),
  precoPromocional: Joi.number().positive().optional(),
  categoria: Joi.string().max(100).optional(),
  marca: Joi.string().max(100).optional(),
  sku: Joi.string().max(100).optional(),
  codigoBarras: Joi.string().max(50).optional(),
  estoque: Joi.number().integer().min(0).required().messages({
    'number.min': 'Estoque não pode ser negativo',
    'any.required': 'Estoque é obrigatório'
  }),
  estoqueMinimo: Joi.number().integer().min(0).optional(),
  imagemPrincipal: Joi.string().max(500).optional(),
  imagens: Joi.string().optional(),
  peso: Joi.number().positive().optional(),
  dimensoes: Joi.string().max(100).optional(),
  ativo: Joi.boolean().optional(),
  destaque: Joi.boolean().optional(),
  tags: Joi.string().optional()
});

const updateProductSchema = createProductSchema.fork(
  ['nome', 'preco', 'estoque'],
  (schema) => schema.optional()
);

export class ProductController {
  // GET /api/produtos
  static async list(req: Request, res: Response) {
    try {
      const {
        page = '1',
        limit = '10',
        search = '',
        categoria = '',
        marca = '',
        ativo = '',
        destaque = '',
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      // Build where conditions
      const whereConditions: any = {};

      if (search) {
        whereConditions[Op.or] = [
          { nome: { [Op.like]: `%${search}%` } },
          { descricao: { [Op.like]: `%${search}%` } },
          { marca: { [Op.like]: `%${search}%` } },
          { tags: { [Op.like]: `%${search}%` } }
        ];
      }

      if (categoria) {
        whereConditions.categoria = { [Op.like]: `%${categoria}%` };
      }

      if (marca) {
        whereConditions.marca = { [Op.like]: `%${marca}%` };
      }

      if (ativo !== '') {
        whereConditions.ativo = ativo === 'true';
      }

      if (destaque !== '') {
        whereConditions.destaque = destaque === 'true';
      }

      const { count, rows } = await Product.findAndCountAll({
        where: whereConditions,
        order: [[sortBy as string, sortOrder as string]],
        limit: limitNum,
        offset
      });

      const totalPages = Math.ceil(count / limitNum);

      res.status(200).json({
        success: true,
        message: 'Produtos obtidos com sucesso',
        data: rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: count,
          itemsPerPage: limitNum,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      });

    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // GET /api/produtos/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const product = await Product.findByPk(id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Produto obtido com sucesso',
        data: product
      });

    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // POST /api/produtos
  static async create(req: Request, res: Response) {
    try {
      // Validate input
      const { error, value } = createProductSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Generate SKU if not provided
      if (!value.sku) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        value.sku = `PRD-${timestamp}-${random}`.toUpperCase();
      }

      const product = await Product.create(value);

      res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso',
        data: product
      });

    } catch (error: any) {
      console.error('Erro ao criar produto:', error);

      // Handle unique constraint errors
      if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0]?.path;
        return res.status(409).json({
          success: false,
          message: `${field === 'sku' ? 'SKU' : 'Código de barras'} já existe`
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // PUT /api/produtos/:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Validate input
      const { error, value } = updateProductSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      await product.update(value);

      res.status(200).json({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: product
      });

    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);

      // Handle unique constraint errors
      if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0]?.path;
        return res.status(409).json({
          success: false,
          message: `${field === 'sku' ? 'SKU' : 'Código de barras'} já existe`
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // DELETE /api/produtos/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      await product.destroy();

      res.status(200).json({
        success: true,
        message: 'Produto excluído com sucesso'
      });

    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // GET /api/produtos/categorias
  static async getCategories(req: Request, res: Response) {
    try {
      const products = await Product.findAll({
        attributes: ['categoria'],
        where: {
          ativo: true
        },
        group: ['categoria'],
        order: [['categoria', 'ASC']]
      });

      const categoryList = products
        .map(p => p.categoria)
        .filter(cat => cat !== null && cat !== undefined && cat !== '');

      res.status(200).json({
        success: true,
        message: 'Categorias obtidas com sucesso',
        data: categoryList
      });

    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // GET /api/produtos/marcas
  static async getBrands(req: Request, res: Response) {
    try {
      const products = await Product.findAll({
        attributes: ['marca'],
        where: {
          ativo: true
        },
        group: ['marca'],
        order: [['marca', 'ASC']]
      });

      const brandList = products
        .map(p => p.marca)
        .filter(brand => brand !== null && brand !== undefined && brand !== '');

      res.status(200).json({
        success: true,
        message: 'Marcas obtidas com sucesso',
        data: brandList
      });

    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}