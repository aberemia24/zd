import React, { useEffect, useRef } from "react";
import { Button } from "../Button";
import { cn } from "../../../styles/cva-v2";
import { 
  modal,
  modalContent,
  modalContainer
} from "../../../styles/cva-v2/primitives/modal";
import { createPortal } from 'react-dom';

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
  showDontShowAgain?: boolean;
  onDontShowAgainChange?: (checked: boolean) => void;
}

/**
 * ConfirmationModal component pentru confirmări importante
 * Folosește noul sistem CVA v2 simplificat cu pattern-ul din ExportModal
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText = "OK",
  cancelText = "Anulează",
  variant = "default",
  icon,
  details,
  recommendation,
  confirmButtonClass = '',
  showDontShowAgain,
  onDontShowAgainChange,
}) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [dontShowAgain, setDontShowAgain] = React.useState(false);

  // Handle checkbox change
  const handleDontShowAgainChange = (checked: boolean) => {
    setDontShowAgain(checked);
    if (onDontShowAgainChange) {
      onDontShowAgainChange(checked);
    }
  };

  // Reset checkbox when modal closes
  useEffect(() => {
    if (!isOpen) {
      setDontShowAgain(false);
    }
  }, [isOpen]);

  // Professional scroll lock with scrollbar compensation
  useEffect(() => {
    if (!isOpen) return;

    // Save focus for restoration
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Save current scroll positions for restoration
    const currentPageScrollY = window.scrollY;
    const currentPageScrollX = window.scrollX;
    
    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Save original styles for restoration
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Apply scroll lock with scrollbar compensation
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    // Cleanup function - restore scroll when modal closes
    return () => {
      // Restore original styles
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      
      // Restore scroll position precisely
      window.scrollTo(currentPageScrollX, currentPageScrollY);
      
      // Restore focus
      if (previousActiveElement.current && previousActiveElement.current.focus) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // Enhanced escape key handler with capture
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCancel();
      }
    };

    // Use capture to ensure it fires first
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className={cn(modal({ variant: "overlay" }))}
      onClick={onCancel}
    >
      <div className={cn(modalContainer())}>
        <div 
          className={cn(modalContent({ size: "sm", padding: "md" }))}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start space-x-3">
            {icon && (
              <div className="text-2xl">{icon}</div>
            )}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-carbon-900 dark:text-copper-100">
                {title}
              </h2>
              
              <p className="text-carbon-700 dark:text-copper-300 mt-2">
                {message}
              </p>

              {details && details.length > 0 && (
                <div className="mt-4 p-3 bg-carbon-50 dark:bg-copper-900 rounded">
                  <h4 className="text-sm font-medium text-carbon-900 dark:text-copper-100 mb-2">
                    Details:
                  </h4>
                  <ul className="text-sm text-carbon-700 dark:text-copper-300 space-y-1">
                    {details.map((detail: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendation && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Recommendation:</strong> {recommendation}
                  </p>
                </div>
              )}

              {/* Don't show again checkbox */}
              {showDontShowAgain && (
                <div className="mt-4 pt-3 border-t border-carbon-200 dark:border-copper-700">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dontShowAgain}
                      onChange={(e) => handleDontShowAgainChange(e.target.checked)}
                      className={cn(
                        "h-4 w-4 rounded border-carbon-300 dark:border-copper-600",
                        "text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400",
                        "dark:bg-copper-800 dark:checked:bg-blue-600"
                      )}
                    />
                    <span className="text-sm text-carbon-600 dark:text-copper-400">
                      Nu mai afișa această confirmare în viitor
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onCancel}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md",
                "bg-carbon-100 hover:bg-carbon-200 text-carbon-900",
                "dark:bg-copper-800 dark:hover:bg-copper-700 dark:text-copper-100",
                "transition-colors"
              )}
            >
              {cancelText}
            </button>
            
            <button
              onClick={onConfirm}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md",
                variant === 'danger' 
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white",
                "transition-colors",
                confirmButtonClass
              )}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal; 
