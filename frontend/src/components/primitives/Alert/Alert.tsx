import React from 'react';
import classNames from 'classnames';

export interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
}

const typeStyles = {
  success: 'bg-success-50 border-success-200 text-success-700',
  error: 'bg-error-50 border-error-200 text-error-700',
  warning: 'bg-warning-50 border-warning-200 text-warning-700',
  info: 'bg-info-50 border-info-200 text-info-700',
};

const Alert: React.FC<AlertProps> = ({ type = 'info', message, className }) => (
  <div className={classNames('border rounded p-4 my-2 text-center', typeStyles[type], className)} role="alert" data-testid={`alert-${type}`}>
    {message}
  </div>
);

export default Alert;
