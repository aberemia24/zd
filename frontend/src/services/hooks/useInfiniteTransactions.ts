import { useInfiniteQuery } from '@tanstack/react-query';
import { supabaseService } from '../supabaseService';
import type { TransactionPage, Pagination } from '../supabaseService';
import type { TransactionValidated } from '@shared-constants/transaction.schema';
import { TransactionType } from '@shared-constants/enums';
import { useAuthStore } from '../../stores/authStore';

export interface TransactionQueryParams {
  limit?: number;
  offset?: number;
  type?: TransactionType | string;
  category?: string;
  recurring?: boolean;
  startDate?: string;
  endDate?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface UseInfiniteTransactionsResult {
  data: TransactionValidated[];
  pages: TransactionPage[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  totalCount: number;
}

/**
 * Hook specializat pentru încărcarea tranzacțiilor cu paginare infinită
 * Folosește useInfiniteQuery pentru a încărca date pe măsură ce utilizatorul derulează
 * 
 * @param queryParams Parametri pentru filtrare și paginare
 * @returns Rezultatul query-ului cu tranzacții, status și funcții de control pentru paginare
 */
export function useInfiniteTransactions(
  queryParams: TransactionQueryParams
): UseInfiniteTransactionsResult {
  // Obținem userId din store
  const { user } = useAuthStore();
  const userId = user?.id;
  
  // Definim dimensiunea paginii pentru încărcarea pagină cu pagină
  const PAGE_SIZE = queryParams.limit || 10;
  
  // Folosim aceeași cheie de bază ca în transactionMutations.ts pentru a asigura
  // invalidarea corectă a cache-ului la mutații
  const TRANSACTIONS_BASE_KEY = ['transactions'] as const;
  
  // Construim cheia de query extinsă pentru acest hook specific
  const queryKey = [...TRANSACTIONS_BASE_KEY, 'infinite', userId, queryParams];
  
  // Folosim useInfiniteQuery pentru paginare infinită
  const infiniteQuery = useInfiniteQuery<TransactionPage, Error>({
    queryKey,
    initialPageParam: 0, // Parametrul inițial pentru prima pagină (offset 0)
    queryFn: async ({ pageParam }) => {
      // Actualizăm offset-ul bazat pe pageParam pentru paginare infinită
      const pagination: Pagination = {
        limit: PAGE_SIZE,
        offset: pageParam as number,
        sort: queryParams.sort as 'date' | 'amount' | 'created_at' | undefined,
        order: queryParams.order,
      };
      
      const filters = {
        type: queryParams.type as TransactionType | undefined,
        category: queryParams.category,
        recurring: queryParams.recurring,
        dateFrom: queryParams.startDate,
        dateTo: queryParams.endDate,
      };
      
      return supabaseService.fetchTransactions(userId, pagination, filters);
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
    // Configurări pentru comportamentul cache-ului
    gcTime: 5 * 60 * 1000, // 5 minute
    staleTime: 30 * 1000, // 30 secunde
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 3,
    enabled: !!userId, // Activăm query-ul doar dacă userId este disponibil
  });
  
  // Extragem și combinăm toate tranzacțiile din toate paginile pentru afișare
  const allTransactions = infiniteQuery.data?.pages.flatMap(page => page.data) || [];
  
  // Calculăm numărul total de tranzacții din rezultatele paginii
  const totalCount = infiniteQuery.data?.pages[0]?.count || 0;
  
  return {
    data: allTransactions,
    pages: infiniteQuery.data?.pages || [],
    isLoading: infiniteQuery.isLoading,
    isFetching: infiniteQuery.isFetching,
    error: infiniteQuery.error,
    hasNextPage: infiniteQuery.hasNextPage || false,
    fetchNextPage: infiniteQuery.fetchNextPage,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    totalCount,
  };
}
