import type { Customer, Order, FilterOptions, PaginationData, SortOption } from '../../types';
import { mockUsuarios, mockEnderecos, mockPedidos } from '../mock/databaseMockData';
import { usuarioToCustomer, pedidoToOrder } from '../../utils/typeConverters';

// Convert database mock data to legacy format for backward compatibility
function getCustomersFromDatabase(): Customer[] {
  return mockUsuarios
    .filter(usuario => usuario.cargo === 'customer')
    .map(usuario => {
      // Get addresses for this user
      const addresses = mockEnderecos.filter(endereco => endereco.fk_usuario_id === usuario.id);
      
      // Get orders for this user
      const orders = mockPedidos.filter(pedido => pedido.fk_usuario_id === usuario.id);
      
      return usuarioToCustomer(usuario, addresses, orders);
    });
}

// Use the converted data
const mockCustomers: Customer[] = getCustomersFromDatabase();

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
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredCustomers = [...mockCustomers];

    // Apply search filter (name, email, phone)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone?.toLowerCase().includes(searchLower)
      );
    }

    // Apply VIP filter
    if (filters.vipOnly) {
      filteredCustomers = filteredCustomers.filter(customer => customer.isVip);
    }

    // Apply status filter
    if (filters.status) {
      if (filters.status === 'active') {
        filteredCustomers = filteredCustomers.filter(customer => !customer.isBlocked);
      } else if (filters.status === 'blocked') {
        filteredCustomers = filteredCustomers.filter(customer => customer.isBlocked);
      }
    }

    // Apply date range filter (registration date)
    if (filters.dateRange) {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.createdAt >= filters.dateRange!.start &&
        customer.createdAt <= filters.dateRange!.end
      );
    }

    // Apply sorting
    filteredCustomers.sort((a, b) => {
      const { field, direction } = sort;
      let aValue: any, bValue: any;

      switch (field) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'totalOrders':
          aValue = a.totalOrders;
          bValue = b.totalOrders;
          break;
        case 'totalSpent':
          aValue = a.totalSpent;
          bValue = b.totalSpent;
          break;
        case 'lastOrderDate':
          aValue = a.lastOrderDate?.getTime() || 0;
          bValue = b.lastOrderDate?.getTime() || 0;
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        default:
          aValue = a.name;
          bValue = b.name;
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
  async getCustomer(id: string | number): Promise<Customer | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const customerId = typeof id === 'string' ? parseInt(id) : id;
    const customer = mockCustomers.find(c => {
      const cId = typeof c.id === 'string' ? parseInt(c.id) : c.id;
      return cId === customerId;
    });
    
    return customer || null;
  },

  // Create new customer
  async createCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'addresses' | 'orders'>): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newCustomer: Customer = {
      ...customerData,
      id: (mockCustomers.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      addresses: [],
      orders: [],
      totalOrders: 0,
      totalSpent: 0
    };

    mockCustomers.push(newCustomer);
    return newCustomer;
  },

  // Update customer
  async updateCustomer(id: string | number, updates: Partial<Customer>): Promise<Customer | null> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const customerId = typeof id === 'string' ? parseInt(id) : id;
    const customerIndex = mockCustomers.findIndex(c => {
      const cId = typeof c.id === 'string' ? parseInt(c.id) : c.id;
      return cId === customerId;
    });

    if (customerIndex === -1) {
      return null;
    }

    const updatedCustomer = {
      ...mockCustomers[customerIndex],
      ...updates,
      updatedAt: new Date()
    };

    mockCustomers[customerIndex] = updatedCustomer;
    return updatedCustomer;
  },

  // Delete customer
  async deleteCustomer(id: string | number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const customerId = typeof id === 'string' ? parseInt(id) : id;
    const customerIndex = mockCustomers.findIndex(c => {
      const cId = typeof c.id === 'string' ? parseInt(c.id) : c.id;
      return cId === customerId;
    });

    if (customerIndex === -1) {
      return false;
    }

    mockCustomers.splice(customerIndex, 1);
    return true;
  },

  // Toggle customer VIP status
  async toggleVipStatus(id: string | number): Promise<Customer | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const customer = await this.getCustomer(id);
    if (!customer) {
      return null;
    }

    return this.updateCustomer(id, { isVip: !customer.isVip });
  },

  // Toggle customer blocked status
  async toggleBlockedStatus(id: string | number): Promise<Customer | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const customer = await this.getCustomer(id);
    if (!customer) {
      return null;
    }

    return this.updateCustomer(id, { isBlocked: !customer.isBlocked });
  },

  // Get customer statistics
  async getCustomerStats(): Promise<{
    total: number;
    active: number;
    blocked: number;
    vip: number;
    newThisMonth: number;
    totalRevenue: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = mockCustomers.reduce(
      (acc, customer) => {
        acc.total++;
        if (!customer.isBlocked) acc.active++;
        if (customer.isBlocked) acc.blocked++;
        if (customer.isVip) acc.vip++;
        if (customer.createdAt >= startOfMonth) acc.newThisMonth++;
        acc.totalRevenue += customer.totalSpent;
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

    return stats;
  },

  // Get customer orders
  async getCustomerOrders(customerId: string | number): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    // This would normally fetch from orders service
    // For now, return the orders already in the customer object
    const customer = await this.getCustomer(customerId);
    return customer?.orders || [];
  }
};