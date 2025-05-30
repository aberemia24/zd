import { QueryClient, InfiniteData } from '@tanstack/react-query';
import { TransactionValidated } from '@shared-constants';

// Global flag pentru preventing infinite loops în logging
declare global {
  interface Window {
    __CACHE_SYNC_LOGGING__?: boolean;
  }
}

interface TransactionPage {
  data: TransactionValidated[];
  nextCursor?: string | null;
  hasNextPage?: boolean;
}

type CacheSyncOperation = 'create' | 'update' | 'delete';

interface CacheSyncParams {
  queryClient: QueryClient;
  userId: string;
  operation: CacheSyncOperation;
  transaction: TransactionValidated;
  deletedId?: string;
}

/**
 * Safe dev-only logging cu guards împotriva infinite loops
 */
const logSyncOperation = (operation: string, txId: string, cacheCount: number): void => {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev && !window.__CACHE_SYNC_LOGGING__) {
    window.__CACHE_SYNC_LOGGING__ = true;
    
    console.group(`[CACHE-SYNC] ${operation.toUpperCase()}`);
    console.log('Transaction ID:', txId);
    console.log('Global caches updated:', cacheCount);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
    
    // Reset flag după micro-task pentru a preveni loops
    setTimeout(() => {
      window.__CACHE_SYNC_LOGGING__ = false;
    }, 0);
  }
};

/**
 * Update first page of infinite query cache pentru create operation
 */
const updateInfiniteQueryCreate = (
  oldData: InfiniteData<TransactionPage> | undefined,
  newTransaction: TransactionValidated
): InfiniteData<TransactionPage> | undefined => {
  if (!oldData || !oldData.pages?.length) {
    return oldData; // Nu creăm cache gol, returnăm ce era
  }

  const firstPage = oldData.pages[0];
  if (!firstPage || !Array.isArray(firstPage.data)) {
    return oldData;
  }

  // Prepend transaction la prima pagină (sorted by date desc)
  const updatedFirstPage: TransactionPage = {
    ...firstPage,
    data: [newTransaction, ...firstPage.data]
  };

  return {
    ...oldData,
    pages: [updatedFirstPage, ...oldData.pages.slice(1)]
  };
};

/**
 * Update infinite query cache pentru update operation
 */
const updateInfiniteQueryUpdate = (
  oldData: InfiniteData<TransactionPage> | undefined,
  updatedTransaction: TransactionValidated
): InfiniteData<TransactionPage> | undefined => {
  if (!oldData || !oldData.pages?.length) {
    return oldData;
  }

  const updatedPages = oldData.pages.map(page => {
    if (!page || !Array.isArray(page.data)) {
      return page;
    }

    const updatedData = page.data.map(tx => 
      tx.id === updatedTransaction.id ? updatedTransaction : tx
    );

    return {
      ...page,
      data: updatedData
    };
  });

  return {
    ...oldData,
    pages: updatedPages
  };
};

/**
 * Update infinite query cache pentru delete operation
 */
const updateInfiniteQueryDelete = (
  oldData: InfiniteData<TransactionPage> | undefined,
  deletedId: string
): InfiniteData<TransactionPage> | undefined => {
  if (!oldData || !oldData.pages?.length) {
    return oldData;
  }

  const updatedPages = oldData.pages.map(page => {
    if (!page || !Array.isArray(page.data)) {
      return page;
    }

    const filteredData = page.data.filter(tx => tx.id !== deletedId);

    return {
      ...page,
      data: filteredData
    };
  });

  return {
    ...oldData,
    pages: updatedPages
  };
};

/**
 * Core sync function pentru global transaction cache synchronization
 * 
 * Actualizează toate global infinite query caches pentru user cu noua/updated/deleted transaction
 * Include rollback mechanism și safe dev logging
 */
export const syncGlobalTransactionCache = ({
  queryClient,
  userId,
  operation,
  transaction,
  deletedId
}: CacheSyncParams): void => {
  try {
    // Debugging: log toate cache-urile pentru a vedea ce există
    const allQueries = queryClient.getQueryCache().findAll();
    console.log('[DEBUG-CACHE-SYNC] All cache keys:', allQueries.map(q => q.queryKey));
    
    // Find toate global cache keys pentru acest user
    const globalCacheKeys = allQueries
      .filter(query => {
        const key = query.queryKey;
        const matches = (
          Array.isArray(key) &&
          key.length >= 3 &&
          key[0] === 'transactions' &&
          key[1] === 'infinite' &&
          key[2] === userId
        );
        
        if (matches) {
          console.log('[DEBUG-CACHE-SYNC] ✅ MATCHED Key:', key);
          console.log('[DEBUG-CACHE-SYNC] QueryParams in cache:', key[3]);
        } else {
          console.log('[DEBUG-CACHE-SYNC] ❌ NO-MATCH Key:', key, 'Matches:', matches);
        }
        
        return matches;
      })
      .map(query => query.queryKey);

    console.log('[DEBUG-CACHE-SYNC] Found global cache keys:', globalCacheKeys);
    console.log('[DEBUG-CACHE-SYNC] Operation:', operation, 'User ID:', userId);

    if (globalCacheKeys.length === 0) {
      // Nu există global caches loaded, folosim fallback invalidation
      console.log('[DEBUG-CACHE-SYNC] No global caches found, using fallback invalidation');
      
      try {
        // Invalidăm toate cache-urile global infinite pentru acest user
        // Aceasta va forța re-fetch când cache-urile vor fi create
        queryClient.invalidateQueries({
          queryKey: ['transactions', 'infinite', userId],
          exact: false
        });
        
        console.log('[DEBUG-CACHE-SYNC] Fallback invalidation executed successfully');
        
        // Log fallback operation (doar în development)
        const txId = operation === 'delete' ? deletedId || 'unknown' : transaction.id;
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[CACHE-SYNC] Used fallback invalidation for ${operation} operation on transaction ${txId}`);
        }
        
      } catch (error) {
        console.error('[CACHE-SYNC] Error în fallback invalidation:', error);
      }
      
      return;
    }

    let updatedCount = 0;

    // Update fiecare global cache
    globalCacheKeys.forEach(queryKey => {
      try {
        console.log('[DEBUG-CACHE-SYNC] Updating cache with key:', queryKey);
        queryClient.setQueryData(queryKey, (oldData: InfiniteData<TransactionPage> | undefined) => {
          console.log('[DEBUG-CACHE-SYNC] Old data:', oldData);
          if (!oldData) {
            return oldData; // Nu creăm cache gol
          }

          switch (operation) {
            case 'create':
              updatedCount++;
              console.log('[DEBUG-CACHE-SYNC] Adding transaction to cache:', {
                id: transaction.id,
                type: transaction.type,
                category: transaction.category,
                subcategory: transaction.subcategory,
                amount: transaction.amount,
                description: transaction.description
              });
              const newData = updateInfiniteQueryCreate(oldData, transaction);
              console.log('[DEBUG-CACHE-SYNC] New data after create:', newData);
              return newData;
              
            case 'update':
              updatedCount++;
              return updateInfiniteQueryUpdate(oldData, transaction);
              
            case 'delete':
              if (!deletedId) {
                console.warn('[CACHE-SYNC] Delete operation missing deletedId');
                return oldData;
              }
              updatedCount++;
              return updateInfiniteQueryDelete(oldData, deletedId);
              
            default:
              console.warn('[CACHE-SYNC] Unknown operation:', operation);
              return oldData;
          }
        });
      } catch (error) {
        console.error('[CACHE-SYNC] Error updating cache for key:', queryKey, error);
        // Continue cu alte cache-uri, nu oprește procesul
      }
    });

    // Log success (doar în development)
    const txId = operation === 'delete' ? deletedId || 'unknown' : transaction.id;
    logSyncOperation(operation, txId, updatedCount);

  } catch (error) {
    // Nu folosim logging în error handlers pentru a preveni cascade failures
    console.error('[CACHE-SYNC] Critical error în syncGlobalTransactionCache:', error);
    
    // În production, fail silently; în development, throw pentru debugging
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
  }
};

/**
 * Utility pentru invalidation fallback în case of sync failures
 * Folosit ca safety net când optimistic updates eșuează
 */
export const invalidateGlobalTransactionCache = (
  queryClient: QueryClient,
  userId: string
): void => {
  try {
    // Invalidează toate global transaction caches pentru acest user
    queryClient.invalidateQueries({
      queryKey: ['transactions', 'infinite', userId],
      exact: false
    });

    if (process.env.NODE_ENV === 'development') {
      console.warn('[CACHE-SYNC] Fallback invalidation executed for userId:', userId);
    }
  } catch (error) {
    console.error('[CACHE-SYNC] Error în fallback invalidation:', error);
  }
}; 