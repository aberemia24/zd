import React from 'react';
import classNames from 'classnames';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import type { ComponentState, ComponentVariant } from '../../../styles/themeTypes';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  'data-testid'?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  
  // Efecte vizuale rafinate
  withFloatingLabel?: boolean;  // Label plutitor care se mișcă deasupra când input-ul are focus
  withGlowFocus?: boolean;     // Efect de strălucire la focus
  withTransition?: boolean;    // Tranziții animate pentru stările input-ului
  withIconLeft?: React.ReactNode; // Icoană la stânga input-ului
  withIconRight?: React.ReactNode; // Icoană la dreapta input-ului
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className, 
  wrapperClassName, 
  'data-testid': dataTestId, 
  inputRef, 
  disabled,
  readOnly,
  withFloatingLabel = false,
  withGlowFocus = false,
  withTransition = false,
  withIconLeft,
  withIconRight,
  ...rest 
}) => {
  // Determinăm starea input-ului
  const state: ComponentState | undefined = error 
    ? 'error' 
    : disabled 
      ? 'disabled' 
      : readOnly 
        ? 'readonly' 
        : undefined;
  
  // Determinăm varianta corectă de input
  const variant: ComponentVariant = error ? 'error' : 'primary';
  
  // Adăugăm efectele vizuale
  const formGroupEffects: string[] = [];
  const labelEffects: string[] = [];
  const inputEffects: string[] = [];
  
  if (withFloatingLabel && label) {
    formGroupEffects.push('floating-label-group');
    labelEffects.push('floating-label');
  }
  
  if (withGlowFocus) {
    inputEffects.push('focus-glow');
  }
  
  if (withTransition) {
    inputEffects.push('input-transition');
  }
  
  // Determinăm clasele pentru iconițe
  const hasIcon = withIconLeft || withIconRight;
  if (hasIcon) {
    inputEffects.push(withIconLeft ? 'has-icon-left' : '', withIconRight ? 'has-icon-right' : '');
  }
  
  return (
  <div className={classNames(
    getEnhancedComponentClasses('form-group', undefined, undefined, undefined, formGroupEffects),
    wrapperClassName
  )}>
    {label && (
      <label className={getEnhancedComponentClasses('form-label', variant, undefined, state, labelEffects)}>
        {label}
      </label>
    )}
    
    <div className={classNames('relative', hasIcon ? 'input-icon-wrapper' : '')}>
      {withIconLeft && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-secondary-400">
          {withIconLeft}
        </div>
      )}
      
      <input
        ref={inputRef}
        className={classNames(
          getEnhancedComponentClasses('input', variant, undefined, state, inputEffects),
          className
        )}
        data-testid={dataTestId || `input-field${error ? '-error' : ''}${disabled ? '-disabled' : ''}${readOnly ? '-readonly' : ''}`}
        disabled={disabled}
        readOnly={readOnly}
        {...rest}
      />
      
      {withIconRight && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-secondary-400">
          {withIconRight}
        </div>
      )}
    </div>
    
    {error && (
      <span 
        className={getEnhancedComponentClasses('form-error')} 
        data-testid="input-error"
      >
        {error}
      </span>
    )}
  </div>
);
};

export default Input;
