import React from 'react';
import { TransactionType, CategoryType } from '../../constants/enums';
import { PLACEHOLDERS, LABELS } from '../../constants/ui';

interface TransactionFiltersProps {
  type: TransactionType | '' | undefined;
  category: CategoryType | '' | undefined;
  onTypeChange: (type: TransactionType | '') => void;
  onCategoryChange: (category: CategoryType | '') => void;
  types: Array<{ value: TransactionType; label: string }>;
  categories: Array<{ value: CategoryType; label: string }>;
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
        {LABELS.TYPE_FILTER}
        <select value={type || ''} onChange={e => onTypeChange(e.target.value as TransactionType | '')}>
          <option value="">{PLACEHOLDERS.SELECT} tipul</option>
          {types.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
      <label>
        {LABELS.CATEGORY_FILTER}
        <select value={category || ''} onChange={e => onCategoryChange(e.target.value as CategoryType | '')}>
          <option value="">{PLACEHOLDERS.SELECT} categoria</option>
          {categories.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default TransactionFilters;
