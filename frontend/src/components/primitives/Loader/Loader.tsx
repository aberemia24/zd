import React from 'react';
import { LOADER } from '@shared-constants';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import type { ComponentSize, ComponentVariant } from '../../../styles/themeTypes';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  text?: string;
  showText?: boolean;
  className?: string;
  'data-testid'?: string;
  
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
  'data-testid': dataTestId,
  withPulse = false,
  withGradient = false,
  withFadeIn = false
}) => {
  // Efecte vizuale pentru container
  const containerEffects: string[] = [];
  if (withFadeIn) {
    containerEffects.push('fade-in');
  }
  
  // Efecte vizuale pentru SVG
  const svgEffects: string[] = [];
  if (withPulse) {
    svgEffects.push('pulse-animation');
  }
  
  // Efecte vizuale pentru elemente interne
  const circleEffects: string[] = [];
  const pathEffects: string[] = [];
  
  if (withGradient) {
    circleEffects.push('gradient-stroke');
    pathEffects.push('gradient-fill');
  }
  
  // Efecte pentru text
  const textEffects: string[] = [];
  if (withGradient) {
    textEffects.push('gradient-text');
  }
  
  return (
    <div 
      className={getEnhancedComponentClasses('loader-container', variant as ComponentVariant, undefined, undefined, containerEffects)} 
      data-testid={dataTestId || 'loader-container'}
    >
      <svg 
        className={getEnhancedComponentClasses('loader-svg', variant as ComponentVariant, size as ComponentSize, undefined, svgEffects)} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        data-testid="loader-svg"
      >
        <circle 
          className={getEnhancedComponentClasses('loader-circle', variant as ComponentVariant, undefined, undefined, circleEffects)} 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className={getEnhancedComponentClasses('loader-path', variant as ComponentVariant, undefined, undefined, pathEffects)} 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      {showText && (
        <span 
          className={getEnhancedComponentClasses('loader-text', variant as ComponentVariant, undefined, undefined, textEffects)} 
          data-testid="loader-text"
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default Loader;
