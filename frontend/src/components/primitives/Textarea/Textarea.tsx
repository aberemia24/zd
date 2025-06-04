import React, { forwardRef } from "react";
import { 
  cn,
  textarea,
  inputWrapper,
  label,
  type TextareaProps as CVATextareaProps,
  type LabelProps as CVALabelProps,
  type InputWrapperProps as CVAInputWrapperProps
} from "../../../styles/cva-v2";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    CVATextareaProps {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  className?: string;
  fullWidth?: boolean;
  withCharacterCount?: boolean;
  maxLength?: number;
  wrapperVariant?: CVAInputWrapperProps["variant"];
  labelVariant?: CVALabelProps["variant"];
  required?: boolean;
}

/**
 * Textarea component cu suport pentru validare și caracter counting
 * Bazat pe noul sistem CVA v2 modular cu textarea dedicat
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label: labelText,
      error,
      success,
      hint,
      variant = "default",
      size = "md",
      fullWidth = false,
      withCharacterCount = false,
      maxLength,
      wrapperVariant = "default",
      labelVariant,
      required = false,
      className,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    
    // Determine label variant based on state
    const determinedLabelVariant = labelVariant || (hasError ? "error" : success ? "success" : "default");

    // Character count logic
    const currentLength = typeof value === 'string' ? value.length : 0;
    const showCharacterCount = withCharacterCount && maxLength;

    return (
      <div className={cn(inputWrapper({ variant: wrapperVariant }), fullWidth && "w-full")}>
        {labelText && (
          <label
            htmlFor={textareaId}
            className={cn(label({ variant: determinedLabelVariant, required }))}
          >
            {labelText}
          </label>
        )}
        
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            value={value}
            maxLength={maxLength}
            className={cn(
              textarea({ variant, size }),
              "resize-y", // Allow vertical resize
              fullWidth && "w-full",
              className
            )}
            {...props}
          />
        </div>

        {/* Character counter */}
        {showCharacterCount && (
          <div className="flex justify-between items-center text-xs">
            {error ? (
              <div className="text-red-600 dark:text-red-400 flex-1">{error}</div>
            ) : success ? (
              <div className="text-emerald-600 dark:text-emerald-400 flex-1">{success}</div>
            ) : hint ? (
              <div className="text-neutral-500 dark:text-neutral-400 flex-1">{hint}</div>
            ) : (
              <div className="flex-1"></div>
            )}
            <div className={cn(
              "text-right font-mono",
              currentLength >= maxLength! 
                ? "text-red-600 font-bold dark:text-red-400" 
                : currentLength >= maxLength! * 0.85 
                ? "text-amber-600 dark:text-amber-400" 
                : "text-neutral-500 dark:text-neutral-400"
            )}>
              {currentLength}/{maxLength}
            </div>
          </div>
        )}

        {/* Error/Success/Hint messages when no character count */}
        {!showCharacterCount && (
          <>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}
            
            {success && !error && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                {success}
              </p>
            )}
            
            {hint && !error && !success && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {hint}
              </p>
            )}
          </>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
