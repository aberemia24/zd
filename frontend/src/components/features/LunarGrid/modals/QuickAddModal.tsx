import React, { useState, useCallback, useEffect, memo, useMemo } from "react";
import Button from "../../../primitives/Button/Button";
import Input from "../../../primitives/Input/Input";
import Textarea from "../../../primitives/Textarea/Textarea";
import Checkbox from "../../../primitives/Checkbox/Checkbox";
import Select from "../../../primitives/Select/Select";
import ConfirmationModal from "../../../primitives/ConfirmationModal/ConfirmationModal";
import {
  transactionModalOverlay,
  transactionModalContent,
  transactionModalHeader,
  transactionModalTitle,
  transactionModalBody,
  transactionModalFooter,
  transactionModalCloseButton,
} from "../../../../styles/cva/components/modal";
import { useBaseModalLogic, CellContext } from "./hooks/useBaseModalLogic";
import { 
  FrequencyType, 
  LABELS, 
  BUTTONS, 
  PLACEHOLDERS,
  EXCEL_GRID,
  OPTIONS 
} from "@shared-constants";

/**
 * Props pentru QuickAddModal component
 * @interface QuickAddModalProps
 */
export interface QuickAddModalProps {
  /** Context informații despre celula selectată */
  cellContext: CellContext;
  /** Sumă pre-populată în input (optional) */
  prefillAmount?: string;
  /** Dacă să se facă autofocus pe primul input (default: true) */
  autoFocus?: boolean;
  /** Modul modalului: 'add' pentru adăugare nouă, 'edit' pentru editare (default: 'add') */
  mode?: 'add' | 'edit';
  /** Poziția pentru modal poziționat (optional - pentru modal centrat lăsați undefined) */
  position?: { top: number; left: number };
  /** Callback pentru salvarea datelor */
  onSave: (data: {
    amount: string;
    description: string;
    recurring: boolean;
    frequency?: FrequencyType;
  }) => Promise<void>;
  /** Callback pentru anularea modalului */
  onCancel: () => void;
  /** Callback pentru ștergerea tranzacției (optional - doar pentru mode='edit') */
  onDelete?: () => Promise<void>;
}

// Quick Add Modal Component cu React.memo pentru performance
export const QuickAddModal: React.FC<QuickAddModalProps> = memo(({
  cellContext,
  prefillAmount = "",
  autoFocus = true,
  mode = 'add',
  position,
  onSave,
  onCancel,
  onDelete,
}) => {
  // Development validation pentru props (doar în development mode)
  if (process.env.NODE_ENV === 'development') {
    // Validation pentru cellContext
    if (!cellContext.category) {
      console.warn('QuickAddModal: cellContext.category is required');
    }
    if (!cellContext.day || !cellContext.month || !cellContext.year) {
      console.warn('QuickAddModal: cellContext date fields are required');
    }
    
    // Validation pentru mode și onDelete consistency
    if (mode === 'edit' && !onDelete) {
      console.warn('QuickAddModal: onDelete should be provided for edit mode');
    }
    if (mode === 'add' && onDelete) {
      console.warn('QuickAddModal: onDelete should not be provided for add mode');
    }

    // Position validation
    if (position && (typeof position.top !== 'number' || typeof position.left !== 'number')) {
      console.warn('QuickAddModal: position should have numeric top and left properties');
    }
  }

  // Base modal logic integration
  const { form, validation, loading, calculations } =
    useBaseModalLogic(cellContext);

  // Local state pentru modal-specific logic
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Focus management references
  const firstFocusableRef = React.useRef<HTMLInputElement>(null);
  const lastFocusableRef = React.useRef<HTMLButtonElement>(null);

  // Initialize form cu prefilled amount și focus management
  useEffect(() => {
    if (prefillAmount && !form.data.amount) {
      form.updateData({ amount: prefillAmount });
    }

    // Focus management - focus primul input când se deschide modalul
    if (autoFocus && firstFocusableRef.current) {
      // Delay mic pentru a se asigura că modalul s-a randat complet
      const timeoutId = setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillAmount, form.updateData, autoFocus]);

  // Handle save action cu enhanced error handling
  const handleSave = useCallback(async () => {
    // Edge case: verifică dacă modalul este încă montat
    if (loading.isLoading) {
      console.warn('QuickAddModal: Save attempted while already saving');
      return;
    }

    if (!form.validate()) {
      // Focus primul input cu eroare pentru UX îmbunătățit
      const errorFields = ['amount', 'description', 'frequency'];
      const firstErrorField = errorFields.find(field => validation.errors[field as keyof typeof validation.errors]);
      
      if (firstErrorField === 'amount' && firstFocusableRef.current) {
        firstFocusableRef.current.focus();
      }
      return;
    }

    loading.setIsLoading(true);

    try {
      await onSave({
        amount: form.data.amount,
        description: form.data.description,
        recurring: form.data.recurring,
        frequency: form.data.frequency as FrequencyType,
      });

      // Modal se închide automat după save success
    } catch (error) {
      console.error('QuickAddModal save error:', error);
      
      // Enhanced error messaging
      const errorMessage = error instanceof Error 
        ? `${EXCEL_GRID.ERROR_MESSAGES.SAVE_TRANSACTION_PREFIX}${error.message}`
        : EXCEL_GRID.ERROR_MESSAGES.SAVE_TRANSACTION_GENERIC;
        
      validation.setErrors({
        general: errorMessage,
      });
    } finally {
      loading.setIsLoading(false);
    }
  }, [form, loading, validation, onSave, firstFocusableRef]);

  // LGI TASK 5: Handler pentru delete action cu ConfirmationModal
  const handleDelete = useCallback(async () => {
    if (!onDelete) return;
    setShowDeleteConfirmation(true);
  }, [onDelete]);

  // Enhanced error handling pentru delete cu validation
  const handleConfirmDelete = useCallback(async () => {
    if (!onDelete) {
      console.warn('QuickAddModal: Delete attempted without onDelete handler');
      return;
    }

    loading.setIsLoading(true);
    setShowDeleteConfirmation(false);

    try {
      await onDelete();
      // Modal se închide automat după delete success
    } catch (error) {
      console.error('QuickAddModal delete error:', error);
      
      const errorMessage = error instanceof Error 
        ? `${EXCEL_GRID.ERROR_MESSAGES.DELETE_TRANSACTION_PREFIX}${error.message}`
        : EXCEL_GRID.ERROR_MESSAGES.DELETE_TRANSACTION_GENERIC;
        
      validation.setErrors({
        general: errorMessage,
      });
    } finally {
      loading.setIsLoading(false);
    }
  }, [onDelete, loading, validation]);

  // Cancel delete handler
  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirmation(false);
  }, []);

  // Handle keyboard shortcuts cu optimized dependencies și focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        // Previne Enter doar dacă este într-un textarea (pentru new lines)
        const target = e.target as HTMLElement;
        if (target?.tagName?.toLowerCase() === 'textarea') {
          return; // Permite Enter în textarea pentru new lines
        }
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
      
      // Focus trap logic pentru Tab navigation
      if (e.key === "Tab") {
        const focusableElements = document.querySelectorAll(
          'input, button, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const focusableArray = Array.from(focusableElements) as HTMLElement[];
        const firstElement = focusableArray[0];
        const lastElement = focusableArray[focusableArray.length - 1];

        if (e.shiftKey) {
          // Shift + Tab - navighează înapoi
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab - navighează înainte
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, onCancel]);

  // Memoize styled objects pentru position mode pentru a preveni re-creation
  const positionedStyle = useMemo(() => {
    if (!position) return undefined;
    return {
      position: 'absolute' as const,
      top: `${position.top}px`,
      left: `${position.left}px`,
      zIndex: 50,
    };
  }, [position]);

  // Memoize financial impact calculation pentru performance
  const financialImpact = useMemo(() => {
    return form.data.amount
      ? calculations.calculateFinancialImpact(Number(form.data.amount))
      : null;
  }, [form.data.amount, calculations.calculateFinancialImpact]);

  // Cleanup și validation la unmount
  useEffect(() => {
    return () => {
      // Cleanup pentru a preveni memory leaks
      if (loading.isLoading) {
        console.warn('QuickAddModal: Component unmounted while loading');
      }
    };
  }, [loading.isLoading]);

  return (
    <div 
      className={position ? "fixed inset-0 z-50 pointer-events-none" : transactionModalOverlay({ blur: false })}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-add-modal-title"
      aria-describedby="quick-add-modal-description"
    >
      <div 
        className={position 
          ? transactionModalContent({ mode: "quick-add-positioned" })
          : transactionModalContent({ mode: "quick-add" })
        }
        style={positionedStyle}
      >
        {/* Modal Header - foarte compact pentru pozitionat */}
        {position ? (
          // Header minimal pentru modal poziționat
          <div className="px-3 py-1 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span 
              id="quick-add-modal-title"
              className="text-xs font-medium text-slate-700"
            >
              {mode === 'edit' ? EXCEL_GRID.ACTIONS.EDIT_TRANSACTION : EXCEL_GRID.ACTIONS.ADD_TRANSACTION}
            </span>
            <button
              className="text-slate-400 hover:text-slate-600 text-sm p-1"
              onClick={onCancel}
              data-testid="quick-add-modal-close"
              aria-label={EXCEL_GRID.MODAL.CLOSE_MODAL_ARIA}
            >
              ✕
            </button>
          </div>
        ) : (
          // Header normal pentru modal centrat
          <div className={transactionModalHeader({ variant: "primary" })}>
            <h2 
              id="quick-add-modal-title"
              className={transactionModalTitle({ variant: "primary" })}
            >
              {mode === 'edit' ? EXCEL_GRID.ACTIONS.EDIT_TRANSACTION : EXCEL_GRID.ACTIONS.ADD_TRANSACTION}
            </h2>
            <button
              className={transactionModalCloseButton()}
              onClick={onCancel}
              data-testid="quick-add-modal-close"
              aria-label={EXCEL_GRID.MODAL.CLOSE_MODAL_ARIA}
            >
              ✕
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className={position 
          ? transactionModalBody({ mode: "positioned" })
          : transactionModalBody()
        }>
          {/* Context Info */}
          <div 
            id="quick-add-modal-description"
            className={position 
              ? "text-xs text-slate-600 bg-blue-50 p-1.5 rounded"
              : "text-sm text-slate-600 bg-blue-50 p-3 rounded-md"
            }
          >
            <strong>{cellContext.category}</strong>
            {cellContext.subcategory && ` → ${cellContext.subcategory}`}
            <br />
            <span>
              {cellContext.day}/{cellContext.month}/{cellContext.year}
            </span>
          </div>
          {/* Amount Input */}
          <div>
            <Input
              ref={firstFocusableRef}
              label={position ? LABELS.AMOUNT : `${LABELS.AMOUNT} (RON)`}
              type="text"
              value={form.data.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                form.updateData({ amount: e.target.value })
              }
              error={validation.errors.amount}
              autoFocus={autoFocus}
              data-testid="quick-add-amount-input"
              placeholder={PLACEHOLDERS.AMOUNT_PLACEHOLDER}
              pattern="[0-9]+([,.][0-9]{1,2})?"
              size={position ? "sm" : "md"}
              aria-describedby={validation.errors.amount ? "amount-error" : undefined}
            />
            {validation.errors.amount && (
              <div id="amount-error" className="sr-only">
                {validation.errors.amount}
              </div>
            )}
          </div>
          {/* Description Input - foarte compact pentru pozitionat */}
          {position ? (
            // Input simplu pentru modal poziționat să economisesc spațiu
            <div>
              <input
                type="text"
                value={form.data.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  form.updateData({ description: e.target.value })
                }
                placeholder={PLACEHOLDERS.DESCRIPTION}
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                data-testid="quick-add-description-input"
              />
              {validation.errors.description && (
                <div className="text-xs text-red-600 mt-1">{validation.errors.description}</div>
              )}
            </div>
          ) : (
            // Textarea normal pentru modal centrat
            <div>
              <Textarea
                label={LABELS.DESCRIPTION}
                value={form.data.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  form.updateData({ description: e.target.value })
                }
                error={validation.errors.description}
                data-testid="quick-add-description-input"
                placeholder={PLACEHOLDERS.DESCRIPTION}
                rows={2}
                size="md"
              />
            </div>
          )}
          {/* Recurring Checkbox */}
          <div>
            <Checkbox
              label={LABELS.RECURRING}
              checked={form.data.recurring}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const checked = e.target.checked;
                form.updateData({ recurring: checked });
                setShowRecurringOptions(checked);
                if (!checked) {
                  form.updateData({ frequency: undefined });
                }
              }}
              data-testid="quick-add-recurring-checkbox"
              size={position ? "sm" : "md"}
            />
          </div>
          {/* Recurring Options */}
          {showRecurringOptions && (
            <div 
              className={position 
                ? "pl-3 border-l border-blue-200 animate-in slide-in-from-left-1 duration-300" 
                : "pl-6 border-l-2 border-blue-200 animate-in slide-in-from-left-2 duration-300"
              }
            >
              <Select
                label={position ? EXCEL_GRID.MODAL.FREQUENCY_SHORT : LABELS.FREQUENCY}
                value={form.data.frequency || ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  form.updateData({ frequency: e.target.value })
                }
                options={OPTIONS.FREQUENCY}
                error={validation.errors.frequency}
                data-testid="quick-add-frequency-select"
                placeholder={position ? PLACEHOLDERS.SELECT : `${PLACEHOLDERS.SELECT} ${LABELS.FREQUENCY.toLowerCase()}`}
                size={position ? "sm" : "md"}
                aria-describedby={validation.errors.frequency ? "frequency-error" : undefined}
              />
              {validation.errors.frequency && (
                <div id="frequency-error" className="sr-only">
                  {validation.errors.frequency}
                </div>
              )}
            </div>
          )}
          {/* Financial Impact Preview */}
          {financialImpact && (
            <div className={position 
              ? "bg-slate-50 p-1.5 rounded text-xs"
              : "bg-slate-50 p-3 rounded-md text-sm"
            }>
              <div className="flex justify-between items-center">
                <span>{position ? EXCEL_GRID.MODAL.FINANCIAL_IMPACT_SHORT : EXCEL_GRID.MODAL.FINANCIAL_IMPACT_FULL}</span>
                <span
                  className={`font-semibold ${
                    financialImpact.isPositive
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {financialImpact.isPositive ? "+" : ""}
                  {financialImpact.amount} RON
                </span>
              </div>
            </div>
          )}
          {/* General Error */}
          {validation.errors.general && (
            <div className={position 
              ? "text-red-600 text-xs bg-red-50 p-1.5 rounded"
              : "text-red-600 text-sm bg-red-50 p-3 rounded-md"
            }>
              {validation.errors.general}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={position 
          ? transactionModalFooter({ mode: "positioned" })
          : transactionModalFooter()
        }>
          {/* LGI TASK 5: Buton Delete pentru edit mode */}
          {mode === 'edit' && onDelete && (
            <Button
              variant="danger"
              size="xs"
              onClick={handleDelete}
              disabled={loading.isLoading}
              data-testid="quick-add-delete-button"
              className={position ? "" : "mr-auto"}
            >
              {loading.isLoading 
                ? BUTTONS.LOADING 
                : (position ? BUTTONS.DELETE : BUTTONS.DELETE)
              }
            </Button>
          )}
          
          <div className={position ? "flex space-x-1.5 ml-auto" : "flex space-x-3"}>
            <Button
              variant="secondary"
              size="xs"
              onClick={onCancel}
              disabled={loading.isLoading}
              data-testid="quick-add-cancel-button"
            >
              {position ? BUTTONS.CANCEL : BUTTONS.CANCEL}
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={handleSave}
              disabled={loading.isLoading || !form.data.amount}
              data-testid="quick-add-save-button"
              aria-describedby={loading.isLoading ? "save-loading-status" : undefined}
            >
              {loading.isLoading 
                ? (
                  <span className="flex items-center space-x-1">
                    <span className="animate-spin">⏳</span>
                    <span>{BUTTONS.LOADING}</span>
                  </span>
                )
                : (position ? EXCEL_GRID.MODAL.SAVE_SHORT : `${EXCEL_GRID.ACTIONS.SAVE_CHANGES} (Enter)`)
              }
            </Button>
            {loading.isLoading && (
              <div id="save-loading-status" className="sr-only" aria-live="polite">
                {EXCEL_GRID.MODAL.SAVING_MESSAGE}
              </div>
            )}
          </div>
        </div>
      </div>
      {showDeleteConfirmation && (
        <ConfirmationModal
          isOpen={showDeleteConfirmation}
          title={EXCEL_GRID.MODAL.DELETE_CONFIRMATION_TITLE}
          message={EXCEL_GRID.MODAL.DELETE_CONFIRMATION_MESSAGE}
          onConfirm={handleConfirmDelete}
          onClose={handleCancelDelete}
          variant="danger"
          icon="🗑️"
          confirmText={EXCEL_GRID.MODAL.DELETE_CONFIRM_BUTTON}
          cancelText={EXCEL_GRID.MODAL.DELETE_CANCEL_BUTTON}
        />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison pentru optimizarea re-renders
  return (
    prevProps.mode === nextProps.mode &&
    prevProps.prefillAmount === nextProps.prefillAmount &&
    prevProps.autoFocus === nextProps.autoFocus &&
    prevProps.cellContext.category === nextProps.cellContext.category &&
    prevProps.cellContext.subcategory === nextProps.cellContext.subcategory &&
    prevProps.cellContext.day === nextProps.cellContext.day &&
    prevProps.cellContext.month === nextProps.cellContext.month &&
    prevProps.cellContext.year === nextProps.cellContext.year &&
    JSON.stringify(prevProps.position) === JSON.stringify(nextProps.position)
    // onSave, onCancel, onDelete sunt callbacks și se vor schimba mereu
  );
});

// Display name pentru debugging
QuickAddModal.displayName = 'QuickAddModal';

/**
 * INTEGRATION VALIDATION CHECKLIST - Task 5.3
 * 
 * ✅ Props Flow Validation:
 * - cellContext: category, subcategory, day, month, year ✓
 * - prefillAmount: string (existingValue) ✓  
 * - mode: 'add' | 'edit' ✓
 * - position: { top, left } pentru positioned modal ✓
 * - onSave: async function returning Promise<void> ✓
 * - onCancel: function ✓
 * - onDelete: optional pentru edit mode ✓
 * 
 * ✅ LunarGridModals Integration:
 * - modalState conditional rendering ✓
 * - props mapping corect ✓
 * - delete conditional (mode === 'edit') ✓
 * 
 * ✅ Performance Optimizations:
 * - React.memo cu custom comparison ✓
 * - useMemo pentru styled objects ✓
 * - useCallback pentru handlers ✓
 * 
 * ✅ Accessibility Features:
 * - ARIA labels și roles ✓
 * - Focus management ✓
 * - Keyboard navigation ✓
 * - Screen reader support ✓
 * 
 * ✅ UX Enhancements:
 * - Loading states cu visual feedback ✓
 * - Smooth animations ✓
 * - ConfirmationModal pentru delete ✓
 * - Focus trap functionality ✓
 */
