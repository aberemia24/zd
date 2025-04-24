import React from 'react';
import classNames from 'classnames';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, wrapperClassName, ...rest }) => (
  <div className={classNames('flex flex-col', wrapperClassName)}>
    {label && <label className="form-label mb-1">{label}</label>}
    <input
      className={classNames('input-field', error && 'border-red-500', className)}
      {...rest}
    />
    {error && <span className="text-error text-xs mt-1">{error}</span>}
  </div>
);

export default Input;
