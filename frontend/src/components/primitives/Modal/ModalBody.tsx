import React from 'react';
import { cn, interactiveText } from '../../../styles/cva-v2';
import type { ModalBodyProps } from './types';

/**
 * 🎭 MODAL BODY
 * Body pentru modal cu conținutul principal
 */

const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      id="modal-description"
      className={cn(
        "p-6",
        interactiveText({ variant: "default" }),
        "max-h-96 overflow-y-auto", // Scroll pentru conținut lung
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default ModalBody; 