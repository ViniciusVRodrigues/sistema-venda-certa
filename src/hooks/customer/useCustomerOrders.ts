import { useState, useEffect, useCallback } from 'react';
import { customerOrderService, type OrderFilters } from '../../services/customer/customerOrderService';
import type { Order } from '../../types';

export const useCustomerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>({});
  const [stats, setStats] = useState<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
  } | null>(null);

  // Load orders with current filters
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerOrderService.getCustomerOrders(filters);
      setOrders(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pedidos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load order statistics
  const loadStats = useCallback(async () => {
    try {
      const statsData = await customerOrderService.getOrderStats();
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao carregar estatísticas de pedidos:', err);
    }
  }, []);

  // Get order by ID
  const getOrderById = useCallback(async (id: string): Promise<Order | null> => {
    try {
      return await customerOrderService.getOrderById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pedido';
      setError(errorMessage);
      return null;
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<OrderFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load orders when filters change
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    orders,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    getOrderById,
    loadOrders,
    clearError,
    // Helper functions from service
    getOrderStatusOptions: customerOrderService.getOrderStatusOptions,
    getStatusInfo: customerOrderService.getStatusInfo
  };
};