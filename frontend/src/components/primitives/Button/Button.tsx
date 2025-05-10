import React from 'react';
import classNames from 'classnames';
import { getComponentClasses } from '../../../styles/themeUtils';
import type { ComponentVariant, ComponentSize } from '../../../styles/themeTypes';

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'data-testid'> & {
  variant?: ComponentVariant;
  size?: ComponentSize;
  dataTestId?: string;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  children,
  dataTestId,
  ...rest
}) => {
  return (
    <button
      className={classNames(
        getComponentClasses('button', variant, size),
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      data-testid={dataTestId || `button-${variant}-${size}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
