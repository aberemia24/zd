import React from 'react';
import classNames from 'classnames';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, error, className, wrapperClassName, ...rest }) => (
  <div className={classNames('flex flex-col', wrapperClassName)}>
    {label && <label className="form-label mb-1">{label}</label>}
    <textarea
      className={classNames('input-field', error && 'border-red-500', className)}
      {...rest}
    />
    {error && <span className="text-error text-xs mt-1">{error}</span>}
  </div>
);

export default Textarea;
