import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
  subcategory?: string;
  onTypeChange?: (type: TransactionType | '' | string) => void;
  onCategoryChange?: (category: CategoryType | '' | string) => void;
  onSubcategoryChange?: (subcategory: string) => void;
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

const TransactionFiltersComponent: React.FC<TransactionFiltersProps> = ({
  type = '',
  category = '',
  subcategory = '',
  onTypeChange = () => {},
  onCategoryChange = () => {},
  onSubcategoryChange = () => {},
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
  const categoryOptions = useMemo(() => {
    // Filtrăm categoriile bazate pe tipul de tranzacție selectat
    let filteredCategories = customCategories;
    
    if (type) {
      // Păstrăm doar categoriile compatibile cu tipul de tranzacție selectat
      filteredCategories = customCategories.filter(cat => {
        if (type === 'INCOME') return cat.name.includes('INCOME');
        if (type === 'EXPENSE') return cat.name.includes('EXPENSE');
        if (type === 'SAVING') return cat.name.includes('SAVING');
        return true; // Dacă tipul e gol, afișăm toate
      });
    }
    
    return filteredCategories.map(cat => ({
      value: cat.name,
      // Formatăm label-ul pentru afișare, incluzând indicator pentru categorii personalizate
      label: cat.name.charAt(0) + cat.name.slice(1).toLowerCase().replace(/_/g, ' ') + 
             (cat.isCustom ? ' ➡️' : '') // Indicator consistent cu cel din TransactionForm
    }));
  }, [customCategories, type]);
  
  // Construim opțiunile pentru subcategorii bazate pe categoria selectată
  const subcategoryOptions = useMemo(() => {
    if (!category) return [];
    
    // Găsim categoria selectată în lista de categorii
    const selectedCategory = customCategories.find(cat => cat.name === category);
    if (!selectedCategory) return [];
    
    // Extragem subcategoriile și le transformăm în opțiuni pentru Select
    return selectedCategory.subcategories.map(subcat => ({
      value: subcat.name,
      label: subcat.name.charAt(0) + subcat.name.slice(1).toLowerCase().replace(/_/g, ' ') + 
             (subcat.isCustom ? ' ➡️' : '')
    }));
  }, [customCategories, category]);

  // Calculăm numărul total de filtre active
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (type) count++;
    if (category) count++;
    if (subcategory) count++;
    if (dateFrom) count++;
    if (dateTo) count++;
    if (amountMin) count++;
    if (amountMax) count++;
    if (searchText) count++;
    return count;
  }, [type, category, subcategory, dateFrom, dateTo, amountMin, amountMax, searchText]);
  
  // Memoizăm filtrele combinate pentru a evita recalculări inutile
  const activeFilters = useMemo(() => ({
    type, 
    category, 
    subcategory,
    dateFrom, 
    dateTo, 
    amountMin, 
    amountMax, 
    searchText
  }), [type, category, subcategory, dateFrom, dateTo, amountMin, amountMax, searchText]);

  // Reset subcategory when category changes
  useEffect(() => {
    if (subcategory && (!category || subcategoryOptions.every(opt => opt.value !== subcategory))) {
      onSubcategoryChange('');
    }
  }, [category, subcategory, subcategoryOptions, onSubcategoryChange]);

  // Handler pentru reset global - memoizat
  const handleResetAll = useCallback(() => {
    onTypeChange('');
    onCategoryChange('');
    onSubcategoryChange('');
    onDateFromChange('');
    onDateToChange('');
    onAmountMinChange('');
    onAmountMaxChange('');
    onSearchTextChange('');
  }, [onTypeChange, onCategoryChange, onSubcategoryChange, onDateFromChange, onDateToChange, 
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

  // Memoizăm handlerul pentru schimbarea tipului
  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TransactionType | '';
    onTypeChange(value);
    // Reset categorie și subcategorie când se schimbă tipul
    onCategoryChange('');
    onSubcategoryChange('');
  }, [onTypeChange, onCategoryChange, onSubcategoryChange]);

  // Memoizăm handlerul pentru schimbarea categoriei
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as CategoryType | '';
    onCategoryChange(value);
    // Reset subcategorie când se schimbă categoria
    onSubcategoryChange('');
  }, [onCategoryChange, onSubcategoryChange]);
  
  // Memoizăm handlerul pentru schimbarea subcategoriei
  const handleSubcategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onSubcategoryChange(e.target.value);
  }, [onSubcategoryChange]);

  // Memoizăm handlerii pentru filtrele de date
  const handleDateFromChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onDateFromChange(e.target.value);
  }, [onDateFromChange]);

  const handleDateToChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onDateToChange(e.target.value);
  }, [onDateToChange]);

  // Memoizăm handlerii pentru filtrele de sumă
  const handleAmountMinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onAmountMinChange(e.target.value);
  }, [onAmountMinChange]);

  const handleAmountMaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onAmountMaxChange(e.target.value);
  }, [onAmountMaxChange]);

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
            onChange={handleTypeChange}
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
            onChange={handleCategoryChange}
            options={categoryOptions}
            placeholder={PLACEHOLDERS.SELECT + ' categoria'}
            disabled={!type}
          />
        </div>
      
        {/* Filtru pentru subcategorie - nou adăugat */}
        <div className={getEnhancedComponentClasses('form-group')}>
          <Select
            name="subcategory-filter"
            label={LABELS.SUBCATEGORY}
            value={subcategory || ''}
            data-testid="subcategory-filter"
            onChange={handleSubcategoryChange}
            options={subcategoryOptions}
            placeholder={PLACEHOLDERS.SELECT + ' subcategoria'}
            disabled={!category || subcategoryOptions.length === 0}
          />
        </div>
      </div>
      
      {/* Filtre de bază - a doua linie pentru căutare */}
      <div className={getEnhancedComponentClasses('grid', undefined, undefined, undefined, ['gap-4', 'grid-cols-1', 'mb-4'])}>
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
              onChange={handleDateFromChange}
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
              onChange={handleDateToChange}
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
              onChange={handleAmountMinChange}
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
              onChange={handleAmountMaxChange}
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

// Aplicăm React.memo pentru a preveni re-rendări inutile
const TransactionFilters = React.memo(TransactionFiltersComponent);

export default TransactionFilters;
