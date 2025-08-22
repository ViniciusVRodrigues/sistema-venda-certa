import type { Order, Delivery } from '../../types';

interface DeliveryStats {
  totalPendingOrders: number;
  totalInRouteOrders: number;
  totalDeliveredToday: number;
  totalEarningsToday: number;
}

interface DeliveryOrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Mock delivery driver
const mockDeliveryDriver: Delivery = {
  id: 'delivery1',
  name: 'João Silva',
  email: 'delivery@test.com',
  role: 'delivery',
  phone: '(11) 99999-9999',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  isActive: true,
  vehicle: 'Moto Honda CG 160',
  assignedOrders: [],
  completedDeliveries: 45,
  rating: 4.8
};

// Mock orders assigned to delivery driver
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: '1',
    customer: {
      id: '1',
      name: 'Maria Silva',
      email: 'maria@email.com',
      role: 'customer',
      phone: '(11) 98888-8888',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      addresses: [],
      orders: [],
      isVip: false,
      isBlocked: false,
      totalOrders: 1,
      totalSpent: 42.50,
      lastOrderDate: new Date()
    },
    items: [
      {
        id: '1',
        productId: '1',
        product: {
          id: '1',
          name: 'Banana Prata',
          description: 'Banana prata fresca e saborosa',
          category: { id: '1', name: 'Frutas', isActive: true },
          price: 8.50,
          unit: 'kg',
          stock: 100,
          status: 'active',
          images: ['/images/banana.jpg'],
          tags: ['fruta', 'banana'],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date()
        },
        quantity: 2,
        price: 8.50
      }
    ],
    total: 42.50,
    status: 'shipped',
    deliveryAddress: {
      id: '1',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      isDefault: true
    },
    deliveryMethod: {
      id: 'delivery',
      name: 'Entrega Express',
      description: 'Entrega em até 2 horas',
      type: 'delivery',
      price: 8.50,
      estimatedDays: 0,
      isActive: true
    },
    deliveryFee: 8.50,
    paymentMethod: {
      id: 'pix',
      name: 'PIX',
      type: 'pix',
      isActive: true
    },
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-20T10:00:00'),
    updatedAt: new Date('2024-01-20T11:00:00'),
    estimatedDelivery: new Date('2024-01-20T14:00:00'),
    timeline: [
      {
        id: '1',
        status: 'received',
        timestamp: new Date('2024-01-20T10:00:00'),
        description: 'Pedido recebido',
        userId: 'system'
      },
      {
        id: '2',
        status: 'processing',
        timestamp: new Date('2024-01-20T10:30:00'),
        description: 'Pedido em preparação',
        userId: 'admin1',
        userName: 'Admin'
      },
      {
        id: '3',
        status: 'shipped',
        timestamp: new Date('2024-01-20T11:00:00'),
        description: 'Pedido enviado para entrega',
        userId: 'admin1',
        userName: 'Admin'
      }
    ],
    deliveryDriverId: 'delivery1',
    deliveryDriver: mockDeliveryDriver
  },
  {
    id: 'ORD-002',
    customerId: '2',
    customer: {
      id: '2',
      name: 'João Santos',
      email: 'joao@email.com',
      role: 'customer',
      phone: '(11) 97777-7777',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      addresses: [],
      orders: [],
      isVip: true,
      isBlocked: false,
      totalOrders: 5,
      totalSpent: 180.00,
      lastOrderDate: new Date()
    },
    items: [
      {
        id: '2',
        productId: '2',
        product: {
          id: '2',
          name: 'Maçã Gala',
          description: 'Maçã gala doce e crocante',
          category: { id: '1', name: 'Frutas', isActive: true },
          price: 12.00,
          unit: 'kg',
          stock: 50,
          status: 'active',
          images: ['/images/maca.jpg'],
          tags: ['fruta', 'maçã'],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date()
        },
        quantity: 1,
        price: 12.00
      }
    ],
    total: 20.50,
    status: 'processing',
    deliveryAddress: {
      id: '2',
      street: 'Avenida Paulista',
      number: '456',
      complement: '',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-200',
      isDefault: true
    },
    deliveryMethod: {
      id: 'delivery',
      name: 'Entrega Express',
      description: 'Entrega em até 2 horas',
      type: 'delivery',
      price: 8.50,
      estimatedDays: 0,
      isActive: true
    },
    deliveryFee: 8.50,
    paymentMethod: {
      id: 'credit_card',
      name: 'Cartão de Crédito',
      type: 'credit_card',
      isActive: true
    },
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-20T09:00:00'),
    updatedAt: new Date('2024-01-20T09:30:00'),
    estimatedDelivery: new Date('2024-01-20T13:00:00'),
    timeline: [
      {
        id: '1',
        status: 'received',
        timestamp: new Date('2024-01-20T09:00:00'),
        description: 'Pedido recebido',
        userId: 'system'
      },
      {
        id: '2',
        status: 'processing',
        timestamp: new Date('2024-01-20T09:30:00'),
        description: 'Pedido em preparação',
        userId: 'admin1',
        userName: 'Admin'
      }
    ],
    deliveryDriverId: 'delivery1',
    deliveryDriver: mockDeliveryDriver
  },
  {
    id: 'ORD-003',
    customerId: '3',
    customer: {
      id: '3',
      name: 'Ana Costa',
      email: 'ana@email.com',
      role: 'customer',
      phone: '(11) 96666-6666',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      addresses: [],
      orders: [],
      isVip: false,
      isBlocked: false,
      totalOrders: 2,
      totalSpent: 75.00,
      lastOrderDate: new Date()
    },
    items: [
      {
        id: '3',
        productId: '3',
        product: {
          id: '3',
          name: 'Tomate',
          description: 'Tomate fresco e vermelho',
          category: { id: '2', name: 'Verduras', isActive: true },
          price: 6.00,
          unit: 'kg',
          stock: 80,
          status: 'active',
          images: ['/images/tomate.jpg'],
          tags: ['verdura', 'tomate'],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date()
        },
        quantity: 3,
        price: 6.00
      }
    ],
    total: 26.50,
    status: 'delivered',
    deliveryAddress: {
      id: '3',
      street: 'Rua Augusta',
      number: '789',
      complement: 'Casa',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01305-000',
      isDefault: true
    },
    deliveryMethod: {
      id: 'delivery',
      name: 'Entrega Express',
      description: 'Entrega em até 2 horas',
      type: 'delivery',
      price: 8.50,
      estimatedDays: 0,
      isActive: true
    },
    deliveryFee: 8.50,
    paymentMethod: {
      id: 'cash',
      name: 'Dinheiro',
      type: 'cash',
      isActive: true
    },
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-19T15:00:00'),
    updatedAt: new Date('2024-01-19T17:30:00'),
    estimatedDelivery: new Date('2024-01-19T17:00:00'),
    deliveredAt: new Date('2024-01-19T17:30:00'),
    timeline: [
      {
        id: '1',
        status: 'received',
        timestamp: new Date('2024-01-19T15:00:00'),
        description: 'Pedido recebido',
        userId: 'system'
      },
      {
        id: '2',
        status: 'processing',
        timestamp: new Date('2024-01-19T15:30:00'),
        description: 'Pedido em preparação',
        userId: 'admin1',
        userName: 'Admin'
      },
      {
        id: '3',
        status: 'shipped',
        timestamp: new Date('2024-01-19T16:00:00'),
        description: 'Pedido enviado para entrega',
        userId: 'admin1',
        userName: 'Admin'
      },
      {
        id: '4',
        status: 'delivered',
        timestamp: new Date('2024-01-19T17:30:00'),
        description: 'Pedido entregue',
        userId: 'delivery1',
        userName: 'João Silva'
      }
    ],
    deliveryDriverId: 'delivery1',
    deliveryDriver: mockDeliveryDriver
  }
];

class DeliveryOrderService {
  // Get dashboard statistics
  async getDashboardStats(driverId: string): Promise<DeliveryStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const driverOrders = mockOrders.filter(order => order.deliveryDriverId === driverId);
    
    const pendingOrders = driverOrders.filter(order => 
      order.status === 'processing' || order.status === 'received'
    ).length;
    
    const inRouteOrders = driverOrders.filter(order => 
      order.status === 'shipped'
    ).length;
    
    const deliveredToday = driverOrders.filter(order => 
      order.status === 'delivered' && 
      order.deliveredAt && 
      order.deliveredAt >= today
    ).length;
    
    const earningsToday = driverOrders
      .filter(order => 
        order.status === 'delivered' && 
        order.deliveredAt && 
        order.deliveredAt >= today
      )
      .reduce((total, order) => total + order.deliveryFee, 0);
    
    return {
      totalPendingOrders: pendingOrders,
      totalInRouteOrders: inRouteOrders,
      totalDeliveredToday: deliveredToday,
      totalEarningsToday: earningsToday
    };
  }

  // Get orders assigned to delivery driver
  async getOrders(
    driverId: string,
    filters: { status?: string; search?: string } = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 }
  ): Promise<DeliveryOrdersResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredOrders = mockOrders.filter(order => order.deliveryDriverId === driverId);
    
    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'pending') {
        filteredOrders = filteredOrders.filter(order => 
          order.status === 'processing' || order.status === 'received'
        );
      } else if (filters.status === 'in_route') {
        filteredOrders = filteredOrders.filter(order => order.status === 'shipped');
      } else if (filters.status === 'delivered') {
        filteredOrders = filteredOrders.filter(order => order.status === 'delivered');
      }
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.deliveryAddress.street.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by creation date (newest first)
    filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
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
  }

  // Get specific order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const order = mockOrders.find(order => order.id === orderId);
    return order || null;
  }

  // Update order status (delivery driver actions)
  async updateOrderStatus(
    orderId: string, 
    newStatus: 'shipped' | 'delivered',
    notes?: string
  ): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Pedido não encontrado');
    }

    const order = mockOrders[orderIndex];
    
    // Validate status transition
    if (newStatus === 'shipped' && order.status !== 'processing') {
      throw new Error('Pedido deve estar em preparação para ser marcado como em rota');
    }
    
    if (newStatus === 'delivered' && order.status !== 'shipped') {
      throw new Error('Pedido deve estar em rota para ser marcado como entregue');
    }
    
    // Update order
    order.status = newStatus;
    order.updatedAt = new Date();
    
    if (newStatus === 'delivered') {
      order.deliveredAt = new Date();
    }
    
    // Add timeline event
    const timelineEvent = {
      id: Date.now().toString(),
      status: newStatus,
      timestamp: new Date(),
      description: notes || (newStatus === 'shipped' ? 'Pedido em rota de entrega' : 'Pedido entregue'),
      userId: 'delivery1',
      userName: 'João Silva'
    };
    
    order.timeline.push(timelineEvent);
    
    return order;
  }

  // Get delivery history
  async getDeliveryHistory(
    driverId: string,
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 }
  ): Promise<DeliveryOrdersResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const deliveredOrders = mockOrders
      .filter(order => 
        order.deliveryDriverId === driverId && 
        order.status === 'delivered'
      )
      .sort((a, b) => {
        const aDate = a.deliveredAt || a.updatedAt;
        const bDate = b.deliveredAt || b.updatedAt;
        return bDate.getTime() - aDate.getTime();
      });
    
    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedOrders = deliveredOrders.slice(startIndex, endIndex);
    
    return {
      orders: paginatedOrders,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: deliveredOrders.length,
        totalPages: Math.ceil(deliveredOrders.length / pagination.pageSize)
      }
    };
  }
}

export const deliveryOrderService = new DeliveryOrderService();