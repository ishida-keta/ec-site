'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import type { CartItem } from '@/types';

/** ログアウト直前に呼ぶ。リダイレクト後の初回マウントで localStorage のカートを読み込まないようにする。 */
const LOGOUT_CLEAR_CART_KEY = 'ec-clear-cart-after-logout';

export function prepareLogoutClearCart() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(LOGOUT_CLEAR_CART_KEY, '1');
  } catch {
    /* ignore */
  }
}

function consumeLogoutClearCartFlag(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (sessionStorage.getItem(LOGOUT_CLEAR_CART_KEY) === '1') {
      sessionStorage.removeItem(LOGOUT_CLEAR_CART_KEY);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const { status, data: session } = useSession();
  const wasAuthenticatedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (consumeLogoutClearCartFlag()) {
      try {
        localStorage.removeItem('ec-cart');
      } catch {
        /* ignore */
      }
      setItems([]);
      return;
    }
    const saved = localStorage.getItem('ec-cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  // ログアウト時はゲスト扱いとし、カートを空にする（会員セッションに紐づく買い物かごを残さない）
  useEffect(() => {
    if (status === 'loading') return;
    const isAuthenticated = status === 'authenticated' && !!session?.user;
    if (wasAuthenticatedRef.current && !isAuthenticated) {
      setItems([]);
      try {
        localStorage.removeItem('ec-cart');
      } catch {
        /* ignore */
      }
    }
    wasAuthenticatedRef.current = isAuthenticated;
  }, [status, session?.user]);

  useEffect(() => {
    if (mounted) localStorage.setItem('ec-cart', JSON.stringify(items));
  }, [items, mounted]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    setItems(prev =>
      quantity === 0
        ? prev.filter(i => i.id !== id)
        : prev.map(i => i.id === id ? { ...i, quantity } : i)
    );
  };

  const clearCart = () => setItems([]);
  const total = () => items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = () => items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
