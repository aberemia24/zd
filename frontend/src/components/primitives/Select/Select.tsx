import React from 'react';
import classNames from 'classnames';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import type { ComponentState, ComponentVariant, ComponentSize } from '../../../styles/themeTypes';

// Omitem proprietatea 'size' din props pentru a evita conflictul
// Props custom pentru Select. Nu dublăm props native HTML (ex: value, label)!
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Eticheta de deasupra selectului */
  label?: string;
  /** Mesaj de eroare sub select */
  error?: string;
  /** Clasă suplimentară pentru wrapper */
  wrapperClassName?: string;
  /** Opțiuni disponibile */
  options: Array<{ value: string; label: string }>;
  /** Placeholder pentru select */
  placeholder?: string;
  /** Variantă de stilizare (folosește enum ComponentVariant) */
  variant?: ComponentVariant;
  /** Dimensiune custom (folosește enum ComponentSize) */
  sizeVariant?: ComponentSize;
  /** Pentru testare */
  'data-testid'?: string;
  
  // Efecte vizuale rafinate
  /** Adaugă hover effect cu animație subtilă */
  withHoverEffect?: boolean;
  /** Adaugă icon custom în loc de săgeata standard */
  withCustomIcon?: React.ReactNode;
  /** Adaugă efect de umbră la focus */
  withFocusShadow?: boolean;
  /** Adaugă o tranziție animată între stări */
  withSmoothTransition?: boolean;
  /** Transformă select-ul într-un stil minimalist */
  withMinimalistStyle?: boolean;
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
  withHoverEffect = false,
  withCustomIcon,
  withFocusShadow = false,
  withSmoothTransition = false,
  withMinimalistStyle = false,
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
  
  // Configurăm efectele vizuale pentru diferitele elemente
  const formGroupEffects: string[] = [];
  const labelEffects: string[] = [];
  const selectEffects: string[] = [];
  const errorEffects: string[] = [];
  
  // Aplicăm efectele solicitate
  if (withHoverEffect) {
    selectEffects.push('select-hover-effect');
  }
  
  if (withFocusShadow) {
    selectEffects.push('focus-shadow');
  }
  
  if (withSmoothTransition) {
    selectEffects.push('smooth-transition');
    labelEffects.push('label-transition');
    errorEffects.push('error-transition');
  }
  
  if (withMinimalistStyle) {
    selectEffects.push('minimalist-style');
    formGroupEffects.push('minimalist-group');
  }
  
  // Clasă pentru container, cu suport pentru stilul minimalist
  const containerClass = withMinimalistStyle 
    ? 'relative border-b border-gray-300 focus-within:border-primary-500' 
    : 'relative';
  
  return (
  <div className={classNames(
    getEnhancedComponentClasses('form-group', undefined, undefined, undefined, formGroupEffects),
    wrapperClassName
  )}>
    {label && (
      <label 
        htmlFor={id || rest.name} 
        className={getEnhancedComponentClasses('form-label', selectVariant, undefined, state, labelEffects)}
      >
        {label}
      </label>
    )}
    <div className={containerClass}>
      <select
        id={id || rest.name}
        className={classNames(
          getEnhancedComponentClasses('select', selectVariant, selectSize, state, selectEffects),
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
      
      {/* Icon personalizat sau cel standard */}
      <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-2">
        {withCustomIcon ? (
          withCustomIcon
        ) : (
          <svg 
            className={classNames(
              "h-4 w-4", 
              withMinimalistStyle ? "text-primary-500" : "text-gray-500"
            )} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
      </div>
    </div>
    
    {error && (
      <span 
        className={getEnhancedComponentClasses('form-error', undefined, undefined, undefined, errorEffects)} 
        data-testid="select-error"
      >
        {error}
      </span>
    )}
  </div>
);
};

export default Select;
