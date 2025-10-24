import { useState, useEffect, useCallback } from 'react';
import type { Usuario, FilterOptions, PaginationData, SortOption } from '../types';
import { customersService } from '../services/admin/customersService';

interface UseCustomersOptions {
  autoFetch?: boolean;
  initialFilters?: FilterOptions & { vipOnly?: boolean; status?: 'active' | 'blocked' };
  initialPagination?: { page: number; pageSize: number };
  initialSort?: SortOption;
}

interface UseCustomersResult {
  customers: Usuario[];
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  filters: FilterOptions & { vipOnly?: boolean; status?: 'active' | 'blocked' };
  sort: SortOption;
  
  // Actions
  fetchCustomers: () => Promise<void>;
  setFilters: (filters: FilterOptions & { vipOnly?: boolean; status?: 'active' | 'blocked' }) => void;
  setSort: (sort: SortOption) => void;
  setPage: (page: number) => void;
  
  // Customer operations
  updateVipStatus: (customerId: number, isVip: boolean) => Promise<Usuario>;
  updateBlockedStatus: (customerId: number, isBlocked: boolean) => Promise<Usuario>;
  createCustomer: (customer: Omit<Usuario, 'id'>) => Promise<Usuario>;
  updateCustomer: (id: number, customer: Partial<Usuario>) => Promise<Usuario>;
  deleteCustomer: (id: number) => Promise<void>;
  
  // Utilities
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useCustomers = (options: UseCustomersOptions = {}): UseCustomersResult => {
  const {
    autoFetch = true,
    initialFilters = {},
    initialPagination = { page: 1, pageSize: 10 },
    initialSort = { field: 'totalSpent', direction: 'desc' }
  } = options;

  const [customers, setCustomers] = useState<Usuario[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<FilterOptions & { status?: 'active' | 'blocked' }>(initialFilters);
  const [sort, setSortState] = useState<SortOption>(initialSort);
  const [paginationState, setPaginationState] = useState(initialPagination);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
  const response = await customersService.getCustomers(filters, paginationState, sort);
      setCustomers(response.customers);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, [filters, paginationState, sort]);

  const setFilters = useCallback((newFilters: FilterOptions & { vipOnly?: boolean; status?: 'active' | 'blocked' }) => {
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

  const updateVipStatus = useCallback(async (customerId: number) => {
    try {
      setLoading(true);
      const updatedCustomer = await customersService.toggleVipStatus(customerId);
      await fetchCustomers(); // Refresh the list
      return updatedCustomer!;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status VIP';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchCustomers]);

  const updateBlockedStatus = useCallback(async (customerId: number) => {
    try {
      setLoading(true);
      const updatedCustomer = await customersService.toggleBlockedStatus(customerId);
      await fetchCustomers(); // Refresh the list
      return updatedCustomer!;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status de bloqueio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchCustomers]);

  const createCustomer = useCallback(async (customerData: Omit<Usuario, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newCustomer = await customersService.createCustomer(customerData);
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cliente';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCustomer = useCallback(async (id: number, customerData: Partial<Usuario>) => {
    try {
      setLoading(true);
      const updatedCustomer = await customersService.updateCustomer(id, customerData);
      await fetchCustomers(); // Refresh the list
      return updatedCustomer!;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar cliente';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchCustomers]);

  const deleteCustomer = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await customersService.deleteCustomer(id);
      await fetchCustomers(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir cliente';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchCustomers]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchCustomers();
    }
  }, [fetchCustomers, autoFetch]);

  return {
    customers,
    pagination,
    loading,
    error,
    filters,
    sort,
    fetchCustomers,
    setFilters,
    setSort,
    setPage,
    updateVipStatus,
    updateBlockedStatus,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers,
    clearError
  };
};

// Hook for getting single customer
export const useCustomer = (id: string | null) => {
  const [customer, setCustomer] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setCustomer(null);
      return;
    }

    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCustomer = await customersService.getCustomer(parseInt(id));
        setCustomer(fetchedCustomer);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar cliente');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  return { customer, loading, error };
};

// Hook for customer statistics
export const useCustomerStats = () => {
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    blocked: number;
    vip: number;
    newThisMonth: number;
    averageTicket: number;
    totalRevenue: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const customerStats = await customersService.getCustomerStats();
      setStats(customerStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};