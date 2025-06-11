import React from 'react';
import { cn, spacingMargin } from '../../../styles/cva-v2';

/**
 * Props pentru PreferenceToggle component
 */
export interface PreferenceToggleProps {
  /** ID-ul unic pentru toggle */
  id: string;
  /** Titlul preferinței */
  title: string;
  /** Descrierea preferinței */
  description: string;
  /** Label-ul pentru checkbox */
  label: string;
  /** Recomandarea sau informații adiționale */
  recommendation?: string;
  /** Valoarea curentă (checked/unchecked) */
  checked: boolean;
  /** Callback când se schimbă valoarea */
  onChange: (checked: boolean) => void;
  /** Dacă toggle-ul este disabled */
  disabled?: boolean;
  /** Variant de culoare (default: blue) */
  variant?: 'blue' | 'green' | 'amber' | 'red';
  /** Test ID pentru testare */
  testId?: string;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Componentă reutilizabilă pentru toggle-urile de preferințe
 * 
 * @example
 * ```tsx
 * <PreferenceToggle
 *   id="delete-confirmation"
 *   title="⌨️ Confirmare ștergere cu Delete key"
 *   description="Controlează dacă aplicația va cere confirmare când ștergi tranzacții."
 *   label="Afișează confirmare pentru ștergere"
 *   recommendation="💡 Recomandat activat pentru siguranță"
 *   checked={deleteConfirmationEnabled}
 *   onChange={setDeleteConfirmation}
 *   testId="delete-confirmation-toggle"
 * />
 * ```
 */
export const PreferenceToggle: React.FC<PreferenceToggleProps> = ({
  id,
  title,
  description,
  label,
  recommendation,
  checked,
  onChange,
  disabled = false,
  variant = 'blue',
  testId,
  isLoading = false
}) => {
  // Variant styles
  const variantStyles = {
    blue: {
      border: 'border-blue-200 dark:border-blue-700',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      titleColor: 'text-blue-900 dark:text-blue-100',
      descColor: 'text-blue-700 dark:text-blue-300',
      recColor: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      border: 'border-green-200 dark:border-green-700',
      bg: 'bg-green-50 dark:bg-green-900/20',
      titleColor: 'text-green-900 dark:text-green-100',
      descColor: 'text-green-700 dark:text-green-300',
      recColor: 'text-green-600 dark:text-green-400'
    },
    amber: {
      border: 'border-amber-200 dark:border-amber-700',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      titleColor: 'text-amber-900 dark:text-amber-100',
      descColor: 'text-amber-700 dark:text-amber-300',
      recColor: 'text-amber-600 dark:text-amber-400'
    },
    red: {
      border: 'border-red-200 dark:border-red-700',
      bg: 'bg-red-50 dark:bg-red-900/20',
      titleColor: 'text-red-900 dark:text-red-100',
      descColor: 'text-red-700 dark:text-red-300',
      recColor: 'text-red-600 dark:text-red-400'
    }
  };

  const styles = variantStyles[variant];

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && !isLoading) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={cn(
      'border rounded-lg p-4',
      styles.border,
      styles.bg,
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      {/* Title */}
      <h3 className={cn(
        'font-semibold',
        styles.titleColor,
        spacingMargin({ bottom: 2 })
      )}>
        {title}
      </h3>

      {/* Description */}
      <p className={cn(
        'text-sm',
        styles.descColor,
        spacingMargin({ bottom: 3 })
      )}>
        {description}
      </p>

      {/* Toggle Control */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            className={cn(
              'rounded border-gray-300 focus:ring-2 focus:ring-blue-500',
              disabled && 'cursor-not-allowed',
              isLoading && 'opacity-50'
            )}
            checked={checked}
            onChange={handleToggle}
            disabled={disabled || isLoading}
            data-testid={testId}
            aria-describedby={recommendation ? `${id}-recommendation` : undefined}
          />
          
          {/* Loading spinner overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <label 
          htmlFor={id} 
          className={cn(
            'text-sm font-medium cursor-pointer',
            'text-gray-700 dark:text-gray-300',
            disabled && 'cursor-not-allowed'
          )}
        >
          {label}
        </label>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div 
          id={`${id}-recommendation`}
          className={cn(
            'text-xs',
            styles.recColor,
            spacingMargin({ top: 2 })
          )}
        >
          {recommendation}
        </div>
      )}
    </div>
  );
};

export default PreferenceToggle; 