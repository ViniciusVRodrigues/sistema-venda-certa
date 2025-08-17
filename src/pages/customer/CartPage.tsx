import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../../components/ui';
import { useCart } from '../../context/CartContext';
import { QuantitySelector } from '../customer/ProductDetailPage';
import type { CartItem } from '../../types';

// Cart Summary Component
interface CartSummaryProps {
  subtotal: number;
  deliveryFee?: number;
  total: number;
  itemCount: number;
  className?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  deliveryFee = 0,
  total,
  itemCount,
  className = ''
}) => {
  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do pedido</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})
          </span>
          <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
        </div>
        
        {deliveryFee > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Frete</span>
            <span className="font-medium">R$ {deliveryFee.toFixed(2)}</span>
          </div>
        )}
        
        <hr className="border-gray-200" />
        
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total</span>
          <span className="text-green-700">R$ {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/checkout">
          <Button
            variant="primary"
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 border-green-700"
          >
            Finalizar compra
          </Button>
        </Link>
      </div>

      <div className="mt-3">
        <Link to="/">
          <Button
            variant="outline"
            size="md"
            className="w-full border-green-300 text-green-600 hover:bg-green-50"
          >
            Continuar comprando
          </Button>
        </Link>
      </div>
    </Card>
  );
};

// Cart Item Component
interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number, variationId?: string) => void;
  onRemove: (productId: string, variationId?: string) => void;
  onUndoRemove?: () => void;
  className?: string;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onQuantityChange,
  onRemove,
  className = ''
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [showUndoToast, setShowUndoToast] = useState(false);
  
  const itemPrice = item.variation?.price || item.product.price;
  const subtotal = itemPrice * item.quantity;
  const maxQuantity = Math.min(
    item.variation?.stock || item.product.stock, 
    99
  );

  const handleRemove = () => {
    setIsRemoving(true);
    setShowUndoToast(true);
    
    // Auto-confirm removal after 5 seconds
    setTimeout(() => {
      if (showUndoToast) {
        confirmRemoval();
      }
    }, 5000);
  };

  const confirmRemoval = () => {
    onRemove(item.productId, item.variationId);
    setShowUndoToast(false);
    setIsRemoving(false);
  };

  const handleUndoRemove = () => {
    setIsRemoving(false);
    setShowUndoToast(false);
  };

  const handleQuantityChange = (newQuantity: number) => {
    onQuantityChange(item.productId, newQuantity, item.variationId);
  };

  if (showUndoToast) {
    return (
      <Card className={`p-4 border-orange-200 bg-orange-50 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-orange-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-orange-800">
              <strong>{item.product.name}</strong> foi removido do carrinho
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndoRemove}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              Desfazer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={confirmRemoval}
              className="border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              ✕
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${isRemoving ? 'opacity-50' : ''} ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
          <Link to={`/product/${item.product.id}`}>
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <Link 
                to={`/product/${item.product.id}`}
                className="text-lg font-medium text-gray-900 hover:text-green-600 transition-colors"
              >
                {item.product.name}
              </Link>
              
              {item.variation && (
                <p className="text-sm text-gray-600 mt-1">
                  Variação: {item.variation.name}
                </p>
              )}
              
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {item.product.shortDescription || item.product.description}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
              title="Remover item"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Price and Quantity */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <div className="text-lg font-medium text-gray-900">
                R$ {itemPrice.toFixed(2)}
                <span className="text-sm text-gray-500 font-normal">
                  /{item.product.unit}
                </span>
              </div>

              <QuantitySelector
                value={item.quantity}
                onChange={handleQuantityChange}
                max={maxQuantity}
                size="sm"
                disabled={isRemoving}
              />
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold text-green-700">
                R$ {subtotal.toFixed(2)}
              </div>
              {maxQuantity <= 5 && (
                <div className="text-xs text-orange-600">
                  Apenas {maxQuantity} disponível
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const CartPage: React.FC = () => {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (productId: string, quantity: number, variationId?: string) => {
    updateQuantity(productId, quantity, variationId);
  };

  const handleRemoveItem = (productId: string, variationId?: string) => {
    removeItem(productId, variationId);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Carrinho de compras</h1>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Adicione alguns produtos incríveis ao seu carrinho e volte aqui para finalizar sua compra.
            </p>
            
            <Link to="/">
              <Button
                variant="primary"
                size="lg"
                className="bg-green-600 hover:bg-green-700 border-green-700"
              >
                Continuar comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carrinho de compras</h1>
          <p className="text-gray-600 mt-2">
            {itemCount} item{itemCount !== 1 ? 's' : ''} em seu carrinho
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard
                  key={`${item.productId}-${item.variationId || 'default'}`}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* Additional Info */}
            <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900">
                    Informações importantes
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    • Os preços e disponibilidade dos produtos podem variar antes da finalização da compra<br />
                    • O frete será calculado na etapa de checkout<br />
                    • Produtos orgânicos têm validade limitada - finalize sua compra o quanto antes
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <CartSummary
                subtotal={total}
                total={total}
                itemCount={itemCount}
              />

              {/* Security Info */}
              <Card className="mt-4 p-4 bg-green-50 border-green-200">
                <div className="flex items-start space-x-3">
                  <div className="text-green-600 mt-0.5">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-green-900">
                      Compra segura
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      Seus dados estão protegidos e a transação é segura
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};