import React from 'react';
import classNames from 'classnames';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  'data-testid'?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const Input: React.FC<InputProps> = ({ label, error, className, wrapperClassName, 'data-testid': dataTestId, inputRef, ...rest }) => (
  <div className={classNames('flex flex-col', wrapperClassName)}>
    {label && <label className="text-secondary-700 mb-1">{label}</label>}
    <input
      ref={inputRef}
      className={classNames('input-field', error && 'border-error', className)}
      data-testid={dataTestId || `input-field${error ? '-error' : ''}`}
      {...rest}
    />
    {error && <span className="text-error text-xs mt-1" data-testid="input-error">{error}</span>}
  </div>
);

export default Input;
