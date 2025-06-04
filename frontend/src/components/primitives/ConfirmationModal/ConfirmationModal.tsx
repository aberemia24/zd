import React from "react";
import { Button } from "../Button";
import { 
  cn,
  modal,
  card,
  badge,
  type ModalProps
} from "../../../styles/cva-v2";

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

/**
 * ConfirmationModal component pentru confirmări importante
 * Bazat pe noul sistem CVA v2 modular cu Carbon Copper palette
 */
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

  // Map variant la badge colors pentru header styling
  const getBadgeVariant = () => {
    switch (variant) {
      case "warning": return "warning";
      case "danger": return "warning"; // Folosim warning pentru danger
      default: return "secondary"; // Carbon pentru default
    }
  };

  // Map variant la text colors
  const getTextColor = () => {
    switch (variant) {
      case "warning": return "text-amber-600 dark:text-amber-400";
      case "danger": return "text-red-600 dark:text-red-400"; 
      default: return "text-carbon-600 dark:text-carbon-400";
    }
  };

  return (
    <div className={cn(modal({ variant: "default" }))}>
      <div 
        className={cn(
          card({ variant: "elevated" }),
          "max-w-md w-full max-h-[90vh] overflow-y-auto mx-4",
          "animate-theme-fade" // Smooth theme transition
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header cu Carbon Copper styling */}
        <div className={cn(
          "p-4 border-b border-carbon-200/50 dark:border-carbon-700/50 rounded-t-lg",
          "bg-carbon-50 dark:bg-carbon-900"
        )}>
          <div className="flex items-center space-x-3">
            {icon && (
              <div className={cn("text-2xl", getTextColor())}>
                {icon}
              </div>
            )}
            <h2 className={cn(
              "text-lg font-semibold",
              "text-carbon-900 dark:text-carbon-100"
            )}>
              {title}
            </h2>
            {/* Visual indicator cu badge pentru variant */}
            <div className={cn(
              badge({ variant: getBadgeVariant() }),
              "ml-auto"
            )}>
              {variant === "danger" ? "⚠️" : variant === "warning" ? "⚠️" : "ℹ️"}
            </div>
          </div>
        </div>

        {/* Body cu enhanced Carbon Copper styling */}
        <div className="p-6">
          <div className="text-carbon-700 dark:text-carbon-300 mb-4 whitespace-pre-line">
            {message}
          </div>

          {/* Details List cu dark mode support */}
          {details && details.length > 0 && (
            <div className={cn(
              "bg-carbon-100/50 dark:bg-carbon-800/50 border border-carbon-200/50 dark:border-carbon-700/50",
              "rounded-lg p-3 mb-4"
            )}>
              <ul className="text-sm text-carbon-600 dark:text-carbon-400 space-y-1">
                {details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-carbon-400 dark:text-carbon-500 mr-2">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation cu copper accent color */}
          {recommendation && (
            <div className={cn(
              "bg-copper-50/50 dark:bg-copper-900/20 border-l-4 border-copper-500 dark:border-copper-400",
              "p-3 mb-4 rounded-r-lg"
            )}>
              <div className="flex items-start">
                <div className="text-copper-600 dark:text-copper-400 mr-2">💡</div>
                <div className="text-sm text-copper-800 dark:text-copper-200">
                  <strong>Recomandare:</strong> {recommendation}
                </div>
              </div>
            </div>
          )}

          {/* Actions cu Button component styling */}
          <div className="flex space-x-3 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === "danger" ? "primary" : "primary"}
              size="md"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={variant === "danger" ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600" : ""}
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