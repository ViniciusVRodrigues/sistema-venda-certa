import type { Usuario, Endereco, Pedido, FilterOptions, PaginationData, SortOption } from '../../types';

// Interface para aceitar o campo password no cadastro de cliente
interface CustomerCreateData extends Partial<Usuario> {
  password?: string;
}
import { apiService } from '../api';

interface CustomersResponse {
  customers: Usuario[];
  pagination: PaginationData;
}

export const customersService = {
  // Get all customers with filters, pagination and sorting
  async getCustomers(
    filters: FilterOptions & { status?: 'active' | 'blocked' } = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 },
    sort: SortOption = { field: 'id', direction: 'desc' }
  ): Promise<CustomersResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        sortField: sort.field,
        sortDirection: sort.direction.toUpperCase(),
        ...(filters.search ? { search: filters.search } : {}),
        ...(filters.status ? { status: filters.status } : {})
      });

      const response = await apiService.get<{ success: boolean, data?: Usuario[], pagination?: PaginationData }>(`/usuarios?${queryParams.toString()}`);
      const customers = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
      const paginationResult = response.data?.pagination ?? {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: customers.length,
        totalPages: Math.ceil(customers.length / pagination.pageSize)
      };
      return { customers, pagination: paginationResult };
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Get single customer by ID
  async getCustomer(id: number): Promise<Usuario | null> {
    try {
      const response = await apiService.get<{ data: Usuario }>(`/usuarios/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      return null;
    }
  },

  // Create new customer
  async createCustomer(customerData: CustomerCreateData): Promise<Usuario> {
    try {
      // Get password from either password field (CustomerFormData) or senha field (Usuario)
      const senha = customerData.password ?? customerData.senha;
      
      const newCustomerData = {
        ...customerData,
        cargo: 'customer', // Backend validation expects 'customer', 'admin', or 'delivery'
        status: customerData.status !== undefined ? customerData.status : 1,
        totalPedidos: customerData.totalPedidos || 0,
        totalGasto: customerData.totalGasto || 0,
        entregasFeitas: 0,
        senha // Send password to backend
      };
      const response = await apiService.post<{ data: Usuario }>('/usuarios', newCustomerData);
      return response.data!;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Update customer
  async updateCustomer(id: number, updates: Partial<Usuario>): Promise<Usuario | null> {
    try {
      const updateData = {
        ...updates,
        cargo: 'customer' // Backend validation expects 'customer', 'admin', or 'delivery'
      };
      const response = await apiService.put<{ data: Usuario }>(`/usuarios/${id}`, updateData);
      return response.data || null;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      return null;
    }
  },

  // Delete customer
  async deleteCustomer(id: number): Promise<boolean> {
    try {
      await apiService.delete(`/usuarios/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      return false;
    }
  },

  // Toggle customer blocked status
  async toggleBlockedStatus(id: number): Promise<Usuario | null> {
    try {
      const customer = await this.getCustomer(id);
      if (!customer) {
        return null;
      }

      const newStatus = customer.status === 1 ? 0 : 1;
      return this.updateCustomer(id, { status: newStatus });
    } catch (error) {
      console.error(`Error toggling blocked status ${id}:`, error);
      return null;
    }
  },

  // Get customer statistics
  async getCustomerStats(): Promise<{
    total: number;
    active: number;
    blocked: number;
    newThisMonth: number;
    averageTicket: number;
    totalRevenue: number;
  }> {
    try {
  const response = await apiService.get<{ data?: { customers?: Usuario[], data?: Usuario[] } }>('/usuarios');
  const customersArr = response.data?.customers ?? response.data?.data ?? [];
  const customers = customersArr.filter((usuario: Usuario) => usuario.cargo === 'customer'); // Backend stores 'customer' in database

      const stats = customers.reduce(
        (acc, customer) => {
          acc.total++;
          if (customer.status === 1) acc.active++;
          if (customer.status === 0) acc.blocked++;
          acc.totalRevenue += customer.totalGasto;
          return acc;
        },
        {
          total: 0,
          active: 0,
          blocked: 0,
          newThisMonth: 0,
          totalRevenue: 0
        }
      );

      // Calculate average ticket
      const totalOrders = customers.reduce((sum, customer) => sum + customer.totalPedidos, 0);
      const averageTicket = totalOrders > 0 ? stats.totalRevenue / totalOrders : 0;

      return {
        ...stats,
        averageTicket
      };
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      return {
        total: 0,
        active: 0,
        blocked: 0,
        newThisMonth: 0,
        averageTicket: 0,
        totalRevenue: 0
      };
    }
  },

  // Get customer orders
  async getCustomerOrders(customerId: number): Promise<Pedido[]> {
    try {
      const response = await apiService.get<{ data: Pedido[] }>(`/pedidos/usuario/${customerId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching customer orders ${customerId}:`, error);
      return [];
    }
  },

  // Get customer addresses
  async getCustomerAddresses(customerId: number): Promise<Endereco[]> {
    try {
      const response = await apiService.get<{ data: Endereco[] }>(`/usuarios/${customerId}/enderecos`);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching customer addresses ${customerId}:`, error);
      return [];
    }
  }
};