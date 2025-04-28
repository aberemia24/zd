import React from 'react';
import Button from '../../primitives/Button';
import Select from '../../primitives/Select';
import { TransactionType, CategoryType, OPTIONS, LABELS, PLACEHOLDERS } from '@shared-constants';

export interface TransactionFiltersProps {
  type?: string;
  category?: string;
  onTypeChange?: (type: string) => void;
  onCategoryChange?: (category: string) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  type = '',
  category = '',
  onTypeChange = () => {},
  onCategoryChange = () => {}
}) => {
  const types = OPTIONS.TYPE;
  const categories = OPTIONS.CATEGORY;

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
      <Button variant="secondary" onClick={() => { onTypeChange(''); onCategoryChange(''); }}>
        Resetează filtre
      </Button>
    </div>
  );
};

export default TransactionFilters;
