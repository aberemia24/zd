import { create } from 'zustand';
import { TransactionType, CategoryType } from '../constants/enums';
import { PAGINATION } from '../constants/defaults';

export interface TransactionFiltersState {
  filterType?: TransactionType | '';
  filterCategory?: CategoryType | '';
  limit: number;
  offset: number;
  sort: string;
  totalItems: number;

  // Setters
  setFilterType: (type?: TransactionType | '') => void;
  setFilterCategory: (cat?: CategoryType | '') => void;
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;
  setSort: (sort: string) => void;
  setTotalItems: (total: number) => void;
  resetFilters: () => void;

  // Navigare
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;

  // Selectors (funcții pentru testabilitate și uz global)
  getCurrentPage: () => number;
  getTotalPages: () => number;
  getQueryParams: () => {
    type?: TransactionType | '';
    category?: CategoryType | '';
    limit: number;
    offset: number;
    sort: string;
  };
}


export const createTransactionFiltersStore = (): TransactionFiltersState => {
  // State local pentru testabilitate
  let filterType: TransactionType | '' | undefined = undefined;
  let filterCategory: CategoryType | '' | undefined = undefined;
  let limit: number = PAGINATION.DEFAULT_LIMIT;
  let offset: number = PAGINATION.DEFAULT_OFFSET;
  let sort: string = PAGINATION.DEFAULT_SORT;
  let totalItems: number = 0;

  return {
    get filterType() { return filterType; },
    get filterCategory() { return filterCategory; },
    get limit() { return limit; },
    get offset() { return offset; },
    get sort() { return sort; },
    get totalItems() { return totalItems; },

    setFilterType: (type) => {
      filterType = type;
      offset = 0;
    },
    setFilterCategory: (cat) => {
      filterCategory = cat;
      offset = 0;
    },
    setLimit: (val) => { limit = val; },
    setOffset: (val) => { offset = val; },
    setSort: (val) => { sort = val; },
    setTotalItems: (val) => { totalItems = val; },
    resetFilters: () => {
      filterType = undefined;
      filterCategory = undefined;
      limit = PAGINATION.DEFAULT_LIMIT;
      offset = PAGINATION.DEFAULT_OFFSET;
      sort = PAGINATION.DEFAULT_SORT;
    },
    nextPage: () => {
      const newOffset = offset + limit;
      if (newOffset < totalItems) {
        offset = newOffset;
      }
    },
    prevPage: () => {
      const newOffset = Math.max(0, offset - limit);
      offset = newOffset;
    },
    goToPage: (page) => {
      const totalPages = Math.ceil(totalItems / limit) || 1;
      const newPage = Math.max(1, Math.min(page, totalPages));
      offset = (newPage - 1) * limit;
    },
    getCurrentPage: () => Math.floor(offset / limit) + 1,
    getTotalPages: () => Math.ceil(totalItems / limit) || 1,
    getQueryParams: () => ({
      type: filterType,
      category: filterCategory,
      limit,
      offset,
      sort
    })
  };
};


// Store global Zustand pentru aplicație (uz real)
export const useTransactionFiltersStore = create<TransactionFiltersState>(() => createTransactionFiltersStore());
