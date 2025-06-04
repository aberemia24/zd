import React from "react";
import { cn } from "../../../styles/cva-v2";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "neutral" | "white";
  className?: string;
}

/**
 * Spinner component pentru loading states
 * Bazat pe noul sistem CVA v2 modular cu Carbon Copper palette
 */
const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  className,
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  // Color classes using Carbon Copper palette
  const colorClasses = {
    primary: "text-copper-500 dark:text-copper-400",
    secondary: "text-carbon-600 dark:text-carbon-400", 
    neutral: "text-carbon-500 dark:text-carbon-400",
    white: "text-white"
  };

  return (
    <div
      className={cn(
        "inline-block animate-spin",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Se încarcă..."
      {...props}
    >
      <svg
        className="h-full w-full"
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
      <span className="sr-only">Se încarcă...</span>
    </div>
  );
};

export default Spinner;
