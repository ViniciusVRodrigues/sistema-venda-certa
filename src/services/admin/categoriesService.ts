import type { Categoria, FilterOptions, PaginationData, SortOption } from '../../types';
import { apiService } from '../api';

interface CategoriesResponse {
  categories: Categoria[];
  data?: Categoria[];
  pagination?: PaginationData;
}

export const categoriesService = {
  // Get all categories
  async getCategories(filters?: FilterOptions, sort?: SortOption): Promise<{ categories: Categoria[]; pagination?: PaginationData }> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.search) {
        params.append('search', filters.search);
      }
      
      if (sort?.field) {
        params.append('sortBy', sort.field);
        params.append('order', sort.order || 'asc');
      }

      const queryString = params.toString();
      const endpoint = queryString ? `/categorias?${queryString}` : '/categorias';
      
      const response = await apiService.get<CategoriesResponse>(endpoint);
      
      // Handle different response formats
      const categories = response.data?.categories || response.data?.data || [];
      
      return {
        categories,
        pagination: response.data?.pagination
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get active categories only
  async getActiveCategories(): Promise<Categoria[]> {
    try {
      const response = await apiService.get<{ data?: Categoria[] }>('/categorias/ativas');
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching active categories:', error);
      throw error;
    }
  },

  // Get single category by ID
  async getCategory(id: number): Promise<Categoria | null> {
    try {
      const response = await apiService.get<{ data?: Categoria }>(`/categorias/${id}`);
      return response.data?.data || null;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return null;
    }
  },

  // Create new category
  async createCategory(categoryData: Omit<Categoria, 'id'>): Promise<Categoria> {
    try {
      const response = await apiService.post<{ data: Categoria }>('/categorias', categoryData);
      return response.data!;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update category
  async updateCategory(id: number, categoryData: Partial<Categoria>): Promise<Categoria> {
    try {
      const response = await apiService.put<{ data: Categoria }>(`/categorias/${id}`, categoryData);
      return response.data!;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  // Delete category
  async deleteCategory(id: number): Promise<void> {
    try {
      await apiService.delete(`/categorias/${id}`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
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
};
