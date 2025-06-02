import React, { useState, useCallback, useEffect } from "react";
import Button from "../../../primitives/Button/Button";
import Input from "../../../primitives/Input/Input";
import Textarea from "../../../primitives/Textarea/Textarea";
import Checkbox from "../../../primitives/Checkbox/Checkbox";
import Select from "../../../primitives/Select/Select";
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

// Quick Add Modal Props
export interface QuickAddModalProps {
  cellContext: CellContext;
  prefillAmount?: string;
  autoFocus?: boolean;
  mode?: 'add' | 'edit';
  position?: { top: number; left: number };
  onSave: (data: {
    amount: string;
    description: string;
    recurring: boolean;
    frequency?: FrequencyType;
  }) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
}

// Quick Add Modal Component
export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  cellContext,
  prefillAmount = "",
  autoFocus = true,
  mode = 'add',
  position,
  onSave,
  onCancel,
  onDelete,
}) => {
  // Base modal logic integration
  const { form, validation, loading, calculations } =
    useBaseModalLogic(cellContext);

  // Local state pentru modal-specific logic
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);

  // Initialize form cu prefilled amount doar la primul render
  useEffect(() => {
    if (prefillAmount && !form.data.amount) {
      form.updateData({ amount: prefillAmount });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillAmount]); // Eliminat form din dependințe pentru a preveni bucla infinită

  // Handle save action
  const handleSave = useCallback(async () => {
    if (!form.validate()) {
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
      validation.setErrors({
        general: "Eroare la salvarea tranzacției. Încercați din nou.",
      });
    } finally {
      loading.setIsLoading(false);
    }
  }, [form, loading, validation, onSave]);

  // LGI TASK 5: Handler pentru delete action
  const handleDelete = useCallback(async () => {
    if (!onDelete) return;

    const confirmed = window.confirm("Sigur doriți să ștergeți această tranzacție? Acțiunea nu poate fi anulată.");
    if (!confirmed) return;

    loading.setIsLoading(true);

    try {
      await onDelete();
      // Modal se închide automat după delete success
    } catch (error) {
      validation.setErrors({
        general: "Eroare la ștergerea tranzacției. Încercați din nou.",
      });
    } finally {
      loading.setIsLoading(false);
    }
  }, [onDelete, loading, validation]);

  // Handle keyboard shortcuts
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
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, onCancel]);

  // Calculate financial impact preview
  const financialImpact = form.data.amount
    ? calculations.calculateFinancialImpact(Number(form.data.amount))
    : null;

  return (
    <div 
      className={position ? "fixed inset-0 z-50 pointer-events-none" : transactionModalOverlay({ blur: false })}
    >
      <div 
        className={position 
          ? "pointer-events-auto bg-white rounded-lg shadow-xl border border-slate-200 w-80 max-h-96 overflow-hidden transform transition-all duration-200"
          : transactionModalContent({ mode: "quick-add" })
        }
        style={position ? {
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 50,
        } : undefined}
      >
        {/* Modal Header - foarte compact pentru pozitionat */}
        {position ? (
          // Header minimal pentru modal poziționat
          <div className="px-3 py-1 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">
              {mode === 'edit' ? EXCEL_GRID.ACTIONS.EDIT_TRANSACTION : EXCEL_GRID.ACTIONS.ADD_TRANSACTION}
            </span>
            <button
              className="text-slate-400 hover:text-slate-600 text-sm p-1"
              onClick={onCancel}
              data-testid="quick-add-modal-close"
            >
              ✕
            </button>
          </div>
        ) : (
          // Header normal pentru modal centrat
          <div className={transactionModalHeader({ variant: "primary" })}>
            <h2 className={transactionModalTitle({ variant: "primary" })}>
              {mode === 'edit' ? EXCEL_GRID.ACTIONS.EDIT_TRANSACTION : EXCEL_GRID.ACTIONS.ADD_TRANSACTION}
            </h2>
            <button
              className={transactionModalCloseButton()}
              onClick={onCancel}
              data-testid="quick-add-modal-close"
            >
              ✕
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className={position 
          ? "px-3 py-2 space-y-2 overflow-y-auto"
          : transactionModalBody()
        }>
          {/* Context Info */}
          <div className={position 
            ? "text-xs text-slate-600 bg-blue-50 p-1.5 rounded"
            : "text-sm text-slate-600 bg-blue-50 p-3 rounded-md"
          }>
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
              label={position ? LABELS.AMOUNT : `${LABELS.AMOUNT} (RON)`}
              type="text"
              value={form.data.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                form.updateData({ amount: e.target.value })
              }
              error={validation.errors.amount}
              autoFocus={autoFocus}
              data-testid="quick-add-amount-input"
              placeholder="0.00"
              pattern="[0-9]+([,.][0-9]{1,2})?"
              size={position ? "sm" : "md"}
            />
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
            <div className={position ? "pl-3 border-l border-blue-200" : "pl-6 border-l-2 border-blue-200"}>
              <Select
                label={position ? "Frecv." : LABELS.FREQUENCY}
                value={form.data.frequency || ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  form.updateData({ frequency: e.target.value })
                }
                options={OPTIONS.FREQUENCY}
                error={validation.errors.frequency}
                data-testid="quick-add-frequency-select"
                placeholder={position ? PLACEHOLDERS.SELECT : `${PLACEHOLDERS.SELECT} ${LABELS.FREQUENCY.toLowerCase()}`}
                size={position ? "sm" : "md"}
              />
            </div>
          )}
          {/* Financial Impact Preview */}
          {financialImpact && (
            <div className={position 
              ? "bg-slate-50 p-1.5 rounded text-xs"
              : "bg-slate-50 p-3 rounded-md text-sm"
            }>
              <div className="flex justify-between items-center">
                <span>{position ? "Impact:" : "Impact financiar:"}</span>
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
          ? "px-3 py-1.5 border-t border-slate-200 bg-slate-50 flex justify-between items-center"
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
            >
              {loading.isLoading 
                ? BUTTONS.LOADING 
                : (position ? "OK" : `${EXCEL_GRID.ACTIONS.SAVE_CHANGES} (Enter)`)
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
