import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../../../styles/cva/shared/utils";
import {
  textarea,
  inputWrapper,
  label,
  type TextareaProps as CVATextareaProps,
} from "../../../styles/cva/components/forms";

export interface TextareaProps
  extends Omit<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      "data-testid"
    >,
    CVATextareaProps {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  required?: boolean;
  dataTestId?: string;

  // Simplified props - kept only essential
  /** Adăugare efect de auto-resize pe măsură ce utilizatorul introduce text */
  withAutoResize?: boolean;
  /** Adăugare contor de caractere rămase (necesară definirea maxLength) */
  withCharacterCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label: labelText,
      error,
      className,
      wrapperClassName,
      variant = "default",
      size = "md",
      required = false,
      dataTestId,
      disabled = false,
      readOnly,
      withAutoResize = false,
      withCharacterCount = false,
      ...rest
    },
    ref,
  ) => {
    // State pentru auto-resize și character counter
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [currentLength, setCurrentLength] = useState(0);

    // Determine variant based on error state
    const textareaVariant = error ? "error" : variant;

    // Implementarea auto-resize pentru textarea
    const handleInput = useCallback(() => {
      if (withAutoResize && textareaRef.current) {
        // Reset height pentru a putea calcula înălțimea corectă
        textareaRef.current.style.height = "auto";
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
      <div className={cn(inputWrapper({ size }), wrapperClassName)}>
        {labelText && (
          <label
            className={cn(
              label({
                variant: error ? "error" : "default",
                size,
                required,
              }),
            )}
          >
            {labelText}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref || textareaRef}
            className={cn(
              textarea({
                variant: textareaVariant,
                size,
              }),
              className,
            )}
            data-testid={
              dataTestId ||
              `textarea-${textareaVariant}-${size}${error ? "-error" : ""}${disabled ? "-disabled" : ""}${readOnly ? "-readonly" : ""}`
            }
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            onInput={handleInput}
            {...rest}
          />

          {/* Character counter, dacă este activat și maxLength este specificat */}
          {withCharacterCount && rest.maxLength && (
            <div className="flex justify-between items-center text-xs mt-1">
              {/* Mesaj progresiv în funcție de procentaj */}
              <div className={`flex-1 ${
                currentLength >= rest.maxLength 
                  ? 'text-red-600 font-medium' 
                  : currentLength >= Math.floor(rest.maxLength * 0.85) 
                  ? 'text-amber-600' 
                  : 'text-gray-500'
              }`}>
                {currentLength >= rest.maxLength 
                  ? '🚫 Limită atinsă' 
                  : currentLength >= Math.floor(rest.maxLength * 0.85) 
                  ? '⚠️ Aproape de limită' 
                  : ''}
              </div>
              
              {/* Counter cu culori progresive */}
              <div className={`text-right font-mono ${
                currentLength >= rest.maxLength 
                  ? 'text-red-600 font-bold' 
                  : currentLength >= Math.floor(rest.maxLength * 0.85) 
                  ? 'text-amber-600 font-medium' 
                  : 'text-gray-500'
              }`}>
                {currentLength} / {rest.maxLength}
              </div>
            </div>
          )}
        </div>

        {error && <div className="text-sm text-red-600 mt-1">{error}</div>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
