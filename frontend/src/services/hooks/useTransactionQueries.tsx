/**
 * Hooks personalizate pentru interogări legate de tranzacții
 * Utilizează utilitarele avansate React Query pentru optimizări de performanță
 */

import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createQueryKeyFactory,
  getInfiniteQueryOptions,
  cacheConfig,
} from "../reactQueryUtils";
import type { Transaction, TransactionFilters } from "../../types/Transaction";
import { transactionService } from "../transactionService";
import { useMemo } from "react";
import { EXCEL_GRID } from "@budget-app/shared-constants";

// Adaptăm interfața TransactionFilters pentru a fi compatibilă cu Record<string, unknown>
type TransactionFiltersRecord = TransactionFilters & Record<string, unknown>;

// Creăm factory de chei pentru query-urile legate de tranzacții
export const transactionKeys = createQueryKeyFactory("transactions");

/**
 * Hook pentru a obține o singură tranzacție după ID
 */
export function useTransaction(id: string | number) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionService.getTransactionById(id),
    staleTime: cacheConfig.expirationTimes.transactions,
    enabled: !!id,
  });
}

/**
 * Hook pentru a obține lista de tranzacții filtrate
 */
export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: transactionKeys.list(filters as TransactionFiltersRecord),
    queryFn: () => transactionService.getTransactions(filters),
    staleTime: cacheConfig.expirationTimes.transactions,
    // Optimizare pentru a preveni flicker-ul UI la schimbarea filtrelor
    // keepPreviousData este deprecated, folosim placeholderData pentru același efect
    placeholderData: (keepPreviousData) => keepPreviousData,
  });
}

/**
 * Hook pentru infinite loading de tranzacții cu optimizări
 */
export function useInfiniteTransactions(
  filters?: TransactionFilters,
  pageSize: number = 20,
) {
  return useInfiniteQuery({
    queryKey: transactionKeys.infinite(filters as TransactionFiltersRecord),
    queryFn: ({ pageParam = 1 }) =>
      transactionService.getTransactionsPaginated({
        ...filters,
        page: typeof pageParam === 'string' ? parseInt(pageParam, 10) : pageParam,
        pageSize,
      }),
    initialPageParam: 1, // Necesar în noile versiuni de React Query
    getNextPageParam: (lastPage) => {
      // Verificăm dacă mai sunt pagini disponibile
      if (lastPage && 'hasMore' in lastPage && lastPage.hasMore) {
        return (lastPage.page || 1) + 1;
      }
      return undefined;
    },
    staleTime: cacheConfig.expirationTimes.transactions,
    gcTime: 5 * 60 * 1000, // 5 minute
    maxPages: 5, // Limităm numărul de pagini reținute în memorie
  });
}

/**
 * Hook optimizat pentru obținerea tranzacțiilor lunare pentru grid
 * Utilizează memorare internă pentru prevenirea recalculărilor
 */
export function useMonthlyTransactions(
  month: number,
  year: number,
  additionalFilters?: Omit<TransactionFilters, "month" | "year">,
) {
  const queryClient = useQueryClient();

  // Creăm filtrele pentru query
  const filters = useMemo(
    () => ({
      month,
      year,
      ...additionalFilters,
    }),
    [month, year, additionalFilters],
  );

  // Interogăm tranzacțiile folosind filtrele combinate
  const query = useQuery({
    queryKey: transactionKeys.custom("monthly", {
      month,
      year,
      ...additionalFilters,
    }),
    queryFn: () => transactionService.getMonthlyTransactions(filters),
    staleTime: cacheConfig.expirationTimes.transactions,
    // keepPreviousData este deprecated, folosim placeholderData pentru același efect
    placeholderData: (keepPreviousData) => keepPreviousData,
  });

  // Procesăm datele pentru a le grupa pe categorii și subcategorii
  // Memorăm rezultatele pentru a preveni recalculări inutile
  const groupedTransactions = useMemo(() => {
    if (!query.data) return { byCategory: {}, bySubcategory: {} };

    // Grupăm după categorie
    const byCategory: Record<string, Transaction[]> = {};

    // Grupăm după subcategorie
    const bySubcategory: Record<string, Record<string, Transaction[]>> = {};

    // Verificăm dacă avem date și iterăm o singură dată pentru eficiență
    const transactions = Array.isArray(query.data) ? query.data : [];
    transactions.forEach((transaction) => {
      const { category, subcategory } = transaction;

      // Adăugăm la grupul categoriei
      if (!byCategory[category]) {
        byCategory[category] = [];
      }
      byCategory[category].push(transaction);

      // Adăugăm la grupul subcategoriei
      if (!bySubcategory[category]) {
        bySubcategory[category] = {};
      }
      if (!bySubcategory[category][subcategory]) {
        bySubcategory[category][subcategory] = [];
      }
      bySubcategory[category][subcategory].push(transaction);
    });

    return { byCategory, bySubcategory };
  }, [query.data]);

  // Prefetch pentru lunile adiacente pentru experiență îmbunătățită
  const prefetchAdjacentMonths = () => {
    // Prefetch luna următoare
    let nextMonth = month + 1;
    let nextYear = year;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }

    // Prefetch luna anterioară
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }

    // Prefetch în background pentru lunile adiacente
    queryClient.prefetchQuery({
      queryKey: transactionKeys.custom("monthly", {
        month: nextMonth,
        year: nextYear,
      }),
      queryFn: () =>
        transactionService.getMonthlyTransactions({
          ...additionalFilters,
          month: nextMonth,
          year: nextYear,
        }),
      staleTime: cacheConfig.expirationTimes.transactions,
    });

    queryClient.prefetchQuery({
      queryKey: transactionKeys.custom("monthly", {
        month: prevMonth,
        year: prevYear,
      }),
      queryFn: () =>
        transactionService.getMonthlyTransactions({
          ...additionalFilters,
          month: prevMonth,
          year: prevYear,
        }),
      staleTime: cacheConfig.expirationTimes.transactions,
    });
  };

  // Calculăm totaluri pentru categorii și subcategorii
  const totals = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    const subcategoryTotals: Record<string, Record<string, number>> = {};
    let monthTotal = 0;

    // Calculăm totalurile pentru categorii
    Object.keys(groupedTransactions.byCategory).forEach((category) => {
      const transactions = groupedTransactions.byCategory[category];
      const total = transactions.reduce(
        (sum, t) => sum + parseFloat(t.amount.toString()),
        0,
      );
      categoryTotals[category] = total;
      monthTotal += total;

      // Calculăm totalurile pentru subcategorii
      subcategoryTotals[category] = {};
      if (groupedTransactions.bySubcategory[category]) {
        Object.keys(groupedTransactions.bySubcategory[category]).forEach(
          (subcategory) => {
            const subTransactions =
              groupedTransactions.bySubcategory[category][subcategory];
            subcategoryTotals[category][subcategory] = subTransactions.reduce(
              (sum, t) => sum + parseFloat(t.amount.toString()),
              0,
            );
          },
        );
      }
    });

    return { categoryTotals, subcategoryTotals, monthTotal };
  }, [groupedTransactions]);

  // Construim datele pentru grid în formatul așteptat
  const gridData = useMemo(() => {
    const days = EXCEL_GRID.DAYS_IN_MONTH[month - 1];
    const dailyTransactions: Record<number, Transaction[]> = {};

    // Inițializăm array-ul pentru fiecare zi
    for (let day = 1; day <= days; day++) {
      dailyTransactions[day] = [];
    }

    // Populăm tranzacțiile pentru fiecare zi
    if (query.data) {
      const transactions = Array.isArray(query.data) ? query.data : [];
      transactions.forEach((transaction) => {
        const day = new Date(transaction.date).getDate();
        if (dailyTransactions[day]) {
          dailyTransactions[day].push(transaction);
        }
      });
    }

    return dailyTransactions;
  }, [query.data, month]);

  return {
    ...query,
    groupedTransactions,
    gridData,
    totals,
    prefetchAdjacentMonths,
  };
}
