import React, { createContext, useContext, useState, useCallback } from 'react';
import { TOAST } from '@budget-app/shared-constants';
import type { 
  ToastData, 
  ToastContextValue, 
  ToastProviderProps, 
  ToastPosition,
  ToastVariant,
  UseToastReturn
} from './types';

/**
 * 🍞 TOAST CONTEXT & HOOK
 * Gestiunea globală a notificărilor temporare
 */

// Context pentru toast system
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Generator de ID-uri unice pentru toast-uri
let toastIdCounter = 0;
const generateToastId = () => `toast-${++toastIdCounter}-${Date.now()}`;

/**
 * Provider pentru sistemul de toast
 */
export function ToastProvider({ 
  children, 
  position = 'top-right',
  maxToasts = 5 
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [currentPosition, setCurrentPosition] = useState<ToastPosition>(position);

  // Funcție pentru adăugarea unui toast
  const addToast = useCallback((toastData: Omit<ToastData, 'id'>) => {
    const id = generateToastId();
    const newToast: ToastData = {
      ...toastData,
      id,
      variant: toastData.variant || 'info',
      duration: toastData.duration ?? TOAST.DURATION.MEDIUM
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      // Limitează numărul de toast-uri
      return updated.slice(0, maxToasts);
    });

    // Auto-dismiss dacă nu este persistent
    if (!newToast.persistent && newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, newToast.duration);
    }

    return id;
  }, [maxToasts]);

  // Funcție pentru închiderea unui toast
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Funcție pentru închiderea tuturor toast-urilor
  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Funcții helper pentru diferite tipuri de toast
  const toastHelpers = {
    info: (message: string, options?: Partial<ToastData>) => 
      addToast({ ...options, message, variant: 'info' }),
    
    success: (message: string, options?: Partial<ToastData>) => 
      addToast({ ...options, message, variant: 'success' }),
    
    warning: (message: string, options?: Partial<ToastData>) => 
      addToast({ ...options, message, variant: 'warning' }),
    
    error: (message: string, options?: Partial<ToastData>) => 
      addToast({ ...options, message, variant: 'error' }),
    
    custom: (data: Omit<ToastData, 'id'>) => addToast(data)
  };

  const contextValue: ToastContextValue = {
    toasts,
    toast: toastHelpers,
    dismiss: dismissToast,
    dismissAll,
    position: currentPosition,
    setPosition: setCurrentPosition
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * Hook pentru utilizarea sistemului de toast
 */
export function useToast(): UseToastReturn {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  // Returnează doar funcționalitățile necesare, nu și position management
  return {
    toasts: context.toasts,
    toast: context.toast,
    dismiss: context.dismiss,
    dismissAll: context.dismissAll
  };
}

/**
 * Hook pentru gestionarea poziției toast-urilor (pentru componente administrative)
 */
export function useToastPosition() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToastPosition must be used within a ToastProvider');
  }

  return {
    position: context.position,
    setPosition: context.setPosition
  };
} 
