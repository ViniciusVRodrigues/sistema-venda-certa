import { Request, Response } from 'express';
import { Pedido, Usuario, Endereco, MetodoEntrega, MetodoPagamento, ProdutoPedido, Produto, AtualizacaoPedido } from '../models';
import { AbstractController } from './AbstractController';
import { PaymentProcessor, PaymentStrategyFactory } from '../utils/PaymentStrategy';
import { DeliveryCalculator, DeliveryStrategyFactory } from '../utils/DeliveryStrategy';
import { PedidoReportGenerator } from '../utils/ReportGenerator';

export class PedidoController extends AbstractController {
  private reportGenerator = new PedidoReportGenerator();

  // GET /api/pedidos - usando Template Method
  static async getAll(req: Request, res: Response) {
    const controller = new PedidoController();
    
    controller.processRequest = async () => {
      return await Pedido.findAll({
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
          { model: Usuario, as: 'entregador', attributes: ['id', 'nome'] },
          { model: Endereco, as: 'endereco' },
          { model: MetodoEntrega, as: 'metodoEntrega' },
          { model: MetodoPagamento, as: 'metodoPagamento' },
          { 
            model: ProdutoPedido, 
            as: 'produtos',
            include: [
              { model: Produto, as: 'produto', attributes: ['id', 'nome', 'preco'] }
            ]
          },
          { 
            model: AtualizacaoPedido, 
            as: 'atualizacoes',
            include: [
              { model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }
            ]
          },
        ],
        order: [['id', 'DESC']],
      });
    };
    
    await controller.handleRequest(req, res);
  }

  // GET /api/pedidos/:id - usando Template Method
  static async getById(req: Request, res: Response) {
    const controller = new PedidoController();
    
    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const pedido = await Pedido.findByPk(id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
          { model: Usuario, as: 'entregador', attributes: ['id', 'nome'] },
          { model: Endereco, as: 'endereco' },
          { model: MetodoEntrega, as: 'metodoEntrega' },
          { model: MetodoPagamento, as: 'metodoPagamento' },
          { 
            model: ProdutoPedido, 
            as: 'produtos',
            include: [
              { model: Produto, as: 'produto', attributes: ['id', 'nome', 'preco'] }
            ]
          },
          { 
            model: AtualizacaoPedido, 
            as: 'atualizacoes',
            include: [
              { model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }
            ]
          },
        ],
      });

      if (!pedido) {
        const error = new Error('Pedido não encontrado');
        (error as any).status = 404;
        throw error;
      }

      return pedido;
    };
    
    await controller.handleRequest(req, res);
  }

  // POST /api/pedidos/calculate-delivery - usando Strategy Pattern
  static async calculateDelivery(req: Request, res: Response) {
    const controller = new PedidoController();
    
    controller.validateRequest = (req: Request): boolean => {
      const { distance, weight, method } = req.body;
      return !!(distance && weight && method);
    };

    controller.processRequest = async (req: Request) => {
      const { distance, weight, method, urgency = 'normal' } = req.body;
      
      // Usar Strategy Pattern para cálculo de entrega
      const deliveryStrategy = DeliveryStrategyFactory.createStrategy(method);
      const deliveryCalculator = new DeliveryCalculator(deliveryStrategy);
      
      const result = deliveryCalculator.calculateDelivery(distance, weight, urgency);
      
      controller.logger.info(`Cálculo de entrega realizado: ${method} - Taxa: R$ ${result.fee}`);
      
      return {
        deliveryMethod: result.method,
        fee: result.fee,
        estimatedTime: result.estimatedTimeMinutes,
        canDeliver: result.canDeliver,
        message: result.message
      };
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      res.status(400).json({ 
        error: 'Distância, peso e método de entrega são obrigatórios' 
      });
    };
    
    await controller.handleRequest(req, res);
  }

  // POST /api/pedidos/process-payment - usando Strategy Pattern
  static async processPayment(req: Request, res: Response) {
    const controller = new PedidoController();
    
    controller.validateRequest = (req: Request): boolean => {
      const { amount, method, paymentData } = req.body;
      return !!(amount && method && paymentData);
    };

    controller.processRequest = async (req: Request) => {
      const { amount, method, paymentData } = req.body;
      
      // Usar Strategy Pattern para processamento de pagamento
      const paymentStrategy = PaymentStrategyFactory.createStrategy(method);
      const paymentProcessor = new PaymentProcessor(paymentStrategy);
      
      const result = await paymentProcessor.processPayment(amount, paymentData);
      
      controller.logger.info(`Pagamento processado: ${method} - ${result.success ? 'Sucesso' : 'Falha'}`);
      
      return {
        success: result.success,
        transactionId: result.transactionId,
        message: result.message,
        fees: result.fees,
        paymentMethod: paymentProcessor.getPaymentMethod()
      };
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      res.status(400).json({ 
        error: 'Valor, método de pagamento e dados de pagamento são obrigatórios' 
      });
    };
    
    await controller.handleRequest(req, res);
  }

  // POST /api/pedidos - criação com processamento de pagamento e entrega
  static async create(req: Request, res: Response) {
    const controller = new PedidoController();
    
    controller.validateRequest = (req: Request): boolean => {
      const { fk_usuario_id, produtos, endereco, pagamento, entrega } = req.body;
      return !!(fk_usuario_id && produtos && produtos.length > 0 && endereco && pagamento && entrega);
    };

    controller.processRequest = async (req: Request) => {
      const { fk_usuario_id, produtos, endereco, pagamento, entrega } = req.body;
      
      // 1. Calcular valores
      let totalProdutos = 0;
      for (const item of produtos) {
        const produto = await Produto.findByPk(item.fk_produto_id);
        if (!produto) {
          throw new Error(`Produto ${item.fk_produto_id} não encontrado`);
        }
        totalProdutos += produto.preco * item.quantidade;
      }

      // 2. Calcular entrega usando Strategy
      const deliveryStrategy = DeliveryStrategyFactory.createStrategy(entrega.method);
      const deliveryCalculator = new DeliveryCalculator(deliveryStrategy);
      const deliveryResult = deliveryCalculator.calculateDelivery(
        entrega.distance, 
        entrega.weight, 
        entrega.urgency || 'normal'
      );

      if (!deliveryResult.canDeliver) {
        throw new Error(deliveryResult.message || 'Entrega não disponível');
      }

      const totalFinal = totalProdutos + deliveryResult.fee;

      // 3. Processar pagamento usando Strategy
      const paymentStrategy = PaymentStrategyFactory.createStrategy(pagamento.method);
      const paymentProcessor = new PaymentProcessor(paymentStrategy);
      const paymentResult = await paymentProcessor.processPayment(totalFinal, pagamento.data);

      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Falha no processamento do pagamento');
      }

      // 4. Criar pedido
      const pedido = await Pedido.create({
        fk_usuario_id,
        fk_endereco_id: endereco.id,
        status: 1, // Pendente
        total: totalFinal,
        subtotal: totalProdutos,
        taxaEntrega: deliveryResult.fee,
        statusPagamento: 1, // Pago
        fk_metodoPagamento_id: pagamento.metodoPagamentoId || 1,
        fk_metodoEntrega_id: entrega.metodoEntregaId || 1,
        estimativaEntrega: new Date(Date.now() + deliveryResult.estimatedTimeMinutes * 60000)
      });

      // 5. Criar produtos do pedido
      for (const item of produtos) {
        await ProdutoPedido.create({
          fk_pedido_id: pedido.id,
          fk_produto_id: item.fk_produto_id,
          quantidade: item.quantidade,
          preco: (await Produto.findByPk(item.fk_produto_id))!.preco
        });
      }

      controller.logger.info(`Pedido ${pedido.id} criado com sucesso - Total: R$ ${totalFinal}`);

      return {
        pedido: pedido.toJSON(),
        payment: paymentResult,
        delivery: deliveryResult
      };
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      res.status(400).json({ 
        error: 'Usuário, produtos, endereço, dados de pagamento e entrega são obrigatórios' 
      });
    };
    
    await controller.handleRequest(req, res);
  }

  // GET /api/pedidos/report - usando Template Method para relatórios
  static async generateReport(req: Request, res: Response) {
    const controller = new PedidoController();
    
    controller.processRequest = async (req: Request) => {
      const { startDate, endDate, status } = req.query as any;
      
      const filtros: any = {};
      
      if (startDate && endDate) {
        filtros.dataPedido = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        };
      }
      
      if (status) {
        filtros.statusPedido = parseInt(status);
      }

      const report = await controller.reportGenerator.generateReport({ filtros });
      
      controller.logger.info('Relatório de pedidos gerado');
      
      return { 
        report,
        generatedAt: new Date().toISOString(),
        filters: filtros
      };
    };
    
    await controller.handleRequest(req, res);
  }

  // PUT /api/pedidos/:id/status - atualizar status
  static async updateStatus(req: Request, res: Response) {
    const controller = new PedidoController();
    
    controller.validateRequest = (req: Request): boolean => {
      const { status } = req.body;
      const { id } = req.params;
      return !!(id && status && [1, 2, 3, 4, 5, 6].includes(parseInt(status)));
    };

    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const { status, observacao } = req.body;
      
      const [updated] = await Pedido.update(
        { status: status }, 
        { where: { id } }
      );

      if (updated === 0) {
        const error = new Error('Pedido não encontrado');
        (error as any).status = 404;
        throw error;
      }

      // Registrar atualização
      await AtualizacaoPedido.create({
        fk_pedido_id: parseInt(id),
        fk_usuario_id: req.body.fk_usuario_id || 1, // Usuario do sistema
        status: status,
        timestamp: new Date(),
        descricao: observacao || `Status atualizado para ${controller.getStatusDescription(status)}`
      });

      const pedido = await Pedido.findByPk(id, {
        include: [
          { model: AtualizacaoPedido, as: 'atualizacoes' }
        ]
      });

      controller.logger.info(`Status do pedido ${id} atualizado para ${status}`);

      return pedido;
    };

    controller.handleValidationError = (req: Request, res: Response): void => {
      res.status(400).json({ 
        error: 'ID do pedido e status válido (1-6) são obrigatórios' 
      });
    };
    
    await controller.handleRequest(req, res);
  }

  // Método auxiliar para descrição do status
  private getStatusDescription(status: number): string {
    const statusMap: { [key: number]: string } = {
      1: 'Pendente',
      2: 'Confirmado',
      3: 'Em Preparo',
      4: 'Saiu para Entrega',
      5: 'Entregue',
      6: 'Cancelado'
    };
    return statusMap[status] || 'Desconhecido';
  }

  // Implementação obrigatória do método abstrato
  protected async processRequest(req: Request, res: Response): Promise<any> {
    throw new Error('Este método deve ser sobrescrito em tempo de execução');
  }

  // Métodos adicionais para compatibilidade com rotas existentes
  static async update(req: Request, res: Response) {
    return PedidoController.updateStatus(req, res);
  }

  static async delete(req: Request, res: Response) {
    const controller = new PedidoController();
    
    controller.processRequest = async (req: Request) => {
      const { id } = req.params;
      const deleted = await Pedido.destroy({
        where: { id },
      });

      if (deleted === 0) {
        const error = new Error('Pedido não encontrado');
        (error as any).status = 404;
        throw error;
      }

      return { message: 'Pedido deletado com sucesso' };
    };

    controller.formatResponse = (result: any): any => {
      return {
        success: true,
        message: result.message
      };
    };
    
    await controller.handleRequest(req, res);
  }

  static async getByUsuario(req: Request, res: Response) {
    const controller = new PedidoController();
    
    controller.processRequest = async (req: Request) => {
      const { usuarioId } = req.params;
      return await Pedido.findAll({
        where: { fk_usuario_id: usuarioId },
        include: [
          { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
          { model: Usuario, as: 'entregador', attributes: ['id', 'nome'] },
          { model: Endereco, as: 'endereco' },
          { model: MetodoEntrega, as: 'metodoEntrega' },
          { model: MetodoPagamento, as: 'metodoPagamento' },
          { 
            model: ProdutoPedido, 
            as: 'produtos',
            include: [
              { model: Produto, as: 'produto', attributes: ['id', 'nome', 'preco'] }
            ]
          },
        ],
        order: [['id', 'DESC']],
      });
    };
    
    await controller.handleRequest(req, res);
  }
}
