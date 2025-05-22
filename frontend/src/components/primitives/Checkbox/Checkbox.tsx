import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { useThemeEffects } from '../../../hooks';
import type { ComponentState, ComponentVariant } from '../../../styles/themeTypes';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'data-testid'> {
  label?: string;
  error?: string;
  variant?: 'primary' | 'success' | 'error' | 'warning';
  wrapperClassName?: string;
  dataTestId?: string;
  labelPosition?: 'right' | 'left';
  
  // Efecte vizuale rafinate
  withBorderAnimation?: boolean; // Efecte de animație pentru border la hover/focus
  withScaleEffect?: boolean;     // Efect de scalare la hover/focus
  withTransition?: boolean;      // Tranziții line între stări
  withFadeIn?: boolean;          // Efect de fade-in la render
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ 
  label, 
  error, 
  variant = 'primary',
  className, 
  wrapperClassName, 
  dataTestId,
  labelPosition = 'right',
  disabled = false,
  withBorderAnimation = false,
  withScaleEffect = false,
  withTransition = false,
  withFadeIn = false,
  ...rest 
}, ref) => {
  // Determinăm starea checkbox-ului
  const state: ComponentState | undefined = error 
    ? 'error' 
    : disabled 
      ? 'disabled' 
      : undefined;
  
  // Utilizăm hook-ul pentru gestionarea efectelor vizuale
  const { getClasses, hasEffect } = useThemeEffects({
    withBorderAnimation,
    withScaleEffect,
    withTransition,
    withFadeIn
  });
  
  // Pentru grupuri cu label în stânga, folosim un aranjament diferit
  const groupVariant = labelPosition === 'left' ? 'rowReverse' : undefined;
  
  return (
    <div className={classNames(
      getClasses('checkbox-group', groupVariant, undefined, undefined),
      wrapperClassName
    )}>
      {label && labelPosition === 'left' && (
        <label className={getClasses('label', variant, undefined, state)}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        type="checkbox"
        className={classNames(
          getClasses('checkbox', variant as ComponentVariant, undefined, state),
          className
        )}
        disabled={disabled}
        data-testid={dataTestId || `checkbox-${variant}${error ? '-error' : ''}${disabled ? '-disabled' : ''}`}
        {...rest}
      />
      {label && labelPosition === 'right' && (
        <label className={getClasses('label', variant as ComponentVariant, undefined, state)}>
          {label}
        </label>
      )}
      {error && (
        <span 
          className={getClasses('error-message', variant as ComponentVariant, undefined, state)} 
          data-testid="checkbox-error"
        >
          {error}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
