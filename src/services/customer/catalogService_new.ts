import type { Produto, Categoria, PaginationData } from '../../types';
import { mockProdutos, mockCategorias } from '../mock/databaseMockData';

// Use database schema data
const mockProducts: Produto[] = [...mockProdutos];
const mockCategories: Categoria[] = [...mockCategorias];

export interface CatalogFilters {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
}

export interface CatalogSortOption {
  field: 'nome' | 'preco' | 'estoque';
  direction: 'asc' | 'desc';
}

export interface CatalogResponse {
  products: Produto[];
  pagination: PaginationData;
  filters: {
    categories: Categoria[];
    priceRange: { min: number; max: number };
    availableTags: string[];
  };
}

export const catalogService = {
  // Get products for catalog with filters, pagination and sorting
  async getProducts(
    filters: CatalogFilters = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 12 },
    sort: CatalogSortOption = { field: 'nome', direction: 'asc' }
  ): Promise<CatalogResponse> {
    await new Promise(resolve => setTimeout(resolve, 400));

    let filteredProducts = mockProducts.filter(product => product.status === 1); // Only active products

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.nome.toLowerCase().includes(searchLower) ||
        product.descricao?.toLowerCase().includes(searchLower) ||
        product.tags?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.categoryId) {
      filteredProducts = filteredProducts.filter(product => product.fk_categoria_id === filters.categoryId);
    }

    // Apply price range filter
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.preco >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.preco <= filters.maxPrice!);
    }

    // Apply stock filter
    if (filters.inStock !== undefined) {
      if (filters.inStock) {
        filteredProducts = filteredProducts.filter(product => product.estoque > 0);
      } else {
        filteredProducts = filteredProducts.filter(product => product.estoque === 0);
      }
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        if (!product.tags) return false;
        const productTags = product.tags.toLowerCase().split(',').map(tag => tag.trim());
        return filters.tags!.some(filterTag => 
          productTags.includes(filterTag.toLowerCase())
        );
      });
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      const { field, direction } = sort;
      let aValue: string | number, bValue: string | number;

      switch (field) {
        case 'nome':
          aValue = a.nome;
          bValue = b.nome;
          break;
        case 'preco':
          aValue = a.preco;
          bValue = b.preco;
          break;
        case 'estoque':
          aValue = a.estoque;
          bValue = b.estoque;
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

    // Calculate filter options
    const priceRange = {
      min: Math.min(...mockProducts.filter(p => p.status === 1).map(p => p.preco)),
      max: Math.max(...mockProducts.filter(p => p.status === 1).map(p => p.preco))
    };

    const availableTags = Array.from(
      new Set(
        mockProducts
          .filter(p => p.status === 1 && p.tags)
          .flatMap(p => p.tags!.split(',').map(tag => tag.trim()))
      )
    );

    const activeCategories = mockCategories.filter(cat => cat.estaAtiva);

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
      },
      filters: {
        categories: activeCategories,
        priceRange,
        availableTags
      }
    };
  },

  // Get single product by ID
  async getProduct(id: number): Promise<Produto | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const product = mockProducts.find(p => p.id === id && p.status === 1);
    return product || null;
  },

  // Get featured products
  async getFeaturedProducts(limit: number = 8): Promise<Produto[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get products with high stock as featured products
    return mockProducts
      .filter(product => product.status === 1 && product.estoque > 10)
      .sort((a, b) => b.estoque - a.estoque)
      .slice(0, limit);
  },

  // Get products by category
  async getProductsByCategory(categoryId: number, limit?: number): Promise<Produto[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let products = mockProducts.filter(
      product => product.fk_categoria_id === categoryId && product.status === 1
    );

    if (limit) {
      products = products.slice(0, limit);
    }

    return products;
  },

  // Get related products (from same category)
  async getRelatedProducts(productId: number, limit: number = 4): Promise<Produto[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return [];

    return mockProducts
      .filter(p => 
        p.fk_categoria_id === product.fk_categoria_id && 
        p.id !== productId && 
        p.status === 1
      )
      .slice(0, limit);
  },

  // Search products
  async searchProducts(query: string, limit: number = 10): Promise<Produto[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (!query.trim()) return [];

    const searchLower = query.toLowerCase();
    return mockProducts
      .filter(product => 
        product.status === 1 && (
          product.nome.toLowerCase().includes(searchLower) ||
          product.descricao?.toLowerCase().includes(searchLower) ||
          product.tags?.toLowerCase().includes(searchLower)
        )
      )
      .slice(0, limit);
  },

  // Get all categories
  async getCategories(): Promise<Categoria[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockCategories.filter(category => category.estaAtiva);
  },

  // Get category by ID
  async getCategory(id: number): Promise<Categoria | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const category = mockCategories.find(c => c.id === id && c.estaAtiva);
    return category || null;
  },

  // Get product recommendations based on customer's purchase history
  async getRecommendations(customerId?: number, limit: number = 6): Promise<Produto[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock implementation - in real app would use ML algorithms
    // For now, just return best selling products
    return mockProducts
      .filter(product => product.status === 1 && product.estoque > 0)
      .sort((a, b) => b.preco - a.preco) // Sort by price as proxy for popularity
      .slice(0, limit);
  },

  // Get products on sale/promotion
  async getPromotionalProducts(limit: number = 8): Promise<Produto[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock implementation - in real app would have actual promotion logic
    // For now, return products with prices ending in .99
    return mockProducts
      .filter(product => 
        product.status === 1 && 
        product.estoque > 0 &&
        product.preco.toString().endsWith('.99')
      )
      .slice(0, limit);
  },

  // Get new products (recently added)
  async getNewProducts(limit: number = 6): Promise<Produto[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock implementation - in real app would sort by creation date
    // For now, return products with higher IDs
    return mockProducts
      .filter(product => product.status === 1)
      .sort((a, b) => b.id - a.id)
      .slice(0, limit);
  },

  // Check product availability
  async checkAvailability(productId: number, quantity: number = 1): Promise<{
    available: boolean;
    stock: number;
    maxQuantity: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const product = mockProducts.find(p => p.id === productId);
    
    if (!product || product.status !== 1) {
      return { available: false, stock: 0, maxQuantity: 0 };
    }

    return {
      available: product.estoque >= quantity,
      stock: product.estoque,
      maxQuantity: product.estoque
    };
  }
};
