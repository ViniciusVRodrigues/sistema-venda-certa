import React from 'react';
import { Card, Button, Input } from '../ui';
import type { Category } from '../../types';
import type { CatalogFilters } from '../../services/customer/catalogService';
import { formatCurrencyBR } from '../../utils/format';

interface FiltersProps {
  filters: CatalogFilters;
  onFiltersChange: (filters: CatalogFilters) => void;
  onClearFilters: () => void;
  categories: Category[];
  priceRange: { min: number; max: number };
  availableTags: string[];
  className?: string;
}

export const FiltersPanel: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  categories,
  priceRange,
  availableTags,
  className = ''
}) => {
  const updateFilter = (key: keyof CatalogFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    updateFilter('tags', newTags);
  };

  const hasActiveFilters = () => {
    return (
      filters.category ||
      filters.priceRange ||
      filters.availability !== 'all' ||
      (filters.tags && filters.tags.length > 0)
    );
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-green-900">Filtros</h3>
        {hasActiveFilters() && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-green-600 border-green-300 hover:bg-green-50"
          >
            Limpar
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">
            Categoria
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white"
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">
            Disponibilidade
          </label>
          <select
            value={filters.availability || 'all'}
            onChange={(e) => updateFilter('availability', e.target.value as any)}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white"
          >
            <option value="all">Todos os produtos</option>
            <option value="in_stock">Em estoque</option>
            <option value="out_of_stock">Sem estoque</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">
            Faixa de preço
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.priceRange?.min || ''}
              onChange={(e) => {
                const min = parseFloat(e.target.value) || 0;
                const max = filters.priceRange?.max || priceRange.max;
                updateFilter('priceRange', min > 0 || max < priceRange.max ? { min, max } : undefined);
              }}
              min={priceRange.min}
              max={priceRange.max}
              step="0.01"
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.priceRange?.max || ''}
              onChange={(e) => {
                const max = parseFloat(e.target.value) || priceRange.max;
                const min = filters.priceRange?.min || 0;
                updateFilter('priceRange', min > 0 || max < priceRange.max ? { min, max } : undefined);
              }}
              min={priceRange.min}
              max={priceRange.max}
              step="0.01"
              className="text-sm"
            />
          </div>
          <div className="text-xs text-green-600 mt-1">
            {formatCurrencyBR(priceRange.min)} - {formatCurrencyBR(priceRange.max)}
          </div>
        </div>

        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => {
                const isSelected = filters.tags?.includes(tag) || false;
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Mobile version as a drawer/modal
interface FiltersDrawerProps extends FiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FiltersDrawer: React.FC<FiltersDrawerProps> = ({
  isOpen,
  onClose,
  ...filtersProps
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-green-900">Filtros</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-gray-500"
          >
            ✕
          </Button>
        </div>
        
        <div className="p-4 overflow-y-auto h-full pb-20">
          <FiltersPanel {...filtersProps} className="border-0 p-0" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button
            variant="primary"
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Aplicar filtros
          </Button>
        </div>
      </div>
    </div>
  );
};