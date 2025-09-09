import { Request, Response } from 'express';
import { AbstractController } from './AbstractController';
import { ProdutoDataProcessor } from '../utils/DataProcessor';
import { ProdutoReportGenerator } from '../utils/ReportGenerator';
import { ProductSearchEngine, SearchStrategyFactory } from '../utils/SearchStrategy';
import { PaymentProcessor, PaymentStrategyFactory } from '../utils/PaymentStrategy';
import { DeliveryCalculator, DeliveryStrategyFactory } from '../utils/DeliveryStrategy';
import { DatabaseConnection } from '../config/database';
import { Logger } from '../utils/Logger';

// Exemplo de uso dos padrões implementados
export class EnhancedProdutoController extends AbstractController {
  private dataProcessor = new ProdutoDataProcessor();
  private reportGenerator = new ProdutoReportGenerator();
  private appLogger = Logger.getInstance();
  private dbConnection = DatabaseConnection.getInstance();

  // Implementação do Template Method
  protected async processRequest(req: Request, res: Response): Promise<any> {
    const { action } = req.params;

    switch (action) {
      case 'search':
        return this.handleSearch(req);
      case 'process':
        return this.handleDataProcessing(req);
      case 'report':
        return this.handleReportGeneration(req);
      case 'payment':
        return this.handlePayment(req);
      case 'delivery':
        return this.handleDelivery(req);
      default:
        throw new Error('Ação não suportada');
    }
  }

  // Sobrescrevendo validação específica
  protected validateRequest(req: Request): boolean {
    const { action } = req.params;
    
    switch (action) {
      case 'search':
        return !!req.query.q;
      case 'process':
        return !!req.body.data;
      case 'payment':
        return !!(req.body.amount && req.body.method && req.body.paymentData);
      case 'delivery':
        return !!(req.body.distance && req.body.weight && req.body.method);
      default:
        return super.validateRequest(req);
    }
  }

  // Uso do Strategy Pattern para busca
  private async handleSearch(req: Request): Promise<any> {
    const { q: query, type = 'simple', limit = 20, offset = 0 } = req.query as any;
    
    // Usar Strategy para busca
    const searchStrategy = SearchStrategyFactory.createStrategy(type);
    const searchEngine = new ProductSearchEngine(searchStrategy);
    
    const options = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      filters: this.extractFilters(req.query)
    };

    const result = await searchEngine.search(query, options);
    
    this.appLogger.info(`Busca executada: "${query}" - ${result.total} resultados em ${result.executionTime}ms`);
    
    return result;
  }

  // Uso do Template Method para processamento de dados
  private async handleDataProcessing(req: Request): Promise<any> {
    const { data } = req.body;
    
    try {
      const processedData = this.dataProcessor.processData(data);
      this.appLogger.info('Dados processados com sucesso');
      return processedData;
    } catch (error: any) {
      this.appLogger.error(`Erro no processamento de dados: ${error.message}`);
      throw error;
    }
  }

  // Uso do Template Method para geração de relatórios
  private async handleReportGeneration(req: Request): Promise<any> {
    const { filtros } = req.body;
    
    try {
      const report = await this.reportGenerator.generateReport({ filtros });
      this.appLogger.info('Relatório gerado com sucesso');
      return { report };
    } catch (error: any) {
      this.appLogger.error(`Erro na geração do relatório: ${error.message}`);
      throw error;
    }
  }

  // Uso do Strategy Pattern para pagamento
  private async handlePayment(req: Request): Promise<any> {
    const { amount, method, paymentData } = req.body;
    
    try {
      // Usar Strategy para pagamento
      const paymentStrategy = PaymentStrategyFactory.createStrategy(method);
      const paymentProcessor = new PaymentProcessor(paymentStrategy);
      
      const result = await paymentProcessor.processPayment(amount, paymentData);
      
      this.appLogger.info(`Pagamento processado: ${method} - ${result.success ? 'Sucesso' : 'Falha'}`);
      
      return result;
    } catch (error: any) {
      this.appLogger.error(`Erro no processamento do pagamento: ${error.message}`);
      throw error;
    }
  }

  // Uso do Strategy Pattern para entrega
  private async handleDelivery(req: Request): Promise<any> {
    const { distance, weight, method, urgency = 'normal' } = req.body;
    
    try {
      // Usar Strategy para entrega
      const deliveryStrategy = DeliveryStrategyFactory.createStrategy(method);
      const deliveryCalculator = new DeliveryCalculator(deliveryStrategy);
      
      const result = deliveryCalculator.calculateDelivery(distance, weight, urgency);
      
      this.appLogger.info(`Cálculo de entrega: ${method} - Taxa: R$ ${result.fee}`);
      
      return result;
    } catch (error: any) {
      this.appLogger.error(`Erro no cálculo de entrega: ${error.message}`);
      throw error;
    }
  }

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

  // Sobrescrevendo formatação da resposta
  protected formatResponse(result: any): any {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: result,
      server: 'Venda Certa API'
    };
  }

  // Método para demonstrar uso do Singleton
  public async testSingletonUsage(): Promise<void> {
    // Logger Singleton
    const logger1 = Logger.getInstance();
    const logger2 = Logger.getInstance();
    
    console.log('Logger instances são iguais:', logger1 === logger2);
    
    logger1.info('Teste do padrão Singleton - Logger');
    console.log('Logs atuais:', logger2.getLogs().length);
    
    // Database Singleton
    const db1 = DatabaseConnection.getInstance();
    const db2 = DatabaseConnection.getInstance();
    
    console.log('Database instances são iguais:', db1 === db2);
    
    await db1.connect();
    // db2 está usando a mesma conexão que db1
  }

  // Método para demonstrar uso combinado dos padrões
  public async demonstratePatterns(req: Request, res: Response): Promise<void> {
    try {
      // 1. Singleton - Logger
      this.appLogger.info('Demonstração iniciada');
      
      // 2. Template Method - usando o controller
      await this.handleRequest(req, res);
      
      // 3. Strategy - exemplo com múltiplas estratégias
      if (req.body.searchQuery) {
        const strategies = ['simple', 'advanced', 'category'];
        
        for (const strategyType of strategies) {
          const strategy = SearchStrategyFactory.createStrategy(strategyType);
          const searchEngine = new ProductSearchEngine(strategy);
          const result = await searchEngine.search(req.body.searchQuery, { limit: 5 });
          
          this.appLogger.info(`${strategyType}: ${result.total} resultados em ${result.executionTime}ms`);
        }
      }
      
      this.appLogger.info('Demonstração concluída');
      
    } catch (error: any) {
      this.appLogger.error(`Erro na demonstração: ${error.message}`);
      throw error;
    }
  }
}
