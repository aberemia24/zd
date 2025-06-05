import { LABELS } from '@shared-constants';
/**
 * 🔍 TABLE TOOLBAR - Task 8.2
 * Toolbar pentru search avansat și filtering pentru tabele financiare
 */

import React, { useState, useCallback, useMemo, memo } from 'react';
import { Search, Filter, X, Calendar, Tag, DollarSign } from 'lucide-react';

import { TransactionType } from '@shared-constants';
import { 
  cn,
  button,
  input,
  spaceY,
} from '../../../styles/cva-v2';
import type { 
  FilterState, 
  SearchState, 
  QuickFilterPeriod 
} from '../../../types/financial';

// =============================================================================
// INTERFACES
// =============================================================================

export interface TableToolbarProps {
  searchState: SearchState;
  filterState: FilterState;
  onSearchChange: (search: SearchState) => void;
  onFilterChange: (filters: FilterState) => void;
  onQuickFilter: (period: QuickFilterPeriod) => void;
  onClearAll: () => void;
  
  // Data pentru dropdowns
  categories?: string[];
  subcategories?: string[];
  
  // Configuration
  showQuickFilters?: boolean;
  showCategoryFilter?: boolean;
  showTypeFilter?: boolean;
  showAmountFilter?: boolean;
  
  className?: string;
}

// =============================================================================
// QUICK FILTER PERIODS
// =============================================================================

const QUICK_FILTERS: QuickFilterPeriod[] = [
  { key: 'last7days', label: 'Ultimele 7 zile', days: 7 },
  { key: 'last30days', label: 'Ultimele 30 zile', days: 30 },
  { key: 'thisMonth', label: 'Luna aceasta', days: 0 },
  { key: 'lastMonth', label: 'Luna trecută', days: 0 },
  { key: 'last3months', label: 'Ultimele 3 luni', days: 90 },
  { key: 'thisYear', label: 'Anul acesta', days: 0 },
];

// =============================================================================
// COMPONENT IMPLEMENTATION
// =============================================================================

// Memoized component pentru performance optimization
export const TableToolbar: React.FC<TableToolbarProps> = memo(({
  searchState,
  filterState,
  onSearchChange,
  onFilterChange,
  onQuickFilter,
  onClearAll,
  categories = [],
  subcategories: _subcategories = [],
  showQuickFilters = true,
  showCategoryFilter = true,
  showTypeFilter = true,
  showAmountFilter = true,
  className,
}) => {
  // =============================================================================
  // LOCAL STATE
  // =============================================================================

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  const hasActiveFilters = useMemo(() => {
    return (
      filterState.categories.length > 0 ||
      filterState.subcategories.length > 0 ||
      filterState.types.length > 0 ||
      filterState.amountRange.min !== null ||
      filterState.amountRange.max !== null ||
      filterState.dateRange.start !== null ||
      filterState.dateRange.end !== null ||
      searchState.query.trim().length > 0
    );
  }, [searchState, filterState]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterState.categories.length > 0) { count++; }
    if (filterState.subcategories.length > 0) { count++; }
    if (filterState.types.length > 0) { count++; }
    if (filterState.amountRange.min !== null || filterState.amountRange.max !== null) { count++; }
    if (filterState.dateRange.start !== null || filterState.dateRange.end !== null) { count++; }
    if (searchState.query.trim().length > 0) { count++; }
    return count;
  }, [searchState, filterState]);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  const handleSearchChange = useCallback((query: string) => {
    onSearchChange({
      ...searchState,
      query,
    });
  }, [searchState, onSearchChange]);

  const handleCategoryChange = useCallback((category: string) => {
    const categories = filterState.categories.includes(category)
      ? filterState.categories.filter(c => c !== category)
      : [...filterState.categories, category];
      
    onFilterChange({
      ...filterState,
      categories,
    });
  }, [filterState, onFilterChange]);

  const handleTypeChange = useCallback((type: TransactionType) => {
    const types = filterState.types.includes(type)
      ? filterState.types.filter(t => t !== type)
      : [...filterState.types, type];
      
    onFilterChange({
      ...filterState,
      types,
    });
  }, [filterState, onFilterChange]);

  const handleAmountRangeChange = useCallback((field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    
    onFilterChange({
      ...filterState,
      amountRange: {
        ...filterState.amountRange,
        [field]: numValue,
      },
    });
  }, [filterState, onFilterChange]);

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderQuickFilters = () => {
    if (!showQuickFilters) { return null; }

    return (
      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onQuickFilter(filter)}
            className={cn(
              button({ 
                variant: 'outline', 
                size: 'sm' 
              }),
              'text-xs'
            )}
          >
            <Calendar className="w-3 h-3 mr-1" />
            {filter.label}
          </button>
        ))}
      </div>
    );
  };

  const renderAdvancedFilters = () => {
    if (!isAdvancedOpen) { return null; }

    return (
      <div className={cn("border-t border-gray-200 pt-4", spaceY({ spacing: 4 }))}>
        {/* Category Filter */}
        {showCategoryFilter && categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Categorii
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    button({ 
                      variant: filterState.categories.includes(category) ? 'primary' : 'outline',
                      size: 'sm' 
                    }),
                    'text-xs'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type Filter */}
        {showTypeFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tip tranzacție
            </label>
            <div className="flex gap-2">
              {Object.values(TransactionType).map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={cn(
                    button({ 
                      variant: filterState.types.includes(type) ? 'primary' : 'outline',
                      size: 'sm' 
                    }),
                    'text-xs',
                    type === TransactionType.INCOME && 'text-green-700 border-green-300',
                    type === TransactionType.EXPENSE && 'text-red-700 border-red-300'
                  )}
                >
                  {type === TransactionType.INCOME ? LABELS.INCOME_TYPE : LABELS.EXPENSE_TYPE}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Amount Range Filter */}
        {showAmountFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Sumă (RON)
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={filterState.amountRange.min || ''}
                onChange={(e) => handleAmountRangeChange('min', e.target.value)}
                className={cn(input({ variant: 'default' }), 'w-24')}
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filterState.amountRange.max || ''}
                onChange={(e) => handleAmountRangeChange('max', e.target.value)}
                className={cn(input({ variant: 'default' }), 'w-24')}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg p-4 space-y-4', className)}>
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Caută în descriere..."
            value={searchState.query}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={cn(
              input({ variant: 'default' }),
              'pl-10'
            )}
          />
        </div>
        
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className={cn(
            button({ 
              variant: isAdvancedOpen ? 'primary' : 'outline' 
            }),
            'relative'
          )}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtre
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className={cn(button({ variant: 'outline' }))}
          >
            <X className="w-4 h-4 mr-2" />
            Șterge tot
          </button>
        )}
      </div>

      {/* Quick Filters */}
      {renderQuickFilters()}

      {/* Advanced Filters */}
      {renderAdvancedFilters()}
    </div>
  );
});

// Add display name for debugging
TableToolbar.displayName = 'TableToolbar';

// =============================================================================
// EXPORT
// =============================================================================

export default TableToolbar; 