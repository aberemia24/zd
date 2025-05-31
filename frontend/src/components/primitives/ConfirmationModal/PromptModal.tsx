import React, { useState } from "react";
import { Button } from "../Button";
import Input from "../Input";
import { cn } from "../../../styles/cva/shared/utils";
import { card } from "../../../styles/cva/components/layout";

export interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  message: string;
  placeholder?: string;
  expectedValue?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "warning" | "danger";
  icon?: string;
}

const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  placeholder = "",
  expectedValue,
  confirmText = "OK",
  cancelText = "Anulează",
  variant = "default",
  icon,
}) => {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const variantStyles = {
    default: {
      border: "border-blue-200",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
      titleColor: "text-blue-900"
    },
    warning: {
      border: "border-orange-200", 
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
      titleColor: "text-orange-900"
    },
    danger: {
      border: "border-red-200",
      bg: "bg-red-50", 
      iconColor: "text-red-600",
      titleColor: "text-red-900"
    }
  };

  const currentVariant = variantStyles[variant];
  const isValidInput = !expectedValue || inputValue === expectedValue;

  const handleConfirm = () => {
    if (isValidInput) {
      onConfirm(inputValue);
      onClose();
      setInputValue("");
    }
  };

  const handleClose = () => {
    onClose();
    setInputValue("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className={cn(
          card({ variant: "elevated", size: "lg" }),
          "max-w-md w-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn(
          "p-4 border-b border-gray-200 rounded-t-lg",
          currentVariant.bg,
          currentVariant.border
        )}>
          <div className="flex items-center space-x-3">
            {icon && (
              <div className={cn("text-2xl", currentVariant.iconColor)}>
                {icon}
              </div>
            )}
            <h2 className={cn(
              "text-lg font-semibold",
              currentVariant.titleColor
            )}>
              {title}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-gray-700 mb-4 whitespace-pre-line">
            {message}
          </div>

          {/* Input */}
          <div className="mb-4">
            <Input
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              placeholder={placeholder}
              autoFocus
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" && isValidInput) {
                  handleConfirm();
                }
                if (e.key === "Escape") {
                  handleClose();
                }
              }}
            />
            {expectedValue && !isValidInput && inputValue.length > 0 && (
              <p className="text-sm text-red-600 mt-2">
                Trebuie să scrieți exact: <strong>{expectedValue}</strong>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={handleClose}
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === "danger" ? "danger" : "primary"}
              size="md"
              onClick={handleConfirm}
              disabled={!isValidInput}
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