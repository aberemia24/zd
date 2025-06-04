import React from 'react';
import { createPortal } from 'react-dom';
import { cn, toastContainer } from '../../../styles/cva-v2';
import { useToast, useToastPosition } from './useToast';
import Toast from './Toast';
import type { ToastContainerComponentProps } from './types';

/**
 * 🍞 TOAST CONTAINER
 * Container pentru toate toast-urile active cu Portal rendering
 */

const ToastContainer: React.FC<ToastContainerComponentProps> = ({ 
  className,
  ...props 
}) => {
  const { toasts, dismiss } = useToast();
  const { position } = useToastPosition();

  // Nu renderează nimic dacă nu există toast-uri
  if (toasts.length === 0) return null;

  const containerElement = (
    <div
      className={cn(toastContainer({ position }), className)}
      {...props}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={dismiss}
        />
      ))}
    </div>
  );

  // Renderează prin Portal pentru a fi sigur că este deasupra tuturor elementelor
  return createPortal(containerElement, document.body);
};

export default ToastContainer; 