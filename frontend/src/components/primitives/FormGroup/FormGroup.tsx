import React, { forwardRef } from "react";
import { 
  cn,
  formGroup,
  type FormGroupProps as CVAFormGroupProps
} from "../../../styles/cva-v2";

export interface FormGroupProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    CVAFormGroupProps {
  children: React.ReactNode;
  className?: string;
  role?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

/**
 * FormGroup component pentru gruparea logică și layout-ul formularelor
 * Bazat pe sistemul CVA v2 cu suport pentru ARIA și semantică accesibilă
 */
const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  (
    {
      children,
      variant = "default",
      className,
      role,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(formGroup({ variant }), className)}
        role={role}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormGroup.displayName = "FormGroup";

export default FormGroup; 