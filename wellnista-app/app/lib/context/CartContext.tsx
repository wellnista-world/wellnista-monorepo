import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product } from '../../../config/products';
import { useAuth } from './AuthContext';
import { 
  saveCartToStorage, 
  loadCartFromStorage, 
  clearCartFromStorage, 
  mergeCarts 
} from '../utils/cartUtils';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  incrementQuantity: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart from localStorage
  useEffect(() => {
    const loadedCart = loadCartFromStorage(user?.id);
    setCart(loadedCart);
  }, [user]);

  // Save cart to localStorage
  useEffect(() => {
    saveCartToStorage(cart, user?.id);
  }, [cart, user?.id]);

  // Clear anonymous cart when user logs in
  useEffect(() => {
    if (user) {
      const anonymousCart = loadCartFromStorage();
      if (anonymousCart.length > 0) {
        // Merge anonymous cart with user cart
        const mergedCart = mergeCarts(cart, anonymousCart);
        setCart(mergedCart);
        // Clear anonymous cart
        clearCartFromStorage();
      }
    }
  }, [user]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const found = prev.find(item => item.product.id === product.id);
      if (found) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const incrementQuantity = (productId: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decrementQuantity = (productId: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    clearCartFromStorage(user?.id);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}; 