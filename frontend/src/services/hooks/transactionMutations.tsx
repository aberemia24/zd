import { TransactionStatus } from "@budget-app/shared-constants";
import {
    CreateTransaction,
    TransactionValidated,
} from "@budget-app/shared-constants/transaction.schema";
import {
    useMutation,
    useQueryClient,
    type InfiniteData,
} from "@tanstack/react-query";
import { useMutationErrorHandler } from '../../hooks/useErrorHandler';
import type { TransactionPage } from "../supabaseService";
import { supabaseService } from "../supabaseService";
import { syncGlobalTransactionCache } from './cacheSync';

export type CreateTransactionHookPayload = CreateTransaction;
export type UpdateTransactionHookPayload = Partial<CreateTransaction>;

type MutationContext = {
  previousData?: InfiniteData<TransactionPage>;
};

// Definim cheia de query pentru tranzacții
// O definim ca array pentru a fi compatibil cu react-query
const TRANSACTIONS_BASE_KEY = ["transactions"] as const;

// Import tipul pentru monthly transactions result
type MonthlyTransactionsResult = {
  data: TransactionValidated[];
  count: number;
};

/**
 * Hook pentru crearea unei tranzacții noi
 * @returns Obiect cu mutația și funcțiile asociate
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const handleMutationError = useMutationErrorHandler('create', 'transaction', 'TransactionMutations');

  return useMutation<
    TransactionValidated,
    Error,
    CreateTransactionHookPayload,
    MutationContext
  >({
    mutationFn: async (transactionData) => {
      return supabaseService.createTransaction(transactionData);
    },
    onMutate: async (newTransaction) => {
      // Anulăm orice query în curs pentru a evita suprascrierea update-urilor optimiste
      await queryClient.cancelQueries({ queryKey: TRANSACTIONS_BASE_KEY });

      // Salvăm starea anterioară a cache-ului pentru rollback în caz de eroare
      const previousData = queryClient.getQueryData<
        InfiniteData<TransactionPage>
      >(TRANSACTIONS_BASE_KEY);
      // Adăugăm tranzacția optimist la începutul primei pagini
      if (previousData && previousData.pages.length > 0) {
        const firstPage = { ...previousData.pages[0] };
        const optimisticTransaction = {
          id: `temp-${Date.now()}`,
          ...newTransaction,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as TransactionValidated;
        firstPage.data = [optimisticTransaction, ...firstPage.data];
        firstPage.count = (firstPage.count || 0) + 1;
        queryClient.setQueryData<InfiniteData<TransactionPage>>(
          TRANSACTIONS_BASE_KEY,
          {
            ...previousData,
            pages: [firstPage, ...previousData.pages.slice(1)],
          },
        );
      }
      return { previousData };
    },
    onError: (err, newTransaction, context) => {
      // Rollback - restaurăm datele la starea anterioară
      if (context?.previousData) {
        queryClient.setQueryData(TRANSACTIONS_BASE_KEY, context.previousData);
      }

      // Enhanced error handling cu context complet
      handleMutationError(err);
    },
    onSuccess: () => {
      // No global invalidation to avoid grid refresh
    },
  });
}

/**
 * Hook pentru actualizarea unei tranzacții existente
 * @returns Obiect cu mutația și funcțiile asociate
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const handleMutationError = useMutationErrorHandler('update', 'transaction', 'TransactionMutations');

  return useMutation<
    TransactionValidated,
    Error,
    { id: string; transactionData: UpdateTransactionHookPayload },
    MutationContext
  >({
    mutationFn: async ({ id, transactionData }) => {
      return supabaseService.updateTransaction(id, transactionData);
    },
    onMutate: async ({ id, transactionData }) => {
      // Anulăm orice query în curs pentru a evita suprascrierea update-urilor optimiste
      await queryClient.cancelQueries({ queryKey: TRANSACTIONS_BASE_KEY });

      // Salvăm starea anterioară a cache-ului pentru rollback în caz de eroare
      const previousData = queryClient.getQueryData<
        InfiniteData<TransactionPage>
      >(TRANSACTIONS_BASE_KEY);
      if (previousData && previousData.pages) {
        const updatedPages = previousData.pages.map((page) => {
          const transactionIndex = page.data.findIndex((tx) => tx.id === id);
          if (transactionIndex === -1) return page;
          const updatedData = [...page.data];
          updatedData[transactionIndex] = {
            ...updatedData[transactionIndex],
            ...transactionData,
            updated_at: new Date().toISOString(),
          };
          return {
            ...page,
            data: updatedData,
          };
        });
        queryClient.setQueryData<InfiniteData<TransactionPage>>(
          TRANSACTIONS_BASE_KEY,
          {
            ...previousData,
            pages: updatedPages,
          },
        );
      }
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback - restaurăm datele la starea anterioară
      if (context?.previousData) {
        queryClient.setQueryData(TRANSACTIONS_BASE_KEY, context.previousData);
      }

      // Enhanced error handling cu context complet
      handleMutationError(err);
    },
    onSuccess: () => {
      // No global invalidation to avoid grid refresh
    },
  });
}

/**
 * Hook pentru ștergerea unei tranzacții
 * @returns Obiect cu mutația și funcțiile asociate
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const handleMutationError = useMutationErrorHandler('delete', 'transaction', 'TransactionMutations');

  return useMutation<void, Error, string, MutationContext>({
    mutationFn: async (transactionId) => {
      return supabaseService.deleteTransaction(transactionId);
    },
    onMutate: async (transactionId) => {
      // Anulăm orice query în curs pentru a evita suprascrierea update-urilor optimiste
      await queryClient.cancelQueries({ queryKey: TRANSACTIONS_BASE_KEY });

      // Salvăm starea anterioară a cache-ului pentru rollback în caz de eroare
      const previousData = queryClient.getQueryData<
        InfiniteData<TransactionPage>
      >(TRANSACTIONS_BASE_KEY);
      if (previousData && previousData.pages.length > 0) {
        const updatedPages = [...previousData.pages];
        let found = false;
        const newPages = updatedPages.map((page) => {
          const initialLength = page.data.length;
          const newData = page.data.filter((t) => t.id !== transactionId);
          if (newData.length === initialLength) return page;
          found = true;
          return {
            ...page,
            data: newData,
            count: page.count - (initialLength - newData.length),
          };
        });
        if (found) {
          queryClient.setQueryData<InfiniteData<TransactionPage>>(
            TRANSACTIONS_BASE_KEY,
            {
              ...previousData,
              pages: newPages,
            },
          );
        }
      }
      return { previousData };
    },
    onError: (err, transactionId, context) => {
      // Rollback - restaurăm datele la starea anterioară
      if (context?.previousData) {
        queryClient.setQueryData(TRANSACTIONS_BASE_KEY, context.previousData);
      }

      // Enhanced error handling cu context complet
      handleMutationError(err);
    },
    onSuccess: () => {
      // No global invalidation to avoid grid refresh
    },
  });
}

/**
 * Hook pentru actualizarea stării unei tranzacții (ex: schimbare status)
 * @returns Obiect cu mutația și funcțiile asociate
 */
export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient();
  const handleMutationError = useMutationErrorHandler('update', 'transaction_status', 'TransactionMutations');

  return useMutation<
    TransactionValidated,
    Error,
    { id: string; status: TransactionStatus },
    MutationContext
  >({
    mutationFn: async ({ id, status }) => {
      return supabaseService.updateTransaction(id, { status });
    },
    onMutate: async ({ id, status }) => {
      // Anulăm orice query în curs pentru a evita suprascrierea update-urilor optimiste
      await queryClient.cancelQueries({ queryKey: TRANSACTIONS_BASE_KEY });

      // Salvăm starea anterioară a cache-ului pentru rollback în caz de eroare
      const previousData = queryClient.getQueryData<
        InfiniteData<TransactionPage>
      >(TRANSACTIONS_BASE_KEY);

      // Update optimist - actualizăm statusul tranzacției în cache fără a aștepta răspunsul serverului
      if (previousData && previousData.pages) {
        const updatedPages = previousData.pages.map((page: TransactionPage) => {
          // Verificăm dacă tranzacția există în pagina curentă
          const transactionIndex = page.data.findIndex(
            (tx: TransactionValidated) => tx.id === id,
          );

          // Dacă nu există în această pagină, returnăm pagina nemodificată
          if (transactionIndex === -1) return page;

          // Altfel, clonăm pagina și actualizăm statusul tranzacției
          const updatedData = [...page.data];
          updatedData[transactionIndex] = {
            ...updatedData[transactionIndex],
            status,
            updated_at: new Date().toISOString(),
          };

          return {
            ...page,
            data: updatedData,
          };
        });

        // Actualizăm cache-ul cu noile date
        queryClient.setQueryData<InfiniteData<TransactionPage>>(
          TRANSACTIONS_BASE_KEY,
          {
            ...previousData,
            pages: updatedPages,
          },
        );
      }

      return { previousData };
    },
    onSuccess: (data) => {
      // No global invalidation to avoid grid refresh
    },
    onError: (err, variables, context) => {
      // Rollback - restaurăm datele la starea anterioară în caz de eroare
      if (context?.previousData) {
        queryClient.setQueryData(TRANSACTIONS_BASE_KEY, context.previousData);
      }

      // Enhanced error handling cu context complet (înlocuiește throw new Error)
      handleMutationError(err);
    },
  });
}

// Hook-uri specializate pentru operațiuni monthly (FĂRĂ invalidation forțat)
export const useCreateTransactionMonthly = (year: number, month: number, userId?: string) => {
  const queryClient = useQueryClient();
  const monthlyQueryKey = ['transactions', 'monthly', year, month, userId];
  const handleMutationError = useMutationErrorHandler('create', 'transaction_monthly', 'TransactionMutationsMonthly');

  return useMutation({
    mutationFn: async (payload: CreateTransactionHookPayload) => {
      const response = await supabaseService.createTransaction(payload);
      return response;
    },
    onMutate: async (newTransaction) => {
      console.log('🔄 [CREATE-MUTATE] Starting optimistic update for:', {
        amount: newTransaction.amount,
        category: newTransaction.category,
        subcategory: newTransaction.subcategory,
        date: newTransaction.date,
        queryKey: monthlyQueryKey
      });

      // Cancel outgoing refetches pentru a nu rescrie cache-ul optimistic
      await queryClient.cancelQueries({ queryKey: monthlyQueryKey });

      // Snapshot current data
      const previousData = queryClient.getQueryData(monthlyQueryKey);
      console.log('🔍 [CREATE-MUTATE] Previous cache data:', {
        exists: !!previousData,
        size: previousData ? (previousData as any)?.data?.length || 0 : 0
      });

      // Optimistic update cu temporary ID
      const tempTransaction = {
        ...newTransaction,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData(monthlyQueryKey, (old: MonthlyTransactionsResult | undefined) => {
        if (!old) {
          console.log('🔍 [CREATE-MUTATE] No existing cache, creating new with temp transaction');
          return { data: [tempTransaction], count: 1 };
        }

        const newData = {
          data: [...old.data, tempTransaction],
          count: old.count + 1,
        };

        console.log('🔍 [CREATE-MUTATE] Updated cache optimistically:', {
          oldSize: old.data.length,
          newSize: newData.data.length,
          tempId: tempTransaction.id
        });

        return newData;
      });

      return { previousData };
    },
    onSuccess: (savedTransaction) => {
      console.log('✅ [CREATE-SUCCESS] Transaction saved to server:', {
        id: savedTransaction.id?.substring(0, 8) + '...',
        amount: savedTransaction.amount,
        category: savedTransaction.category,
        subcategory: savedTransaction.subcategory,
        timestamp: new Date().toISOString()
      });

      // Manual cache update cu datele reale din server (elimină temp ID)
      const currentData = queryClient.getQueryData<MonthlyTransactionsResult>(monthlyQueryKey);

      if (currentData) {
        console.log('🔍 [CREATE-SUCCESS] Current cache before update:', {
          size: currentData.data.length,
          tempTransactions: currentData.data.filter(tx => tx.id.startsWith('temp-')).length
        });

        const updatedResult: MonthlyTransactionsResult = {
          data: currentData.data.map(tx =>
            tx.id.startsWith('temp-') ? savedTransaction : tx
          ),
          count: currentData.count,
        };

        console.log('🔍 [CREATE-SUCCESS] Updated cache with real transaction:', {
          newSize: updatedResult.data.length,
          realTransactionId: savedTransaction.id?.substring(0, 8) + '...'
        });

        queryClient.setQueryData(monthlyQueryKey, updatedResult);
      } else {
        console.warn('⚠️ [CREATE-SUCCESS] No current cache data found!');
      }

      // 🔄 NEW: Sync cu global cache pentru consistență între module
      if (userId) {
        try {
          syncGlobalTransactionCache({
            queryClient,
            userId,
            operation: 'create',
            transaction: savedTransaction
          });
        } catch (error) {
          console.warn('[MONTHLY-CREATE] Global cache sync failed, transaction still saved:', error);
          // Nu oprește procesul, monthly cache-ul este deja actualizat
        }
      }

      // ELIMINAT: Nu mai facem invalidation forțat
    },
    onError: (err, newTransaction, context) => {
      // Revert la datele anterioare în caz de eroare
      if (context?.previousData) {
        queryClient.setQueryData(monthlyQueryKey, context.previousData);
      }

      // Enhanced error handling cu context complet
      handleMutationError(err);
    },
  });
};

export const useUpdateTransactionMonthly = (year: number, month: number, userId?: string) => {
  const queryClient = useQueryClient();
  const monthlyQueryKey = ['transactions', 'monthly', year, month, userId];
  const handleMutationError = useMutationErrorHandler('update', 'transaction_monthly', 'TransactionMutationsMonthly');

  return useMutation({
    mutationFn: async ({ id, transactionData }: { id: string; transactionData: UpdateTransactionHookPayload }) => {
      const response = await supabaseService.updateTransaction(id, transactionData);
      return response;
    },
    onMutate: async ({ id, transactionData }) => {
      // 🎯 Step 1.3: Cancel outgoing refetches pentru optimistic update
      await queryClient.cancelQueries({ queryKey: monthlyQueryKey });

      // Snapshot current data pentru rollback
      const previousData = queryClient.getQueryData(monthlyQueryKey);

      // 🚀 Optimistic update - actualizăm imediat în cache
      queryClient.setQueryData(monthlyQueryKey, (old: MonthlyTransactionsResult | undefined) => {
        if (!old) return old;
        return {
          data: old.data.map((tx: TransactionValidated) =>
            tx.id === id ? { ...tx, ...transactionData, updated_at: new Date().toISOString() } : tx
          ),
          count: old.count,
        };
      });

      return { previousData };
    },
    onSuccess: (updatedTransaction) => {
      // 🐞 DEBUG: Loghez tranzacția actualizată returnată de la server
      console.log('🔍 [UPDATE-SUCCESS] Transaction returned from server:', {
        id: updatedTransaction.id,
        amount: updatedTransaction.amount,
        category: updatedTransaction.category,
        subcategory: updatedTransaction.subcategory,
        date: updatedTransaction.date,
        timestamp: new Date().toISOString()
      });

      // Manual cache update cu datele reale din server (înlocuiește optimistic data)
      const currentData = queryClient.getQueryData<MonthlyTransactionsResult>(monthlyQueryKey);

      if (currentData) {
        const updatedResult: MonthlyTransactionsResult = {
          data: currentData.data.map((tx: TransactionValidated) =>
            tx.id === updatedTransaction.id ? updatedTransaction : tx
          ),
          count: currentData.count,
        };

        console.log('🔍 [UPDATE-SUCCESS] Updated monthly cache data:', {
          totalTransactions: updatedResult.data.length,
          updatedTransactionInCache: updatedResult.data.find(tx => tx.id === updatedTransaction.id)
        });

        queryClient.setQueryData(monthlyQueryKey, updatedResult);
      }

      // 🔄 NEW: Sync cu global cache pentru consistență între module
      if (userId) {
        try {
          syncGlobalTransactionCache({
            queryClient,
            userId,
            operation: 'update',
            transaction: updatedTransaction
          });
        } catch (error) {
          console.warn('[MONTHLY-UPDATE] Global cache sync failed, transaction still updated:', error);
          // Nu oprește procesul, monthly cache-ul este deja actualizat
        }
      }

      // ELIMINAT: Nu mai facem invalidation forțat
    },
    onError: (err, variables, context) => {
      // 🔄 Step 1.3: Rollback la datele anterioare în caz de eroare
      if (context?.previousData) {
        queryClient.setQueryData(monthlyQueryKey, context.previousData);
      }

      // Enhanced error handling cu context complet
      handleMutationError(err);
    },
  });
};

export const useDeleteTransactionMonthly = (year: number, month: number, userId?: string) => {
  const queryClient = useQueryClient();
  const monthlyQueryKey = ['transactions', 'monthly', year, month, userId];
  const handleMutationError = useMutationErrorHandler('delete', 'transaction_monthly', 'TransactionMutationsMonthly');

  return useMutation({
    mutationFn: async (id: string) => {
      await supabaseService.deleteTransaction(id);
      return id;
    },
    onMutate: async (deletedId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: monthlyQueryKey });

      // Snapshot current data
      const previousData = queryClient.getQueryData(monthlyQueryKey);

      // Optimistic update - eliminăm tranzacția
      queryClient.setQueryData(monthlyQueryKey, (old: MonthlyTransactionsResult | undefined) => {
        if (!old) return old;
        return {
          data: old.data.filter((tx: TransactionValidated) => tx.id !== deletedId),
          count: Math.max(0, old.count - 1),
        };
      });

      return { previousData };
    },
    onSuccess: (deletedId) => {
      // 🔄 NEW: Sync cu global cache pentru consistență între module
      if (userId) {
        try {
          syncGlobalTransactionCache({
            queryClient,
            userId,
            operation: 'delete',
            transaction: {} as TransactionValidated, // Nu e necesar pentru delete
            deletedId
          });
        } catch (error) {
          console.warn('[MONTHLY-DELETE] Global cache sync failed, transaction still deleted:', error);
          // Nu oprește procesul, monthly cache-ul este deja actualizat
        }
      }

      // ELIMINAT: Nu mai facem invalidation forțat
    },
    onError: (err, deletedId, context) => {
      // Rollback
      if (context?.previousData) {
        queryClient.setQueryData(monthlyQueryKey, context.previousData);
      }

      // Enhanced error handling cu context complet
      handleMutationError(err);
    },
  });
};
