import React from 'react';
import { cn } from '../../../styles/cva/shared/utils';
import { loader, type LoaderProps as CVALoaderProps } from '../../../styles/cva/components/feedback';

export interface SpinnerProps extends CVALoaderProps {
  sizeValue?: number;
  className?: string;
  showBackground?: boolean;
  'data-testid'?: string;
  
  // Simplified - păstrăm doar speed
  speed?: 'slow' | 'normal' | 'fast';
}

const Spinner: React.FC<SpinnerProps> = ({ 
  sizeValue,
  size = 'md',
  color = 'primary',
  className,
  showBackground = true,
  'data-testid': dataTestId,
  speed = 'normal'
}) => {
  // Map size variant to actual size value if sizeValue not provided
  const getSizeValue = (): number => {
    if (sizeValue) return sizeValue;
    
    switch(size) {
      case 'sm': return 16;
      case 'lg': return 48;
      case 'xl': return 64;
      case 'md':
      default: return 32;
    }
  };
  
  const actualSize = getSizeValue();
  
  // Speed classes
  const getSpeedClass = () => {
    switch(speed) {
      case 'slow': return 'animate-spin'; // Could be customized with slower animation
      case 'fast': return 'animate-spin'; // Could be customized with faster animation  
      case 'normal':
      default: return 'animate-spin';
    }
  };
  
  return (
    <div 
      className={cn(
        'inline-flex items-center justify-center',
        className
      )} 
      data-testid={dataTestId || 'spinner'}
    >
      <svg
        width={actualSize}
        height={actualSize}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          loader({ size, color }),
          getSpeedClass()
        )}
      >
        {showBackground && (
          <circle
            cx="22"
            cy="22"
            r="20"
            className="stroke-current opacity-20"
            strokeWidth="4"
            fill="none"
          />
        )}
        <path
          d="M42 22c0-11.046-8.954-20-20-20"
          className="stroke-current"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Spinner;
