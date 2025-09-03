import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Badge, Card } from '../../components/ui';
import { useCart } from '../../context/CartContext';
import { useProductDetails } from '../../hooks/customer/useProduct';
import type { Produto } from '../../types';

// Rating Stars Component
interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const currentRating = interactive ? (hoverRating || rating) : rating;

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= currentRating;
        
        return (
          <button
            key={index}
            type="button"
            className={`${sizeClasses[size]} ${
              interactive
                ? 'cursor-pointer hover:scale-110 transition-transform'
                : 'cursor-default'
            }`}
            onClick={() => interactive && onRatingChange?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            disabled={!interactive}
          >
            <svg
              fill={isFilled ? '#fbbf24' : '#e5e7eb'}
              viewBox="0 0 20 20"
              className="drop-shadow-sm"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

// Quantity Selector Component
interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg'
  };

  const buttonSizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
  };

  return (
    <div className={`flex items-center border border-gray-300 rounded-md overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        className={`${buttonSizeClasses[size]} bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium border-r border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
      >
        −
      </button>
      
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className={`${sizeClasses[size]} w-16 text-center border-0 focus:ring-0 focus:outline-none`}
      />
      
      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        className={`${buttonSizeClasses[size]} bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium border-l border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
      >
        +
      </button>
    </div>
  );
};

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  
  const { product, reviews, reviewStats, relatedProducts, loading, error } = useProductDetails(id || null);
  
  // State
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Produto não encontrado</h2>
          <p className="text-gray-600 mb-6">
            {error || 'O produto que você está procurando não existe ou foi removido.'}
          </p>
          <Link to="/">
            <Button variant="primary" className="bg-green-600 hover:bg-green-700">
              Voltar ao catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate current price and stock
  const currentPrice = product.preco;
  const currentStock = product.estoque;
  const isAvailable = product.status === 1 && currentStock > 0;

  // Create mock image URL if no image is available
  const mockImageUrl = 'https://images.unsplash.com/photo-1546470427-e26264be0b37?w=600';
  const productImages = [mockImageUrl]; // Since schema has only one image field

  const handleAddToCart = () => {
    // Convert Produto to Product format for cart compatibility
    const productForCart = {
      id: product.id,
      name: product.nome,
      description: product.descricao || '',
      shortDescription: product.descricaoResumida || '',
      categoryId: product.fk_categoria_id,
      price: product.preco,
      unit: product.medida,
      stock: product.estoque,
      status: product.status === 1 ? 'active' as const : 'inactive' as const,
      images: productImages,
      tags: product.tags ? product.tags.split(',') : [],
      sku: product.sku
    };
    addItem(productForCart, quantity);
  };

  const handleImageKeyDown = (e: React.KeyboardEvent, direction: 'prev' | 'next') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (direction === 'prev' && activeImageIndex > 0) {
        setActiveImageIndex(activeImageIndex - 1);
      } else if (direction === 'next' && activeImageIndex < productImages.length - 1) {
        setActiveImageIndex(activeImageIndex + 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-green-600">Início</Link>
          <span>/</span>
          <Link to="/" className="hover:text-green-600">Produtos</Link>
          <span>/</span>
          <span className="text-green-700 font-medium">{product.nome}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={productImages[activeImageIndex]}
                alt={product.nome}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    onKeyDown={(e) => handleImageKeyDown(e, index < activeImageIndex ? 'prev' : 'next')}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                      index === activeImageIndex
                        ? 'border-green-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.nome} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nome}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                {reviewStats.totalReviews > 0 && (
                  <div className="flex items-center space-x-2">
                    <RatingStars rating={reviewStats.averageRating} size="md" />
                    <span className="text-sm text-gray-600">
                      ({reviewStats.totalReviews} avaliação{reviewStats.totalReviews !== 1 ? 'ões' : ''})
                    </span>
                  </div>
                )}
                
                <Badge
                  variant={isAvailable ? 'success' : 'danger'}
                  size="sm"
                >
                  {isAvailable 
                    ? `${currentStock} em estoque` 
                    : 'Sem estoque'
                  }
                </Badge>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">{product.descricao}</p>
            </div>

            {/* Price */}
            <div className="border-t border-gray-200 pt-6">
              <div className="text-3xl font-bold text-green-700 mb-2">
                R$ {currentPrice.toFixed(2)}
                <span className="text-lg text-gray-600 font-normal">/{product.medida}</span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade:
                  </label>
                  <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    max={Math.min(currentStock, 99)}
                    disabled={!isAvailable}
                  />
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className="w-full bg-green-600 hover:bg-green-700 border-green-700"
              >
                {isAvailable ? 'Adicionar ao carrinho' : 'Produto indisponível'}
              </Button>
            </div>

            {/* Product Tags */}
            {product.tags && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-12">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Descrição' },
                { id: 'specifications', label: 'Especificações' },
                { id: 'reviews', label: `Avaliações (${reviewStats.totalReviews})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.descricao}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Especificações do produto</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">SKU:</span>
                    <span className="text-gray-600">{product.sku || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Categoria:</span>
                    <span className="text-gray-600">ID: {product.fk_categoria_id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Unidade:</span>
                    <span className="text-gray-600">{product.medida}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="text-gray-600">
                      {product.status === 1 ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {reviewStats.totalReviews > 0 ? (
                  <div className="space-y-6">
                    {/* Review Summary */}
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {reviewStats.averageRating.toFixed(1)}
                        </div>
                        <RatingStars rating={reviewStats.averageRating} size="lg" />
                        <div className="text-sm text-gray-600 mt-1">
                          {reviewStats.totalReviews} avaliação{reviewStats.totalReviews !== 1 ? 'ões' : ''}
                        </div>
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-200 pb-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900">
                                  {review.usuario?.nome || 'Usuário Anônimo'}
                                </span>
                                <RatingStars rating={review.avaliacao} size="sm" />
                              </div>
                              {review.comentario && (
                                <p className="text-gray-700">{review.comentario}</p>
                              )}
                              <div className="text-sm text-gray-500 mt-2">
                                Data da avaliação
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">⭐</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma avaliação ainda
                    </h3>
                    <p className="text-gray-600">
                      Seja o primeiro a avaliar este produto!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Produtos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <Card
                  key={relatedProduct.id}
                  padding="none"
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/product/${relatedProduct.id}`}>
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={mockImageUrl}
                        alt={relatedProduct.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {relatedProduct.nome}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {relatedProduct.descricaoResumida || relatedProduct.descricao}
                      </p>
                      <div className="text-lg font-bold text-green-700">
                        R$ {relatedProduct.preco.toFixed(2)}
                        <span className="text-sm text-green-500 font-normal">
                          /{relatedProduct.medida}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};