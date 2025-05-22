import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { useThemeEffects } from '../../../hooks';
import type { ComponentVariant, ComponentSize, ComponentState } from '../../../styles/themeTypes';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'data-testid'> & {
  label?: string;
  error?: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  dataTestId?: string;
  // Proprietăți pentru efecte vizuale
  withFloatingLabel?: boolean;
  withGlowFocus?: boolean;
  withTransition?: boolean;
  withIconLeft?: React.ReactNode;
  withIconRight?: React.ReactNode;
  withFadeIn?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  dataTestId,
  withFloatingLabel = false,
  withGlowFocus = false,
  withTransition = false,
  withIconLeft,
  withIconRight,
  withFadeIn = false,
  ...rest
}, ref) => {
  const state: ComponentState | undefined = disabled ? 'disabled' : error ? 'error' : undefined;
  
  // Utilizăm hook-ul de efecte pentru gestionarea efectelor vizuale
  const { getClasses, hasEffect } = useThemeEffects({
    withFloatingLabel,
    withGlowFocus,
    withTransition,
    withFadeIn
  });
  
  return (
    <div className={classNames(
      getClasses('input-wrapper', variant, size, state),
      { 'has-icon-left': !!withIconLeft },
      { 'has-icon-right': !!withIconRight },
      className
    )}>
      {label && (
        <label 
          htmlFor={rest.id} 
          className={getClasses('label', variant, size, state)}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {withIconLeft && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {withIconLeft}
          </span>
        )}
        <input
          ref={ref}
          className={classNames(
            getClasses('input', variant, size, state),
            { 'pl-10': !!withIconLeft },
            { 'pr-10': !!withIconRight }
          )}
          disabled={disabled}
          data-testid={dataTestId || `input-${variant}-${size}`}
          {...rest}
        />
        {withIconRight && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {withIconRight}
          </span>
        )}
      </div>
      {error && (
        <div className={getClasses('error-message', variant, size, state)}>
          {error}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
