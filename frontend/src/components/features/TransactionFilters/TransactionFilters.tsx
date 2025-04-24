import React from 'react';
import Button from '../../primitives/Button';
import Select from '../../primitives/Select';
import { TransactionType, CategoryType } from '../../../constants/enums';
import { LABELS, PLACEHOLDERS } from '../../../constants/ui';

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
    <div className="flex gap-4 mb-4">
      <Select
        name="type-filter"
        label={LABELS.TYPE_FILTER}
        value={type || ''}
        onChange={e => onTypeChange((e.target as HTMLSelectElement).value as TransactionType | '')}
        options={types}
        className="ml-2"
        placeholder={PLACEHOLDERS.SELECT + ' tipul'}
      />
      <Select
        name="category-filter"
        label={LABELS.CATEGORY_FILTER}
        value={category || ''}
        onChange={e => onCategoryChange((e.target as HTMLSelectElement).value as CategoryType | '')}
        options={categories}
        className="ml-2"
        placeholder={PLACEHOLDERS.SELECT + ' categoria'}
      />
      {/* Exemplu de folosire Button cu Tailwind */}
      <Button variant="secondary" onClick={() => { onTypeChange(''); onCategoryChange(''); }}>
        Resetează filtre
      </Button>
    </div>
  );
};

export default TransactionFilters;
