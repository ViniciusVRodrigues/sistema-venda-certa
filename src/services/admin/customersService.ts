import type { Usuario, Endereco, Pedido, FilterOptions, PaginationData, SortOption } from '../../types';
import { apiService } from '../api';

interface CustomersResponse {
  customers: Usuario[];
  pagination: PaginationData;
}

export const customersService = {
  // Get all customers with filters, pagination and sorting
  async getCustomers(
    filters: FilterOptions & { vipOnly?: boolean; status?: 'active' | 'blocked' } = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 },
    sort: SortOption = { field: 'totalGasto', direction: 'desc' }
  ): Promise<CustomersResponse> {
    try {
      const response = await apiService.get<{ data: Usuario[] }>('/usuarios');
      let filteredCustomers = (response.data || []).filter(usuario => usuario.cargo === 'customer');

    // Apply search filter (nome, email, numeroCelular)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.nome.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.numeroCelular?.toLowerCase().includes(searchLower)
      );
    }

    // Apply VIP filter (based on nota >= 4.5)
    if (filters.vipOnly) {
      filteredCustomers = filteredCustomers.filter(customer => customer.nota && customer.nota >= 4.5);
    }

    // Apply status filter
    if (filters.status) {
      if (filters.status === 'active') {
        filteredCustomers = filteredCustomers.filter(customer => customer.status === 1);
      } else if (filters.status === 'blocked') {
        filteredCustomers = filteredCustomers.filter(customer => customer.status === 0);
      }
    }

    // Note: dateRange filter cannot be implemented as createdAt doesn't exist in database schema
    // This would need to be added to the database schema if required

    // Apply sorting
    filteredCustomers.sort((a, b) => {
      const { field, direction } = sort;
      let aValue: string | number, bValue: string | number;

      switch (field) {
        case 'nome':
        case 'name':
          aValue = a.nome;
          bValue = b.nome;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'totalPedidos':
        case 'totalOrders':
          aValue = a.totalPedidos;
          bValue = b.totalPedidos;
          break;
        case 'totalGasto':
        case 'totalSpent':
          aValue = a.totalGasto;
          bValue = b.totalGasto;
          break;
        case 'nota':
          aValue = a.nota || 0;
          bValue = b.nota || 0;
          break;
        default:
          aValue = a.nome;
          bValue = b.nome;
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
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

      return {
        customers: paginatedCustomers,
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: filteredCustomers.length,
          totalPages: Math.ceil(filteredCustomers.length / pagination.pageSize)
        }
      };
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
  async createCustomer(customerData: Partial<Usuario>): Promise<Usuario> {
    try {
      const newCustomerData = {
        ...customerData,
        cargo: 'customer',
        status: customerData.status !== undefined ? customerData.status : 1,
        totalPedidos: customerData.totalPedidos || 0,
        totalGasto: customerData.totalGasto || 0,
        entregasFeitas: 0
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
        cargo: 'customer' // Ensure cargo remains customer
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

  // Toggle customer VIP status (based on nota)
  async toggleVipStatus(id: number): Promise<Usuario | null> {
    try {
      const customer = await this.getCustomer(id);
      if (!customer) {
        return null;
      }

      // VIP logic: if nota >= 4.5 set to 3.0, if nota < 4.5 set to 5.0
      const isCurrentlyVip = customer.nota && customer.nota >= 4.5;
      const newNota = isCurrentlyVip ? 3.0 : 5.0;

      return this.updateCustomer(id, { nota: newNota });
    } catch (error) {
      console.error(`Error toggling VIP status ${id}:`, error);
      return null;
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
    vip: number;
    newThisMonth: number;
    averageTicket: number;
    totalRevenue: number;
  }> {
    try {
      const response = await apiService.get<{ data: Usuario[] }>('/usuarios');
      const customers = (response.data || []).filter(usuario => usuario.cargo === 'customer');

      const stats = customers.reduce(
        (acc, customer) => {
          acc.total++;
          if (customer.status === 1) acc.active++;
          if (customer.status === 0) acc.blocked++;
          if (customer.nota && customer.nota >= 4.5) acc.vip++;
          acc.totalRevenue += customer.totalGasto;
          return acc;
        },
        {
          total: 0,
          active: 0,
          blocked: 0,
          vip: 0,
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
        vip: 0,
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