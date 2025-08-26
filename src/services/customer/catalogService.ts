import type { Product, Category, PaginationData } from '../../types';
import { apiService, type ApiError } from '../api';

// Backend API interfaces - reusing from admin service
interface BackendProduct {
  id: number;
  nome: string;
  descricao: string;
  descricaoBreve?: string;
  preco: number;
  unidade: string;
  estoque: number;
  status: 'ativo' | 'inativo' | 'fora_estoque';
  imagens: string[];
  tags: string[];
  sku?: string;
  marca?: string;
  peso?: number;
  dimensoes?: string;
  avaliacaoMedia?: number;
  totalVendas?: number;
  categoriaId?: number;
  categoria?: BackendCategory;
  createdAt: string;
  updatedAt: string;
}

interface BackendCategory {
  id: number;
  nome: string;
  descricao?: string;
  slug: string;
  cor?: string;
  icone?: string;
  ativo: boolean;
  parentId?: number;
  parent?: BackendCategory;
  children?: BackendCategory[];
  totalProdutos?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendProductsResponse {
  produtos: BackendProduct[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
}

// Conversion functions
function convertBackendCategory(backendCategory: BackendCategory): Category {
  return {
    id: backendCategory.id.toString(),
    name: backendCategory.nome,
    description: backendCategory.descricao,
    isActive: backendCategory.ativo,
  };
}

function convertBackendProduct(backendProduct: BackendProduct): Product {
  return {
    id: backendProduct.id.toString(),
    name: backendProduct.nome,
    description: backendProduct.descricao,
    shortDescription: backendProduct.descricaoBreve,
    category: backendProduct.categoria ? convertBackendCategory(backendProduct.categoria) : {
      id: backendProduct.categoriaId?.toString() || '0',
      name: 'Sem categoria',
      isActive: true,
    },
    price: backendProduct.preco,
    unit: backendProduct.unidade,
    stock: backendProduct.estoque,
    status: backendProduct.status === 'ativo' ? 'active' : 
           backendProduct.status === 'inativo' ? 'inactive' : 'out_of_stock',
    images: backendProduct.imagens,
    tags: backendProduct.tags,
    sku: backendProduct.sku,
    createdAt: new Date(backendProduct.createdAt),
    updatedAt: new Date(backendProduct.updatedAt),
  };
}

export interface ProductFilters {
  search?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  tags?: string[];
  inStock?: boolean;
}

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
  totalProducts: number;
}

export const catalogService = {
  // Get products for catalog with filters
  async getProducts(
    filters: CatalogFilters = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 12 },
    sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'name' = 'relevance'
  ): Promise<CatalogResponse> {
    try {
      const params = new URLSearchParams();
      
      // Add pagination
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());
      
      // Add sorting
      switch (sortBy) {
        case 'price-asc':
          params.append('sortBy', 'preco');
          params.append('sortOrder', 'asc');
          break;
        case 'price-desc':
          params.append('sortBy', 'preco');
          params.append('sortOrder', 'desc');
          break;
        case 'newest':
          params.append('sortBy', 'createdAt');
          params.append('sortOrder', 'desc');
          break;
        case 'name':
          params.append('sortBy', 'nome');
          params.append('sortOrder', 'asc');
          break;
        default:
          // For relevance, let backend decide
          break;
      }
      
      // Add filters
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.category) {
        params.append('categoria', filters.category);
      }
      if (filters.priceRange?.min !== undefined) {
        params.append('precoMin', filters.priceRange.min.toString());
      }
      if (filters.priceRange?.max !== undefined) {
        params.append('precoMax', filters.priceRange.max.toString());
      }
      if (filters.availability === 'in_stock') {
        params.append('emEstoque', 'true');
      }
      
      // Only show active products for customers
      params.append('status', 'ativo');

      const response = await apiService.get<BackendProductsResponse>(`/produtos?${params.toString()}`);
      
      return {
        products: response.produtos.map(convertBackendProduct),
        pagination: {
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          totalPages: response.totalPages,
        },
        totalProducts: response.total,
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao buscar produtos');
    }
  },

  // Get single product by ID with full details
  async getProduct(id: string): Promise<Product | null> {
    try {
      const response = await apiService.get<BackendProduct>(`/produtos/${id}`);
      return convertBackendProduct(response);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 404) {
        return null;
      }
      throw new Error(apiError.message || 'Erro ao buscar produto');
    }
  },

  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiService.get<BackendCategory[]>('/categorias');
      return response
        .filter(category => category.ativo)
        .map(convertBackendCategory);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao buscar categorias');
    }
  },

  // Get category tree with product counts
  async getCategoryTree(): Promise<Category[]> {
    try {
      const response = await apiService.get<BackendCategory[]>('/categorias/tree');
      return response
        .filter(category => category.ativo)
        .map(convertBackendCategory);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao buscar árvore de categorias');
    }
  },

  // Search products
  async searchProducts(
    query: string,
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 12 }
  ): Promise<CatalogResponse> {
    return this.getProducts(
      { search: query },
      pagination,
      'relevance'
    );
  },

  // Get featured products
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
      const response = await apiService.get<BackendProduct[]>(`/produtos/featured?limit=${limit}`);
      return response.map(convertBackendProduct);
    } catch (error) {
      // If featured endpoint doesn't exist, get best selling products
      try {
        const fallbackResponse = await apiService.get<BackendProductsResponse>(`/produtos?sortBy=totalVendas&sortOrder=desc&pageSize=${limit}`);
        return fallbackResponse.produtos.map(convertBackendProduct);
      } catch (fallbackError) {
        const apiError = fallbackError as ApiError;
        throw new Error(apiError.message || 'Erro ao buscar produtos em destaque');
      }
    }
  },

  // Get products by category
  async getProductsByCategory(
    categoryId: string,
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 12 },
    sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'name' = 'relevance'
  ): Promise<CatalogResponse> {
    return this.getProducts(
      { category: categoryId },
      pagination,
      sortBy
    );
  },

  // Get related products
  async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    try {
      // First get the product to know its category
      const product = await this.getProduct(productId);
      if (!product) {
        return [];
      }

      // Get products from the same category, excluding the current product
      const response = await this.getProductsByCategory(
        product.category.id,
        { page: 1, pageSize: limit + 1 }
      );

      // Filter out the current product and limit results
      return response.products
        .filter(p => p.id !== productId)
        .slice(0, limit);
    } catch (error) {
      console.warn('Erro ao buscar produtos relacionados:', error);
      return [];
    }
  },

  // Get price range for a category
  async getPriceRange(categoryId?: string): Promise<{ min: number; max: number }> {
    try {
      const params = new URLSearchParams();
      if (categoryId) {
        params.append('categoria', categoryId);
      }
      
      const response = await apiService.get<{ precoMin: number; precoMax: number }>(`/produtos/price-range?${params.toString()}`);
      return {
        min: response.precoMin,
        max: response.precoMax,
      };
    } catch (error) {
      // Return default range if endpoint doesn't exist
      return { min: 0, max: 1000 };
    }
  },

  // Get search suggestions
  async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    if (!query || query.length < 2) return [];
    
    try {
      const response = await apiService.get<string[]>(`/produtos/search-suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response;
    } catch (error) {
      // Return empty array if endpoint doesn't exist or fails
      return [];
    }
  },
};

