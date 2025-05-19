import React from 'react';
import Button from '../../primitives/Button/Button';
import Select from '../../primitives/Select/Select';
import Badge from '../../primitives/Badge/Badge';
import { OPTIONS, LABELS, PLACEHOLDERS } from '@shared-constants';
import type { TransactionType, CategoryType } from '@shared-constants';
import { useCategoryStore } from '../../../stores/categoryStore';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';

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
  // Opțiuni pentru tipurile de tranzacții din constante
  const types = OPTIONS.TYPE;
  
  // Categoriile personalizate + predefinite din categoryStore
  const customCategories = useCategoryStore(state => state.categories);
  
  // Construim opțiunile pentru categorii din store, nu din constante
  // Respectăm regulile: memoizare, fără hardcodări, indicator pentru custom
  const categoryOptions = React.useMemo(() => {
    return customCategories.map(cat => ({
      value: cat.name,
      // Formatăm label-ul pentru afișare, incluzând indicator pentru categorii personalizate
      label: cat.name.charAt(0) + cat.name.slice(1).toLowerCase().replace(/_/g, ' ') + 
             (cat.isCustom ? ' ➡️' : '') // Indicator consistent cu cel din TransactionForm
    }));
  }, [customCategories]);

  return (
    <div className={getEnhancedComponentClasses('flex', undefined, undefined, undefined, ['gap-2', 'items-end', 'mb-token'])}>
      {/* Contor filtre active */}
      {(!!type || !!category) && (
        <Badge
          variant="info"
          className="mr-2"
          withGradient
          withPulse
        >
          {`${Number(!!type) + Number(!!category)} filtru(e) activ(e)`}
        </Badge>
      )}
      
      {/* Filtru pentru tipul tranzacției */}
      <Select
        name="type-filter"
        label={LABELS.TYPE_FILTER}
        value={type || ''}
        data-testid="type-filter"
        onChange={e => {
          const value = (e.target as HTMLSelectElement).value as TransactionType | '';
          onTypeChange(value);
        }}
        options={types}
        placeholder={PLACEHOLDERS.SELECT + ' tipul'}
        withHoverEffect
        withFocusShadow
        withSmoothTransition
      />
      
      {/* Filtru pentru categorie */}
      <Select
        name="category-filter"
        label={LABELS.CATEGORY_FILTER}
        value={category || ''}
        data-testid="category-filter"
        onChange={e => onCategoryChange((e.target as HTMLSelectElement).value as CategoryType | '')}
        options={categoryOptions}
        placeholder={PLACEHOLDERS.SELECT + ' categoria'}
        withHoverEffect
        withFocusShadow
        withSmoothTransition
      />
      
      {/* Buton pentru resetarea filtrelor */}
      <Button 
        variant="secondary" 
        size="md"
        onClick={() => { onTypeChange(''); onCategoryChange(''); }}
        withShadow
        withTranslate
      >
        Resetează filtre
      </Button>
    </div>
  );
};

export default TransactionFilters;
