import { useState, useEffect, useCallback } from 'react';
import { deliveryOrderService } from '../../services/delivery/deliveryOrderService';
import type { Order } from '../../types';

interface DeliveryStats {
  totalPendingOrders: number;
  totalInRouteOrders: number;
  totalDeliveredToday: number;
  totalEarningsToday: number;
}

interface UseDeliveryOrdersResult {
  orders: Order[];
  stats: DeliveryStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: {
    status: string;
    search: string;
  };
  updateFilters: (newFilters: Partial<{ status: string; search: string }>) => void;
  changePage: (page: number) => void;
  refreshOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: 'shipped' | 'delivered', notes?: string) => Promise<void>;
  getOrderById: (orderId: string) => Promise<Order | null>;
}

export const useDeliveryOrders = (driverId: string): UseDeliveryOrdersResult => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DeliveryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  // Load orders
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await deliveryOrderService.getOrders(
        driverId,
        filters,
        { page: pagination.page, pageSize: pagination.pageSize }
      );
      
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, [driverId, filters, pagination.page, pagination.pageSize]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const statsData = await deliveryOrderService.getDashboardStats(driverId);
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  }, [driverId]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<{ status: string; search: string }>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Change page
  const changePage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // Refresh orders
  const refreshOrders = useCallback(async () => {
    await Promise.all([loadOrders(), loadStats()]);
  }, [loadOrders, loadStats]);

  // Update order status
  const updateOrderStatus = useCallback(async (
    orderId: string, 
    status: 'shipped' | 'delivered', 
    notes?: string
  ) => {
    try {
      await deliveryOrderService.updateOrderStatus(orderId, status, notes);
      await refreshOrders(); // Reload data
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      throw err;
    }
  }, [refreshOrders]);

  // Get order by ID
  const getOrderById = useCallback(async (orderId: string) => {
    try {
      return await deliveryOrderService.getOrderById(orderId);
    } catch (err) {
      console.error('Erro ao buscar pedido:', err);
      throw err;
    }
  }, []);

  // Load data on mount and when dependencies change
  useEffect(() => {
    if (driverId) {
      loadOrders();
    }
  }, [loadOrders, driverId]);

  useEffect(() => {
    if (driverId) {
      loadStats();
    }
  }, [loadStats, driverId]);

  return {
    orders,
    stats,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    refreshOrders,
    updateOrderStatus,
    getOrderById
  };
};