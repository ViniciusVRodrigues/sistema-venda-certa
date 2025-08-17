import React from 'react';
import { Button } from '../ui';
import type { CatalogSort } from '../../services/customer/catalogService';

interface SortSelectProps {
  sort: CatalogSort;
  onSortChange: (sort: CatalogSort) => void;
  className?: string;
}

export const SortSelect: React.FC<SortSelectProps> = ({
  sort,
  onSortChange,
  className = ''
}) => {
  const sortOptions = [
    { value: 'relevance-desc', label: 'Mais relevantes', field: 'relevance' as const, direction: 'desc' as const },
    { value: 'price-asc', label: 'Menor preço', field: 'price' as const, direction: 'asc' as const },
    { value: 'price-desc', label: 'Maior preço', field: 'price' as const, direction: 'desc' as const },
    { value: 'name-asc', label: 'Nome A-Z', field: 'name' as const, direction: 'asc' as const },
    { value: 'name-desc', label: 'Nome Z-A', field: 'name' as const, direction: 'desc' as const },
    { value: 'created_at-desc', label: 'Mais recentes', field: 'created_at' as const, direction: 'desc' as const },
    { value: 'created_at-asc', label: 'Mais antigos', field: 'created_at' as const, direction: 'asc' as const }
  ];

  const currentValue = `${sort.field}-${sort.direction}`;

  const handleSortChange = (value: string) => {
    const option = sortOptions.find(opt => opt.value === value);
    if (option) {
      onSortChange({
        field: option.field,
        direction: option.direction
      });
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label className="text-sm font-medium text-green-700 whitespace-nowrap">
        Ordenar por:
      </label>
      <select
        value={currentValue}
        onChange={(e) => handleSortChange(e.target.value)}
        className="min-w-40 px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface LayoutToggleProps {
  layout: 'grid' | 'list';
  onLayoutChange: (layout: 'grid' | 'list') => void;
  className?: string;
}

export const LayoutToggle: React.FC<LayoutToggleProps> = ({
  layout,
  onLayoutChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <Button
        variant={layout === 'grid' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onLayoutChange('grid')}
        className={layout === 'grid' 
          ? 'bg-green-600 border-green-600' 
          : 'border-green-300 text-green-600 hover:bg-green-50'
        }
        title="Visualização em grade"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </Button>
      <Button
        variant={layout === 'list' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onLayoutChange('list')}
        className={layout === 'list' 
          ? 'bg-green-600 border-green-600' 
          : 'border-green-300 text-green-600 hover:bg-green-50'
        }
        title="Visualização em lista"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </Button>
    </div>
  );
};

interface DensityToggleProps {
  density: 'compact' | 'standard';
  onDensityChange: (density: 'compact' | 'standard') => void;
  className?: string;
}

export const DensityToggle: React.FC<DensityToggleProps> = ({
  density,
  onDensityChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label className="text-sm font-medium text-green-700 whitespace-nowrap">
        Densidade:
      </label>
      <div className="flex items-center space-x-1">
        <Button
          variant={density === 'compact' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onDensityChange('compact')}
          className={density === 'compact' 
            ? 'bg-green-600 border-green-600' 
            : 'border-green-300 text-green-600 hover:bg-green-50'
          }
        >
          Compacta
        </Button>
        <Button
          variant={density === 'standard' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onDensityChange('standard')}
          className={density === 'standard' 
            ? 'bg-green-600 border-green-600' 
            : 'border-green-300 text-green-600 hover:bg-green-50'
          }
        >
          Padrão
        </Button>
      </div>
    </div>
  );
};