import React, { useState, useEffect } from 'react';
import { Card, LoadingSpinner, Badge, Modal, Button, Input, Select } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { deliveryOrderService } from '../../services/delivery/deliveryOrderService';
import type { Order } from '../../types';

export const DeliveryOrdersList: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'shipped' | 'delivered'>('shipped');
  const [statusNotes, setStatusNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
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

  useEffect(() => {
    loadOrders();
  }, [pagination.page, filters]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      if (user?.id) {
        const response = await deliveryOrderService.getOrders(
          user.id,
          filters,
          { page: pagination.page, pageSize: pagination.pageSize }
        );
        setOrders(response.orders);
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleStatusUpdate = (order: Order) => {
    setSelectedOrder(order);
    // Set default next status based on current status
    if (order.status === 'processing' || order.status === 'received') {
      setNewStatus('shipped');
    } else if (order.status === 'shipped') {
      setNewStatus('delivered');
    }
    setStatusNotes('');
    setIsStatusModalOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedOrder) return;

    try {
      setUpdatingStatus(true);
      await deliveryOrderService.updateOrderStatus(
        selectedOrder.id,
        newStatus,
        statusNotes || undefined
      );
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
      setStatusNotes('');
      await loadOrders(); // Reload orders
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar status do pedido');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      received: { variant: 'info' as const, label: 'Recebido' },
      processing: { variant: 'warning' as const, label: 'Preparando' },
      shipped: { variant: 'info' as const, label: 'Em Rota' },
      delivered: { variant: 'success' as const, label: 'Entregue' },
      cancelled: { variant: 'danger' as const, label: 'Cancelado' }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const canUpdateStatus = (order: Order) => {
    return ['processing', 'received', 'shipped'].includes(order.status);
  };

  const getNextStatusLabel = (currentStatus: Order['status']) => {
    if (currentStatus === 'processing' || currentStatus === 'received') {
      return 'Marcar como Em Rota';
    }
    if (currentStatus === 'shipped') {
      return 'Marcar como Entregue';
    }
    return '';
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
          <p className="text-gray-600">Gerencie seus pedidos atribuídos</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Buscar pedidos"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="ID do pedido, cliente ou endereço..."
            />
            
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={[
                { value: 'all', label: 'Todos os Status' },
                { value: 'pending', label: 'Pendentes' },
                { value: 'in_route', label: 'Em Rota' },
                { value: 'delivered', label: 'Entregues' }
              ]}
            />
            
            <div className="flex items-end">
              <Button
                onClick={() => setPagination({ ...pagination, page: 1 })}
                variant="outline"
                className="w-full"
              >
                Filtrar
              </Button>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        {error ? (
          <Card className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar pedidos</h3>
              <p className="text-gray-600">{error}</p>
            </div>
            <Button onClick={loadOrders}>Tentar novamente</Button>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-6 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-600">
                {filters.status !== 'all' || filters.search
                  ? 'Nenhum pedido encontrado com os filtros aplicados'
                  : 'Você não possui pedidos atribuídos no momento'
                }
              </p>
            </div>
            {(filters.status !== 'all' || filters.search) && (
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({ status: 'all', search: '' });
                  setPagination({ ...pagination, page: 1 });
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <Card key={order.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Pedido #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Cliente: {order.customer.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Criado em: {formatDateTime(order.createdAt)}
                      </p>
                      {order.estimatedDelivery && (
                        <p className="text-sm text-gray-600">
                          Previsto para: {formatDateTime(order.estimatedDelivery)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <div className="text-lg font-bold text-gray-900 mt-2">
                        {formatCurrency(order.total)}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Endereço de Entrega:</h4>
                        <p className="text-sm text-gray-600">
                          {order.deliveryAddress.street}, {order.deliveryAddress.number}
                          {order.deliveryAddress.complement && `, ${order.deliveryAddress.complement}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.deliveryAddress.neighborhood}, {order.deliveryAddress.city}/{order.deliveryAddress.state}
                        </p>
                        <p className="text-sm text-gray-600">
                          CEP: {order.deliveryAddress.zipCode}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Itens do Pedido:</h4>
                        <div className="space-y-1">
                          {order.items.slice(0, 3).map(item => (
                            <p key={item.id} className="text-sm text-gray-600">
                              {item.quantity}x {item.product.name}
                            </p>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-sm text-gray-500">
                              +{order.items.length - 3} itens...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleOrderClick(order)}
                      >
                        Ver Detalhes
                      </Button>
                      {canUpdateStatus(order) && (
                        <Button
                          onClick={() => handleStatusUpdate(order)}
                          variant="primary"
                        >
                          {getNextStatusLabel(order.status)}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 py-8">
                <Button
                  variant="outline"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Próxima
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Order Detail Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={selectedOrder ? `Pedido #${selectedOrder.id}` : ''}
          size="lg"
        >
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Informações do Cliente</h4>
                  <div className="space-y-2">
                    <p><strong>Nome:</strong> {selectedOrder.customer.name}</p>
                    <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                    <p><strong>Telefone:</strong> {selectedOrder.customer.phone || 'Não informado'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Status do Pedido</h4>
                  <div className="space-y-2">
                    <div>{getStatusBadge(selectedOrder.status)}</div>
                    <p><strong>Criado em:</strong> {formatDateTime(selectedOrder.createdAt)}</p>
                    {selectedOrder.estimatedDelivery && (
                      <p><strong>Previsão:</strong> {formatDateTime(selectedOrder.estimatedDelivery)}</p>
                    )}
                    {selectedOrder.deliveredAt && (
                      <p><strong>Entregue em:</strong> {formatDateTime(selectedOrder.deliveredAt)}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Endereço de Entrega</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>{selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.number}</p>
                  {selectedOrder.deliveryAddress.complement && (
                    <p>{selectedOrder.deliveryAddress.complement}</p>
                  )}
                  <p>{selectedOrder.deliveryAddress.neighborhood}, {selectedOrder.deliveryAddress.city}/{selectedOrder.deliveryAddress.state}</p>
                  <p>CEP: {selectedOrder.deliveryAddress.zipCode}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Itens do Pedido</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produto
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qtd
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço Unit.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map(item => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.product.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <span className="font-medium">Taxa de Entrega:</span>
                  <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              {canUpdateStatus(selectedOrder) && (
                <div className="flex justify-end">
                  <Button onClick={() => handleStatusUpdate(selectedOrder)}>
                    {getNextStatusLabel(selectedOrder.status)}
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Status Update Modal */}
        <Modal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          title="Atualizar Status do Pedido"
        >
          <div className="space-y-4">
            <Select
              label="Novo Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as 'shipped' | 'delivered')}
              options={
                selectedOrder?.status === 'shipped'
                  ? [{ value: 'delivered', label: 'Entregue' }]
                  : [{ value: 'shipped', label: 'Em Rota' }]
              }
            />
            <Input
              label="Observações (opcional)"
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              placeholder="Adicione uma observação sobre a atualização..."
            />
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsStatusModalOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmStatusUpdate}
                isLoading={updatingStatus}
                className="flex-1"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};