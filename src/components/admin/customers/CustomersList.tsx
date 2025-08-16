import React, { useState } from 'react';
import { useCustomers, useCustomerStats } from '../../../hooks/useCustomers';
import { DataTable, type Column } from '../shared/DataTable';
import { Drawer } from '../shared/Drawer';
import { Button, Card, Badge, Select } from '../../ui';
import type { Customer } from '../../../types';

export const CustomersList: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [vipFilter, setVipFilter] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    customers,
    pagination,
    loading,
    error,
    filters: currentFilters,
    fetchCustomers,
    setFilters,
    setSort,
    setPage,
    updateVipStatus,
    updateBlockedStatus
  } = useCustomers();

  const { stats } = useCustomerStats();

  const handleSearch = (search: string) => {
    setFilters({ ...currentFilters, search });
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setFilters({ ...currentFilters, status: status as 'active' | 'blocked' || undefined });
  };

  const handleVipFilter = (vipOnly: boolean) => {
    setVipFilter(vipOnly);
    setFilters({ ...currentFilters, vipOnly: vipOnly || undefined });
  };

  const openCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
  };

  const closeCustomerDetails = () => {
    setSelectedCustomer(null);
    setIsDrawerOpen(false);
  };

  const handleToggleVip = async (customerId: string, currentVipStatus: boolean) => {
    try {
      await updateVipStatus(customerId, !currentVipStatus);
      // Refresh customer details if the same customer is selected
      if (selectedCustomer && selectedCustomer.id === customerId) {
        const updatedCustomer = customers.find(c => c.id === customerId);
        if (updatedCustomer) {
          setSelectedCustomer(updatedCustomer);
        }
      }
    } catch (error) {
      console.error('Erro ao alterar status VIP:', error);
    }
  };

  const handleToggleBlocked = async (customerId: string, currentBlockedStatus: boolean) => {
    try {
      await updateBlockedStatus(customerId, !currentBlockedStatus);
      // Refresh customer details if the same customer is selected
      if (selectedCustomer && selectedCustomer.id === customerId) {
        const updatedCustomer = customers.find(c => c.id === customerId);
        if (updatedCustomer) {
          setSelectedCustomer(updatedCustomer);
        }
      }
    } catch (error) {
      console.error('Erro ao alterar status de bloqueio:', error);
    }
  };

  const getStatusBadge = (customer: Customer) => {
    if (customer.isBlocked) {
      return <Badge variant="danger">Bloqueado</Badge>;
    }
    if (customer.isVip) {
      return <Badge variant="success">VIP</Badge>;
    }
    return <Badge variant="default">Ativo</Badge>;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      title: 'Cliente',
      sortable: true,
      render: (name: string, record: Customer) => (
        <div>
          <div className="font-medium text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      )
    },
    {
      key: 'phone',
      title: 'Telefone',
      render: (phone: string | undefined) => phone || '-'
    },
    {
      key: 'totalOrders',
      title: 'Pedidos',
      sortable: true,
      align: 'center',
      render: (totalOrders: number) => (
        <span className="font-medium">{totalOrders}</span>
      )
    },
    {
      key: 'totalSpent',
      title: 'Total Gasto',
      sortable: true,
      align: 'right',
      render: (totalSpent: number) => 
        totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },
    {
      key: 'averageTicket',
      title: 'Ticket Médio',
      sortable: true,
      align: 'right',
      render: (_, record: Customer) => {
        const averageTicket = record.totalOrders > 0 ? record.totalSpent / record.totalOrders : 0;
        return averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      }
    },
    {
      key: 'lastOrderDate',
      title: 'Último Pedido',
      sortable: true,
      render: (lastOrderDate: Date | undefined) => formatDate(lastOrderDate)
    },
    {
      key: 'status',
      title: 'Status',
      align: 'center',
      render: (_, record: Customer) => getStatusBadge(record)
    },
    {
      key: 'actions',
      title: 'Ações',
      width: '32',
      render: (_, record: Customer) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openCustomerDetails(record)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleVip(record.id, record.isVip)}
            className={record.isVip ? 'text-yellow-600' : 'text-gray-400'}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
          { value: 'active', label: 'Ativos' },
          { value: 'blocked', label: 'Bloqueados' }
        ]}
      />
      <Select
        value={vipFilter ? 'true' : 'false'}
        onChange={(e) => handleVipFilter(e.target.value === 'true')}
        options={[
          { value: 'false', label: 'Todos os clientes' },
          { value: 'true', label: 'Apenas VIPs' }
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar clientes</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchCustomers}>Tentar novamente</Button>
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
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie sua base de clientes</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total de clientes</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-sm text-gray-600">Clientes ativos</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.vip}</div>
                <div className="text-sm text-gray-600">Clientes VIP</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <div className="text-sm text-gray-600">Ticket médio</div>
              </div>
            </Card>
          </div>
        )}

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={customers}
          loading={loading}
          pagination={pagination || undefined}
          onPageChange={setPage}
          onSort={setSort}
          onSearch={handleSearch}
          searchPlaceholder="Buscar por nome, email ou telefone..."
          emptyText="Nenhum cliente encontrado."
          filters={filtersComponent}
        />

        {/* Customer Details Drawer */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={closeCustomerDetails}
          title={selectedCustomer ? selectedCustomer.name : ''}
          size="lg"
          footer={
            selectedCustomer && (
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant={selectedCustomer.isVip ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleVip(selectedCustomer.id, selectedCustomer.isVip)}
                  >
                    {selectedCustomer.isVip ? 'Remover VIP' : 'Tornar VIP'}
                  </Button>
                  <Button
                    variant={selectedCustomer.isBlocked ? 'primary' : 'danger'}
                    size="sm"
                    onClick={() => handleToggleBlocked(selectedCustomer.id, selectedCustomer.isBlocked)}
                  >
                    {selectedCustomer.isBlocked ? 'Desbloquear' : 'Bloquear'}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeCustomerDetails}
                >
                  Fechar
                </Button>
              </div>
            )
          }
        >
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nome</p>
                      <p className="font-medium">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Telefone</p>
                      <p className="font-medium">{selectedCustomer.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cliente desde</p>
                      <p className="font-medium">{formatDate(selectedCustomer.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Status */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status do Cliente</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(selectedCustomer)}
                    {selectedCustomer.isVip && (
                      <Badge variant="warning">VIP</Badge>
                    )}
                    {selectedCustomer.isBlocked && (
                      <Badge variant="danger">Bloqueado</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Purchase Statistics */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Estatísticas de Compras</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</div>
                    <div className="text-sm text-gray-600">Total de pedidos</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedCustomer.totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    <div className="text-sm text-gray-600">Total gasto</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedCustomer.totalOrders > 0 
                        ? (selectedCustomer.totalSpent / selectedCustomer.totalOrders).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        : 'R$ 0,00'
                      }
                    </div>
                    <div className="text-sm text-gray-600">Ticket médio</div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Endereços</h3>
                {selectedCustomer.addresses.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomer.addresses.map((address) => (
                      <div key={address.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {address.street}, {address.number}
                              {address.complement && ` - ${address.complement}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.neighborhood}, {address.city} - {address.state}
                            </p>
                            <p className="text-sm text-gray-600">CEP: {address.zipCode}</p>
                          </div>
                          {address.isDefault && (
                            <Badge variant="info">Padrão</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum endereço cadastrado
                  </div>
                )}
              </div>

              {/* Last Order Info */}
              {selectedCustomer.lastOrderDate && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Última Compra</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Data do último pedido</p>
                    <p className="font-medium">{formatDate(selectedCustomer.lastOrderDate)}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
};