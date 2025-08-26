import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Cliente from '../models/Cliente';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso requerido'
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: 'Configuração JWT não encontrada'
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as { id: number; email: string };
    
    // Verify user still exists and is not blocked
    const user = await Cliente.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Usuário bloqueado'
      });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const generateToken = (user: { id: number; email: string }): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET não configurado');
  }

  return jwt.sign(
    { id: user.id, email: user.email },
    jwtSecret,
    { expiresIn: '24h' }
  );
};