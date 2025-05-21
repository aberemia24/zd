import { useQuery } from '@tanstack/react-query';
import { useInfiniteTransactions, type TransactionQueryParams } from './useInfiniteTransactions';
import { useMemo } from 'react';
import type { TransactionValidated } from '@shared-constants/transaction.schema';

/**
 * Tipul de returnare pentru hook-ul useFilteredTransactions
 */
export interface UseFilteredTransactionsResult {
  data: TransactionValidated[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  totalCount: number;
  isFiltered: boolean;
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
  queryParams: TransactionQueryParams
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
  } = useInfiniteTransactions(queryParams);
  
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
    data: transactions,
    isLoading,
    isFetching,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    totalCount,
    isFiltered,
  };
} 