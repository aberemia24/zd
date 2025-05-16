// Store minimal pentru UI-state tranzacții
// Majoritatea funcționalităților au fost mutate la hooks/useTransactions utilizand React Query
import { create } from 'zustand';
import type { TransactionQueryParamsWithRecurring } from '../types/transaction'; 
import { PAGINATION } from '@shared-constants';

/**
 * Interface minimal pentru state management tranzacții UI
 * Majoritatea funcționalităților de date au fost mutate în React Query (useTransactions hook)
 */
export interface TransactionStateUI {
  /** Parametrii pentru filtrare UI (limit, offset, sort, month, year etc.) */
  currentQueryParams: TransactionQueryParamsWithRecurring;
  
  /** Setează noii parametri pentru filtrare UI */
  setQueryParams: (params: Partial<TransactionQueryParamsWithRecurring>) => void;
  
  /** Resetează parametrii de filtrare UI la valorile default */
  resetQueryParams: () => void;
}

const defaultQueryParams: TransactionQueryParamsWithRecurring = {
  limit: PAGINATION.DEFAULT_LIMIT,
  offset: PAGINATION.DEFAULT_OFFSET,
  sort: PAGINATION.DEFAULT_SORT,
  // month și year vor fi setate de componenta care folosește store-ul
  // Asigură-te că tipul permite ca month și year să fie undefined inițial dacă așa e logica
  // month: undefined, // Exemplu explicit, dacă e necesar
  // year: undefined,  // Exemplu explicit, dacă e necesar
};

/**
 * Store minimal pentru state management tranzacții UI
 * Majoritatea funcționalităților au fost migrate la React Query prin hook-ul useTransactions
 */
export const useTransactionStore = create<TransactionStateUI>((set) => ({
  // State UI pentru filtrare și parametri de interogare
  currentQueryParams: defaultQueryParams,
  
  // Metode UI pentru manipularea parametrilor
  setQueryParams: (params) =>
    set((state) => ({
      currentQueryParams: { ...state.currentQueryParams, ...params },
    })),
  
  resetQueryParams: () => set({ currentQueryParams: defaultQueryParams }),
}));