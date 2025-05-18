import React from 'react';
import classNames from 'classnames';
import { getComponentClasses } from '../../../styles/themeUtils';

export interface BadgeProps {
  color?: 'primary' | 'success' | 'error' | 'warning';
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ color = 'primary', children, className }) => {
  return (
    <span
      className={classNames(
        getComponentClasses('badge'),
        getComponentClasses('badge-variant', color),
        className
      )}
      data-testid={`badge-${color}`}
    >
      {children}
    </span>
  );
};

export default Badge;
