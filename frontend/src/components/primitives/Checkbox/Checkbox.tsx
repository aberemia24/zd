import React from 'react';
import classNames from 'classnames';
import { getComponentClasses } from '../../../styles/themeUtils';

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
      className={classNames(
        getComponentClasses('checkbox', undefined, undefined, error ? 'error' : undefined),
        className
      )}
      data-testid={dataTestId || `checkbox-field${error ? '-error' : ''}`}
      {...rest}
    />
    {label && <label className={getComponentClasses('checkbox-label')}>{label}</label>}
    {error && <span className={getComponentClasses('form-error')} data-testid="checkbox-error">{error}</span>}
  </div>
);

export default Checkbox;
