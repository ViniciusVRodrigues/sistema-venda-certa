import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { Button, Badge, Card } from '../ui';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
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
    addItem(product, 1);
  };

  const getStatusBadge = (status: string, stock: number) => {
    if (status === 'active' && stock > 0) {
      if (stock <= 5) {
        return <Badge variant="warning" size="sm">Últimas unidades</Badge>;
      }
      return null;
    }
    if (status === 'out_of_stock' || stock === 0) {
      return <Badge variant="danger" size="sm">Sem estoque</Badge>;
    }
    if (status === 'inactive') {
      return <Badge variant="default" size="sm">Inativo</Badge>;
    }
    return null;
  };

  const isNewProduct = () => {
    const daysSinceCreated = Math.floor(
      (Date.now() - product.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceCreated <= 7;
  };

  const getPrice = () => {
    // If has variations, show the cheapest price
    if (product.variations && product.variations.length > 0) {
      const cheapestPrice = Math.min(...product.variations.map(v => v.price));
      if (cheapestPrice < product.price) {
        return {
          price: cheapestPrice,
          isVariation: true
        };
      }
    }
    return {
      price: product.price,
      isVariation: false
    };
  };

  const { price, isVariation } = getPrice();
  const isAvailable = product.status === 'active' && product.stock > 0;

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
                src={product.images[0]}
                alt={product.name}
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
                    {product.name}
                  </h3>
                  <p className="text-green-700 text-sm mb-2 line-clamp-2">
                    {product.shortDescription || product.description}
                  </p>
                </div>
                {getStatusBadge(product.status, product.stock)}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-green-700">
                    {isVariation && <span className="text-sm font-normal">a partir de </span>}
                    R$ {price.toFixed(2)}
                    <span className="text-sm text-green-500 font-normal">
                      /{product.unit}
                    </span>
                  </div>
                  {product.stock > 0 && (
                    <span className="text-sm text-green-500">
                      {product.stock} disponível
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
            src={product.images[0]}
            alt={product.name}
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
            {getStatusBadge(product.status, product.stock)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className={`font-semibold text-green-900 ${variant === 'compact' ? 'text-base' : 'text-lg'}`}>
              {product.name}
            </h3>
          </div>

          <p className={`text-green-700 mb-3 line-clamp-2 flex-1 ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
            {variant === 'compact' 
              ? product.shortDescription || product.description.slice(0, 60) + '...'
              : product.shortDescription || product.description
            }
          </p>

          {/* Price and Stock */}
          <div className="mb-4">
            <div className={`font-bold text-green-700 ${variant === 'compact' ? 'text-base' : 'text-lg'}`}>
              {isVariation && <span className="text-xs font-normal">a partir de </span>}
              R$ {price.toFixed(2)}
              <span className={`text-green-500 font-normal ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
                /{product.unit}
              </span>
            </div>
            {product.stock > 0 && (
              <span className={`text-green-500 ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
                {product.stock} disponível
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