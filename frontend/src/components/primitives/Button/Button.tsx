import React from 'react';
import classNames from 'classnames';
import { getComponentClasses } from '../../../styles/themeUtils';
import type { ComponentVariant, ComponentSize, ComponentState } from '../../../styles/themeTypes';

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'data-testid'> & {
  variant?: ComponentVariant;
  size?: ComponentSize;
  isLoading?: boolean;
  dataTestId?: string;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  className,
  children,
  dataTestId,
  ...rest
}) => {
  // Determinăm starea butonului
  const state: ComponentState | undefined = isLoading 
    ? 'loading' 
    : disabled 
      ? 'disabled' 
      : undefined;
  return (
    <button
      className={classNames(
        getComponentClasses('button', variant, size, state),
        className
      )}
      disabled={disabled || isLoading}
      data-testid={dataTestId || `button-${variant}-${size}${isLoading ? '-loading' : ''}`}
      {...rest}
    >
      {isLoading && (
        <span className="mr-2">
          <svg className={getComponentClasses('loader-svg', undefined, 'sm')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className={getComponentClasses('loader-circle')} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className={getComponentClasses('loader-path')} fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
