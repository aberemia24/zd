// Modal type definitions
// Note: CVA variants imported in components as needed

/**
 * 🎭 MODAL SYSTEM TYPES
 * Tipuri pentru sistemul de modal-uri generice
 */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type ModalVariant = 'default' | 'overlay' | 'centered';
export type ModalContentVariant = 'default';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  variant?: ModalVariant;
  contentVariant?: ModalContentVariant;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  'data-testid'?: string;
}

export interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
}

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
} 
