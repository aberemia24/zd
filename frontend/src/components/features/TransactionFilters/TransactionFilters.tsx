import React, { useState, useCallback, useEffect } from 'react';
import Button from '../../primitives/Button/Button';
import Select from '../../primitives/Select/Select';
import Badge from '../../primitives/Badge/Badge';
import Input from '../../primitives/Input/Input';
import { OPTIONS, LABELS, PLACEHOLDERS } from '@shared-constants';
import type { TransactionType, CategoryType } from '@shared-constants';
import { useCategoryStore } from '../../../stores/categoryStore';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import { BUTTONS, UI } from '@shared-constants/ui';
import classNames from 'classnames';

export interface TransactionFiltersProps {
  type?: TransactionType | '' | string;
  category?: CategoryType | '' | string;
  onTypeChange?: (type: TransactionType | '' | string) => void;
  onCategoryChange?: (category: CategoryType | '' | string) => void;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: string;
  amountMax?: string;
  searchText?: string;
  onDateFromChange?: (dateFrom: string) => void;
  onDateToChange?: (dateTo: string) => void;
  onAmountMinChange?: (amountMin: string) => void;
  onAmountMaxChange?: (amountMax: string) => void;
  onSearchTextChange?: (searchText: string) => void;
}

/**
 * Custom hook pentru debounce
 * Permite reducerea numărului de apeluri pentru text input
 */
function useDebounce<T>(value: T, delay: number): T {
  // State și setter pentru valoarea debounced
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(
    () => {
      // Actualizăm valoarea debouncedValue după delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      
      // Anulăm timeout-ul dacă valoarea se schimbă
      // Acest lucru garantează că nu se apelează setTimeout dacă valoarea
      // se schimbă în timpul delay-ului
      return () => {
        clearTimeout(handler);
      };
    },
    // Re-run efectul doar când valoarea sau delay-ul se schimbă
    [value, delay]
  );
  
  return debouncedValue;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  type = '',
  category = '',
  onTypeChange = () => {},
  onCategoryChange = () => {},
  dateFrom = '',
  dateTo = '',
  amountMin = '',
  amountMax = '',
  searchText = '',
  onDateFromChange = () => {},
  onDateToChange = () => {},
  onAmountMinChange = () => {},
  onAmountMaxChange = () => {},
  onSearchTextChange = () => {}
}) => {
  // State pentru expandarea/colapsarea filtrelor avansate
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
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

  // Calculăm numărul total de filtre active
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (type) count++;
    if (category) count++;
    if (dateFrom) count++;
    if (dateTo) count++;
    if (amountMin) count++;
    if (amountMax) count++;
    if (searchText) count++;
    return count;
  }, [type, category, dateFrom, dateTo, amountMin, amountMax, searchText]);

  // Handler pentru reset global
  const handleResetAll = useCallback(() => {
    onTypeChange('');
    onCategoryChange('');
    onDateFromChange('');
    onDateToChange('');
    onAmountMinChange('');
    onAmountMaxChange('');
    onSearchTextChange('');
  }, [onTypeChange, onCategoryChange, onDateFromChange, onDateToChange, 
      onAmountMinChange, onAmountMaxChange, onSearchTextChange]);

  // Toggle pentru filtre avansate
  const toggleAdvancedFilters = useCallback(() => {
    setShowAdvancedFilters(prev => !prev);
  }, []);

  // State intern pentru valoarea text input înainte de debounce
  const [searchInputValue, setSearchInputValue] = useState(searchText);
  
  // Aplicăm debounce pe valoarea de input
  const debouncedSearchText = useDebounce(searchInputValue, 400); // 400ms delay
  
  // Efect care trimite valoarea debounced către parent component
  useEffect(() => {
    if (debouncedSearchText !== searchText) {
      onSearchTextChange(debouncedSearchText);
    }
  }, [debouncedSearchText, searchText, onSearchTextChange]);
  
  // Handler pentru schimbarea valorii de input
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
  }, []);

  return (
    <div className={getEnhancedComponentClasses('card', 'default', 'md', undefined, ['mb-token', 'p-4', 'fade-in'])}>
      {/* Header pentru filtre cu badge de filtre active și buton de expand/collapse */}
      <div className={getEnhancedComponentClasses('flex-group', 'between', 'md', undefined, ['mb-3'])}>
        <div className={getEnhancedComponentClasses('flex-group', 'start', 'md')}>
          <h3 className="text-lg font-medium text-secondary-700">
            {UI.TRANSACTION_FILTERS.TITLE}
          </h3>
          
          {/* Badge cu numărul de filtre active */}
          {activeFilterCount > 0 && (
            <Badge
              variant="primary"
              withGradient
              withPulse
              withShadow
              className={getEnhancedComponentClasses('spacing', 'small')}
              data-testid="active-filters-badge"
            >
              {UI.FILTERS_ACTIVE(activeFilterCount)}
            </Badge>
          )}
        </div>
        
        <div className={getEnhancedComponentClasses('flex-group', 'end', 'sm')}>
          {/* Butonul pentru reset all filters */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetAll}
              withTranslate
              data-testid="reset-all-filters-btn"
            >
              {BUTTONS.RESET_ALL_FILTERS}
            </Button>
          )}
          
          {/* Butonul de toggle pentru filtre avansate */}
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleAdvancedFilters}
            withShadow
            data-testid="toggle-advanced-filters-btn"
          >
            {showAdvancedFilters ? UI.TRANSACTION_FILTERS.HIDE_ADVANCED : UI.TRANSACTION_FILTERS.SHOW_ADVANCED}
          </Button>
        </div>
      </div>
      
      {/* Filtre de bază - wrapper */}
      <div className={getEnhancedComponentClasses('grid', undefined, undefined, undefined, ['gap-4', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'mb-4'])}>
        {/* Filtru pentru tipul tranzacției */}
        <div className={getEnhancedComponentClasses('form-group')}>
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
          />
        </div>
      
        {/* Filtru pentru categorie */}
        <div className={getEnhancedComponentClasses('form-group')}>
          <Select
            name="category-filter"
            label={LABELS.CATEGORY_FILTER}
            value={category || ''}
            data-testid="category-filter"
            onChange={e => onCategoryChange((e.target as HTMLSelectElement).value as CategoryType | '')}
            options={categoryOptions}
            placeholder={PLACEHOLDERS.SELECT + ' categoria'}
          />
        </div>
      
        {/* Filtru pentru căutare text */}
        <div className={getEnhancedComponentClasses('form-group')}>
          <Input
            name="search-text-filter"
            label={LABELS.SEARCH_FILTER}
            value={searchInputValue}
            data-testid="search-text-filter"
            onChange={handleSearchChange}
            placeholder={PLACEHOLDERS.SEARCH}
            type="text"
          />
        </div>
      </div>
      
      {/* Filtre avansate - wrapper (condiționat de state) */}
      {showAdvancedFilters && (
        <div className={classNames(
          getEnhancedComponentClasses('card-section', undefined, undefined, undefined, ['mb-4', 'slide-down', 'fade-in']),
          getEnhancedComponentClasses('grid', undefined, undefined, undefined, ['gap-4', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4'])
        )}>
          {/* Filtru pentru data de început */}
          <div className={getEnhancedComponentClasses('form-group')}>
            <Input
              name="date-from-filter"
              label={LABELS.DATE_FROM_FILTER}
              value={dateFrom}
              data-testid="date-from-filter"
              onChange={e => onDateFromChange(e.target.value)}
              placeholder={PLACEHOLDERS.SELECT + ' data de început'}
              type="date"
            />
          </div>
          
          {/* Filtru pentru data de sfârșit */}
          <div className={getEnhancedComponentClasses('form-group')}>
            <Input
              name="date-to-filter"
              label={LABELS.DATE_TO_FILTER}
              value={dateTo}
              data-testid="date-to-filter"
              onChange={e => onDateToChange(e.target.value)}
              placeholder={PLACEHOLDERS.SELECT + ' data de sfârșit'}
              type="date"
            />
          </div>
          
          {/* Filtru pentru suma minimă */}
          <div className={getEnhancedComponentClasses('form-group')}>
            <Input
              name="amount-min-filter"
              label={LABELS.AMOUNT_MIN_FILTER}
              value={amountMin}
              data-testid="amount-min-filter"
              onChange={e => onAmountMinChange(e.target.value)}
              placeholder={PLACEHOLDERS.AMOUNT_MIN_FILTER}
              type="number"
            />
          </div>
          
          {/* Filtru pentru suma maximă */}
          <div className={getEnhancedComponentClasses('form-group')}>
            <Input
              name="amount-max-filter"
              label={LABELS.AMOUNT_MAX_FILTER}
              value={amountMax}
              data-testid="amount-max-filter"
              onChange={e => onAmountMaxChange(e.target.value)}
              placeholder={PLACEHOLDERS.AMOUNT_MAX_FILTER}
              type="number"
            />
          </div>
        </div>
      )}
      
      {/* Footer cu acțiuni */}
      <div className={getEnhancedComponentClasses('flex-group', 'end', 'md', undefined, ['mt-2'])}>
        {/* Buton pentru resetarea filtrelor - visible când există filtre active */}
        {activeFilterCount > 0 && (
          <Button 
            variant="secondary" 
            size="md"
            onClick={handleResetAll}
            withShadow
            withTranslate
            data-testid="reset-filters-btn"
          >
            {BUTTONS.RESET_FILTERS}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;
