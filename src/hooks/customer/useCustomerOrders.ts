import { useState, useEffect, useCallback } from 'react';
import { customerOrderService, type OrderFilters } from '../../services/customer/customerOrderService';
import type { Pedido } from '../../types';

export const useCustomerOrders = () => {
  const [orders, setOrders] = useState<Pedido[]>([]);
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
      
      // Using mock customer ID for now - should be from auth context
      const customerId = 1;
      const data = await customerOrderService.getCustomerOrders(customerId, filters);
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
      // Using mock customer ID for now - should be from auth context
      const customerId = 1;
      const statsData = await customerOrderService.getCustomerOrderStats(customerId);
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao carregar estatísticas de pedidos:', err);
    }
  }, []);

  // Get order by ID
  const getOrderById = useCallback(async (orderId: number): Promise<Pedido | null> => {
    try {
      // Using mock customer ID for now - should be from auth context
      const customerId = 1;
      return await customerOrderService.getCustomerOrder(customerId, orderId);
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
    // Helper functions
    getOrderStatusOptions: () => [
      { value: 0, label: 'Recebido' },
      { value: 1, label: 'Processando' },
      { value: 2, label: 'Enviado' },
      { value: 3, label: 'Entregue' },
      { value: 4, label: 'Cancelado' }
    ],
    getStatusInfo: (status: number) => {
      const statusMap: Record<number, { label: string; color: string; bgColor: string }> = {
        0: { label: 'Recebido', color: 'text-blue-800', bgColor: 'bg-blue-100' },
        1: { label: 'Processando', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
        2: { label: 'Enviado', color: 'text-purple-800', bgColor: 'bg-purple-100' },
        3: { label: 'Entregue', color: 'text-green-800', bgColor: 'bg-green-100' },
        4: { label: 'Cancelado', color: 'text-red-800', bgColor: 'bg-red-100' }
      };
      return statusMap[status] || { label: 'Desconhecido', color: 'text-gray-800', bgColor: 'bg-gray-100' };
    }
  };
};