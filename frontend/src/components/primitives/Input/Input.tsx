import React, { forwardRef } from 'react';
import { cn } from '../../../styles/cva/shared/utils';
import { 
  input, 
  inputWrapper, 
  label,
  type InputProps as CVAInputProps,
  type LabelProps 
} from '../../../styles/cva/components/forms';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'data-testid'> & 
  CVAInputProps & {
  label?: string;
  error?: string;
  dataTestId?: string;
  // Simplified props - removed complex effects, kept essential
  withIconLeft?: React.ReactNode;
  withIconRight?: React.ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label: labelText,
  error,
  variant = 'default',
  size = 'md',
  className,
  disabled = false,
  dataTestId,
  withIconLeft,
  withIconRight,
  ...rest
}, ref) => {
  // Determine variant based on error state
  const inputVariant = error ? 'error' : variant;
  
  return (
    <div className={cn(
      inputWrapper({ size }),
      className
    )}>
      {labelText && (
        <label 
          htmlFor={rest.id} 
          className={label({ 
            variant: error ? 'error' : 'default',
            size 
          })}
        >
          {labelText}
        </label>
      )}
      <div className="relative">
        {withIconLeft && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            {withIconLeft}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            input({ 
              variant: inputVariant, 
              size 
            }),
            withIconLeft && "pl-10",
            withIconRight && "pr-10"
          )}
          disabled={disabled}
          data-testid={dataTestId || `input-${inputVariant}-${size}`}
          {...rest}
        />
        {withIconRight && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            {withIconRight}
          </span>
        )}
      </div>
      {error && (
        <div className="text-sm text-red-600 mt-1">
          {error}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
