import { useState, useCallback, useMemo } from 'react';
import { PAGINATION } from '../constants/defaults';
import { TransactionType, CategoryType } from '../constants/enums';

// Tipuri pentru filtrele de tranzacții
export type TransactionFilters = {
  filterType?: TransactionType | '';
  filterCategory?: CategoryType | '';
  limit: number;
  offset: number;
  sort: string;
};

// Tipuri pentru query params utilizate în cereri API
export type TransactionQueryParams = {
  type?: TransactionType | '';
  category?: CategoryType | '';
  limit: number;
  offset: number;
  sort: string;
};

// Props pentru hook-ul useTransactionFilters
export type UseTransactionFiltersProps = {
  totalItems?: number; // Numărul total de elemente pentru paginare
  initialFilters?: Partial<TransactionFilters>; // Filtre inițiale opționale
};

/**
 * Hook pentru gestionarea filtrelor, paginării și sortării pentru lista de tranzacții
 * 
 * Responsabilități:
 * - Gestionarea filtrelor (tip, categorie)
 * - Gestionarea paginării (limit, offset, pagina curentă)
 * - Gestionarea sortării
 * - Generarea query params pentru API
 */
export const useTransactionFilters = ({ 
  totalItems = 0, 
  initialFilters = {} 
}: UseTransactionFiltersProps = {}) => {
  // Stare pentru filtre
  const [filterType, setFilterTypeInternal] = useState<TransactionType | '' | undefined>(
    initialFilters.filterType
  );
  
  const [filterCategory, setFilterCategoryInternal] = useState<CategoryType | '' | undefined>(
    initialFilters.filterCategory
  );
  
  // Stare pentru paginare și sortare
  const [limit, setLimit] = useState<number>(
    initialFilters.limit || PAGINATION.DEFAULT_LIMIT
  );
  
  const [offset, setOffset] = useState<number>(
    initialFilters.offset || PAGINATION.DEFAULT_OFFSET
  );
  
  const [sort, setSort] = useState<string>(
    initialFilters.sort || PAGINATION.DEFAULT_SORT
  );

  // Calcularea paginii curente pe baza offset și limit
  const currentPage = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);
  
  // Calcularea numărului total de pagini
  const totalPages = useMemo(() => Math.ceil(totalItems / limit), [totalItems, limit]);

  /**
   * Setează filtrul de tip și resetează offset-ul pentru a începe de la prima pagină
   */
  const setFilterType = useCallback((type?: TransactionType | '') => {
    setFilterTypeInternal(type);
    setOffset(0);
  }, []);

  /**
   * Setează filtrul de categorie și resetează offset-ul pentru a începe de la prima pagină
   */
  const setFilterCategory = useCallback((category?: CategoryType | '') => {
    setFilterCategoryInternal(category);
    setOffset(0);
  }, []);

  /**
   * Resetează toate filtrele la valorile implicite
   */
  const resetFilters = useCallback(() => {
    setFilterTypeInternal(undefined);
    setFilterCategoryInternal(undefined);
    setLimit(PAGINATION.DEFAULT_LIMIT);
    setOffset(PAGINATION.DEFAULT_OFFSET);
    setSort(PAGINATION.DEFAULT_SORT);
  }, []);

  /**
   * Navighează la pagina următoare dacă există
   */
  const nextPage = useCallback(() => {
    const newOffset = offset + limit;
    // Verificăm dacă putem avansa la pagina următoare
    if (newOffset < totalItems) {
      setOffset(newOffset);
    }
  }, [offset, limit, totalItems]);

  /**
   * Navighează la pagina anterioară dacă există
   */
  const prevPage = useCallback(() => {
    const newOffset = Math.max(0, offset - limit);
    setOffset(newOffset);
  }, [offset, limit]);

  /**
   * Navighează la o pagină specifică
   */
  const goToPage = useCallback((page: number) => {
    // Ne asigurăm că pagina este în intervalul valid
    const newPage = Math.max(1, Math.min(page, totalPages || 1));
    setOffset((newPage - 1) * limit);
  }, [limit, totalPages]);

  /**
   * Generează parametrii de query pentru API pe baza filtrelor curente
   */
  const queryParams = useMemo<TransactionQueryParams>(() => ({
    type: filterType,
    category: filterCategory,
    limit,
    offset,
    sort
  }), [filterType, filterCategory, limit, offset, sort]);

  // Returnăm starea și metodele
  return {
    // Starea filtrelor
    filterType,
    filterCategory,
    limit,
    offset,
    sort,
    currentPage,
    totalPages,
    
    // Setters pentru filtre
    setFilterType,
    setFilterCategory,
    setLimit,
    setSort,
    
    // Metode pentru navigare
    nextPage,
    prevPage,
    goToPage,
    resetFilters,
    
    // Query params pentru API
    queryParams
  };
};
