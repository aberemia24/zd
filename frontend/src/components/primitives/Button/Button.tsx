import React from 'react';
import classNames from 'classnames';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  disabled = false,
  className,
  children,
  'data-testid': dataTestId,
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
