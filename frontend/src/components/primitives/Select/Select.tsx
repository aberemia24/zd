import React, { forwardRef } from "react";
import { cn } from "../../../styles/cva/shared/utils";
import {
  select,
  inputWrapper,
  label,
  type SelectProps as CVASelectProps,
  type LabelProps,
} from "../../../styles/cva/components/forms";

// Omitem proprietatea 'size' din props pentru a evita conflictul
// Props custom pentru Select. Nu dublăm props native HTML (ex: value, label)!
export interface SelectProps
  extends Omit<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      "size" | "data-testid"
    >,
    CVASelectProps {
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
  /** Pentru testare */
  dataTestId?: string;
  /** Indicator de stare loading */
  isLoading?: boolean;

  // Simplified props - kept only essential
  /** Adaugă icon custom în loc de săgeata standard */
  withCustomIcon?: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label: labelText,
      error,
      className,
      wrapperClassName,
      options,
      placeholder,
      id,
      variant = "default",
      size = "md",
      disabled = false,
      isLoading = false,
      dataTestId,
      withCustomIcon,
      ...rest
    },
    ref,
  ) => {
    // Determine variant based on error state
    const selectVariant = error ? "error" : variant;

    return (
      <div className={cn(inputWrapper({ size }), wrapperClassName)}>
        {labelText && (
          <label
            htmlFor={id || rest.name}
            className={label({
              variant: error ? "error" : "default",
              size,
            })}
          >
            {labelText}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id || rest.name}
            className={cn(
              select({
                variant: selectVariant,
                size,
              }),
              className,
            )}
            value={
              options.some((opt) => opt.value === rest.value) ? rest.value : ""
            }
            data-testid={
              dataTestId ||
              `select-${selectVariant}-${size}${error ? "-error" : ""}${disabled ? "-disabled" : ""}`
            }
            disabled={disabled || isLoading}
            {...rest}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Icon personalizat, loading spinner sau icon standard */}
          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-2">
            {isLoading ? (
              // Spinner de loading când isLoading este true
              <svg
                className="animate-spin h-4 w-4 text-blue-600"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : withCustomIcon ? (
              withCustomIcon
            ) : // CVA select already has built-in arrow, no need for custom icon
            null}
          </div>
        </div>

        {error && <div className="text-sm text-red-600 mt-1">{error}</div>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
