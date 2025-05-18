import React from 'react';
import classNames from 'classnames';
import { getComponentClasses } from '../../../styles/themeUtils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  'data-testid'?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, error, className, wrapperClassName, 'data-testid': dataTestId, ...rest }) => (
  <div className={classNames(getComponentClasses('form-group'), wrapperClassName)}>
    {label && <label className={getComponentClasses('form-label')}>{label}</label>}
    <textarea
      className={classNames(
        getComponentClasses('input', error ? undefined : 'primary', undefined, error ? 'error' : undefined),
        className
      )}
      data-testid={dataTestId || `textarea-field${error ? '-error' : ''}`}
      {...rest}
    />
    {error && <span className={getComponentClasses('form-error')} data-testid="textarea-error">{error}</span>}
  </div>
);

export default Textarea;
