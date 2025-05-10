import React from 'react';
import classNames from 'classnames';

export interface AlertProps {
  type?: 'success' | 'error' | 'warning';
  message: string;
  className?: string;
}

const typeStyles = {
  success: 'bg-success-50 border-success-200 text-success-700',
  error: 'bg-error-50 border-error-200 text-error-700',
  warning: 'bg-warning-50 border-warning-200 text-warning-700',
};

const Alert: React.FC<AlertProps> = ({ type = 'success', message, className }) => {
  const style = typeStyles[type!] || typeStyles.success;
  return (
    <div className={classNames('border rounded p-4 my-2 text-center', style, className)} role="alert" data-testid={`alert-${type}`}>
      {message}
    </div>
  );
};

export default Alert;
