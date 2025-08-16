import { Order, OrderItem, Address, DeliveryMethod, PaymentMethod, CartItem } from '../../types';

export interface CheckoutStep {
  id: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface DeliveryCalculation {
  method: DeliveryMethod;
  fee: number;
  estimatedDays: number;
  estimatedDate: Date;
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod?: DeliveryMethod;
  deliveryAddress?: Address;
  paymentMethod?: PaymentMethod;
}

export interface CreateOrderData {
  items: CartItem[];
  deliveryAddress: Address;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface OrderConfirmation {
  order: Order;
  estimatedDelivery: Date;
  trackingCode: string;
}

// Mock delivery methods
const mockDeliveryMethods: DeliveryMethod[] = [
  {
    id: 'pickup',
    name: 'Retirada na loja',
    description: 'Retire seu pedido em nossa loja física',
    type: 'pickup',
    price: 0,
    estimatedDays: 0,
    isActive: true
  },
  {
    id: 'standard',
    name: 'Entrega padrão',
    description: 'Entrega em até 3 dias úteis',
    type: 'delivery',
    price: 8.50,
    estimatedDays: 3,
    isActive: true
  },
  {
    id: 'express',
    name: 'Entrega expressa',
    description: 'Entrega no mesmo dia (apenas regiões centrais)',
    type: 'delivery',
    price: 15.90,
    estimatedDays: 0,
    isActive: true
  }
];

// Mock payment methods
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pix',
    name: 'PIX',
    type: 'pix',
    isActive: true,
    config: {
      pixKey: 'vendacerta@email.com',
      instructions: 'Realize o pagamento via PIX e envie o comprovante',
      confirmationDeadlineHours: 2
    }
  },
  {
    id: 'cash',
    name: 'Dinheiro na entrega',
    type: 'cash',
    isActive: true,
    config: {
      acceptOnDelivery: true,
      instructions: 'Tenha o valor exato em mãos'
    }
  },
  {
    id: 'card',
    name: 'Cartão na entrega',
    type: 'credit_card',
    isActive: true,
    config: {
      acceptOnDelivery: true,
      instructions: 'Aceitamos cartão de crédito e débito'
    }
  }
];

export const checkoutService = {
  // Get available delivery methods
  async getDeliveryMethods(): Promise<DeliveryMethod[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockDeliveryMethods.filter(m => m.isActive);
  },

  // Calculate delivery fee and time
  async calculateDelivery(
    items: CartItem[], 
    address: Address, 
    methodId: string
  ): Promise<DeliveryCalculation | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const method = mockDeliveryMethods.find(m => m.id === methodId);
    if (!method) return null;

    // Simple calculation logic (in real app would use more complex rules)
    let fee = method.price;
    let estimatedDays = method.estimatedDays;

    // Add some variance based on address (mock)
    if (address.city.toLowerCase() !== 'cidade principal') {
      fee += 5.00;
      estimatedDays += 1;
    }

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);

    return {
      method,
      fee,
      estimatedDays,
      estimatedDate
    };
  },

  // Get available payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return mockPaymentMethods.filter(m => m.isActive);
  },

  // Validate checkout data
  validateCheckoutData(data: Partial<CreateOrderData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.items || data.items.length === 0) {
      errors.push('Carrinho vazio');
    }

    if (!data.deliveryAddress) {
      errors.push('Endereço de entrega é obrigatório');
    } else {
      if (!data.deliveryAddress.street) errors.push('Rua é obrigatória');
      if (!data.deliveryAddress.number) errors.push('Número é obrigatório');
      if (!data.deliveryAddress.city) errors.push('Cidade é obrigatória');
      if (!data.deliveryAddress.zipCode) errors.push('CEP é obrigatório');
    }

    if (!data.deliveryMethod) {
      errors.push('Método de entrega é obrigatório');
    }

    if (!data.paymentMethod) {
      errors.push('Método de pagamento é obrigatório');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Create order
  async createOrder(orderData: CreateOrderData): Promise<OrderConfirmation> {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Validate data
    const validation = this.validateCheckoutData(orderData);
    if (!validation.isValid) {
      throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
    }

    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => {
      const price = item.variation?.price || item.product.price;
      return sum + (price * item.quantity);
    }, 0);

    // Mock delivery calculation
    const deliveryCalculation = await this.calculateDelivery(
      orderData.items,
      orderData.deliveryAddress,
      orderData.deliveryMethod.id
    );

    const deliveryFee = deliveryCalculation?.fee || 0;
    const total = subtotal + deliveryFee;

    // Create order items
    const orderItems: OrderItem[] = orderData.items.map((cartItem, index) => ({
      id: `item-${Date.now()}-${index}`,
      productId: cartItem.productId,
      product: cartItem.product,
      quantity: cartItem.quantity,
      price: cartItem.variation?.price || cartItem.product.price,
      variationId: cartItem.variationId,
      variation: cartItem.variation
    }));

    // Generate order
    const orderId = `ORD-${Date.now()}`;
    const now = new Date();
    const estimatedDelivery = deliveryCalculation?.estimatedDate || new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const order: Order = {
      id: orderId,
      customerId: 'current-user', // In real app, get from auth context
      customer: {
        id: 'current-user',
        name: 'Cliente Atual',
        email: 'cliente@email.com',
        role: 'customer',
        createdAt: now,
        updatedAt: now,
        addresses: [orderData.deliveryAddress],
        orders: [],
        isVip: false,
        isBlocked: false,
        totalOrders: 1,
        totalSpent: total
      },
      items: orderItems,
      total,
      status: 'received',
      deliveryAddress: orderData.deliveryAddress,
      deliveryMethod: orderData.deliveryMethod,
      deliveryFee,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod.type === 'pix' ? 'pending' : 'paid',
      createdAt: now,
      updatedAt: now,
      estimatedDelivery,
      notes: orderData.notes,
      timeline: [
        {
          id: '1',
          status: 'received',
          timestamp: now,
          description: 'Pedido recebido com sucesso',
          userId: 'system'
        }
      ]
    };

    return {
      order,
      estimatedDelivery,
      trackingCode: orderId
    };
  },

  // Get checkout steps configuration
  getCheckoutSteps(): CheckoutStep[] {
    return [
      { id: 1, title: 'Identificação', isCompleted: false, isActive: true },
      { id: 2, title: 'Entrega', isCompleted: false, isActive: false },
      { id: 3, title: 'Pagamento', isCompleted: false, isActive: false },
      { id: 4, title: 'Confirmação', isCompleted: false, isActive: false }
    ];
  },

  // Update checkout steps
  updateCheckoutSteps(steps: CheckoutStep[], currentStepId: number): CheckoutStep[] {
    return steps.map(step => ({
      ...step,
      isCompleted: step.id < currentStepId,
      isActive: step.id === currentStepId
    }));
  }
};