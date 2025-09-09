// Padrão Strategy - Payment Processing
export interface PaymentStrategy {
  processPayment(amount: number, paymentData: any): Promise<PaymentResult>;
  validatePaymentData(paymentData: any): boolean;
  getPaymentMethod(): string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  fees?: number;
}

// Implementação concreta para pagamento com cartão de crédito
export class CreditCardPaymentStrategy implements PaymentStrategy {
  async processPayment(amount: number, paymentData: any): Promise<PaymentResult> {
    // Simulação de processamento de cartão de crédito
    await this.simulateDelay(2000); // Simula tempo de processamento
    
    if (Math.random() > 0.1) { // 90% de sucesso
      return {
        success: true,
        transactionId: `CC_${Date.now()}`,
        message: 'Pagamento processado com sucesso',
        fees: amount * 0.03 // Taxa de 3%
      };
    } else {
      return {
        success: false,
        message: 'Cartão recusado'
      };
    }
  }

  validatePaymentData(paymentData: any): boolean {
    return paymentData.cardNumber && 
           paymentData.expiryDate && 
           paymentData.cvv && 
           paymentData.holderName;
  }

  getPaymentMethod(): string {
    return 'Cartão de Crédito';
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Implementação concreta para pagamento PIX
export class PixPaymentStrategy implements PaymentStrategy {
  async processPayment(amount: number, paymentData: any): Promise<PaymentResult> {
    // Simulação de processamento PIX
    await this.simulateDelay(1000); // PIX é mais rápido
    
    if (Math.random() > 0.05) { // 95% de sucesso
      return {
        success: true,
        transactionId: `PIX_${Date.now()}`,
        message: 'Pagamento PIX processado instantaneamente',
        fees: 0 // PIX sem taxa
      };
    } else {
      return {
        success: false,
        message: 'Erro no processamento PIX'
      };
    }
  }

  validatePaymentData(paymentData: any): boolean {
    return paymentData.pixKey && paymentData.pixKey.length > 0;
  }

  getPaymentMethod(): string {
    return 'PIX';
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Implementação concreta para pagamento em dinheiro
export class CashPaymentStrategy implements PaymentStrategy {
  async processPayment(amount: number, paymentData: any): Promise<PaymentResult> {
    // Pagamento em dinheiro sempre sucesso (quando há troco suficiente)
    const cashReceived = paymentData.cashAmount || 0;
    
    if (cashReceived >= amount) {
      const change = cashReceived - amount;
      return {
        success: true,
        transactionId: `CASH_${Date.now()}`,
        message: `Pagamento em dinheiro. Troco: R$ ${change.toFixed(2)}`,
        fees: 0
      };
    } else {
      return {
        success: false,
        message: `Valor insuficiente. Faltam R$ ${(amount - cashReceived).toFixed(2)}`
      };
    }
  }

  validatePaymentData(paymentData: any): boolean {
    return paymentData.cashAmount && paymentData.cashAmount > 0;
  }

  getPaymentMethod(): string {
    return 'Dinheiro';
  }
}

// Context que utiliza as strategies
export class PaymentProcessor {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  async processPayment(amount: number, paymentData: any): Promise<PaymentResult> {
    if (!this.strategy.validatePaymentData(paymentData)) {
      return {
        success: false,
        message: `Dados inválidos para ${this.strategy.getPaymentMethod()}`
      };
    }

    console.log(`Processando pagamento via ${this.strategy.getPaymentMethod()}`);
    return await this.strategy.processPayment(amount, paymentData);
  }

  getPaymentMethod(): string {
    return this.strategy.getPaymentMethod();
  }
}

// Factory para criar strategies
export class PaymentStrategyFactory {
  static createStrategy(paymentMethod: string): PaymentStrategy {
    switch (paymentMethod.toLowerCase()) {
      case 'credit_card':
      case 'cartao_credito':
        return new CreditCardPaymentStrategy();
      case 'pix':
        return new PixPaymentStrategy();
      case 'cash':
      case 'dinheiro':
        return new CashPaymentStrategy();
      default:
        throw new Error(`Método de pagamento não suportado: ${paymentMethod}`);
    }
  }

  static getAvailablePaymentMethods(): string[] {
    return ['credit_card', 'pix', 'cash'];
  }
}
