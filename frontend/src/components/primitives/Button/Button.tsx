import React from "react";
import { 
  cn,
  button,
  type ButtonProps as CVAButtonProps
} from "../../../styles/cva-v2";

export interface ButtonProps extends CVAButtonProps {
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  form?: string;
  autoFocus?: boolean;
}

/**
 * Button component cu suport pentru multiple variante și dimensiuni
 * Bazat pe noul sistem CVA v2 modular
 * OPTIMIZED cu React.memo pentru performance
 */
const ButtonComponent: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className,
  dataTestId,
  disabled,
  type = "button",
  form,
  autoFocus,
  onClick,
  onMouseDown,
  ...props
}) => {
  return (
    <button
      type={type}
      form={form}
      autoFocus={autoFocus}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={onMouseDown}
      className={cn(button({ variant, size }), className)}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </button>
  );
};

// React.memo wrapper pentru optimizarea re-renderurilor - Pattern validat din proiect
const Button = React.memo(ButtonComponent);

export default Button;
