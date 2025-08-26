import type { Customer, Order, FilterOptions, PaginationData, SortOption } from '../../types';
import { apiService, type ApiError } from '../api';

// Backend API interfaces
interface BackendCliente {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  avatar?: string;
  isVip?: boolean;
  isBlocked?: boolean;
  totalPedidos?: number;
  totalGasto?: number;
  ultimoPedidoData?: string;
  createdAt: string;
  updatedAt: string;
}

interface BackendClientesResponse {
  clientes: BackendCliente[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
}

// Conversion functions
function convertBackendCliente(backendCliente: BackendCliente): Customer {
  return {
    id: backendCliente.id.toString(),
    name: backendCliente.nome,
    email: backendCliente.email,
    role: 'customer',
    phone: backendCliente.telefone,
    avatar: backendCliente.avatar,
    createdAt: new Date(backendCliente.createdAt),
    updatedAt: new Date(backendCliente.updatedAt),
    addresses: [], // TODO: Implement address management
    orders: [], // Will be loaded separately
    isVip: backendCliente.isVip || false,
    isBlocked: backendCliente.isBlocked || false,
    totalOrders: backendCliente.totalPedidos || 0,
    totalSpent: parseFloat(backendCliente.totalGasto?.toString() || '0'),
    lastOrderDate: backendCliente.ultimoPedidoData ? new Date(backendCliente.ultimoPedidoData) : undefined,
  };
}

interface CustomersResponse {
  customers: Customer[];
  pagination: PaginationData;
}

export const customersService = {
  // Get all customers with filters, pagination and sorting
  async getCustomers(
    filters: FilterOptions & { vipOnly?: boolean; status?: 'active' | 'blocked' } = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 },
    sort: SortOption = { field: 'totalSpent', direction: 'desc' }
  ): Promise<CustomersResponse> {
    try {
      const params = new URLSearchParams();
      
      // Add pagination
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());
      
      // Add sorting
      let sortField = sort.field;
      if (sort.field === 'totalSpent') sortField = 'totalGasto';
      if (sort.field === 'totalOrders') sortField = 'totalPedidos';
      if (sort.field === 'lastOrderDate') sortField = 'ultimoPedidoData';
      if (sort.field === 'name') sortField = 'nome';
      
      params.append('sortBy', sortField);
      params.append('sortOrder', sort.direction);
      
      // Add filters
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.vipOnly) {
        params.append('vip', 'true');
      }
      if (filters.status === 'blocked') {
        params.append('blocked', 'true');
      } else if (filters.status === 'active') {
        params.append('blocked', 'false');
      }
      if (filters.dateRange) {
        params.append('dataInicio', filters.dateRange.start.toISOString());
        params.append('dataFim', filters.dateRange.end.toISOString());
      }

      const response = await apiService.get<BackendClientesResponse>(`/clientes?${params.toString()}`);
      
      return {
        customers: response.clientes.map(convertBackendCliente),
        pagination: {
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          totalPages: response.totalPages,
        },
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao buscar clientes');
    }
  },

  // Get single customer by ID
  async getCustomer(id: string): Promise<Customer | null> {
    try {
      const response = await apiService.get<BackendCliente>(`/clientes/${id}`);
      return convertBackendCliente(response);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 404) {
        return null;
      }
      throw new Error(apiError.message || 'Erro ao buscar cliente');
    }
  },

  // Get customer's order history
  async getCustomerOrders(customerId: string): Promise<Order[]> {
    try {
      // This will call the orders endpoint filtered by customer
      await apiService.get<any>(`/pedidos?clienteId=${customerId}`);
      // TODO: Convert backend orders to frontend Order type
      return [];
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao buscar pedidos do cliente');
    }
  },

  // Update customer VIP status
  async updateVipStatus(customerId: string, isVip: boolean): Promise<Customer> {
    try {
      const response = await apiService.patch<BackendCliente>(`/clientes/${customerId}`, {
        isVip,
      });
      return convertBackendCliente(response);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao atualizar status VIP');
    }
  },

  // Update customer blocked status
  async updateBlockedStatus(customerId: string, isBlocked: boolean): Promise<Customer> {
    try {
      const response = await apiService.patch<BackendCliente>(`/clientes/${customerId}`, {
        isBlocked,
      });
      return convertBackendCliente(response);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao atualizar status bloqueado');
    }
  },

  // Get customer statistics
  async getCustomerStats(): Promise<{
    total: number;
    active: number;
    blocked: number;
    vip: number;
    newThisMonth: number;
    averageTicket: number;
    totalRevenue: number;
  }> {
    try {
      const response = await apiService.get<{
        total: number;
        ativos: number;
        bloqueados: number;
        vips: number;
        novosMes: number;
        ticketMedio: number;
        receitaTotal: number;
      }>('/clientes/estatisticas');
      
      return {
        total: response.total,
        active: response.ativos,
        blocked: response.bloqueados,
        vip: response.vips,
        newThisMonth: response.novosMes,
        averageTicket: response.ticketMedio,
        totalRevenue: response.receitaTotal,
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao buscar estatísticas dos clientes');
    }
  },

  // Get top customers by spending
  async getTopCustomers(limit: number = 10): Promise<Customer[]> {
    try {
      const response = await apiService.get<BackendCliente[]>(`/clientes/top?limit=${limit}`);
      return response.map(convertBackendCliente);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao buscar top clientes');
    }
  },

  // Search customers (enhanced search with multiple criteria)
  async searchCustomers(query: string): Promise<Customer[]> {
    try {
      const response = await apiService.get<BackendCliente[]>(`/clientes/search?q=${encodeURIComponent(query)}`);
      return response.map(convertBackendCliente);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao pesquisar clientes');
    }
  },

  // Create new customer
  async createCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'orders' | 'totalOrders' | 'totalSpent' | 'lastOrderDate'>): Promise<Customer> {
    try {
      const backendData = {
        nome: customerData.name,
        email: customerData.email,
        telefone: customerData.phone,
        avatar: customerData.avatar,
        isVip: customerData.isVip,
        isBlocked: customerData.isBlocked,
      };
      
      const response = await apiService.post<BackendCliente>('/clientes', backendData);
      return convertBackendCliente(response);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao criar cliente');
    }
  },

  // Update existing customer
  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
    try {
      const backendData: Partial<BackendCliente> = {};
      
      if (customerData.name) backendData.nome = customerData.name;
      if (customerData.email) backendData.email = customerData.email;
      if (customerData.phone) backendData.telefone = customerData.phone;
      if (customerData.avatar) backendData.avatar = customerData.avatar;
      if (customerData.isVip !== undefined) backendData.isVip = customerData.isVip;
      if (customerData.isBlocked !== undefined) backendData.isBlocked = customerData.isBlocked;

      const response = await apiService.put<BackendCliente>(`/clientes/${id}`, backendData);
      return convertBackendCliente(response);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao atualizar cliente');
    }
  },

  // Delete customer
  async deleteCustomer(id: string): Promise<void> {
    try {
      await apiService.delete(`/clientes/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao deletar cliente');
    }
  },
};