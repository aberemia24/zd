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
  showDontShowAgain?: boolean;
  localStorageKey?: string;
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
    dontShowAgain?: boolean;
  }>({
    isOpen: false,
    options: {
      title: "",
      message: "",
    },
    dontShowAgain: false,
  });

  const showConfirmation = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    // Check localStorage first if this is a preference-based confirmation
    if (options.localStorageKey && options.showDontShowAgain) {
      const dontShow = localStorage.getItem(options.localStorageKey) === 'true';
      if (dontShow) {
        // Skip confirmation and return true (as if user confirmed)
        return Promise.resolve(true);
      }
    }

    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        options,
        resolver: resolve,
        dontShowAgain: false,
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
      dontShowAgain: false,
    });
  }, [modalState]);

  const handleConfirm = useCallback(() => {
    // If "don't show again" was checked, save to localStorage
    if (modalState.dontShowAgain && modalState.options.localStorageKey) {
      localStorage.setItem(modalState.options.localStorageKey, 'true');
    }
    
    if (modalState.resolver) {
      modalState.resolver(true);
    }
    setModalState({
      isOpen: false,
      options: {
        title: "",
        message: "",
      },
      dontShowAgain: false,
    });
  }, [modalState]);

  // Handle "don't show again" checkbox change
  const handleDontShowAgainChange = useCallback((checked: boolean) => {
    setModalState(prev => ({
      ...prev,
      dontShowAgain: checked,
    }));
  }, []);

  const modalProps: ConfirmationModalProps = {
    isOpen: modalState.isOpen,
    title: modalState.options.title,
    message: modalState.options.message,
    confirmText: modalState.options.confirmText,
    cancelText: modalState.options.cancelText,
    variant: modalState.options.variant || "default",
    icon: modalState.options.icon,
    details: modalState.options.details,
    recommendation: modalState.options.recommendation,
    showDontShowAgain: modalState.options.showDontShowAgain,
    onDontShowAgainChange: handleDontShowAgainChange,
    onConfirm: handleConfirm,
    onCancel: hideModal,
  };

  return {
    modalProps,
    showConfirmation,
    hideModal,
  };
}; 
