// [2025-04] Store migrat pentru a folosi supabaseService (nu mai folosește TransactionService)
import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { supabaseService } from '../services/supabaseService';
import type { TransactionValidated, CreateTransaction } from '@shared-constants/transaction.schema';
import { TransactionType } from '@shared-constants/enums';
import type { TransactionQueryParams, TransactionFormWithNumberAmount } from '../types/transaction';
import { PAGINATION, MESAJE } from '@shared-constants';
// Patch rapid pentru recurring în query params
export interface TransactionQueryParamsWithRecurring extends TransactionQueryParams {
  recurring?: boolean;
}

/**
 * Interfața pentru starea store-ului de tranzacții
 */
export interface TransactionState {
  // Date
  transactions: TransactionValidated[];
  total: number;
  currentQueryParams: TransactionQueryParamsWithRecurring;
  // Intern: pentru caching parametri fetch
  _lastQueryParams?: TransactionQueryParams;
  
  // Stare UI
  loading: boolean;
  error: string | null;
  
  // Servicii și dependențe
  // Eliminat transactionService: TransactionService;

  
  // Acțiuni - setters
  setTransactions: (transactions: TransactionValidated[]) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setQueryParams: (params: TransactionQueryParamsWithRecurring) => void;
  // Eliminat setTransactionService

  
  // Acțiuni - operațiuni asincrone
  fetchTransactions: (forceRefresh?: boolean) => Promise<void>;
  refresh: () => Promise<void>;
  saveTransaction: (data: TransactionFormWithNumberAmount, id?: string) => Promise<TransactionValidated>;
  removeTransaction: (id: string) => Promise<void>;
  
  // Acțiuni - utilități
  reset: () => void;
}

/**
 * Store Zustand pentru gestionarea stării tranzacțiilor
 * 
 * Responsabilități:
 * - Stocarea tranzacțiilor și metadatelor (total, paginare)
 * - Starea UI (loading, erori)
 * - Comunicarea cu serviciile pentru operațiuni CRUD
 * - Actualizarea automată a datelor când se schimbă condițiile
 * - Persistența locală a stării între sesiuni
 */

/**
 * Creăm store-ul fără middleware-uri pentru a putea fi testat ușor
 * Aceasta ajută și la tipare mai precise în teste
 */
const createTransactionStore: StateCreator<TransactionState> = (set, get) => ({
  // Stare inițială
  transactions: [],
  total: 0,
  currentQueryParams: {
    limit: PAGINATION.DEFAULT_LIMIT,
    offset: PAGINATION.DEFAULT_OFFSET,
    sort: PAGINATION.DEFAULT_SORT
  },
  loading: false,
  error: null,
  // Eliminat transactionService

  
  // Setters
  setTransactions: (transactions: TransactionValidated[]) => set({ transactions }),
  setTotal: (total: number) => set({ total }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  // Actualizat pentru a declanșa fetchTransactions automat după schimbarea parametrilor
  setQueryParams: async (params: TransactionQueryParamsWithRecurring) => {
    set({ currentQueryParams: params });
    await get().fetchTransactions();
  },
  // Eliminat setTransactionService

  
  // Operațiuni asincrone
  // Referință internă pentru caching parametri
  _lastQueryParams: undefined as TransactionQueryParams | undefined,

  fetchTransactions: async (forceRefresh = false) => {
    const { currentQueryParams, _lastQueryParams, setError } = get();
    // Caching: nu refetch dacă parametrii identici și fără forceRefresh
    if (!forceRefresh && _lastQueryParams && JSON.stringify(_lastQueryParams) === JSON.stringify(currentQueryParams)) {
      set({ loading: false });
      return;
    }
    set({ loading: true, error: null });
    try {
      set({ _lastQueryParams: { ...currentQueryParams } });
      // Adaptare la supabaseService
      const { data, count } = await supabaseService.fetchTransactions('', {
        limit: currentQueryParams.limit,
        offset: currentQueryParams.offset,
        sort: currentQueryParams.sort as any,
        order: 'desc',
      }, {
        type: currentQueryParams.type as TransactionType,
        category: currentQueryParams.category,
        recurring: currentQueryParams.recurring,
      });
      set({
        transactions: data,
        total: count,
        loading: false
      });
    } catch (err) {
      set({
        transactions: [],
        total: 0,
        loading: false,
        error: MESAJE.EROARE_INCARCARE_TRANZACTII
      });
    }
  },
  
  refresh: async () => {
    // Previne apeluri multiple care pot declanșa buclă infinită
    if (get().loading) return;
    console.log('🔄 transactionStore.refresh called');
    set({ loading: true });
    try {
      await get().fetchTransactions(true);
    } finally {
      set({ loading: false });
    }
  },
  
  saveTransaction: async (data: TransactionFormWithNumberAmount, id?: string) => {
    try {
      let result: TransactionValidated;
      if (id) {
        result = await supabaseService.updateTransaction(id, data as any);
      } else {
        result = await supabaseService.createTransaction(data as any);
      }
      set({ _lastQueryParams: undefined });
      await get().fetchTransactions();
      return result;
    } catch (err) {
      set({ error: MESAJE.EROARE_SALVARE_TRANZACTIE });
      throw err;
    }
  },
  
  removeTransaction: async (id: string) => {
    try {
      await supabaseService.deleteTransaction(id);
      set({ _lastQueryParams: undefined });
      await get().fetchTransactions();
    } catch (err) {
      set({ error: MESAJE.EROARE_STERGERE_TRANZACTIE });
      throw err;
    }
  },
  
  // Utilități
  reset: () => set({
    transactions: [],
    total: 0,
    currentQueryParams: {
      limit: PAGINATION.DEFAULT_LIMIT,
      offset: PAGINATION.DEFAULT_OFFSET,
      sort: PAGINATION.DEFAULT_SORT
    },
    loading: false,
    error: null,
    _lastQueryParams: undefined,
    // Nu resetăm transactionService pentru a păstra dependency injection
  }),
});

// Folosim doar store-ul simplu fără middleware-uri pentru a testa
export const useTransactionStore = create<TransactionState>(createTransactionStore);
