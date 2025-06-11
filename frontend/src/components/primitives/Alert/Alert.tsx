import React from "react";
import { 
  cn,
  card,
  badge
} from "../../../styles/cva-v2";

export interface AlertProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  title?: string;
  icon?: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

/**
 * Alert component pentru notificări și mesaje importante
 * Bazat pe noul sistem CVA v2 modular
 */
const Alert: React.FC<AlertProps> = ({
  children,
  variant = "default",
  title,
  icon,
  className,
  onClose,
  ...props
}) => {
  // Map alert variants to colors
  const variantStyles = {
    default: {
      container: "border-l-4 border-l-copper-500 bg-copper-50/50 dark:bg-copper-900/20",
      text: "text-copper-800 dark:text-copper-200",
      badge: "primary" as const
    },
    success: {
      container: "border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20",
      text: "text-emerald-800 dark:text-emerald-200", 
      badge: "success" as const
    },
    warning: {
      container: "border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/20",
      text: "text-amber-800 dark:text-amber-200",
      badge: "warning" as const
    },
    error: {
      container: "border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/20",
      text: "text-red-800 dark:text-red-200",
      badge: "warning" as const // folosim warning pentru error în badge
    }
  };

  const styles = variantStyles[variant];

  // Default icons for each variant
  const defaultIcons = {
    default: "ℹ️",
    success: "✅", 
    warning: "⚠️",
    error: "❌"
  };

  return (
    <div
      className={cn(
        card({ variant: "default" }),
        styles.container,
        "p-4",
        className
      )}
      role="alert"
      {...props}
    >
      <div className="flex items-start">
        {/* Icon section */}
        <div className="flex-shrink-0">
          {icon || (
            <span className="text-lg">
              {defaultIcons[variant]}
            </span>
          )}
        </div>

        {/* Content section */}
        <div className="ml-3 flex-1">
          {title && (
            <div className="flex items-center gap-2 mb-2">
              <h3 className={cn("text-sm font-medium", styles.text)}>
                {title}
              </h3>
              <span className={cn(badge({ variant: styles.badge }))}>
                {variant.toUpperCase()}
              </span>
            </div>
          )}
          
          <div className={cn("text-sm", styles.text)}>
            {children}
          </div>
        </div>

        {/* Close button */}
        {onClose && (
          <div className="flex-shrink-0 ml-3">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors",
                styles.text,
                "hover:bg-black/5 focus:ring-copper-500/20 dark:hover:bg-white/10"
              )}
              aria-label="Închide alertă"
            >
              <span className="sr-only">Închide</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
