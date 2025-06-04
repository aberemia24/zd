import React from 'react';
import { cn } from '../../../styles/cva-v2';
import { useModalContext } from './Modal';
import type { ModalHeaderProps } from './types';

/**
 * 🎭 MODAL HEADER
 * Header pentru modal cu titlu și buton de închidere opțional
 */

const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  onClose,
  showCloseButton = true,
  className,
  ...props
}) => {
  const { onClose: modalOnClose } = useModalContext();
  
  const handleClose = onClose || modalOnClose;

  return (
    <div
      className={cn(
        "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {/* Title/Content */}
      <div 
        id="modal-title"
        className="text-lg font-semibold text-gray-900 dark:text-gray-100"
      >
        {children}
      </div>

      {/* Close Button */}
      {showCloseButton && (
        <button
          type="button"
          onClick={handleClose}
          className={cn(
            "ml-4 p-2 rounded-lg",
            "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
          aria-label="Închide modal"
        >
          <svg 
            className="h-5 w-5" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ModalHeader; 