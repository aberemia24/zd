import React, { useState, useCallback, useEffect, useRef } from "react";
import Button from "../../../primitives/Button/Button";
import Input from "../../../primitives/Input/Input";
import Textarea from "../../../primitives/Textarea/Textarea";
import Checkbox from "../../../primitives/Checkbox/Checkbox";
import Select from "../../../primitives/Select/Select";
import { 
  cn,
  modal,
  card
} from "../../../../styles/cva-v2";
import { 
  FrequencyType, 
  LABELS, 
  BUTTONS, 
  PLACEHOLDERS,
  EXCEL_GRID,
  OPTIONS 
} from "@budget-app/shared-constants";

/**
 * Simplified QuickAddModal - V3 Refactor
 * 
 * SIMPLIFIED FEATURES:
 * ✅ Basic form fields (amount, description, recurring, frequency)
 * ✅ Simple save/cancel/delete actions
 * ✅ Context display (category/date)
 * ✅ Loading states
 * ✅ Basic keyboard shortcuts (Enter/Escape)
 * 
 * REMOVED FEATURES (for simplicity):
 * ❌ Dual layout system (positioned/centered)
 * ❌ Security input sanitization (XSS protection)
 * ❌ Viewport-aware positioning calculations
 * ❌ Advanced validation patterns
 * ❌ Character count protection
 * ❌ Advanced focus management
 * ❌ Confirmation modal integration
 * ❌ useBaseModalLogic dependency
 * 
 * Target: 690 → ~300 lines (55% reduction)
 */

// Simplified context interface
export interface CellContext {
  category: string;
  subcategory?: string;
  day: number;
  month: number;
  year: number;
}

// Simplified props interface
export interface QuickAddModalProps {
  cellContext: CellContext;
  prefillAmount?: string;
  autoFocus?: boolean;
  mode?: 'add' | 'edit';
  onSave: (data: {
    amount: string;
    description: string;
    recurring: boolean;
    frequency?: FrequencyType;
  }) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
}

export const QuickAddModalSimplified: React.FC<QuickAddModalProps> = ({ 
  cellContext, 
  prefillAmount = "", 
  autoFocus = true,
  mode = 'add',
  onSave, 
  onCancel,
  onDelete 
}) => {
  // Simplified inline state management - no external hooks
  const [formData, setFormData] = useState({
    amount: prefillAmount,
    description: "",
    recurring: false,
    frequency: undefined as FrequencyType | undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showRecurring, setShowRecurring] = useState(false);

  // Simple ref for focus
  const amountInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && amountInputRef.current) {
      const timeoutId = setTimeout(() => {
        amountInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [autoFocus]);

  // Simple validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount.trim()) {
      newErrors.amount = 'Suma este obligatorie';
    } else if (!/^[0-9]+([.,][0-9]{1,2})?$/.test(formData.amount)) {
      newErrors.amount = 'Suma trebuie să fie un număr valid';
    }

    if (formData.recurring && !formData.frequency) {
      newErrors.frequency = 'Frecvența este obligatorie pentru tranzacții recurente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (isLoading) return;

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave({
        amount: formData.amount,
        description: formData.description.trim(),
        recurring: formData.recurring,
        frequency: formData.frequency,
      });
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Eroare la salvare' });
    } finally {
      setIsLoading(false);
    }
  }, [formData, isLoading, validateForm, onSave]);

  // Handle delete with simple confirmation
  const handleDelete = useCallback(async () => {
    if (!onDelete || isLoading) return;

    if (!window.confirm('Ștergi această tranzacție?')) return;

    setIsLoading(true);
    try {
      await onDelete();
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Eroare la ștergere' });
    } finally {
      setIsLoading(false);
    }
  }, [onDelete, isLoading]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const target = e.target as HTMLElement;
        if (target?.tagName?.toLowerCase() === 'textarea') return;
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, onCancel]);

  // Update form data helper
  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear related errors
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(updates).forEach(key => {
        delete newErrors[key];
      });
      return newErrors;
    });
  }, []);

  // Outside click handler
  const handleOutsideClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  return (
    <div 
      className={modal({ variant: "default" })}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleOutsideClick}
      data-testid="quick-add-modal"
    >
      <div 
        className={cn(
          card({ variant: "elevated" }),
          "max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto",
          "animate-theme-fade bg-background dark:bg-surface-dark"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral/20 dark:border-neutral-600/30">
          <div className="flex items-center justify-between">
            <h2 
              id="modal-title"
              className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
            >
              {mode === 'edit' ? EXCEL_GRID.ACTIONS.EDIT_TRANSACTION : EXCEL_GRID.ACTIONS.ADD_TRANSACTION}
            </h2>
            <button
              className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              onClick={onCancel}
              data-testid="modal-close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Context */}
          <div className="mb-4 p-3 rounded-lg bg-neutral/5 dark:bg-neutral-600/10 border border-neutral/20">
            <div className="text-sm">
              <div className="font-medium text-neutral-900 dark:text-neutral-100">
                {cellContext.category}
                {cellContext.subcategory && ` → ${cellContext.subcategory}`}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {cellContext.day}/{cellContext.month}/{cellContext.year}
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <Input
              ref={amountInputRef}
              label={`${LABELS.AMOUNT} (RON)`}
              type="text"
              value={formData.amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
                  updateFormData({ amount: value });
                }
              }}
              error={errors.amount}
              placeholder={PLACEHOLDERS.AMOUNT_PLACEHOLDER}
              data-testid="amount-input"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <Textarea
              label={LABELS.DESCRIPTION}
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              error={errors.description}
              placeholder={PLACEHOLDERS.DESCRIPTION}
              rows={2}
              data-testid="description-input"
            />
          </div>

          {/* Recurring */}
          <div className="mb-4">
            <Checkbox
              label={LABELS.RECURRING}
              checked={formData.recurring}
              onChange={(e) => {
                const checked = e.target.checked;
                updateFormData({ recurring: checked });
                setShowRecurring(checked);
                if (!checked) {
                  updateFormData({ frequency: undefined });
                }
              }}
              data-testid="recurring-checkbox"
            />
          </div>

          {/* Frequency */}
          {showRecurring && (
            <div className="mb-4 pl-6 border-l-2 border-blue-200">
              <Select
                label={LABELS.FREQUENCY}
                value={formData.frequency || ""}
                onChange={(e) => updateFormData({ frequency: e.target.value as FrequencyType })}
                options={OPTIONS.FREQUENCY}
                error={errors.frequency}
                placeholder={`${PLACEHOLDERS.SELECT} ${LABELS.FREQUENCY.toLowerCase()}`}
                data-testid="frequency-select"
              />
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {errors.general}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral/20 dark:border-neutral-600/30 flex justify-between">
          {/* Delete Button (if edit mode) */}
          {mode === 'edit' && onDelete && (
            <Button
              variant="danger"
              size="xs"
              onClick={handleDelete}
              disabled={isLoading}
              data-testid="delete-button"
            >
              {isLoading ? BUTTONS.LOADING : BUTTONS.DELETE}
            </Button>
          )}

          {/* Save/Cancel Buttons */}
          <div className={cn("flex space-x-3", mode === 'edit' && onDelete ? "" : "ml-auto")}>
            <Button
              variant="secondary"
              size="xs"
              onClick={onCancel}
              disabled={isLoading}
              data-testid="cancel-button"
            >
              {BUTTONS.CANCEL}
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={handleSave}
              disabled={isLoading || !formData.amount}
              data-testid="save-button"
            >
              {isLoading ? BUTTONS.LOADING : `${EXCEL_GRID.ACTIONS.SAVE_CHANGES} (Enter)`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

QuickAddModalSimplified.displayName = 'QuickAddModalSimplified';

export default QuickAddModalSimplified; 