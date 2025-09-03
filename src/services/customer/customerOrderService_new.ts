import type { Pedido, Usuario, ProdutoPedido, AtualizacaoPedido } from '../../types';
import { mockPedidos, mockUsuarios, mockProdutosPedido, mockAtualizacoesPedido } from '../mock/databaseMockData';

// Use database schema data
const mockOrders: Pedido[] = [...mockPedidos];
const mockUsers: Usuario[] = [...mockUsuarios];
const mockOrderItems: ProdutoPedido[] = [...mockProdutosPedido];
const mockOrderUpdates: AtualizacaoPedido[] = [...mockAtualizacoesPedido];

export interface OrderFilters {
  status?: number;
  paymentStatus?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export const customerOrderService = {
  // Get customer orders
  async getCustomerOrders(
    customerId: number,
    filters: OrderFilters = {}
  ): Promise<Pedido[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    let customerOrders = mockOrders.filter(order => order.fk_usuario_id === customerId);

    // Apply status filter
    if (filters.status !== undefined) {
      customerOrders = customerOrders.filter(order => order.status === filters.status);
    }

    // Apply payment status filter
    if (filters.paymentStatus !== undefined) {
      customerOrders = customerOrders.filter(order => order.statusPagamento === filters.paymentStatus);
    }

    // Apply date range filter
    if (filters.dateRange) {
      customerOrders = customerOrders.filter(order => {
        const orderDate = order.estimativaEntrega || new Date();
        return orderDate >= filters.dateRange!.start && orderDate <= filters.dateRange!.end;
      });
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      customerOrders = customerOrders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.anotacoes?.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by ID descending (newest first)
    return customerOrders.sort((a, b) => b.id - a.id);
  },

  // Get single order by ID for a specific customer
  async getCustomerOrder(customerId: number, orderId: number): Promise<Pedido | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const order = mockOrders.find(order => 
      order.id === orderId && order.fk_usuario_id === customerId
    );
    
    return order || null;
  },

  // Get order items for a specific order
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

  // Cancel order (if cancellation is allowed)
  async cancelOrder(customerId: number, orderId: number, reason: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const order = await this.getCustomerOrder(customerId, orderId);
    if (!order) {
      return false;
    }

    // Check if order can be cancelled (only if status is 1 - received or 2 - processing)
    if (order.status > 2) {
      return false; // Cannot cancel orders that are shipped or delivered
    }

    // Update order status to cancelled (5)
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      mockOrders[orderIndex] = {
        ...order,
        status: 5, // Cancelled
        motivoCancelamento: reason
      };

      // Add timeline entry
      const newUpdate: AtualizacaoPedido = {
        id: Math.max(...mockOrderUpdates.map(u => u.id)) + 1,
        status: 5, // Cancelled
        timestamp: new Date(),
        descricao: `Pedido cancelado pelo cliente: ${reason}`,
        fk_usuario_id: customerId,
        fk_pedido_id: orderId
      };
      mockOrderUpdates.push(newUpdate);

      return true;
    }

    return false;
  },

  // Get customer order statistics
  async getCustomerOrderStats(customerId: number): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    completedOrders: number;
    cancelledOrders: number;
    pendingOrders: number;
    lastOrderDate?: Date;
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const customerOrders = mockOrders.filter(order => order.fk_usuario_id === customerId);

    const stats = customerOrders.reduce(
      (acc, order) => {
        acc.totalOrders++;
        
        if (order.status !== 5) { // Don't count cancelled orders in spending
          acc.totalSpent += order.total;
        }

        switch (order.status) {
          case 4: // Delivered
            acc.completedOrders++;
            break;
          case 5: // Cancelled
            acc.cancelledOrders++;
            break;
          case 1: // Received
          case 2: // Processing
          case 3: // Shipped
            acc.pendingOrders++;
            break;
        }

        // Track latest order date
        const orderDate = order.dataEntrega || order.estimativaEntrega;
        if (orderDate && (!acc.lastOrderDate || orderDate > acc.lastOrderDate)) {
          acc.lastOrderDate = orderDate;
        }

        return acc;
      },
      {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        pendingOrders: 0,
        lastOrderDate: undefined as Date | undefined
      }
    );

    const paidOrdersCount = stats.totalOrders - stats.cancelledOrders;
    stats.averageOrderValue = paidOrdersCount > 0 ? stats.totalSpent / paidOrdersCount : 0;

    return stats;
  },

  // Track order (get current status and location info)
  async trackOrder(customerId: number, orderId: number): Promise<{
    order: Pedido;
    timeline: AtualizacaoPedido[];
    estimatedDelivery?: Date;
    currentStatus: string;
  } | null> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const order = await this.getCustomerOrder(customerId, orderId);
    if (!order) {
      return null;
    }

    const timeline = await this.getOrderTimeline(orderId);

    // Map status codes to readable text
    const statusMap: Record<number, string> = {
      1: 'Pedido Recebido',
      2: 'Em Preparação',
      3: 'Saiu para Entrega',
      4: 'Entregue',
      5: 'Cancelado'
    };

    return {
      order,
      timeline,
      estimatedDelivery: order.estimativaEntrega,
      currentStatus: statusMap[order.status] || 'Status Desconhecido'
    };
  },

  // Request order redelivery (if original was marked as failed)
  async requestRedelivery(customerId: number, orderId: number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const order = await this.getCustomerOrder(customerId, orderId);
    if (!order) {
      return false;
    }

    // Only allow redelivery if order status indicates delivery issue
    // For this mock, we'll allow if status is delivered but customer reports issue
    if (order.status !== 4) {
      return false;
    }

    // Create new timeline entry for redelivery request
    const newUpdate: AtualizacaoPedido = {
      id: Math.max(...mockOrderUpdates.map(u => u.id)) + 1,
      status: 3, // Back to shipped status
      timestamp: new Date(),
      descricao: 'Reentrega solicitada pelo cliente',
      fk_usuario_id: customerId,
      fk_pedido_id: orderId
    };
    mockOrderUpdates.push(newUpdate);

    // Update order status back to shipped
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      mockOrders[orderIndex] = {
        ...order,
        status: 3, // Shipped (for redelivery)
        dataEntrega: undefined // Clear delivery date
      };
    }

    return true;
  },

  // Get frequently ordered items for a customer
  async getFrequentlyOrderedItems(customerId: number, limit: number = 5): Promise<ProdutoPedido[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const customerOrders = mockOrders.filter(order => 
      order.fk_usuario_id === customerId && order.status === 4 // Only delivered orders
    );

    const customerOrderIds = customerOrders.map(order => order.id);
    const customerOrderItems = mockOrderItems.filter(item => 
      customerOrderIds.includes(item.fk_pedido_id)
    );

    // Count frequency of each product
    const productFrequency = customerOrderItems.reduce((acc, item) => {
      acc[item.fk_produto_id] = (acc[item.fk_produto_id] || 0) + item.quantidade;
      return acc;
    }, {} as Record<number, number>);

    // Get most frequent products
    const frequentProducts = Object.entries(productFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([productId]) => parseInt(productId));

    // Return sample items for these products
    return customerOrderItems
      .filter(item => frequentProducts.includes(item.fk_produto_id))
      .slice(0, limit);
  }
};
