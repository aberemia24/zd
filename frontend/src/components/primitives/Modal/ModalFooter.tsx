import React from 'react';
import { cn, interactiveBorder } from '../../../styles/cva-v2';
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
        interactiveBorder({ variant: "default" }),
        "border-t",
        "bg-carbon-50 dark:bg-carbon-800/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default ModalFooter; 