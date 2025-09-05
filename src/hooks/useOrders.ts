import { useState, useEffect, useCallback } from 'react';
import type { Pedido, FilterOptions, PaginationData, SortOption } from '../types';
import { ordersService } from '../services/admin/ordersService';

interface UseOrdersOptions {
  autoFetch?: boolean;
  initialFilters?: FilterOptions & { paymentStatus?: string };
  initialPagination?: { page: number; pageSize: number };
  initialSort?: SortOption;
}

interface UseOrdersResult {
  orders: Pedido[];
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  filters: FilterOptions & { paymentStatus?: string };
  sort: SortOption;
  
  // Actions
  fetchOrders: () => Promise<void>;
  setFilters: (filters: FilterOptions & { paymentStatus?: string }) => void;
  setSort: (sort: SortOption) => void;
  setPage: (page: number) => void;
  
  // Order operations
  updateOrderStatus: (orderId: string, status: number, notes?: string) => Promise<Pedido>;
  updatePaymentStatus: (orderId: string, paymentStatus: number) => Promise<Pedido>;
  cancelOrder: (orderId: string, reason: string) => Promise<Pedido>;
  
  // Utilities
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useOrders = (options: UseOrdersOptions = {}): UseOrdersResult => {
  const {
    autoFetch = true,
    initialFilters = {},
    initialPagination = { page: 1, pageSize: 10 },
    initialSort = { field: 'createdAt', direction: 'desc' }
  } = options;

  const [orders, setOrders] = useState<Pedido[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<FilterOptions & { paymentStatus?: string }>(initialFilters);
  const [sort, setSortState] = useState<SortOption>(initialSort);
  const [paginationState, setPaginationState] = useState(initialPagination);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert string filters to numbers for schema compatibility
      const convertedFilters: any = {
        search: filters.search,
        dateRange: filters.dateRange,
        status: filters.status && filters.status !== 'all' ? Number(filters.status) : undefined,
        paymentStatus: filters.paymentStatus && filters.paymentStatus !== 'all' ? Number(filters.paymentStatus) : undefined,
      };
      
      const response = await ordersService.getOrders(convertedFilters, paginationState, sort);
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, [filters, paginationState, sort]);

  const setFilters = useCallback((newFilters: FilterOptions & { paymentStatus?: string }) => {
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

  const updateOrderStatus = useCallback(async (orderId: string, status: number, notes?: string) => {
    try {
      const updatedOrder = await ordersService.updateOrderStatus(Number(orderId), status, notes);
      if (updatedOrder) {
        setOrders(current => 
          current.map(order => 
            order.id === Number(orderId) ? updatedOrder : order
          )
        );
      }
      return updatedOrder;
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      throw error;
    }
  }, []);

  const updatePaymentStatus = useCallback(async (orderId: string, paymentStatus: number) => {
    try {
      setLoading(true);
      const updatedOrder = await ordersService.updatePaymentStatus(Number(orderId), paymentStatus);
      await fetchOrders(); // Refresh the list
      return updatedOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status do pagamento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  const cancelOrder = useCallback(async (orderId: string, reason: string) => {
    try {
      setLoading(true);
      const cancelledOrder = await ordersService.cancelOrder(Number(orderId), reason);
      await fetchOrders(); // Refresh the list
      return cancelledOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar pedido';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchOrders();
    }
  }, [fetchOrders, autoFetch]);

  return {
    orders,
    pagination,
    loading,
    error,
    filters,
    sort,
    fetchOrders,
    setFilters,
    setSort,
    setPage,
    updateOrderStatus: updateOrderStatus as (orderId: string, status: number, notes?: string) => Promise<Pedido>,
    updatePaymentStatus: updatePaymentStatus as (orderId: string, paymentStatus: number) => Promise<Pedido>,
    cancelOrder: cancelOrder as (orderId: string, reason: string) => Promise<Pedido>,
    refetch: fetchOrders,
    clearError
  };
};

// Hook for getting single order
export const useOrder = (id: number | null) => {
  const [order, setOrder] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setOrder(null);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedOrder = await ordersService.getOrder(id);
        setOrder(fetchedOrder);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar pedido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return { order, loading, error };
};

// Hook for getting orders grouped by status (for Kanban view)
export const useOrdersByStatus = () => {
  const [ordersByStatus, setOrdersByStatus] = useState<Record<number, Pedido[]>>({
    0: [], // recebido
    1: [], // processando
    2: [], // enviado
    3: [], // entregue
    4: []  // cancelado
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdersByStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Use getOrders to get all orders and group them by status
      const response = await ordersService.getOrders({}, { page: 1, pageSize: 1000 });
      const grouped = response.orders.reduce((acc, order) => {
        const status = order.status;
        if (!acc[status]) acc[status] = [];
        acc[status].push(order);
        return acc;
      }, {} as Record<number, Pedido[]>);
      
      setOrdersByStatus({
        0: grouped[0] || [],
        1: grouped[1] || [],
        2: grouped[2] || [],
        3: grouped[3] || [],
        4: grouped[4] || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos por status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdersByStatus();
  }, [fetchOrdersByStatus]);

  return {
    ordersByStatus,
    loading,
    error,
    refetch: fetchOrdersByStatus
  };
};