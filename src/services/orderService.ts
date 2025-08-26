import type { Order, OrderItem, Customer } from '../types';
import { apiService, type ApiError } from './api';

// Backend API interfaces
interface BackendOrderItem {
  id: number;
  pedidoId: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  produto?: {
    id: number;
    nome: string;
    preco: number;
    unidade: string;
    imagens: string[];
  };
}

interface BackendOrder {
  id: number;
  clienteId: number;
  numeroComanda: string;
  status: 'pendente' | 'confirmado' | 'preparando' | 'enviado' | 'entregue' | 'cancelado';
  metodoPagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'boleto';
  subtotal: number;
  desconto?: number;
  taxaEntrega?: number;
  total: number;
  observacoes?: string;
  enderecoEntrega?: string;
  telefoneContato?: string;
  dataEntrega?: string;
  dataConfirmacao?: string;
  dataCancelamento?: string;
  motivoCancelamento?: string;
  createdAt: string;
  updatedAt: string;
  cliente?: {
    id: number;
    nome: string;
    email: string;
    telefone?: string;
  };
  itens?: BackendOrderItem[];
}

interface BackendOrdersResponse {
  pedidos: BackendOrder[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
}

interface CreateOrderData {
  clienteId: number;
  metodoPagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'boleto';
  itens: Array<{
    produtoId: number;
    quantidade: number;
  }>;
  observacoes?: string;
  enderecoEntrega?: string;
  telefoneContato?: string;
}

// Conversion functions
function convertPaymentMethod(backendMethod: string): any {
  const methodMap: Record<string, any> = {
    'dinheiro': { id: '1', name: 'Dinheiro', type: 'cash' },
    'cartao_credito': { id: '2', name: 'Cartão de Crédito', type: 'credit_card' },
    'cartao_debito': { id: '3', name: 'Cartão de Débito', type: 'debit_card' },
    'pix': { id: '4', name: 'PIX', type: 'pix' },
    'boleto': { id: '5', name: 'Boleto', type: 'bank_transfer' },
  };
  return methodMap[backendMethod] || { id: '1', name: 'Dinheiro', type: 'cash' };
}

function convertOrderStatus(backendStatus: string): Order['status'] {
  const statusMap: Record<string, Order['status']> = {
    'pendente': 'received',
    'confirmado': 'processing',
    'preparando': 'processing',
    'enviado': 'shipped',
    'entregue': 'delivered',
    'cancelado': 'cancelled',
  };
  return statusMap[backendStatus] || 'received';
}

function convertBackendOrder(backendOrder: BackendOrder): Order {
  // Mock customer data if not provided
  const customer: Customer = {
    id: backendOrder.clienteId.toString(),
    name: backendOrder.cliente?.nome || 'Cliente',
    email: backendOrder.cliente?.email || '',
    role: 'customer',
    phone: backendOrder.cliente?.telefone,
    createdAt: new Date(),
    updatedAt: new Date(),
    addresses: [],
    orders: [],
    isVip: false,
    isBlocked: false,
    totalOrders: 0,
    totalSpent: 0,
  };

  // Convert items
  const items: OrderItem[] = (backendOrder.itens || []).map(item => ({
    id: item.id.toString(),
    productId: item.produtoId.toString(),
    product: {
      id: item.produtoId.toString(),
      name: item.produto?.nome || 'Produto',
      description: '',
      category: { id: '1', name: 'Categoria', isActive: true },
      price: item.produto?.preco || item.precoUnitario,
      unit: item.produto?.unidade || 'un',
      stock: 0,
      status: 'active' as const,
      images: item.produto?.imagens || [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    quantity: item.quantidade,
    price: item.precoUnitario,
  }));

  // Mock address
  const deliveryAddress = {
    id: '1',
    street: backendOrder.enderecoEntrega || 'Endereço não informado',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: true,
  };

  return {
    id: backendOrder.id.toString(),
    customerId: backendOrder.clienteId.toString(),
    customer,
    items,
    total: parseFloat(backendOrder.total.toString()),
    status: convertOrderStatus(backendOrder.status),
    deliveryAddress,
    deliveryMethod: {
      id: '1',
      name: 'Entrega Normal',
      description: '',
      type: 'delivery',
      price: parseFloat((backendOrder.taxaEntrega || 0).toString()),
      estimatedDays: 3,
      isActive: true,
    },
    deliveryFee: parseFloat((backendOrder.taxaEntrega || 0).toString()),
    paymentMethod: convertPaymentMethod(backendOrder.metodoPagamento),
    paymentStatus: 'paid',
    createdAt: new Date(backendOrder.createdAt),
    updatedAt: new Date(backendOrder.updatedAt),
    estimatedDelivery: backendOrder.dataEntrega ? new Date(backendOrder.dataEntrega) : undefined,
    deliveredAt: backendOrder.dataConfirmacao ? new Date(backendOrder.dataConfirmacao) : undefined,
    notes: backendOrder.observacoes,
    cancelReason: backendOrder.motivoCancelamento,
    timeline: [], // TODO: Implement timeline
  };
}

export const orderService = {
  // Create new order
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await apiService.post<BackendOrder>('/pedidos', orderData);
      return convertBackendOrder(response);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao criar pedido');
    }
  },

  // Get order by ID
  async getOrder(id: string): Promise<Order | null> {
    try {
      const response = await apiService.get<BackendOrder>(`/pedidos/${id}`);
      return convertBackendOrder(response);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 404) {
        return null;
      }
      throw new Error(apiError.message || 'Erro ao buscar pedido');
    }
  },

  // Get customer orders
  async getCustomerOrders(
    customerId: string,
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 }
  ): Promise<{ orders: Order[]; pagination: any }> {
    try {
      const params = new URLSearchParams();
      params.append('clienteId', customerId);
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());

      const response = await apiService.get<BackendOrdersResponse>(`/pedidos?${params.toString()}`);
      
      return {
        orders: response.pedidos.map(convertBackendOrder),
        pagination: {
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          totalPages: response.totalPages,
        },
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao buscar pedidos do cliente');
    }
  },

  // Update order status
  async updateOrderStatus(
    orderId: string, 
    status: 'pendente' | 'confirmado' | 'preparando' | 'enviado' | 'entregue' | 'cancelado',
    observacoes?: string
  ): Promise<Order> {
    try {
      const updateData: any = { status };
      if (observacoes) {
        updateData.observacoes = observacoes;
      }

      const response = await apiService.patch<BackendOrder>(`/pedidos/${orderId}/status`, updateData);
      return convertBackendOrder(response);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao atualizar status do pedido');
    }
  },

  // Cancel order
  async cancelOrder(orderId: string, reason: string): Promise<Order> {
    try {
      const response = await apiService.patch<BackendOrder>(`/pedidos/${orderId}/cancel`, {
        motivoCancelamento: reason,
      });
      return convertBackendOrder(response);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao cancelar pedido');
    }
  },

  // Get order statistics
  async getOrderStats(): Promise<{
    total: number;
    pendentes: number;
    confirmados: number;
    entregues: number;
    cancelados: number;
    receitaTotal: number;
    ticketMedio: number;
  }> {
    try {
      const response = await apiService.get<{
        total: number;
        pendentes: number;
        confirmados: number;
        entregues: number;
        cancelados: number;
        receitaTotal: number;
        ticketMedio: number;
      }>('/pedidos/estatisticas');
      
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao buscar estatísticas dos pedidos');
    }
  },

  // Get all orders with filters
  async getOrders(
    filters: {
      status?: string;
      clienteId?: string;
      dataInicio?: string;
      dataFim?: string;
      search?: string;
    } = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 }
  ): Promise<{ orders: Order[]; pagination: any }> {
    try {
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await apiService.get<BackendOrdersResponse>(`/pedidos?${params.toString()}`);
      
      return {
        orders: response.pedidos.map(convertBackendOrder),
        pagination: {
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          totalPages: response.totalPages,
        },
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao buscar pedidos');
    }
  },
};