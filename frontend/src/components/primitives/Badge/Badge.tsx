import React from 'react';
import classNames from 'classnames';
import { getComponentClasses } from '../../../styles/themeUtils';
import type { ComponentVariant, ComponentSize } from '../../../styles/themeTypes';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'xs' | 'sm' | 'md';
  pill?: boolean;
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  variant = 'primary', 
  size = 'xs',
  pill = false,
  children, 
  className,
  'data-testid': dataTestId
}) => {
  // Mapare variante badge și dimensiuni
  const badgeVariant: ComponentVariant = (['primary', 'secondary', 'success', 'error', 'warning', 'info'].includes(variant) 
    ? variant 
    : 'primary') as ComponentVariant;
  
  const badgeSize: ComponentSize = (['xs', 'sm', 'md'].includes(size)
    ? size
    : 'xs') as ComponentSize;
  return (
    <span
      className={classNames(
        getComponentClasses('badge', badgeVariant, badgeSize),
        pill && getComponentClasses('badge', 'pill'),
        className
      )}
      data-testid={dataTestId || `badge-${variant}${pill ? '-pill' : ''}`}
    >
      {children}
    </span>
  );
};

export default Badge;
