import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabaseService } from "../supabaseService";
import { PAGINATION } from "@shared-constants";
import type { TransactionValidated } from "@shared-constants/transaction.schema";
import { useAuthStore } from "../../stores/authStore";
import { queryKeys, optimizeQueryOptions } from "./reactQueryUtils";
import { useEffect, useCallback } from "react";

// Utilitar pentru formatarea datelor
function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Generează intervalul de date pentru o lună specificată
 * @param year Anul
 * @param month Luna (1-12)
 * @returns Obiect cu datele de început și sfârșit ale lunii
 */
export function getMonthRange(
  year: number,
  month: number,
): { from: string; to: string } {
  const from = `${year}-${pad2(month)}-01`;
  const days = new Date(year, month, 0).getDate();
  const to = `${year}-${pad2(month)}-${pad2(days)}`;
  return { from, to };
}

export interface UseMonthlyTransactionsOptions {
  includeAdjacentDays?: boolean;
  staleTime?: number;
  gcTime?: number;
  // Opțiuni React Query pentru control refresh behavior
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
}

export interface UseMonthlyTransactionsResult {
  transactions: TransactionValidated[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  refetch: () => Promise<any>;
}

/**
 * Hook specializat pentru încărcarea tuturor tranzacțiilor dintr-o lună specifică
 * Spre deosebire de useTransactions, acest hook încarcă toate datele într-o singură cerere
 * și nu implementează paginare infinită.
 *
 * @param year Anul pentru care încărcăm tranzacțiile
 * @param month Luna pentru care încărcăm tranzacțiile (1-12)
 * @param userId ID-ul utilizatorului curent (necesar pentru încărcare)
 * @param options Opțiuni suplimentare pentru query
 * @returns Rezultatul query-ului cu tranzacții, status și funcții de control
 */
export function useMonthlyTransactions(
  year: number,
  month: number,
  userId?: string,
  options: UseMonthlyTransactionsOptions = {},
): UseMonthlyTransactionsResult {
  // Obținem userId din store dacă nu este furnizat explicit
  const { user } = useAuthStore();
  const effectiveUserId = userId || user?.id;
  const {
    includeAdjacentDays = false,
    staleTime = 30 * 1000, // 30 secunde default cache (staleTime)
    gcTime = 5 * 60 * 1000, // 5 minute default pentru garbage collection
    refetchOnWindowFocus = true, // Default React Query behavior
    refetchOnMount = true, // Default React Query behavior  
    refetchOnReconnect = true, // Default React Query behavior
  } = options;

  // Utilizăm queryKeys pentru a genera o cheie standardizată
  const queryKey = queryKeys.transactions.monthly(year, month, effectiveUserId);

  // Folosim useQuery standard (nu infinite) pentru a obține toate datele într-o cerere
  const query = useQuery(
    optimizeQueryOptions(
      {
        queryKey,
        queryFn: async () => {
          // Calculăm intervalul de date pentru luna specificată
          const monthRange = getMonthRange(year, month);

          // Ajustăm intervalul dacă includeAdjacentDays este true
          let dateFrom = monthRange.from;
          let dateTo = monthRange.to;

          if (includeAdjacentDays) {
            // Pentru zilele lunii anterioare (ultimele 6 zile)
            const prevMonthYear = month === 1 ? year - 1 : year;
            const prevMonth = month === 1 ? 12 : month - 1;
            const prevMonthDays = new Date(
              prevMonthYear,
              prevMonth,
              0,
            ).getDate();
            const prevMonthStart = `${prevMonthYear}-${pad2(prevMonth)}-${pad2(Math.max(1, prevMonthDays - 5))}`;

            // Pentru zilele lunii următoare (primele 6 zile)
            const nextMonthYear = month === 12 ? year + 1 : year;
            const nextMonth = month === 12 ? 1 : month + 1;
            const nextMonthEnd = `${nextMonthYear}-${pad2(nextMonth)}-${pad2(6)}`;

            // Ajustăm intervalul
            dateFrom = prevMonthStart;
            dateTo = nextMonthEnd;
          }

          // Facem cererea pentru toate datele din interval
          const result = await supabaseService.fetchTransactions(
            effectiveUserId,
            {
              limit: 1000, // Limită mare pentru a obține toate tranzacțiile
              sort: "date",
            },
            {
              dateFrom,
              dateTo,
            },
          );

          return {
            data: result.data,
            count: result.count,
          };
        },
        staleTime,
        gcTime,
        // Opțiuni pentru control refresh behavior
        refetchOnWindowFocus,
        refetchOnMount,
        refetchOnReconnect,
        // Activăm query-ul doar dacă avem un userId efectiv disponibil și nu este explcit dezactivat
        enabled: true,
      },
      effectiveUserId,
    ),
  );

  // Adaptăm rezultatul la interfața specificată
  return {
    transactions: query.data?.data || [],
    isLoading: query.isLoading || query.isFetching,
    error: query.error as Error | null,
    totalCount: query.data?.count || 0,
    refetch: query.refetch,
  };
}

/**
 * Hook pentru preload inteligent al lunilor adiacente
 * Preîncarcă datele pentru luna anterioară și următoare pentru navigare fluidă
 * 
 * @param currentYear Anul curent afișat
 * @param currentMonth Luna curentă afișată (1-12)
 * @param userId ID-ul utilizatorului curent
 * @param options Opțiuni pentru preload
 */
export function useAdjacentMonthsPreload(
  currentYear: number,
  currentMonth: number,
  userId?: string,
  options: UseMonthlyTransactionsOptions = {},
): void {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const effectiveUserId = userId || user?.id;

  // ✅ FIX: Destructurez opțiunile pentru a evita dependențe volatile
  const { staleTime = 30 * 1000, gcTime = 5 * 60 * 1000 } = options;

  // ✅ FIX: Memoizez funcția de preload pentru a evita recrearea la fiecare render
  const prefetchMonthData = useCallback(async (year: number, month: number) => {
    if (!effectiveUserId) return;
    
    const monthRange = getMonthRange(year, month);
    const queryKey = queryKeys.transactions.monthly(year, month, effectiveUserId);
    
    return queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        const result = await supabaseService.fetchTransactions(
          effectiveUserId,
          {
            limit: 1000,
            sort: "date",
          },
          {
            dateFrom: monthRange.from,
            dateTo: monthRange.to,
          },
        );
        return {
          data: result.data,
          count: result.count,
        };
      },
      staleTime,
      gcTime,
    });
  }, [queryClient, effectiveUserId, staleTime, gcTime]);

  useEffect(() => {
    if (!effectiveUserId) return;

    // Calculăm luna anterioară
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Calculăm luna următoare
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    // ✅ FIX: Folosesc funcția memoizată pentru a evita recrearea constantă
    prefetchMonthData(prevYear, prevMonth);
    prefetchMonthData(nextYear, nextMonth);

    // Debug redus - doar dacă e necesar
    // console.log(`Preloaded adjacent months: ${prevYear}-${prevMonth} și ${nextYear}-${nextMonth}`);
  }, [currentYear, currentMonth, effectiveUserId, prefetchMonthData]); // ✅ FIX: Dependențe clean și stabile
}
