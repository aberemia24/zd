import React from 'react';
import classNames from 'classnames';
import { getComponentClasses } from '../../../styles/themeUtils';
import type { ComponentState, ComponentVariant } from '../../../styles/themeTypes';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'primary' | 'error';
  wrapperClassName?: string;
  'data-testid'?: string;
  labelPosition?: 'right' | 'left';
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
  
  return (
  <div className={classNames(
      getComponentClasses('checkbox-group', labelPosition === 'left' ? 'rowReverse' : undefined),
      wrapperClassName
    )}>
    {label && labelPosition === 'left' && (
      <label className={getComponentClasses('checkbox-label')}>{label}</label>
    )}
    <input
      type="checkbox"
      className={classNames(
        getComponentClasses('checkbox', checkboxVariant, undefined, state),
        className
      )}
      disabled={disabled}
      data-testid={dataTestId || `checkbox-field${error ? '-error' : ''}${disabled ? '-disabled' : ''}`}
      {...rest}
    />
    {label && labelPosition === 'right' && (
      <label className={getComponentClasses('checkbox-label')}>{label}</label>
    )}
    {error && (
      <span className={getComponentClasses('form-error')} data-testid="checkbox-error">{error}</span>
    )}
  </div>
);
};

export default Checkbox;
