/**
 * Mock complet pentru supabaseService, folosit automat de Jest în teste
 * Încărcat atunci când un test importă '../services/supabaseService'
 * OWNER: echipa API & FE
 */

// Importăm tipurile necesare
import { TransactionType } from "@budget-app/shared-constants";
import { PAGINATION } from "@budget-app/shared-constants";
import type { TransactionValidated } from "@budget-app/shared-constants/transaction.schema";

// Mock pentru răspunsul implicit cu tranzacții goale
const defaultTransactions: TransactionValidated[] = [];

// Funcțiile de API pentru tranzacții
export const getTransactions = jest.fn().mockResolvedValue({
  data: defaultTransactions,
  count: 0,
  error: null,
});

export const fetchTransactions = jest
  .fn()
  .mockImplementation((userId = "", pagination = {}, filters = {}) => {
    return Promise.resolve({
      data: defaultTransactions,
      count: defaultTransactions.length,
      error: null,
    });
  });

export const getTransactionById = jest.fn().mockResolvedValue({
  data: null,
  error: null,
});

export const saveTransaction = jest.fn().mockResolvedValue({
  data: { id: "mock-id" },
  error: null,
});

export const createTransaction = jest.fn().mockImplementation((data) => {
  const result: TransactionValidated = {
    id: "mock-created-id",
    user_id: "mock-user-id",
    ...data,
    created_at: new Date().toISOString(),
  };
  return Promise.resolve(result);
});

export const updateTransaction = jest.fn().mockImplementation((id, data) => {
  const result: TransactionValidated = {
    id,
    user_id: "mock-user-id",
    ...data,
    updated_at: new Date().toISOString(),
  };
  return Promise.resolve(result);
});

export const deleteTransaction = jest.fn().mockResolvedValue({
  data: { id: "mock-id" },
  error: null,
});

// Exportăm și un obiect supabaseService pentru componențe care importă direct obiectul
export const supabaseService = {
  fetchTransactions,
  getTransactions,
  getTransactionById,
  saveTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};

// Reset-ăm toate mock-urile la început de test
beforeEach(() => {
  getTransactions.mockClear();
  fetchTransactions.mockClear();
  getTransactionById.mockClear();
  saveTransaction.mockClear();
  createTransaction.mockClear();
  updateTransaction.mockClear();
  deleteTransaction.mockClear();
});

// Setarea default-uri pentru teste
fetchTransactions.mockResolvedValue({
  data: [],
  count: 0,
  error: null,
});
