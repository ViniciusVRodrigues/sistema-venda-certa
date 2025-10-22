import { Request, Response } from 'express';
import { Logger } from '@venda-certa/logger';

// Padrão Template Method - AbstractController
export abstract class AbstractController {
  protected logger = Logger.getInstance();

  // Template method que define o algoritmo principal
  public async handleRequest(req: Request, res: Response): Promise<void> {
    try {
      // Hook: Log da requisição
      this.logRequest(req);
      
      // Hook: Validação de entrada
      const isValid = this.validateRequest(req);
      if (!isValid) {
        return this.handleValidationError(req, res);
      }

      // Hook: Processamento principal (implementado pelas subclasses)
      const result = await this.processRequest(req, res);
      
      // Hook: Log do resultado
      this.logResult(result);
      
      // Hook: Formatação da resposta
      const response = this.formatResponse(result);
      
      // Envio da resposta
      res.status(200).json(response);
      
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  // Hooks implementados na classe base (podem ser sobrescritos)
  protected logRequest(req: Request): void {
    this.logger.info(`${req.method} ${req.path} - IP: ${req.ip}`);
  }

  protected validateRequest(req: Request): boolean {
    // Validação básica - pode ser sobrescrita pelas subclasses
    return true;
  }

  protected handleValidationError(req: Request, res: Response): void {
    this.logger.warn(`Validation error in request`);
    res.status(400).json({ error: 'Invalid request data' });
  }

  protected logResult(result: any): void {
    this.logger.info(`Operation completed successfully`);
  }

  protected formatResponse(result: any): any {
    return { success: true, data: result };
  }

  protected handleError(error: any, req: Request, res: Response): void {
    this.logger.error(`Error processing request: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }

  // Método abstrato que deve ser implementado pelas subclasses
  protected abstract processRequest(req: Request, res: Response): Promise<any>;
}
