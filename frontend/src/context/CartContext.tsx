import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
  emoji?: string;
  quantity: number;
  selectedSize: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getCartStorageKey = (userId: string) => `sweet_shop_cart_${userId}`;

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();

  // Load cart from localStorage when user changes
  useEffect(() => {
    try {
      if (user && user.id) {
        const storageKey = getCartStorageKey(user.id);
        const savedCart = localStorage.getItem(storageKey);
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        } else {
          setItems([]);
        }
      } else {
        // Not logged in - use guest cart
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      setItems([]);
    }
    setIsInitialized(true);
  }, [user?.id]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && user && user.id) {
      const storageKey = getCartStorageKey(user.id);
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, isInitialized, user?.id]);

  const addItem = (newItem: CartItem) => {
    setItems(prev => {
      const existingItem = prev.find(item => item._id === newItem._id && item.selectedSize === newItem.selectedSize);
      if (existingItem) {
        return prev.map(item =>
          item._id === newItem._id && item.selectedSize === newItem.selectedSize
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item._id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
