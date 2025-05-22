import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { useThemeEffects } from '../../../hooks';
import type { ComponentState, ComponentVariant, ComponentSize } from '../../../styles/themeTypes';

// Omitem proprietatea 'size' din props pentru a evita conflictul
// Props custom pentru Select. Nu dublăm props native HTML (ex: value, label)!
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'data-testid'> {
  /** Eticheta de deasupra selectului */
  label?: string;
  /** Mesaj de eroare sub select */
  error?: string;
  /** Clasă suplimentară pentru wrapper */
  wrapperClassName?: string;
  /** Opțiuni disponibile */
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  /** Placeholder pentru select */
  placeholder?: string;
  /** Variantă de stilizare (folosește enum ComponentVariant) */
  variant?: ComponentVariant;
  /** Dimensiune custom (folosește enum ComponentSize) */
  size?: ComponentSize;
  /** Pentru testare */
  dataTestId?: string;
  /** Indicator de stare loading */
  isLoading?: boolean;
  
  // Efecte vizuale rafinate
  /** Adaugă hover effect cu animație subtilă */
  withHoverEffect?: boolean;
  /** Adaugă icon custom în loc de săgeata standard */
  withCustomIcon?: React.ReactNode;
  /** Adaugă efect de umbră la focus */
  withGlowFocus?: boolean;
  /** Adaugă o tranziție animată între stări */
  withTransition?: boolean;
  /** Transformă select-ul într-un stil minimalist */
  withMinimalistStyle?: boolean;
  /** Adaugă efect de intrare cu animație */
  withFadeIn?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ 
  label, 
  error, 
  className, 
  wrapperClassName, 
  options, 
  placeholder, 
  id, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  dataTestId,
  withHoverEffect = false,
  withCustomIcon,
  withGlowFocus = false,
  withTransition = false,
  withMinimalistStyle = false,
  withFadeIn = false,
  ...rest 
}, ref) => {
  // Determinăm starea select-ului
  const state: ComponentState | undefined = isLoading 
    ? 'loading'
    : error 
      ? 'error' 
      : disabled 
        ? 'disabled' 
        : undefined;
  
  // Utilizăm hook-ul de efecte pentru gestionarea efectelor vizuale
  const { getClasses, hasEffect } = useThemeEffects({
    withHoverEffect,
    withGlowFocus,
    withTransition,
    withMinimalistStyle,
    withFadeIn
  });
  
  // Clasă pentru container, cu suport pentru stilul minimalist
  const containerClass = hasEffect('withMinimalistStyle')
    ? 'relative border-b border-gray-300 focus-within:border-primary-500' 
    : 'relative';
  
  return (
    <div className={classNames(
      getClasses('form-group', undefined, undefined, undefined),
      wrapperClassName
    )}>
      {label && (
        <label 
          htmlFor={id || rest.name} 
          className={getClasses('label', variant, undefined, state)}
        >
          {label}
        </label>
      )}
      <div className={containerClass}>
        <select
          ref={ref}
          id={id || rest.name}
          className={classNames(
            getClasses('select', variant, size, state),
            className
          )}
          value={options.some(opt => opt.value === rest.value) ? rest.value : ''}
          data-testid={dataTestId || `select-${variant}-${size}${error ? '-error' : ''}${disabled ? '-disabled' : ''}`}
          disabled={disabled || isLoading}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
          ))}
        </select>
        
        {/* Icon personalizat, loading spinner sau icon standard */}
        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-2">
          {isLoading ? (
            // Spinner de loading când isLoading este true
            <svg 
              className="animate-spin h-4 w-4 text-primary-500" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : withCustomIcon ? (
            withCustomIcon
          ) : (
            <svg 
              className={classNames(
                "h-4 w-4", 
                hasEffect('withMinimalistStyle') ? "text-primary-500" : "text-gray-500"
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
          className={getClasses('error-message', variant, undefined, state)} 
          data-testid="select-error"
        >
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
