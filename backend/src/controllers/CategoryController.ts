import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Joi from 'joi';
import { Category } from '../models/Category';

// Validation schemas
const createCategorySchema = Joi.object({
  nome: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Nome deve ter pelo menos 2 caracteres',
    'string.max': 'Nome deve ter no máximo 100 caracteres',
    'any.required': 'Nome é obrigatório'
  }),
  descricao: Joi.string().optional(),
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).max(120).required().messages({
    'string.pattern.base': 'Slug deve conter apenas letras minúsculas, números e hífens',
    'string.max': 'Slug deve ter no máximo 120 caracteres',
    'any.required': 'Slug é obrigatório'
  }),
  imagem: Joi.string().max(500).optional(),
  icone: Joi.string().max(100).optional(),
  cor: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional().messages({
    'string.pattern.base': 'Cor deve estar no formato hexadecimal (#RRGGBB)'
  }),
  parentId: Joi.number().integer().positive().optional(),
  ordem: Joi.number().integer().min(0).optional(),
  ativo: Joi.boolean().optional(),
  destaque: Joi.boolean().optional()
});

const updateCategorySchema = createCategorySchema.fork(
  ['nome', 'slug'],
  (schema) => schema.optional()
);

export class CategoryController {
  // GET /api/categorias
  static async list(req: Request, res: Response) {
    try {
      const {
        page = '1',
        limit = '10',
        search = '',
        parentId = '',
        ativo = '',
        destaque = '',
        sortBy = 'ordem',
        sortOrder = 'ASC'
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      // Build where conditions
      const whereConditions: any = {};

      if (search) {
        whereConditions[Op.or] = [
          { nome: { [Op.like]: `%${search}%` } },
          { descricao: { [Op.like]: `%${search}%` } }
        ];
      }

      if (parentId !== '') {
        if (parentId === 'null') {
          whereConditions.parentId = null;
        } else {
          whereConditions.parentId = parseInt(parentId as string);
        }
      }

      if (ativo !== '') {
        whereConditions.ativo = ativo === 'true';
      }

      if (destaque !== '') {
        whereConditions.destaque = destaque === 'true';
      }

      const { count, rows } = await Category.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: Category,
            as: 'subcategorias',
            where: { ativo: true },
            required: false
          },
          {
            model: Category,
            as: 'categoriaPai',
            required: false
          }
        ],
        order: [[sortBy as string, sortOrder as string]],
        limit: limitNum,
        offset
      });

      const totalPages = Math.ceil(count / limitNum);

      res.status(200).json({
        success: true,
        message: 'Categorias obtidas com sucesso',
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
      console.error('Erro ao listar categorias:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // GET /api/categorias/tree
  static async getTree(req: Request, res: Response) {
    try {
      const categories = await Category.findAll({
        where: { ativo: true },
        include: [
          {
            model: Category,
            as: 'subcategorias',
            where: { ativo: true },
            required: false
          }
        ],
        order: [['ordem', 'ASC'], [{ model: Category, as: 'subcategorias' }, 'ordem', 'ASC']]
      });

      // Filter only root categories (parentId is null)
      const rootCategories = categories.filter(cat => cat.parentId === null);

      res.status(200).json({
        success: true,
        message: 'Árvore de categorias obtida com sucesso',
        data: rootCategories
      });

    } catch (error) {
      console.error('Erro ao buscar árvore de categorias:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // GET /api/categorias/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const category = await Category.findByPk(id, {
        include: [
          {
            model: Category,
            as: 'subcategorias',
            where: { ativo: true },
            required: false
          },
          {
            model: Category,
            as: 'categoriaPai',
            required: false
          }
        ]
      });
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Categoria obtida com sucesso',
        data: category
      });

    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // GET /api/categorias/slug/:slug
  static async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      
      const category = await Category.findOne({
        where: { slug },
        include: [
          {
            model: Category,
            as: 'subcategorias',
            where: { ativo: true },
            required: false
          },
          {
            model: Category,
            as: 'categoriaPai',
            required: false
          }
        ]
      });
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Categoria obtida com sucesso',
        data: category
      });

    } catch (error) {
      console.error('Erro ao buscar categoria por slug:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // POST /api/categorias
  static async create(req: Request, res: Response) {
    try {
      // Validate input
      const { error, value } = createCategorySchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Check if parentId exists (if provided)
      if (value.parentId) {
        const parentCategory = await Category.findByPk(value.parentId);
        if (!parentCategory) {
          return res.status(400).json({
            success: false,
            message: 'Categoria pai não encontrada'
          });
        }
      }

      const category = await Category.create(value);

      res.status(201).json({
        success: true,
        message: 'Categoria criada com sucesso',
        data: category
      });

    } catch (error: any) {
      console.error('Erro ao criar categoria:', error);

      // Handle unique constraint errors
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'Slug já existe'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // PUT /api/categorias/:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Validate input
      const { error, value } = updateCategorySchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      // Check if parentId exists (if provided)
      if (value.parentId) {
        if (value.parentId === parseInt(id)) {
          return res.status(400).json({
            success: false,
            message: 'Uma categoria não pode ser pai de si mesma'
          });
        }

        const parentCategory = await Category.findByPk(value.parentId);
        if (!parentCategory) {
          return res.status(400).json({
            success: false,
            message: 'Categoria pai não encontrada'
          });
        }
      }

      await category.update(value);

      res.status(200).json({
        success: true,
        message: 'Categoria atualizada com sucesso',
        data: category
      });

    } catch (error: any) {
      console.error('Erro ao atualizar categoria:', error);

      // Handle unique constraint errors
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'Slug já existe'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // DELETE /api/categorias/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      // Check if category has subcategories
      const subcategoriesCount = await Category.count({
        where: { parentId: id }
      });

      if (subcategoriesCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível excluir categoria que possui subcategorias'
        });
      }

      await category.destroy();

      res.status(200).json({
        success: true,
        message: 'Categoria excluída com sucesso'
      });

    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}