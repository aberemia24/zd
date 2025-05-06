/**
 * Mock pentru transactionStore folosit în teste
 * OWNER: echipa tranzacții
 */

// Mock persistent pentru store
const mockState = {
  transactions: [],
  total: 0,
  loading: false,
  error: null,
  fetchTransactions: jest.fn().mockResolvedValue({ data: [], count: 0 }),
  getTransactionById: jest.fn().mockResolvedValue({ data: null }),
  createTransaction: jest.fn().mockResolvedValue({ data: { id: 'mock-id' } }),
  updateTransaction: jest.fn().mockResolvedValue({ data: { id: 'mock-id' } }),
  deleteTransaction: jest.fn().mockResolvedValue({ data: { id: 'mock-id' } }),
  setLoading: jest.fn(),
  setError: jest.fn(),
  getAllSubcategories: jest.fn(),
  setTransactions: jest.fn(),
  setTotal: jest.fn(),
  setQueryParams: jest.fn(),
  refresh: jest.fn(),
  saveTransaction: jest.fn(),
  removeTransaction: jest.fn(),
  reset: jest.fn(),
};

// Exportăm un mock pentru useTransactionStore hook
export const useTransactionStore = jest.fn().mockImplementation((selector?: any) => {
  // Când e apelat fără selector, returnează starea direct (cum face în componenta reală)
  if (!selector) {
    return mockState;
  }
  if (typeof selector === 'function') {
    return selector(mockState);
  }
  return mockState;
}) as jest.Mock & { getState: jest.Mock };

// Necesar pentru mockGetState în Zustand
useTransactionStore.getState = jest.fn().mockReturnValue(mockState);

// Funcție pentru a actualiza starea mockului în teste
export const setMockTransactionState = (newState: Partial<typeof mockState>) => {
  Object.assign(mockState, newState);
  return mockState;
};
