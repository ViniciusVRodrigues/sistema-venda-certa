import React, { useState, useEffect, useCallback } from 'react';
import { Card, LoadingSpinner, Badge, Button } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { deliveryOrderService } from '../../services/delivery/deliveryOrderService';
import type { Pedido } from '../../types';

export const DeliveryHistory: React.FC = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [paginacao, setPaginacao] = useState({
    pagina: 1,
    tamanhoPagina: 10,
    total: 0,
    totalPaginas: 0
  });

  const carregarHistorico = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      if (user?.id) {
        const response = await deliveryOrderService.getDeliveryHistory(user.id);
        setPedidos(response);
        // Simular paginação para o histórico
        const total = response.length;
        const startIndex = (paginacao.pagina - 1) * paginacao.tamanhoPagina;
        const endIndex = startIndex + paginacao.tamanhoPagina;
        const pedidosPagina = response.slice(startIndex, endIndex);
        setPedidos(pedidosPagina);
        setPaginacao(prev => ({
          ...prev,
          total,
          totalPaginas: Math.ceil(total / paginacao.tamanhoPagina)
        }));
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setErro('Erro ao carregar histórico de entregas');
    } finally {
      setCarregando(false);
    }
  }, [user?.id, paginacao.pagina, paginacao.tamanhoPagina]);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getTotalEarnings = () => {
    return pedidos.reduce((total, pedido) => total + pedido.taxaEntrega, 0);
  };

  if (carregando && pedidos.length === 0) {
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
        <h2 className="text-2xl font-bold text-gray-900">Histórico de Entregas</h2>
        <p className="text-gray-600">Visualize todas as suas entregas concluídas</p>
      </div>

        {/* Summary Cards */}
        {pedidos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {paginacao.total}
                  </div>
                  <div className="text-sm text-gray-600">Total de Entregas</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(getTotalEarnings())}
                  </div>
                  <div className="text-sm text-gray-600">Total de Ganhos</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {pedidos.length > 0 ? formatCurrency(getTotalEarnings() / pedidos.length) : formatCurrency(0)}
                  </div>
                  <div className="text-sm text-gray-600">Ganho Médio</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Orders History */}
        {erro ? (
          <Card className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar histórico</h3>
              <p className="text-gray-600">{erro}</p>
            </div>
            <Button onClick={carregarHistorico}>Tentar novamente</Button>
          </Card>
        ) : pedidos.length === 0 ? (
          <Card className="p-6 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma entrega encontrada</h3>
              <p className="text-gray-600">
                Você ainda não possui entregas concluídas em seu histórico.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {pedidos.map(pedido => (
              <Card key={pedido.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Pedido #{pedido.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Cliente: {pedido.fk_usuario_id}
                      </p>
                      <p className="text-sm text-gray-600">
                        Entregue em: {pedido.dataEntrega ? formatDateTime(pedido.dataEntrega) : 'Data não informada'}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="success">Entregue</Badge>
                      <div className="text-lg font-bold text-gray-900 mt-2">
                        {formatCurrency(pedido.total)}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        Taxa: {formatCurrency(pedido.taxaEntrega)}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Endereço de Entrega:</h4>
                        <p className="text-sm text-gray-600">
                          Endereço ID: {pedido.fk_endereco_id}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Resumo do Pedido:</h4>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            Status: {pedido.status === 4 ? 'Entregue' : 'Outro'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Método de Pagamento ID: {pedido.fk_metodoPagamento_id}
                          </p>
                          <p className="text-sm text-gray-600">
                            Estimativa: {pedido.estimativaEntrega ? formatDate(pedido.estimativaEntrega) : 'Não informado'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Pagination */}
            {paginacao.totalPaginas > 1 && (
              <div className="flex justify-center items-center space-x-4 py-8">
                <Button
                  variant="outline"
                  onClick={() => setPaginacao({ ...paginacao, pagina: paginacao.pagina - 1 })}
                  disabled={paginacao.pagina === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {paginacao.pagina} de {paginacao.totalPaginas}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPaginacao({ ...paginacao, pagina: paginacao.pagina + 1 })}
                  disabled={paginacao.pagina === paginacao.totalPaginas}
                >
                  Próxima
                </Button>
              </div>
            )}
          </div>
        )}
    </div>
  );
};