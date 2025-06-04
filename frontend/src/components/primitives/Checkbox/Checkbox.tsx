import React, { forwardRef } from "react";
import { 
  cn,
  checkbox,
  inputWrapper,
  label,
  type CheckboxProps as CVACheckboxProps,
  type LabelProps as CVALabelProps,
  type InputWrapperProps as CVAInputWrapperProps
} from "../../../styles/cva-v2";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    CVACheckboxProps {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  className?: string;
  wrapperVariant?: CVAInputWrapperProps["variant"];
  labelVariant?: CVALabelProps["variant"];
  required?: boolean;
}

/**
 * Checkbox component cu suport pentru validare și multiple variante
 * Bazat pe noul sistem CVA v2 modular cu checkbox dedicat
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label: labelText,
      error,
      success,
      hint,
      size = "md",
      variant = "default",
      wrapperVariant = "default",
      labelVariant,
      required = false,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    
    // Determine label variant based on state
    const determinedLabelVariant = labelVariant || (hasError ? "error" : success ? "success" : "default");

    return (
      <div className={cn(inputWrapper({ variant: wrapperVariant }))}>
        <div className="flex items-start">
          <div className="flex items-center">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              disabled={disabled}
              className={cn(
                checkbox({ variant, size }),
                error && "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400",
                className
              )}
              {...props}
            />
          </div>
          
          {labelText && (
            <label
              htmlFor={checkboxId}
              className={cn(
                label({ variant: determinedLabelVariant, required }),
                "ml-2 cursor-pointer",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {labelText}
            </label>
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

Checkbox.displayName = "Checkbox";

export default Checkbox;
