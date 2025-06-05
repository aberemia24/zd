import React, { useState, useCallback, useEffect, useMemo } from "react";
import Button from "../../primitives/Button/Button";
import Select from "../../primitives/Select/Select";
import Badge from "../../primitives/Badge/Badge";
import Input from "../../primitives/Input/Input";
import FormLayout from "../../primitives/FormLayout/FormLayout";
import FieldGrid, { FieldWrapper } from "../../primitives/FieldGrid/FieldGrid";
import { 
  OPTIONS, LABELS, PLACEHOLDERS, TransactionType, CategoryType,
  BUTTONS, UI, TABLE, LOADER, INFO, MESAJE 
} from "@shared-constants";
import { useCategoryStore } from "../../../stores/categoryStore";

import classNames from "classnames";
import { useActiveSubcategories } from "../../../services/hooks/useActiveSubcategories";
import { 
  cn,
  card,
  flexLayout
} from "../../../styles/cva-v2";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface TransactionFiltersProps {
  type?: TransactionType | "" | string;
  category?: CategoryType | "" | string;
  subcategory?: string;
  onTypeChange?: (type: TransactionType | "" | string) => void;
  onCategoryChange?: (category: CategoryType | "" | string) => void;
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
  // New props for export integration
  exportButton?: React.ReactNode;
  showAdvancedByDefault?: boolean;
}

// =============================================================================
// UTILITIES
// =============================================================================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const TransactionFiltersComponent: React.FC<TransactionFiltersProps> = ({
  type = "",
  category = "",
  subcategory = "",
  onTypeChange = () => {},
  onCategoryChange = () => {},
  onSubcategoryChange = () => {},
  dateFrom = "",
  dateTo = "",
  amountMin = "",
  amountMax = "",
  searchText = "",
  onDateFromChange = () => {},
  onDateToChange = () => {},
  onAmountMinChange = () => {},
  onAmountMaxChange = () => {},
  onSearchTextChange = () => {},
  exportButton,
  showAdvancedByDefault = false,
}) => {
  // =============================================================================
  // LOCAL STATE
  // =============================================================================

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(showAdvancedByDefault);
  const [searchInputValue, setSearchInputValue] = useState(searchText);

  // =============================================================================
  // HOOKS
  // =============================================================================

  const customCategories = useCategoryStore((state) => state.categories);
  const { 
    subcategories: activeSubcategories, 
    isLoading: isLoadingSubcategories 
  } = useActiveSubcategories({
    category,
    type,
    enabled: !!category
  });

  // Debounce search input pentru performance
  const debouncedSearchText = useDebounce(searchInputValue, 300);

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  const types = OPTIONS.TYPE;

  const categoryOptions = useMemo(() => {
    let filteredCategories = customCategories;

    if (type) {
      filteredCategories = customCategories.filter((cat) => {
        if (type === "INCOME") return cat.name === "VENITURI";
        if (type === "EXPENSE")
          return cat.name !== "VENITURI" && cat.name !== "ECONOMII";
        if (type === "SAVING") return cat.name === "ECONOMII";
        return true;
      });
    }

    const options = filteredCategories.map((cat) => ({
      value: cat.name,
      label:
        cat.name.charAt(0) +
        cat.name.slice(1).toLowerCase().replace(/_/g, " ") +
        (cat.isCustom ? " ➡️" : ""),
    }));

    return options;
  }, [customCategories, type]);

  const subcategoryOptions = useMemo(() => {
    if (!activeSubcategories || activeSubcategories.length === 0) return [];
    
    return activeSubcategories.map((sub: { value: string; label: string; count: number; category: string }) => ({
      value: sub.value,
      label: sub.label,
    }));
  }, [activeSubcategories]);

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
  }, [
    type,
    category,
    subcategory,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    searchText,
  ]);

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    onSearchTextChange(debouncedSearchText);
  }, [debouncedSearchText, onSearchTextChange]);

  useEffect(() => {
    if (
      subcategory &&
      (!category ||
        subcategoryOptions.every((opt) => opt.value !== subcategory))
    ) {
      onSubcategoryChange("");
    }
  }, [category, subcategory, subcategoryOptions, onSubcategoryChange]);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onTypeChange(e.target.value);
      if (e.target.value !== type) {
        onCategoryChange("");
        onSubcategoryChange("");
      }
    },
    [onTypeChange, onCategoryChange, onSubcategoryChange, type],
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onCategoryChange(e.target.value);
      onSubcategoryChange("");
    },
    [onCategoryChange, onSubcategoryChange],
  );

  const handleSubcategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSubcategoryChange(e.target.value);
    },
    [onSubcategoryChange],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInputValue(e.target.value);
    },
    [],
  );

  const handleDateFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onDateFromChange(e.target.value);
    },
    [onDateFromChange],
  );

  const handleDateToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onDateToChange(e.target.value);
    },
    [onDateToChange],
  );

  const handleAmountMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onAmountMinChange(e.target.value);
    },
    [onAmountMinChange],
  );

  const handleAmountMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onAmountMaxChange(e.target.value);
    },
    [onAmountMaxChange],
  );

  const handleResetAll = useCallback(() => {
    onTypeChange("");
    onCategoryChange("");
    onSubcategoryChange("");
    onDateFromChange("");
    onDateToChange("");
    onAmountMinChange("");
    onAmountMaxChange("");
    onSearchTextChange("");
    setSearchInputValue("");
  }, [
    onTypeChange,
    onCategoryChange,
    onSubcategoryChange,
    onDateFromChange,
    onDateToChange,
    onAmountMinChange,
    onAmountMaxChange,
    onSearchTextChange,
  ]);

  const toggleAdvancedFilters = useCallback(() => {
    setShowAdvancedFilters((prev) => !prev);
  }, []);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Form submission pentru aplicarea filtrelor - poate fi extins
  }, []);

  // =============================================================================
  // FORM CONFIGURATION
  // =============================================================================

  const formTitle = "Filtre și Căutare";
  
  const loadingIndicator = isLoadingSubcategories ? (
    <Badge variant="warning">
      Se încarcă subcategoriile...
    </Badge>
  ) : undefined;

  const formActions = (
    <>
      {activeFilterCount > 0 && (
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleResetAll}
          data-testid="reset-filters-btn"
          className="w-full sm:w-auto"
        >
          {BUTTONS.RESET_FILTERS}
        </Button>
      )}

      <Button
        type="button"
        variant={showAdvancedFilters ? "primary" : "ghost"}
        size="md"
        onClick={toggleAdvancedFilters}
        data-testid="toggle-advanced-filters-btn"
        className="w-full sm:w-auto"
      >
        {showAdvancedFilters
          ? UI.TRANSACTION_FILTERS.HIDE_ADVANCED
          : UI.TRANSACTION_FILTERS.SHOW_ADVANCED}
        {activeFilterCount > 0 && (
                   <Badge variant="neutral" className="ml-2">
           {activeFilterCount}
         </Badge>
       )}
     </Button>

     {/* Export button integration */}
     {exportButton}
   </>
 );

 const formMessages = (
   <>
     {activeFilterCount > 0 && (
       <Badge variant="neutral">
          {activeFilterCount} {activeFilterCount === 1 ? 'filtru activ' : 'filtre active'}
        </Badge>
      )}
    </>
  );

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <FormLayout
      title={formTitle}
      loadingIndicator={loadingIndicator}
      actions={formActions}
      messages={formMessages}
      onSubmit={handleFormSubmit}
      testId="transaction-filters-form"
      ariaLabel="Formular filtre și căutare tranzacții"
    >
      {/* Quick Filters Row */}
      <FieldGrid cols={{ base: 1, sm: 2, md: 4 }} gap={4}>
        <Select
          name="type-filter"
          label="Tip tranzacție"
          value={type || ""}
          data-testid="type-filter"
          onChange={handleTypeChange}
          options={types}
          placeholder={PLACEHOLDERS.SELECT + " tipul"}
          size="sm"
          variant="default"
        />

        <Select
          name="category-filter"
          label="Categorie"
          value={category || ""}
          data-testid="category-filter"
          onChange={handleCategoryChange}
          options={categoryOptions}
          placeholder={PLACEHOLDERS.SELECT + " categoria"}
          disabled={!type}
          size="sm"
          variant="default"
        />

        <Select
          name="subcategory-filter"
          label="Subcategorie"
          value={subcategory || ""}
          data-testid="subcategory-filter"
          onChange={handleSubcategoryChange}
          options={subcategoryOptions}
          placeholder={
            isLoadingSubcategories
              ? LOADER.TEXT
              : PLACEHOLDERS.SELECT + " subcategoria"
          }
          disabled={!category || subcategoryOptions.length === 0}
          size="sm"
          variant="default"
        />

        <Input
          name="search-text-filter"
          label="Căutare în descriere"
          value={searchInputValue}
          data-testid="search-text-filter"
          onChange={handleSearchChange}
          placeholder={PLACEHOLDERS.SEARCH}
          type="text"
          size="sm"
          variant="default"
        />
      </FieldGrid>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <>
          <div className="space-y-1">
            <h4 className="text-md font-medium text-carbon-800 dark:text-carbon-200">
              Filtre avansate
            </h4>
            <p className="text-sm text-carbon-600 dark:text-carbon-400">
              Specificați criterii suplimentare pentru filtrarea tranzacțiilor
            </p>
          </div>

          <FieldGrid cols={{ base: 1, md: 2 }} gap={4}>
            <Input
              name="date-from-filter"
              type="date"
              label={LABELS.DATE_FROM_FILTER}
              value={dateFrom}
              data-testid="date-from-filter"
              onChange={handleDateFromChange}
              placeholder={PLACEHOLDERS.SELECT + " data de început"}
              size="sm"
              variant="default"
            />

            <Input
              name="date-to-filter"
              type="date"
              label={LABELS.DATE_TO_FILTER}
              value={dateTo}
              data-testid="date-to-filter"
              onChange={handleDateToChange}
              placeholder={PLACEHOLDERS.SELECT + " data de sfârșit"}
              size="sm"
              variant="default"
            />
          </FieldGrid>

          <FieldGrid cols={{ base: 1, md: 2 }} gap={4}>
            <Input
              name="amount-min-filter"
              type="number"
              label={LABELS.AMOUNT_MIN_FILTER}
              value={amountMin}
              data-testid="amount-min-filter"
              onChange={handleAmountMinChange}
              placeholder={PLACEHOLDERS.AMOUNT_MIN_FILTER}
              size="sm"
              variant="default"
            />

            <Input
              name="amount-max-filter"
              type="number"
              label={LABELS.AMOUNT_MAX_FILTER}
              value={amountMax}
              data-testid="amount-max-filter"
              onChange={handleAmountMaxChange}
              placeholder={PLACEHOLDERS.AMOUNT_MAX_FILTER}
              size="sm"
              variant="default"
            />
          </FieldGrid>
        </>
      )}
    </FormLayout>
  );
};

// Aplicăm React.memo pentru a preveni re-rendări inutile
const TransactionFilters = React.memo(TransactionFiltersComponent);

export default TransactionFilters;
