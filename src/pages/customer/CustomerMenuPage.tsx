import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui';
import { useProfile } from '../../hooks/customer/useProfile';
import { useCustomerOrders } from '../../hooks/customer/useCustomerOrders';
import { formatCurrencyBR } from '../../utils/format';

export const CustomerMenuPage: React.FC = () => {
  const { profile, stats } = useProfile();
  const { stats: orderStats } = useCustomerOrders();

  const menuItems = [
    {
      title: 'Meus Pedidos',
      description: 'Visualize o histórico e status dos seus pedidos',
      icon: '📦',
      link: '/customer/orders',
      stats: orderStats ? `${orderStats.totalOrders} pedidos` : undefined
    },
    {
      title: 'Meus Endereços',
      description: 'Gerencie seus endereços de entrega',
      icon: '📍',
      link: '/customer/addresses',
      stats: undefined
    },
    {
      title: 'Dados Pessoais',
      description: 'Atualize suas informações pessoais',
      icon: '👤',
      link: '/customer/profile',
      stats: undefined
    },
    {
      title: 'Continuar Comprando',
      description: 'Explore nossos produtos e adicione ao carrinho',
      icon: '🛒',
      link: '/',
      stats: undefined
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo{profile ? `, ${profile.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-gray-600">
            Gerencie sua conta e acompanhe seus pedidos
          </p>
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
                {formatCurrencyBR(stats.totalSpent)}
              </div>
              <div className="text-sm text-gray-600">Total Gasto</div>
            </Card>
            
            <Card className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrencyBR(stats.averageOrderValue)}
              </div>
              <div className="text-sm text-gray-600">Ticket Médio</div>
            </Card>
            
            <Card className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {stats.isVip ? 'VIP' : 'Regular'}
              </div>
              <div className="text-sm text-gray-600">Status da Conta</div>
              {stats.isVip && (
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ⭐ Cliente VIP
                  </span>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="block transition-transform duration-200 hover:scale-105"
            >
              <Card className="p-6 h-full hover:shadow-lg border-2 hover:border-green-200">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {item.description}
                    </p>
                    {item.stats && (
                      <div className="text-sm text-green-600 font-medium">
                        {item.stats}
                      </div>
                    )}
                  </div>
                  <div className="text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/cart"
              className="inline-flex items-center px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19" />
              </svg>
              Ver Carrinho
            </Link>
            
            {stats?.lastOrderDate && (
              <Link
                to="/customer/orders"
                className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Último Pedido
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};