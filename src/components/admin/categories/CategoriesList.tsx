import React, { useState } from 'react';
import { useCategories } from '../../../hooks/useCategories';
import { DataTable, type Column } from '../shared/DataTable';
import { DeleteConfirmationModal } from '../shared/modals';
import { CategoryFormModal } from '../shared/modals/CategoryFormModal';
import { Button, Card, Badge } from '../../ui';
import type { Categoria } from '../../../types';

export const CategoriesList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null);
  
  // Modal states
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Categoria | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const {
    categories,
    loading,
    error,
    filters: currentFilters,
    fetchCategories,
    setFilters,
    setSort,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleStatus
  } = useCategories();

  const handleSearch = (search: string) => {
    setFilters({ ...currentFilters, search });
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryFormOpen(true);
  };

  const handleEditCategory = (category: Categoria) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleDeleteCategory = (category: Categoria) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleCategoryFormSubmit = async (formData: Omit<Categoria, 'id'>) => {
    try {
      setIsFormLoading(true);
      
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      
      setIsCategoryFormOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;

    try {
      await deleteCategory(deletingCategory.id);
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
    }
  };

  const handleToggleStatus = async (categoryId: number) => {
    try {
      await toggleStatus(categoryId);
    } catch (error) {
      console.error('Erro ao alterar status da categoria:', error);
    }
  };

  const getStatusBadge = (category: Categoria) => {
    if (category.estaAtiva) {
      return <Badge variant="success">Ativa</Badge>;
    }
    return <Badge variant="default">Inativa</Badge>;
  };

  const columns: Column<Categoria>[] = [
    {
      key: 'nome',
      title: 'Nome',
      sortable: true,
      render: (nome: string, record: Categoria) => (
        <div>
          <div className="font-medium text-gray-900">{nome}</div>
          {record.descricao && (
            <div className="text-sm text-gray-500">{record.descricao}</div>
          )}
        </div>
      )
    },
    {
      key: 'estaAtiva',
      title: 'Status',
      align: 'center',
      render: (_, record: Categoria) => getStatusBadge(record)
    },
    {
      key: 'actions',
      title: 'Ações',
      align: 'center',
      render: (_, record: Categoria) => (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditCategory(record)}
            title="Editar categoria"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(record.id)}
            className={record.estaAtiva ? 'text-gray-600' : 'text-green-600'}
            title={record.estaAtiva ? 'Desativar categoria' : 'Ativar categoria'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {record.estaAtiva ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteCategory(record)}
            title="Excluir categoria"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar categorias</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchCategories}>Tentar novamente</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="mt-2 text-gray-600">
            Gerencie as categorias de produtos do sistema
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Total de Categorias</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {categories.filter(c => c.estaAtiva).length}
              </div>
              <div className="text-sm text-gray-600">Categorias Ativas</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {categories.filter(c => !c.estaAtiva).length}
              </div>
              <div className="text-sm text-gray-600">Categorias Inativas</div>
            </div>
          </Card>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={categories}
          rowKey="id"
          loading={loading}
          onSort={setSort}
          onSearch={handleSearch}
          searchPlaceholder="Buscar por nome..."
          emptyText="Nenhuma categoria encontrada."
          actions={
            <Button onClick={handleCreateCategory}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Categoria
            </Button>
          }
        />

        {/* Modals */}
        <CategoryFormModal
          isOpen={isCategoryFormOpen}
          onClose={() => {
            setIsCategoryFormOpen(false);
            setEditingCategory(null);
          }}
          onSubmit={handleCategoryFormSubmit}
          category={editingCategory}
          isLoading={isFormLoading}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingCategory(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Excluir Categoria"
          message={
            deletingCategory
              ? `Tem certeza que deseja excluir a categoria "${deletingCategory.nome}"? Esta ação não pode ser desfeita.`
              : ''
          }
        />
      </div>
    </div>
  );
};
