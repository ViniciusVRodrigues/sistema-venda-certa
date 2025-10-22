import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models';
import { Logger } from '@venda-certa/logger';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    cargo: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    Logger.warn(`Tentativa de acesso sem token - IP: ${req.ip} - Path: ${req.path}`);
    res.status(401).json({
      success: false,
      error: 'Token de acesso não fornecido'
    });
    return;
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Verificar se o usuário ainda existe e está ativo
    const usuario = await Usuario.findByPk(decoded.id);
    
    if (!usuario || usuario.status !== 1) {
      Logger.warn(`Token válido mas usuário inativo ou inexistente - User ID: ${decoded.id}`);
      res.status(401).json({
        success: false,
        error: 'Usuário inativo ou não encontrado'
      });
      return;
    }

    // Adicionar informações do usuário à requisição
    req.user = {
      id: decoded.id,
      email: decoded.email,
      cargo: decoded.cargo
    };

    Logger.info(`Usuário autenticado - ID: ${decoded.id} - Email: ${decoded.email} - Path: ${req.path}`);
    next();
  } catch (error) {
    Logger.warn(`Token inválido - IP: ${req.ip} - Error: ${error}`);
    res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }
};

// Middleware para verificar se o usuário é admin
export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Usuário não autenticado'
    });
    return;
  }

  if (req.user.cargo !== 'admin' && req.user.cargo !== 'administrador') {
    Logger.warn(`Tentativa de acesso admin negada - User ID: ${req.user.id} - Cargo: ${req.user.cargo}`);
    res.status(403).json({
      success: false,
      error: 'Acesso negado. Privilégios de administrador necessários.'
    });
    return;
  }

  Logger.info(`Acesso admin autorizado - User ID: ${req.user.id} - Path: ${req.path}`);
  next();
};

// Middleware para verificar se o usuário é entregador
export const requireDelivery = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Usuário não autenticado'
    });
    return;
  }

  const allowedRoles = ['entregador', 'admin', 'administrador'];
  if (!allowedRoles.includes(req.user.cargo)) {
    Logger.warn(`Tentativa de acesso entregador negada - User ID: ${req.user.id} - Cargo: ${req.user.cargo}`);
    res.status(403).json({
      success: false,
      error: 'Acesso negado. Privilégios de entregador necessários.'
    });
    return;
  }

  Logger.info(`Acesso entregador autorizado - User ID: ${req.user.id} - Path: ${req.path}`);
  next();
};

// Middleware para verificar se o usuário pode acessar seus próprios dados
export const requireOwnershipOrAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Usuário não autenticado'
    });
    return;
  }

  const userId = parseInt(req.params.id || req.params.usuarioId);
  const isAdmin = req.user.cargo === 'admin' || req.user.cargo === 'administrador';
  const isOwner = req.user.id === userId;

  if (!isOwner && !isAdmin) {
    Logger.warn(`Tentativa de acesso a dados de outro usuário negada - User ID: ${req.user.id} - Target ID: ${userId}`);
    res.status(403).json({
      success: false,
      error: 'Acesso negado. Você só pode acessar seus próprios dados.'
    });
    return;
  }

  Logger.info(`Acesso a dados próprios ou admin autorizado - User ID: ${req.user.id} - Target ID: ${userId}`);
  next();
};

export { AuthenticatedRequest };
