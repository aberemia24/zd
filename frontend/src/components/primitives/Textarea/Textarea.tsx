import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useThemeEffects } from '../../../hooks';
import type { ComponentState, ComponentVariant, ComponentSize } from '../../../styles/themeTypes';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'data-testid'> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  dataTestId?: string;
  
  // Efecte vizuale rafinate
  /** Adăugare efect de auto-resize pe măsură ce utilizatorul introduce text */
  withAutoResize?: boolean;
  /** Adăugare efect de focus cu umbră strălucitoare */
  withGlowFocus?: boolean;
  /** Adăugare contor de caractere rămase (necesară definirea maxLength) */
  withCharacterCount?: boolean;
  /** Adăugare tranziție lină între stări */
  withTransition?: boolean;
  /** Adaugă efect de highlight pentru text */
  withTextHighlight?: boolean;
  /** Adaugă efect de intrare cu animație */
  withFadeIn?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ 
  label, 
  error, 
  className, 
  wrapperClassName, 
  variant = 'primary',
  size = 'md',
  required = false,
  dataTestId,
  disabled = false,
  readOnly,
  withAutoResize = false,
  withGlowFocus = false,
  withCharacterCount = false,
  withTransition = false,
  withTextHighlight = false,
  withFadeIn = false,
  ...rest 
}, ref) => {
  // State pentru auto-resize și character counter
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentLength, setCurrentLength] = useState(0);
  
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
  
  // Utilizăm hook-ul pentru gestionarea efectelor vizuale
  const { getClasses } = useThemeEffects({
    withGlowFocus,
    withTransition,
    withTextHighlight,
    withFadeIn
  });
  
  // Implementarea auto-resize pentru textarea
  const handleInput = useCallback(() => {
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
  useEffect(() => {
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
      getClasses('form-group', undefined, undefined, undefined),
      wrapperClassName
    )}>
      {label && (
        <label 
          className={classNames(
            getClasses('label', variant as ComponentVariant, undefined, state),
            required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={ref || textareaRef}
          className={classNames(
            getClasses('textarea', variant as ComponentVariant, size as ComponentSize, state),
            className
          )}
          data-testid={dataTestId || `textarea-${variant}-${size}${error ? '-error' : ''}${disabled ? '-disabled' : ''}${readOnly ? '-readonly' : ''}`}
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
          className={getClasses('error-message', variant as ComponentVariant, undefined, state)} 
          data-testid="textarea-error"
        >
          {error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
