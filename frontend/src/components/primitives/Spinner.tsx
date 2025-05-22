import React from 'react';
import classNames from 'classnames';
import { useThemeEffects } from '../../hooks';
import type { ComponentSize, ComponentVariant } from '../../styles/themeTypes';
import { LOADER } from '@shared-constants';

export interface SpinnerProps {
  sizeValue?: number;
  sizeVariant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  className?: string;
  showBackground?: boolean;
  'data-testid'?: string;
  
  // Efecte vizuale rafinate
  /** Viteză de rotație a spinner-ului: slow, normal, fast */
  speed?: 'slow' | 'normal' | 'fast';
  /** Animație de fade-in la apariție */
  withFadeIn?: boolean;
  /** Efect de pulsare în plus față de spinner */
  withPulse?: boolean;
  /** Animație de gradient color pentru spinner */
  withGradient?: boolean;
  /** Umbră pentru efect 3D */
  withShadow?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  sizeValue = 40,
  sizeVariant = 'md',
  variant = 'primary',
  className,
  showBackground = true,
  'data-testid': dataTestId,
  speed = 'normal',
  withFadeIn = false,
  withPulse = false,
  withGradient = false,
  withShadow = false
}) => {
  // Map size variant to actual size
  const getSizeValue = (): number => {
    if (sizeValue !== 40) return sizeValue;
    
    switch(sizeVariant) {
      case 'xs': return 16;
      case 'sm': return 24;
      case 'lg': return 48;
      case 'xl': return 64;
      case 'md':
      default: return 40;
    }
  };
  
  const size = getSizeValue();
  
  // Configurăm clasele pentru viteza de rotație
  const getSpeedClass = () => {
    switch(speed) {
      case 'slow': return 'animate-spin-slow';
      case 'fast': return 'animate-spin-fast';
      case 'normal':
      default: return 'animate-spin';
    }
  };
  
  // Utilizăm hook-ul pentru gestionarea efectelor vizuale
  const { getClasses } = useThemeEffects({
    withFadeIn,
    withPulse,
    withGradient,
    withShadow
  });
  
  return (
    <div 
      className={classNames(
        getClasses('loader-container', variant as ComponentVariant, sizeVariant as ComponentSize),
        className
      )} 
      data-testid={dataTestId || 'spinner'}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={classNames(
          getClasses('loader-svg', variant as ComponentVariant, sizeVariant as ComponentSize),
          getSpeedClass()
        )}
      >
        {showBackground && (
          <circle
            cx="22"
            cy="22"
            r="20"
            className={getClasses('loader-circle', variant as ComponentVariant)}
            strokeWidth="4"
            fill="none"
            opacity="0.2"
          />
        )}
        <path
          d="M42 22c0-11.046-8.954-20-20-20"
          className={getClasses('loader-path', variant as ComponentVariant)}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Spinner;
