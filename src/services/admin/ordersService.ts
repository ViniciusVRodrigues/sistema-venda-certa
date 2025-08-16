import type { Order, OrderTimelineEvent, Customer, FilterOptions, PaginationData, SortOption } from '../../types';

// Mock customers data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    role: 'customer',
    phone: '(11) 99999-1111',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    addresses: [],
    orders: [],
    isVip: false,
    isBlocked: false,
    totalOrders: 5,
    totalSpent: 1250.45,
    lastOrderDate: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    role: 'customer',
    phone: '(11) 99999-2222',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18'),
    addresses: [],
    orders: [],
    isVip: true,
    isBlocked: false,
    totalOrders: 12,
    totalSpent: 2890.75,
    lastOrderDate: new Date('2024-01-22')
  }
];

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '001',
    customerId: '1',
    customer: mockCustomers[0],
    items: [
      {
        id: '1',
        productId: '1',
        product: {
          id: '1',
          name: 'Smartphone Samsung Galaxy',
          description: 'Smartphone com tela de 6.1"',
          category: { id: '1', name: 'Eletrônicos', isActive: true },
          price: 1299.99,
          unit: 'un',
          stock: 15,
          status: 'active',
          images: ['/images/smartphone1.jpg'],
          tags: ['smartphone'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        quantity: 1,
        price: 1299.99,
        variationId: '1-1'
      }
    ],
    total: 1299.99,
    status: 'delivered',
    deliveryAddress: {
      id: '1',
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      isDefault: true
    },
    deliveryMethod: {
      id: '1',
      name: 'Entrega Expressa',
      description: 'Entrega em até 2 dias úteis',
      type: 'delivery',
      price: 15.00,
      estimatedDays: 2,
      isActive: true
    },
    deliveryFee: 15.00,
    paymentMethod: {
      id: '1',
      name: 'PIX',
      type: 'pix',
      isActive: true
    },
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-20T10:30:00'),
    updatedAt: new Date('2024-01-22T14:20:00'),
    estimatedDelivery: new Date('2024-01-24'),
    deliveredAt: new Date('2024-01-22T14:20:00'),
    timeline: [
      {
        id: '1',
        status: 'received',
        timestamp: new Date('2024-01-20T10:30:00'),
        description: 'Pedido recebido',
        userId: 'system'
      },
      {
        id: '2',
        status: 'processing',
        timestamp: new Date('2024-01-20T15:45:00'),
        description: 'Produto separado para envio',
        userId: 'admin1',
        userName: 'Admin'
      },
      {
        id: '3',
        status: 'shipped',
        timestamp: new Date('2024-01-21T09:15:00'),
        description: 'Produto enviado - Código de rastreamento: BR123456789',
        userId: 'admin1',
        userName: 'Admin'
      },
      {
        id: '4',
        status: 'delivered',
        timestamp: new Date('2024-01-22T14:20:00'),
        description: 'Produto entregue',
        userId: 'system'
      }
    ]
  },
  {
    id: '002',
    customerId: '2',
    customer: mockCustomers[1],
    items: [
      {
        id: '2',
        productId: '2',
        product: {
          id: '2',
          name: 'Camiseta Básica',
          description: 'Camiseta de algodão 100%',
          category: { id: '2', name: 'Roupas', isActive: true },
          price: 49.99,
          unit: 'un',
          stock: 50,
          status: 'active',
          images: ['/images/tshirt1.jpg'],
          tags: ['camiseta'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        quantity: 2,
        price: 49.99
      }
    ],
    total: 99.98,
    status: 'processing',
    deliveryAddress: {
      id: '2',
      street: 'Av. Paulista',
      number: '456',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      isDefault: true
    },
    deliveryMethod: {
      id: '2',
      name: 'Entrega Normal',
      description: 'Entrega em até 5 dias úteis',
      type: 'delivery',
      price: 10.00,
      estimatedDays: 5,
      isActive: true
    },
    deliveryFee: 10.00,
    paymentMethod: {
      id: '2',
      name: 'Cartão de Crédito',
      type: 'credit_card',
      isActive: true
    },
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-22T08:15:00'),
    updatedAt: new Date('2024-01-22T10:30:00'),
    estimatedDelivery: new Date('2024-01-29'),
    timeline: [
      {
        id: '1',
        status: 'received',
        timestamp: new Date('2024-01-22T08:15:00'),
        description: 'Pedido recebido',
        userId: 'system'
      },
      {
        id: '2',
        status: 'processing',
        timestamp: new Date('2024-01-22T10:30:00'),
        description: 'Produtos sendo separados',
        userId: 'admin1',
        userName: 'Admin'
      }
    ]
  },
  {
    id: '003',
    customerId: '1',
    customer: mockCustomers[0],
    items: [
      {
        id: '3',
        productId: '3',
        product: {
          id: '3',
          name: 'Headset Gamer',
          description: 'Headset com microfone',
          category: { id: '1', name: 'Eletrônicos', isActive: true },
          price: 299.99,
          unit: 'un',
          stock: 8,
          status: 'active',
          images: ['/images/headset1.jpg'],
          tags: ['headset'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        quantity: 1,
        price: 299.99
      }
    ],
    total: 299.99,
    status: 'received',
    deliveryAddress: {
      id: '1',
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      isDefault: true
    },
    deliveryMethod: {
      id: '1',
      name: 'Entrega Expressa',
      description: 'Entrega em até 2 dias úteis',
      type: 'delivery',
      price: 15.00,
      estimatedDays: 2,
      isActive: true
    },
    deliveryFee: 15.00,
    paymentMethod: {
      id: '1',
      name: 'PIX',
      type: 'pix',
      isActive: true
    },
    paymentStatus: 'pending',
    createdAt: new Date('2024-01-23T14:20:00'),
    updatedAt: new Date('2024-01-23T14:20:00'),
    estimatedDelivery: new Date('2024-01-26'),
    timeline: [
      {
        id: '1',
        status: 'received',
        timestamp: new Date('2024-01-23T14:20:00'),
        description: 'Pedido recebido - Aguardando confirmação do pagamento',
        userId: 'system'
      }
    ]
  }
];

interface OrdersResponse {
  orders: Order[];
  pagination: PaginationData;
}

export const ordersService = {
  // Get all orders with filters, pagination and sorting
  async getOrders(
    filters: FilterOptions & { paymentStatus?: string } = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 },
    sort: SortOption = { field: 'createdAt', direction: 'desc' }
  ): Promise<OrdersResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredOrders = [...mockOrders];

    // Apply search filter (customer name, order ID)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.customer.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status) {
      filteredOrders = filteredOrders.filter(order =>
        order.status === filters.status
      );
    }

    // Apply payment status filter
    if (filters.paymentStatus) {
      filteredOrders = filteredOrders.filter(order =>
        order.paymentStatus === filters.paymentStatus
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      filteredOrders = filteredOrders.filter(order =>
        order.createdAt >= filters.dateRange!.start &&
        order.createdAt <= filters.dateRange!.end
      );
    }

    // Apply sorting
    filteredOrders.sort((a, b) => {
      const aValue = a[sort.field as keyof Order] as any;
      const bValue = b[sort.field as keyof Order] as any;
      
      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return {
      orders: paginatedOrders,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / pagination.pageSize)
      }
    };
  },

  // Get single order by ID
  async getOrder(id: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockOrders.find(order => order.id === id) || null;
  },

  // Update order status
  async updateOrderStatus(
    orderId: string,
    newStatus: Order['status'],
    notes?: string
  ): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Pedido não encontrado');
    }

    const order = mockOrders[orderIndex];
    
    // Update order
    order.status = newStatus;
    order.updatedAt = new Date();
    if (notes) {
      order.notes = notes;
    }

    // Add timeline event
    const timelineEvent: OrderTimelineEvent = {
      id: Date.now().toString(),
      status: newStatus,
      timestamp: new Date(),
      description: notes || `Status alterado para ${newStatus}`,
      userId: 'admin1',
      userName: 'Admin'
    };

    order.timeline.push(timelineEvent);

    // Set delivered date if status is delivered
    if (newStatus === 'delivered') {
      order.deliveredAt = new Date();
    }

    return order;
  },

  // Update payment status
  async updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Pedido não encontrado');
    }

    mockOrders[orderIndex].paymentStatus = paymentStatus;
    mockOrders[orderIndex].updatedAt = new Date();

    // Add timeline event for payment confirmation
    if (paymentStatus === 'paid') {
      const timelineEvent: OrderTimelineEvent = {
        id: Date.now().toString(),
        status: mockOrders[orderIndex].status,
        timestamp: new Date(),
        description: 'Pagamento confirmado',
        userId: 'system'
      };
      mockOrders[orderIndex].timeline.push(timelineEvent);
    }

    return mockOrders[orderIndex];
  },

  // Cancel order
  async cancelOrder(orderId: string, reason: string): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Pedido não encontrado');
    }

    const order = mockOrders[orderIndex];
    order.status = 'cancelled';
    order.cancelReason = reason;
    order.updatedAt = new Date();

    // Add timeline event
    const timelineEvent: OrderTimelineEvent = {
      id: Date.now().toString(),
      status: 'cancelled',
      timestamp: new Date(),
      description: `Pedido cancelado: ${reason}`,
      userId: 'admin1',
      userName: 'Admin'
    };

    order.timeline.push(timelineEvent);

    return order;
  },

  // Add note to order
  async addOrderNote(orderId: string, note: string): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Pedido não encontrado');
    }

    const order = mockOrders[orderIndex];
    const timelineEvent: OrderTimelineEvent = {
      id: Date.now().toString(),
      status: order.status,
      timestamp: new Date(),
      description: `Observação: ${note}`,
      userId: 'admin1',
      userName: 'Admin'
    };

    order.timeline.push(timelineEvent);
    order.updatedAt = new Date();

    return order;
  },

  // Get orders grouped by status (for Kanban view)
  async getOrdersByStatus(): Promise<Record<Order['status'], Order[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const groupedOrders: Record<Order['status'], Order[]> = {
      'received': [],
      'processing': [],
      'shipped': [],
      'delivered': [],
      'cancelled': []
    };

    mockOrders.forEach(order => {
      groupedOrders[order.status].push(order);
    });

    return groupedOrders;
  },

  // Mock notification sending
  async resendNotification(orderId: string, type: 'status_update' | 'payment_reminder'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock implementation - in real app would integrate with notification service
    console.log(`Notification sent for order ${orderId}: ${type}`);
  },

  // Generate simple receipt (mock)
  async generateReceipt(orderId: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) throw new Error('Pedido não encontrado');
    
    // Return mock HTML content
    return `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
        <h2>Comprovante de Pedido</h2>
        <p><strong>Pedido:</strong> #${order.id}</p>
        <p><strong>Cliente:</strong> ${order.customer.name}</p>
        <p><strong>Data:</strong> ${order.createdAt.toLocaleDateString()}</p>
        <hr>
        <h3>Itens:</h3>
        ${order.items.map(item => `
          <p>${item.product.name} - Qtd: ${item.quantity} - ${item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        `).join('')}
        <hr>
        <p><strong>Total:</strong> ${order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
      </div>
    `;
  }
};