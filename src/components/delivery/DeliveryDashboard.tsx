import React, { useState } from 'react';
import { Card, LoadingSpinner } from '../ui';
import { useAuth } from '../../context/AuthContext';
// import { servicoEntregadorPedidos } from '../../services/delivery/servicoEntregadorPedidos';
import { useEntregadorPedidos } from '../../hooks/delivery/useEntregadorPedidos';
import { DeliveryOrdersList } from './DeliveryOrdersList';
import { DeliveryHistory } from './DeliveryHistory';

// interface EstatisticasEntregador {
//   totalPedidosPendentes: number;
//   totalPedidosRota: number;
//   totalEntregasHoje: number;
//   totalGanhosHoje: number;
// }

export const DeliveryDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'history'>('dashboard');
  
  // Use the new Portuguese-aligned hook
  const {
    estatisticas,
    carregando,
    erro,
    atualizarPedidos
  } = useEntregadorPedidos({
    entregadorId: user?.id as number,
    carregarAutomaticamente: true,
    intervaloAtualizacao: 30000
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  if (carregando && !estatisticas) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (erro && !estatisticas) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar dashboard</h3>
              <p className="text-gray-600">{erro}</p>
            </div>
            <button
              onClick={atualizarPedidos}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Tentar novamente
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.nome}!
          </h1>
          <p className="text-gray-600">
            Gerencie suas entregas e acompanhe seu desempenho
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Meus Pedidos
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Histórico
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {estatisticas?.totalPedidosPendentes || 0}
                    </div>
                    <div className="text-sm text-gray-600">Pedidos Pendentes</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {estatisticas?.totalPedidosRota || 0}
                    </div>
                    <div className="text-sm text-gray-600">Em Rota</div>
                  </div>
                </div>
              </Card>

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
                      {estatisticas?.totalEntregasHoje || 0}
                    </div>
                    <div className="text-sm text-gray-600">Entregues Hoje</div>
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
                      {formatCurrency(estatisticas?.totalGanhosHoje || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Ganhos Hoje</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="block w-full bg-yellow-50 text-yellow-800 border border-yellow-200 px-4 py-3 rounded-lg hover:bg-yellow-100 transition-colors text-center font-medium"
                  >
                    Ver Pedidos Pendentes ({estatisticas?.totalPedidosPendentes || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="block w-full bg-blue-50 text-blue-800 border border-blue-200 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors text-center font-medium"
                  >
                    Ver Pedidos em Rota ({estatisticas?.totalPedidosRota || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="block w-full bg-green-50 text-green-800 border border-green-200 px-4 py-3 rounded-lg hover:bg-green-100 transition-colors text-center font-medium"
                  >
                    Ver Histórico de Entregas
                  </button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Entregador</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Telefone:</span>
                    <span className="font-medium">{user?.numeroCelular || 'Não informado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ativo
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'orders' && <DeliveryOrdersList />}
        {activeTab === 'history' && <DeliveryHistory />}
      </div>
    </div>
  );
};