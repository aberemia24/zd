import React from 'react';
import { cn } from '../../../styles/cva/shared/utils';
import { button, type ButtonProps as CVAButtonProps } from '../../../styles/cva/components/forms';

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'data-testid'> & 
  CVAButtonProps & {
  /**
   * Indică dacă butonul este în stare de încărcare
   * Acceptă orice tip de valoare care poate fi convertită la boolean
   */
  isLoading?: boolean | string | number | null | undefined;
  dataTestId?: string;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  disabled = false,
  isLoading = false,
  className,
  children,
  dataTestId,
  ...rest
}) => {
  // Determinăm starea butonului, convertind isLoading la boolean
  const isLoadingBoolean = Boolean(isLoading);
  
  return (
    <button
      className={cn(
        button({ 
          variant, 
          size, 
          fullWidth
        }),
        // Add loading state styling manually since CVA button doesn't have it
        isLoadingBoolean && "cursor-wait opacity-70",
        className
      )}
      disabled={disabled || isLoadingBoolean}
      data-testid={dataTestId || `button-${variant}-${size}${isLoadingBoolean ? '-loading' : ''}`}
      {...rest}
    >
      {isLoadingBoolean && (
        <span className="mr-2">
          <svg 
            className="animate-spin h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
