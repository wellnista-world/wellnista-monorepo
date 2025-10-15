import { CartItem } from '../context/CartContext';

export const getCartKey = (userId?: string) => {
  return userId ? `cart_${userId}` : 'cart_anonymous';
};

export const saveCartToStorage = (cart: CartItem[], userId?: string) => {
  try {
    const cartKey = getCartKey(userId);
    localStorage.setItem(cartKey, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

export const loadCartFromStorage = (userId?: string): CartItem[] => {
  try {
    const cartKey = getCartKey(userId);
    const stored = localStorage.getItem(cartKey);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error);
  }
  return [];
};

export const clearCartFromStorage = (userId?: string) => {
  try {
    const cartKey = getCartKey(userId);
    localStorage.removeItem(cartKey);
  } catch (error) {
    console.error('Error clearing cart from storage:', error);
  }
};

export const mergeCarts = (userCart: CartItem[], anonymousCart: CartItem[]): CartItem[] => {
  const mergedCart = [...userCart];
  
  anonymousCart.forEach((anonymousItem) => {
    const existingItem = mergedCart.find(item => item.product.id === anonymousItem.product.id);
    if (existingItem) {
      existingItem.quantity += anonymousItem.quantity;
    } else {
      mergedCart.push(anonymousItem);
    }
  });
  
  return mergedCart;
};

export const getCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

export const getCartItemCount = (cart: CartItem[]): number => {
  return cart.reduce((count, item) => count + item.quantity, 0);
}; 