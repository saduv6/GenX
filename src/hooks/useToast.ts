// ============================================================
// Toast notification system
// ============================================================

import { useState, useCallback } from 'react';
import type { Toast, ToastType } from '@/types';

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast_${++toastIdCounter}_${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
