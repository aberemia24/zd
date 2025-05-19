import React from 'react';
import { LOADER } from '@shared-constants';
import { getComponentClasses } from '../../../styles/themeUtils';
import type { ComponentSize, ComponentVariant } from '../../../styles/themeTypes';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  text?: string;
  showText?: boolean;
  className?: string;
  'data-testid'?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'primary',
  text = LOADER.TEXT,
  showText = true,
  className,
  'data-testid': dataTestId
}) => (

  <div 
    className={getComponentClasses('loader-container', variant as ComponentVariant, undefined)} 
    data-testid={dataTestId || 'loader-container'}
  >
    <svg 
      className={getComponentClasses('loader-svg', variant as ComponentVariant, size as ComponentSize)} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      data-testid="loader-svg"
    >
      <circle 
        className={getComponentClasses('loader-circle', variant as ComponentVariant)} 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className={getComponentClasses('loader-path', variant as ComponentVariant)} 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
    {showText && (
      <span 
        className={getComponentClasses('loader-text', variant as ComponentVariant)} 
        data-testid="loader-text"
      >
        {text}
      </span>
    )}
  </div>
);

export default Loader;
