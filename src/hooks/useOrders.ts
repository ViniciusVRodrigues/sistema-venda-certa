import { useState, useEffect, useCallback } from 'react';
import type { Order, FilterOptions, PaginationData, SortOption } from '../types';
import { ordersService } from '../services/admin/ordersService';

interface UseOrdersOptions {
  autoFetch?: boolean;
  initialFilters?: FilterOptions & { paymentStatus?: string };
  initialPagination?: { page: number; pageSize: number };
  initialSort?: SortOption;
}

interface UseOrdersResult {
  orders: Order[];
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
  updateOrderStatus: (orderId: string, status: Order['status'], notes?: string) => Promise<Order>;
  updatePaymentStatus: (orderId: string, paymentStatus: Order['paymentStatus']) => Promise<Order>;
  cancelOrder: (orderId: string, reason: string) => Promise<Order>;
  deleteOrder: (orderId: string) => Promise<void>;
  addOrderNote: (orderId: string, note: string) => Promise<Order>;
  resendNotification: (orderId: string, type: 'status_update' | 'payment_reminder') => Promise<void>;
  generateReceipt: (orderId: string) => Promise<string>;
  
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

  const [orders, setOrders] = useState<Order[]>([]);
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
      
      const response = await ordersService.getOrders(filters, paginationState, sort);
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

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status'], notes?: string) => {
    try {
      setLoading(true);
      const updatedOrder = await ordersService.updateOrderStatus(orderId, status, notes);
      await fetchOrders(); // Refresh the list
      return updatedOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status do pedido';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  const updatePaymentStatus = useCallback(async (orderId: string, paymentStatus: Order['paymentStatus']) => {
    try {
      setLoading(true);
      const updatedOrder = await ordersService.updatePaymentStatus(orderId, paymentStatus);
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
      const cancelledOrder = await ordersService.cancelOrder(orderId, reason);
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

  const deleteOrder = useCallback(async (orderId: string) => {
    try {
      setLoading(true);
      await ordersService.deleteOrder(orderId);
      await fetchOrders(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir pedido';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  const addOrderNote = useCallback(async (orderId: string, note: string) => {
    try {
      const updatedOrder = await ordersService.addOrderNote(orderId, note);
      await fetchOrders(); // Refresh the list
      return updatedOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar observação';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchOrders]);

  const resendNotification = useCallback(async (orderId: string, type: 'status_update' | 'payment_reminder') => {
    try {
      await ordersService.resendNotification(orderId, type);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reenviar notificação';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const generateReceipt = useCallback(async (orderId: string) => {
    try {
      return await ordersService.generateReceipt(orderId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar comprovante';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

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
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    deleteOrder,
    addOrderNote,
    resendNotification,
    generateReceipt,
    refetch: fetchOrders,
    clearError
  };
};

// Hook for getting single order
export const useOrder = (id: string | null) => {
  const [order, setOrder] = useState<Order | null>(null);
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
  const [ordersByStatus, setOrdersByStatus] = useState<Record<Order['status'], Order[]>>({
    'received': [],
    'processing': [],
    'shipped': [],
    'delivered': [],
    'cancelled': []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdersByStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const grouped = await ordersService.getOrdersByStatus();
      setOrdersByStatus(grouped);
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