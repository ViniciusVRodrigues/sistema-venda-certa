import { Request, Response, NextFunction } from 'express';
import { Logger } from '@venda-certa/logger';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message } = err;

  // Log do erro
  if (statusCode >= 500) {
    Logger.error(`${req.method} ${req.path} - ${message} - Stack: ${err.stack}`);
  } else {
    Logger.warn(`${req.method} ${req.path} - ${message}`);
  }

  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'Algo deu errado!';
  }

  res.status(statusCode).json({
    status: 'error',
    error: {
      statusCode,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const logger = Logger.getInstance();
  logger.warn(`Rota não encontrada: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  const err = new AppError(`Rota ${req.originalUrl} não encontrada`, 404);
  next(err);
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};