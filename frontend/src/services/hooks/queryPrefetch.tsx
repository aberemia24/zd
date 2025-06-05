import { QueryClient } from "@tanstack/react-query";
import { supabaseService } from "../supabaseService";

/**
 * Interval de timp pentru stale cache (30 secunde)
 */
const DEFAULT_STALE_TIME = 30 * 1000;

/**
 * Interval de timp pentru garbage collection (5 minute)
 */
const DEFAULT_GC_TIME = 5 * 60 * 1000;

/**
 * Prefetchează datele pentru luna curentă
 *
 * @param queryClient Instanța QueryClient React Query
 * @param userId ID-ul utilizatorului autentificat
 * @returns Promise care se rezolvă când datele sunt prefetchate
 */
export async function prefetchCurrentMonthData(
  queryClient: QueryClient,
  userId: string,
): Promise<void> {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  // Cheie pentru query-ul de prefetch
  const queryKey = ["transactions", "monthly", year, month, userId, false];

  // Generăm intervalul de date pentru luna curentă
  const dateFrom = `${year}-${String(month).padStart(2, "0")}-01`;
  const days = new Date(year, month, 0).getDate();
  const dateTo = `${year}-${String(month).padStart(2, "0")}-${String(days).padStart(2, "0")}`;

  // Verificăm dacă avem deja datele în cache
  const cachedData = queryClient.getQueryData(queryKey);
  if (cachedData) {
    return;
  }

  // Prefetchăm datele pentru luna curentă
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      const result = await supabaseService.fetchTransactions(
        userId,
        { limit: 1000, sort: "date" },
        { dateFrom, dateTo },
      );
      return {
        data: result.data,
        count: result.count,
      };
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
}

/**
 * Prefetchează datele pentru categorii
 *
 * @param queryClient Instanța QueryClient React Query
 * @param userId ID-ul utilizatorului autentificat
 * @returns Promise care se rezolvă când datele sunt prefetchate
 */
export async function prefetchCategories(
  queryClient: QueryClient,
  userId: string,
): Promise<void> {
  // Cheie pentru query-ul de prefetch
  const queryKey = ["categories", userId];

  // Verificăm dacă avem deja datele în cache
  const cachedData = queryClient.getQueryData(queryKey);
  if (cachedData) {
    return;
  }

  // Prefetchăm datele pentru categorii
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return supabaseService.fetchUserCategories(userId);
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
}

/**
 * Prefetchează toate datele esențiale pentru UI
 *
 * @param queryClient Instanța QueryClient React Query
 * @param userId ID-ul utilizatorului autentificat
 * @returns Promise care se rezolvă când toate datele sunt prefetchate
 */
export async function prefetchEssentialData(
  queryClient: QueryClient,
  userId: string,
): Promise<void> {
  if (!userId) {
    return;
  }

  try {
    // Prefetchăm toate datele în paralel pentru performanță optimă
    await Promise.all([
      prefetchCurrentMonthData(queryClient, userId),
      prefetchCategories(queryClient, userId),
    ]);
  } catch (error) {
    // Tratăm erorile silențios pentru a nu bloca UI-ul
    // În producție am putea să le logăm într-un serviciu de monitorizare
  }
}

/**
 * Invalidează toate datele din cache pentru un anumit utilizator
 * Util când utilizatorul se deloghează sau când se schimbă contextul
 *
 * @param queryClient Instanța QueryClient React Query
 * @param userId ID-ul utilizatorului autentificat
 */
export function invalidateUserData(
  queryClient: QueryClient,
  userId: string,
): void {
  if (!userId) {
    return;
  }

  // Invalidăm toate query-urile pentru tranzacții
  queryClient.invalidateQueries({ queryKey: ["transactions"] });

  // Invalidăm toate query-urile pentru categorii
  queryClient.invalidateQueries({ queryKey: ["categories"] });
}

export default {
  prefetchCurrentMonthData,
  prefetchCategories,
  prefetchEssentialData,
  invalidateUserData,
};
