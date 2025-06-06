export interface ConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "warning" | "danger";
  icon?: string;
  details?: string[];
  recommendation?: string;
  confirmButtonClass?: string;
} 
