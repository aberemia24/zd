import React from 'react';
import { cn } from '../../../styles/new/shared/utils';
import { alert, type AlertProps as CVAAlertProps } from '../../../styles/new/components/feedback';

export interface AlertProps extends Omit<CVAAlertProps, 'variant'> {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  /** Titlu opțional pentru alertă (afișat mai proeminent deasupra mesajului) */
  title?: string;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  dataTestId?: string;
  
  // Simplified props - kept only essential
  /** Adaugă iconiță specifică pentru tip */
  withIcon?: boolean;
}

const Alert: React.FC<AlertProps> = ({ 
  type = 'info', 
  message, 
  title,
  size = 'md',
  className,
  dismissible = false,
  onDismiss,
  dataTestId,
  withIcon = true
}) => {
  // Map type to CVA variant
  const variant = type;
  
  // Stabilim iconița în funcție de tipul alertei
  const alertIcon = withIcon ? getAlertIcon(type) : null;
  
  return (
    <div
      className={cn(
        alert({ variant, size }),
        className
      )}
      role="alert"
      data-testid={dataTestId || `alert-${type}`}
    >
      <div className="flex justify-between items-start w-full">
        <div className="flex items-start">
          {alertIcon && (
            <span className="mr-3 mt-0.5 flex-shrink-0">{alertIcon}</span>
          )}
          <div className="flex-1">
            {title && (
              <h3 className="font-semibold text-base mb-1">
                {title}
              </h3>
            )}
            <div className={cn(title && 'mt-1', "text-sm leading-relaxed")}>
              {message}
            </div>
          </div>
        </div>
        {dismissible && (
          <button 
            type="button" 
            className={cn(
              "ml-4 flex-shrink-0 rounded-md p-1.5",
              "text-gray-400 hover:text-gray-600",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              "transition-colors duration-150"
            )}
            onClick={onDismiss}
            aria-label="Închide"
            data-testid="alert-dismiss-btn"
          >
            <span className="sr-only">Închide</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Funcție pentru a genera iconița potrivită fiecărui tip de alertă
const getAlertIcon = (type: string) => {
  const iconClass = "w-5 h-5";
  
  switch(type) {
    case 'success':
      return (
        <svg className={cn(iconClass, "text-emerald-600")} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
      );
    case 'error':
      return (
        <svg className={cn(iconClass, "text-red-600")} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
        </svg>
      );
    case 'warning':
      return (
        <svg className={cn(iconClass, "text-yellow-600")} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
      );
    case 'info':
    default:
      return (
        <svg className={cn(iconClass, "text-blue-600")} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
        </svg>
      );
  }
};

export default Alert;
