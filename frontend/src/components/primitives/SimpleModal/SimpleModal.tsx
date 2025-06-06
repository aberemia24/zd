import React, { useEffect, useRef, ReactNode } from "react";
import { createPortal } from 'react-dom';
import { cn } from "../../../styles/cva-v2";

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-6xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

export const SimpleModal: React.FC<SimpleModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  className = '',
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Professional scroll lock with scrollbar compensation
  useEffect(() => {
    if (!isOpen) return;

    // Save focus for restoration
    previousActiveElement.current = document.activeElement as HTMLElement;
    
    // Save current scroll position
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Save original styles
    const originalStyles = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };
    
    // Apply scroll lock with scrollbar compensation
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    return () => {
      // Restore original styles
      document.body.style.overflow = originalStyles.overflow;
      document.body.style.paddingRight = originalStyles.paddingRight;
      
      // Restore scroll position
      window.scrollTo(scrollX, scrollY);
      
      // Restore focus
      if (previousActiveElement.current?.focus) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // Enhanced escape key handler with capture
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    // Use capture to ensure it fires first
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "bg-white dark:bg-surface-dark rounded-lg shadow-xl",
          "w-full mx-4 max-h-[90vh] overflow-auto",
          sizeClasses[size],
          "transform transition-all duration-300 ease-out",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default SimpleModal; 
