import React from 'react';
import classNames from 'classnames';
import { useThemeEffects } from '../../../hooks';
import type { ComponentVariant } from '../../../styles/themeTypes';

export interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  /** Titlu opțional pentru alertă (afișat mai proeminent deasupra mesajului) */
  title?: string;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  dataTestId?: string;
  
  // Efecte vizuale rafinate
  /** Adaugă animație la apariție */
  withFadeIn?: boolean;
  /** Adaugă border stanga accentuat */
  withAccentBorder?: boolean;
  /** Adaugă umbră pentru efect ridicat */
  withShadow?: boolean;
  /** Adaugă iconiță specifică pentru tip */
  withIcon?: boolean;
  /** Adaugă background cu gradient */
  withGradient?: boolean;
  /** Adaugă efect de hover pentru butoane */
  withHoverEffect?: boolean;
}

const Alert: React.FC<AlertProps> = ({ 
  type = 'info', 
  message, 
  title,
  className,
  dismissible = false,
  onDismiss,
  dataTestId,
  withFadeIn = false,
  withAccentBorder = false,
  withShadow = false,
  withIcon = false,
  withGradient = false,
  withHoverEffect = true
}) => {
  // Determinăm varianta din tip (type → ComponentVariant)
  const variant: ComponentVariant = (['success', 'error', 'warning', 'info'].includes(type) 
    ? type 
    : 'info') as ComponentVariant;
    
  // Utilizăm hook-ul pentru gestionarea efectelor vizuale
  const { getClasses } = useThemeEffects({
    withFadeIn,
    withShadow,
    withGradient,
    withHoverEffect,
    withAccentBorder
  });
  
  // Stabilim iconița în funcție de tipul alertei
  const alertIcon = withIcon ? getAlertIcon(type) : null;
  
  return (
    <div
      className={classNames(
        getClasses('alert', variant),
        className
      )}
      role="alert"
      data-testid={dataTestId || `alert-${type}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          {alertIcon && (
            <span className="mr-2 mt-1">{alertIcon}</span>
          )}
          <div>
            {title && (
              <h3 className="font-semibold text-lg mb-1" style={{ color: `var(--color-${variant}-700)` }}>
                {title}
              </h3>
            )}
            <div className={title ? 'mt-1' : ''}>{message}</div>
          </div>
        </div>
        {dismissible && (
          <button 
            type="button" 
            className={getClasses('button', 'ghost', 'xs')}
            onClick={onDismiss}
            aria-label="Închide"
            data-testid="alert-dismiss-btn"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Funcție pentru a genera iconița potrivită fiecărui tip de alertă
const getAlertIcon = (type: string) => {
  switch(type) {
    case 'success':
      return (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
      );
    case 'error':
      return (
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
        </svg>
      );
    case 'warning':
      return (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
        </svg>
      );
    case 'info':
      return (
        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
        </svg>
      );
    default:
      return null;
  }
};

export default Alert;
