import React from 'react';
import classNames from 'classnames';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import type { ComponentVariant, ComponentSize, ComponentState } from '../../../styles/themeTypes';

export type IconButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'data-testid'> & {
  variant?: ComponentVariant;
  size?: ComponentSize;
  isLoading?: boolean;
  dataTestId?: string;
  // Proprietăți specifice pentru iconițe
  icon: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'only';
  // Efecte vizuale rafinate
  withShadow?: boolean;
  withGradient?: boolean;
  withTranslate?: boolean;
  withRound?: boolean; // Buton perfect rotund
};

const IconButton: React.FC<IconButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  className,
  children,
  dataTestId,
  icon,
  iconPosition = 'left',
  withShadow = false,
  withGradient = false,
  withTranslate = false,
  withRound = false,
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
    effects.push('gradient-text');
  }
  if (withTranslate) {
    effects.push('sliding-gradient');
  }
  if (withRound) {
    effects.push('rounded-full');
  }

  // Clasa pentru poziția iconului și aspectul butonului
  const positionClasses = {
    'only': 'p-2', // Padding uniform pentru iconițe
    'left': 'flex items-center',
    'right': 'flex items-center flex-row-reverse'
  };

  // Spațiere între icon și text
  const iconSpacing = iconPosition !== 'only' ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : '';
      
  return (
    <button
      className={classNames(
        getEnhancedComponentClasses('button', variant, size, state, effects),
        positionClasses[iconPosition],
        className
      )}
      disabled={disabled || isLoading}
      data-testid={dataTestId || `icon-button-${variant}-${size}${isLoading ? '-loading' : ''}`}
      {...rest}
    >
      {isLoading ? (
        <span className="mr-2">
          <svg className={getEnhancedComponentClasses('loader-svg', undefined, 'sm')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className={getEnhancedComponentClasses('loader-circle')} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className={getEnhancedComponentClasses('loader-path')} fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </span>
      ) : (
        <span className={iconSpacing}>{icon}</span>
      )}
      {iconPosition !== 'only' && children}
    </button>
  );
};

export default IconButton;
