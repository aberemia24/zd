import React from 'react';
import classNames from 'classnames';
import { useThemeEffects } from '../../../hooks';
import type { ComponentVariant, ComponentSize } from '../../../styles/themeTypes';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'xs' | 'sm' | 'md';
  pill?: boolean;
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  
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
  /** Adăugare efect de intrare cu animație */
  withFadeIn?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ 
  variant = 'primary', 
  size = 'xs',
  pill = false,
  children, 
  className,
  dataTestId,
  withPulse = false,
  isActive = false,
  withShadow = false,
  withGradient = false,
  withGlow = false,
  withFadeIn = false
}) => {
  // Mapare variante badge și dimensiuni
  const badgeVariant: ComponentVariant = (['primary', 'secondary', 'success', 'error', 'warning', 'info'].includes(variant) 
    ? variant 
    : 'primary') as ComponentVariant;
  
  const badgeSize: ComponentSize = (['xs', 'sm', 'md'].includes(size)
    ? size
    : 'xs') as ComponentSize;
    
  // Utilizăm hook-ul pentru gestionarea efectelor vizuale
  const { getClasses } = useThemeEffects({
    withPulse,
    withShadow,
    withGradient,
    withGlow,
    withFadeIn
  });
  
  // Determinăm starea Badge-ului
  const state = isActive ? 'active' : undefined;
  
  return (
    <span
      className={classNames(
        getClasses('badge', badgeVariant, badgeSize, state),
        pill && getClasses('badge', 'pill', undefined, undefined),
        className
      )}
      data-testid={dataTestId || `badge-${variant}${pill ? '-pill' : ''}`}
    >
      {children}
    </span>
  );
};

export default Badge;
