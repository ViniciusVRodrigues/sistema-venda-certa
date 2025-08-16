import React, { useState } from 'react';
import { useProducts, useCategories } from '../../../hooks/useProducts';
import { DataTable, type Column } from '../shared/DataTable';
import { Button, Card, Badge, Select } from '../../ui';
import type { Product } from '../../../types';

export const ProductsList: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const {
    products,
    pagination,
    loading,
    error,
    filters: currentFilters,
    fetchProducts,
    setFilters,
    setSort,
    setPage,
    bulkUpdateStatus,
    bulkDelete
  } = useProducts();

  const { categories } = useCategories();

  const handleSearch = (search: string) => {
    setFilters({ ...currentFilters, search });
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setFilters({ ...currentFilters, status: status || undefined });
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    setFilters({ ...currentFilters, category: category || undefined });
  };

  const handleBulkActivate = async () => {
    if (selectedProducts.length === 0) return;
    try {
      await bulkUpdateStatus(selectedProducts, 'active');
      setSelectedProducts([]);
    } catch (error) {
      console.error('Erro ao ativar produtos:', error);
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedProducts.length === 0) return;
    try {
      await bulkUpdateStatus(selectedProducts, 'inactive');
      setSelectedProducts([]);
    } catch (error) {
      console.error('Erro ao desativar produtos:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!window.confirm(`Tem certeza que deseja excluir ${selectedProducts.length} produto(s)?`)) {
      return;
    }
    try {
      await bulkDelete(selectedProducts);
      setSelectedProducts([]);
    } catch (error) {
      console.error('Erro ao excluir produtos:', error);
    }
  };

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="default">Inativo</Badge>;
      case 'out_of_stock':
        return <Badge variant="danger">Sem Estoque</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="danger">Esgotado</Badge>;
    } else if (stock <= 10) {
      return <Badge variant="warning">Baixo</Badge>;
    }
    return <span className="text-green-600 font-medium">{stock}</span>;
  };

  const columns: Column<Product>[] = [
    {
      key: 'images',
      title: '',
      width: '16',
      render: (images: string[]) => (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          {images && images.length > 0 ? (
            <img 
              src={images[0]} 
              alt="Produto" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder-product.png';
              }}
            />
          ) : (
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
      )
    },
    {
      key: 'name',
      title: 'Produto',
      sortable: true,
      render: (name: string, record: Product) => (
        <div>
          <div className="font-medium text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{record.sku}</div>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Categoria',
      sortable: true,
      render: (category: Product['category']) => category.name
    },
    {
      key: 'price',
      title: 'Preço',
      sortable: true,
      align: 'right',
      render: (price: number) => 
        price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },
    {
      key: 'stock',
      title: 'Estoque',
      sortable: true,
      align: 'center',
      render: (stock: number) => getStockBadge(stock)
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      align: 'center',
      render: (status: Product['status']) => getStatusBadge(status)
    },
    {
      key: 'updatedAt',
      title: 'Atualizado em',
      sortable: true,
      render: (date: Date) => new Date(date).toLocaleDateString('pt-BR')
    },
    {
      key: 'actions',
      title: 'Ações',
      width: '32',
      render: (_, record: Product) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // TODO: Navigate to edit product
              console.log('Edit product:', record.id);
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // TODO: Open product details
              console.log('View product:', record.id);
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Button>
        </div>
      )
    }
  ];

  const bulkActions = (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleBulkActivate}
        disabled={selectedProducts.length === 0}
      >
        Ativar
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBulkDeactivate}
        disabled={selectedProducts.length === 0}
      >
        Desativar
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={handleBulkDelete}
        disabled={selectedProducts.length === 0}
      >
        Excluir
      </Button>
    </div>
  );

  const filtersComponent = (
    <div className="flex space-x-4">
      <Select
        value={statusFilter}
        onChange={(e) => handleStatusFilter(e.target.value)}
        options={[
          { value: '', label: 'Todos os status' },
          { value: 'active', label: 'Ativo' },
          { value: 'inactive', label: 'Inativo' },
          { value: 'out_of_stock', label: 'Sem estoque' }
        ]}
      />
      <Select
        value={categoryFilter}
        onChange={(e) => handleCategoryFilter(e.target.value)}
        options={[
          { value: '', label: 'Todas as categorias' },
          ...categories.map(category => ({
            value: category.id,
            label: category.name
          }))
        ]}
      />
    </div>
  );

  const actions = (
    <Button
      onClick={() => {
        // TODO: Navigate to create product
        console.log('Create new product');
      }}
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Novo Produto
    </Button>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar produtos</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchProducts}>Tentar novamente</Button>
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
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600">Gerencie o catálogo de produtos da sua loja</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{products.length}</div>
              <div className="text-sm text-gray-600">Total de produtos</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Produtos ativos</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {products.filter(p => p.stock <= 10).length}
              </div>
              <div className="text-sm text-gray-600">Estoque baixo</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {products.filter(p => p.stock === 0).length}
              </div>
              <div className="text-sm text-gray-600">Sem estoque</div>
            </div>
          </Card>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={products}
          loading={loading}
          pagination={pagination || undefined}
          onPageChange={setPage}
          onSort={setSort}
          onSearch={handleSearch}
          searchPlaceholder="Buscar por nome, SKU ou descrição..."
          selectedRows={selectedProducts}
          onSelectionChange={setSelectedProducts}
          emptyText="Nenhum produto encontrado. Cadastre o primeiro produto para começar."
          bulkActions={bulkActions}
          filters={filtersComponent}
          actions={actions}
        />
      </div>
    </div>
  );
};