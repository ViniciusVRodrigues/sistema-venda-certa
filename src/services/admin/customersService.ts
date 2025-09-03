import type { Usuario, Endereco, Pedido, FilterOptions, PaginationData, SortOption } from '../../types';
import { mockUsuarios, mockEnderecos, mockPedidos } from '../mock/databaseMockData';

// Get customers directly from database schema
function getCustomersFromDatabase(): Usuario[] {
  return mockUsuarios.filter(usuario => usuario.cargo === 'customer');
}

// Use the database schema data
const mockCustomers: Usuario[] = getCustomersFromDatabase();

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
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredCustomers = [...mockCustomers];

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
  },

  // Get single customer by ID
  async getCustomer(id: number): Promise<Usuario | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const customer = mockCustomers.find(c => c.id === id);
    return customer || null;
  },

  // Create new customer
  async createCustomer(customerData: Partial<Usuario>): Promise<Usuario> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newCustomer: Usuario = {
      id: Math.max(...mockCustomers.map(c => c.id)) + 1,
      nome: customerData.nome || '',
      email: customerData.email || '',
      cargo: 'customer',
      numeroCelular: customerData.numeroCelular,
      status: customerData.status !== undefined ? customerData.status : 1,
      totalPedidos: customerData.totalPedidos || 0,
      totalGasto: customerData.totalGasto || 0,
      entregasFeitas: 0, // Customers don't make deliveries
      nota: customerData.nota
    };

    mockCustomers.push(newCustomer);
    return newCustomer;
  },

  // Update customer
  async updateCustomer(id: number, updates: Partial<Usuario>): Promise<Usuario | null> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const customerIndex = mockCustomers.findIndex(c => c.id === id);

    if (customerIndex === -1) {
      return null;
    }

    const customer = mockCustomers[customerIndex];
    const updatedCustomer: Usuario = {
      ...customer,
      ...updates,
      id: customer.id, // Prevent ID changes
      cargo: 'customer' // Ensure cargo remains customer
    };

    mockCustomers[customerIndex] = updatedCustomer;
    return updatedCustomer;
  },

  // Delete customer
  async deleteCustomer(id: number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const customerIndex = mockCustomers.findIndex(c => c.id === id);

    if (customerIndex === -1) {
      return false;
    }

    mockCustomers.splice(customerIndex, 1);
    return true;
  },

  // Toggle customer VIP status (based on nota)
  async toggleVipStatus(id: number): Promise<Usuario | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const customer = await this.getCustomer(id);
    if (!customer) {
      return null;
    }

    // VIP logic: if nota >= 4.5 set to 3.0, if nota < 4.5 set to 5.0
    const isCurrentlyVip = customer.nota && customer.nota >= 4.5;
    const newNota = isCurrentlyVip ? 3.0 : 5.0;

    return this.updateCustomer(id, { nota: newNota });
  },

  // Toggle customer blocked status
  async toggleBlockedStatus(id: number): Promise<Usuario | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const customer = await this.getCustomer(id);
    if (!customer) {
      return null;
    }

    const newStatus = customer.status === 1 ? 0 : 1;
    return this.updateCustomer(id, { status: newStatus });
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
    await new Promise(resolve => setTimeout(resolve, 200));

    const stats = mockCustomers.reduce(
      (acc, customer) => {
        acc.total++;
        if (customer.status === 1) acc.active++;
        if (customer.status === 0) acc.blocked++;
        if (customer.nota && customer.nota >= 4.5) acc.vip++;
        // newThisMonth can't be calculated without createdAt field in database schema
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
    const totalOrders = mockCustomers.reduce((sum, customer) => sum + customer.totalPedidos, 0);
    const averageTicket = totalOrders > 0 ? stats.totalRevenue / totalOrders : 0;

    return {
      ...stats,
      averageTicket
    };
  },

  // Get customer orders
  async getCustomerOrders(customerId: number): Promise<Pedido[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const orders = mockPedidos.filter(pedido => pedido.fk_usuario_id === customerId);
    return orders;
  },

  // Get customer addresses
  async getCustomerAddresses(customerId: number): Promise<Endereco[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const addresses = mockEnderecos.filter(endereco => endereco.fk_usuario_id === customerId);
    return addresses;
  }
};