import React from 'react';
import classNames from 'classnames';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  'data-testid'?: string;
} // data-testid și orice alt prop HTML sunt permise

const Input: React.FC<InputProps> = ({ label, error, className, wrapperClassName, 'data-testid': dataTestId, ...rest }) => (
  <div className={classNames('flex flex-col', wrapperClassName)}>
    {label && <label className="form-label mb-1">{label}</label>}
    <input
      className={classNames('input-field', error && 'border-red-500', className)}
      data-testid={dataTestId || 'input-field'}
      {...rest}
    />
    {error && <span className="text-error text-xs mt-1">{error}</span>}
  </div>
);

export default Input;
