import type { Pedido, Delivery } from '../../types';

interface DeliveryStats {
  totalPendingOrders: number;
  totalInRouteOrders: number;
  totalDeliveredToday: number;
  totalEarningsToday: number;
}

interface DeliveryOrdersResponse {
  orders: Pedido[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Mock delivery driver
const mockDeliveryDriver: Delivery = {
  id: 1,
  nome: 'João Silva',
  email: 'delivery@test.com',
  cargo: 'delivery',
  numeroCelular: '(11) 99999-9999',
  status: 1,
  totalPedidos: 0,
  totalGasto: 0,
  entregasFeitas: 45,
  nota: 4.8,
  vehicle: 'Moto Honda CG 160',
  assignedOrders: []
};

// Mock orders assigned to delivery driver
const mockOrders: Pedido[] = [
  {
    id: 1,
    status: 2, // enviado
    total: 85.50,
    subtotal: 75.50,
    taxaEntrega: 10.00,
    statusPagamento: 1,
    anotacoes: 'Entregar no portão da frente',
    estimativaEntrega: new Date('2024-03-15T18:00:00'),
    fk_entregador_id: 1,
    fk_metodoPagamento_id: 1,
    fk_usuario_id: 101,
    fk_metodoEntrega_id: 1,
    fk_endereco_id: 201
  },
  {
    id: 2,
    status: 1, // processando
    total: 42.30,
    subtotal: 35.30,
    taxaEntrega: 7.00,
    statusPagamento: 1,
    estimativaEntrega: new Date('2024-03-15T19:30:00'),
    fk_entregador_id: 1,
    fk_metodoPagamento_id: 2,
    fk_usuario_id: 102,
    fk_metodoEntrega_id: 1,
    fk_endereco_id: 202
  },
  {
    id: 3,
    status: 3, // entregue
    total: 156.80,
    subtotal: 146.80,
    taxaEntrega: 10.00,
    statusPagamento: 1,
    dataEntrega: new Date('2024-03-15T12:45:00'),
    estimativaEntrega: new Date('2024-03-15T12:00:00'),
    fk_entregador_id: 1,
    fk_metodoPagamento_id: 1,
    fk_usuario_id: 103,
    fk_metodoEntrega_id: 1,
    fk_endereco_id: 203
  }
];

class DeliveryOrderService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get dashboard statistics
  async getDeliveryStats(driverId: number): Promise<DeliveryStats> {
    await this.delay(300);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const driverOrders = mockOrders.filter(order => order.fk_entregador_id === driverId);
    
    const totalPendingOrders = driverOrders.filter(order => 
      order.status === 1 || order.status === 0 // processando ou recebido
    ).length;
    
    const totalInRouteOrders = driverOrders.filter(order => 
      order.status === 2 // enviado
    ).length;
    
    const totalDeliveredToday = driverOrders.filter(order => 
      order.status === 3 && // entregue
      order.dataEntrega &&
      order.dataEntrega >= today
    ).length;
    
    const totalEarningsToday = driverOrders
      .filter(order => 
        order.status === 3 &&
        order.dataEntrega &&
        order.dataEntrega >= today
      )
      .reduce((total, order) => total + order.taxaEntrega, 0);

    return {
      totalPendingOrders,
      totalInRouteOrders,
      totalDeliveredToday,
      totalEarningsToday
    };
  }

  // Get orders assigned to delivery driver
  async getOrders(
    driverId: number,
    filters: { status?: string; search?: string } = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 }
  ): Promise<DeliveryOrdersResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredOrders = mockOrders.filter(order => order.fk_entregador_id === driverId);
    
    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'pending') {
        filteredOrders = filteredOrders.filter(order => 
          order.status === 0 || order.status === 1 // recebido ou processando
        );
      } else if (filters.status === 'in_route') {
        filteredOrders = filteredOrders.filter(order => order.status === 2); // enviado
      } else if (filters.status === 'delivered') {
        filteredOrders = filteredOrders.filter(order => order.status === 3); // entregue
      }
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.id.toString().includes(searchLower) ||
        order.anotacoes?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by estimated delivery (newest first)
    filteredOrders.sort((a, b) => {
      const aDate = a.estimativaEntrega?.getTime() || 0;
      const bDate = b.estimativaEntrega?.getTime() || 0;
      return bDate - aDate;
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
  }

  // Get specific order by ID
  async getOrderById(orderId: number): Promise<Pedido | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const order = mockOrders.find(order => order.id === orderId);
    return order || null;
  }

  // Update order status (delivery driver actions)
  async updateOrderStatus(
    orderId: number,
    newStatus: 2 | 3, // enviado ou entregue
    notes?: string
  ): Promise<Pedido> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Pedido não encontrado');
    }

    const order = mockOrders[orderIndex];
    
    // Validate status transition
    if (newStatus === 2 && order.status !== 1) { // shipped e não processando
      throw new Error('Pedido deve estar em processamento para ser enviado');
    }
    
    if (newStatus === 3 && order.status !== 2) { // delivered e não shipped
      throw new Error('Pedido deve estar em rota para ser entregue');
    }
    
    // Update order
    order.status = newStatus;
    
    // Set delivery date if delivered
    if (newStatus === 3) {
      order.dataEntrega = new Date();
    }
    
    // Add notes if provided
    if (notes) {
      order.anotacoes = notes;
    }

    return order;
  }  // Get delivery history for driver
  async getDeliveryHistory(driverId: number): Promise<Pedido[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockOrders
      .filter(order => 
        order.fk_entregador_id === driverId &&
        order.status === 3 // entregue
      )
      .sort((a, b) => {
        const aDate = a.dataEntrega?.getTime() || 0;
        const bDate = b.dataEntrega?.getTime() || 0;
        return bDate - aDate;
      });
  }
}

export const deliveryOrderService = new DeliveryOrderService();