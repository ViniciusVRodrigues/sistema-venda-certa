import React from 'react';
import { Button } from '../ui';
import type { PaginationData } from '../../types';

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onNextPage,
  onPrevPage,
  className = ''
}) => {
  const { page, totalPages, total, pageSize } = pagination;

  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // Calculate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Maximum number of page buttons to show
    
    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show ellipsis when needed
      if (page <= 4) {
        // Near the beginning
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 3) {
        // Near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 ${className}`}>
      {/* Results info */}
      <div className="text-sm text-green-600">
        Mostrando {startItem}-{endItem} de {total} produtos
      </div>

      {/* Page navigation */}
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={page === 1}
          className="border-green-300 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Anterior
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 py-1 text-green-600">
                  ...
                </span>
              );
            }

            const pageNumber = pageNum as number;
            const isCurrentPage = pageNumber === page;

            return (
              <Button
                key={pageNumber}
                variant={isCurrentPage ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                className={isCurrentPage 
                  ? 'bg-green-600 border-green-600' 
                  : 'border-green-300 text-green-600 hover:bg-green-50'
                }
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={page === totalPages}
          className="border-green-300 text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

interface SimplePaginationProps {
  pagination: PaginationData;
  onNextPage: () => void;
  onPrevPage: () => void;
  className?: string;
}

export const SimplePagination: React.FC<SimplePaginationProps> = ({
  pagination,
  onNextPage,
  onPrevPage,
  className = ''
}) => {
  const { page, totalPages, total, pageSize } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <div className="text-sm text-green-600">
        {startItem}-{endItem} de {total}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={page === 1}
          className="border-green-300 text-green-600 hover:bg-green-50 disabled:opacity-50"
        >
          ← Anterior
        </Button>
        
        <span className="text-sm text-green-600">
          {page} de {totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={page === totalPages}
          className="border-green-300 text-green-600 hover:bg-green-50 disabled:opacity-50"
        >
          Próxima →
        </Button>
      </div>
    </div>
  );
};