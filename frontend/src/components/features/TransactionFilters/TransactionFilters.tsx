import React, { useState, useCallback, useEffect, useMemo } from "react";
import Button from "../../primitives/Button/Button";
import Select from "../../primitives/Select/Select";
import Badge from "../../primitives/Badge/Badge";
import Input from "../../primitives/Input/Input";
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
    [value, delay],
  );

  return debouncedValue;
}

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
}) => {
  // State pentru expandarea/colapsarea filtrelor avansate
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Opțiuni pentru tipurile de tranzacții din constante
  const types = OPTIONS.TYPE;

  // Categoriile personalizate + predefinite din categoryStore
  const customCategories = useCategoryStore((state) => state.categories);

  // Construim opțiunile pentru categorii din store, nu din constante
  // Respectăm regulile: memoizare, fără hardcodări, indicator pentru custom
  const categoryOptions = useMemo(() => {
    // Filtrăm categoriile bazate pe tipul de tranzacție selectat
    let filteredCategories = customCategories;

    if (type) {
      // Păstrăm doar categoriile compatibile cu tipul de tranzacție selectat
      filteredCategories = customCategories.filter((cat) => {
        if (type === "INCOME") return cat.name === "VENITURI";
        if (type === "EXPENSE")
          return cat.name !== "VENITURI" && cat.name !== "ECONOMII";
        if (type === "SAVING") return cat.name === "ECONOMII";
        return true; // Dacă tipul e gol, afișăm toate
      });
    }

    const options = filteredCategories.map((cat) => ({
      value: cat.name,
      // Formatăm label-ul pentru afișare, incluzând indicator pentru categorii personalizate
      label:
        cat.name.charAt(0) +
        cat.name.slice(1).toLowerCase().replace(/_/g, " ") +
        (cat.isCustom ? " ➡️" : ""), // Indicator consistent cu cel din TransactionForm
    }));

    return options;
  }, [customCategories, type]);

  // Obține subcategoriile active folosind noul hook
  const {
    subcategories: activeSubcategories,
    isLoading: isLoadingSubcategories,
    isEmpty: noActiveSubcategories,
  } = useActiveSubcategories({
    category,
    type,
    enabled: !!category, // Activăm doar dacă avem o categorie selectată
  });

  // Combinăm subcategoriile active cu cele din store dacă e necesar
  const subcategoryOptions = useMemo(() => {
    // Dacă nu avem o categorie selectată, returnăm un array gol
    if (!category) return [];

    // Dacă se încarcă subcategoriile active, afișăm toate subcategoriile din store ca înainte
    if (isLoadingSubcategories) {
      // Găsim categoria selectată în lista de categorii
      const selectedCategory = customCategories.find(
        (cat) => cat.name === category,
      );
      if (!selectedCategory) return [];

      // Extragem subcategoriile și le transformăm în opțiuni pentru Select
      return selectedCategory.subcategories.map((subcat) => ({
        value: subcat.name,
        label:
          subcat.name.charAt(0) +
          subcat.name.slice(1).toLowerCase().replace(/_/g, " ") +
          (subcat.isCustom ? " ➡️" : ""),
      }));
    }

    // Dacă nu avem subcategorii active sau componentele de căutare returnează array gol, afișăm un mesaj în dropdown
    if (noActiveSubcategories || activeSubcategories.length === 0) {
      return [
        {
          value: "",
          label: INFO.NO_SUBCATEGORIES || TABLE.NO_SUBCATEGORIES,
          disabled: true,
        },
      ];
    }

    // Altfel, returnăm subcategoriile active cu numărul de tranzacții pentru fiecare
    return activeSubcategories.map((subcat) => ({
      value: subcat.value,
      label: subcat.label, // Numărul de tranzacții este deja adăugat în hook-ul useActiveSubcategories
      disabled: false,
    }));
  }, [
    category,
    customCategories,
    isLoadingSubcategories,
    activeSubcategories,
    noActiveSubcategories,
  ]);

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

  // Memoizăm filtrele combinate pentru a evita recalculări inutile
  const activeFilters = useMemo(
    () => ({
      type,
      category,
      subcategory,
      dateFrom,
      dateTo,
      amountMin,
      amountMax,
      searchText,
    }),
    [
      type,
      category,
      subcategory,
      dateFrom,
      dateTo,
      amountMin,
      amountMax,
      searchText,
    ],
  );

  // Reset subcategory when category changes
  useEffect(() => {
    if (
      subcategory &&
      (!category ||
        subcategoryOptions.every((opt) => opt.value !== subcategory))
    ) {
      onSubcategoryChange("");
    }
  }, [category, subcategory, subcategoryOptions, onSubcategoryChange]);

  // Handler pentru reset global - memoizat
  const handleResetAll = useCallback(() => {
    onTypeChange("");
    onCategoryChange("");
    onSubcategoryChange("");
    onDateFromChange("");
    onDateToChange("");
    onAmountMinChange("");
    onAmountMaxChange("");
    onSearchTextChange("");
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

  // Toggle pentru filtre avansate
  const toggleAdvancedFilters = useCallback(() => {
    setShowAdvancedFilters((prev) => !prev);
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
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInputValue(e.target.value);
    },
    [],
  );

  // Memoizăm handlerul pentru schimbarea tipului
  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as TransactionType | "";
      onTypeChange(value);
      // Reset categorie și subcategorie când se schimbă tipul
      onCategoryChange("");
      onSubcategoryChange("");
    },
    [onTypeChange, onCategoryChange, onSubcategoryChange],
  );

  // Memoizăm handlerul pentru schimbarea categoriei
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as CategoryType | "";
      onCategoryChange(value);
      // Reset subcategorie când se schimbă categoria
      onSubcategoryChange("");
    },
    [onCategoryChange, onSubcategoryChange],
  );

  // Memoizăm handlerul pentru schimbarea subcategoriei
  const handleSubcategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSubcategoryChange(e.target.value);
    },
    [onSubcategoryChange],
  );

  // Memoizăm handlerii pentru filtrele de date
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

  // Memoizăm handlerii pentru filtrele de sumă
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

  // Utilizăm CVA unified system și clase CSS manuale
  return (
    <div
      className={flexLayout({ 
        direction: "row", 
        justify: "between", 
        align: "center", 
        gap: 4 
      })}
    >
      {/* Bara de filtre compactă, pe o singură linie */}
      <div
        className={flexLayout({ 
          direction: "row", 
          justify: "start", 
          align: "center", 
          gap: 4 
        })}
      >
        {/* Filtru tip tranzacție */}
        <Select
          name="type-filter"
          label=""
          value={type || ""}
          data-testid="type-filter"
          onChange={handleTypeChange}
          options={types}
          placeholder={PLACEHOLDERS.SELECT + " tipul"}
          size="sm"
        />
        {/* Filtru categorie */}
        <Select
          name="category-filter"
          label=""
          value={category || ""}
          data-testid="category-filter"
          onChange={handleCategoryChange}
          options={categoryOptions}
          placeholder={PLACEHOLDERS.SELECT + " categoria"}
          disabled={!type}
          size="sm"
        />
        {/* Filtru subcategorie */}
        <Select
          name="subcategory-filter"
          label=""
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
        />
      </div>
      {/* Acțiuni și searchbox la finalul barei */}
      <div
        className={flexLayout({ 
          direction: "row", 
          justify: "end", 
          align: "center", 
          gap: 4 
        })}
      >
        {/* Searchbox compact */}
        <Input
          name="search-text-filter"
          label=""
          value={searchInputValue}
          data-testid="search-text-filter"
          onChange={handleSearchChange}
          placeholder={PLACEHOLDERS.SEARCH}
          type="text"
        />
        {/* Buton reset filtre */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            data-testid="reset-filters-btn"
            aria-label={BUTTONS.RESET_FILTERS}
          >
            {BUTTONS.RESET_FILTERS}
          </Button>
        )}
        {/* Buton filtre avansate */}
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleAdvancedFilters}
          data-testid="toggle-advanced-filters-btn"
          aria-label={
            showAdvancedFilters
              ? UI.TRANSACTION_FILTERS.HIDE_ADVANCED
              : UI.TRANSACTION_FILTERS.SHOW_ADVANCED
          }
        >
          {showAdvancedFilters
            ? UI.TRANSACTION_FILTERS.HIDE_ADVANCED
            : UI.TRANSACTION_FILTERS.SHOW_ADVANCED}
        </Button>
      </div>
      {/* Filtre avansate - rămân sub bară, vizibile doar dacă sunt activate */}
      {showAdvancedFilters && (
        <div className={cn(card({ variant: "default" }), "mt-4 p-4 space-y-4")}>
          <Input
            name="date-from-filter"
            label={LABELS.DATE_FROM_FILTER}
            value={dateFrom}
            data-testid="date-from-filter"
            onChange={handleDateFromChange}
            placeholder={PLACEHOLDERS.SELECT + " data de început"}
            type="date"
          />
          <Input
            name="date-to-filter"
            label={LABELS.DATE_TO_FILTER}
            value={dateTo}
            data-testid="date-to-filter"
            onChange={handleDateToChange}
            placeholder={PLACEHOLDERS.SELECT + " data de sfârșit"}
            type="date"
          />
          <Input
            name="amount-min-filter"
            label={LABELS.AMOUNT_MIN_FILTER}
            value={amountMin}
            data-testid="amount-min-filter"
            onChange={handleAmountMinChange}
            placeholder={PLACEHOLDERS.AMOUNT_MIN_FILTER}
            type="number"
          />
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
      )}
    </div>
  );
};

// Aplicăm React.memo pentru a preveni re-rendări inutile
const TransactionFilters = React.memo(TransactionFiltersComponent);

export default TransactionFilters;
