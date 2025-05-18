/**
 * [DEPRECATED]
 * Acest hook este DEPRECATED și nu mai trebuie folosit!
 * Toată funcționalitatea a fost migrată în hooks specializate:
 *   - useMonthlyTransactions
 *   - useCreateTransaction
 *   - useUpdateTransaction
 *   - useDeleteTransaction
 *   - useUpdateTransactionStatus
 *
 * Fișier păstrat temporar pentru referință istorică. Va fi șters definitiv după refactorizarea completă.
 *
 * @deprecated
 */

// Tipuri fictive pentru a satisface importurile existente
// Fără a depinde de @shared-constants/transaction.schema
export type CreateTransactionHookPayload = any;
export type UpdateTransactionHookPayload = any;

// Interface fictiv pentru a satisface importurile existente
export interface UseTransactionsResult {
  data: any;
  isPending: boolean;
  error: Error | null;
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  createTransaction: any;
  isCreating: boolean;
  updateTransaction: any;
  isUpdating: boolean;
  deleteTransaction: any;
  isDeleting: boolean;
}

// EMPTY EXPORT pentru a bloca importul accidental
export const useTransactions = (): UseTransactionsResult => {
  throw new Error('Acest hook este DEPRECATED. Folosiți hook-urile specializate în loc.');
  return {} as any;
};
