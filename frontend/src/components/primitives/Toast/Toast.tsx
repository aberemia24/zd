import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  cn,
  toast,
  toastIcon,
  toastContent,
  toastTitle,
  toastDescription,
  toastCloseButton
} from '../../../styles/cva-v2';
import { TOAST } from '@budget-app/shared-constants';
import type { ToastProps } from './types';

/**
 * 🍞 TOAST COMPONENT
 * Componenta individuală pentru notificări temporare
 */

// Icoanele pentru fiecare tip de toast
const TOAST_ICONS = {
  info: '💡',
  success: '✅',
  warning: '⚠️',
  error: '❌'
} as const;

const Toast: React.FC<ToastProps> = ({ 
  toast: toastData, 
  onClose, 
  onAction,
  className,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const variant = toastData.variant || 'info';
  const icon = TOAST_ICONS[variant];

  // Gestionează închiderea cu animație
  const handleClose = () => {
    setIsAnimating(true);
    // Delay pentru animația de ieșire
    setTimeout(() => {
      setIsVisible(false);
      onClose(toastData.id);
    }, 200);
  };

  // Gestionează acțiunea personalizată
  const handleAction = () => {
    if (toastData.action?.onClick) {
      toastData.action.onClick();
      onAction?.();
    }
    handleClose();
  };

  // Auto-close pe escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        toast({ variant, size: 'md' }),
        isAnimating && 'data-[state=closed]',
        className
      )}
      data-state={isAnimating ? 'closed' : 'open'}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      {...props}
    >
      {/* Icon */}
      <div className={cn(toastIcon({ variant }))}>
        {icon}
      </div>

      {/* Content */}
      <div className={cn(toastContent())}>
        {toastData.title && (
          <div className={cn(toastTitle())}>
            {toastData.title}
          </div>
        )}
        <div className={cn(toastDescription())}>
          {toastData.message}
        </div>
        
        {/* Action button */}
        {toastData.action && (
          <button
            type="button"
            onClick={handleAction}
            className="mt-2 text-sm font-medium underline hover:no-underline transition-colors"
          >
            {toastData.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={handleClose}
        className={cn(toastCloseButton({ variant }))}
        aria-label={TOAST.CLOSE}
      >
        <svg 
          className="h-4 w-4" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast; 
