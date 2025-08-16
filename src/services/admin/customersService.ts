import type { Customer, Order, FilterOptions, PaginationData, SortOption } from '../../types';

// Extended mock customers data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    role: 'customer',
    phone: '(11) 99999-1111',
    avatar: '/images/avatars/joao.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    addresses: [
      {
        id: '1',
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        isDefault: true
      },
      {
        id: '2',
        street: 'Av. Paulista',
        number: '1000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        isDefault: false
      }
    ],
    orders: [],
    isVip: false,
    isBlocked: false,
    totalOrders: 5,
    totalSpent: 1250.45,
    lastOrderDate: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    role: 'customer',
    phone: '(11) 99999-2222',
    avatar: '/images/avatars/maria.jpg',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18'),
    addresses: [
      {
        id: '3',
        street: 'Rua Augusta',
        number: '456',
        neighborhood: 'Consolação',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01305-000',
        isDefault: true
      }
    ],
    orders: [],
    isVip: true,
    isBlocked: false,
    totalOrders: 12,
    totalSpent: 2890.75,
    lastOrderDate: new Date('2024-01-22')
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro.costa@email.com',
    role: 'customer',
    phone: '(11) 99999-3333',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    addresses: [
      {
        id: '4',
        street: 'Rua Oscar Freire',
        number: '789',
        neighborhood: 'Jardins',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01426-001',
        isDefault: true
      }
    ],
    orders: [],
    isVip: false,
    isBlocked: false,
    totalOrders: 3,
    totalSpent: 567.89,
    lastOrderDate: new Date('2024-01-15')
  },
  {
    id: '4',
    name: 'Ana Oliveira',
    email: 'ana.oliveira@email.com',
    role: 'customer',
    phone: '(11) 99999-4444',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-14'),
    addresses: [
      {
        id: '5',
        street: 'Av. Faria Lima',
        number: '1234',
        complement: 'Sala 567',
        neighborhood: 'Itaim Bibi',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '04538-132',
        isDefault: true
      }
    ],
    orders: [],
    isVip: false,
    isBlocked: false,
    totalOrders: 8,
    totalSpent: 1890.32,
    lastOrderDate: new Date('2024-01-19')
  },
  {
    id: '5',
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@email.com',
    role: 'customer',
    phone: '(11) 99999-5555',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-10'),
    addresses: [
      {
        id: '6',
        street: 'Rua da Consolação',
        number: '987',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01301-000',
        isDefault: true
      }
    ],
    orders: [],
    isVip: false,
    isBlocked: true, // Blocked customer
    totalOrders: 2,
    totalSpent: 123.45,
    lastOrderDate: new Date('2024-01-10')
  },
  {
    id: '6',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@email.com',
    role: 'customer',
    phone: '(11) 99999-6666',
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-25'),
    addresses: [
      {
        id: '7',
        street: 'Av. Brigadeiro Faria Lima',
        number: '2000',
        neighborhood: 'Pinheiros',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '05426-200',
        isDefault: true
      }
    ],
    orders: [],
    isVip: true,
    isBlocked: false,
    totalOrders: 25,
    totalSpent: 5678.90,
    lastOrderDate: new Date('2024-01-25')
  }
];

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
      let aValue: any, bValue: any;
      
      if (sort.field === 'averageTicket') {
        aValue = a.totalOrders > 0 ? a.totalSpent / a.totalOrders : 0;
        bValue = b.totalOrders > 0 ? b.totalSpent / b.totalOrders : 0;
      } else {
        aValue = a[sort.field as keyof Customer] as any;
        bValue = b[sort.field as keyof Customer] as any;
      }
      
      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
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
  async getCustomer(id: string): Promise<Customer | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCustomers.find(customer => customer.id === id) || null;
  },

  // Get customer's order history
  async getCustomerOrders(customerId: string): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // This would normally fetch from orders service, but for mock purposes
    // we'll return a simplified version
    const mockOrders: Order[] = [
      {
        id: '001',
        customerId,
        customer: mockCustomers.find(c => c.id === customerId)!,
        items: [],
        total: 299.99,
        status: 'delivered',
        deliveryAddress: mockCustomers.find(c => c.id === customerId)?.addresses[0]!,
        deliveryMethod: {
          id: '1',
          name: 'Entrega Normal',
          description: '',
          type: 'delivery',
          price: 10,
          estimatedDays: 3,
          isActive: true
        },
        deliveryFee: 10,
        paymentMethod: {
          id: '1',
          name: 'PIX',
          type: 'pix',
          isActive: true
        },
        paymentStatus: 'paid',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-18'),
        timeline: []
      }
    ];

    return mockOrders;
  },

  // Update customer VIP status
  async updateVipStatus(customerId: string, isVip: boolean): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const customerIndex = mockCustomers.findIndex(customer => customer.id === customerId);
    if (customerIndex === -1) {
      throw new Error('Cliente não encontrado');
    }

    mockCustomers[customerIndex].isVip = isVip;
    mockCustomers[customerIndex].updatedAt = new Date();

    return mockCustomers[customerIndex];
  },

  // Update customer blocked status
  async updateBlockedStatus(customerId: string, isBlocked: boolean): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const customerIndex = mockCustomers.findIndex(customer => customer.id === customerId);
    if (customerIndex === -1) {
      throw new Error('Cliente não encontrado');
    }

    mockCustomers[customerIndex].isBlocked = isBlocked;
    mockCustomers[customerIndex].updatedAt = new Date();

    return mockCustomers[customerIndex];
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

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      total: mockCustomers.length,
      active: mockCustomers.filter(c => !c.isBlocked).length,
      blocked: mockCustomers.filter(c => c.isBlocked).length,
      vip: mockCustomers.filter(c => c.isVip).length,
      newThisMonth: mockCustomers.filter(c => c.createdAt >= monthStart).length,
      averageTicket: 0,
      totalRevenue: 0
    };

    const totalSpent = mockCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const totalOrders = mockCustomers.reduce((sum, customer) => sum + customer.totalOrders, 0);

    stats.averageTicket = totalOrders > 0 ? totalSpent / totalOrders : 0;
    stats.totalRevenue = totalSpent;

    return stats;
  },

  // Get top customers by spending
  async getTopCustomers(limit: number = 10): Promise<Customer[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    return [...mockCustomers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  },

  // Search customers (enhanced search with multiple criteria)
  async searchCustomers(query: string): Promise<Customer[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const queryLower = query.toLowerCase();
    return mockCustomers.filter(customer =>
      customer.name.toLowerCase().includes(queryLower) ||
      customer.email.toLowerCase().includes(queryLower) ||
      customer.phone?.toLowerCase().includes(queryLower) ||
      customer.addresses.some(address => 
        address.neighborhood.toLowerCase().includes(queryLower) ||
        address.city.toLowerCase().includes(queryLower) ||
        address.zipCode.includes(query)
      )
    );
  }
};