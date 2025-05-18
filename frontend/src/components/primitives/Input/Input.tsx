import React from 'react';
import classNames from 'classnames';
import { getComponentClasses } from '../../../styles/themeUtils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  'data-testid'?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const Input: React.FC<InputProps> = ({ label, error, className, wrapperClassName, 'data-testid': dataTestId, inputRef, ...rest }) => (
  <div className={classNames(getComponentClasses('form-group'), wrapperClassName)}>
    {label && <label className={getComponentClasses('form-label')}>{label}</label>}
    <input
      ref={inputRef}
      className={classNames(
        getComponentClasses('input', error ? undefined : 'primary', undefined, error ? 'error' : undefined),
        className
      )}
      data-testid={dataTestId || `input-field${error ? '-error' : ''}`}
      {...rest}
    />
    {error && <span className={getComponentClasses('form-error')} data-testid="input-error">{error}</span>}
  </div>
);

export default Input;
