import React, { useState } from 'react';
import { useCustomers, useCustomerStats } from '../../../hooks/useCustomers';
import { customersService } from '../../../services/admin/customersService';
import { DataTable, type Column } from '../shared/DataTable';
import { Drawer } from '../shared/Drawer';
import { DeleteConfirmationModal, CustomerFormModal, DataViewModal, type CustomerFormData } from '../shared/modals';
import { Button, Card, Badge, Select } from '../../ui';
import type { Usuario, Endereco } from '../../../types';

export const CustomersList: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Usuario | null>(null);
  const [customerAddresses, setCustomerAddresses] = useState<Endereco[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Modal states
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDataViewOpen, setIsDataViewOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Usuario | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Usuario | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Usuario | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

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
    updateBlockedStatus,
    createCustomer,
    updateCustomer,
    deleteCustomer
  } = useCustomers();

  const { stats } = useCustomerStats();

  const handleSearch = (search: string) => {
    setFilters({ ...currentFilters, search });
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setFilters({ ...currentFilters, status: status as 'active' | 'blocked' || undefined });
  };

  const openCustomerDetails = async (customer: Usuario) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
    
    // Buscar endereços do cliente do service
    try {
      const addresses = await customersService.getCustomerAddresses(customer.id);
      setCustomerAddresses(addresses);
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
      setCustomerAddresses([]);
    }
  };

  const closeCustomerDetails = () => {
    setSelectedCustomer(null);
    setIsDrawerOpen(false);
  };

  const handleToggleBlocked = async (customerId: number, currentBlockedStatus: boolean) => {
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

  // Modal handlers
  const handleCreateCustomer = () => {
    setEditingCustomer(null);
    setIsCustomerFormOpen(true);
  };

  const handleEditCustomer = (customer: Usuario) => {
    setEditingCustomer(customer);
    setIsCustomerFormOpen(true);
  };

  const handleDeleteCustomer = (customer: Usuario) => {
    setDeletingCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleViewCustomer = (customer: Usuario) => {
    setViewingCustomer(customer);
    setIsDataViewOpen(true);
  };

  const handleCustomerFormSubmit = async (formData: CustomerFormData) => {
    try {
      setIsFormLoading(true);
      
      // Converter CustomerFormData para Usuario
      const usuarioData: Partial<Usuario> = {
        nome: formData.name,
        email: formData.email,
        numeroCelular: formData.phone,
        senha: formData.password, // Envia como 'senha' para o backend
        cargo: 'customer', // Backend validation expects 'customer'
        status: 1, // Ativo por padrão
        totalPedidos: 0,
        totalGasto: 0,
        entregasFeitas: 0
      };
      
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, usuarioData);
      } else {
        await createCustomer(usuarioData as Omit<Usuario, 'id'>);
      }
      
      setIsCustomerFormOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deletingCustomer) {
        await deleteCustomer(deletingCustomer.id);
        setDeletingCustomer(null);
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  const getStatusBadge = (customer: Usuario) => {
    if (customer.status === 0) {
      return <Badge variant="danger">Bloqueado</Badge>;
    }
    return <Badge variant="default">Ativo</Badge>;
  };

  const columns: Column<Usuario>[] = [
    {
      key: 'nome',
      title: 'Cliente',
      sortable: true,
      render: (nome: string, record: Usuario) => (
        <div>
          <div className="font-medium text-gray-900">{nome}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      )
    },
    {
      key: 'numeroCelular',
      title: 'Telefone',
      render: (numeroCelular: string | undefined) => numeroCelular || '-'
    },
    {
      key: 'totalPedidos',
      title: 'Pedidos',
      sortable: true,
      align: 'center',
      render: (totalPedidos: number) => (
        <span className="font-medium">{totalPedidos}</span>
      )
    },
    {
      key: 'totalGasto',
      title: 'Total Gasto',
      sortable: true,
      align: 'right',
      render: (totalGasto: number) => 
        totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },
    {
      key: 'averageTicket',
      title: 'Ticket Médio',
      sortable: true,
      align: 'right',
      render: (_, record: Usuario) => {
        const averageTicket = record.totalPedidos > 0 ? record.totalGasto / record.totalPedidos : 0;
        return averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      }
    },
    {
      key: 'status',
      title: 'Status',
      align: 'center',
      render: (_, record: Usuario) => getStatusBadge(record)
    },
    {
      key: 'actions',
      title: 'Ações',
      width: '48',
      render: (_, record: Usuario) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewCustomer(record)}
            title="Ver todos os campos"
            className="text-blue-600 hover:text-blue-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openCustomerDetails(record)}
            title="Ver detalhes completos"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditCustomer(record)}
            title="Editar cliente"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteCustomer(record)}
            title="Excluir cliente"
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
          { value: 'active', label: 'Ativos' },
          { value: 'blocked', label: 'Bloqueados' }
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
          rowKey="id"
          loading={loading}
          pagination={pagination || undefined}
          onPageChange={setPage}
          onSort={setSort}
          onSearch={handleSearch}
          searchPlaceholder="Buscar por nome, email ou telefone..."
          emptyText="Nenhum cliente encontrado."
          filters={filtersComponent}
          actions={
            <Button onClick={handleCreateCustomer}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Cliente
            </Button>
          }
        />

        {/* Customer Details Drawer */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={closeCustomerDetails}
          title={selectedCustomer ? selectedCustomer.nome : ''}
          size="lg"
          footer={
            selectedCustomer && (
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant={selectedCustomer.status === 0 ? 'primary' : 'danger'}
                    size="sm"
                    onClick={() => handleToggleBlocked(selectedCustomer.id, selectedCustomer.status === 0)}
                  >
                    {selectedCustomer.status === 0 ? 'Desbloquear' : 'Bloquear'}
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
                      <p className="font-medium">{selectedCustomer.nome}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Telefone</p>
                      <p className="font-medium">{selectedCustomer.numeroCelular || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">{selectedCustomer.status === 1 ? 'Ativo' : 'Inativo'}</p>
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
                    {selectedCustomer.status === 0 && (
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
                    <div className="text-2xl font-bold text-blue-600">{selectedCustomer.totalPedidos}</div>
                    <div className="text-sm text-gray-600">Total de pedidos</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedCustomer.totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    <div className="text-sm text-gray-600">Total gasto</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedCustomer.totalPedidos > 0 
                        ? (selectedCustomer.totalGasto / selectedCustomer.totalPedidos).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
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
                {customerAddresses.length > 0 ? (
                  <div className="space-y-3">
                    {customerAddresses.map((address) => (
                      <div key={address.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {address.rua}, {address.numero}
                              {address.complemento && ` - ${address.complemento}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.bairro}, {address.cidade} - {address.estado}
                            </p>
                            <p className="text-sm text-gray-600">CEP: {address.cep}</p>
                          </div>
                          {address.favorito && (
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

            </div>
          )}
        </Drawer>

        {/* Customer Form Modal */}
        <CustomerFormModal
          isOpen={isCustomerFormOpen}
          onClose={() => {
            setIsCustomerFormOpen(false);
            setEditingCustomer(null);
          }}
          onSubmit={handleCustomerFormSubmit}
          customer={null} // TODO: Converter Usuario para Customer no modal
          loading={isFormLoading}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingCustomer(null);
          }}
          onConfirm={handleDeleteConfirm}
          loading={loading}
          itemCount={1}
          title="Excluir cliente"
          message={deletingCustomer 
            ? `Tem certeza que deseja excluir o cliente "${deletingCustomer.nome}"? Esta ação não pode ser desfeita.`
            : undefined
          }
        />

        {/* Data View Modal */}
        <DataViewModal
          isOpen={isDataViewOpen}
          onClose={() => {
            setIsDataViewOpen(false);
            setViewingCustomer(null);
          }}
          title={viewingCustomer ? `Cliente: ${viewingCustomer.nome}` : 'Detalhes do Cliente'}
          data={viewingCustomer ? (viewingCustomer as unknown as Record<string, unknown>) : {}}
        />
      </div>
    </div>
  );
};