import React, { useState } from 'react';
import { useProducts, useCategories } from '../../../hooks/useProducts';
import { DataTable, type Column } from '../shared/DataTable';
import { DeleteConfirmationModal, ProductFormModal, type ProductFormData } from '../shared/modals';
import { Button, Card, Badge, Select } from '../../ui';
import type { Produto } from '../../../types';

export const ProductsList: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  
  // Modal states
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Produto | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

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
    createProduct,
    updateProduct,
    deleteProduct,
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
      await bulkUpdateStatus(selectedProducts, 1);
      setSelectedProducts([]);
    } catch (error) {
      console.error('Erro ao ativar produtos:', error);
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedProducts.length === 0) return;
    try {
      await bulkUpdateStatus(selectedProducts, 0);
      setSelectedProducts([]);
    } catch (error) {
      console.error('Erro ao desativar produtos:', error);
    }
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  // Modal handlers
  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleEditProduct = (product: Produto) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = (product: Produto) => {
    setDeletingProduct(product);
    setSelectedProducts([]);
    setIsDeleteModalOpen(true);
  };

  const handleProductFormSubmit = async (formData: ProductFormData) => {
    try {
      setIsFormLoading(true);
      
      // Converter ProductFormData para o formato esperado pelo service
      const produtoData: Partial<Produto> = {
        nome: formData.nome,
        descricao: formData.descricao,
        descricaoResumida: formData.descricaoResumida,
        preco: formData.preco,
        medida: formData.medida,
        estoque: formData.estoque,
        status: formData.status,
        sku: formData.sku,
        tags: formData.tags,
        fk_categoria_id: formData.categoria.id,
        // Converter string para Uint8Array se necessário
        imagem: formData.imagem ? new TextEncoder().encode(formData.imagem) : undefined
      };
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, produtoData);
      } else {
        await createProduct(produtoData as Omit<Produto, 'id'>);
      }
      
      setIsProductFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deletingProduct) {
        // Single product delete
        await deleteProduct(deletingProduct.id);
        setDeletingProduct(null);
      } else if (selectedProducts.length > 0) {
        // Bulk delete
        await bulkDelete(selectedProducts);
        setSelectedProducts([]);
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Erro ao excluir produto(s):', error);
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge variant="success">Ativo</Badge>;
      case 0:
        return <Badge variant="default">Inativo</Badge>;
      default:
        return <Badge variant="default">Desconhecido</Badge>;
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

  const columns: Column<Produto>[] = [
    {
      key: 'imagem',
      title: '',
      width: '16',
      render: (imagem: Uint8Array | undefined) => (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          {imagem ? (
            <img 
              src={`data:image/jpeg;base64,${btoa(String.fromCharCode(...imagem))}`}
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
      key: 'nome',
      title: 'Produto',
      sortable: true,
      render: (nome: string, record: Produto) => (
        <div>
          <div className="font-medium text-gray-900">{nome}</div>
          <div className="text-sm text-gray-500">{record.sku}</div>
        </div>
      )
    },
    {
      key: 'fk_categoria_id',
      title: 'Categoria',
      sortable: true,
      render: (categoria_id: number) => {
        const categoria = categories.find(cat => cat.id === categoria_id);
        return categoria ? categoria.nome : 'Sem categoria';
      }
    },
    {
      key: 'preco',
      title: 'Preço',
      sortable: true,
      align: 'right',
      render: (preco: number) => 
        preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },
    {
      key: 'estoque',
      title: 'Estoque',
      sortable: true,
      align: 'center',
      render: (estoque: number) => getStockBadge(estoque)
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      align: 'center',
      render: (status: number) => getStatusBadge(status)
    },
    {
      key: 'actions',
      title: 'Ações',
      width: '40',
      render: (_, record: Produto) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditProduct(record)}
            title="Editar produto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteProduct(record)}
            title="Excluir produto"
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
            value: category.id.toString(),
            label: category.nome
          }))
        ]}
      />
    </div>
  );

  const actions = (
    <Button
      onClick={handleCreateProduct}
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
                {products.filter(p => p.status === 1).length}
              </div>
              <div className="text-sm text-gray-600">Produtos ativos</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {products.filter(p => p.estoque <= 10).length}
              </div>
              <div className="text-sm text-gray-600">Estoque baixo</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {products.filter(p => p.estoque === 0).length}
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
          selectedRows={selectedProducts.map(String)}
          onSelectionChange={(ids) => setSelectedProducts(ids.map(Number))}
          rowKey={(product) => product.id.toString()}
          emptyText="Nenhum produto encontrado. Cadastre o primeiro produto para começar."
          bulkActions={bulkActions}
          filters={filtersComponent}
          actions={actions}
        />

        {/* Product Form Modal */}
        <ProductFormModal
          isOpen={isProductFormOpen}
          onClose={() => {
            setIsProductFormOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={handleProductFormSubmit}
          product={editingProduct}
          loading={isFormLoading}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingProduct(null);
          }}
          onConfirm={handleDeleteConfirm}
          loading={loading}
          itemCount={deletingProduct ? 1 : selectedProducts.length}
          title={deletingProduct ? 'Excluir produto' : undefined}
          message={deletingProduct 
            ? `Tem certeza que deseja excluir o produto "${deletingProduct.nome}"? Esta ação não pode ser desfeita.`
            : undefined
          }
        />
      </div>
    </div>
  );
};