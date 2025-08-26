import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import Cliente from '../models/Cliente';
import { generateToken } from '../middleware/auth';

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ter um formato válido',
    'any.required': 'Email é obrigatório'
  }),
  senha: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter pelo menos 6 caracteres',
    'any.required': 'Senha é obrigatória'
  })
});

export class AuthController {
  // POST /api/auth/login
  static async login(req: Request, res: Response) {
    try {
      // Validate input
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const { email, senha } = value;

      // Find user by email
      const user = await Cliente.findOne({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha incorretos'
        });
      }

      // Check if user is blocked
      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: 'Usuário bloqueado. Entre em contato com o suporte.'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha incorretos'
        });
      }

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email
      });

      // Return user data (without password) and token
      const userData = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        avatar: user.avatar,
        isVip: user.isVip,
        totalPedidos: user.totalPedidos,
        totalGasto: user.totalGasto,
        ultimoPedidoData: user.ultimoPedidoData,
        createdAt: user.createdAt
      };

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: userData,
          token,
          expiresIn: '24h'
        }
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // POST /api/auth/logout
  static async logout(req: Request, res: Response) {
    try {
      // In a JWT-based system, logout is typically handled on the client side
      // by removing the token from storage. However, we can log this action.
      
      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso'
      });

    } catch (error) {
      console.error('Erro no logout:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // GET /api/auth/me
  static async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      const user = await Cliente.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Return user data (without password)
      const userData = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        avatar: user.avatar,
        isVip: user.isVip,
        isBlocked: user.isBlocked,
        totalPedidos: user.totalPedidos,
        totalGasto: user.totalGasto,
        ultimoPedidoData: user.ultimoPedidoData,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.status(200).json({
        success: true,
        message: 'Perfil obtido com sucesso',
        data: userData
      });

    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}