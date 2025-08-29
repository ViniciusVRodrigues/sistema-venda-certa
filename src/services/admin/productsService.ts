import type { Product, Category, FilterOptions, PaginationData, SortOption } from '../../types';

// Mock data for categories
const mockCategories: Category[] = [
  { 
    id: '1', 
    name: 'Eletrônicos', 
    description: 'Produtos eletrônicos e acessórios', 
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  { 
    id: '2', 
    name: 'Roupas', 
    description: 'Vestuário e acessórios', 
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  { 
    id: '3', 
    name: 'Casa & Jardim', 
    description: 'Itens para casa e jardim', 
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  { 
    id: '4', 
    name: 'Esportes', 
    description: 'Equipamentos esportivos', 
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  { 
    id: '5', 
    name: 'Livros', 
    description: 'Livros e materiais educativos', 
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
];

// Mock data for products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone Samsung Galaxy',
    description: 'Smartphone com tela de 6.1" e câmera de 64MP',
    shortDescription: 'Smartphone Samsung com excelente qualidade',
    category: mockCategories[0],
    categoryId: '1',
    price: 1299.99,
    unit: 'un',
    stock: 15,
    status: 'active',
    images: ['/images/smartphone1.jpg', '/images/smartphone2.jpg'],
    tags: ['smartphone', 'samsung', 'android'],
    sku: 'SAMS-GAL-001',
    variations: [
      { 
        id: '1-1', 
        productId: '1',
        name: '128GB - Preto', 
        price: 1299.99, 
        stock: 10, 
        sku: 'SAMS-GAL-001-128-BK',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      { 
        id: '1-2', 
        productId: '1',
        name: '256GB - Branco', 
        price: 1499.99, 
        stock: 5, 
        sku: 'SAMS-GAL-001-256-WH',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Camiseta Básica',
    description: 'Camiseta de algodão 100% com corte moderno',
    shortDescription: 'Camiseta básica de algodão',
    category: mockCategories[1],
    categoryId: '2',
    price: 49.99,
    unit: 'un',
    stock: 50,
    status: 'active',
    images: ['/images/tshirt1.jpg'],
    tags: ['camiseta', 'algodão', 'básica'],
    sku: 'CAM-BAS-001',
    variations: [
      { 
        id: '2-1', 
        productId: '2',
        name: 'P - Azul', 
        price: 49.99, 
        stock: 15,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
      },
      { 
        id: '2-2', 
        productId: '2',
        name: 'M - Azul', 
        price: 49.99, 
        stock: 20,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
      },
      { 
        id: '2-3', 
        productId: '2',
        name: 'G - Azul', 
        price: 49.99, 
        stock: 15,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
      },
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Headset Gamer',
    description: 'Headset com microfone e som surround 7.1',
    shortDescription: 'Headset para jogos com qualidade premium',
    category: mockCategories[0],
    categoryId: '1',
    price: 299.99,
    unit: 'un',
    stock: 8,
    status: 'active',
    images: ['/images/headset1.jpg'],
    tags: ['headset', 'gamer', 'áudio'],
    sku: 'HEAD-GAM-001',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '4',
    name: 'Mesa de Escritório',
    description: 'Mesa de escritório em MDF com gavetas',
    shortDescription: 'Mesa funcional para escritório',
    category: mockCategories[2],
    categoryId: '3',
    price: 399.99,
    unit: 'un',
    stock: 3,
    status: 'active',
    images: ['/images/desk1.jpg'],
    tags: ['mesa', 'escritório', 'móveis'],
    sku: 'MES-ESC-001',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10'),
  }
];

interface ProductsResponse {
  products: Product[];
  pagination: PaginationData;
}

export const productsService = {
  // Get all products with filters, pagination and sorting
  async getProducts(
    filters: FilterOptions = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 },
    sort: SortOption = { field: 'updatedAt', direction: 'desc' }
  ): Promise<ProductsResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredProducts = [...mockProducts];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.id === filters.category
      );
    }

    // Apply status filter
    if (filters.status) {
      filteredProducts = filteredProducts.filter(product =>
        product.status === filters.status
      );
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      const aValue = a[sort.field as keyof Product] as any;
      const bValue = b[sort.field as keyof Product] as any;
      
      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / pagination.pageSize)
      }
    };
  },

  // Get single product by ID
  async getProduct(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockProducts.find(product => product.id === id) || null;
  },

  // Create new product
  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockProducts.push(newProduct);
    return newProduct;
  },

  // Update existing product
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const productIndex = mockProducts.findIndex(product => product.id === id);
    if (productIndex === -1) {
      throw new Error('Produto não encontrado');
    }

    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...productData,
      updatedAt: new Date()
    };

    return mockProducts[productIndex];
  },

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const productIndex = mockProducts.findIndex(product => product.id === id);
    if (productIndex === -1) {
      throw new Error('Produto não encontrado');
    }

    mockProducts.splice(productIndex, 1);
  },

  // Bulk actions
  async bulkUpdateStatus(productIds: string[], status: Product['status']): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    productIds.forEach(id => {
      const productIndex = mockProducts.findIndex(product => product.id === id);
      if (productIndex !== -1) {
        mockProducts[productIndex].status = status;
        mockProducts[productIndex].updatedAt = new Date();
      }
    });
  },

  async bulkDelete(productIds: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    productIds.forEach(id => {
      const productIndex = mockProducts.findIndex(product => product.id === id);
      if (productIndex !== -1) {
        mockProducts.splice(productIndex, 1);
      }
    });
  },

  // Get categories
  async getCategories(): Promise<Category[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCategories.filter(category => category.isActive);
  },

  // Create category
  async createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString()
    };

    mockCategories.push(newCategory);
    return newCategory;
  },

  // Get low stock products
  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockProducts.filter(product => product.stock <= threshold);
  }
};