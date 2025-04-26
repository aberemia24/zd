import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { TransactionService } from '../services/transactionService';
import { Transaction, TransactionQueryParams, TransactionFormWithNumberAmount } from '../types/transaction';
import { PAGINATION } from '../constants/defaults';
import { MESAJE } from '../constants/messages';

/**
 * Interfața pentru starea store-ului de tranzacții
 */
interface TransactionState {
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
 * Definim tipul pentru datele persistate (subset din TransactionState)
 */
type PersistedState = {
  transactions: Transaction[];
  total: number;
  currentQueryParams: TransactionQueryParams;
};

/**
 * Configurare pentru middleware-ul persist
 */
const persistConfig: PersistOptions<TransactionState, PersistedState> = {
  name: 'transaction-storage',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    transactions: state.transactions,
    total: state.total,
    currentQueryParams: state.currentQueryParams,
  }),
};

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
  setTransactions: (transactions) => set({ transactions }),
  setTotal: (total) => set({ total }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setQueryParams: (params) => set({ currentQueryParams: params }),
  setTransactionService: (service) => set({ transactionService: service }),
  
  // Operațiuni asincrone
  // Referință internă pentru caching parametri
  _lastQueryParams: undefined as TransactionQueryParams | undefined,

  fetchTransactions: async (forceRefresh = false) => {
    const { transactionService, currentQueryParams, _lastQueryParams, setError } = get();

    // Caching: nu refetch dacă parametrii identici și fără forceRefresh
    if (!forceRefresh && _lastQueryParams && JSON.stringify(_lastQueryParams) === JSON.stringify(currentQueryParams)) {
      set({ loading: false });
      return;
    }

    set({ loading: true, error: null });

    try {
      // Actualizează referința
      set({ _lastQueryParams: { ...currentQueryParams } });
      const response = await transactionService.getFilteredTransactions(
        currentQueryParams,
        forceRefresh
      );
      set({ 
        transactions: response.data,
        total: response.total,
        loading: false
      });
    } catch (err) {
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
    return get().fetchTransactions(true);
  },
  
  saveTransaction: async (data, id) => {
    const { transactionService } = get();
    let result: Transaction;
    
    try {
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
  
  removeTransaction: async (id) => {
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

/**
 * Store Zustand pentru tranzacții, cu persist și devtools middleware
 * Exportăm versiunea cu middleware-uri pentru producție
 */
export const useTransactionStore = create<TransactionState>()(  
  devtools(
    persist(
      createTransactionStore,
      persistConfig
    ),
    { name: 'TransactionStore' } // Numele pentru devtools
  )
);
