import React from 'react';
import classNames from 'classnames';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import type { ComponentState, ComponentVariant } from '../../../styles/themeTypes';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'primary' | 'success' | 'error' | 'warning';
  wrapperClassName?: string;
  'data-testid'?: string;
  labelPosition?: 'right' | 'left';
  
  // Efecte vizuale rafinate
  withBorderAnimation?: boolean; // Efecte de animație pentru border la hover/focus
  withScaleEffect?: boolean;     // Efect de scalare la hover/focus
  withSmoothTransition?: boolean; // Tranziții line între stări
} // data-testid și orice alt prop HTML sunt permise

const Checkbox: React.FC<CheckboxProps> = ({ 
  label, 
  error, 
  variant = 'primary',
  className, 
  wrapperClassName, 
  'data-testid': dataTestId,
  labelPosition = 'right',
  disabled,
  withBorderAnimation = false,
  withScaleEffect = false,
  withSmoothTransition = false,
  ...rest 
}) => {
  // Determinăm starea checkbox-ului
  const state: ComponentState | undefined = error 
    ? 'error' 
    : disabled 
      ? 'disabled' 
      : undefined;
  
  // Determinăm varianta corectă
  const checkboxVariant: ComponentVariant = error ? 'error' : (variant as ComponentVariant);
  
  // Configurăm efectele vizuale pentru componentele Checkbox
  const groupEffects: string[] = [];
  const labelEffects: string[] = [];
  const checkboxEffects: string[] = [];
  const errorEffects: string[] = [];
  
  // Aplicăm efecte de tranziție
  if (withSmoothTransition) {
    checkboxEffects.push('checkbox-transition');
    labelEffects.push('label-transition');
  }
  
  // Adăugăm efecte de border animate la hover/focus
  if (withBorderAnimation) {
    checkboxEffects.push('border-animation');
  }
  
  // Adăugăm efecte de scalare la hover/focus
  if (withScaleEffect) {
    checkboxEffects.push('scale-effect');
    labelEffects.push('scale-effect-text');
  }
  
  // Pentru grupuri cu label în stânga, folosim un aranjament diferit
  const groupVariant = labelPosition === 'left' ? 'rowReverse' : undefined;
  
  return (
  <div className={classNames(
      getEnhancedComponentClasses('checkbox-group', groupVariant, undefined, undefined, groupEffects),
      wrapperClassName
    )}>
    {label && labelPosition === 'left' && (
      <label className={getEnhancedComponentClasses('checkbox-label', undefined, undefined, undefined, labelEffects)}>
        {label}
      </label>
    )}
    <input
      type="checkbox"
      className={classNames(
        getEnhancedComponentClasses('checkbox', checkboxVariant, undefined, state, checkboxEffects),
        className
      )}
      disabled={disabled}
      data-testid={dataTestId || `checkbox-field${error ? '-error' : ''}${disabled ? '-disabled' : ''}`}
      {...rest}
    />
    {label && labelPosition === 'right' && (
      <label className={getEnhancedComponentClasses('checkbox-label', undefined, undefined, undefined, labelEffects)}>
        {label}
      </label>
    )}
    {error && (
      <span 
        className={getEnhancedComponentClasses('form-error', undefined, undefined, undefined, errorEffects)} 
        data-testid="checkbox-error"
      >
        {error}
      </span>
    )}
  </div>
);
};

export default Checkbox;
