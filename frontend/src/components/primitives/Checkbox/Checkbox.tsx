import React from 'react';
import classNames from 'classnames';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, error, className, wrapperClassName, ...rest }) => (
  <div className={classNames('flex items-center', wrapperClassName)}>
    <input
      type="checkbox"
      className={classNames('accent-primary', className)}
      {...rest}
    />
    {label && <label className="ml-2 form-label">{label}</label>}
    {error && <span className="text-error text-xs ml-2">{error}</span>}
  </div>
);

export default Checkbox;
