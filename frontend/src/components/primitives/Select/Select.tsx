import React, { forwardRef } from "react";
import { 
  cn,
  select,
  inputWrapper,
  label,
  type SelectProps as CVASelectProps,
  type LabelProps as CVALabelProps,
  type InputWrapperProps as CVAInputWrapperProps
} from "../../../styles/cva-v2";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    CVASelectProps {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  options?: SelectOption[];
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
  wrapperVariant?: CVAInputWrapperProps["variant"];
  labelVariant?: CVALabelProps["variant"];
  required?: boolean;
}

/**
 * Select component cu suport pentru validare și multiple variante
 * Bazat pe noul sistem CVA v2 modular cu select dedicat
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label: labelText,
      error,
      success,
      hint,
      options = [],
      placeholder,
      variant = "default",
      size = "md",
      fullWidth = false,
      wrapperVariant = "default",
      labelVariant,
      required = false,
      className,
      id,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    
    // Determine label variant based on state
    const determinedLabelVariant = labelVariant || (hasError ? "error" : success ? "success" : "default");

    return (
      <div className={cn(inputWrapper({ variant: wrapperVariant }), fullWidth && "w-full")}>
        {labelText && (
          <label
            htmlFor={selectId}
            className={cn(label({ variant: determinedLabelVariant, required }))}
          >
            {labelText}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              select({ variant, size }),
              "pr-10 appearance-none cursor-pointer", // Space for dropdown arrow
              fullWidth && "w-full",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            
            {/* Render options din prop-uri */}
            {options.map((option, index) => (
              <option
                key={`${option.value}-${index}`}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
            
            {/* Render children pentru opțiuni custom */}
            {children}
          </select>
          
          {/* Dropdown arrow icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-4 w-4 text-neutral-400 dark:text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
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

Select.displayName = "Select";

export default Select;
