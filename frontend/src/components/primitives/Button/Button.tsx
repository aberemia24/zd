import React from 'react';
import classNames from 'classnames';
import { useThemeEffects } from '../../../hooks';
import type { ComponentVariant, ComponentSize, ComponentState } from '../../../styles/themeTypes';

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'data-testid'> & {
  variant?: ComponentVariant;
  size?: ComponentSize;
  /**
   * Indică dacă butonul este în stare de încărcare
   * Acceptă orice tip de valoare care poate fi convertită la boolean
   */
  isLoading?: boolean | string | number | null | undefined;
  dataTestId?: string;
  // Adăugăm suport pentru efecte vizuale rafinate
  withShadow?: boolean;
  withGradient?: boolean;
  withTranslate?: boolean;
  withRound?: boolean;
  withFadeIn?: boolean;
  withSlideIn?: boolean;
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
  withRound = false,
  withFadeIn = false,
  withSlideIn = false,
  ...rest
}) => {
  // Determinăm starea butonului, convertind isLoading la boolean
  const isLoadingBoolean = Boolean(isLoading);
  const state: ComponentState | undefined = isLoadingBoolean 
    ? 'loading' 
    : disabled 
      ? 'disabled' 
      : undefined;

  // Utilizăm hook-ul de efecte pentru gestionarea efectelor vizuale
  const { getClasses } = useThemeEffects({
    withShadow,
    withGradient,
    withTranslate,
    withRound,
    withFadeIn,
    withSlideIn
  });
      
  return (
    <button
      className={classNames(
        getClasses('button', variant, size, state),
        className
      )}
      disabled={disabled || isLoadingBoolean}
      data-testid={dataTestId || `button-${variant}-${size}${isLoadingBoolean ? '-loading' : ''}`}
      {...rest}
    >
      {isLoadingBoolean && (
        <span className="mr-2">
          <svg className={getClasses('loader-svg', undefined, 'sm')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className={getClasses('loader-circle')} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className={getClasses('loader-path')} fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
