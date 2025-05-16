// [2025-04] Store migrat pentru a folosi supabaseService (nu mai folosește TransactionService)
import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { supabaseService } from '../services/supabaseService';
import type { TransactionValidated } from '@shared-constants/transaction.schema';
import { TransactionType } from '@shared-constants/enums';
import type { TransactionQueryParams, TransactionFormWithNumberAmount } from '../types/transaction';
import { PAGINATION, MESAJE } from '@shared-constants';
import { useAuthStore } from './authStore';

// Timp pentru time-to-live al cache-ului (15 minute)
const CACHE_TTL = 15 * 60 * 1000; // 15 minute în milisecunde

// Constante pentru retry
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000; // Bază pentru delay exponențial

// Extindere parametri query pentru a include filtrare după lună și an
export interface TransactionQueryParamsWithRecurring extends TransactionQueryParams {
  recurring?: boolean;
  // Parametri noi pentru filtrare după lună/an
  month?: number;
  year?: number;
  includeAdjacentDays?: boolean; // Pentru a include zilele din lunile adiacente
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
  // Cache pentru tranzacții pe luni
  monthlyCache: Record<string, {
    transactions: TransactionValidated[];
    lastFetched: number;
    forceNextFetch?: boolean; // Flag pentru a forța ignorarea cache-ului la următorul fetch
  }>;

  // State pentru optimistic updates și tracking operații
  pendingTransactions: Record<string, {
    id: string;
    operation: 'add' | 'update' | 'delete';
    timestamp: number;
    status: 'pending' | 'success' | 'error';
  }>;
  
  // Flags pentru prevenirea race conditions
  _isRefreshing: boolean;
  
  // Helper methods pentru cache și interval de date
  _getCacheKey: (year: number, month: number) => string;
  _getDateInterval: (year: number, month: number, includeAdjacent?: boolean) => {
    dateFrom: string;
    dateTo: string;
  };
  _invalidateMonthCache: (year: number, month: number) => void;
  
  // Stare UI
  loading: boolean;
  error: string | null;
  
  // Acțiuni - setters
  setTransactions: (transactions: TransactionValidated[]) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setQueryParams: (params: TransactionQueryParamsWithRecurring) => void;
  
  // Acțiuni - operațiuni asincrone
  fetchTransactions: (forceRefresh?: boolean) => Promise<void>;
  fetchTransactionsWithLock: (forceRefresh?: boolean) => Promise<void>;
  refresh: () => Promise<void>;
  saveTransaction: (data: TransactionFormWithNumberAmount, id?: string) => Promise<TransactionValidated>;
  removeTransaction: (id: string) => Promise<void>;
  reloadAfterTransaction: (year?: number, month?: number) => Promise<void>;
  
  // Acțiuni - utilități
  reset: () => void;
  
  // Utilități pentru persistență
  savePendingState: () => void;
  loadPendingState: () => void;
  resumePendingOperations: () => Promise<void>;
}

/**
 * Utilitar pentru operațiuni cu retry
 */
function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as any).message);
  }
  return 'Eroare necunoscută';
}

const withRetry = async <T>(
  operation: () => Promise<T>,
  isRetryable: (error: any) => boolean,
  maxAttempts = MAX_RETRY_ATTEMPTS
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      // Verificăm dacă eroarea permite retry
      if (!isRetryable(error)) {
        console.log(`❌ Eroare nerecuperabilă, abandonăm: ${getErrorMessage(error)}`);
        throw error;
      }
      if (attempt < maxAttempts) {
        // Delay exponențial între încercări
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`⚠️ Încercare ${attempt}/${maxAttempts} eșuată, reîncercăm în ${delay}ms: ${getErrorMessage(error)}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
};

/**
 * Identifică dacă o eroare este cauzată de probleme de rețea
 */
const isNetworkError = (error: any): boolean => {
  return (
    error?.message?.includes('network') ||
    error?.message?.includes('timeout') ||
    error?.message?.includes('connection') ||
    error?.message?.toLowerCase().includes('offline') ||
    error?.name === 'AbortError'
  );
};

/**
 * Chei pentru localStorage
 */
const PENDING_TRANSACTIONS_KEY = 'budget-app-pending-transactions';

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
  monthlyCache: {},   // Cache gol inițial
  pendingTransactions: {},
  _isRefreshing: false,
  
  // Setters
  setTransactions: (transactions: TransactionValidated[]) => set({ transactions }),
  setTotal: (total: number) => set({ total }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  
  // Setter pentru parametri query
  setQueryParams: (params: TransactionQueryParamsWithRecurring) => {
    set({ currentQueryParams: params });
  },

  // Operațiuni asincrone
  // Referință internă pentru caching parametri
  _lastQueryParams: undefined as TransactionQueryParams | undefined,

  // Helper pentru a genera cheia de cache pentru luna/anul specific
  _getCacheKey: (year: number, month: number) => {
    return `${year}-${month.toString().padStart(2, '0')}`;
  },
  
  // Helper pentru invalidarea completă a cache-ului pentru o anumită lună/an
  _invalidateMonthCache: (year: number, month: number) => {
    const cacheKey = get()._getCacheKey(year, month);
    
    // Ștergem complet intrarea din cache pentru a forța fetch nou
    const newCache = { ...get().monthlyCache };
    
    // Verificăm dacă intrarea există în cache înainte de a șterge
    if (newCache[cacheKey]) {
      delete newCache[cacheKey];
      
      // Resetăm și parametrii anteriori pentru a evita blocajul la a doua verificare
      set({
        monthlyCache: newCache,
        _lastQueryParams: undefined
      });
      
      console.log(`🔄 Cache complet invalidat pentru ${cacheKey}, se va face fetch nou la următorul acces`);
    }
  },
  
  // Helper pentru a genera intervalul de date pentru luna specifică (inclusiv zile adiacente)
  _getDateInterval: (year: number, month: number, includeAdjacent = false) => {
    // Primul și ultimul zi al lunii curente
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    // Adăugăm zile din luna anterioară și următoare dacă se cere
    if (includeAdjacent) {
      // 6 zile înainte de începutul lunii
      const fromDate = new Date(firstDay);
      fromDate.setDate(fromDate.getDate() - 6);
      
      // 6 zile după sfârșitul lunii
      const toDate = new Date(lastDay);
      toDate.setDate(toDate.getDate() + 6);
      
      return {
        dateFrom: fromDate.toISOString().split('T')[0],  // Format YYYY-MM-DD
        dateTo: toDate.toISOString().split('T')[0]
      };
    } else {
      // Doar luna curentă
      return {
        dateFrom: firstDay.toISOString().split('T')[0],
        dateTo: lastDay.toISOString().split('T')[0]
      };
    }
  },
  
  fetchTransactionsWithLock: async (forceRefresh = false) => {
    if (get()._isRefreshing) {
      console.log('🔒 Operație de refresh deja în curs, așteptăm finalizarea');
      return;
    }
    
    set({ _isRefreshing: true });
    try {
      await get().fetchTransactions(forceRefresh);
    } finally {
      set({ _isRefreshing: false });
    }
  },
  
  // Reîncărcarea datelor după o operațiune pe tranzacții
  reloadAfterTransaction: async (year?: number, month?: number) => {
    // 1. Invalidează cache-ul pentru luna specificată dacă e furnizată
    if (year && month) {
      get()._invalidateMonthCache(year, month);
    }
    
    // 2. Așteaptă puțin pentru stabilizarea stării
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // 3. Execută fetch cu forceRefresh=true
    try {
      await get().fetchTransactionsWithLock(true);
    } catch (error) {
      console.error('Eroare la reîncărcarea datelor după tranzacție:', error);
    }
  },
  
  fetchTransactions: async (forceRefresh = false) => {
    console.log(`🔍 fetchTransactions called with forceRefresh=${forceRefresh}, month=${get().currentQueryParams.month}, year=${get().currentQueryParams.year}`);
    const { currentQueryParams, _lastQueryParams, monthlyCache, _getCacheKey, _getDateInterval } = get();
    
    // Verificăm mai întâi cache-ul pentru luna/anul specific (dacă sunt specificate)
    if (!forceRefresh && currentQueryParams.year && currentQueryParams.month) {
      const cacheKey = _getCacheKey(currentQueryParams.year, currentQueryParams.month);
      const cacheEntry = monthlyCache[cacheKey];
      const now = Date.now();
      
      // Dacă avem date în cache, nu sunt expirate, ȘI nu trebuie forțat fetch nou
      if (cacheEntry && 
          (now - cacheEntry.lastFetched < CACHE_TTL) && 
          !cacheEntry.forceNextFetch) { // Verifică dacă nu trebuie forțat fetch nou
        console.log(`🔄 Using cached data for ${cacheKey}`);
        set({ 
          transactions: cacheEntry.transactions, 
          loading: false,
          total: cacheEntry.transactions.length 
        });
        return;
      }
    }
    
    // Cache miss sau forceRefresh - facem fetch nou
    // Caching: nu refetch dacă parametrii identici și fără forceRefresh
    if (!forceRefresh && _lastQueryParams && JSON.stringify(_lastQueryParams) === JSON.stringify(currentQueryParams)) {
      set({ loading: false });
      return;
    }
    
    set({ loading: true, error: null });
    try {
      set({ _lastQueryParams: { ...currentQueryParams } });
      
      // Pregătim parametrii pentru filtrare
      const filters: any = {
        type: currentQueryParams.type as TransactionType,
        category: currentQueryParams.category,
        recurring: currentQueryParams.recurring,
      };
      
      // Adăugăm filtrare pe dată dacă avem luna și anul specificate
      if (currentQueryParams.year && currentQueryParams.month) {
        const dateInterval = _getDateInterval(
          currentQueryParams.year, 
          currentQueryParams.month, 
          currentQueryParams.includeAdjacentDays
        );
        filters.dateFrom = dateInterval.dateFrom;
        filters.dateTo = dateInterval.dateTo;
      }
      
      // Obținem user_id din authStore pentru a respecta RLS Supabase
      const user = useAuthStore.getState().user;
      const userId = user?.id || '';
      
      // Fetch cu filtrele actualizate și retry pentru erori de rețea
      const { data, count } = await withRetry(
        () => supabaseService.fetchTransactions(userId, {
          limit: currentQueryParams.limit,
          offset: currentQueryParams.offset,
          sort: currentQueryParams.sort as any,
          order: 'desc',
        }, filters),
        isNetworkError
      );
      
      // Actualizăm cache-ul dacă este specificată luna/anul
      if (currentQueryParams.year && currentQueryParams.month) {
        const cacheKey = _getCacheKey(currentQueryParams.year, currentQueryParams.month);
        
        // Se adaugă o proprietate nouă "forceNextFetch" temporar (expiră după 500ms)
        // IMPORTANT: Trebuie să setăm și transactions, total și loading
        set({
          transactions: data,
          total: count,
          loading: false,
          monthlyCache: {
            ...get().monthlyCache,
            [cacheKey]: {
              transactions: data,
              lastFetched: Date.now(),
              forceNextFetch: forceRefresh // Marchează că următorul fetch trebuie să ignore cache-ul dacă acesta a fost forțat
            }
          }
        });
        
        // După 500ms, resetăm flag-ul
        if (forceRefresh) {
          setTimeout(() => {
            // Resetăm flag-ul doar dacă cache-ul încă există
            const currentCache = get().monthlyCache;
            if (currentCache[cacheKey]) {
              set({
                monthlyCache: {
                  ...currentCache,
                  [cacheKey]: {
                    ...currentCache[cacheKey],
                    forceNextFetch: false
                  }
                }
              });
              console.log(`🔄 Cache reset forceNextFetch=false pentru ${cacheKey}`);
            }
          }, 500);
        }
      } else {
        // Setăm doar datele fără a actualiza cache-ul
        set({
          transactions: data,
          total: count,
          loading: false
        });
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
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
    
    // Folosim metoda cu lock pentru a preveni race conditions
    await get().fetchTransactionsWithLock(true);
  },
  
  saveTransaction: async (data: TransactionFormWithNumberAmount, id?: string) => {
    // Generăm un ID temporar pentru tranzacțiile noi
    const tempId = id || `temp-${Date.now()}`;
    
    // Adăugăm la pendingTransactions
    set(state => ({
      pendingTransactions: {
        ...state.pendingTransactions,
        [tempId]: {
          id: tempId,
          operation: id ? 'update' : 'add',
          timestamp: Date.now(),
          status: 'pending'
        }
      }
    }));

    // Salvăm starea pentru a putea relua operațiunile nefinalizate
    get().savePendingState();
    
    try {
      // Executăm operația reală cu retry pentru erori de rețea
      let result: TransactionValidated = await withRetry(
        () => id 
          ? supabaseService.updateTransaction(id, data as any)
          : supabaseService.createTransaction(data as any),
        isNetworkError
      );
      
      // Actualizăm starea tranzacției în așteptare
      set(state => {
        const newPending = { ...state.pendingTransactions };
        if (newPending[tempId]) {
          newPending[tempId].status = 'success';
        }
        return { pendingTransactions: newPending };
      });
      
      // Salvăm starea actualizată
      get().savePendingState();
      
      // Invalidăm cache-ul și facem refresh
      const { year, month } = get().currentQueryParams;
      if (year && month) {
        console.log(`🔄 Invalidating cache after transaction save for ${year}-${month}`);
        get()._invalidateMonthCache(year, month);
      }
      
      // Folosim setTimeout pentru a preveni actualizările în cascadă
      setTimeout(() => {
        console.log('🔄 Executare fetchTransactions programat după 300ms');
        get().fetchTransactionsWithLock(true);
      }, 300);
      
      return result;
    } catch (err) {
      // În caz de eroare, marcăm tranzacția ca eșuată
      set(state => {
        const newPending = { ...state.pendingTransactions };
        if (newPending[tempId]) {
          newPending[tempId].status = 'error';
        }
        return { 
          pendingTransactions: newPending,
          error: MESAJE.EROARE_SALVARE_TRANZACTIE 
        };
      });
      
      // Salvăm starea actualizată
      get().savePendingState();
      
      throw err;
    }
  },
  
  removeTransaction: async (id: string) => {
    // Adăugăm la pendingTransactions
    set(state => ({
      pendingTransactions: {
        ...state.pendingTransactions,
        [id]: {
          id,
          operation: 'delete',
          timestamp: Date.now(),
          status: 'pending'
        }
      }
    }));
    
    // Salvăm starea
    get().savePendingState();
    
    try {
      // Executăm ștergerea cu retry pentru erori de rețea
      await withRetry(
        () => supabaseService.deleteTransaction(id),
        isNetworkError
      );
      
      // Actualizăm starea tranzacției în așteptare
      set(state => {
        const newPending = { ...state.pendingTransactions };
        if (newPending[id]) {
          newPending[id].status = 'success';
        }
        return { pendingTransactions: newPending };
      });
      
      // Salvăm starea actualizată
      get().savePendingState();
      
      // Invalidăm cache-ul și facem refresh
      set({ _lastQueryParams: undefined });
      await get().fetchTransactionsWithLock(true);
    } catch (err) {
      // În caz de eroare, marcăm tranzacția ca eșuată
      set(state => {
        const newPending = { ...state.pendingTransactions };
        if (newPending[id]) {
          newPending[id].status = 'error';
        }
        return { 
          pendingTransactions: newPending,
          error: MESAJE.EROARE_STERGERE_TRANZACTIE 
        };
      });
      
      // Salvăm starea actualizată
      get().savePendingState();
      
      throw err;
    }
  },
  
  // Persistență pentru operațiuni nefinalizate
  savePendingState: () => {
    try {
      const pendingTransactions = get().pendingTransactions;
      localStorage.setItem(PENDING_TRANSACTIONS_KEY, JSON.stringify(pendingTransactions));
    } catch (error) {
      console.error('Eroare la salvarea tranzacțiilor în așteptare:', error);
    }
  },
  
  loadPendingState: () => {
    try {
      const stored = localStorage.getItem(PENDING_TRANSACTIONS_KEY);
      if (stored) {
        set({ pendingTransactions: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Eroare la încărcarea tranzacțiilor în așteptare:', error);
    }
  },
  
  resumePendingOperations: async () => {
    const pendingTransactions = get().pendingTransactions;
    const now = Date.now();
    
    // Reluăm doar tranzacțiile mai noi de 24 de ore și cu status 'pending'
    const recentTransactions = Object.entries(pendingTransactions)
      .filter(([_, tx]) => tx.status === 'pending' && now - tx.timestamp < 24 * 60 * 60 * 1000);
    
    if (recentTransactions.length === 0) return;
    
    console.log(`🔄 Reluare ${recentTransactions.length} operațiuni nefinalizate...`);
    
    // Forțăm un refresh pentru a ne asigura că avem datele cele mai recente
    await get().fetchTransactionsWithLock(true);
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
    monthlyCache: {}, // Resetăm și cache-ul lunar
    pendingTransactions: {},
    _isRefreshing: false,
  }),
});

// Folosim doar store-ul simplu fără middleware-uri pentru a testa
export const useTransactionStore = create<TransactionState>(createTransactionStore);

// Inițializăm starea din localStorage la încărcarea aplicației
useTransactionStore.getState().loadPendingState();

// Reluăm operațiunile nefinalizate
useTransactionStore.getState().resumePendingOperations();