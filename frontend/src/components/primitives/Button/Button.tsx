import React from 'react';
import classNames from 'classnames';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import type { ComponentVariant, ComponentSize, ComponentState } from '../../../styles/themeTypes';

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'data-testid'> & {
  variant?: ComponentVariant;
  size?: ComponentSize;
  isLoading?: boolean;
  dataTestId?: string;
  // Adăugăm suport pentru efecte vizuale rafinate
  withShadow?: boolean;
  withGradient?: boolean;
  withTranslate?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  className,
  children,
  dataTestId,
  withShadow = false,
  withGradient = false,
  withTranslate = false,
  ...rest
}) => {
  // Determinăm starea butonului
  const state: ComponentState | undefined = isLoading 
    ? 'loading' 
    : disabled 
      ? 'disabled' 
      : undefined;

  // Colectăm efectele vizuale aplicate
  const effects: string[] = [];
  if (withShadow) {
    effects.push('shadow-glow');
  }
  if (withGradient && variant === 'primary') {
    // Gradientul este deja aplicat pentru primary, dar poate fi îmbunătățit
    effects.push('gradient-text');
  }
  if (withTranslate) {
    effects.push('sliding-gradient');
  }
      
  return (
    <button
      className={classNames(
        getEnhancedComponentClasses('button', variant, size, state, effects),
        className
      )}
      disabled={disabled || isLoading}
      data-testid={dataTestId || `button-${variant}-${size}${isLoading ? '-loading' : ''}`}
      {...rest}
    >
      {isLoading && (
        <span className="mr-2">
          <svg className={getEnhancedComponentClasses('loader-svg', undefined, 'sm')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className={getEnhancedComponentClasses('loader-circle')} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className={getEnhancedComponentClasses('loader-path')} fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
