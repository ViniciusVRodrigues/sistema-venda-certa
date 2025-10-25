import { useState, useEffect, useCallback } from 'react';
import type { Categoria, FilterOptions, PaginationData, SortOption } from '../types';
import { categoriesService } from '../services/admin/categoriesService';

interface UseCategoriesOptions {
  autoFetch?: boolean;
  initialFilters?: FilterOptions;
  initialSort?: SortOption;
}

interface UseCategoriesResult {
  categories: Categoria[];
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  sort: SortOption;
  
  // Actions
  fetchCategories: () => Promise<void>;
  setFilters: (filters: FilterOptions) => void;
  setSort: (sort: SortOption) => void;
  
  // Category operations
  createCategory: (category: Omit<Categoria, 'id'>) => Promise<Categoria>;
  updateCategory: (id: number, category: Partial<Categoria>) => Promise<Categoria>;
  deleteCategory: (id: number) => Promise<void>;
  toggleStatus: (id: number) => Promise<Categoria | null>;
  
  // Utilities
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useCategories = (options: UseCategoriesOptions = {}): UseCategoriesResult => {
  const {
    autoFetch = true,
    initialFilters = {},
    initialSort = { field: 'nome', order: 'asc' }
  } = options;

  const [categories, setCategories] = useState<Categoria[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<FilterOptions>(initialFilters);
  const [sort, setSortState] = useState<SortOption>(initialSort);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await categoriesService.getCategories(filters, sort);
      setCategories(result.categories);
      setPagination(result.pagination || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  const setFilters = useCallback((newFilters: FilterOptions) => {
    setFiltersState(newFilters);
  }, []);

  const setSort = useCallback((newSort: SortOption) => {
    setSortState(newSort);
  }, []);

  const createCategory = useCallback(async (category: Omit<Categoria, 'id'>) => {
    try {
      setLoading(true);
      const newCategory = await categoriesService.createCategory(category);
      await fetchCategories(); // Refresh the list
      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar categoria';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id: number, category: Partial<Categoria>) => {
    try {
      setLoading(true);
      const updatedCategory = await categoriesService.updateCategory(id, category);
      await fetchCategories(); // Refresh the list
      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar categoria';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await categoriesService.deleteCategory(id);
      await fetchCategories(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir categoria';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const toggleStatus = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const updatedCategory = await categoriesService.toggleCategoryStatus(id);
      await fetchCategories(); // Refresh the list
      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [autoFetch, fetchCategories]);

  return {
    categories,
    pagination,
    loading,
    error,
    filters,
    sort,
    fetchCategories,
    setFilters,
    setSort,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleStatus,
    refetch: fetchCategories,
    clearError,
  };
};
