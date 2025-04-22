import React from 'react';

export type TransactionFormData = {
  type: string;
  amount: string;
  currency: string;
  category: string;
  subcategory: string;
  date: string;
  recurring: boolean;
  frequency: string;
};

export type TransactionFormProps = {
  form: TransactionFormData;
  formError: string;
  formSuccess: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const TransactionForm: React.FC<TransactionFormProps> = ({ form, formError, formSuccess, onChange, onSubmit }) => (
  <form role="form" onSubmit={onSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'flex-end' }}>
    <label>
      Tip*:
      <select name="type" value={form.type} onChange={onChange} aria-label="Tip">
        <option value=''>Alege</option>
        <option value='income'>Venit</option>
        <option value='expense'>Cheltuială</option>
        <option value='saving'>Economisire</option>
        <option value='transfer'>Transfer</option>
      </select>
    </label>
    <label>
      Sumă*:
      <input name="amount" type="number" value={form.amount} onChange={onChange} aria-label="Sumă" />
    </label>
    <label>
      Monedă*:
      <input name="currency" value={form.currency} onChange={onChange} aria-label="Monedă" />
    </label>
    <label>
      Categorie*:
      <input name="category" value={form.category} onChange={onChange} aria-label="Categorie" />
    </label>
    <label>
      Subcategorie:
      <input name="subcategory" value={form.subcategory} onChange={onChange} aria-label="Subcategorie" />
    </label>
    <label>
      Dată*:
      <input name="date" type="date" value={form.date} onChange={onChange} aria-label="Dată" />
    </label>
    <label>
      <input name="recurring" type="checkbox" checked={form.recurring} onChange={onChange} aria-label="Recurent" /> Recurent?
    </label>
    <label>
      Frecvență:
      <select name="frequency" value={form.frequency} onChange={onChange} aria-label="Frecvență" disabled={!form.recurring}>
        <option value=''>Alege</option>
        <option value='zilnic'>Zilnic</option>
        <option value='săptămânal'>Săptămânal</option>
        <option value='lunar'>Lunar</option>
        <option value='anual'>Anual</option>
      </select>
    </label>
    <button type="submit">Adaugă</button>
    {formError && <span style={{ color: 'red', display: 'block', marginTop: 8 }}>{formError}</span>}
    {formSuccess && <span style={{ color: 'green', display: 'block', marginTop: 8 }}>{formSuccess}</span>}
  </form>
);

export default TransactionForm;
