import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  useInfiniteQuery,
  type UseMutationResult, 
  type InfiniteData
} from '@tanstack/react-query';
import { supabaseService } from '../supabaseService';
import type { TransactionPage, Pagination } from '../supabaseService'; // Corectat importul
import type { TransactionQueryParamsWithRecurring } from '../../types/Transaction';
import type { TransactionValidated, CreateTransaction } from '@shared-constants/transaction.schema'; // Corectat și adăugat CreateTransaction
import { useAuthStore } from '../../stores/authStore';

// Tipuri pentru payload-urile mutațiilor (exemple, pot fi ajustate)
// Tipul pentru payload-ul de creare trebuie să fie compatibil cu CreateTransaction din schema
export type CreateTransactionHookPayload = CreateTransaction;
// Tipul pentru payload-ul de update trebuie să fie compatibil cu Partial<CreateTransaction>
export type UpdateTransactionHookPayload = Partial<CreateTransaction>;

export interface UseTransactionsResult {
  // Infinite Query pentru paginare infinită
  data: InfiniteData<TransactionPage> | undefined;
  isPending: boolean;
  error: Error | null;
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  // Mutations
  createTransaction: UseMutationResult<TransactionValidated, Error, CreateTransactionHookPayload, unknown>;
  isCreating: boolean;
  updateTransaction: UseMutationResult<TransactionValidated, Error, { id: string; transactionData: UpdateTransactionHookPayload }, unknown>;
  isUpdating: boolean;
  deleteTransaction: UseMutationResult<void, Error, string, unknown>;
  isDeleting: boolean;
}

/**
 * Formatăm numărul la două cifre (ex: 1 -> "01").
 */
function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

/**
 * Obține intervalul de date pentru luna specificată.
 */
function getMonthRange(year: number, month: number): { from: string; to: string } {
  const from = `${year}-${pad2(month)}-01`;
  const days = new Date(year, month, 0).getDate();
  const to = `${year}-${pad2(month)}-${pad2(days)}`;
  return { from, to };
}

// Definiția cheii de bază pentru tranzacții
const TRANSACTIONS_BASE_KEY = 'transactions' as const;

/**
 * Hook pentru fetch și operații CRUD pe tranzacții cu React-Query.
 */
export function useTransactions(
  queryParams: TransactionQueryParamsWithRecurring,
  userId?: string
): UseTransactionsResult {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  // Cheia query-ului depinde și de user.id pentru a se actualiza la schimbarea stării de autentificare.
  // Asigurăm că year și month sunt definite pentru queryKey și getMonthRange
  const year = queryParams.year;
  const month = queryParams.month;

  // Construim array-ul pentru queryKey în mod dinamic, incluzând doar parametrii definiți
  // Acest lucru previne reîncărcarea inutilă când parametrii undefined se schimbă între undefined și undefined
  // Folosim tuplu explicit pentru a rezolva probleme de tipare
  const queryKey = [TRANSACTIONS_BASE_KEY] as const;
  
  // Creăm un obiect pentru restul parametrilor query
  type QueryParams = {
    userId?: string;
    view: 'monthly' | 'all';
    year?: number;
    month?: number;
    pagination: {
      limit: number;
      offset: number;
    };
    filters: {
      type?: string;
      category?: string;
      recurring?: boolean;
    };
  };
  
  // Adaugăm parametrii de filtrare într-un singur obiect pentru a menține tipurile corecte
  const isMonthlyView = !!(year && month);
  const queryParams2: QueryParams = {
    userId: user?.id,
    view: isMonthlyView ? 'monthly' : 'all',
    ...(isMonthlyView ? { year, month } : {}),
    pagination: {
      limit: queryParams.limit || 10,
      offset: queryParams.offset || 0
    },
    filters: {
      ...(queryParams.type ? { type: queryParams.type } : {}),
      ...(queryParams.category ? { category: queryParams.category } : {}),
      ...(queryParams.recurring !== undefined ? { recurring: queryParams.recurring } : {})
    }
  };
  
  // Folosim [baseKey, paramsObject] pattern pentru a evita problemele de tipare
  // și a menține seria lizabilă în React DevTools
  const key = [queryKey[0], queryParams2] as const;
  // getMonthRange va fi apelat doar dacă year și month sunt definite (gestionat de 'enabled')
  // const { from, to } = (year && month) ? getMonthRange(year, month) : { from: undefined, to: undefined };

  // Specificăm tipurile și folosim sintaxa cu obiect pentru useQuery.
  // Adăugăm un id unic pentru query pentru referințe mai ușoare în cache-uri
  const queryId = `transactions-infinite-${user?.id}-${year || 'all'}-${month || 'all'}`;

  // Definim dimensiunea paginii pentru încărcarea pagini cu pagina
  const PAGE_SIZE = queryParams.limit || 10;

  // Folosim useInfiniteQuery pentru a implementa paginare infinită
  const infiniteQuery = useInfiniteQuery<TransactionPage, Error>({
    queryKey: key,
    initialPageParam: 0, // Parametrul inițial pentru prima pagină (offset 0)
    queryFn: async ({ pageParam }) => {
      // Determinăm dacă suntem în modul de filtrare lunară sau în modul general
      const isMonthlyView = !!(year && month);
      
      // Pregătim filtrele de dată doar dacă suntem în modul lunar
      let dateFrom, dateTo;
      if (isMonthlyView) {
        const monthRange = getMonthRange(year!, month!);
        dateFrom = monthRange.from;
        dateTo = monthRange.to;
      }

      // Actualizăm offset-ul bazat pe pageParam pentru paginare infinită
      const pagination: Pagination = {
        limit: PAGE_SIZE,
        offset: pageParam as number, // Cast explicit spre number pentru a respecta tipul Pagination
        sort: queryParams.sort as 'date' | 'amount' | 'created_at' | undefined,
        order: queryParams.order,
      };
      
      const filters = {
        type: queryParams.type,
        category: queryParams.category,
        recurring: queryParams.recurring,
        // Folosim datele din queryParams dacă sunt disponibile, altfel cele calculate din year/month
        // dar doar dacă suntem în modul lunar
        dateFrom: queryParams.startDate || (isMonthlyView ? dateFrom : undefined),
        dateTo: queryParams.endDate || (isMonthlyView ? dateTo : undefined),
      };
      
      return supabaseService.fetchTransactions(user?.id, pagination, filters);
    },
    // Funcția getNextPageParam determină dacă mai există pagini de încărcat și care este următorul pageParam
    getNextPageParam: (lastPage, allPages) => {
      // Calculăm offset-ul curent bazat pe paginile existente și dimensiunea paginii
      const currentOffset = allPages.length * PAGE_SIZE;
      
      // Dacă numărul de rezultate din ultima pagină este mai mic decât dimensiunea paginii,
      // atunci nu mai sunt pagini disponibile
      if (lastPage.data.length < PAGE_SIZE) {
        return undefined; // Nu mai sunt pagini disponibile
      }

      // Dacă am recuperat toate înregistrările conform count-ului total, nu mai sunt pagini disponibile
      if (currentOffset >= lastPage.count) {
        return undefined;
      }

      // Altfel, returnam următorul offset ca pageParam
      return currentOffset;
    },
    // Configurări explicite pentru comportamentul cache-ului
    gcTime: 5 * 60 * 1000, // 5 minute - cât timp rămân datele în cache după ce query-ul devine inactiv
    staleTime: 30 * 1000, // 30 secunde - cât timp sunt considerate datele "fresh" înainte de a fi marcate ca "stale"
    refetchOnWindowFocus: true, // Reîmprospătează datele când utilizatorul revine în aplicație
    refetchOnMount: true, // Reîmprospătează datele când componenta este montată 
    refetchOnReconnect: true, // Reîmprospătează datele când conexiunea la internet este restabilită
    retry: 3, // Numărul de încercări în caz de eroare
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Timp de așteptare între reîncercări (exponential backoff)
    enabled: !!user?.id, // Rulează query doar dacă user.id este disponibil, nu mai depindem de year și month
  });

  // Definim tipul de context pentru mutații pentru a fi compatibil cu InfiniteData
  type MutationContext = {
    previousData: InfiniteData<TransactionPage> | undefined;
  };

  // Create Transaction Mutation
  const createMutation = useMutation<
    TransactionValidated,
    Error,
    CreateTransactionHookPayload,
    MutationContext
  >({
    mutationFn: async (transactionData) => {
      // Folosim user-ul din closure pentru a evita useAuthStore.getState() care încalcă regulile de hooks
      if (!user?.id) throw new Error('User not authenticated for creating transaction.');
      
      // NOTĂ: Schema din backend are coloana user_id (nu userId), iar supabaseService va adăuga intern
      // user_id în tranzacție din useAuthStore.getState().user.id
      
      // Nu trebuie să adăugăm user_id în payload pentru că supabaseService face asta intern
      return supabaseService.createTransaction(transactionData);
    },
    onMutate: async (newTransaction) => {
      // Anulăm orice query în curs pentru a evita suprascrierea update-urilor optimiste
      await queryClient.cancelQueries({ queryKey: key });
      
      // Salvăm starea anterioară
      const previousData = queryClient.getQueryData<InfiniteData<TransactionPage>>(key);
      
      // Creăm un id temporar pentru tranzacția nouă
      const tempId = `temp-${Date.now()}`;
      
      // Simulam o tranzacție validată completă
      const optimisticTransaction: TransactionValidated = {
        id: tempId,
        ...newTransaction,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Actualizăm cache-ul cu noua tranzacție doar dacă avem date existente
      if (previousData && previousData.pages.length > 0) {
        // Clonam paginile existente
        const updatedPages = [...previousData.pages];
        
        // Adaugăm tranzacția nouă în prima pagină
        updatedPages[0] = {
          ...updatedPages[0],
          data: [optimisticTransaction, ...updatedPages[0].data],
          // Incrementăm count pentru noua tranzacție
          count: updatedPages[0].count + 1
        };
        
        // Setăm datele actualizate în cache
        queryClient.setQueryData<InfiniteData<TransactionPage>>(key, {
          ...previousData,
          pages: updatedPages
        });
      }
      
      return { previousData };
    },
    onError: (err, newTransaction, context) => {
      // Resetarea cache-ului la starea anterioară în caz de eroare
      if (context?.previousData) {
        queryClient.setQueryData<InfiniteData<TransactionPage>>(key, context.previousData);
      }
    },
    onSuccess: () => {
      // Invalidăm toate query-urile de tranzacții pentru a asigura reîncărcarea datelor
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_BASE_KEY] });
    },
  });

  // Update Transaction Mutation
  const updateMutation = useMutation<
    TransactionValidated,
    Error,
    { id: string; transactionData: UpdateTransactionHookPayload },
    MutationContext
  >({
    mutationFn: async ({ id, transactionData }) => {
      // supabaseService.updateTransaction așteaptă Partial<CreateTransaction>
      return supabaseService.updateTransaction(id, transactionData);
    },
    onMutate: async ({ id, transactionData }) => {
      // Anulăm orice query în curs pentru a evita suprascrierea update-urilor optimiste
      await queryClient.cancelQueries({ queryKey: key });
      
      // Salvăm starea anterioară
      const previousData = queryClient.getQueryData<InfiniteData<TransactionPage>>(key);
      
      // Dacă avem date în cache, actualizăm optimist
      if (previousData && previousData.pages.length > 0) {
        // Clonăm paginile existente
        const updatedPages = [...previousData.pages];
        
        // Căutăm tranzacția în toate paginile și o actualizăm
        let found = false;
        
        // Parcurgem fiecare pagină și căutăm tranzacția de actualizat
        const newPages = updatedPages.map(page => {
          // Verificăm dacă tranzacția există în această pagină
          const transactionIndex = page.data.findIndex(t => t.id === id);
          
          // Dacă nu am găsit tranzacția în această pagină, returnăm pagina nemodificată
          if (transactionIndex === -1) return page;
          
          // Am găsit tranzacția, marcăm ca găsită
          found = true;
          
          // Clonăm datele paginii
          const newData = [...page.data];
          
          // Actualizăm tranzacția în array
          newData[transactionIndex] = {
            ...newData[transactionIndex],
            ...transactionData,
            updated_at: new Date().toISOString()
          };
          
          // Returnăm pagina actualizată
          return {
            ...page,
            data: newData
          };
        });
        
        // Actualizăm cache-ul doar dacă am găsit tranzacția
        if (found) {
          queryClient.setQueryData<InfiniteData<TransactionPage>>(key, {
            ...previousData,
            pages: newPages
          });
        }
      }
      
      return { previousData };
    },
    onError: (err, updatePayload, context) => {
      // Resetarea cache-ului la starea anterioară în caz de eroare
      if (context?.previousData) {
        queryClient.setQueryData<InfiniteData<TransactionPage>>(key, context.previousData);
      }
    },
    onSuccess: () => {
      // Invalidăm toate query-urile de tranzacții pentru a asigura reîncărcarea datelor
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_BASE_KEY] });
    },
  });

  // Delete Transaction Mutation
  const deleteMutation = useMutation<
    void,
    Error,
    string, // transactionId
    MutationContext
  >({
    mutationFn: async (transactionId) => {
      return supabaseService.deleteTransaction(transactionId);
    },
    onMutate: async (transactionId) => {
      // Anulăm orice query în curs pentru a evita suprascrierea update-urilor optimiste
      await queryClient.cancelQueries({ queryKey: key });
      
      // Salvăm starea anterioară
      const previousData = queryClient.getQueryData<InfiniteData<TransactionPage>>(key);
      
      // Dacă avem date în cache, ștergem optimist tranzacția
      if (previousData && previousData.pages.length > 0) {
        // Clonăm paginile existente
        const updatedPages = [...previousData.pages];
        
        // Căutăm tranzacția în toate paginile și o ștergem
        let found = false;
        let totalRemoved = 0;
        
        // Parcurgem fiecare pagină și căutăm tranzacția de șters
        const newPages = updatedPages.map(page => {
          // Verificăm dacă tranzacția există în această pagină
          const initialLength = page.data.length;
          
          // Filtrez datele pentru a remove tranzacția cu ID-ul specificat
          const newData = page.data.filter(t => t.id !== transactionId);
          
          // Dacă nu am găsit/șters tranzacția în această pagină, returnăm pagina nemodificată
          if (newData.length === initialLength) return page;
          
          // Am găsit și șters tranzacția, marcăm ca găsită și incrementăm contorul
          found = true;
          totalRemoved += initialLength - newData.length;
          
          // Returnăm pagina actualizată cu count decrementat
          return {
            ...page,
            data: newData,
            count: page.count - (initialLength - newData.length)
          };
        });
        
        // Actualizăm cache-ul doar dacă am găsit tranzacția
        if (found) {
          queryClient.setQueryData<InfiniteData<TransactionPage>>(key, {
            ...previousData,
            pages: newPages
          });
        }
      }
      
      return { previousData };
    },
    onError: (err, transactionId, context) => {
      // Resetarea cache-ului la starea anterioară în caz de eroare
      if (context?.previousData) {
        queryClient.setQueryData<InfiniteData<TransactionPage>>(key, context.previousData);
      }
    },
    onSuccess: () => {
      // Invalidăm toate query-urile de tranzacții pentru a asigura reîncărcarea datelor
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_BASE_KEY] });
    },
  });

  return {
    // Proprietăți Infinite Query
    data: infiniteQuery.data,
    isPending: infiniteQuery.isPending,
    error: infiniteQuery.error,
    isFetching: infiniteQuery.isFetching,
    hasNextPage: infiniteQuery.hasNextPage,
    fetchNextPage: infiniteQuery.fetchNextPage,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    // Mutații
    createTransaction: createMutation, // Returnează obiectul de mutație complet
    isCreating: createMutation.isPending,
    updateTransaction: updateMutation, // Returnează obiectul de mutație complet
    isUpdating: updateMutation.isPending,
    deleteTransaction: deleteMutation, // Returnează obiectul de mutație complet
    isDeleting: deleteMutation.isPending,
  };
}
