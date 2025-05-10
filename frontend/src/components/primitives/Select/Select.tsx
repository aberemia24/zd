import React from 'react';
import classNames from 'classnames';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  'data-testid'?: string;
} // data-testid și orice alt prop HTML sunt permise

const Select: React.FC<SelectProps> = ({ label, error, className, wrapperClassName, options, placeholder, id, 'data-testid': dataTestId, ...rest }) => (
  <div className={classNames('flex flex-col', wrapperClassName)}>
    {label && <label htmlFor={id || rest.name} className="text-secondary-700 mb-1">{label}</label>}
    <select
      id={id || rest.name}
      className={classNames('input-field', error && 'border-error', className)}
      value={options.some(opt => opt.value === rest.value) ? rest.value : ''}
      data-testid={dataTestId || `select-field${error ? '-error' : ''}`}
      {...rest}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <span className="text-error text-xs mt-1" data-testid="select-error">{error}</span>}
  </div>
);

export default Select;
