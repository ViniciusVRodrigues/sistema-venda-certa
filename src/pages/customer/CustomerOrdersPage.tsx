import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Input, Select, LoadingSpinner, Badge } from '../../components/ui';
import { useCustomerOrders } from '../../hooks/customer/useCustomerOrders';
import type { Pedido } from '../../types';

export const CustomerOrdersPage: React.FC = () => {
  const {
    orders,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    clearError,
    getOrderStatusOptions,
    getStatusInfo
  } = useCustomerOrders();

  const [showOrderDetails, setShowOrderDetails] = useState<number | null>(null);

  const statusOptions = getOrderStatusOptions();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatAddress = (order: Pedido) => {
    // Como Pedido não tem deliveryAddress diretamente, vamos simplificar
    return `Endereço #${order.fk_endereco_id}`;
  };

  const getPaymentStatusInfo = (status: Pedido['statusPagamento']) => {
    const statusMap: Record<number, { label: string; color: string; bgColor: string }> = {
      0: { label: 'Pendente', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
      1: { label: 'Pago', color: 'text-green-800', bgColor: 'bg-green-100' },
      2: { label: 'Falhou', color: 'text-red-800', bgColor: 'bg-red-100' },
      3: { label: 'Reembolsado', color: 'text-blue-800', bgColor: 'bg-blue-100' }
    };
    return statusMap[status] || { label: 'Desconhecido', color: 'text-gray-800', bgColor: 'bg-gray-100' };
  };

  const toggleOrderDetails = (orderId: number) => {
    setShowOrderDetails(showOrderDetails === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/customer/menu"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-2"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Menu
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Pedidos</h1>
          <p className="text-gray-600">Acompanhe o histórico e status dos seus pedidos</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalOrders}
              </div>
              <div className="text-sm text-gray-600">Total de Pedidos</div>
            </Card>
            
            <Card className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalSpent)}
              </div>
              <div className="text-sm text-gray-600">Total Gasto</div>
            </Card>
            
            <Card className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.averageOrderValue)}
              </div>
              <div className="text-sm text-gray-600">Ticket Médio</div>
            </Card>
            
            <Card className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {stats.lastOrderDate ? formatDate(stats.lastOrderDate).split(' ')[0] : '-'}
              </div>
              <div className="text-sm text-gray-600">Último Pedido</div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Buscar pedidos"
              value={filters.search || ''}
              onChange={(e) => updateFilters({ search: e.target.value })}
              placeholder="ID do pedido ou produto..."
            />
            
            <Select
              label="Status"
              value={filters.status?.toString() || 'all'}
              onChange={(e) => updateFilters({ status: e.target.value === 'all' ? undefined : parseInt(e.target.value) })}
              options={[
                { value: 'all', label: 'Todos os Status' },
                ...statusOptions.map(opt => ({ value: opt.value.toString(), label: opt.label }))
              ]}
            />
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
              <button
                onClick={clearError}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Orders List */}
        {!loading && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filters.search || filters.status ? 'Nenhum pedido encontrado' : 'Nenhum pedido feito ainda'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {filters.search || filters.status 
                    ? 'Tente ajustar seus filtros de busca'
                    : 'Comece explorando nossos produtos e faça seu primeiro pedido'
                  }
                </p>
                {!filters.search && !filters.status ? (
                  <Link to="/">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Ver Produtos
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Limpar Filtros
                  </Button>
                )}
              </Card>
            ) : (
              orders.map(order => {
                const statusInfo = getStatusInfo(order.status);
                const paymentInfo = getPaymentStatusInfo(order.statusPagamento);
                const isExpanded = showOrderDetails === order.id;

                return (
                  <Card key={order.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Pedido #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {order.estimativaEntrega ? formatDate(order.estimativaEntrega) : 'Data não definida'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge 
                            className={`${statusInfo.bgColor} ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </Badge>
                          <Badge 
                            className={`${paymentInfo.bgColor} ${paymentInfo.color}`}
                          >
                            {paymentInfo.label}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Total</p>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(order.total)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Entrega</p>
                          <p className="text-sm text-gray-600">Método #{order.fk_metodoEntrega_id}</p>
                          <p className="text-sm text-gray-600">
                            {order.estimativaEntrega ? formatDate(order.estimativaEntrega).split(' ')[0] : 'A definir'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Pagamento</p>
                          <p className="text-sm text-gray-600">Método #{order.fk_metodoPagamento_id}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          Subtotal: R$ {order.subtotal.toFixed(2)}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleOrderDetails(order.id)}
                        >
                          {isExpanded ? 'Ocultar' : 'Ver'} Detalhes
                          <svg 
                            className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Button>
                      </div>
                    </div>

                    {/* Order Details */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 p-6 bg-gray-50">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Order Summary */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Resumo do Pedido</h4>
                            <div className="space-y-3">
                              <div className="border-t pt-3">
                                <div className="flex justify-between text-sm">
                                  <span>Subtotal:</span>
                                  <span>{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Taxa de Entrega:</span>
                                  <span>{formatCurrency(order.taxaEntrega)}</span>
                                </div>
                                <div className="flex justify-between font-bold">
                                  <span>Total:</span>
                                  <span>{formatCurrency(order.total)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Delivery and Additional Info */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Endereço de Entrega</h4>
                            <p className="text-sm text-gray-600 mb-4">
                              {formatAddress(order)}
                            </p>

                            <h4 className="font-medium text-gray-900 mb-3">Informações Adicionais</h4>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <p><strong>Status:</strong> {statusInfo.label}</p>
                                <p><strong>Pagamento:</strong> {paymentInfo.label}</p>
                                {order.estimativaEntrega && (
                                  <p><strong>Previsão:</strong> {formatDate(order.estimativaEntrega)}</p>
                                )}
                                {order.dataEntrega && (
                                  <p><strong>Entregue em:</strong> {formatDate(order.dataEntrega)}</p>
                                )}
                              </div>
                            </div>

                            {order.anotacoes && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                                <p className="text-sm text-gray-600">{order.anotacoes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};