import React from 'react';
import classNames from 'classnames';
import { getComponentClasses } from '../../../styles/themeUtils';
import type { ComponentVariant } from '../../../styles/themeTypes';

export interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  'data-testid'?: string;
}

const Alert: React.FC<AlertProps> = ({ 
  type = 'success', 
  message, 
  className,
  dismissible = false,
  onDismiss,
  'data-testid': dataTestId
}) => {
  // Determinăm varianta din tip (type → ComponentVariant)
  const variant: ComponentVariant = (['success', 'error', 'warning', 'info'].includes(type) 
    ? type 
    : 'info') as ComponentVariant;
  return (
    <div
      className={classNames(
        getComponentClasses('alert', variant),
        className
      )}
      role="alert"
      data-testid={dataTestId || `alert-${type}`}
    >
      <div className="flex justify-between items-center">
        <div>{message}</div>
        {dismissible && (
          <button 
            type="button" 
            className={getComponentClasses('button', 'ghost', 'xs')}
            onClick={onDismiss}
            aria-label="Închide"
            data-testid="alert-dismiss-btn"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
