import { useInfiniteQuery } from '@tanstack/react-query';
import { supabaseService } from '../supabaseService';
import type { TransactionPage, Pagination } from '../supabaseService';
import type { TransactionValidated } from '@shared-constants/transaction.schema';
import { TransactionType } from '@shared-constants/enums';
import { useAuthStore } from '../../stores/authStore';
import type { Transaction } from '../../types/Transaction';
import { useMemo } from 'react';

export interface TransactionQueryParams {
  limit?: number;
  offset?: number;
  type?: TransactionType | string;
  category?: string;
  subcategory?: string;
  recurring?: boolean;
  startDate?: string;
  endDate?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface UseInfiniteTransactionsResult {
  data: (TransactionValidated & { userId?: string })[];
  pages: TransactionPage[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  totalCount: number;
  refetch: () => Promise<void>;
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
        subcategory: queryParams.subcategory,
        recurring: queryParams.recurring,
        dateFrom: queryParams.startDate,
        dateTo: queryParams.endDate,
        minAmount: queryParams.minAmount,
        maxAmount: queryParams.maxAmount,
        search: queryParams.search
      };
      
      const result = await supabaseService.fetchTransactions(userId, pagination, filters);
      
      // Nu modificăm tipul datelor returnate din queryFn pentru a evita erorile TypeScript
      return result;
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
    // TODO: Pentru UX avansat, poți implementa manual păstrarea datelor vechi aici
    // placeholderData: undefined,
  });
  
  // Procesăm datele pentru a le face compatibile cu interfața Transaction
  const processedTransactions = useMemo(() => {
    const allTransactions = infiniteQuery.data?.pages.flatMap(page => page.data) || [];
    
    // Adăugăm userId și id (dacă este necesar) la fiecare tranzacție
    return allTransactions.map(transaction => {
      // Folosim tipul any temporar pentru a evita erorile TypeScript
      const anyTransaction = transaction as any;
      
      // Adăugăm userId dacă nu există
      if (!anyTransaction.userId && userId) {
        anyTransaction.userId = userId;
      }
      
      // Adăugăm id bazat pe _id dacă lipsește
      if (anyTransaction._id && !anyTransaction.id) {
        anyTransaction.id = anyTransaction._id;
      }
      
      return anyTransaction;
    });
  }, [infiniteQuery.data, userId]);
  
  // Calculăm numărul total de tranzacții din rezultatele paginii
  const totalCount = infiniteQuery.data?.pages[0]?.count || 0;
  
  // Funcția refetch pentru a reîncărca datele
  const refetch = async () => {
    await infiniteQuery.refetch();
  };
  
  return {
    data: processedTransactions,
    pages: infiniteQuery.data?.pages || [],
    isLoading: infiniteQuery.isLoading,
    isFetching: infiniteQuery.isFetching,
    error: infiniteQuery.error,
    hasNextPage: infiniteQuery.hasNextPage || false,
    fetchNextPage: infiniteQuery.fetchNextPage,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    totalCount,
    refetch,
  };
}
