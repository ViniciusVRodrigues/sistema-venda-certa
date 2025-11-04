import type { Produto, Categoria, FilterOptions, PaginationData, SortOption } from '../../types';
import { apiService } from '../api';
import { normalizeProduto, normalizeProdutos } from '../../utils/format';

interface ProductsResponse {
  products: Produto[];
  pagination: PaginationData;
}

export const productsService = {
  // Get all products with filters, pagination and sorting
  async getProducts(
    filters: FilterOptions & { categoryId?: number; status?: number; inStock?: boolean } = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 },
    sort: SortOption = { field: 'nome', direction: 'asc' }
  ): Promise<ProductsResponse> {
    try {
      const response = await apiService.get<{ data: Produto[] }>('/produtos');
      let rawProducts = response.data || [];
      
      // Normalize all products to ensure numeric fields are numbers
      let filteredProducts = normalizeProdutos(rawProducts);

    // Apply search filter (nome, sku, tags)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.nome.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.tags?.toLowerCase().includes(searchLower) ||
        product.descricao?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.categoryId || filters.category) {
      const categoryId = filters.categoryId || parseInt(filters.category || '0');
      if (categoryId > 0) {
        filteredProducts = filteredProducts.filter(product => product.fk_categoria_id === categoryId);
      }
    }

    // Apply status filter
    if (filters.status !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.status === filters.status);
    }

    // Apply stock filter
    if (filters.inStock !== undefined) {
      if (filters.inStock) {
        filteredProducts = filteredProducts.filter(product => product.estoque > 0);
      } else {
        filteredProducts = filteredProducts.filter(product => product.estoque === 0);
      }
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      const { field, direction } = sort;
      let aValue: string | number, bValue: string | number;

      switch (field) {
        case 'nome':
        case 'name':
          aValue = a.nome;
          bValue = b.nome;
          break;
        case 'sku':
          aValue = a.sku || '';
          bValue = b.sku || '';
          break;
        case 'preco':
        case 'price':
          aValue = a.preco;
          bValue = b.preco;
          break;
        case 'estoque':
        case 'stock':
          aValue = a.estoque;
          bValue = b.estoque;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
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
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product by ID
  async getProduct(id: number): Promise<Produto | null> {
    try {
      const response = await apiService.get<{ data: Produto }>(`/produtos/${id}`);
      const productData = response.data || null;
      return productData ? normalizeProduto(productData) : null;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  },

  // Create new product
  async createProduct(productData: Partial<Produto>): Promise<Produto> {
    try {
      const response = await apiService.post<{ data: Produto }>('/produtos', productData);
      return response.data!;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(id: number, updates: Partial<Produto>): Promise<Produto | null> {
    try {
      const response = await apiService.put<{ data: Produto }>(`/produtos/${id}`, updates);
      return response.data || null;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      return null;
    }
  },

  // Delete product
  async deleteProduct(id: number): Promise<boolean> {
    try {
      await apiService.delete(`/produtos/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      return false;
    }
  },

  // Get all categories
  async getCategories(): Promise<Categoria[]> {
    try {
      const response = await apiService.get<{ data: Categoria[] }>('/categorias');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Get single category by ID
  async getCategory(id: number): Promise<Categoria | null> {
    try {
      const response = await apiService.get<{ data: Categoria }>(`/categorias/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return null;
    }
  },

  // Create new category
  async createCategory(categoryData: Partial<Categoria>): Promise<Categoria> {
    try {
      const response = await apiService.post<{ data: Categoria }>('/categorias', categoryData);
      return response.data!;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update category
  async updateCategory(id: number, updates: Partial<Categoria>): Promise<Categoria | null> {
    try {
      const response = await apiService.put<{ data: Categoria }>(`/categorias/${id}`, updates);
      return response.data || null;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      return null;
    }
  },

  // Delete category
  async deleteCategory(id: number): Promise<boolean> {
    try {
      await apiService.delete(`/categorias/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      return false;
    }
  },

  // Toggle category active status
  async toggleCategoryStatus(id: number): Promise<Categoria | null> {
    try {
      const category = await this.getCategory(id);
      if (!category) {
        return null;
      }
      return this.updateCategory(id, { estaAtiva: !category.estaAtiva });
    } catch (error) {
      console.error(`Error toggling category status ${id}:`, error);
      return null;
    }
  },

  // Get product statistics
  async getProductStats(): Promise<{
    total: number;
    active: number;
    outOfStock: number;
    lowStock: number;
    totalValue: number;
  }> {
    try {
      const response = await apiService.get<{ data: Produto[] }>('/produtos');
      const rawProducts = response.data || [];
      const products = normalizeProdutos(rawProducts);

      const stats = products.reduce(
        (acc, product) => {
          acc.total++;
          if (product.status === 1) acc.active++;
          if (product.estoque === 0) acc.outOfStock++;
          if (product.estoque > 0 && product.estoque <= 10) acc.lowStock++;
          acc.totalValue += product.preco * product.estoque;
          return acc;
        },
        {
          total: 0,
          active: 0,
          outOfStock: 0,
          lowStock: 0,
          totalValue: 0
        }
      );

      return stats;
    } catch (error) {
      console.error('Error fetching product stats:', error);
      return {
        total: 0,
        active: 0,
        outOfStock: 0,
        lowStock: 0,
        totalValue: 0
      };
    }
  },

  // Get low stock products
  async getLowStockProducts(threshold: number = 10): Promise<Produto[]> {
    try {
      const response = await apiService.get<{ data: Produto[] }>('/produtos');
      const rawProducts = response.data || [];
      const products = normalizeProdutos(rawProducts);
      
      return products.filter(product => 
        product.estoque > 0 && product.estoque <= threshold && product.status === 1
      );
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      return [];
    }
  }
};