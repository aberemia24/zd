import React from 'react';
import classNames from 'classnames';

export type ButtonProps = {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  disabled = false,
  onClick,
  children,
  className,
  type = 'button',
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
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
