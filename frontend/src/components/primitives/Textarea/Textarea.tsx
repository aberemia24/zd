import React from 'react';
import classNames from 'classnames';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import type { ComponentState, ComponentVariant, ComponentSize } from '../../../styles/themeTypes';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  'data-testid'?: string;
  
  // Efecte vizuale rafinate
  /** Adăugare efect de auto-resize pe măsură ce utilizatorul introduce text */
  withAutoResize?: boolean;
  /** Adăugare efect de focus cu umbră strălucitoare */
  withGlowFocus?: boolean;
  /** Adăugare contor de caractere rămase (necesară definirea maxLength) */
  withCharacterCount?: boolean;
  /** Adăugare tranziție lină între stări */
  withSmoothTransition?: boolean;
  /** Adaugă efect de highlight pentru text */
  withTextHighlight?: boolean;
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
  withAutoResize = false,
  withGlowFocus = false,
  withCharacterCount = false,
  withSmoothTransition = false,
  withTextHighlight = false,
  ...rest 
}) => {
  // State pentru auto-resize și character counter
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [currentLength, setCurrentLength] = React.useState(0);
  
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
  
  // Configurăm efectele vizuale
  const formGroupEffects: string[] = [];
  const labelEffects: string[] = [];
  const textareaEffects: string[] = [];
  const errorEffects: string[] = [];
  
  // Aplicăm efectele selectate
  if (withGlowFocus) {
    textareaEffects.push('focus-glow');
  }
  
  if (withSmoothTransition) {
    textareaEffects.push('smooth-transition');
    labelEffects.push('label-transition');
    errorEffects.push('error-transition');
  }
  
  if (withTextHighlight) {
    textareaEffects.push('text-highlight');
  }
  
  // Implementarea auto-resize pentru textarea
  const handleInput = React.useCallback(() => {
    if (withAutoResize && textareaRef.current) {
      // Reset height pentru a putea calcula înălțimea corectă
      textareaRef.current.style.height = 'auto';
      // Ajustăm înălțimea în funcție de conținut
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    
    // Actualizăm contorul de caractere
    if (withCharacterCount && textareaRef.current) {
      setCurrentLength(textareaRef.current.value.length);
    }
  }, [withAutoResize, withCharacterCount]);
  
  // Inițializăm pentru auto-resize și contor la prima render
  React.useEffect(() => {
    if (textareaRef.current) {
      // Inițializare contor caractere
      if (withCharacterCount) {
        setCurrentLength(textareaRef.current.value.length);
      }
      
      // Inițializare auto-resize
      if (withAutoResize) {
        handleInput();
      }
    }
  }, [withAutoResize, withCharacterCount, handleInput]);
  
  return (
  <div className={classNames(
    getEnhancedComponentClasses('form-group', undefined, undefined, undefined, formGroupEffects),
    wrapperClassName
  )}>
    {label && (
      <label 
        className={classNames(
          getEnhancedComponentClasses('form-label', textareaVariant, undefined, state, labelEffects),
          required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
        )}
      >
        {label}
      </label>
    )}
    <div className="relative">
      <textarea
        ref={textareaRef}
        className={classNames(
          getEnhancedComponentClasses('textarea', textareaVariant, textareaSize, state, textareaEffects),
          className
        )}
        data-testid={dataTestId || `textarea-field${error ? '-error' : ''}${disabled ? '-disabled' : ''}${readOnly ? '-readonly' : ''}`}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onInput={handleInput}
        {...rest}
      />
      
      {/* Character counter, dacă este activat și maxLength este specificat */}
      {withCharacterCount && rest.maxLength && (
        <div className="text-xs text-secondary-500 text-right mt-1">
          {currentLength} / {rest.maxLength}
        </div>
      )}
    </div>
    
    {error && (
      <span 
        className={getEnhancedComponentClasses('form-error', undefined, undefined, undefined, errorEffects)} 
        data-testid="textarea-error"
      >
        {error}
      </span>
    )}
  </div>
);
};

export default Textarea;
