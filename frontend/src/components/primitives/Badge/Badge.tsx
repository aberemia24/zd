import React from 'react';
import classNames from 'classnames';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import type { ComponentVariant, ComponentSize } from '../../../styles/themeTypes';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'xs' | 'sm' | 'md';
  pill?: boolean;
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
  
  // Efecte vizuale rafinate
  /** Adăugare pulsare pentru a atrage atenția */
  withPulse?: boolean;
  /** Adăugare stare activată cu stil diferit */
  isActive?: boolean;
  /** Adăugare umbră pentru un efect ridicat */
  withShadow?: boolean;
  /** Adăugare gradient în loc de culoare solidă */
  withGradient?: boolean;
  /** Adăugare efect de strălucire la hover */
  withGlow?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ 
  variant = 'primary', 
  size = 'xs',
  pill = false,
  children, 
  className,
  'data-testid': dataTestId,
  withPulse = false,
  isActive = false,
  withShadow = false,
  withGradient = false,
  withGlow = false
}) => {
  // Mapare variante badge și dimensiuni
  const badgeVariant: ComponentVariant = (['primary', 'secondary', 'success', 'error', 'warning', 'info'].includes(variant) 
    ? variant 
    : 'primary') as ComponentVariant;
  
  const badgeSize: ComponentSize = (['xs', 'sm', 'md'].includes(size)
    ? size
    : 'xs') as ComponentSize;
    
  // Colectăm efectele vizuale rafinate într-un array
  const effects: string[] = [];
  
  // Adăugăm efectele vizuale solicitate
  if (withPulse) {
    effects.push('pulse-animation');
  }
  
  if (isActive) {
    effects.push('badge-active');
  }
  
  if (withShadow) {
    effects.push('badge-shadow');
  }
  
  if (withGradient) {
    effects.push('badge-gradient');
  }
  
  if (withGlow) {
    effects.push('badge-glow');
  }
  
  // Determinăm starea Badge-ului
  const state = isActive ? 'active' : undefined;
  
  return (
    <span
      className={classNames(
        getEnhancedComponentClasses('badge', badgeVariant, badgeSize, state, effects),
        pill && getEnhancedComponentClasses('badge', 'pill', undefined, undefined, effects),
        className
      )}
      data-testid={dataTestId || `badge-${variant}${pill ? '-pill' : ''}`}
    >
      {children}
    </span>
  );
};

export default Badge;
