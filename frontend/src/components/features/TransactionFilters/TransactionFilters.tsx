import React from 'react';
import Button from '../../primitives/Button';
import Select from '../../primitives/Select';
import { TransactionType, CategoryType } from 'shared-constants';
import { LABELS, PLACEHOLDERS } from 'shared-constants';

import { useTransactionFiltersStore } from '../../../stores/transactionFiltersStore';
import { OPTIONS } from 'shared-constants';

const TransactionFilters: React.FC = () => {
  const type = useTransactionFiltersStore(s => s.filterType);
  const category = useTransactionFiltersStore(s => s.filterCategory);
  const setFilterType = useTransactionFiltersStore(s => s.setFilterType);
  const setFilterCategory = useTransactionFiltersStore(s => s.setFilterCategory);
  const types = OPTIONS.TYPE;
  const categories = OPTIONS.CATEGORY;

  return (
    <div className="flex gap-4 mb-4">
      <Select
        name="type-filter"
        label={LABELS.TYPE_FILTER}
        value={type || ''}
        onChange={e => setFilterType((e.target as HTMLSelectElement).value as TransactionType | '')}
        options={types}
        className="ml-2"
        placeholder={PLACEHOLDERS.SELECT + ' tipul'}
      />
      <Select
        name="category-filter"
        label={LABELS.CATEGORY_FILTER}
        value={category || ''}
        onChange={e => setFilterCategory((e.target as HTMLSelectElement).value as CategoryType | '')}
        options={categories}
        className="ml-2"
        placeholder={PLACEHOLDERS.SELECT + ' categoria'}
      />
      <Button variant="secondary" onClick={() => { setFilterType(''); setFilterCategory(''); }}>
        Resetează filtre
      </Button>
    </div>
  );
};

export default TransactionFilters;
