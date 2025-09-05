import React from 'react';
import { Link } from 'react-router-dom';
import type { Produto } from '../../types';
import { Button, Badge, Card } from '../ui';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Produto;
  variant?: 'compact' | 'standard';
  layout?: 'grid' | 'list';
  showAddToCart?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'standard',
  layout = 'grid',
  showAddToCart = true,
  className = ''
}) => {
  const { addItem } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Convertendo Produto para Product temporariamente para o carrinho
    const productForCart = {
      id: product.id,
      name: product.nome,
      price: product.preco,
      categoryId: product.fk_categoria_id,
      description: product.descricao,
      unit: product.medida || 'un',
      images: product.imagem ? [`data:image/jpeg;base64,${btoa(String.fromCharCode(...product.imagem))}`] : [],
      status: product.status === 1 ? 'active' : 'inactive' as 'active' | 'inactive' | 'out_of_stock',
      stock: product.estoque,
      tags: product.tags ? product.tags.split(',') : [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    addItem(productForCart, 1);
  };

  const getStatusBadge = (status: number, estoque: number) => {
    if (status === 1 && estoque > 0) {
      if (estoque <= 5) {
        return <Badge variant="warning" size="sm">Últimas unidades</Badge>;
      }
      return null;
    }
    if (status === 0 || estoque === 0) {
      return <Badge variant="danger" size="sm">Sem estoque</Badge>;
    }
    return null;
  };

  const isNewProduct = () => {
    // Como não temos campo de data de criação no Produto, retornamos false
    return false;
  };

  const getPrice = () => {
    // Versão simplificada sem variações (produto não tem variações no database_schema)
    return {
      price: product.preco,
      isVariation: false
    };
  };

  const { price, isVariation } = getPrice();
  const isAvailable = product.status === 1 && product.estoque > 0;

  // Helper para converter imagem binária para base64
  const getImageSrc = () => {
    if (product.imagem) {
      return `data:image/jpeg;base64,${btoa(String.fromCharCode(...product.imagem))}`;
    }
    return '/placeholder-product.jpg'; // imagem padrão
  };

  if (layout === 'list') {
    return (
      <Card 
        padding="none" 
        className={`overflow-hidden hover:shadow-lg transition-shadow border border-green-100 ${className}`}
      >
        <Link to={`/product/${product.id}`} className="block">
          <div className="flex">
            {/* Image */}
            <div className="w-32 h-32 flex-shrink-0 bg-green-50 relative">
              <img
                src={getImageSrc()}
                alt={product.nome}
                className="w-full h-full object-cover"
              />
              {isNewProduct() && (
                <Badge 
                  variant="success" 
                  size="sm" 
                  className="absolute top-2 left-2"
                >
                  Novo
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-1">
                    {product.nome}
                  </h3>
                  <p className="text-green-700 text-sm mb-2 line-clamp-2">
                    {product.descricaoResumida || product.descricao}
                  </p>
                </div>
                {getStatusBadge(product.status, product.estoque)}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-green-700">
                    {isVariation && <span className="text-sm font-normal">a partir de </span>}
                    R$ {price.toFixed(2)}
                    <span className="text-sm text-green-500 font-normal">
                      /{product.medida}
                    </span>
                  </div>
                  {product.estoque > 0 && (
                    <span className="text-sm text-green-500">
                      {product.estoque} disponível
                    </span>
                  )}
                </div>

                {showAddToCart && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddToCart}
                    disabled={!isAvailable}
                    className="bg-green-600 hover:bg-green-700 border-green-700"
                  >
                    Adicionar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  // Grid layout
  const cardHeight = variant === 'compact' ? 'h-80' : 'h-96';

  return (
    <Card 
      padding="none" 
      className={`${cardHeight} overflow-hidden hover:shadow-lg transition-shadow border border-green-100 ${className}`}
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        {/* Image */}
        <div className={`relative bg-green-50 ${variant === 'compact' ? 'h-40' : 'h-48'}`}>
          <img
            src={getImageSrc()}
            alt={product.nome}
            className="w-full h-full object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 space-y-1">
            {isNewProduct() && (
              <Badge variant="success" size="sm">
                Novo
              </Badge>
            )}
          </div>
          
          <div className="absolute top-2 right-2">
            {getStatusBadge(product.status, product.estoque)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className={`font-semibold text-green-900 ${variant === 'compact' ? 'text-base' : 'text-lg'}`}>
              {product.nome}
            </h3>
          </div>

          <p className={`text-green-700 mb-3 line-clamp-2 flex-1 ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
            {variant === 'compact' 
              ? product.descricaoResumida || (product.descricao ? product.descricao.slice(0, 60) + '...' : '')
              : product.descricaoResumida || product.descricao
            }
          </p>

          {/* Price and Stock */}
          <div className="mb-4">
            <div className={`font-bold text-green-700 ${variant === 'compact' ? 'text-base' : 'text-lg'}`}>
              {isVariation && <span className="text-xs font-normal">a partir de </span>}
              R$ {price.toFixed(2)}
              <span className={`text-green-500 font-normal ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
                /{product.medida}
              </span>
            </div>
            {product.estoque > 0 && (
              <span className={`text-green-500 ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
                {product.estoque} disponível
              </span>
            )}
          </div>

          {/* Actions */}
          {showAddToCart && (
            <div className="mt-auto">
              <Button
                variant="primary"
                size={variant === 'compact' ? 'sm' : 'md'}
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className="w-full bg-green-600 hover:bg-green-700 border-green-700"
              >
                Adicionar ao carrinho
              </Button>
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
};