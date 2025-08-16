import { Product, Category, PaginationData, SortOption, FilterOptions } from '../../types';

// Mock data for development
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Tomate Orgânico',
    description: 'Tomates frescos cultivados sem agrotóxicos, ideais para saladas e cozinha.',
    shortDescription: 'Tomates orgânicos frescos',
    category: { id: '1', name: 'Vegetais', description: 'Vegetais frescos', isActive: true },
    price: 8.50,
    unit: 'kg',
    stock: 25,
    status: 'active' as const,
    images: [
      'https://images.unsplash.com/photo-1546470427-e26264be0b37?w=400',
      'https://images.unsplash.com/photo-1589927986089-35812388d922?w=400'
    ],
    tags: ['orgânico', 'fresco', 'vegetal'],
    sku: 'VEG001',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    variations: [
      { id: '1-1', name: '500g', price: 4.25, stock: 30, sku: 'VEG001-500' },
      { id: '1-2', name: '1kg', price: 8.50, stock: 25, sku: 'VEG001-1KG' }
    ]
  },
  {
    id: '2',
    name: 'Alface Crespa',
    description: 'Alface crespa fresca, perfeita para saladas nutritivas.',
    shortDescription: 'Alface crespa orgânica',
    category: { id: '1', name: 'Vegetais', description: 'Vegetais frescos', isActive: true },
    price: 3.50,
    unit: 'pé',
    stock: 40,
    status: 'active' as const,
    images: ['https://images.unsplash.com/photo-1556801711-7d5c8b933fa5?w=400'],
    tags: ['orgânico', 'folhas', 'salada'],
    sku: 'VEG002',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    name: 'Banana Prata',
    description: 'Bananas doces e nutritivas, fonte de potássio e energia.',
    shortDescription: 'Bananas frescas doces',
    category: { id: '2', name: 'Frutas', description: 'Frutas frescas', isActive: true },
    price: 5.90,
    unit: 'kg',
    stock: 15,
    status: 'active' as const,
    images: ['https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400'],
    tags: ['fruta', 'doce', 'potássio'],
    sku: 'FRT001',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: '4',
    name: 'Cenoura Orgânica',
    description: 'Cenouras doces e crocantes, ricas em betacaroteno.',
    shortDescription: 'Cenouras orgânicas doces',
    category: { id: '1', name: 'Vegetais', description: 'Vegetais frescos', isActive: true },
    price: 4.80,
    unit: 'kg',
    stock: 0,
    status: 'out_of_stock' as const,
    images: ['https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400'],
    tags: ['orgânico', 'raiz', 'betacaroteno'],
    sku: 'VEG003',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: '5',
    name: 'Maçã Gala',
    description: 'Maçãs crocantes e saborosas, ideais para lanches saudáveis.',
    shortDescription: 'Maçãs frescas crocantes',
    category: { id: '2', name: 'Frutas', description: 'Frutas frescas', isActive: true },
    price: 7.20,
    unit: 'kg',
    stock: 30,
    status: 'active' as const,
    images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'],
    tags: ['fruta', 'crocante', 'lanche'],
    sku: 'FRT002',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-20')
  }
];

export interface CatalogFilters {
  search?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  availability?: 'all' | 'in_stock' | 'out_of_stock';
  tags?: string[];
}

export interface CatalogSort {
  field: 'relevance' | 'price' | 'name' | 'created_at';
  direction: 'asc' | 'desc';
}

export interface CatalogResponse {
  products: Product[];
  pagination: PaginationData;
  filters: {
    categories: Category[];
    priceRange: { min: number; max: number };
    availableTags: string[];
  };
}

export const catalogService = {
  // Get products with filtering, sorting, and pagination
  async getProducts(
    filters: CatalogFilters = {},
    sort: CatalogSort = { field: 'relevance', direction: 'desc' },
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 12 }
  ): Promise<CatalogResponse> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay

    let filteredProducts = [...mockProducts];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.id === filters.category
      );
    }

    if (filters.priceRange) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= filters.priceRange!.min &&
        product.price <= filters.priceRange!.max
      );
    }

    if (filters.availability && filters.availability !== 'all') {
      if (filters.availability === 'in_stock') {
        filteredProducts = filteredProducts.filter(product => 
          product.status === 'active' && product.stock > 0
        );
      } else if (filters.availability === 'out_of_stock') {
        filteredProducts = filteredProducts.filter(product => 
          product.status === 'out_of_stock' || product.stock === 0
        );
      }
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.tags!.some(tag => product.tags.includes(tag))
      );
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let comparison = 0;
      
      switch (sort.field) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created_at':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'relevance':
        default:
          // For relevance, prioritize in-stock items and match strength
          const aScore = (a.status === 'active' && a.stock > 0) ? 1 : 0;
          const bScore = (b.status === 'active' && b.stock > 0) ? 1 : 0;
          comparison = bScore - aScore;
          break;
      }
      
      return sort.direction === 'asc' ? comparison : -comparison;
    });

    // Apply pagination
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / pagination.pageSize);
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Generate filter metadata
    const categories = Array.from(
      new Map(mockProducts.map(p => [p.category.id, p.category])).values()
    );
    
    const prices = mockProducts.map(p => p.price);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
    
    const availableTags = Array.from(
      new Set(mockProducts.flatMap(p => p.tags))
    );

    return {
      products: paginatedProducts,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total,
        totalPages
      },
      filters: {
        categories,
        priceRange,
        availableTags
      }
    };
  },

  // Get featured products for homepage
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockProducts
      .filter(p => p.status === 'active' && p.stock > 0)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  },

  // Get categories
  async getCategories(): Promise<Category[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return Array.from(
      new Map(mockProducts.map(p => [p.category.id, p.category])).values()
    ).filter(c => c.isActive);
  },

  // Search suggestions
  async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    if (!query || query.length < 2) return [];
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const queryLower = query.toLowerCase();
    const suggestions = new Set<string>();
    
    mockProducts.forEach(product => {
      // Add product names that match
      if (product.name.toLowerCase().includes(queryLower)) {
        suggestions.add(product.name);
      }
      
      // Add matching tags
      product.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, limit);
  }
};