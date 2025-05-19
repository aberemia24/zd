import React from 'react';
import classNames from 'classnames';
import { getComponentClasses } from '../../../styles/themeUtils';
import type { ComponentState, ComponentVariant } from '../../../styles/themeTypes';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  'data-testid'?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
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
  
  return (
  <div className={classNames(getComponentClasses('form-group'), wrapperClassName)}>
    {label && <label className={getComponentClasses('form-label')}>{label}</label>}
    <input
      ref={inputRef}
      className={classNames(
        getComponentClasses('input', variant, undefined, state),
        className
      )}
      data-testid={dataTestId || `input-field${error ? '-error' : ''}${disabled ? '-disabled' : ''}${readOnly ? '-readonly' : ''}`}
      disabled={disabled}
      readOnly={readOnly}
      {...rest}
    />
    {error && <span className={getComponentClasses('form-error')} data-testid="input-error">{error}</span>}
  </div>
);
};

export default Input;
