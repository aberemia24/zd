import React, { forwardRef } from "react";
import { cn } from "../../../styles/cva/shared/utils";
import {
  checkbox,
  inputWrapper,
  label,
  type CheckboxProps as CVACheckboxProps,
  type LabelProps,
} from "../../../styles/cva/components/forms";

export interface CheckboxProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "data-testid" | "size"
    >,
    CVACheckboxProps {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  dataTestId?: string;
  labelPosition?: "right" | "left";
  size?: "sm" | "md" | "lg"; // Pentru label și wrapper sizing (nu pentru checkbox)
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label: labelText,
      error,
      variant = "default",
      size = "md",
      className,
      wrapperClassName,
      dataTestId,
      labelPosition = "right",
      disabled = false,
      ...rest
    },
    ref,
  ) => {
    // Determine variant based on error state
    const checkboxVariant = error ? "error" : variant;

    return (
      <div
        className={cn(
          inputWrapper({ size }),
          // Flex arrangement based on label position
          labelPosition === "left"
            ? "flex-row-reverse justify-between"
            : "flex-row",
          "flex items-center",
          wrapperClassName,
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            checkbox({
              variant: checkboxVariant,
              // Note: checkbox CVA nu are size variant
            }),
            className,
          )}
          disabled={disabled}
          data-testid={
            dataTestId ||
            `checkbox-${checkboxVariant}${error ? "-error" : ""}${disabled ? "-disabled" : ""}`
          }
          {...rest}
        />
        {labelText && (
          <label
            htmlFor={rest.id || rest.name}
            className={cn(
              label({
                variant: error ? "error" : "default",
                size,
              }),
              labelPosition === "right" ? "ml-2" : "mr-2",
            )}
          >
            {labelText}
          </label>
        )}
        {error && (
          <div className="text-sm text-red-600 mt-1 w-full">{error}</div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
