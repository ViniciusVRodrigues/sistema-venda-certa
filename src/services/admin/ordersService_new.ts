import type { Pedido, Usuario, ProdutoPedido, AtualizacaoPedido, FilterOptions, PaginationData, SortOption } from '../../types';
import { mockPedidos, mockUsuarios, mockProdutosPedido, mockAtualizacoesPedido } from '../mock/databaseMockData';

// Use the database schema data directly
const mockOrders: Pedido[] = [...mockPedidos];
const mockUsers: Usuario[] = [...mockUsuarios];
const mockOrderItems: ProdutoPedido[] = [...mockProdutosPedido];
const mockOrderUpdates: AtualizacaoPedido[] = [...mockAtualizacoesPedido];

interface OrdersResponse {
  orders: Pedido[];
  pagination: PaginationData;
}

export const ordersService = {
  // Get all orders with filters, pagination and sorting
  async getOrders(
    filters: FilterOptions & { 
      customerId?: number; 
      status?: number; 
      paymentStatus?: number;
      deliveryDriverId?: number;
    } = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 },
    sort: SortOption = { field: 'id', direction: 'desc' }
  ): Promise<OrdersResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredOrders = [...mockOrders];

    // Apply search filter (could search by order ID, customer name, etc.)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order => {
        const customer = mockUsers.find(u => u.id === order.fk_usuario_id);
        return (
          order.id.toString().includes(searchLower) ||
          customer?.nome.toLowerCase().includes(searchLower) ||
          customer?.email.toLowerCase().includes(searchLower) ||
          order.anotacoes?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply customer filter
    if (filters.customerId) {
      filteredOrders = filteredOrders.filter(order => order.fk_usuario_id === filters.customerId);
    }

    // Apply status filter
    if (filters.status !== undefined) {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }

    // Apply payment status filter
    if (filters.paymentStatus !== undefined) {
      filteredOrders = filteredOrders.filter(order => order.statusPagamento === filters.paymentStatus);
    }

    // Apply delivery driver filter
    if (filters.deliveryDriverId) {
      filteredOrders = filteredOrders.filter(order => order.fk_entregador_id === filters.deliveryDriverId);
    }

    // Apply date range filter
    if (filters.dateRange) {
      filteredOrders = filteredOrders.filter(order => {
        const orderDate = order.estimativaEntrega || new Date();
        return orderDate >= filters.dateRange!.start && orderDate <= filters.dateRange!.end;
      });
    }

    // Apply sorting
    filteredOrders.sort((a, b) => {
      const { field, direction } = sort;
      let aValue: string | number | Date, bValue: string | number | Date;

      switch (field) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'statusPagamento':
        case 'paymentStatus':
          aValue = a.statusPagamento;
          bValue = b.statusPagamento;
          break;
        case 'estimativaEntrega':
        case 'estimatedDelivery':
          aValue = a.estimativaEntrega?.getTime() || 0;
          bValue = b.estimativaEntrega?.getTime() || 0;
          break;
        case 'dataEntrega':
        case 'deliveredAt':
          aValue = a.dataEntrega?.getTime() || 0;
          bValue = b.dataEntrega?.getTime() || 0;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
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
  async getOrder(id: number): Promise<Pedido | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const order = mockOrders.find(o => o.id === id);
    return order || null;
  },

  // Get order items (products in the order)
  async getOrderItems(orderId: number): Promise<ProdutoPedido[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockOrderItems.filter(item => item.fk_pedido_id === orderId);
  },

  // Get order timeline/updates
  async getOrderTimeline(orderId: number): Promise<AtualizacaoPedido[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockOrderUpdates
      .filter(update => update.fk_pedido_id === orderId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  },

  // Get customer for an order
  async getOrderCustomer(orderId: number): Promise<Usuario | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const order = await this.getOrder(orderId);
    if (!order) return null;
    
    return mockUsers.find(u => u.id === order.fk_usuario_id) || null;
  },

  // Update order status
  async updateOrderStatus(
    orderId: number, 
    newStatus: number, 
    description?: string,
    userId?: number
  ): Promise<Pedido | null> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return null;

    // Update the order status
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      status: newStatus
    };

    // Add timeline entry
    const newUpdate: AtualizacaoPedido = {
      id: Math.max(...mockOrderUpdates.map(u => u.id)) + 1,
      status: newStatus,
      timestamp: new Date(),
      descricao: description || `Status atualizado para ${newStatus}`,
      fk_usuario_id: userId,
      fk_pedido_id: orderId
    };
    mockOrderUpdates.push(newUpdate);

    return mockOrders[orderIndex];
  },

  // Update payment status
  async updatePaymentStatus(orderId: number, newPaymentStatus: number): Promise<Pedido | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return null;

    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      statusPagamento: newPaymentStatus
    };

    return mockOrders[orderIndex];
  },

  // Assign delivery driver
  async assignDeliveryDriver(orderId: number, driverId: number): Promise<Pedido | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return null;

    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      fk_entregador_id: driverId
    };

    // Add timeline entry
    const driver = mockUsers.find(u => u.id === driverId && u.cargo === 'delivery');
    if (driver) {
      const newUpdate: AtualizacaoPedido = {
        id: Math.max(...mockOrderUpdates.map(u => u.id)) + 1,
        status: mockOrders[orderIndex].status,
        timestamp: new Date(),
        descricao: `Entregador ${driver.nome} atribuído ao pedido`,
        fk_usuario_id: driverId,
        fk_pedido_id: orderId
      };
      mockOrderUpdates.push(newUpdate);
    }

    return mockOrders[orderIndex];
  },

  // Cancel order
  async cancelOrder(orderId: number, reason: string, userId?: number): Promise<Pedido | null> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return null;

    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      status: 5, // Cancelled status
      motivoCancelamento: reason
    };

    // Add timeline entry
    const newUpdate: AtualizacaoPedido = {
      id: Math.max(...mockOrderUpdates.map(u => u.id)) + 1,
      status: 5, // Cancelled
      timestamp: new Date(),
      descricao: `Pedido cancelado: ${reason}`,
      fk_usuario_id: userId,
      fk_pedido_id: orderId
    };
    mockOrderUpdates.push(newUpdate);

    return mockOrders[orderIndex];
  },

  // Get order statistics
  async getOrderStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const stats = mockOrders.reduce(
      (acc, order) => {
        acc.total++;
        switch (order.status) {
          case 1: acc.pending++; break;
          case 2: acc.processing++; break;
          case 3: acc.shipped++; break;
          case 4: acc.delivered++; break;
          case 5: acc.cancelled++; break;
        }
        if (order.status !== 5) { // Don't count cancelled orders in revenue
          acc.totalRevenue += order.total;
        }
        return acc;
      },
      {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
        averageOrderValue: 0
      }
    );

    const validOrdersCount = stats.total - stats.cancelled;
    stats.averageOrderValue = validOrdersCount > 0 ? stats.totalRevenue / validOrdersCount : 0;

    return stats;
  },

  // Get orders by delivery driver
  async getOrdersByDriver(driverId: number): Promise<Pedido[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockOrders.filter(order => order.fk_entregador_id === driverId);
  },

  // Get orders by customer
  async getOrdersByCustomer(customerId: number): Promise<Pedido[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockOrders.filter(order => order.fk_usuario_id === customerId);
  }
};
