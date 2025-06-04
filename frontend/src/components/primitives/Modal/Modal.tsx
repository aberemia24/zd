import React, { useRef, useEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { 
  cn,
  modal,
  modalContent,
  modalOverlay
} from '../../../styles/cva-v2';
import { useFocusTrap, useBodyScrollLock } from './useModal';
import type { ModalProps, ModalContextValue } from './types';

/**
 * 🎭 MODAL COMPONENT
 * Componenta Modal generică cu Portal rendering și accessibility
 */

// Context pentru comunicarea între Modal și componentele sale
const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal subcomponents must be used within a Modal');
  }
  return context;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  variant = 'centered',
  contentVariant = 'default',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
  overlayClassName,
  contentClassName,
  'data-testid': dataTestId,
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  // Hooks pentru accessibility și UX
  useFocusTrap(isOpen, contentRef);
  useBodyScrollLock(isOpen);

  // Keyboard event handling
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Backdrop click handling
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Nu renderează nimic dacă modal-ul este închis
  if (!isOpen) return null;

  const contextValue: ModalContextValue = {
    isOpen,
    onClose
  };

  const modalElement = (
    <ModalContext.Provider value={contextValue}>
      {/* Overlay */}
      <div
        className={cn(modalOverlay({ visible: true }), overlayClassName)}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div
        ref={modalRef}
        className={cn(modal({ variant, size }), className)}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        data-testid={dataTestId}
        {...props}
      >
        {/* Modal Content */}
        <div
          ref={contentRef}
          className={cn(modalContent({ variant: contentVariant }), contentClassName)}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );

  // Renderează prin Portal
  return createPortal(modalElement, document.body);
};

export default Modal; 