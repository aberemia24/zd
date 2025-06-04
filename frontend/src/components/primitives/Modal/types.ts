import type { 
  ModalProps as CVAModalProps,
  ModalContentProps,
  ModalOverlayProps 
} from "../../../styles/cva-v2";

/**
 * 🎭 MODAL SYSTEM TYPES
 * Tipuri pentru sistemul de modal-uri generice
 */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalVariant = 'default' | 'centered' | 'top-centered';
export type ModalContentVariant = 'default' | 'elevated';

export interface ModalProps extends Omit<CVAModalProps, 'size'> {
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