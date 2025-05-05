import React, { useCallback } from 'react';
import Button from '../../primitives/Button';
import Input from '../../primitives/Input';
import Select from '../../primitives/Select';
import Checkbox from '../../primitives/Checkbox';
import { TransactionType, CategoryType, CATEGORIES } from '@shared-constants';
import { LABELS, PLACEHOLDERS, BUTTONS, OPTIONS } from '@shared-constants';
import { MESAJE } from '@shared-constants';
import { useTransactionFormStore } from '../../../stores/transactionFormStore';

function safeMessage(key: string): string {
  return (MESAJE as Record<string, string>)[key] || key;
}

// Tipul datelor pentru formularul de tranzacție
export type TransactionFormData = {
  type: string;
  amount: string;
  category: string;
  subcategory: string;
  date: string;
  recurring: boolean;
  frequency: string;
  // currency nu este vizibilă în formular, se folosește valoarea implicită RON în store
};

// Nu mai folosim props pentru form, error, success, onChange, onSubmit, loading. Totul vine din store Zustand.

// Eliminat structura locală categorii/subcategorii. Folosește doar CATEGORIES din @shared-constants.

// Componentă cu props opționale onSave și onCancel
interface TransactionFormProps {
  onSave?: (form: TransactionFormData) => void;
  onCancel?: () => void;
}
const TransactionForm: React.FC<TransactionFormProps> = ({ onSave, onCancel }) => {
  // Selectăm starea și acțiunile relevante din store
  const { form, error, success, loading, setField, handleSubmit, resetForm } = useTransactionFormStore();

  // Handler pentru schimbare câmp
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checkedValue = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;
    setField(name as keyof typeof form, isCheckbox ? checkedValue : value);
    // Resetăm frequency dacă debifăm recurring
    if (name === 'recurring' && isCheckbox && checkedValue === false) {
      setField('frequency', '');
    }
    // Resetăm category și subcategory când type se schimbă
    if (name === 'type') {
      setField('category', '');
      setField('subcategory', '');
    }
    // Resetăm subcategorie când category se schimbă
    if (name === 'category') {
      setField('subcategory', '');
    }
  }, [setField]);

  // Handler pentru submit: folosește store.handleSubmit și resetForm
  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: amount number, fără id
    await handleSubmit();
    onSave?.(form);
    resetForm();
  }, [handleSubmit, resetForm, form, onSave]);

  // Filtrare categorii principale în funcție de tip
  const categoriiFiltrate = React.useMemo(() => {
    if (form.type === TransactionType.INCOME) return { VENITURI: CATEGORIES.VENITURI };
    if (form.type === TransactionType.SAVING) return { ECONOMII: CATEGORIES.ECONOMII };
    if (form.type === TransactionType.EXPENSE) {
      // Cheltuieli = toate celelalte categorii, fără VENITURI și ECONOMII
      const { VENITURI, ECONOMII, ...rest } = CATEGORIES;
      return rest;
    }
    return {};
  }, [form.type]);

  // Lista de opțiuni pentru dropdown-ul de categorie (grupuri mari)
  const optiuniCategorie = React.useMemo(() => {
    return Object.keys(categoriiFiltrate).map((cat) => ({ value: cat, label: cat.charAt(0) + cat.slice(1).toLowerCase().replace(/_/g, ' ') }));
  }, [categoriiFiltrate]);

  // Lista de opțiuni pentru subcategorie (grupuri mici)
  const optiuniSubcategorie = React.useMemo(() => {
    if (!form.category || !(categoriiFiltrate as Record<string, any>)[form.category]) return [];
    // grupuri mici: (ex: "Surse de venit", "General", etc)
    return Object.entries((categoriiFiltrate as Record<string, any>)[form.category] as Record<string, string[]>).flatMap(([grup, subcats]) =>
      (subcats as string[]).map((subcat: string) => ({ value: subcat, label: subcat, group: grup }))
    );
  }, [form.category, categoriiFiltrate]);

  return (
    <form
      aria-label={LABELS.FORM}
      onSubmit={onSubmit}
      className="flex flex-wrap gap-3 mb-6 items-end"
      data-testid="transaction-form"
    >
      <Select
        name="type"
        label={LABELS.TYPE + '*:'}
        value={form.type}
        onChange={handleChange}
        aria-label={LABELS.TYPE}
        options={OPTIONS.TYPE}
        className="ml-2"
        placeholder={PLACEHOLDERS.SELECT}
        data-testid="type-select"
      />
      <Input
        name="amount"
        type="number"
        label={LABELS.AMOUNT + '*:'}
        value={form.amount}
        onChange={handleChange}
        aria-label={LABELS.AMOUNT}
        placeholder={PLACEHOLDERS.AMOUNT}
        className="ml-2"
        data-testid="amount-input"
      />
      <Select
        name="category"
        label={LABELS.CATEGORY + '*:'}
        value={form.category}
        onChange={handleChange}
        aria-label={LABELS.CATEGORY}
        options={optiuniCategorie}
        className="ml-2"
        disabled={!form.type || optiuniCategorie.length === 0}
        placeholder={PLACEHOLDERS.SELECT}
        data-testid="category-select"
      />
      <Select
        name="subcategory"
        label={LABELS.SUBCATEGORY}
        value={form.subcategory}
        onChange={handleChange}
        aria-label={LABELS.SUBCATEGORY}
        options={optiuniSubcategorie}
        className="ml-2"
        disabled={!form.category || optiuniSubcategorie.length === 0}
        placeholder={PLACEHOLDERS.SELECT}
        data-testid="subcategory-select"
      />
      <Input
        name="date"
        type="date"
        label={LABELS.DATE + '*:'}
        value={form.date}
        onChange={handleChange}
        aria-label={LABELS.DATE}
        placeholder={PLACEHOLDERS.DATE}
        className="ml-2"
        data-testid="date-input"
      />
      <Checkbox
        name="recurring"
        label={LABELS.RECURRING + '?'}
        checked={form.recurring}
        onChange={handleChange}
        aria-label={LABELS.RECURRING}
        data-testid="recurring-checkbox"
      />
      <Select
        name="frequency"
        label={LABELS.FREQUENCY}
        value={form.frequency}
        onChange={handleChange}
        aria-label={LABELS.FREQUENCY}
        options={OPTIONS.FREQUENCY}
        className="ml-2"
        disabled={!form.recurring}
        placeholder={PLACEHOLDERS.SELECT}
        data-testid="frequency-select"
      />
      <Button
        type="submit"
        disabled={!!loading}
        className="ml-2"
        data-testid="save-btn"
      >
        {BUTTONS.ADD}
      </Button>
      <Button
        type="button"
        className="ml-2"
        data-testid="cancel-btn"
        onClick={() => {
          resetForm();
          onCancel?.();
        }}
      >
        {BUTTONS.CANCEL}
      </Button>
      {error && (
        <span data-testid="error-message" role="alert" aria-label="error message" className="text-error block mt-2">
          {safeMessage(error)}
        </span>
      )}
      {success && (
        <span data-testid="success-message" role="alert" aria-label="success message" className="text-success block mt-2">
          {safeMessage(success)}
        </span>
      )}
    </form>
  );
};

export default TransactionForm;
