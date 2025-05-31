import React from "react";
import { Button } from "../Button";
import { cn } from "../../../styles/cva/shared/utils";
import { card } from "../../../styles/cva/components/layout";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "warning" | "danger";
  icon?: string;
  details?: string[];
  recommendation?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "OK",
  cancelText = "Anulează",
  variant = "default",
  icon,
  details,
  recommendation,
}) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className={cn(
          card({ variant: "elevated", size: "lg" }),
          "max-w-md w-full max-h-[90vh] overflow-y-auto"
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

          {/* Details List */}
          {details && details.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <ul className="text-sm text-gray-600 space-y-1">
                {details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation */}
          {recommendation && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
              <div className="flex items-start">
                <div className="text-blue-400 mr-2">💡</div>
                <div className="text-sm text-blue-700">
                  <strong>Recomandare:</strong> {recommendation}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === "danger" ? "danger" : "primary"}
              size="md"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 