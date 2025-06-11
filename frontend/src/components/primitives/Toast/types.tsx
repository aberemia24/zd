import type { 
  ToastProps as CVAToastProps,
  ToastContainerProps,
  ToastIconProps,
  ToastCloseButtonProps 
} from "../../../styles/cva-v2";

/**
 * 🍞 TOAST SYSTEM TYPES
 * Tipuri pentru sistemul de notificări temporare
 */

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
export type ToastSize = 'sm' | 'md' | 'lg';

export interface ToastData {
  id: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

export interface ToastProps extends Omit<CVAToastProps, 'variant'> {
  toast: ToastData;
  onClose: (id: string) => void;
  onAction?: () => void;
  className?: string;
}

export interface ToastContainerComponentProps extends ToastContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface UseToastReturn {
  toasts: ToastData[];
  toast: {
    info: (message: string, options?: Partial<ToastData>) => string;
    success: (message: string, options?: Partial<ToastData>) => string;
    warning: (message: string, options?: Partial<ToastData>) => string;
    error: (message: string, options?: Partial<ToastData>) => string;
    custom: (data: Omit<ToastData, 'id'>) => string;
  };
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export interface ToastContextValue extends UseToastReturn {
  position: ToastPosition;
  setPosition: (position: ToastPosition) => void;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
} 
