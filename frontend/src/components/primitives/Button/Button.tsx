import React from 'react';
import classNames from 'classnames';

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'data-testid'> & {
  variant?: 'primary' | 'secondary';
  dataTestId?: string;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  disabled = false,
  className,
  children,
  dataTestId,
  ...rest
}) => {
  return (
    <button
      className={classNames(
        'btn',
        variant === 'primary' ? 'btn-primary' : 'btn-secondary',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      data-testid={dataTestId || 'button-field'}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
