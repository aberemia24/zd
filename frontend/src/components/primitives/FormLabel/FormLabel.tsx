import React, { forwardRef } from "react";
import { 
  cn,
  label,
  type LabelProps as CVALabelProps
} from "../../../styles/cva-v2";

export interface FormLabelProps 
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    CVALabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

/**
 * FormLabel component pentru labeling consistent și accesibil
 * Bazat pe sistemul CVA v2 cu suport pentru ARIA și validare
 */
const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  (
    {
      children,
      htmlFor,
      variant = "default",
      required = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn(label({ variant, required }), className)}
        {...props}
      >
        {children}
      </label>
    );
  }
);

FormLabel.displayName = "FormLabel";

export default FormLabel; 
