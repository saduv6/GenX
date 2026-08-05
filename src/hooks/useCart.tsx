// ============================================================
// Cart Context - manages cart state with Firebase sync
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { CartItem } from '@/types';
import { getCart, saveCart, clearCart, getSessionId } from '@/lib/firebase';

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>;
  removeItem: (laptopId: string) => Promise<void>;
  updateQuantity: (laptopId: string, quantity: number) => Promise<void>;
  clearAll: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType>({
  items: [],
  loading: false,
  addItem: async () => {},
  removeItem: async () => {},
  updateQuantity: async () => {},
  clearAll: async () => {},
  totalItems: 0,
  totalPrice: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sessionId = getSessionId();

  useEffect(() => {
    getCart(sessionId).then(cartItems => {
      setItems(cartItems);
      setLoading(false);
    });
  }, [sessionId]);

  const addItem = useCallback(async (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.laptopId === item.laptopId);
      let newItems: CartItem[];
      if (existing) {
        newItems = prev.map(i =>
          i.laptopId === item.laptopId ? { ...i, quantity: Math.min(i.quantity + quantity, 10) } : i
        );
      } else {
        newItems = [...prev, { ...item, quantity }];
      }
      saveCart(sessionId, newItems);
      return newItems;
    });
  }, [sessionId]);

  const removeItem = useCallback(async (laptopId: string) => {
    setItems(prev => {
      const newItems = prev.filter(i => i.laptopId !== laptopId);
      saveCart(sessionId, newItems);
      return newItems;
    });
  }, [sessionId]);

  const updateQuantity = useCallback(async (laptopId: string, quantity: number) => {
    if (quantity < 1 || quantity > 10) return;
    setItems(prev => {
      const newItems = prev.map(i =>
        i.laptopId === laptopId ? { ...i, quantity } : i
      );
      saveCart(sessionId, newItems);
      return newItems;
    });
  }, [sessionId]);

  const clearAll = useCallback(async () => {
    setItems([]);
    await clearCart(sessionId);
  }, [sessionId]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addItem, removeItem, updateQuantity, clearAll, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
