import React, { useState, useCallback, useMemo } from "react";
import { TransactionType } from "@shared-constants";

// CVA styling imports
import { 
  cn,
  modal,
  button,
  input,
  select,
  textarea,
  checkbox,
  label,
  inputWrapper,
  spaceY,
  flexLayout
} from "../../../../styles/cva-v2";

/**
 * TransactionModal pentru LunarGrid - Phase 2.2
 * Enhanced version cu CVA styling system integration
 *
 * Features:
 * ✅ CVA Modal variants cu professional styling
 * ✅ CVA Form components cu consistent design language
 * ✅ Professional Blue theme integration
 * ✅ Enhanced accessibility cu proper focus management
 * ✅ Error states cu visual feedback
 * ✅ Keyboard shortcuts (Esc, Ctrl+Enter)
 */

export interface CellPosition {
  category: string;
  subcategory?: string;
  day: number;
  rowIndex: number;
  colIndex: number;
}

export interface TransactionData {
  id?: string;
  amount: number;
  type: TransactionType;
  description: string;
  isRecurring: boolean;
  category: string;
  subcategory?: string;
  date: string;
}

export interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  cellPosition: CellPosition;
  date: string;
  existingTransaction?: TransactionData;
  onSave: (transaction: Omit<TransactionData, "id">) => Promise<void>;
  isLoading?: boolean;
  mode?: "add" | "edit";
}

const TransactionModalComponent: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  cellPosition,
  date,
  existingTransaction,
  onSave,
  isLoading = false,
  mode = "add",
}) => {
  // Form state
  const [amount, setAmount] = useState<string>(
    existingTransaction?.amount?.toString() || "",
  );
  const [transactionType, setTransactionType] = useState<TransactionType>(
    existingTransaction?.type || TransactionType.EXPENSE,
  );
  const [description, setDescription] = useState<string>(
    existingTransaction?.description || "",
  );
  const [isRecurring, setIsRecurring] = useState<boolean>(
    existingTransaction?.isRecurring || false,
  );

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  // Form validation
  const validateForm = useCallback(() => {
    const numericAmount = parseFloat(amount);

    if (!amount || amount.trim() === "") {
      setValidationError("Suma este obligatorie");
      return false;
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setValidationError("Suma trebuie să fie un număr pozitiv");
      return false;
    }

    setValidationError("");
    return true;
  }, [amount]);

  // Form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const transactionData: Omit<TransactionData, "id"> = {
          amount: parseFloat(amount),
          type: transactionType,
          description: description.trim(),
          isRecurring,
          category: cellPosition.category,
          subcategory: cellPosition.subcategory,
          date,
        };

        await onSave(transactionData);
        onClose();
      } catch (error) {
        console.error("Transaction save error:", error);
        setValidationError("Eroare la salvarea tranzacției. Încearcă din nou.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      amount,
      transactionType,
      description,
      isRecurring,
      cellPosition,
      date,
      onSave,
      onClose,
      validateForm,
    ],
  );

  // Keyboard handling
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // Convertim keyboard event într-un form event pentru handleSubmit
        const syntheticFormEvent = {
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation(),
          currentTarget: e.currentTarget,
          target: e.target,
        } as React.FormEvent<HTMLFormElement>;
        handleSubmit(syntheticFormEvent);
      }
    },
    [onClose, handleSubmit],
  );

  // Modal background click handler
  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  // Memoized computations pentru performance
  const modalTitle = useMemo(() => 
    mode === "edit" ? "Editează Tranzacție" : "Adaugă Tranzacție", 
    [mode]
  );
  
  const hasError = useMemo(() => !!validationError, [validationError]);
  
  const formattedDate = useMemo(() => 
    new Date(date).toLocaleDateString("ro-RO"), 
    [date]
  );
  
  const categoryDisplay = useMemo(() => 
    `${cellPosition.category}${cellPosition.subcategory ? ` → ${cellPosition.subcategory}` : ''}`,
    [cellPosition.category, cellPosition.subcategory]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(modal({ variant: "default" }), "p-4")}
      onClick={handleBackgroundClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-modal-title"
    >
      <div
        className={cn(
          "bg-white dark:bg-surface-dark rounded-lg shadow-xl max-w-md w-full mx-auto relative"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading overlay cu CVA styling */}
        {isLoading && (
          <div className={cn("absolute inset-0 bg-white/80 dark:bg-surface-dark/80 z-10 rounded-lg", flexLayout({ direction: "col", justify: "center", align: "center" }))}>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary dark:border-primary-400"></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={cn("p-6", spaceY({ spacing: 6 }))}>
          {/* Modal Header */}
          <div className="border-b border-neutral/20 dark:border-neutral-600/30 pb-4">
            <h2
              id="transaction-modal-title"
              className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
            >
              {modalTitle}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {categoryDisplay} • {formattedDate}
            </p>
          </div>

          {/* Form Fields cu CVA styling */}
          <div className={spaceY({ spacing: 4 })}>
            {/* Amount Input */}
            <div className={cn(inputWrapper())}>
              <label
                className={cn(label({ 
                  variant: hasError ? "error" : "default",
                  required: true 
                }))}
                htmlFor="amount-input"
              >
                Sumă (RON)
              </label>
              <input
                id="amount-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
                autoFocus
                className={cn(input({
                  variant: hasError ? "default" : "default",
                }))}
                aria-describedby={hasError ? "amount-error" : undefined}
                data-testid="transaction-amount-input"
              />
              {hasError && (
                <p id="amount-error" className="text-sm text-warning dark:text-warning-400 mt-1">
                  {validationError}
                </p>
              )}
            </div>

            {/* Transaction Type Select */}
            <div className={cn(inputWrapper())}>
              <label
                className={cn(label({ required: true }))}
                htmlFor="type-select"
              >
                Tip Tranzacție
              </label>
              <select
                id="type-select"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                className={cn(select({ variant: "default" }))}
                data-testid="transaction-type-select"
              >
                <option value="cheltuieli">Cheltuieli</option>
                <option value="venituri">Venituri</option>
              </select>
            </div>

            {/* Description Textarea */}
            <div className={cn(inputWrapper())}>
              <label 
                className={cn(label())}
                htmlFor="description-textarea"
              >
                Descriere
              </label>
              <textarea
                id="description-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalii opționale despre tranzacție..."
                rows={2}
                maxLength={200}
                className={cn(textarea({ variant: "default", size: "sm" }))}
                data-testid="transaction-description"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {description.length}/200 caractere
              </p>
            </div>

            {/* Recurring Checkbox */}
            <div className={flexLayout({ direction: "row", align: "start", gap: 3 })}>
              <input
                id="recurring-checkbox"
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className={cn(checkbox({ variant: "default", size: "md" }))}
                data-testid="transaction-recurring"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="recurring-checkbox"
                  className={cn(label())}
                >
                  Tranzacție recurentă
                </label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Se va repeta automat în lunile următoare
                </p>
              </div>
            </div>
          </div>

          {/* Modal Actions cu CVA button styling */}
          <div className="flex gap-3 justify-end pt-4 border-t border-neutral/20 dark:border-neutral-600/30">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={cn(
                button({
                  variant: "secondary",
                  size: "md",
                }),
              )}
              data-testid="transaction-cancel-button"
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={!amount || isSubmitting || hasError}
              className={cn(
                button({
                  variant: "primary",
                  size: "md",
                }),
              )}
              data-testid="transaction-save-button"
            >
              {isSubmitting ? "Salvează..." : "Salvează"}
            </button>
          </div>
        </form>

        {/* Keyboard shortcuts hint */}
        <div className="px-6 pb-4 text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral/10 dark:border-neutral-600/20">
          <span className="font-mono">Esc</span> pentru anulare •
          <span className="font-mono">Ctrl+Enter</span> pentru salvare
        </div>
      </div>
    </div>
  );
};

// React.memo wrapper pentru optimizarea re-renderurilor - Pattern validat din proiect
export const TransactionModal = React.memo(TransactionModalComponent, (prevProps, nextProps) => {
  // Custom comparison pentru props critice la performance
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.mode === nextProps.mode &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.date === nextProps.date &&
    prevProps.cellPosition.category === nextProps.cellPosition.category &&
    prevProps.cellPosition.subcategory === nextProps.cellPosition.subcategory &&
    prevProps.cellPosition.day === nextProps.cellPosition.day &&
    JSON.stringify(prevProps.existingTransaction) === JSON.stringify(nextProps.existingTransaction)
    // onClose și onSave sunt callback-uri și se vor schimba în mod normal
  );
});

export default TransactionModal;
