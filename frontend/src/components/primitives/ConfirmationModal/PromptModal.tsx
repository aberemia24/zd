import React, { useState, useRef, useEffect } from "react";
import { Button } from "../Button";
import { 
  cn,
  modal,
  card,
  input,
  badge,
  type ModalProps
} from "../../../styles/cva/unified-cva";

export interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  message: string;
  initialValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "warning" | "danger";
  required?: boolean;
}

const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  initialValue = "",
  placeholder = "Introduceți valoarea...",
  confirmText = "OK",
  cancelText = "Anulează",
  variant = "default",
  required = false,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset input value when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setInputValue(initialValue);
      // Focus input after modal animation
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select(); // Select all text for easy overwriting
      }, 100);
    }
  }, [isOpen, initialValue]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (!required || inputValue.trim())) {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (required && !inputValue.trim()) {
      // Focus input if required value is missing
      inputRef.current?.focus();
      return;
    }
    onConfirm(inputValue);
    onClose();
  };

  if (!isOpen) return null;

  // Map variant la badge colors
  const getBadgeVariant = () => {
    switch (variant) {
      case "warning": return "warning";
      case "danger": return "warning";
      default: return "secondary";
    }
  };

  // Map variant la text colors
  const getTextColor = () => {
    switch (variant) {
      case "warning": return "text-warning dark:text-warning-300";
      case "danger": return "text-warning dark:text-warning-300"; 
      default: return "text-secondary dark:text-secondary-300";
    }
  };

  return (
    <div className={cn(modal({ variant: "default" }))}>
      <div 
        className={cn(
          card({ variant: "elevated" }),
          "max-w-md w-full mx-4",
          "animate-theme-fade" // Smooth theme transition
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header cu Mocha Mousse 2025 styling */}
        <div className={cn(
          "p-4 border-b border-neutral/20 dark:border-neutral-600/30 rounded-t-lg",
          "bg-background dark:bg-surface-dark"
        )}>
          <div className="flex items-center space-x-3">
            <h2 className={cn(
              "text-lg font-semibold",
              "text-neutral-900 dark:text-neutral-100"
            )}>
              {title}
            </h2>
            {/* Visual indicator cu badge pentru variant */}
            <div className={cn(
              badge({ variant: getBadgeVariant() }),
              "ml-auto"
            )}>
              {variant === "danger" ? "⚠️" : variant === "warning" ? "⚠️" : "💬"}
            </div>
          </div>
        </div>

        {/* Body cu enhanced styling */}
        <div className="p-6">
          {/* Message */}
          <div className="text-neutral-700 dark:text-neutral-300 mb-4">
            {message}
          </div>

          {/* Input field cu unified CVA styling */}
          <div className="mb-6">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={cn(
                input({ variant: "default" }),
                "w-full"
              )}
              required={required}
            />
            {required && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                * Câmp obligatoriu
              </p>
            )}
          </div>

          {/* Actions cu Button styling */}
          <div className="flex space-x-3 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirm}
              disabled={required && !inputValue.trim()}
              className={variant === "danger" ? "bg-warning hover:bg-warning-600 dark:bg-warning-400 dark:hover:bg-warning-500" : ""}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptModal; 