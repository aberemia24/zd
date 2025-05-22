import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { supabaseService } from '../supabaseService';
import type { TransactionPage } from '../supabaseService';
import { TransactionValidated, CreateTransaction } from '@shared-constants/transaction.schema';
import { TransactionStatus } from '@shared-constants/enums';
import { MESAJE } from '@shared-constants/messages';

export type CreateTransactionHookPayload = CreateTransaction;
export type UpdateTransactionHookPayload = Partial<CreateTransaction>;

type MutationContext = {
  previousData?: InfiniteData<TransactionPage>;
};

// Definim cheia de query pentru tranzacții 
// O definim ca array pentru a fi compatibilă cu react-query
const TRANSACTIONS_BASE_KEY = ['transactions'] as const;

/**
 * Hook pentru crearea unei tranzacții noi
 * @returns Obiect cu mutația și funcțiile asociate
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation<TransactionValidated, Error, CreateTransactionHookPayload, MutationContext>({
    mutationFn: async (transactionData) => {
      return supabaseService.createTransaction(transactionData);
    },
    onMutate: async (newTransaction) => {
      // Anulăm orice query în curs pentru a evita suprascrierea update-urilor optimiste
      await queryClient.cancelQueries({ queryKey: TRANSACTIONS_BASE_KEY });
      
      // Salvăm starea anterioară a cache-ului pentru rollback în caz de eroare
      const previousData = queryClient.getQueryData<InfiniteData<TransactionPage>>(TRANSACTIONS_BASE_KEY);
      // Adăugăm tranzacția optimist la începutul primei pagini
      if (previousData && previousData.pages.length > 0) {
        const firstPage = { ...previousData.pages[0] };
        const optimisticTransaction = {
          id: `temp-${Date.now()}`,
          ...newTransaction,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TransactionValidated;
        firstPage.data = [optimisticTransaction, ...firstPage.data];
        firstPage.count = (firstPage.count || 0) + 1;
        queryClient.setQueryData<InfiniteData<TransactionPage>>(TRANSACTIONS_BASE_KEY, {
          ...previousData,
          pages: [firstPage, ...previousData.pages.slice(1)]
        });
      }
      return { previousData };
    },
    onError: (err, newTransaction, context) => {
      // Rollback - restaurăm datele la starea anterioară
      if (context?.previousData) {
        queryClient.setQueryData(TRANSACTIONS_BASE_KEY, context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_BASE_KEY });
    },
  });
}

/**
 * Hook pentru actualizarea unei tranzacții existente
 * @returns Obiect cu mutația și funcțiile asociate
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation<TransactionValidated, Error, { id: string; transactionData: UpdateTransactionHookPayload }, MutationContext>({
    mutationFn: async ({ id, transactionData }) => {
      return supabaseService.updateTransaction(id, transactionData);
    },
    onMutate: async ({ id, transactionData }) => {
      // Anulăm orice query în curs pentru a evita suprascrierea update-urilor optimiste
      await queryClient.cancelQueries({ queryKey: TRANSACTIONS_BASE_KEY });
      
      // Salvăm starea anterioară a cache-ului pentru rollback în caz de eroare
      const previousData = queryClient.getQueryData<InfiniteData<TransactionPage>>(TRANSACTIONS_BASE_KEY);
      if (previousData && previousData.pages) {
        const updatedPages = previousData.pages.map(page => {
          const transactionIndex = page.data.findIndex(tx => tx.id === id);
          if (transactionIndex === -1) return page;
          const updatedData = [...page.data];
          updatedData[transactionIndex] = {
            ...updatedData[transactionIndex],
            ...transactionData,
            updated_at: new Date().toISOString()
          };
          return {
            ...page,
            data: updatedData
          };
        });
        queryClient.setQueryData<InfiniteData<TransactionPage>>(TRANSACTIONS_BASE_KEY, {
          ...previousData,
          pages: updatedPages
        });
      }
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback - restaurăm datele la starea anterioară
      if (context?.previousData) {
        queryClient.setQueryData(TRANSACTIONS_BASE_KEY, context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_BASE_KEY });
    },
  });
}

/**
 * Hook pentru ștergerea unei tranzacții
 * @returns Obiect cu mutația și funcțiile asociate
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string, MutationContext>({
    mutationFn: async (transactionId) => {
      return supabaseService.deleteTransaction(transactionId);
    },
    onMutate: async (transactionId) => {
      // Anulăm orice query în curs pentru a evita suprascrierea update-urilor optimiste
      await queryClient.cancelQueries({ queryKey: TRANSACTIONS_BASE_KEY });
      
      // Salvăm starea anterioară a cache-ului pentru rollback în caz de eroare
      const previousData = queryClient.getQueryData<InfiniteData<TransactionPage>>(TRANSACTIONS_BASE_KEY);
      if (previousData && previousData.pages.length > 0) {
        const updatedPages = [...previousData.pages];
        let found = false;
        const newPages = updatedPages.map(page => {
          const initialLength = page.data.length;
          const newData = page.data.filter(t => t.id !== transactionId);
          if (newData.length === initialLength) return page;
          found = true;
          return {
            ...page,
            data: newData,
            count: page.count - (initialLength - newData.length)
          };
        });
        if (found) {
          queryClient.setQueryData<InfiniteData<TransactionPage>>(TRANSACTIONS_BASE_KEY, {
            ...previousData,
            pages: newPages
          });
        }
      }
      return { previousData };
    },
    onError: (err, transactionId, context) => {
      // Rollback - restaurăm datele la starea anterioară
      if (context?.previousData) {
        queryClient.setQueryData(TRANSACTIONS_BASE_KEY, context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_BASE_KEY });
    },
  });
}

/**
 * Hook pentru actualizarea stării unei tranzacții (ex: schimbare status)
 * @returns Obiect cu mutația și funcțiile asociate
 */
export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient();
  
  return useMutation<TransactionValidated, Error, { id: string; status: TransactionStatus }, MutationContext>({
    mutationFn: async ({ id, status }) => {
      return supabaseService.updateTransaction(id, { status });
    },
    onMutate: async ({ id, status }) => {
      // Anulăm orice query în curs pentru a evita suprascrierea update-urilor optimiste
      await queryClient.cancelQueries({ queryKey: TRANSACTIONS_BASE_KEY });
      
      // Salvăm starea anterioară a cache-ului pentru rollback în caz de eroare
      const previousData = queryClient.getQueryData<InfiniteData<TransactionPage>>(TRANSACTIONS_BASE_KEY);
      
      // Update optimist - actualizăm status-ul tranzacției în cache fără a aștepta răspunsul serverului
      if (previousData && previousData.pages) {
        const updatedPages = previousData.pages.map((page: TransactionPage) => {
          // Verificăm dacă tranzacția există în pagina curentă
          const transactionIndex = page.data.findIndex((tx: TransactionValidated) => tx.id === id);
          
          // Dacă nu există în această pagină, returnăm pagina nemodificată
          if (transactionIndex === -1) return page;
          
          // Altfel, clonăm pagina și actualizăm statusul tranzacției
          const updatedData = [...page.data];
          updatedData[transactionIndex] = {
            ...updatedData[transactionIndex],
            status,
            updated_at: new Date().toISOString()
          };
          
          return {
            ...page,
            data: updatedData
          };
        });
        
        // Actualizăm cache-ul cu noile date
        queryClient.setQueryData<InfiniteData<TransactionPage>>(TRANSACTIONS_BASE_KEY, {
          ...previousData,
          pages: updatedPages
        });
      }
      
      return { previousData };
    },
    onSuccess: (data) => {
      // Invalidăm toate query-urile de tranzacții pentru a asigura date proaspete
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_BASE_KEY });
      return data;
    },
    onError: (err, variables, context) => {
      // Rollback - restaurăm datele la starea anterioară în caz de eroare
      if (context?.previousData) {
        queryClient.setQueryData(TRANSACTIONS_BASE_KEY, context.previousData);
      }
      
      throw new Error(MESAJE.EROARE_SALVARE_TRANZACTIE || 'Eroare la actualizarea statusului');
    },
  });
}
