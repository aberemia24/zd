import React from 'react';
import { cn } from '../../../styles/cva/shared/utils';
import { badge, type BadgeProps as CVABadgeProps } from '../../../styles/cva/components/feedback';

export interface BadgeProps extends CVABadgeProps {
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  
  // Simplified props - kept only essential
  /** Badge în stil pill (rounded-full) - implicit pentru badge */
  pill?: boolean;
  /** Adăugare stare activată cu stil diferit */
  isActive?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ 
  variant = 'primary', 
  size = 'sm',
  pulse,
  pill = true, // badge-urile sunt pill by default
  children, 
  className,
  dataTestId,
  isActive = false
}) => {
  return (
    <span
      className={cn(
        badge({ 
          variant, 
          size, 
          pulse 
        }),
        // Apply active styling if needed
        isActive && "ring-2 ring-blue-500 ring-opacity-50",
        // Badge-urile sunt deja rounded-full în CVA, nu mai e nevoie de prop pill
        className
      )}
      data-testid={dataTestId || `badge-${variant}${pill ? '-pill' : ''}`}
    >
      {children}
    </span>
  );
};

export default Badge;
