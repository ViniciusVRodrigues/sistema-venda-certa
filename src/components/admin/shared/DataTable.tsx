import React, { useState } from 'react';
import { Input, Button, LoadingSpinner } from '../../ui';
import type { PaginationData, SortOption } from '../../../types';

export interface Column<T = any> {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationData;
  onPageChange?: (page: number) => void;
  onSort?: (sort: SortOption) => void;
  onSearch?: (search: string) => void;
  searchPlaceholder?: string;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  rowKey?: string | ((record: T) => string);
  emptyText?: string;
  bulkActions?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  onSort,
  onSearch,
  searchPlaceholder = 'Buscar...',
  selectedRows = [],
  onSelectionChange,
  rowKey = 'id',
  emptyText = 'Nenhum registro encontrado',
  bulkActions,
  filters,
  actions
}: DataTableProps<T>) => {
  const [searchValue, setSearchValue] = useState('');
  const [sortConfig, setSortConfig] = useState<SortOption>({ field: '', direction: 'asc' });

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index.toString();
  };

  const handleSort = (field: string) => {
    const direction: 'asc' | 'desc' = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    const newSort = { field, direction };
    setSortConfig(newSort);
    onSort?.(newSort);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map((record, index) => getRowKey(record, index));
      onSelectionChange?.(allIds);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (recordKey: string, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedRows, recordKey]);
    } else {
      onSelectionChange?.(selectedRows.filter(id => id !== recordKey));
    }
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { page, totalPages } = pagination;
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Show pages around current page
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    
    if (start > 2) pages.push('...');
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }
    
    if (end < totalPages - 1) pages.push('...');
    
    // Always show last page if more than 1 page
    if (totalPages > 1) pages.push(totalPages);

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= totalPages}
          >
            Próximo
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando{' '}
              <span className="font-medium">{(page - 1) * pagination.pageSize + 1}</span>{' '}
              até{' '}
              <span className="font-medium">
                {Math.min(page * pagination.pageSize, pagination.total)}
              </span>{' '}
              de{' '}
              <span className="font-medium">{pagination.total}</span>{' '}
              resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(page - 1)}
                disabled={page <= 1}
                className="rounded-l-md"
              >
                Anterior
              </Button>
              {pages.map((pageNum, index) => (
                <React.Fragment key={index}>
                  {pageNum === '...' ? (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm text-gray-700">
                      ...
                    </span>
                  ) : (
                    <Button
                      variant={pageNum === page ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => onPageChange?.(pageNum as number)}
                      className="rounded-none"
                    >
                      {pageNum}
                    </Button>
                  )}
                </React.Fragment>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(page + 1)}
                disabled={page >= totalPages}
                className="rounded-r-md"
              >
                Próximo
              </Button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const getSortIcon = (field: string) => {
    if (sortConfig.field !== field) {
      return (
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortConfig.direction === 'asc') {
      return (
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with search and actions */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            {onSearch && (
              <div className="flex-1 max-w-sm">
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            )}
            {filters}
          </div>
          <div className="flex items-center gap-2">
            {selectedRows.length > 0 && bulkActions}
            {actions}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {onSelectionChange && (
                <th className="px-6 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.width ? `w-${column.width}` : ''}`}
                  style={{ textAlign: column.align || 'left' }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.title}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectionChange ? 1 : 0)}
                  className="px-6 py-12 text-center"
                >
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-gray-500">Carregando...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectionChange ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((record, index) => {
                const recordKey = getRowKey(record, index);
                const isSelected = selectedRows.includes(recordKey);
                
                return (
                  <tr
                    key={recordKey}
                    className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                  >
                    {onSelectionChange && (
                      <td className="px-6 py-4 w-12">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(recordKey, e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        style={{ textAlign: column.align || 'left' }}
                      >
                        {column.render
                          ? column.render(record[column.key], record, index)
                          : record[column.key]
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};