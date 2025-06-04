import React from 'react';
import { cn } from '../../../styles/cva-v2';
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
        "p-6 text-gray-700 dark:text-gray-300",
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