import { useState, useEffect, useCallback } from 'react';
import { catalogService } from '../../services/customer/catalogService';
import type { CatalogFilters, CatalogSortOption, CatalogResponse } from '../../services/customer/catalogService';
import type { Produto, Categoria } from '../../types';

export const useCatalog = (
  initialFilters: CatalogFilters = {},
  initialSort: CatalogSortOption = { field: 'nome', direction: 'asc' },
  initialPageSize: number = 12
) => {
  const [data, setData] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  const [sort, setSort] = useState<CatalogSortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await catalogService.getProducts(
        filters,
        { page: currentPage, pageSize },
        sort
      );
      
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, [filters, sort, currentPage, pageSize]);

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to first page when filters or sort change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filters, sort, currentPage]);

  const updateFilters = useCallback((newFilters: Partial<CatalogFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const updateSort = useCallback((newSort: CatalogSortOption) => {
    setSort(newSort);
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    if (data && currentPage < data.pagination.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, data]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  return {
    // Data
    products: data?.products || [],
    pagination: data?.pagination || { page: 1, pageSize, total: 0, totalPages: 0 },
    availableFilters: data?.filters || { categories: [], priceRange: { min: 0, max: 100 }, availableTags: [] },
    
    // State
    loading,
    error,
    filters,
    sort,
    currentPage,
    pageSize,
    
    // Actions
    updateFilters,
    clearFilters,
    updateSort,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    refetch: fetchProducts
  };
};

export const useSearchSuggestions = (query: string, debounceMs: number = 300) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    
    const timer = setTimeout(async () => {
      try {
        // Como o catalogService não tem getSearchSuggestions, vamos criar uma implementação simples
        const results = await catalogService.getProducts(
          { search: query },
          { page: 1, pageSize: 5 }
        );
        const productSuggestions = results.products.map(product => product.nome);
        setSuggestions(productSuggestions);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  return { suggestions, loading };
};

export const useFeaturedProducts = (limit: number = 8) => {
  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const featuredProducts = await catalogService.getFeaturedProducts(limit);
        setProducts(featuredProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos em destaque');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  return { products, loading, error };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoriesData = await catalogService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};