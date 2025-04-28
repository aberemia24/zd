import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { TransactionService } from '../services/transactionService';
import type { Transaction, TransactionQueryParams, TransactionFormWithNumberAmount } from '../types/transaction';
import { PAGINATION, MESAJE } from '@shared-constants';

/**
 * Interfața pentru starea store-ului de tranzacții
 */
export interface TransactionState {
  // Date
  transactions: Transaction[];
  total: number;
  currentQueryParams: TransactionQueryParams;
  // Intern: pentru caching parametri fetch
  _lastQueryParams?: TransactionQueryParams;
  
  // Stare UI
  loading: boolean;
  error: string | null;
  
  // Servicii și dependențe
  transactionService: TransactionService;
  
  // Acțiuni - setters
  setTransactions: (transactions: Transaction[]) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setQueryParams: (params: TransactionQueryParams) => void;
  setTransactionService: (service: TransactionService) => void;
  
  // Acțiuni - operațiuni asincrone
  fetchTransactions: (forceRefresh?: boolean) => Promise<void>;
  refresh: () => Promise<void>;
  saveTransaction: (data: TransactionFormWithNumberAmount, id?: string) => Promise<Transaction>;
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
  transactionService: new TransactionService(),
  
  // Setters
  setTransactions: (transactions: Transaction[]) => set({ transactions }),
  setTotal: (total: number) => set({ total }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setQueryParams: (params: TransactionQueryParams) => set({ currentQueryParams: params }),
  setTransactionService: (service: TransactionService) => set({ transactionService: service }),
  
  // Operațiuni asincrone
  // Referință internă pentru caching parametri
  _lastQueryParams: undefined as TransactionQueryParams | undefined,

  fetchTransactions: async (forceRefresh = false) => {
    const { transactionService, currentQueryParams, _lastQueryParams, setError } = get();
    console.log('🔍 fetchTransactions called', { forceRefresh, params: currentQueryParams, lastParams: _lastQueryParams });

    // Caching: nu refetch dacă parametrii identici și fără forceRefresh
    if (!forceRefresh && _lastQueryParams && JSON.stringify(_lastQueryParams) === JSON.stringify(currentQueryParams)) {
      set({ loading: false });
      return;
    }

    set({ loading: true, error: null });

    try {
      console.log('🔄 fetchTransactions starting network call');
      // Actualizează referința
      set({ _lastQueryParams: { ...currentQueryParams } });
      const response = await transactionService.getFilteredTransactions(
        currentQueryParams,
        forceRefresh
      );
      console.log('✅ fetchTransactions success', response);
      set({ 
        transactions: response.data,
        total: response.total,
        loading: false
      });
    } catch (err) {
      console.log('❌ fetchTransactions failed', err);
      console.error(MESAJE.LOG_EROARE_INCARCARE, err);
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
    console.log('💾 saveTransaction called', { data, id });
    const { transactionService } = get();
    
    try {
      let result: Transaction;
      result = await transactionService.saveTransaction(data, id);
      // Resetăm cache-ul pentru a forța reîncărcarea
      set({ _lastQueryParams: undefined });
      // După salvare, reîmprospătăm lista de tranzacții
      await get().fetchTransactions();
      return result;
    } catch (err) {
      console.error(MESAJE.LOG_EROARE_SALVARE, err);
      set({ error: MESAJE.EROARE_SALVARE_TRANZACTIE });
      throw err; // Propagăm eroarea pentru a o putea gestiona în componente
    }
  },
  
  removeTransaction: async (id: string) => {
    const { transactionService } = get();
    
    try {
      await transactionService.removeTransaction(id);
      // Resetăm cache-ul pentru a forța reîncărcarea
      set({ _lastQueryParams: undefined });
      // După ștergere, reîmprospătăm lista de tranzacții
      await get().fetchTransactions();
    } catch (err) {
      console.error(MESAJE.LOG_EROARE_STERGERE, err);
      set({ error: MESAJE.EROARE_STERGERE_TRANZACTIE });
      throw err; // Propagăm eroarea pentru a o putea gestiona în componente
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
