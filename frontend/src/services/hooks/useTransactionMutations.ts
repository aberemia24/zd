// Re-export al tuturor hook-urilor din transactionMutations.ts pentru standardizarea numelui
// conform convenției de a folosi prefixul 'use' pentru toate hook-urile

import {
  useCreateTransaction as createTransaction,
  useUpdateTransaction as updateTransaction,
  useDeleteTransaction as deleteTransaction,
  useUpdateTransactionStatus as updateTransactionStatus,
  useCreateTransactionMonthly as createTransactionMonthly,
  useUpdateTransactionMonthly as updateTransactionMonthly,
  useDeleteTransactionMonthly as deleteTransactionMonthly,
  CreateTransactionHookPayload,
  UpdateTransactionHookPayload,
} from "./transactionMutations";

// Re-export cu numele corecte pentru a păstra consistența API-ului
export const useCreateTransaction = createTransaction;
export const useUpdateTransaction = updateTransaction;
export const useDeleteTransaction = deleteTransaction;
export const useUpdateTransactionStatus = updateTransactionStatus;

// Hook-uri monthly pentru cache optimizations
export const useCreateTransactionMonthly = createTransactionMonthly;
export const useUpdateTransactionMonthly = updateTransactionMonthly;
export const useDeleteTransactionMonthly = deleteTransactionMonthly;

// Re-export și tipurile pentru a le face disponibile
export type { CreateTransactionHookPayload, UpdateTransactionHookPayload };
