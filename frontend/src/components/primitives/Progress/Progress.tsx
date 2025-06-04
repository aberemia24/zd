import React from "react";
import { 
  cn,
  progressContainer,
  progressBar,
  progressLabel,
  type ProgressContainerProps,
  type ProgressBarProps,
  type ProgressLabelProps
} from "../../../styles/cva-v2";

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  showValue?: boolean;
  size?: ProgressContainerProps['size'];
  variant?: ProgressBarProps['variant'];
  animated?: ProgressBarProps['animated'];
  labelPosition?: ProgressLabelProps['position'];
  className?: string;
  dataTestId?: string;
}

/**
 * Progress component pentru tracking progres
 * Bazat pe CVA v2 cu Carbon Copper design system
 */
const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showPercentage = false,
  showValue = false,
  size = "md",
  variant = "default",
  animated = false,
  labelPosition = "top",
  className,
  dataTestId,
  ...props
}) => {
  // Ensure value is within bounds
  const clampedValue = Math.max(0, Math.min(value, max));
  const percentage = (clampedValue / max) * 100;

  // Format display values
  const formatValue = (val: number) => {
    if (variant === "financial") {
      return new Intl.NumberFormat('ro-RO', {
        style: 'currency',
        currency: 'RON',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
    return val.toString();
  };

  const displayText = () => {
    if (showPercentage && showValue) {
      return `${formatValue(clampedValue)} / ${formatValue(max)} (${percentage.toFixed(1)}%)`;
    }
    if (showPercentage) {
      return `${percentage.toFixed(1)}%`;
    }
    if (showValue) {
      return `${formatValue(clampedValue)} / ${formatValue(max)}`;
    }
    return null;
  };

  const labelElement = (label || displayText()) && (
    <div className={cn(progressLabel({ position: labelPosition }))}>
      {label && <span className="font-semibold">{label}</span>}
      {label && displayText() && <span className="ml-2 text-neutral-500 dark:text-neutral-400">
        {displayText()}
      </span>}
      {!label && displayText()}
    </div>
  );

  return (
    <div className={cn("w-full", className)} data-testid={dataTestId} {...props}>
      {labelPosition === "top" && labelElement}
      {labelPosition === "inline" && (
        <div className="flex items-center space-x-3">
          {labelElement}
          <div className="flex-1">
            <div className={cn(progressContainer({ size }))}>
              <div
                className={cn(progressBar({ variant, animated }))}
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={clampedValue}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-label={label || `Progress: ${percentage.toFixed(1)}%`}
              />
            </div>
          </div>
        </div>
      )}
      {labelPosition !== "inline" && (
        <div className={cn(progressContainer({ size }))}>
          <div
            className={cn(progressBar({ variant, animated }))}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={clampedValue}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={label || `Progress: ${percentage.toFixed(1)}%`}
          />
        </div>
      )}
      {labelPosition === "bottom" && labelElement}
    </div>
  );
};

export default Progress; 