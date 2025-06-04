import React from 'react';
import { cn } from '../../../styles/cva-v2';
import type { ModalFooterProps } from './types';

/**
 * 🎭 MODAL FOOTER
 * Footer pentru modal cu butoane de acțiune
 */

const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 p-6",
        "border-t border-gray-200 dark:border-gray-700",
        "bg-gray-50 dark:bg-gray-800/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default ModalFooter; 