import React, { forwardRef } from "react";
import { 
  cn,
  input,
  inputWrapper,
  label,
  type InputProps as CVAInputProps,
  type LabelProps as CVALabelProps,
  type InputWrapperProps as CVAInputWrapperProps
} from "../../../styles/cva-v2";

export interface InputProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    CVAInputProps {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  wrapperVariant?: CVAInputWrapperProps["variant"];
  labelVariant?: CVALabelProps["variant"];
  required?: boolean;
}

/**
 * Input component cu suport pentru validare, iconuri și multiple variante
 * Bazat pe noul sistem CVA v2 modular cu wrapper și label styling
 * OPTIMIZED cu React.memo pentru performance
 */
const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label: labelText,
      error,
      success,
      hint,
      leftIcon,
      rightIcon,
      variant = "default",
      size = "md",
      fullWidth = false,
      wrapperVariant = "default",
      labelVariant,
      required = false,
      className,
      type = "text",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    
    // Determine label variant based on state
    const determinedLabelVariant = labelVariant || (hasError ? "error" : success ? "success" : "default");
    
    // Determine input variant based on state
    const determinedInputVariant = hasError ? "error" : variant;

    // Size classes for specific sizing since input doesn't have size variants
    const sizeClasses = {
      sm: "h-8 px-2 py-1 text-xs",
      md: "h-10 px-3 py-2 text-sm", 
      lg: "h-12 px-4 py-3 text-base"
    };

    return (
      <div className={cn(inputWrapper({ variant: wrapperVariant }), fullWidth && "w-full")}>
        {labelText && (
          <label
            htmlFor={inputId}
            className={cn(label({ variant: determinedLabelVariant, required }))}
          >
            {labelText}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-neutral-400 dark:text-neutral-500">
                {leftIcon}
              </span>
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            id={inputId}
            className={cn(
              input({ variant: determinedInputVariant }),
              sizeClasses[size],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              fullWidth && "w-full",
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-neutral-400 dark:text-neutral-500">
                {rightIcon}
              </span>
            </div>
          )}
        </div>

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
      </div>
    );
  }
);

InputComponent.displayName = "Input";

// React.memo wrapper pentru optimizarea re-renderurilor - Pattern validat din proiect
const Input = React.memo(InputComponent);

export default Input;
