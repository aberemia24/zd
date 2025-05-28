import React, { useEffect, useRef, useCallback } from "react";
import Input from "../../primitives/Input/Input";
import Checkbox from "../../primitives/Checkbox/Checkbox";
import Select from "../../primitives/Select/Select";
import Button from "../../primitives/Button/Button";
import { OPTIONS, LABELS, BUTTONS, PLACEHOLDERS } from "@shared-constants";
import { FrequencyType } from "@shared-constants/enums";
import { cn } from "../../../styles/cva/shared/utils";
import { card } from "../../../styles/cva/components/layout";
import { formGroup } from "../../../styles/cva/components/feedback";
import { flex as flexContainer } from "../../../styles/cva/components/layout";

interface CellTransactionPopoverProps {
  initialAmount: string;
  day: number;
  month: number;
  year: number;
  category: string;
  subcategory: string;
  type: string;
  onSave: (data: {
    amount: string;
    description: string;
    recurring: boolean;
    frequency?: FrequencyType;
  }) => Promise<void>;
  onCancel: () => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

const CellTransactionPopover: React.FC<CellTransactionPopoverProps> = ({
  initialAmount,
  day,
  month,
  year,
  category,
  subcategory,
  type,
  onSave,
  onCancel,
  anchorRef,
}) => {
  const [amount, setAmount] = React.useState(initialAmount || "");
  const [recurring, setRecurring] = React.useState(false);
  const [frequency, setFrequency] = React.useState<FrequencyType | "">("");
  const [description, setDescription] = React.useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Handler pentru salvare - definit înainte de a fi folosit în useEffect
  const handleSave = useCallback(() => {
    if (!amount || isNaN(Number(amount))) return;
    onSave({
      amount,
      recurring,
      frequency: frequency || undefined,
      description,
    });
  }, [amount, recurring, frequency, onSave, description]);

  // Autofocus input la deschidere
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Smart: dacă userul tastează cifre, le trimitem direct în input
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (document.activeElement === inputRef.current) return;
      if (e.key >= "0" && e.key <= "9") {
        setAmount((prev) => (prev === "0" ? e.key : prev + e.key));
        inputRef.current?.focus();
        e.preventDefault();
      }
      if (e.key === "Enter") {
        handleSave();
        e.preventDefault();
      }
      if (e.key === "Escape") {
        onCancel();
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, handleSave]);

  return (
    <div
      className={cn(
        card({ variant: "elevated", size: "sm" }),
        "animate-fadeIn transition-all duration-150",
      )}
      data-testid="cell-transaction-popover"
    >
      <div className={cn(formGroup({ variant: "default" }), "space-y-4")}>
        <div
          className={cn(
            flexContainer({
              direction: "row",
              justify: "between",
              align: "center",
            }),
          )}
        >
          <label
            htmlFor="amount-input"
            className="text-sm font-medium text-gray-700"
          >
            {LABELS.AMOUNT}*
          </label>
        </div>
        <Input
          id="amount-input"
          name="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={PLACEHOLDERS.AMOUNT}
          data-testid="cell-amount-input"
          min={0.01}
          step="0.01"
          maxLength={12}
          autoFocus
          ref={inputRef}
          variant="default"
          size="md"
        />

        <div
          className={cn(
            flexContainer({
              direction: "row",
              justify: "between",
              align: "center",
            }),
          )}
        >
          <label
            htmlFor="description-input"
            className="text-sm font-medium text-gray-700"
          >
            {LABELS.DESCRIPTION}
          </label>
        </div>
        <Input
          id="description-input"
          name="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={PLACEHOLDERS.DESCRIPTION}
          data-testid="cell-description-input"
          maxLength={100}
          variant="default"
          size="md"
        />

        <Checkbox
          name="recurring"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
          label={LABELS.RECURRING}
          data-testid="cell-recurring-checkbox"
          variant="default"
          size="md"
        />

        {recurring && (
          <Select
            name="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as FrequencyType)}
            options={OPTIONS.FREQUENCY}
            placeholder={PLACEHOLDERS.SELECT}
            data-testid="cell-frequency-select"
            variant="default"
            size="md"
          />
        )}

        <div
          className={cn(
            flexContainer({
              direction: "row",
              justify: "between",
              align: "center",
              gap: "md",
            }),
          )}
        >
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
            data-testid="cell-save-btn"
          >
            {BUTTONS.ADD}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
            data-testid="cell-cancel-btn"
          >
            {BUTTONS.CANCEL}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CellTransactionPopover;
