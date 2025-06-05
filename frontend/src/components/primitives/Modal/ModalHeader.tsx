import React from 'react';
import { cn, hoverBackground, interactiveText, interactiveBorder, headingProfessional } from '../../../styles/cva-v2';
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
        "flex items-center justify-between p-6",
        interactiveBorder({ variant: "default" }),
        "border-b",
        className
      )}
      {...props}
    >
      {/* Title/Content */}
      <div 
        id="modal-title"
        className={headingProfessional({ level: "h3" })}
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
            interactiveText({ variant: "muted" }),
            hoverBackground({ variant: "light" }),
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