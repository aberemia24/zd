// [2025-04] Store migrat pentru a folosi supabaseService (nu mai folosește TransactionService)
import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { supabaseService } from '../services/supabaseService';
import type { TransactionValidated, CreateTransaction } from '@shared-constants/transaction.schema';
import { TransactionType } from '@shared-constants/enums';
import type { TransactionQueryParams, TransactionFormWithNumberAmount } from '../types/transaction';
import { PAGINATION, MESAJE } from '@shared-constants';
import { useAuthStore } from './authStore';

// Timp pentru time-to-live al cache-ului (15 minute)
const CACHE_TTL = 15 * 60 * 1000; // 15 minute în milisecunde

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
  }>;
  
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
  monthlyCache: {},   // Cache gol inițial
  // Eliminat transactionService

  
  // Setters
  setTransactions: (transactions: TransactionValidated[]) => set({ transactions }),
  setTotal: (total: number) => set({ total }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  // Setter pentru parametri query - atenție: NU face fetch automat
  // Acest pattern respectă regula critică din memorie (anti-pattern useEffect + fetchTransactions)
  setQueryParams: (params: TransactionQueryParamsWithRecurring) => {
    // IMPORTANT: Doar setăm parametrii, NU declanșăm fetch automat!
    // Acest lucru previne bucle infinite (vezi memorie d7b6eb4b-0702-4b0a-b074-3915547a2544)
    set({ currentQueryParams: params });
    // Cel care apelează setQueryParams trebuie să apeleze explicit fetchTransactions dacă dorește fetch
  },
  // Eliminat setTransactionService

  
  // Operațiuni asincrone
  // Referință internă pentru caching parametri
  _lastQueryParams: undefined as TransactionQueryParams | undefined,

  // Helper pentru a genera cheia de cache pentru luna/anul specific
  _getCacheKey: (year: number, month: number) => {
    return `${year}-${month.toString().padStart(2, '0')}`;
  },
  
  // Helper pentru invalidarea subtilă a cache-ului pentru o anumită lună/an (fără loading UI)
  _invalidateMonthCache: (year: number, month: number) => {
    const cacheKey = get()._getCacheKey(year, month);
    // Actualizăm lastFetched = 0 pentru a forța re-fetch fără a șterge datele existente
    // Acest lucru menține UI-ul stabil și previne "flickers" sau loading states bruste
    const currentCache = { ...get().monthlyCache };
    if (currentCache[cacheKey]) {
      set({
        monthlyCache: {
          ...currentCache,
          [cacheKey]: {
            ...currentCache[cacheKey],
            lastFetched: 0 // Forțează refresh la următorul fetch, dar păstrează datele vechi până atunci
          }
        }
      });
      console.log(`🔄 Cache invalidated for ${cacheKey}, will refresh on next access`);
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
  
  fetchTransactions: async (forceRefresh = false) => {
    const { currentQueryParams, _lastQueryParams, setError, monthlyCache, _getCacheKey, _getDateInterval } = get();
    
    // Verificăm mai întâi cache-ul pentru luna/anul specific (dacă sunt specificate)
    if (!forceRefresh && currentQueryParams.year && currentQueryParams.month) {
      const cacheKey = _getCacheKey(currentQueryParams.year, currentQueryParams.month);
      const cacheEntry = monthlyCache[cacheKey];
      const now = Date.now();
      
      // Dacă avem date în cache și nu sunt expirate, le folosim
      if (cacheEntry && (now - cacheEntry.lastFetched < CACHE_TTL)) {
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
      
      // Fetch cu filtrele actualizate
      const { data, count } = await supabaseService.fetchTransactions(userId, {
        limit: currentQueryParams.limit,
        offset: currentQueryParams.offset,
        sort: currentQueryParams.sort as any,
        order: 'desc',
      }, filters);
      
      // Actualizăm cache-ul dacă este specificată luna/anul
      if (currentQueryParams.year && currentQueryParams.month) {
        const cacheKey = _getCacheKey(currentQueryParams.year, currentQueryParams.month);
        set({
          transactions: data,
          total: count,
          loading: false,
          monthlyCache: {
            ...get().monthlyCache,
            [cacheKey]: {
              transactions: data,
              lastFetched: Date.now()
            }
          }
        });
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
      
      // Invalidăm cache-ul explicit pentru luna și anul curent dacă sunt disponibile
      const { year, month } = get().currentQueryParams;
      if (year && month) {
        console.log(`🔄 Invalidating cache after transaction save for ${year}-${month}`);
        get()._invalidateMonthCache(year, month);
      }
      
      // Resetăm parametrii de fetch pentru a forța un reload complet
      set({ _lastQueryParams: undefined });
      
      // Folosim setTimeout pentru a preveni actualizările în cascadă conform cu best practice
      // din memoria e0d0698c-ac6d-444f-8811-b1a3936df71b
      setTimeout(() => {
        // Folosim explicit forceRefresh=true pentru a ignora cache-ul
        get().fetchTransactions(true);
      }, 100);
      
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
    monthlyCache: {}, // Resetăm și cache-ul lunar
    // Nu resetăm transactionService pentru a păstra dependency injection
  }),
});

// Folosim doar store-ul simplu fără middleware-uri pentru a testa
export const useTransactionStore = create<TransactionState>(createTransactionStore);
