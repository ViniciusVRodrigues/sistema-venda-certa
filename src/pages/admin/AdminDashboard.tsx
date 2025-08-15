import React from 'react';
import { Card, Badge } from '../../components/ui';

export const AdminDashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total de Vendas',
      value: 'R$ 12.345,67',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Pedidos Hoje',
      value: '23',
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      name: 'Produtos Ativos',
      value: '89',
      change: '+3',
      changeType: 'positive' as const,
    },
    {
      name: 'Clientes',
      value: '156',
      change: '+8%',
      changeType: 'positive' as const,
    },
  ];
  
  const recentOrders = [
    { id: '001', customer: 'João Silva', total: 'R$ 45,90', status: 'delivered' },
    { id: '002', customer: 'Maria Santos', total: 'R$ 78,50', status: 'shipped' },
    { id: '003', customer: 'Pedro Costa', total: 'R$ 32,10', status: 'processing' },
    { id: '004', customer: 'Ana Oliveira', total: 'R$ 67,30', status: 'received' },
  ];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success">Entregue</Badge>;
      case 'shipped':
        return <Badge variant="info">Enviado</Badge>;
      case 'processing':
        return <Badge variant="warning">Processando</Badge>;
      case 'received':
        return <Badge variant="default">Recebido</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do seu negócio</p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Vendas dos Últimos 7 Dias
            </h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfico de vendas seria exibido aqui</p>
            </div>
          </Card>
          
          {/* Recent Orders */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pedidos Recentes
            </h3>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">#{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.total}</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 text-left bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                <div className="text-primary-600 font-medium">Adicionar Produto</div>
                <div className="text-sm text-gray-600">Cadastrar novo produto no catálogo</div>
              </button>
              <button className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="text-green-600 font-medium">Processar Pedidos</div>
                <div className="text-sm text-gray-600">Gerenciar pedidos pendentes</div>
              </button>
              <button className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="text-blue-600 font-medium">Ver Relatórios</div>
                <div className="text-sm text-gray-600">Analisar performance de vendas</div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};