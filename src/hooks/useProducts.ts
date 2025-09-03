import { useState, useEffect, useCallback } from 'react';
import type { Produto, Categoria, FilterOptions, PaginationData, SortOption } from '../types';
import { productsService } from '../services/admin/productsService';

interface UseProductsOptions {
  autoFetch?: boolean;
  initialFilters?: FilterOptions;
  initialPagination?: { page: number; pageSize: number };
  initialSort?: SortOption;
}

interface UseProductsResult {
  products: Produto[];
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  sort: SortOption;
  
  // Actions
  fetchProducts: () => Promise<void>;
  setFilters: (filters: FilterOptions) => void;
  setSort: (sort: SortOption) => void;
  setPage: (page: number) => void;
  
  // CRUD operations
  createProduct: (product: Omit<Produto, 'id'>) => Promise<Produto>;
  updateProduct: (id: number, product: Partial<Produto>) => Promise<Produto>;
  deleteProduct: (id: number) => Promise<void>;
  bulkUpdateStatus: (ids: number[], status: number) => Promise<void>;
  bulkDelete: (ids: number[]) => Promise<void>;
  
  // Utilities
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsResult => {
  const {
    autoFetch = true,
    initialFilters = {},
    initialPagination = { page: 1, pageSize: 10 },
    initialSort = { field: 'updatedAt', direction: 'desc' }
  } = options;

  const [products, setProducts] = useState<Produto[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<FilterOptions>(initialFilters);
  const [sort, setSortState] = useState<SortOption>(initialSort);
  const [paginationState, setPaginationState] = useState(initialPagination);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsService.getProducts(filters, paginationState, sort);
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, [filters, paginationState, sort]);

  const setFilters = useCallback((newFilters: FilterOptions) => {
    setFiltersState(newFilters);
    setPaginationState(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const setSort = useCallback((newSort: SortOption) => {
    setSortState(newSort);
    setPaginationState(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const setPage = useCallback((page: number) => {
    setPaginationState(prev => ({ ...prev, page }));
  }, []);

  const createProduct = useCallback(async (productData: Omit<Produto, 'id'>) => {
    try {
      setLoading(true);
      const newProduct = await productsService.createProduct(productData);
      await fetchProducts(); // Refresh the list
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar produto';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id: number, productData: Partial<Produto>) => {
    try {
      setLoading(true);
      const updatedProduct = await productsService.updateProduct(id, productData);
      await fetchProducts(); // Refresh the list
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar produto';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await productsService.deleteProduct(id);
      await fetchProducts(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir produto';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  const bulkUpdateStatus = useCallback(async (ids: number[], status: number) => {
    try {
      setLoading(true);
      await productsService.bulkUpdateStatus(ids, status);
      await fetchProducts(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar produtos';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  const bulkDelete = useCallback(async (ids: number[]) => {
    try {
      setLoading(true);
      await productsService.bulkDelete(ids);
      await fetchProducts(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir produtos';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [fetchProducts, autoFetch]);

  return {
    products,
    pagination,
    loading,
    error,
    filters,
    sort,
    fetchProducts,
    setFilters,
    setSort,
    setPage,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateStatus,
    bulkDelete,
    refetch: fetchProducts,
    clearError
  };
};

// Hook for getting single product
export const useProduct = (id: string | null) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProduct = await productsService.getProduct(id);
        setProduct(fetchedProduct);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

// Hook for categories
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCategories = await productsService.getCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (categoryData: Omit<Category, 'id'>) => {
    try {
      const newCategory = await productsService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar categoria';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    createCategory,
    refetch: fetchCategories
  };
};