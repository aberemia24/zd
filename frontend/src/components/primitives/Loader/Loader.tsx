import React from 'react';
import { LOADER } from '@shared-constants';
import { useThemeEffects } from '../../../hooks';
import type { ComponentSize, ComponentVariant } from '../../../styles/themeTypes';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  text?: string;
  showText?: boolean;
  className?: string;
  dataTestId?: string;
  
  // Efecte vizuale rafinate
  withPulse?: boolean;       // Efect de pulsare
  withGradient?: boolean;    // Efect de gradient în culoare
  withFadeIn?: boolean;      // Apariție treptată
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'primary',
  text = LOADER.TEXT,
  showText = true,
  className,
  dataTestId,
  withPulse = false,
  withGradient = false,
  withFadeIn = false
}) => {
  // Utilizăm hook-ul pentru gestionarea efectelor vizuale
  const { getClasses } = useThemeEffects({
    withPulse,
    withGradient,
    withFadeIn
  });
  
  return (
    <div 
      className={getClasses('loader-container', variant as ComponentVariant)} 
      data-testid={dataTestId || 'loader-container'}
    >
      <svg 
        className={getClasses('loader-svg', variant as ComponentVariant, size as ComponentSize)} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        data-testid="loader-svg"
      >
        <circle 
          className={getClasses('loader-circle', variant as ComponentVariant)} 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className={getClasses('loader-path', variant as ComponentVariant)} 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      {showText && (
        <span 
          className={getClasses('loader-text', variant as ComponentVariant)} 
          data-testid="loader-text"
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default Loader;
