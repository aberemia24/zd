import React from 'react';
import classNames from 'classnames';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  'data-testid'?: string;
} // data-testid și orice alt prop HTML sunt permise

const Checkbox: React.FC<CheckboxProps> = ({ label, error, className, wrapperClassName, 'data-testid': dataTestId, ...rest }) => (
  <div className={classNames('flex items-center', wrapperClassName)}>
    <input
      type="checkbox"
      className={classNames(error ? 'accent-warning' : 'accent-primary', className)}
      data-testid={dataTestId || `checkbox-field${error ? '-error' : ''}`}
      {...rest}
    />
    {label && <label className="ml-2 form-label">{label}</label>}
    {error && <span className="text-error text-xs ml-2" data-testid="checkbox-error">{error}</span>}
  </div>
);

export default Checkbox;
