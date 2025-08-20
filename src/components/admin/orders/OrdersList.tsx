import React, { useState } from 'react';
import { useOrders } from '../../../hooks/useOrders';
import { DataTable, type Column } from '../shared/DataTable';
import { Drawer } from '../shared/Drawer';
import { Timeline } from '../shared/Timeline';
import { DeleteConfirmationModal } from '../shared/modals';
import { Button, Card, Badge, Select, Modal } from '../../ui';
import type { Order } from '../../../types';

export const OrdersList: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status']>('received');
  const [statusNotes, setStatusNotes] = useState('');
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  const {
    orders,
    pagination,
    loading,
    error,
    filters: currentFilters,
    fetchOrders,
    setFilters,
    setSort,
    setPage,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    generateReceipt
  } = useOrders();

  const handleSearch = (search: string) => {
    setFilters({ ...currentFilters, search });
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setFilters({ ...currentFilters, status: status || undefined });
  };

  const handlePaymentStatusFilter = (paymentStatus: string) => {
    setPaymentStatusFilter(paymentStatus);
    setFilters({ ...currentFilters, paymentStatus: paymentStatus || undefined });
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setIsDrawerOpen(false);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      await updateOrderStatus(selectedOrder.id, newStatus, statusNotes);
      setIsStatusModalOpen(false);
      setStatusNotes('');
      // Refresh selected order details
      const updatedOrders = orders.find(o => o.id === selectedOrder.id);
      if (updatedOrders) {
        setSelectedOrder(updatedOrders);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handlePaymentStatusUpdate = async (paymentStatus: Order['paymentStatus']) => {
    if (!selectedOrder) return;
    
    try {
      await updatePaymentStatus(selectedOrder.id, paymentStatus);
      // Refresh selected order details
      const updatedOrders = orders.find(o => o.id === selectedOrder.id);
      if (updatedOrders) {
        setSelectedOrder(updatedOrders);
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pagamento:', error);
    }
  };

  const handleGenerateReceipt = async (orderId: string) => {
    try {
      const receiptHtml = await generateReceipt(orderId);
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(receiptHtml);
        newWindow.document.close();
        newWindow.print();
      }
    } catch (error) {
      console.error('Erro ao gerar comprovante:', error);
    }
  };

  // Delete handlers
  const handleDeleteOrder = (order: Order) => {
    setDeletingOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deletingOrder) {
        await deleteOrder(deletingOrder.id);
        setDeletingOrder(null);
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'received':
        return <Badge variant="info">Recebido</Badge>;
      case 'processing':
        return <Badge variant="warning">Processando</Badge>;
      case 'shipped':
        return <Badge variant="default">Enviado</Badge>;
      case 'delivered':
        return <Badge variant="success">Entregue</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelado</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Pago</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>;
      case 'failed':
        return <Badge variant="danger">Falhou</Badge>;
      case 'refunded':
        return <Badge variant="default">Reembolsado</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const columns: Column<Order>[] = [
    {
      key: 'id',
      title: 'Pedido',
      sortable: true,
      render: (id: string, record: Order) => (
        <div>
          <div className="font-medium text-gray-900">#{id}</div>
          <div className="text-sm text-gray-500">{formatDateTime(record.createdAt)}</div>
        </div>
      )
    },
    {
      key: 'customer',
      title: 'Cliente',
      sortable: true,
      render: (customer: Order['customer']) => (
        <div>
          <div className="font-medium text-gray-900">{customer.name}</div>
          <div className="text-sm text-gray-500">{customer.email}</div>
        </div>
      )
    },
    {
      key: 'items',
      title: 'Itens',
      render: (items: Order['items']) => (
        <div className="text-sm text-gray-900">
          {items.length} {items.length === 1 ? 'item' : 'itens'}
        </div>
      )
    },
    {
      key: 'total',
      title: 'Total',
      sortable: true,
      align: 'right',
      render: (total: number) => 
        total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },
    {
      key: 'paymentStatus',
      title: 'Pagamento',
      sortable: true,
      align: 'center',
      render: (paymentStatus: Order['paymentStatus'], record: Order) => (
        <div>
          {getPaymentStatusBadge(paymentStatus)}
          <div className="text-xs text-gray-500 mt-1">{record.paymentMethod.name}</div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      align: 'center',
      render: (status: Order['status']) => getStatusBadge(status)
    },
    {
      key: 'deliveryMethod',
      title: 'Entrega',
      render: (deliveryMethod: Order['deliveryMethod']) => (
        <div className="text-sm text-gray-900">{deliveryMethod.name}</div>
      )
    },
    {
      key: 'actions',
      title: 'Ações',
      width: '40',
      render: (_, record: Order) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openOrderDetails(record)}
            title="Ver detalhes"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleGenerateReceipt(record.id)}
            title="Gerar comprovante"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteOrder(record)}
            title="Excluir pedido"
            className="text-red-600 hover:text-red-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      )
    }
  ];

  const filtersComponent = (
    <div className="flex space-x-4">
      <Select
        value={statusFilter}
        onChange={(e) => handleStatusFilter(e.target.value)}
        options={[
          { value: '', label: 'Todos os status' },
          { value: 'received', label: 'Recebido' },
          { value: 'processing', label: 'Processando' },
          { value: 'shipped', label: 'Enviado' },
          { value: 'delivered', label: 'Entregue' },
          { value: 'cancelled', label: 'Cancelado' }
        ]}
      />
      <Select
        value={paymentStatusFilter}
        onChange={(e) => handlePaymentStatusFilter(e.target.value)}
        options={[
          { value: '', label: 'Todos pagamentos' },
          { value: 'pending', label: 'Pendente' },
          { value: 'paid', label: 'Pago' },
          { value: 'failed', label: 'Falhou' },
          { value: 'refunded', label: 'Reembolsado' }
        ]}
      />
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar pedidos</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchOrders}>Tentar novamente</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600">Gerencie todos os pedidos da sua loja</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
              <div className="text-sm text-gray-600">Total de pedidos</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {orders.filter(o => o.status === 'received').length}
              </div>
              <div className="text-sm text-gray-600">Recebidos</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'processing').length}
              </div>
              <div className="text-sm text-gray-600">Processando</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-sm text-gray-600">Entregues</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {orders.filter(o => o.status === 'cancelled').length}
              </div>
              <div className="text-sm text-gray-600">Cancelados</div>
            </div>
          </Card>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          pagination={pagination || undefined}
          onPageChange={setPage}
          onSort={setSort}
          onSearch={handleSearch}
          searchPlaceholder="Buscar por pedido, cliente ou email..."
          emptyText="Nenhum pedido encontrado."
          filters={filtersComponent}
        />

        {/* Order Details Drawer */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={closeOrderDetails}
          title={selectedOrder ? `Pedido #${selectedOrder.id}` : ''}
          size="lg"
          footer={
            selectedOrder && (
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsStatusModalOpen(true)}
                  >
                    Alterar Status
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateReceipt(selectedOrder.id)}
                  >
                    Gerar Comprovante
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeOrderDetails}
                >
                  Fechar
                </Button>
              </div>
            )
          }
        >
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Cliente</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nome</p>
                      <p className="font-medium">{selectedOrder.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedOrder.customer.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Itens do Pedido</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          Qtd: {item.quantity} x {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                      <p className="font-medium">
                        {(item.quantity * item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total:</span>
                      <span>{selectedOrder.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Status do Pedido</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    <div className="flex justify-between">
                      <span>Entrega:</span>
                      <span>{selectedOrder.deliveryMethod.name}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Pagamento</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                    </div>
                    <div className="flex justify-between">
                      <span>Método:</span>
                      <span>{selectedOrder.paymentMethod.name}</span>
                    </div>
                    {selectedOrder.paymentStatus === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handlePaymentStatusUpdate('paid')}
                      >
                        Confirmar Pagamento
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico do Pedido</h3>
                <Timeline events={selectedOrder.timeline} />
              </div>
            </div>
          )}
        </Drawer>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingOrder(null);
          }}
          onConfirm={handleDeleteConfirm}
          loading={loading}
          itemCount={1}
          title="Excluir pedido"
          message={deletingOrder 
            ? `Tem certeza que deseja excluir o pedido #${deletingOrder.id}? Esta ação não pode ser desfeita.`
            : undefined
          }
        />

        {/* Status Update Modal */}
        <Modal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          title="Alterar Status do Pedido"
        >
          <div className="space-y-4">
            <Select
              label="Novo Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as Order['status'])}
              options={[
                { value: 'received', label: 'Recebido' },
                { value: 'processing', label: 'Processando' },
                { value: 'shipped', label: 'Enviado' },
                { value: 'delivered', label: 'Entregue' },
                { value: 'cancelled', label: 'Cancelado' }
              ]}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações (opcional)
              </label>
              <textarea
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Adicione observações sobre a mudança de status..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsStatusModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdateStatus}>
                Atualizar Status
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};