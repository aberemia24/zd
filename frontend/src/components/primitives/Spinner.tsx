import React from 'react';
import classNames from 'classnames';
import { getComponentClasses } from '../../styles/themeUtils';
import type { ComponentSize, ComponentVariant } from '../../styles/themeTypes';
import { LOADER } from '@shared-constants';

export interface SpinnerProps {
  sizeValue?: number;
  sizeVariant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  className?: string;
  showBackground?: boolean;
  'data-testid'?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  sizeValue = 40,
  sizeVariant = 'md',
  variant = 'primary',
  className,
  showBackground = true,
  'data-testid': dataTestId
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
  
  return (
  <div 
    className={classNames(
      getComponentClasses('loader-container', variant as ComponentVariant, sizeVariant as ComponentSize),
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
        getComponentClasses('loader-svg', variant as ComponentVariant, sizeVariant as ComponentSize),
        'animate-spin'
      )}
    >
      {showBackground && (
        <circle
          cx="22"
          cy="22"
          r="20"
          className={getComponentClasses('loader-circle', variant as ComponentVariant)}
          strokeWidth="4"
          fill="none"
          opacity="0.2"
        />
      )}
      <path
        d="M42 22c0-11.046-8.954-20-20-20"
        className={getComponentClasses('loader-path', variant as ComponentVariant)}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  </div>
);
};

export default Spinner;
