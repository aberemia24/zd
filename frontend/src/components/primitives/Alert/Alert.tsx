import React from 'react';
import classNames from 'classnames';
import { getComponentClasses } from '../../../styles/themeUtils';

export interface AlertProps {
  type?: 'success' | 'error' | 'warning';
  message: string;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type = 'success', message, className }) => {
  return (
    <div
      className={classNames(
        getComponentClasses('alert'),
        getComponentClasses('alert-variant', type),
        className
      )}
      role="alert"
      data-testid={`alert-${type}`}
    >
      {message}
    </div>
  );
};

export default Alert;
