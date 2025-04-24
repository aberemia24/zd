import React from 'react';
import classNames from 'classnames';

export interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
}

const typeStyles = {
  success: 'bg-green-50 border-green-200 text-green-700',
  error: 'bg-red-50 border-red-200 text-red-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
};

const Alert: React.FC<AlertProps> = ({ type = 'info', message, className }) => (
  <div className={classNames('border rounded p-4 my-2 text-center', typeStyles[type], className)} role="alert">
    {message}
  </div>
);

export default Alert;
