import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui';
import { useCatalog } from '../../hooks/customer/useCatalog';
import { ProductCard } from '../../components/customer/ProductCard';
import { FiltersPanel, FiltersDrawer } from '../../components/customer/FiltersPanel';
import { SortSelect, LayoutToggle, DensityToggle } from '../../components/customer/CatalogControls';
import { Pagination } from '../../components/customer/Pagination';
import { SearchBar } from '../../components/customer/SearchBar';

export const HomePage: React.FC = () => {
  // Layout state
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [density, setDensity] = useState<'compact' | 'standard'>('standard');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Catalog hook
  const {
    products,
    pagination,
    loading,
    error,
    filters,
    sort,
    updateFilters,
    clearFilters,
    updateSort,
    goToPage,
    nextPage,
    prevPage,
    setPageSize
  } = useCatalog(
    {},
    { field: 'relevance', direction: 'desc' },
    layout === 'list' ? 8 : 12
  );

  // Update search filter when search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchTerm || undefined });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, updateFilters]);

  // Update page size when layout changes
  useEffect(() => {
    setPageSize(layout === 'list' ? 8 : 12);
  }, [layout, setPageSize]);

  // Get grid classes based on layout and density
  const getGridClasses = () => {
    if (layout === 'list') {
      return 'space-y-4';
    }
    
    if (density === 'compact') {
      return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
    }
    
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-600 bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-md">
              Produtos Frescos Direto do Produtor
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto drop-shadow-sm">
              Descubra a qualidade e frescor dos nossos produtos orgânicos e naturais
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar produtos..."
                className="w-full"
              />
            </div>
            
            {/* Mobile filters button */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFiltersDrawer(true)}
                className="w-full border-green-300 text-green-600 hover:bg-green-50"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filtros
              </Button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <SortSelect
                sort={sort}
                onSortChange={updateSort}
              />
              
              <LayoutToggle
                layout={layout}
                onLayoutChange={setLayout}
              />
              
              <DensityToggle
                density={density}
                onDensityChange={setDensity}
              />
            </div>

            {/* Results count */}
            <div className="text-sm text-green-600">
              {pagination.total} produto{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FiltersPanel
              filters={filters}
              onFiltersChange={updateFilters}
              onClearFilters={clearFilters}
              categories={[]}
              priceRange={{ min: 0, max: 1000 }}
              availableTags={[]}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {loading && products.length > 0 && (
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            )}

            {products.length > 0 ? (
              <>
                <div className={getGridClasses()}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant={density}
                      layout={layout}
                      showAddToCart={true}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8">
                  <Pagination
                    pagination={pagination}
                    onPageChange={goToPage}
                    onNextPage={nextPage}
                    onPrevPage={prevPage}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Tente ajustar seus filtros ou termo de busca
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-green-300 text-green-600 hover:bg-green-50"
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        <FiltersDrawer
          isOpen={showFiltersDrawer}
          onClose={() => setShowFiltersDrawer(false)}
          filters={filters}
          onFiltersChange={updateFilters}
          onClearFilters={clearFilters}
          categories={[]}
          priceRange={{ min: 0, max: 1000 }}
          availableTags={[]}
        />
      </div>
    </div>
  );
};