import React from 'react';
import classNames from 'classnames';
import { getComponentClasses } from '../../../styles/themeUtils';
import type { ComponentState, ComponentVariant, ComponentSize } from '../../../styles/themeTypes';

// Omitem proprietatea 'size' din props pentru a evita conflictul
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  variant?: 'primary' | 'error' | 'success' | 'warning';
  // Definim un custom size pentru componenta noastră Select
  sizeVariant?: 'sm' | 'md' | 'lg' | 'xl';
  'data-testid'?: string;
} // data-testid și orice alt prop HTML sunt permise

const Select: React.FC<SelectProps> = ({ 
  label, 
  error, 
  className, 
  wrapperClassName, 
  options, 
  placeholder, 
  id, 
  variant = 'primary',
  sizeVariant = 'md',
  disabled,
  'data-testid': dataTestId, 
  ...rest 
}) => {
  // Determinăm starea select-ului
  const state: ComponentState | undefined = error 
    ? 'error' 
    : disabled 
      ? 'disabled' 
      : undefined;
  
  // Determinăm varianta corectă
  const selectVariant: ComponentVariant = error 
    ? 'error' 
    : (variant as ComponentVariant);

  // Determinăm dimensiunea
  const selectSize: ComponentSize = (sizeVariant as ComponentSize);
  
  return (
  <div className={classNames(getComponentClasses('form-group'), wrapperClassName)}>
    {label && (
      <label 
        htmlFor={id || rest.name} 
        className={getComponentClasses('form-label')}
      >
        {label}
      </label>
    )}
    <div className="relative">
      <select
        id={id || rest.name}
        className={classNames(
          getComponentClasses('select', selectVariant, selectSize, state),
          className
        )}
        value={options.some(opt => opt.value === rest.value) ? rest.value : ''}
        data-testid={dataTestId || `select-field${error ? '-error' : ''}${disabled ? '-disabled' : ''}`}
        disabled={disabled}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-2">
        <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
    {error && (
      <span 
        className={getComponentClasses('form-error')} 
        data-testid="select-error"
      >
        {error}
      </span>
    )}
  </div>
);
};

export default Select;
