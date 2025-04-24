import React from 'react';
import classNames from 'classnames';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ label, error, className, wrapperClassName, options, placeholder, id, ...rest }) => (
  <div className={classNames('flex flex-col', wrapperClassName)}>
    {label && <label htmlFor={id || rest.name} className="form-label mb-1">{label}</label>}
    <select
      id={id || rest.name}
      className={classNames('input-field', error && 'border-red-500', className)}
      {...rest}
    >
      {placeholder && !rest.value && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <span className="text-error text-xs mt-1">{error}</span>}
  </div>
);

export default Select;
