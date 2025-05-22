import { QueryClient, QueryKey, UseQueryOptions } from '@tanstack/react-query';

/**
 * Generator de chei pentru Query-uri
 * Ajută la standardizarea cheilor pentru React Query și evitarea duplicării
 * 
 * @example
 * const transactionKeys = createQueryKeyFactory('transactions');
 * // Utilizare:
 * const monthlyKey = transactionKeys.monthly(year, month, userId);
 * const detailsKey = transactionKeys.details(transactionId);
 */
export function createQueryKeyFactory<T extends string>(baseKey: T) {
  return {
    /**
     * Cheie de bază pentru toate query-urile acestui tip
     */
    all: [baseKey] as const,
    
    /**
     * Generează o cheie pentru un singur item bazat pe ID
     */
    details: (id: string) => [baseKey, 'detail', id] as const,
    
    /**
     * Generează o cheie pentru o listă filtrată
     */
    list: (filters?: Record<string, unknown>) => [baseKey, 'list', filters] as const,
    
    /**
     * Generează o cheie pentru date lunare
     */
    monthly: (year: number, month: number, userId?: string) => 
      [baseKey, 'monthly', year, month, userId] as const,
      
    /**
     * Generează o cheie pentru o interogare infinită
     */
    infinite: (filters?: Record<string, unknown>) => [baseKey, 'infinite', filters] as const,
    
    /**
     * Generează o cheie pentru un query parametrizat
     */
    withParams: <Params extends Record<string, unknown>>(params: Params) => 
      [baseKey, params] as const
  };
}

// Chei predefinite pentru entitățile principale din aplicație
export const queryKeys = {
  transactions: createQueryKeyFactory('transactions'),
  categories: createQueryKeyFactory('categories'),
  users: createQueryKeyFactory('users'),
  statistics: createQueryKeyFactory('statistics'),
};

/**
 * Optimizează opțiunile pentru query-uri React Query pentru date sensibile la starea autentificării
 * Activează query-ul doar dacă există un userId și aplică timpii de stale/gc configurabili
 * 
 * @param options Opțiuni pentru query
 * @param userId ID-ul utilizatorului
 * @param defaultStaleTime Timp implicit pentru expirarea cache-ului (30 secunde)
 * @param defaultGcTime Timp implicit pentru garbage collection (5 minute)
 * @returns Opțiunile optimizate pentru query
 */
export function optimizeQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'> & {
    queryKey: TQueryKey;
  },
  userId?: string,
  defaultStaleTime = 30 * 1000,
  defaultGcTime = 5 * 60 * 1000
): UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {
  return {
    ...options,
    staleTime: options.staleTime ?? defaultStaleTime,
    gcTime: options.gcTime ?? defaultGcTime,
    enabled: userId !== undefined && (options.enabled !== false)
  };
}

/**
 * Registru de cache pentru memorarea rezultatelor costisitoare
 * Folosit pentru a optimiza calcule intensive care nu necesită re-calcul la fiecare render
 */
export class CacheRegistry<T = any> {
  private cache = new Map<string, { value: T; timestamp: number }>();
  private maxAge: number;

  /**
   * @param maxAgeMs Durata maximă în ms pentru care un item din cache rămâne valid (default: 5 minute)
   */
  constructor(maxAgeMs = 5 * 60 * 1000) {
    this.maxAge = maxAgeMs;
  }

  /**
   * Obține o valoare din cache sau o calculează și o stochează dacă nu există
   * @param key Cheia pentru identificarea valorii în cache
   * @param producer Funcția care produce valoarea dacă nu este în cache
   * @returns Valoarea din cache sau nou calculată
   */
  get(key: string, producer: () => T): T {
    const entry = this.cache.get(key);
    const now = Date.now();

    // Dacă există în cache și nu a expirat, returnează valoarea
    if (entry && now - entry.timestamp < this.maxAge) {
      return entry.value;
    }

    // Altfel, calculează valoarea și actualizează cache-ul
    const value = producer();
    this.cache.set(key, { value, timestamp: now });
    return value;
  }

  /**
   * Invalidează o intrare specifică din cache
   * @param key Cheia intrării de invalidat
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidează tot cache-ul
   */
  clear(): void {
    this.cache.clear();
  }
}

/**
 * Cache-uri pentru diverse tipuri de calcule intensive
 */
export const caches = {
  /**
   * Cache pentru calcule legate de tranzacții
   * Exemplu: transformări de date pentru grids, calcule de sold, etc.
   */
  transactions: new CacheRegistry<any>(2 * 60 * 1000), // 2 minute
  
  /**
   * Cache pentru calcule statistice
   * Exemplu: generarea datelor pentru grafice, rapoarte, etc.
   */
  statistics: new CacheRegistry<any>(5 * 60 * 1000), // 5 minute
};

export default {
  createQueryKeyFactory,
  queryKeys,
  optimizeQueryOptions,
  CacheRegistry,
  caches
}; 