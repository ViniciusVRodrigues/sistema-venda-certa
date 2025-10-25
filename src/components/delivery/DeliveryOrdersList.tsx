import React, { useState, useEffect, useCallback } from 'react';
import { Card, LoadingSpinner, Badge, Modal, Button, Input, Select } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { deliveryOrderService, type PedidoCompleto } from '../../services/delivery/deliveryOrderService';
import type { Pedido } from '../../types';
import { formatCurrencyBR } from '../../utils/format';

export const DeliveryOrdersList: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<PedidoCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PedidoCompleto | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<2 | 3>(2); // 2=enviado, 3=entregue
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

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (user?.id) {
        const response = await deliveryOrderService.getOrders(
          Number(user.id),
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
  }, [user?.id, filters, pagination.page, pagination.pageSize]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleOrderClick = (order: Pedido) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleStatusUpdate = (order: Pedido) => {
    setSelectedOrder(order);
    if (order.status === 1) { // processando
      setNewStatus(2); // enviado
    } else if (order.status === 2) { // enviado
      setNewStatus(3); // entregue
    }
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

  const getStatusBadge = (status: Pedido['status']) => {
    const statusConfig: Record<number, { variant: 'info' | 'warning' | 'success' | 'danger'; label: string }> = {
      0: { variant: 'info', label: 'Recebido' },
      1: { variant: 'warning', label: 'Processando' },
      2: { variant: 'warning', label: 'Preparando' },
      3: { variant: 'info', label: 'Em Rota' },
      4: { variant: 'success', label: 'Entregue' },
      5: { variant: 'danger', label: 'Cancelado' }
    };
    
    const config = statusConfig[status] || { variant: 'info', label: 'Desconhecido' };
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };  const formatCurrency = (value: number) => {
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

  const canUpdateStatus = (order: Pedido) => {
    return order.status === 1 || order.status === 2; // processando ou enviado
  };

  const getNextStatusLabel = (currentStatus: Pedido['status']) => {
    if (currentStatus === 1) return 'Marcar como Enviado';
    if (currentStatus === 2) return 'Marcar como Entregue';
    return 'Status não pode ser alterado';
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Meus Pedidos</h2>
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
                        Cliente: {order.cliente?.nome || `ID: ${order.fk_usuario_id}`}
                      </p>
                      {order.endereco && (
                        <p className="text-sm text-gray-600">
                          {order.endereco.rua}, {order.endereco.numero}
                          {order.endereco.complemento && `, ${order.endereco.complemento}`}
                        </p>
                      )}
                      {order.estimativaEntrega && (
                        <p className="text-sm text-gray-600">
                          Previsto para: {formatDateTime(order.estimativaEntrega)}
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
                        {order.endereco ? (
                          <>
                            <p className="text-sm text-gray-600">
                              {order.endereco.rua}, {order.endereco.numero}
                              {order.endereco.complemento && `, ${order.endereco.complemento}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.endereco.bairro} - {order.endereco.cidade}/{order.endereco.estado}
                            </p>
                            <p className="text-sm text-gray-600">
                              CEP: {order.endereco.cep}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-600">Endereço não encontrado</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Produtos:</h4>
                        {order.produtos && order.produtos.length > 0 ? (
                          <div className="space-y-1 max-h-20 overflow-y-auto">
                            {order.produtos.map((produtoPedido, index) => (
                              <p key={index} className="text-sm text-gray-600">
                                {produtoPedido.quantidade}x {produtoPedido.produto?.nome || 'Produto não encontrado'}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">Nenhum produto encontrado</p>
                        )}
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
                    <p><strong>Cliente:</strong> {selectedOrder.cliente?.nome || 'Cliente não encontrado'}</p>
                    <p><strong>Email:</strong> {selectedOrder.cliente?.email || 'Não informado'}</p>
                    <p><strong>Telefone:</strong> {selectedOrder.cliente?.numeroCelular || 'Não informado'}</p>
                    <p><strong>Anotações:</strong> {selectedOrder.anotacoes || 'Nenhuma anotação'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Status do Pedido</h4>
                  <div className="space-y-2">
                    <div>{getStatusBadge(selectedOrder.status)}</div>
                    <p><strong>Data Estimativa:</strong> {selectedOrder.estimativaEntrega ? formatDateTime(selectedOrder.estimativaEntrega) : 'Não definida'}</p>
                    {selectedOrder.dataEntrega && (
                      <p><strong>Entregue em:</strong> {formatDateTime(selectedOrder.dataEntrega)}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Endereço de Entrega</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {selectedOrder.endereco ? (
                    <div>
                      <p><strong>Rua:</strong> {selectedOrder.endereco.rua}, {selectedOrder.endereco.numero}</p>
                      <p><strong>Bairro:</strong> {selectedOrder.endereco.bairro}</p>
                      <p><strong>Cidade:</strong> {selectedOrder.endereco.cidade}</p>
                      <p><strong>CEP:</strong> {selectedOrder.endereco.cep}</p>
                      {selectedOrder.endereco.complemento && (
                        <p><strong>Complemento:</strong> {selectedOrder.endereco.complemento}</p>
                      )}
                    </div>
                  ) : (
                    <p>Endereço não encontrado</p>
                  )}
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p><strong>Método de Entrega:</strong> {selectedOrder.metodoEntrega?.nome || 'Não informado'}</p>
                    {selectedOrder.metodoEntrega?.estimativaEntrega && (
                      <p><strong>Estimativa:</strong> {selectedOrder.metodoEntrega.estimativaEntrega}</p>
                    )}
                    {selectedOrder.metodoEntrega?.preco && (
                      <p><strong>Taxa de Entrega:</strong> {formatCurrencyBR(selectedOrder.metodoEntrega.preco)}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Informações Financeiras</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taxa de Entrega:</span>
                    <span>{formatCurrency(selectedOrder.taxaEntrega)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-lg font-bold">{formatCurrency(selectedOrder.total)}</span>
                  </div>
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
              onChange={(e) => setNewStatus(Number(e.target.value) as 2 | 3)}
              options={
                selectedOrder?.status === 2
                  ? [{ value: '3', label: 'Entregue' }]
                  : [{ value: '2', label: 'Em Rota' }]
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
  );
};