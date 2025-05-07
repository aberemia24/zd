import React from 'react';
import Button from '../../primitives/Button';
import Select from '../../primitives/Select';
import { OPTIONS, LABELS, PLACEHOLDERS } from '@shared-constants';
import type { TransactionType, CategoryType } from '@shared-constants';

export interface TransactionFiltersProps {
  type?: TransactionType | '' | string;
  category?: CategoryType | '' | string;
  onTypeChange?: (type: TransactionType | '' | string) => void;
  onCategoryChange?: (category: CategoryType | '' | string) => void;
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
        data-testid="type-filter"
        onChange={e => {
            const value = (e.target as HTMLSelectElement).value as TransactionType | '';
            // DEBUG: check if handler is the same as the mock
            
            console.log('[TransactionFilters] onTypeChange fired with:', value);
            onTypeChange(value);
          }}
        options={types}
        className="ml-2"
        placeholder={PLACEHOLDERS.SELECT + ' tipul'}
      />
      <Select
        name="category-filter"
        label={LABELS.CATEGORY_FILTER}
        value={category || ''}
        data-testid="category-filter"
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
