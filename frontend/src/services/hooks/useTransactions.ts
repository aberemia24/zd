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

const TRANSACTIONS_KEY = ['transactions'] as const;

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

  // Includem toți parametrii de paginare și filtrare în queryKey pentru a asigura reîncărcarea datelor la schimbarea acestora
  const key = [
    ...TRANSACTIONS_KEY, 
    year, 
    month, 
    user?.id,
    queryParams.limit,
    queryParams.offset,
    queryParams.type,
    queryParams.category,
    queryParams.recurring
  ] as const;
  // getMonthRange va fi apelat doar dacă year și month sunt definite (gestionat de 'enabled')
  // const { from, to } = (year && month) ? getMonthRange(year, month) : { from: undefined, to: undefined };

  // Specificăm tipurile și folosim sintaxa cu obiect pentru useQuery.
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
    placeholderData: keepPreviousData,
    enabled: !!user?.id, // Rulează query doar dacă user.id este disponibil, nu mai depindem de year și month
  });

  // Create Transaction Mutation
  const createMutation = useMutation<
    TransactionValidated,
    Error,
    CreateTransactionHookPayload 
  >({
    mutationFn: async (transactionData) => {
      // Folosim user-ul din closure pentru a evita useAuthStore.getState() care încalcă regulile de hooks
      if (!user?.id) throw new Error('User not authenticated for creating transaction.');
      
      // NOTĂ: Schema din backend are coloana user_id (nu userId), iar supabaseService va adăuga intern
      // user_id în tranzacție din useAuthStore.getState().user.id
      
      // Nu trebuie să adăugăm user_id în payload pentru că supabaseService face asta intern
      return supabaseService.createTransaction(transactionData);
    },
    onSuccess: () => {
      // Invalidăm toate query-urile de tranzacții pentru a asigura reîncărcarea datelor
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
    },
  });

  // Update Transaction Mutation
  const updateMutation = useMutation<
    TransactionValidated,
    Error,
    { id: string; transactionData: UpdateTransactionHookPayload }
  >({
    mutationFn: async ({ id, transactionData }) => {
      // supabaseService.updateTransaction așteaptă Partial<CreateTransaction>
      return supabaseService.updateTransaction(id, transactionData);
    },
    onSuccess: () => {
      // Invalidăm toate query-urile de tranzacții pentru a asigura reîncărcarea datelor
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
    },
  });

  // Delete Transaction Mutation
  const deleteMutation = useMutation<
    void,
    Error,
    string // transactionId
  >({
    mutationFn: async (transactionId) => {
      return supabaseService.deleteTransaction(transactionId);
    },
    onSuccess: () => {
      // Invalidăm toate query-urile de tranzacții pentru a asigura reîncărcarea datelor
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
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
