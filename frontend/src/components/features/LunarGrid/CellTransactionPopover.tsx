import React, { useEffect, useRef, useCallback } from 'react';
import Input from '../../primitives/Input/Input';
import Checkbox from '../../primitives/Checkbox/Checkbox';
import Select from '../../primitives/Select/Select';
import Button from '../../primitives/Button/Button';
import { OPTIONS, LABELS, BUTTONS, PLACEHOLDERS } from '@shared-constants';
import { FrequencyType } from '@shared-constants/enums';
import { useThemeEffects } from '../../../hooks';

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
  anchorRef
}) => {
  const [amount, setAmount] = React.useState(initialAmount || '');
  const [recurring, setRecurring] = React.useState(false);
  const [frequency, setFrequency] = React.useState<FrequencyType | ''>('');
  const [description, setDescription] = React.useState('');
  const [activatedField, setActivatedField] = React.useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Utilizăm hook-ul de efecte pentru gestionarea efectelor vizuale
  const { getClasses } = useThemeEffects({
    withFadeIn: true,
    withShadow: true,
    withTransition: true
  });

  // Handler pentru salvare - definit înainte de a fi folosit în useEffect
  const handleSave = useCallback(() => {
    if (!amount || isNaN(Number(amount))) return;
    onSave({ amount, recurring, frequency: frequency || undefined, description });
  }, [amount, recurring, frequency, onSave, description]);
  
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

  // Handleri pentru efecte de focus/blur
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setActivatedField(e.target.id);
  };

  const handleBlur = () => {
    setActivatedField(null);
  };

  return (
    <div 
      className={getClasses('card-section', 'secondary', 'sm', 'active')} 
      data-testid="cell-transaction-popover"
    >
      <div className={getClasses('flex-group', 'between', 'sm')}>
        <label htmlFor="amount-input" className={getClasses('form-label', 'secondary', 'sm')}>{LABELS.AMOUNT}*</label>
      </div>
      <Input
        id="amount-input"
        name="amount"
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={PLACEHOLDERS.AMOUNT}
        data-testid="cell-amount-input"
        min={0.01}
        step="0.01"
        maxLength={12}
        autoFocus
        ref={inputRef}
        withGlowFocus={activatedField === 'amount-input'}
        withTransition
      />
      <div className={getClasses('flex-group', 'between', 'sm')}>
        <label htmlFor="description-input" className={getClasses('form-label', 'secondary', 'sm')}>{LABELS.DESCRIPTION}</label>
      </div>
      <Input
        id="description-input"
        name="description"
        type="text"
        value={description}
        onChange={e => setDescription(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={PLACEHOLDERS.DESCRIPTION}
        data-testid="cell-description-input"
        maxLength={100} 
        withGlowFocus={activatedField === 'description-input'}
        withTransition
      />
      <div className={getClasses('spacing', 'section', 'sm')}>
      <Checkbox
        name="recurring"
        checked={recurring}
        onChange={e => setRecurring(e.target.checked)}
        label={LABELS.RECURRING}
        data-testid="cell-recurring-checkbox"
          withBorderAnimation
          withScaleEffect
      />
      </div>
      {recurring && (
        <Select
          name="frequency"
          value={frequency}
          onChange={e => setFrequency(e.target.value as FrequencyType)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          options={OPTIONS.FREQUENCY}
          placeholder={PLACEHOLDERS.SELECT}
          data-testid="cell-frequency-select"
          withGlowFocus
          withHoverEffect
          withTransition
          className={activatedField === 'frequency' ? getClasses('input', 'primary', undefined, 'focus') : ''}
        />
      )}
      <div className={getClasses('flex-group', 'between', 'md')}>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleSave}
          data-testid="cell-save-btn"
          withShadow
        >
          {BUTTONS.ADD}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
          data-testid="cell-cancel-btn"
          withShadow
        >
          {BUTTONS.CANCEL}
        </Button>
      </div>
    </div>
  );
};

export default CellTransactionPopover;
