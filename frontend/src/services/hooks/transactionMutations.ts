import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '../supabaseService';
import { TransactionValidated, CreateTransaction } from '@shared-constants/transaction.schema';
import { TransactionStatus } from '@shared-constants/enums';

export type CreateTransactionHookPayload = CreateTransaction;
export type UpdateTransactionHookPayload = Partial<CreateTransaction>;

/**
 * Hook pentru crearea unei tranzacții noi
 * @returns Obiect cu mutația și funcțiile asociate
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transactionData: CreateTransactionHookPayload) => {
      return supabaseService.createTransaction(transactionData);
    },
    onSuccess: (data, variables, context) => {
      // Invalidăm toate query-urile de tranzacții pentru a forța reîncărcarea datelor
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      
      // Log pentru debugging (opțional)
      console.log(`Tranzacție creată cu succes: ${data?.id || 'no id'}`);
      
      return data;
    },
    onError: (error) => {
      console.error('Eroare la crearea tranzacției:', error);
      throw new Error('Eroare la crearea tranzacției');
    },
  });
}

/**
 * Hook pentru actualizarea unei tranzacții existente
 * @returns Obiect cu mutația și funcțiile asociate
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, transactionData }: { id: string; transactionData: UpdateTransactionHookPayload }) => {
      return supabaseService.updateTransaction(id, transactionData);
    },
    onSuccess: (data) => {
      // Invalidăm toate query-urile de tranzacții pentru a forța reîncărcarea datelor
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      
      // Log pentru debugging (opțional)
      console.log(`Tranzacție actualizată cu succes: ${data?.id || 'no id'}`);
      
      return data;
    },
    onError: (error) => {
      console.error('Eroare la actualizarea tranzacției:', error);
      throw new Error('Eroare la actualizarea tranzacției');
    },
  });
}

/**
 * Hook pentru ștergerea unei tranzacții
 * @returns Obiect cu mutația și funcțiile asociate
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transactionId: string) => {
      return supabaseService.deleteTransaction(transactionId);
    },
    onSuccess: () => {
      // Invalidăm toate query-urile de tranzacții pentru a forța reîncărcarea datelor
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      console.error('Eroare la ștergerea tranzacției:', error);
      throw new Error('Eroare la ștergerea tranzacției');
    },
  });
}

/**
 * Hook pentru actualizarea stării unei tranzacții (ex: schimbare status)
 * @returns Obiect cu mutația și funcțiile asociate
 */
export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TransactionStatus }) => {
      return supabaseService.updateTransaction(id, { status });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      return data;
    },
    onError: (error) => {
      console.error('Eroare la actualizarea statusului tranzacției:', error);
      throw new Error('Eroare la actualizarea statusului');
    },
  });
}
