import React from 'react';

interface TransactionFiltersProps {
  type: string | undefined;
  category: string | undefined;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
  types: Array<{ value: string; label: string }>;
  categories: Array<{ value: string; label: string }>;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  type,
  category,
  onTypeChange,
  onCategoryChange,
  types,
  categories,
}) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <label>
        Tip tranzacție:
        <select value={type || ''} onChange={e => onTypeChange(e.target.value)}>
          <option value="">Alege tipul</option>
          {types.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
      <label>
        Categoria:
        <select value={category || ''} onChange={e => onCategoryChange(e.target.value)}>
          <option value="">Alege categoria</option>
          {categories.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default TransactionFilters;
