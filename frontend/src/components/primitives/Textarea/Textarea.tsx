import React from 'react';
import classNames from 'classnames';
import { getComponentClasses } from '../../../styles/themeUtils';
import type { ComponentState, ComponentVariant, ComponentSize } from '../../../styles/themeTypes';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  'data-testid'?: string;
}

const Textarea: React.FC<TextareaProps> = ({ 
  label, 
  error, 
  className, 
  wrapperClassName, 
  variant = 'primary',
  size = 'md',
  required = false,
  'data-testid': dataTestId,
  disabled,
  readOnly,
  ...rest 
}) => {
  // Determinăm starea textarea-ului
  const state: ComponentState | undefined = error 
    ? 'error' 
    : disabled 
      ? 'disabled' 
      : readOnly 
        ? 'readonly' 
        : required 
          ? 'required' 
          : undefined;
  
  // Determinăm varianta corectă
  const textareaVariant: ComponentVariant = error 
    ? 'error' 
    : (variant as ComponentVariant);
  
  // Determinăm dimensiunea
  const textareaSize: ComponentSize = (size as ComponentSize);
  
  return (
  <div className={classNames(getComponentClasses('form-group'), wrapperClassName)}>
    {label && (
      <label 
        className={classNames(
          getComponentClasses('form-label'),
          required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
        )}
      >
        {label}
      </label>
    )}
    <textarea
      className={classNames(
        getComponentClasses('textarea', textareaVariant, textareaSize, state),
        className
      )}
      data-testid={dataTestId || `textarea-field${error ? '-error' : ''}${disabled ? '-disabled' : ''}${readOnly ? '-readonly' : ''}`}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      {...rest}
    />
    {error && (
      <span 
        className={getComponentClasses('form-error')} 
        data-testid="textarea-error"
      >
        {error}
      </span>
    )}
  </div>
);
};

export default Textarea;
