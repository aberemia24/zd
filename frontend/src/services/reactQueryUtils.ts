/**
 * Utilități avansate pentru React Query
 *
 * Acest fișier conține funcții helper pentru gestionarea eficientă a cache-ului React Query,
 * strategii de invalidare, optimizări pentru interogări paralele și secvențiale,
 * și generarea standardizată a cheilor de query.
 */

import {
  QueryClient,
  QueryKey,
  UseQueryOptions,
  UseMutationOptions,
  DefaultOptions,
  QueryFunction,
} from "@tanstack/react-query";
import { CacheRegistry } from "../utils/performanceUtils";

/**
 * Configurare opțiuni implicite optimizate pentru React Query
 */
export const queryClientDefaultOptions: DefaultOptions = {
  queries: {
    // Optimizări generale pentru toate query-urile
    staleTime: 60 * 1000, // 1 minut
    gcTime: 5 * 60 * 1000, // 5 minute (redenumit din cacheTime)
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // exponential backoff with max 30s

    // Performance optimization
    structuralSharing: true,
  },
  mutations: {
    // Default behavior for mutations
    retry: 1,
    retryDelay: 1000,
  },
};

/**
 * Generator standardizat pentru chei query
 * Asigură consistența și structura adecvată a cheilor pentru cache invalidation.
 *
 * @example
 * const todoKeys = createQueryKeyFactory('todos');
 * const key1 = todoKeys.all; // ['todos']
 * const key2 = todoKeys.lists(); // ['todos', 'lists']
 * const key3 = todoKeys.list(1); // ['todos', 'lists', 1]
 * const key4 = todoKeys.detail(1); // ['todos', 'detail', 1]
 */
export function createQueryKeyFactory<T extends string>(baseKey: T) {
  const factory = {
    all: [baseKey] as const,
    lists: () => [baseKey, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [baseKey, "list", ...(filters ? [filters] : [])] as const,
    details: () => [baseKey, "detail"] as const,
    detail: (id: string | number) => [baseKey, "detail", id] as const,
    infinite: (filters?: Record<string, unknown>) =>
      [baseKey, "infinite", ...(filters ? [filters] : [])] as const,

    // Permite extinderea cu chei personalizate
    custom: <K extends string>(subKey: K, ...params: unknown[]) =>
      [baseKey, subKey, ...params] as const,
  };

  return factory;
}

/**
 * Configurare avansată pentru cache
 */
export const cacheConfig = {
  // Timp de expirare cache pentru diferite tipuri de date (în ms)
  expirationTimes: {
    user: 30 * 60 * 1000, // 30 minute pentru date utilizator
    transactions: 5 * 60 * 1000, // 5 minute pentru tranzacții
    categories: 15 * 60 * 1000, // 15 minute pentru categorii
    statistics: 10 * 60 * 1000, // 10 minute pentru statistici
    settings: 60 * 60 * 1000, // 1 oră pentru setări
    metadata: 24 * 60 * 60 * 1000, // 24 ore pentru metadate
  },

  // Prefixe standard pentru cache keys
  keyPrefixes: {
    user: "user",
    transactions: "transactions",
    categories: "categories",
    settings: "settings",
    statistics: "stats",
  },
};

/**
 * Creează o cheie unică pentru identificarea unui query în cache registry
 */
export function createCacheKey(queryKey: QueryKey): string {
  return Array.isArray(queryKey)
    ? queryKey
        .map((segment) =>
          typeof segment === "object"
            ? JSON.stringify(segment)
            : String(segment),
        )
        .join(":")
    : String(queryKey);
}

/**
 * Hook pentru a crea o QueryClient configurată optim pentru aplicație
 */
export function createOptimizedQueryClient(
  customOptions?: DefaultOptions,
): QueryClient {
  return new QueryClient({
    defaultOptions: {
      ...queryClientDefaultOptions,
      ...customOptions,
    },
  });
}

/**
 * Tipuri de refresh pentru cache
 */
export enum CacheRefreshType {
  /** Invalidează cache-ul și declanșează o nouă cerere */
  INVALIDATE = "invalidate",
  /** Resetează complet cache-ul fără a declanșa cereri */
  RESET = "reset",
  /** Actualizează datele în cache fără a declanșa cereri */
  UPDATE = "update",
}

/**
 * Wrapper pentru funcții de query cu suport avansat pentru cache
 * Permite memorarea rezultatelor costisitoare și refolosirea lor
 * între componente sau sesiuni.
 */
export function createCachedQueryFn<TData, TParams extends any[]>(
  queryFn: (...args: TParams) => Promise<TData>,
  options?: {
    /** Cheie de cache pentru CacheRegistry */
    cacheKey?: string | ((...args: TParams) => string);
    /** Timp maxim pentru păstrarea valorii în cache (ms) */
    maxAge?: number;
    /** Transformă rezultatul înainte de caching */
    transformer?: (data: TData) => any;
  },
): (...args: TParams) => Promise<TData> {
  return async (...args: TParams) => {
    if (!options?.cacheKey) {
      // Dacă nu avem cheie de cache, executăm direct funcția
      return queryFn(...args);
    }

    // Generăm cheia de cache
    const key =
      typeof options.cacheKey === "function"
        ? options.cacheKey(...args)
        : `${options.cacheKey}:${JSON.stringify(args)}`;

    // Încercăm să obținem din cache
    try {
      return CacheRegistry.getOrCompute(
        key,
        async () => {
          const result = await queryFn(...args);
          return options.transformer ? options.transformer(result) : result;
        },
        options.maxAge,
      );
    } catch (error) {
      // În caz de eroare cu cache-ul, executăm direct funcția
      console.error("[ReactQueryUtils] Cache error:", error);
      return queryFn(...args);
    }
  };
}

// Definim interfața pentru context-ul mutațiilor pentru a rezolva erorile de tipuri
interface MutationContext<TData> {
  previousData?: TData[] | undefined;
}

/**
 * Construiește opțiuni optimizate pentru queries infinite
 */
// Interfețe pentru paginare
interface PageData {
  nextCursor?: string | number;
  prevCursor?: string | number;
  hasMore?: boolean;
  [key: string]: unknown;
}

export function getInfiniteQueryOptions<TData, TError>(
  options: {
    /** Numărul de pagini care vor fi reținute în memorie */
    maxPages?: number;
    /** Invalidează automat query-ul după o mutație reușită */
    invalidateOnMutation?: boolean;
    /** Dacă să utilizeze strategii optimiste de update */
    optimistic?: boolean;
    /** Custom stale time pentru acest query */
    staleTime?: number;
    /** Timp maxim pentru păstrarea valorii în cache */
    gcTime?: number;
  } = {},
) {
  return {
    staleTime: options.staleTime ?? 60 * 1000, // 1 minut implicit
    gcTime: options.gcTime ?? 5 * 60 * 1000, // 5 minute implicit (redenumit din cacheTime)
    getNextPageParam: (lastPage: PageData, allPages: PageData[]) => {
      // Logică implicită pentru paginare - poate fi suprascrisă
      if (lastPage?.nextCursor) return lastPage.nextCursor;
      if (lastPage?.hasMore === false) return undefined;
      return allPages.length + 1;
    },
    getPreviousPageParam: (firstPage: PageData) => {
      // Logică implicită pentru paginare inversă
      if (firstPage?.prevCursor) return firstPage.prevCursor;
      return undefined;
    },
    maxPages: options.maxPages ?? 5,
  };
}

/**
 * Factory pentru strategii de optimistic updates
 */
export function createOptimisticMutations<TData, TError, TVariables>(
  baseOptions: Partial<
    UseMutationOptions<TData, TError, TVariables, MutationContext<TData>>
  > = {},
) {
  return {
    /**
     * Adaugă un element în array
     */
    addItem: (
      queryClient: QueryClient,
      queryKey: QueryKey,
      newItemFactory: (variables: TVariables) => TData,
    ): UseMutationOptions<
      TData,
      TError,
      TVariables,
      MutationContext<TData>
    > => ({
      ...baseOptions,
      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey });
        const previousData = queryClient.getQueryData<TData[]>(queryKey);

        // Actualizare optimistă
        const newItem = newItemFactory(variables);
        queryClient.setQueryData<TData[]>(queryKey, (old = []) => [
          ...old,
          newItem,
        ]);

        return { previousData };
      },
      onError: (err, variables, context) => {
        // Restaurare date anterioare în caz de eroare
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData);
        }

        if (baseOptions.onError) {
          baseOptions.onError(err, variables, context);
        }
      },
      onSettled: (data, error, variables, context) => {
        // Invalidare query pentru a asigura sincronizarea cu serverul
        queryClient.invalidateQueries({ queryKey: queryKey });

        if (baseOptions.onSettled) {
          baseOptions.onSettled(data, error, variables, context);
        }
      },
    }),

    /**
     * Actualizează un element din array
     */
    updateItem: (
      queryClient: QueryClient,
      queryKey: QueryKey,
      itemId: string | number,
      idField: string = "id",
    ): UseMutationOptions<
      TData,
      TError,
      TVariables,
      MutationContext<TData>
    > => ({
      ...baseOptions,
      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey });
        const previousData = queryClient.getQueryData<TData[]>(queryKey);

        // Actualizare optimistă
        queryClient.setQueryData<TData[]>(queryKey, (old = []) => {
          return old.map((item) =>
            // @ts-ignore - idField access
            item[idField] === itemId ? { ...item, ...variables } : item,
          );
        });

        return { previousData };
      },
      onError: (err, variables, context) => {
        // Restaurare date anterioare în caz de eroare
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData);
        }

        if (baseOptions.onError) {
          baseOptions.onError(err, variables, context);
        }
      },
      onSettled: (data, error, variables, context) => {
        // Invalidare query pentru a asigura sincronizarea cu serverul
        queryClient.invalidateQueries({ queryKey: queryKey });

        if (baseOptions.onSettled) {
          baseOptions.onSettled(data, error, variables, context);
        }
      },
    }),

    /**
     * Șterge un element din array
     */
    removeItem: (
      queryClient: QueryClient,
      queryKey: QueryKey,
      itemId: string | number,
      idField: string = "id",
    ): UseMutationOptions<
      TData,
      TError,
      TVariables,
      MutationContext<TData>
    > => ({
      ...baseOptions,
      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey });
        const previousData = queryClient.getQueryData<TData[]>(queryKey);

        // Actualizare optimistă
        queryClient.setQueryData<TData[]>(queryKey, (old = []) => {
          return old.filter(
            (item) =>
              // @ts-ignore - idField access
              item[idField] !== itemId,
          );
        });

        return { previousData };
      },
      onError: (err, variables, context) => {
        // Restaurare date anterioare în caz de eroare
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData);
        }

        if (baseOptions.onError) {
          baseOptions.onError(err, variables, context);
        }
      },
      onSettled: (data, error, variables, context) => {
        // Invalidare query pentru a asigura sincronizarea cu serverul
        queryClient.invalidateQueries({ queryKey: queryKey });

        if (baseOptions.onSettled) {
          baseOptions.onSettled(data, error, variables, context);
        }
      },
    }),
  };
}

/**
 * Utilitar pentru executarea query-urilor în paralel cu gestiune eficientă a erorilor
 * Acceptă funcții QueryFunction definite de client cu semnătura corectă
 */
export async function executeQueriesInParallel<TResult>(
  queries: Array<{
    key: QueryKey;
    fn: () => Promise<TResult>;
  }>,
  options?: {
    stopOnError?: boolean;
    onError?: (error: Error, index: number) => void;
    abortSignal?: AbortSignal;
  },
): Promise<TResult[]> {
  const { stopOnError = false, onError, abortSignal } = options || {};

  try {
    if (abortSignal?.aborted) {
      throw new Error("Query execution was aborted");
    }

    const queryPromises = queries.map(async ({ fn }, index) => {
      try {
        // Executăm funcția query direct, responsabilitatea formatului parametrilor
        // aparține funcției furnizate de client
        return await fn();
      } catch (error) {
        if (onError) {
          onError(error as Error, index);
        }

        if (stopOnError) {
          throw error;
        }

        // Returnăm null pentru query-uri eșuate dacă nu oprim la erori
        return null;
      }
    });

    const queryResults = await Promise.all(queryPromises);

    return queryResults as TResult[];
  } catch (error) {
    console.error("[ReactQueryUtils] Parallel query execution failed:", error);
    throw error;
  }
}
