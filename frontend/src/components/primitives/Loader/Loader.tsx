import React from "react";
import { 
  cn,
  card
} from "../../../styles/cva-v2";
import Spinner from "../Spinner/Spinner";

export interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  overlay?: boolean;
  className?: string;
}

/**
 * Loader component pentru loading states cu overlay opțional
 * Bazat pe noul sistem CVA v2 modular
 */
const Loader: React.FC<LoaderProps> = ({
  size = "md",
  message = "Se încarcă...",
  overlay = false,
  className,
  ...props
}) => {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6",
        overlay && [
          "fixed inset-0 z-50 bg-carbon-50/80 backdrop-blur-sm",
          "dark:bg-carbon-900/80"
        ],
        !overlay && card({ variant: "default" }),
        className
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      <Spinner size={size} color="primary" />
      
      {message && (
        <p className="text-sm font-medium text-carbon-700 dark:text-carbon-300 text-center">
          {message}
        </p>
      )}
    </div>
  );

  // If overlay, render directly in body portal-style
  if (overlay) {
    return content;
  }

  // Otherwise render as normal component
  return content;
};

export default Loader;
