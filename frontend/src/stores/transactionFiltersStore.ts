import { create } from 'zustand';
import { TransactionType, CategoryType, PAGINATION } from '@shared-constants';

export interface TransactionFiltersState {
  filterType?: TransactionType | '';
  filterCategory?: CategoryType | '';
  limit: number;
  offset: number;
  sort: string;
  totalItems: number;

  setFilterType: (type?: TransactionType | '') => void;
  setFilterCategory: (cat?: CategoryType | '') => void;
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;
  setSort: (sort: string) => void;
  setTotalItems: (total: number) => void;
  resetFilters: () => void;

  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;

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

export const useTransactionFiltersStore = create<TransactionFiltersState>((set, get) => ({
  filterType: '',
  filterCategory: '',
  limit: PAGINATION.DEFAULT_LIMIT,
  offset: PAGINATION.DEFAULT_OFFSET,
  sort: PAGINATION.DEFAULT_SORT,
  totalItems: 0,

  setFilterType: (type) => set({ filterType: type, offset: 0 }),
  setFilterCategory: (cat) => set({ filterCategory: cat, offset: 0 }),
  setLimit: (limit) => set({ limit }),
  setOffset: (offset) => set({ offset }),
  setSort: (sort) => set({ sort }),
  setTotalItems: (total) => set({ totalItems: total }),
  resetFilters: () => set({
    filterType: '',
    filterCategory: '',
    limit: PAGINATION.DEFAULT_LIMIT,
    offset: PAGINATION.DEFAULT_OFFSET,
    sort: PAGINATION.DEFAULT_SORT,
  }),
  nextPage: () => {
    const { offset, limit, totalItems } = get();
    const newOffset = offset + limit;
    if (newOffset < totalItems) {
      set({ offset: newOffset });
    }
  },
  prevPage: () => {
    const { offset, limit } = get();
    const newOffset = Math.max(0, offset - limit);
    set({ offset: newOffset });
  },
  goToPage: (page) => {
    const { limit, totalItems } = get();
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const newPage = Math.max(1, Math.min(page, totalPages));
    set({ offset: (newPage - 1) * limit });
  },
  getCurrentPage: () => {
    const { offset, limit } = get();
    return Math.floor(offset / limit) + 1;
  },
  getTotalPages: () => {
    const { totalItems, limit } = get();
    return Math.ceil(totalItems / limit) || 1;
  },
  getQueryParams: () => {
    const { filterType, filterCategory, limit, offset, sort } = get();
    return { type: filterType, category: filterCategory, limit, offset, sort };
  },
}));
