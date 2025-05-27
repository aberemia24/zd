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
import { FrequencyType } from "@shared-constants";

// Quick Add Modal Props
export interface QuickAddModalProps {
  cellContext: CellContext;
  prefillAmount?: string;
  autoFocus?: boolean;
  onSave: (data: {
    amount: string;
    description: string;
    recurring: boolean;
    frequency?: FrequencyType;
  }) => Promise<void>;
  onCancel: () => void;
}

// Quick Add Modal Component
export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  cellContext,
  prefillAmount = "",
  autoFocus = true,
  onSave,
  onCancel,
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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
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

  // Frequency options pentru recurring
  const frequencyOptions = [
    { value: "DAILY", label: "Zilnic" },
    { value: "WEEKLY", label: "Săptămânal" },
    { value: "MONTHLY", label: "Lunar" },
    { value: "YEARLY", label: "Anual" },
  ];

  return (
    <div className={transactionModalOverlay({ blur: true })}>
      <div className={transactionModalContent({ mode: "quick-add" })}>
        {/* Modal Header */}
        <div className={transactionModalHeader({ variant: "primary" })}>
          <h2 className={transactionModalTitle({ variant: "primary" })}>
            Adaugă Tranzacție Rapidă
          </h2>
          <button
            className={transactionModalCloseButton()}
            onClick={onCancel}
            data-testid="quick-add-modal-close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className={transactionModalBody()}>
          {/* Context Info */}
          <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-md">
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
              label="Sumă (RON)"
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
            />
          </div>
          {/* Description Input */}
          <div>
            <Textarea
              label="Descriere (opțional)"
              value={form.data.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                form.updateData({ description: e.target.value })
              }
              error={validation.errors.description}
              data-testid="quick-add-description-input"
              placeholder="Detalii despre tranzacție..."
              rows={2}
            />
          </div>
          {/* Recurring Checkbox */}{" "}
          <div>
            {" "}
            <Checkbox
              label="Tranzacție recurentă"
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
            />{" "}
          </div>{" "}
          {/* Recurring Options */}{" "}
          {showRecurringOptions && (
            <div className="pl-6 border-l-2 border-blue-200">
              {" "}
              <Select
                label="Frecvență"
                value={form.data.frequency || ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  form.updateData({ frequency: e.target.value })
                }
                options={frequencyOptions}
                error={validation.errors.frequency}
                data-testid="quick-add-frequency-select"
                placeholder="Selectează frecvența"
              />{" "}
            </div>
          )}
          {/* Financial Impact Preview */}
          {financialImpact && (
            <div className="bg-slate-50 p-3 rounded-md text-sm">
              <div className="flex justify-between items-center">
                <span>Impact financiar:</span>
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
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {validation.errors.general}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={transactionModalFooter()}>
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading.isLoading}
            data-testid="quick-add-cancel-button"
          >
            Anulează
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading.isLoading || !form.data.amount}
            data-testid="quick-add-save-button"
          >
            {loading.isLoading ? "Salvează..." : "Salvează (Ctrl+Enter)"}
          </Button>
        </div>
      </div>
    </div>
  );
};
