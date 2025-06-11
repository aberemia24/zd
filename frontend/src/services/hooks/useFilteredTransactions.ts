import {
  useInfiniteTransactions,
  type TransactionQueryParams,
} from "./useInfiniteTransactions";
import { useMemo, useRef } from "react";
import type { TransactionValidated } from "@budget-app/shared-constants/transaction.schema";

/**
 * Tipul de returnare pentru hook-ul useFilteredTransactions
 */
export interface UseFilteredTransactionsResult {
  data: (TransactionValidated & { userId?: string })[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  totalCount: number;
  isFiltered: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook pentru încărcarea tranzacțiilor filtrate cu optimizări de performance:
 * - Caching rezultate cu React Query
 * - Memoizare rezultate
 * - Scrolling infinit păstrat din useInfiniteTransactions
 * - Debounce pentru queries
 *
 * @param queryParams Parametrii de filtrare pentru tranzacții
 * @returns Rezultate filtrate cu metadate (loading, error, etc.)
 */
export function useFilteredTransactions(
  queryParams: TransactionQueryParams,
): UseFilteredTransactionsResult {
  // Folosim hook-ul existent pentru încărcare date paginată
  const {
    data: transactions,
    isLoading,
    isFetching,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    totalCount,
    refetch,
  } = useInfiniteTransactions(queryParams);

  // Ref pentru a păstra datele vechi
  const previousData = useRef<(TransactionValidated & { userId?: string })[]>(
    [],
  );

  // Actualizează doar dacă ai date noi
  if (transactions && transactions.length > 0) {
    previousData.current = transactions;
  }

  // Returnează datele vechi dacă e loading/fetching și nu ai date noi
  const dataToShow =
    (isLoading || isFetching) && (!transactions || transactions.length === 0)
      ? previousData.current
      : transactions;

  console.log('[DEBUG-FILTERED-QUERY] useFilteredTransactions data update:');
  console.log('[DEBUG-FILTERED-QUERY] transactions from infinite:', transactions?.length || 0);
  console.log('[DEBUG-FILTERED-QUERY] dataToShow:', dataToShow?.length || 0);
  console.log('[DEBUG-FILTERED-QUERY] isLoading:', isLoading, 'isFetching:', isFetching);

  // Verifică dacă filtrele sunt active
  const isFiltered = useMemo(() => {
    return !!(
      queryParams.type ||
      queryParams.category ||
      queryParams.startDate ||
      queryParams.endDate ||
      queryParams.minAmount ||
      queryParams.maxAmount ||
      queryParams.search
    );
  }, [queryParams]);

  return {
    data: dataToShow,
    isLoading,
    isFetching,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    totalCount,
    isFiltered,
    refetch,
  };
}
