import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product, ProductVariation } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; variation?: ProductVariation } }
  | { type: 'REMOVE_ITEM'; payload: { productId: number; variationId?: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; variationId?: number; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType extends CartState {
  addItem: (product: Product, quantity: number, variation?: ProductVariation) => void;
  removeItem: (productId: number, variationId?: number) => void;
  updateQuantity: (productId: number, quantity: number, variationId?: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, variation } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.productId === product.id && item.variationId === variation?.id
      );

      let newItems: CartItem[];
      
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          productId: product.id,
          product,
          quantity,
          variationId: variation?.id,
          variation,
        };
        newItems = [...state.items, newItem];
      }

      const total = newItems.reduce((sum, item) => {
        const price = item.variation?.price || item.product.price;
        return sum + (price * item.quantity);
      }, 0);

      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'REMOVE_ITEM': {
      const { productId, variationId } = action.payload;
      const newItems = state.items.filter(
        item => !(item.productId === productId && item.variationId === variationId)
      );

      const total = newItems.reduce((sum, item) => {
        const price = item.variation?.price || item.product.price;
        return sum + (price * item.quantity);
      }, 0);

      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, variationId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId, variationId } });
      }

      const newItems = state.items.map(item =>
        item.productId === productId && item.variationId === variationId
          ? { ...item, quantity }
          : item
      );

      const total = newItems.reduce((sum, item) => {
        const price = item.variation?.price || item.product.price;
        return sum + (price * item.quantity);
      }, 0);

      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  const addItem = (product: Product, quantity: number, variation?: ProductVariation) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, variation } });
  };

  const removeItem = (productId: number, variationId?: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variationId } });
  };

  const updateQuantity = (productId: number, quantity: number, variationId?: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variationId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Load cart from localStorage on mount
  React.useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const cartData = JSON.parse(storedCart);
        cartData.items.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_ITEM', payload: { product: item.product, quantity: item.quantity, variation: item.variation } });
        });
      } catch {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};