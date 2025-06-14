import { BUTTONS, FrequencyType, PLACEHOLDERS } from '@budget-app/shared-constants';
import * as Popover from '@radix-ui/react-popover';
import { cva } from 'class-variance-authority';
import { Save, Trash2, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { cn } from '../../../../styles/cva-v2';
// import { card } from '../../../../styles/cva-v2/core';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface AdvancedEditPopoverProps {
  // Radix UI props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Transaction data
  initialAmount?: string;
  initialDescription?: string;
  initialRecurring?: boolean;
  initialFrequency?: FrequencyType;

  // Context
  category: string;
  subcategory?: string;
  date: string;

  // Actions
  onSave: (data: {
    amount: string;
    description: string;
    recurring: boolean;
    frequency?: FrequencyType;
  }) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;

  // State
  isLoading?: boolean;

  // Trigger element
  children: React.ReactNode;
}

export const AdvancedEditPopover: React.FC<AdvancedEditPopoverProps> = ({
  open,
  onOpenChange,
  initialAmount = '',
  initialDescription = '',
  initialRecurring = false,
  initialFrequency,
  category,
  subcategory,
  date,
  onSave,
  onCancel,
  onDelete,
  isLoading = false,
  children,
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [description, setDescription] = useState(initialDescription);
  const [recurring, setRecurring] = useState(initialRecurring);
  const [frequency, setFrequency] = useState<FrequencyType | undefined>(initialFrequency);
  const [error, setError] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    try {
      setError(null);

      if (!amount || parseFloat(amount) <= 0) {
        setError('Suma trebuie să fie mai mare de 0');
        return;
      }

      await onSave({
        amount,
        description,
        recurring,
        ...(recurring && frequency ? { frequency } : {}),
      });

      onOpenChange?.(false);
    } catch (err) {
      console.error('[AdvancedEditPopover] Save error:', err);
      setError('Eroare la salvare');
    }
  }, [amount, description, recurring, frequency, onSave, onOpenChange]);

  const handleCancel = useCallback(() => {
    setAmount(initialAmount);
    setDescription(initialDescription);
    setRecurring(initialRecurring);
    setFrequency(initialFrequency);
    setError(null);
    onCancel();
    onOpenChange?.(false);
  }, [initialAmount, initialDescription, initialRecurring, initialFrequency, onCancel, onOpenChange]);

  const handleDelete = useCallback(async () => {
    if (onDelete) {
      try {
        await onDelete();
        onOpenChange?.(false);
      } catch (err) {
        console.error('[AdvancedEditPopover] Delete error:', err);
        setError('Eroare la ștergere');
      }
    }
  }, [onDelete, onOpenChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  return (
    <Popover.Root open={open || false} onOpenChange={onOpenChange || (() => {})}>
      <Popover.Trigger asChild>
        {children}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none"
          side="bottom"
          align="start"
          sideOffset={5}
          onKeyDown={handleKeyDown}
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                {initialAmount ? 'Editează tranzacția' : 'Adaugă tranzacție'}
              </h3>
              <div className="text-xs text-gray-500">
                {category} {subcategory && `• ${subcategory}`}
              </div>
            </div>

            {/* Amount field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Suma (RON)
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/,/g, '.'))}
                placeholder={PLACEHOLDERS.AMOUNT || "0.00"}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-copper-500 focus:border-transparent"
                autoFocus
                disabled={isLoading}
              />
            </div>

            {/* Description field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Descriere
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={PLACEHOLDERS.DESCRIPTION || "Descriere..."}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-copper-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            {/* Recurring checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recurring"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="rounded border-gray-300 text-copper-600 focus:ring-copper-500"
                disabled={isLoading}
              />
              <label htmlFor="recurring" className="text-sm text-gray-700">
                Recurentă
              </label>
            </div>

            {/* Frequency select (doar dacă e recurentă) */}
            {recurring && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Frecvență
                </label>
                <select
                  value={frequency || ''}
                  onChange={(e) => setFrequency(e.target.value as FrequencyType)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-copper-500 focus:border-transparent"
                  disabled={isLoading}
                >
                  <option value="">Selectează frecvența</option>
                  <option value={FrequencyType.MONTHLY}>Lunar</option>
                  <option value={FrequencyType.WEEKLY}>Săptămânal</option>
                  <option value={FrequencyType.YEARLY}>Anual</option>
                </select>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "bg-copper-600 hover:bg-copper-700"
                  )}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={14} className="mr-1" />
                      {'Salvează'}
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  <X size={14} className="mr-1" />
                  {BUTTONS.CANCEL || 'Anulează'}
                </button>
              </div>

              {/* Delete button (doar dacă există tranzacție) */}
              {onDelete && initialAmount && (
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className={cn(
                    buttonVariants({ variant: "destructive", size: "sm" }),
                    "bg-red-600 hover:bg-red-700"
                  )}
                  title="Șterge tranzacția"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default AdvancedEditPopover;
