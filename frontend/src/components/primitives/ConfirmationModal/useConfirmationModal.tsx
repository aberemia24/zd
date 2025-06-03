import { useState, useCallback } from "react";
import { ConfirmationModalProps } from "./ConfirmationModal";

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "warning" | "danger";
  icon?: string;
  details?: string[];
  recommendation?: string;
}

interface UseConfirmationModalReturn {
  modalProps: ConfirmationModalProps;
  showConfirmation: (options: ConfirmationOptions) => Promise<boolean>;
  hideModal: () => void;
}

export const useConfirmationModal = (): UseConfirmationModalReturn => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    options: ConfirmationOptions;
    resolver?: (value: boolean) => void;
  }>({
    isOpen: false,
    options: {
      title: "",
      message: "",
    },
  });

  const showConfirmation = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        options,
        resolver: resolve,
      });
    });
  }, []);

  const hideModal = useCallback(() => {
    if (modalState.resolver) {
      modalState.resolver(false);
    }
    setModalState({
      isOpen: false,
      options: {
        title: "",
        message: "",
      },
    });
  }, [modalState]);

  const handleConfirm = useCallback(() => {
    if (modalState.resolver) {
      modalState.resolver(true);
    }
    setModalState({
      isOpen: false,
      options: {
        title: "",
        message: "",
      },
    });
  }, [modalState]);

  const modalProps: Omit<ConfirmationModalProps, "onConfirm" | "onClose"> = {
    isOpen: modalState.isOpen,
    title: modalState.options.title,
    message: modalState.options.message,
    confirmText: modalState.options.confirmText,
    cancelText: modalState.options.cancelText,
    variant: modalState.options.variant || "default",
    icon: modalState.options.icon,
    details: modalState.options.details,
    recommendation: modalState.options.recommendation,
  };

  return {
    modalProps: {
      ...modalProps,
      onConfirm: handleConfirm,
      onClose: hideModal,
    },
    showConfirmation,
    hideModal,
  };
}; 