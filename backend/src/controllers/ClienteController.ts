import { Request, Response } from 'express';
import Cliente from '../models/Cliente';
import bcrypt from 'bcryptjs';
import Joi from 'joi';

// Schema de validação para criação de cliente
const clienteSchema = Joi.object({
  nome: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Nome deve ter pelo menos 2 caracteres',
    'string.max': 'Nome deve ter no máximo 255 caracteres',
    'any.required': 'Nome é obrigatório'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ser válido',
    'any.required': 'Email é obrigatório'
  }),
  senha: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter pelo menos 6 caracteres',
    'any.required': 'Senha é obrigatória'
  }),
  telefone: Joi.string().pattern(/^[\(\)\s\-\+\d]+$/).optional().messages({
    'string.pattern.base': 'Telefone deve conter apenas números, espaços, parênteses, traços e sinal de mais'
  })
});

// Schema de validação para atualização de cliente
const clienteUpdateSchema = Joi.object({
  nome: Joi.string().min(2).max(255).optional(),
  email: Joi.string().email().optional(),
  telefone: Joi.string().pattern(/^[\(\)\s\-\+\d]+$/).optional(),
  isVip: Joi.boolean().optional(),
  isBlocked: Joi.boolean().optional()
});

class ClienteController {
  // GET /clientes - Listar todos os clientes
  async index(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search as string;

      const whereClause: any = {};
      
      if (search) {
        whereClause[Symbol.for('sequelize.or')] = [
          { nome: { [Symbol.for('sequelize.iLike')]: `%${search}%` } },
          { email: { [Symbol.for('sequelize.iLike')]: `%${search}%` } }
        ];
      }

      const { rows: clientes, count: total } = await Cliente.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['senha'] } // Não retorna a senha
      });

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: clientes,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // GET /clientes/:id - Buscar cliente por ID
  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const cliente = await Cliente.findByPk(id, {
        attributes: { exclude: ['senha'] }
      });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }

      res.json({
        success: true,
        data: cliente
      });
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // POST /clientes - Criar novo cliente
  async store(req: Request, res: Response) {
    try {
      // Validação dos dados
      const { error, value } = clienteSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Verificar se email já existe
      const clienteExistente = await Cliente.findOne({
        where: { email: value.email }
      });

      if (clienteExistente) {
        return res.status(409).json({
          success: false,
          message: 'Email já está em uso'
        });
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(value.senha, 12);

      // Criar cliente
      const cliente = await Cliente.create({
        ...value,
        senha: senhaHash
      });

      // Retornar cliente sem a senha
      const clienteResponse = {
        ...cliente.toJSON(),
        senha: undefined
      };

      res.status(201).json({
        success: true,
        message: 'Cliente criado com sucesso',
        data: clienteResponse
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // PUT /clientes/:id - Atualizar cliente
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Validação dos dados
      const { error, value } = clienteUpdateSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Verificar se cliente existe
      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }

      // Verificar se email já existe (se foi fornecido)
      if (value.email) {
        const clienteComEmail = await Cliente.findOne({
          where: { email: value.email }
        });

        if (clienteComEmail && clienteComEmail.id !== parseInt(id)) {
          return res.status(409).json({
            success: false,
            message: 'Email já está em uso'
          });
        }
      }

      // Atualizar cliente
      await cliente.update(value);

      // Retornar cliente atualizado sem a senha
      const clienteAtualizado = await Cliente.findByPk(id, {
        attributes: { exclude: ['senha'] }
      });

      res.json({
        success: true,
        message: 'Cliente atualizado com sucesso',
        data: clienteAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // DELETE /clientes/:id - Excluir cliente
  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }

      await cliente.destroy();

      res.json({
        success: true,
        message: 'Cliente excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}

export default new ClienteController();