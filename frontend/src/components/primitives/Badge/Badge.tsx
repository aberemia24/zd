import React from 'react';
import classNames from 'classnames';

export interface BadgeProps {
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}

const colorStyles = {
  primary: 'bg-primary text-white',
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-400 text-black',
  info: 'bg-blue-500 text-white',
};

const Badge: React.FC<BadgeProps> = ({ color = 'primary', children, className }) => (
  <span className={classNames('inline-block px-2 py-0.5 rounded text-xs font-semibold', colorStyles[color], className)}>
    {children}
  </span>
);

export default Badge;
