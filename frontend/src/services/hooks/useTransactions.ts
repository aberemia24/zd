import { useQuery, useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { supabaseService } from '../supabaseService';
import type { TransactionPage } from '../supabaseService'; // Corectat importul
import type { TransactionQueryParamsWithRecurring } from '../../types/Transaction';
import type { TransactionValidated, CreateTransaction } from '@shared-constants/transaction.schema'; // Corectat și adăugat CreateTransaction
import { useAuthStore } from '../../stores/authStore';
import { keepPreviousData } from '@tanstack/react-query';

// Tipuri pentru payload-urile mutațiilor (exemple, pot fi ajustate)
// Tipul pentru payload-ul de creare trebuie să fie compatibil cu CreateTransaction din schema
export type CreateTransactionHookPayload = CreateTransaction;
// Tipul pentru payload-ul de update trebuie să fie compatibil cu Partial<CreateTransaction>
export type UpdateTransactionHookPayload = Partial<CreateTransaction>;

export interface UseTransactionsResult {
  // Query
  data: TransactionPage | undefined;
  isPending: boolean;
  error: Error | null;
  // Mutations
  createTransaction: UseMutationResult<TransactionValidated, Error, CreateTransactionHookPayload, unknown>;
  isCreating: boolean;
  updateTransaction: UseMutationResult<TransactionValidated, Error, { id: string; transactionData: UpdateTransactionHookPayload }, unknown>;
  isUpdating: boolean;
  deleteTransaction: UseMutationResult<void, Error, string, unknown>;
  isDeleting: boolean;
  // Potențial refetch, etc.
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
  const queryId = `transactions-${user?.id}-${year || 'all'}-${month || 'all'}`;

  const query = useQuery<TransactionPage, Error, TransactionPage, readonly unknown[]>({
    queryKey: key,
    queryFn: async () => {
      // Determinăm dacă suntem în modul de filtrare lunară sau în modul general
      const isMonthlyView = !!(year && month);
      
      // Pregătim filtrele de dată doar dacă suntem în modul lunar
      let dateFrom, dateTo;
      if (isMonthlyView) {
        const monthRange = getMonthRange(year!, month!);
        dateFrom = monthRange.from;
        dateTo = monthRange.to;
      }
      
      const pagination = {
        limit: queryParams.limit,
        offset: queryParams.offset,
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
    // Configurări explicite pentru comportamentul cache-ului
    gcTime: 5 * 60 * 1000, // 5 minute - cât timp rămân datele în cache după ce query-ul devine inactiv
    staleTime: 30 * 1000, // 30 secunde - cât timp sunt considerate datele "fresh" înainte de a fi marcate ca "stale"
    refetchOnWindowFocus: true, // Reîmprospătează datele când utilizatorul revine în aplicație
    refetchOnMount: true, // Reîmprospătează datele când componenta este montată 
    refetchOnReconnect: true, // Reîmprospătează datele când conexiunea la internet este restabilită
    retry: 3, // Numărul de încercări în caz de eroare
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Timp de așteptare între reîncercări (exponential backoff)
    placeholderData: keepPreviousData, // Menține datele precedente în UI în timpul încărcării noilor date
    enabled: !!user?.id, // Rulează query doar dacă user.id este disponibil, nu mai depindem de year și month
  });

  // Create Transaction Mutation
  const createMutation = useMutation<
    TransactionValidated,
    Error,
    CreateTransactionHookPayload,
    { previousData: TransactionPage | undefined }
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
      const previousData = queryClient.getQueryData<TransactionPage>(key);
      
      // Creăm un id temporar pentru tranzacția nouă
      const tempId = `temp-${Date.now()}`;
      
      // Simulam o tranzacție validată completă
      const optimisticTransaction: TransactionValidated = {
        id: tempId,
        ...newTransaction,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Actualizăm cache-ul cu noua tranzacție
      if (previousData) {
        queryClient.setQueryData<TransactionPage>(key, {
          ...previousData,
          data: [optimisticTransaction, ...previousData.data],
          // Notă: Ar trebui să actualizăm și count, dar este mai sigur să lăsăm serverul să o facă
        });
      }
      
      return { previousData };
    },
    onError: (err, newTransaction, context) => {
      // Resetarea cache-ului la starea anterioară în caz de eroare
      if (context?.previousData) {
        queryClient.setQueryData<TransactionPage>(key, context.previousData);
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
    { previousData: TransactionPage | undefined }
  >({
    mutationFn: async ({ id, transactionData }) => {
      // supabaseService.updateTransaction așteaptă Partial<CreateTransaction>
      return supabaseService.updateTransaction(id, transactionData);
    },
    onMutate: async ({ id, transactionData }) => {
      // Anulăm orice query în curs pentru a evita suprascrierea update-urilor optimiste
      await queryClient.cancelQueries({ queryKey: key });
      
      // Salvăm starea anterioară
      const previousData = queryClient.getQueryData<TransactionPage>(key);
      
      // Dacă avem date în cache, actualizăm optimist
      if (previousData) {
        queryClient.setQueryData<TransactionPage>(key, {
          ...previousData,
          data: previousData.data.map(transaction => {
            if (transaction.id === id) {
              return {
                ...transaction,
                ...transactionData,
                updated_at: new Date().toISOString()
              };
            }
            return transaction;
          })
        });
      }
      
      return { previousData };
    },
    onError: (err, updatePayload, context) => {
      // Resetarea cache-ului la starea anterioară în caz de eroare
      if (context?.previousData) {
        queryClient.setQueryData<TransactionPage>(key, context.previousData);
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
    { previousData: TransactionPage | undefined }
  >({
    mutationFn: async (transactionId) => {
      return supabaseService.deleteTransaction(transactionId);
    },
    onMutate: async (transactionId) => {
      // Anulăm orice query în curs pentru a evita suprascrierea update-urilor optimiste
      await queryClient.cancelQueries({ queryKey: key });
      
      // Salvăm starea anterioară
      const previousData = queryClient.getQueryData<TransactionPage>(key);
      
      // Dacă avem date în cache, ștergem optimist tranzacția
      if (previousData) {
        queryClient.setQueryData<TransactionPage>(key, {
          ...previousData,
          data: previousData.data.filter(transaction => transaction.id !== transactionId),
          // Notă: Ar trebui să actualizăm și count, dar lăsăm acest lucru backend-ului
        });
      }
      
      return { previousData };
    },
    onError: (err, transactionId, context) => {
      // Resetarea cache-ului la starea anterioară în caz de eroare
      if (context?.previousData) {
        queryClient.setQueryData<TransactionPage>(key, context.previousData);
      }
    },
    onSuccess: () => {
      // Invalidăm toate query-urile de tranzacții pentru a asigura reîncărcarea datelor
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_BASE_KEY] });
    },
  });

  return {
    data: query.data,
    isPending: query.isPending,
    error: query.error,
    createTransaction: createMutation, // Returnează obiectul de mutație complet
    isCreating: createMutation.isPending,
    updateTransaction: updateMutation, // Returnează obiectul de mutație complet
    isUpdating: updateMutation.isPending,
    deleteTransaction: deleteMutation, // Returnează obiectul de mutație complet
    isDeleting: deleteMutation.isPending,
  };
}
