// ============================================================
// Cart Context - manages cart state with Firebase sync
// Supports variants: items are keyed by laptopId + variantId
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { CartItem } from '@/types';
import { getCart, saveCart, clearCart, getSessionId } from '@/lib/firebase';

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>;
  removeItem: (laptopId: string, variantId?: string) => Promise<void>;
  updateQuantity: (laptopId: string, quantity: number, variantId?: string) => Promise<void>;
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

const itemKey = (laptopId: string, variantId?: string) => `${laptopId}__${variantId || ''}`;

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
      const key = itemKey(item.laptopId, item.variantId);
      const existing = prev.find(i => itemKey(i.laptopId, i.variantId) === key);
      let newItems: CartItem[];
      if (existing) {
        newItems = prev.map(i =>
          itemKey(i.laptopId, i.variantId) === key ? { ...i, quantity: Math.min(i.quantity + quantity, 10) } : i
        );
      } else {
        newItems = [...prev, { ...item, quantity }];
      }
      saveCart(sessionId, newItems);
      return newItems;
    });
  }, [sessionId]);

  const removeItem = useCallback(async (laptopId: string, variantId?: string) => {
    setItems(prev => {
      const key = itemKey(laptopId, variantId);
      const newItems = prev.filter(i => itemKey(i.laptopId, i.variantId) !== key);
      saveCart(sessionId, newItems);
      return newItems;
    });
  }, [sessionId]);

  const updateQuantity = useCallback(async (laptopId: string, quantity: number, variantId?: string) => {
    if (quantity < 1 || quantity > 10) return;
    setItems(prev => {
      const key = itemKey(laptopId, variantId);
      const newItems = prev.map(i =>
        itemKey(i.laptopId, i.variantId) === key ? { ...i, quantity } : i
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
