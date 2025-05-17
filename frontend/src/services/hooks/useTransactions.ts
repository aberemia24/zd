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

  const key = [...TRANSACTIONS_KEY, year, month, user?.id] as const;
  // getMonthRange va fi apelat doar dacă year și month sunt definite (gestionat de 'enabled')
  // const { from, to } = (year && month) ? getMonthRange(year, month) : { from: undefined, to: undefined };

  // Specificăm tipurile și folosim sintaxa cu obiect pentru useQuery.
  const query = useQuery<TransactionPage, Error, TransactionPage, readonly unknown[]>({
    queryKey: key,
    queryFn: async () => {
      if (!year || !month) {
        // Returnează o structură goală validă dacă year/month nu sunt setate, pentru a nu bloca enabled
        // Dar query-ul nu ar trebui să ruleze oricum datorită condiției enabled de mai jos.
        // Totuși, pentru siguranță și pentru a satisface tipul de retur al queryFn:
        return { data: [], count: 0 }; 
      }
      const { from, to } = getMonthRange(year, month);
      const pagination = {
        limit: queryParams.limit,
        offset: queryParams.offset,
        sort: queryParams.sort as 'date' | 'amount' | 'created_at' | undefined, // Cast explicit dacă e necesar
        order: queryParams.order,
      };
      const filters = {
        type: queryParams.type,
        category: queryParams.category,
        recurring: queryParams.recurring,
        // Folosim datele din queryParams dacă sunt disponibile, altfel cele calculate din year/month
        dateFrom: queryParams.startDate || from,
        dateTo: queryParams.endDate || to,
        // Adaugă alte filtre din queryParams dacă TransactionQueryParamsWithRecurring le include
        // de ex. subcategory, minAmount, maxAmount, search
      };
      return supabaseService.fetchTransactions(user?.id, pagination, filters);
    },
    placeholderData: keepPreviousData,
    enabled: !!(year && month && user?.id), // Rulează query doar dacă year, month și user.id sunt disponibile
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
      queryClient.invalidateQueries({ queryKey: ['transactions', queryParams.year, queryParams.month, user?.id] });
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
      // Folosim user?.id din closure în loc de userId din parametru pentru consistență
      queryClient.invalidateQueries({ queryKey: ['transactions', queryParams.year, queryParams.month, user?.id] });
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
      // Folosim user?.id din closure în loc de userId din parametru pentru consistență
      queryClient.invalidateQueries({ queryKey: ['transactions', queryParams.year, queryParams.month, user?.id] });
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
