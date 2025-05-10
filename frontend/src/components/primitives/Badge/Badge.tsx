import React from 'react';
import classNames from 'classnames';

export interface BadgeProps {
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}

const colorStyles = {
  primary: 'bg-primary-500 text-white',
  success: 'bg-success-500 text-white',
  error: 'bg-error-500 text-white',
  warning: 'bg-warning-400 text-black',
  info: 'bg-info-500 text-white',
};

const Badge: React.FC<BadgeProps> = ({ color = 'primary', children, className }) => (
  <span className={classNames('inline-block px-2 py-0.5 rounded text-xs font-semibold', colorStyles[color], className)} data-testid={`badge-${color}`}>
    {children}
  </span>
);

export default Badge;
