import { Request, Response } from 'express';
import { Usuario } from '../models';
import { validationResult } from 'express-validator';
import { AbstractController } from './AbstractController';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  body: {
    email: string;
    senha: string;
  };
}

interface RegisterRequest extends Request {
  body: {
    nome: string;
    email: string;
    senha: string;
    cargo: string;
    numeroCelular?: string;
  };
}

export class AuthController extends AbstractController {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

  // POST /api/auth/login - usando Template Method
  static async login(req: Request, res: Response) {
    const controller = new AuthController();

    controller.validateRequest = (req: Request): boolean => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return false;
      
      const { email, senha } = (req as AuthRequest).body;
      return !!(email && senha);
    };

    controller.processRequest = async (req: Request) => {
      const { email, senha } = (req as AuthRequest).body;
      
      // Buscar usuário pelo email
      const usuario = await Usuario.findOne({ where: { email } });
      
      if (!usuario) {
        const error = new Error('Email ou senha inválidos');
        (error as any).status = 401;
        throw error;
      }

      // Verificar se o usuário está ativo
      if (usuario.status !== 1) {
        const error = new Error('Usuário inativo');
        (error as any).status = 401;
        throw error;
      }

      // Verificar senha (assumindo que a senha está hasheada)
      const senhaValida = await bcrypt.compare(senha, (usuario as any).senha);
      
      if (!senhaValida) {
        const error = new Error('Email ou senha inválidos');
        (error as any).status = 401;
        throw error;
      }

      // Gerar token JWT
      const payload = { 
        id: usuario.id, 
        email: usuario.email, 
        cargo: usuario.cargo 
      };
      
      const token = jwt.sign(payload, AuthController.JWT_SECRET, { 
        expiresIn: AuthController.JWT_EXPIRES_IN 
      } as jwt.SignOptions);

      return {
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          cargo: usuario.cargo,
          numeroCelular: usuario.numeroCelular,
          status: usuario.status
        }
      };
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ 
          success: false,
          error: 'Dados inválidos',
          details: errors.array() 
        });
      } else {
        res.status(400).json({ 
          success: false,
          error: 'Email e senha são obrigatórios' 
        });
      }
    };

    controller.formatResponse = (result: any): any => {
      return {
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      };
    };

    await controller.handleRequest(req, res);
  }

  // POST /api/auth/register - usando Template Method
  static async register(req: Request, res: Response) {
    const controller = new AuthController();

    controller.validateRequest = (req: Request): boolean => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return false;
      
      const { nome, email, senha, cargo } = (req as RegisterRequest).body;
      return !!(nome && email && senha && cargo);
    };

    controller.processRequest = async (req: Request) => {
      const { nome, email, senha, cargo, numeroCelular } = (req as RegisterRequest).body;
      
      // Verificar se o email já está em uso
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      
      if (usuarioExistente) {
        const error = new Error('Email já está em uso');
        (error as any).status = 409;
        throw error;
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // Criar usuário
      const novoUsuario = await Usuario.create({
        nome,
        email,
        senha: senhaHash,
        cargo,
        numeroCelular,
        status: 1,
        totalPedidos: 0,
        totalGasto: 0,
        entregasFeitas: 0
      } as any);

      // Gerar token JWT
      const payload = { 
        id: novoUsuario.id, 
        email: novoUsuario.email, 
        cargo: novoUsuario.cargo 
      };
      
      const token = jwt.sign(payload, AuthController.JWT_SECRET, { 
        expiresIn: AuthController.JWT_EXPIRES_IN 
      } as jwt.SignOptions);

      return {
        token,
        usuario: {
          id: novoUsuario.id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          cargo: novoUsuario.cargo,
          numeroCelular: novoUsuario.numeroCelular,
          status: novoUsuario.status
        }
      };
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ 
          success: false,
          error: 'Dados inválidos',
          details: errors.array() 
        });
      } else {
        res.status(400).json({ 
          success: false,
          error: 'Nome, email, senha e cargo são obrigatórios' 
        });
      }
    };

    controller.formatResponse = (result: any): any => {
      return {
        success: true,
        message: 'Usuário registrado com sucesso',
        data: result
      };
    };

    await controller.handleRequest(req, res);
  }

  // POST /api/auth/verify-token - usando Template Method
  static async verifyToken(req: Request, res: Response) {
    const controller = new AuthController();

    controller.validateRequest = (req: Request): boolean => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      return !!token;
    };

    controller.processRequest = async (req: Request) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      try {
        const decoded = jwt.verify(token!, AuthController.JWT_SECRET) as any;
        
        // Buscar usuário para verificar se ainda existe e está ativo
        const usuario = await Usuario.findByPk(decoded.id);
        
        if (!usuario || usuario.status !== 1) {
          const error = new Error('Token inválido');
          (error as any).status = 401;
          throw error;
        }

        return {
          valid: true,
          usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            cargo: usuario.cargo
          }
        };
      } catch (jwtError) {
        const error = new Error('Token inválido');
        (error as any).status = 401;
        throw error;
      }
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      res.status(401).json({ 
        success: false,
        error: 'Token não fornecido' 
      });
    };

    await controller.handleRequest(req, res);
  }

  // POST /api/auth/logout - usando Template Method
  static async logout(req: Request, res: Response) {
    const controller = new AuthController();

    controller.processRequest = async (req: Request) => {
      // Para logout, simplesmente retornamos sucesso
      // O cliente deve remover o token do storage
      return {
        message: 'Logout realizado com sucesso'
      };
    };

    controller.formatResponse = (result: any): any => {
      return {
        success: true,
        message: result.message
      };
    };

    await controller.handleRequest(req, res);
  }

  // Sobrescrever tratamento de erro para casos específicos
  protected handleError(error: any, req: Request, res: Response): void {
    if (error.name === 'SequelizeUniqueConstraintError') {
      this.logger.warn('Tentativa de registro com email duplicado');
      res.status(409).json({ 
        success: false, 
        error: 'Email já está em uso' 
      });
      return;
    }

    if (error.status === 401) {
      res.status(401).json({ 
        success: false, 
        error: error.message 
      });
      return;
    }

    if (error.status === 409) {
      res.status(409).json({ 
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
