import type { Pedido, Endereco, Usuario, ProdutoPedido, Produto, MetodoEntrega } from '../../types';
import { 
  mockPedidos, 
  mockEnderecos, 
  mockUsuarios, 
  mockProdutosPedido, 
  mockProdutos,
  mockMetodosEntrega
} from '../mock/databaseMockData';

interface DeliveryStats {
  totalPendingOrders: number;
  totalInRouteOrders: number;
  totalDeliveredToday: number;
  totalEarningsToday: number;
}

interface EstatisticasEntrega {
  totalPedidosPendentes: number;
  totalPedidosRota: number;
  totalEntregasHoje: number;
  totalGanhosHoje: number;
}

export interface PedidoCompleto extends Pedido {
  endereco?: Endereco;
  cliente?: Usuario;
  produtos?: Array<ProdutoPedido & { produto?: Produto }>;
  metodoEntrega?: MetodoEntrega;
}

interface DeliveryOrdersResponse {
  orders: PedidoCompleto[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface RespostaPedidosEntrega {
  pedidos: Pedido[];
  paginacao: {
    pagina: number;
    tamanhoPagina: number;
    total: number;
    totalPaginas: number;
  };
}

// Mock orders assigned to delivery driver
const mockOrders: Pedido[] = mockPedidos;

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
      order.status === 0 || order.status === 1 || order.status === 2 // recebido, processando
    ).length;
    
    const totalInRouteOrders = driverOrders.filter(order => 
      order.status === 3 // enviado
    ).length;
    
    const totalDeliveredToday = driverOrders.filter(order => 
      order.status === 4 && // entregue
      order.dataEntrega &&
      order.dataEntrega >= today
    ).length;
    
    const totalEarningsToday = driverOrders
      .filter(order => 
        order.status === 4 &&
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
          order.status === 0 || order.status === 1 || order.status === 2 // recebido, processando
        );
      } else if (filters.status === 'in_route') {
        filteredOrders = filteredOrders.filter(order => order.status === 3); // enviado
      } else if (filters.status === 'delivered') {
        filteredOrders = filteredOrders.filter(order => order.status === 4); // entregue
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
    
    // Sort by status priority and then by estimated delivery
    filteredOrders.sort((a, b) => {
      // Priority order: 0,1,2 (pending), 3 (in_route), 4 (delivered), 5 (cancelled)
      const statusPriority = { 0: 1, 1: 1, 2: 1, 3: 2, 4: 3, 5: 4 };
      const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 5;
      const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 5;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // If same priority, sort by estimated delivery (earliest first for pending/in_route, newest first for delivered)
      const aDate = a.estimativaEntrega?.getTime() || 0;
      const bDate = b.estimativaEntrega?.getTime() || 0;
      
      if (aPriority <= 2) { // pending or in_route - earliest first
        return aDate - bDate;
      } else { // delivered or cancelled - newest first
        return bDate - aDate;
      }
    });

    // Enrich orders with related data
    const enrichedOrders: PedidoCompleto[] = filteredOrders.map(order => {
      // Get endereco
      const endereco = mockEnderecos.find(e => e.id === order.fk_endereco_id);
      
      // Get cliente
      const cliente = mockUsuarios.find(u => u.id === order.fk_usuario_id);
      
      // Get produtos
      const produtosPedido = mockProdutosPedido.filter(pp => pp.fk_pedido_id === order.id);
      const produtos = produtosPedido.map(pp => ({
        ...pp,
        produto: mockProdutos.find(p => p.id === pp.fk_produto_id)
      }));
      
      // Get método de entrega
      const metodoEntrega = mockMetodosEntrega.find(me => me.id === order.fk_metodoEntrega_id);
      
      return {
        ...order,
        endereco,
        cliente,
        produtos,
        metodoEntrega
      };
    });

    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedOrders = enrichedOrders.slice(startIndex, endIndex);
    
    return {
      orders: paginatedOrders,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: enrichedOrders.length,
        totalPages: Math.ceil(enrichedOrders.length / pagination.pageSize)
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
  }

  // Métodos em português para compatibilidade
  async obterEstatisticasDashboard(entregadorId: number): Promise<EstatisticasEntrega> {
    const stats = await this.getDeliveryStats(entregadorId);
    
    // Converter nomes das propriedades
    return {
      totalPedidosPendentes: stats.totalPendingOrders,
      totalPedidosRota: stats.totalInRouteOrders,
      totalEntregasHoje: stats.totalDeliveredToday,
      totalGanhosHoje: stats.totalEarningsToday
    };
  }

  async obterPedidos(
    entregadorId: number,
    filtros: { status?: string; busca?: string } = {},
    paginacao: { pagina: number; tamanhoPagina: number } = { pagina: 1, tamanhoPagina: 10 }
  ): Promise<RespostaPedidosEntrega> {
    // Converter filtros
    const filters = {
      status: filtros.status,
      search: filtros.busca
    };
    
    // Converter paginação
    const pagination = {
      page: paginacao.pagina,
      pageSize: paginacao.tamanhoPagina
    };
    
    const response = await this.getOrders(entregadorId, filters, pagination);
    
    // Converter resposta
    return {
      pedidos: response.orders,
      paginacao: {
        pagina: response.pagination.page,
        tamanhoPagina: response.pagination.pageSize,
        total: response.pagination.total,
        totalPaginas: response.pagination.totalPages
      }
    };
  }

  async obterPedidoPorId(pedidoId: number): Promise<Pedido | null> {
    return this.getOrderById(pedidoId);
  }

  async atualizarStatusPedido(
    pedidoId: number,
    novoStatus: 3 | 4, // enviado ou entregue
    anotacoes?: string
  ): Promise<Pedido> {
    // Mapear status: 3 -> 2 (enviado), 4 -> 3 (entregue)
    const mappedStatus = novoStatus === 3 ? 2 : 3;
    return this.updateOrderStatus(pedidoId, mappedStatus as 2 | 3, anotacoes);
  }

  // Get delivery history for driver
  async getDeliveryHistory(driverId: number): Promise<Pedido[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockOrders
      .filter(order => 
        order.fk_entregador_id === driverId &&
        order.status === 4 // entregue
      )
      .sort((a, b) => {
        const aDate = a.dataEntrega?.getTime() || 0;
        const bDate = b.dataEntrega?.getTime() || 0;
        return bDate - aDate;
      });
  }
}

export const deliveryOrderService = new DeliveryOrderService();