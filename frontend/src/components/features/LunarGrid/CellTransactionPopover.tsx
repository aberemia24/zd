import React, { useEffect, useRef, useCallback } from 'react';
import Input from '../../primitives/Input';
import Checkbox from '../../primitives/Checkbox';
import Select from '../../primitives/Select';
import Button from '../../primitives/Button';
import { OPTIONS, LABELS, BUTTONS, PLACEHOLDERS } from '@shared-constants';

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
    recurring: boolean;
    frequency: string;
  }) => void;
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
  anchorRef
}) => {
  const [amount, setAmount] = React.useState(initialAmount || '');
  const [recurring, setRecurring] = React.useState(false);
  const [frequency, setFrequency] = React.useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Handler pentru salvare - definit înainte de a fi folosit în useEffect
  const handleSave = useCallback(() => {
    if (!amount || isNaN(Number(amount))) return;
    onSave({ amount, recurring, frequency });
  }, [amount, recurring, frequency, onSave]);
  
  // Autofocus input la deschidere
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Smart: dacă userul tastează cifre, le trimitem direct în input
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (document.activeElement === inputRef.current) return;
      if (e.key >= '0' && e.key <= '9') {
        setAmount(prev => (prev === '0' ? e.key : prev + e.key));
        inputRef.current?.focus();
        e.preventDefault();
      }
      if (e.key === 'Enter') {
        handleSave();
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        onCancel();
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, handleSave]);

  return (
    <div className="bg-secondary-50 rounded-token shadow-token p-token flex flex-col gap-2 z-50" data-testid="cell-transaction-popover">
      <label htmlFor="amount-input" className="font-medium">{LABELS.AMOUNT}*</label>
      <Input
        id="amount-input"
        name="amount"
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder={PLACEHOLDERS.AMOUNT}
        data-testid="cell-amount-input"
        min={0.01}
        step="0.01"
        maxLength={12} /* Limită rezonabilă pentru sume financiare */
        autoFocus
        inputRef={inputRef}
      />
      <Checkbox
        name="recurring"
        checked={recurring}
        onChange={e => setRecurring(e.target.checked)}
        label={LABELS.RECURRING}
        data-testid="cell-recurring-checkbox"
      />
      {recurring && (
        <Select
          name="frequency"
          value={frequency}
          onChange={e => setFrequency(e.target.value)}
          options={OPTIONS.FREQUENCY}
          placeholder={PLACEHOLDERS.SELECT}
          data-testid="cell-frequency-select"
        />
      )}
      <div className="flex gap-2 mt-2">
        <Button
          type="button"
          onClick={handleSave}
          data-testid="cell-save-btn"
          className="btn btn-primary"
        >
          {BUTTONS.ADD}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          data-testid="cell-cancel-btn"
          className="btn btn-secondary"
        >
          {BUTTONS.CANCEL}
        </Button>
      </div>
    </div>
  );
};

export default CellTransactionPopover;
