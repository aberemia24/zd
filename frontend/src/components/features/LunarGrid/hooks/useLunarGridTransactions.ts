/**
 * Hook specializat pentru încărcarea tranzacțiilor pentru componenta LunarGrid.
 * Funcționează ca un wrapper peste useTransactions, transformând rezultatele infinite
 * în formatul compatibil cu interfața anterioară pentru LunarGrid.
 */

import { useMemo } from 'react';
import { useTransactions } from '../../../../services/hooks/useTransactions';
import type { Transaction } from '../../../../types/Transaction';
import { PAGINATION } from '@shared-constants';

// Paramătri specifici pentru LunarGrid
export interface LunarGridTransactionParams {
  year: number;
  month: number;
  limit?: number;
  includeAdjacentDays?: boolean;
}

// Tipul de rezultat compatibil cu logica actuală din LunarGrid
export interface LunarGridTransactionResult {
  data: Transaction[];
  count: number;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook pentru încărcarea tranzacțiilor pentru LunarGrid.
 * Convertește rezultatele de la useInfiniteQuery într-un format compatibil cu interfața anterioară.
 */
export function useLunarGridTransactions(
  queryParams: LunarGridTransactionParams,
  userId?: string
): LunarGridTransactionResult {
  // Convertăm parametrii specifici LunarGrid în formatul așteptat de useTransactions
  const standardQueryParams = useMemo(() => ({
    year: queryParams.year,
    month: queryParams.month,
    limit: queryParams.limit || PAGINATION.DEFAULT_LIMIT,
    // Nu includem offset pentru că useTransactions va folosi pageParam pentru paginare
  }), [queryParams]);

  // Folosim hook-ul useTransactions care returnează date în format InfiniteData
  const {
    data: infiniteData,
    isPending,
    error,
  } = useTransactions(standardQueryParams, userId);

  // Transformăm toate paginile într-o singură listă plată de tranzacții
  const transactions = useMemo(() => {
    if (!infiniteData?.pages) return [];
    
    // Concatenăm toate paginile într-o singură listă
    return infiniteData.pages.flatMap(page => page.data);
  }, [infiniteData]);

  // Extragem count din prima pagină (conține totalul)
  const count = useMemo(() => {
    if (!infiniteData?.pages || infiniteData.pages.length === 0) return 0;
    
    // Count este același pentru toate paginile și reprezintă totalul
    return infiniteData.pages[0].count;
  }, [infiniteData]);

  // Creăm obiectul de rezultat în formatul așteptat de LunarGrid
  return {
    data: transactions,
    count,
    isLoading: isPending,
    error: error as Error | null,
  };
}
