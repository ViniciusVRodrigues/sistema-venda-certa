import type { Product, Category, FilterOptions, PaginationData, SortOption } from '../../types';
import { apiService, type ApiError } from '../api';

// Backend API interfaces
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

function convertProductToBackend(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Partial<BackendProduct> {
  return {
    nome: product.name,
    descricao: product.description,
    descricaoBreve: product.shortDescription,
    preco: product.price,
    unidade: product.unit,
    estoque: product.stock,
    status: product.status === 'active' ? 'ativo' : 
           product.status === 'inactive' ? 'inativo' : 'fora_estoque',
    imagens: product.images,
    tags: product.tags,
    sku: product.sku,
    categoriaId: parseInt(product.category.id),
  };
}

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
    try {
      const params = new URLSearchParams();
      
      // Add pagination
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());
      
      // Add sorting
      params.append('sortBy', sort.field);
      params.append('sortOrder', sort.direction);
      
      // Add filters
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.category) {
        params.append('categoria', filters.category);
      }
      if (filters.status) {
        const backendStatus = filters.status === 'active' ? 'ativo' : 
                            filters.status === 'inactive' ? 'inativo' : 'fora_estoque';
        params.append('status', backendStatus);
      }

      const response = await apiService.get<BackendProductsResponse>(`/produtos?${params.toString()}`);
      
      return {
        products: response.produtos.map(convertBackendProduct),
        pagination: {
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          totalPages: response.totalPages,
        },
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao buscar produtos');
    }
  },

  // Get single product by ID
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

  // Create new product
  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const backendData = convertProductToBackend(productData);
      const response = await apiService.post<BackendProduct>('/produtos', backendData);
      return convertBackendProduct(response);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao criar produto');
    }
  },

  // Update existing product
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const backendData: Partial<BackendProduct> = {};
      
      if (productData.name) backendData.nome = productData.name;
      if (productData.description) backendData.descricao = productData.description;
      if (productData.shortDescription) backendData.descricaoBreve = productData.shortDescription;
      if (productData.price !== undefined) backendData.preco = productData.price;
      if (productData.unit) backendData.unidade = productData.unit;
      if (productData.stock !== undefined) backendData.estoque = productData.stock;
      if (productData.status) {
        backendData.status = productData.status === 'active' ? 'ativo' : 
                            productData.status === 'inactive' ? 'inativo' : 'fora_estoque';
      }
      if (productData.images) backendData.imagens = productData.images;
      if (productData.tags) backendData.tags = productData.tags;
      if (productData.sku) backendData.sku = productData.sku;
      if (productData.category) backendData.categoriaId = parseInt(productData.category.id);

      const response = await apiService.put<BackendProduct>(`/produtos/${id}`, backendData);
      return convertBackendProduct(response);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao atualizar produto');
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    try {
      await apiService.delete(`/produtos/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao deletar produto');
    }
  },

  // Bulk actions
  async bulkUpdateStatus(productIds: string[], status: Product['status']): Promise<void> {
    try {
      const backendStatus = status === 'active' ? 'ativo' : 
                          status === 'inactive' ? 'inativo' : 'fora_estoque';
      
      await apiService.patch('/produtos/bulk/status', {
        ids: productIds.map(id => parseInt(id)),
        status: backendStatus,
      });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao atualizar status dos produtos');
    }
  },

  async bulkDelete(productIds: string[]): Promise<void> {
    try {
      await apiService.post('/produtos/bulk/delete', {
        ids: productIds.map(id => parseInt(id)),
      });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao deletar produtos');
    }
  },

  // Get categories
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

  // Create category
  async createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    try {
      const backendData = {
        nome: categoryData.name,
        descricao: categoryData.description,
        ativo: categoryData.isActive,
      };
      
      const response = await apiService.post<BackendCategory>('/categorias', backendData);
      return convertBackendCategory(response);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao criar categoria');
    }
  },

  // Get low stock products
  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    try {
      const response = await apiService.get<BackendProduct[]>(`/produtos/low-stock?threshold=${threshold}`);
      return response.map(convertBackendProduct);
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Erro ao buscar produtos com estoque baixo');
    }
  },
};