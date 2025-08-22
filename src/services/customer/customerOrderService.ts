import type { Order, Customer, Product, Address, DeliveryMethod, PaymentMethod } from '../../types';

// Mock data for customer orders
const mockCustomer: Customer = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@email.com',
  role: 'customer',
  phone: '(11) 99999-1111',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-20'),
  addresses: [],
  orders: [],
  isVip: false,
  isBlocked: false,
  totalOrders: 3,
  totalSpent: 450.75,
  lastOrderDate: new Date('2024-01-20')
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Banana Prata Orgânica',
    description: 'Bananas orgânicas de alta qualidade',
    shortDescription: 'Bananas orgânicas',
    category: { id: '1', name: 'Frutas', isActive: true },
    price: 8.50,
    unit: 'kg',
    stock: 50,
    status: 'active',
    images: ['/images/banana.jpg'],
    tags: ['orgânico', 'fruta'],
    sku: 'BAN001',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Tomate Cereja',
    description: 'Tomates cereja frescos',
    shortDescription: 'Tomates cereja',
    category: { id: '2', name: 'Verduras', isActive: true },
    price: 12.90,
    unit: 'bandeja',
    stock: 30,
    status: 'active',
    images: ['/images/tomate.jpg'],
    tags: ['fresco', 'verdura'],
    sku: 'TOM001',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  }
];

const mockAddress: Address = {
  id: '1',
  street: 'Rua das Flores',
  number: '123',
  complement: 'Apto 45',
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '01310-100',
  isDefault: true
};

const mockDeliveryMethod: DeliveryMethod = {
  id: 'standard',
  name: 'Entrega padrão',
  description: 'Entrega em até 3 dias úteis',
  type: 'delivery',
  price: 8.50,
  estimatedDays: 3,
  isActive: true
};

const mockPaymentMethod: PaymentMethod = {
  id: 'pix',
  name: 'PIX',
  type: 'pix',
  isActive: true,
  config: {
    pixKey: 'vendacerta@email.com',
    instructions: 'Realize o pagamento via PIX',
    confirmationDeadlineHours: 2
  }
};

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: '1',
    customer: mockCustomer,
    items: [
      {
        id: '1',
        productId: '1',
        product: mockProducts[0],
        quantity: 2,
        price: 8.50
      },
      {
        id: '2',
        productId: '2',
        product: mockProducts[1],
        quantity: 1,
        price: 12.90
      }
    ],
    total: 29.90,
    status: 'delivered',
    deliveryAddress: mockAddress,
    deliveryMethod: mockDeliveryMethod,
    deliveryFee: 8.50,
    paymentMethod: mockPaymentMethod,
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18'),
    estimatedDelivery: new Date('2024-01-18'),
    deliveredAt: new Date('2024-01-18'),
    notes: 'Entregar na portaria',
    timeline: [
      {
        id: '1',
        status: 'received',
        timestamp: new Date('2024-01-15T10:00:00'),
        description: 'Pedido recebido',
        userId: '1',
        userName: 'Sistema'
      },
      {
        id: '2',
        status: 'processing',
        timestamp: new Date('2024-01-16T09:00:00'),
        description: 'Pedido em preparação',
        userId: 'admin1',
        userName: 'Admin'
      },
      {
        id: '3',
        status: 'shipped',
        timestamp: new Date('2024-01-17T14:00:00'),
        description: 'Pedido enviado para entrega',
        userId: 'admin1',
        userName: 'Admin'
      },
      {
        id: '4',
        status: 'delivered',
        timestamp: new Date('2024-01-18T16:30:00'),
        description: 'Pedido entregue',
        userId: 'delivery1',
        userName: 'Entregador'
      }
    ]
  },
  {
    id: 'ORD-002',
    customerId: '1',
    customer: mockCustomer,
    items: [
      {
        id: '3',
        productId: '2',
        product: mockProducts[1],
        quantity: 3,
        price: 12.90
      }
    ],
    total: 47.20,
    status: 'shipped',
    deliveryAddress: mockAddress,
    deliveryMethod: mockDeliveryMethod,
    deliveryFee: 8.50,
    paymentMethod: mockPaymentMethod,
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
    estimatedDelivery: new Date('2024-01-23'),
    notes: '',
    timeline: [
      {
        id: '5',
        status: 'received',
        timestamp: new Date('2024-01-20T11:00:00'),
        description: 'Pedido recebido',
        userId: '1',
        userName: 'Sistema'
      },
      {
        id: '6',
        status: 'processing',
        timestamp: new Date('2024-01-21T10:00:00'),
        description: 'Pedido em preparação',
        userId: 'admin1',
        userName: 'Admin'
      },
      {
        id: '7',
        status: 'shipped',
        timestamp: new Date('2024-01-22T15:00:00'),
        description: 'Pedido enviado para entrega',
        userId: 'admin1',
        userName: 'Admin'
      }
    ]
  },
  {
    id: 'ORD-003',
    customerId: '1',
    customer: mockCustomer,
    items: [
      {
        id: '4',
        productId: '1',
        product: mockProducts[0],
        quantity: 5,
        price: 8.50
      }
    ],
    total: 51.00,
    status: 'processing',
    deliveryAddress: mockAddress,
    deliveryMethod: mockDeliveryMethod,
    deliveryFee: 8.50,
    paymentMethod: mockPaymentMethod,
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    estimatedDelivery: new Date('2024-01-25'),
    timeline: [
      {
        id: '8',
        status: 'received',
        timestamp: new Date('2024-01-22T14:00:00'),
        description: 'Pedido recebido',
        userId: '1',
        userName: 'Sistema'
      },
      {
        id: '9',
        status: 'processing',
        timestamp: new Date('2024-01-22T15:00:00'),
        description: 'Pedido em preparação',
        userId: 'admin1',
        userName: 'Admin'
      }
    ]
  }
];

export interface OrderFilters {
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export const customerOrderService = {
  // Get customer orders with optional filters
  async getCustomerOrders(filters?: OrderFilters): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredOrders = [...mockOrders];

    if (filters?.status && filters.status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.id.toLowerCase().includes(searchTerm) ||
        order.items.some(item => 
          item.product.name.toLowerCase().includes(searchTerm)
        )
      );
    }

    if (filters?.dateRange) {
      filteredOrders = filteredOrders.filter(order =>
        order.createdAt >= filters.dateRange!.start &&
        order.createdAt <= filters.dateRange!.end
      );
    }

    return filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  // Get order by ID
  async getOrderById(id: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockOrders.find(order => order.id === id) || null;
  },

  // Get order status options
  getOrderStatusOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'Todos os status' },
      { value: 'received', label: 'Recebido' },
      { value: 'processing', label: 'Em preparação' },
      { value: 'shipped', label: 'Enviado' },
      { value: 'delivered', label: 'Entregue' },
      { value: 'cancelled', label: 'Cancelado' }
    ];
  },

  // Get status display info
  getStatusInfo(status: Order['status']): { label: string; color: string; bgColor: string } {
    const statusMap = {
      received: { label: 'Recebido', color: 'text-blue-800', bgColor: 'bg-blue-100' },
      processing: { label: 'Em preparação', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
      shipped: { label: 'Enviado', color: 'text-orange-800', bgColor: 'bg-orange-100' },
      delivered: { label: 'Entregue', color: 'text-green-800', bgColor: 'bg-green-100' },
      cancelled: { label: 'Cancelado', color: 'text-red-800', bgColor: 'bg-red-100' }
    };

    return statusMap[status] || { label: status, color: 'text-gray-800', bgColor: 'bg-gray-100' };
  },

  // Calculate order statistics
  async getOrderStats(): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const orders = mockOrders;
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const lastOrderDate = orders.length > 0 
      ? new Date(Math.max(...orders.map(order => order.createdAt.getTime())))
      : undefined;

    return {
      totalOrders,
      totalSpent,
      averageOrderValue,
      lastOrderDate
    };
  }
};