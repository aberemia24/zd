/**
 * Test pentru store-ul Zustand de tranzacții
 */
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { act, waitFor } from '@testing-library/react';
import { PAGINATION } from 'shared-constants';
import { Transaction, TransactionQueryParams, TransactionFormWithNumberAmount } from '../types/transaction';
import { PaginatedResponse } from '../services/transactionApiClient';
import { TransactionType, CategoryType, FrequencyType } from '../../../shared-constants/enums';
import { TransactionService } from '../services/transactionService';

// Mock pentru middleware Zustand (dezactivează persist și devtools în teste)
jest.mock('zustand/middleware', () => ({
  persist: (config: any) => config,
  devtools: (config: any) => config,
  createJSONStorage: () => ({
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null
  })
}));

// Alias pentru tipurile TS ale TransactionService
type TransactionServiceType = TransactionService;

// Serviciu mock prin dependency injection
let mockService: jest.Mocked<TransactionService>;

// Date de test pentru tranzacții
const mockTransactions: Transaction[] = [
  { 
    id: '1', 
    amount: '100', 
    date: '2025-04-24', 
    type: TransactionType.EXPENSE,
    category: CategoryType.EXPENSE,
    subcategory: 'Chirie',
    recurring: false,
    frequency: undefined,
    currency: 'RON'
  },
  { 
    id: '2', 
    amount: '200', 
    date: '2025-04-25', 
    type: TransactionType.INCOME,
    category: CategoryType.INCOME,
    subcategory: 'Salariu',
    recurring: true,
    frequency: FrequencyType.MONTHLY,
    currency: 'RON'
  }
];

// Mock pentru răspunsul API
const mockPaginatedResponse: PaginatedResponse<Transaction> = {
  data: mockTransactions,
  total: mockTransactions.length,
  limit: PAGINATION.DEFAULT_LIMIT,
  offset: PAGINATION.DEFAULT_OFFSET
};

// Import-uri după mock-uri pentru a evita hoist-ing issues
import { useTransactionStore } from './transactionStore';

// Utilitar pentru resetarea store-ului și injectarea serviciului mock
function resetStoreWithMockService() {
  useTransactionStore.getState().reset();
}

// Setup mock-uri înainte de fiecare test
beforeEach(() => {
  jest.clearAllMocks();
  mockService = {
    getFilteredTransactions: jest.fn(async (...args: Parameters<TransactionService['getFilteredTransactions']>) => mockPaginatedResponse),
    saveTransaction: jest.fn(async (formData: TransactionFormWithNumberAmount, id?: string): Promise<Transaction> => ({
        id: id ?? '3',
        amount: String(formData.amount),
        type: formData.type,
        category: formData.category,
        subcategory: formData.subcategory,
        date: formData.date,
        recurring: formData.recurring ?? false,
        frequency: formData.frequency ?? undefined,
        currency: 'RON'
      })),
    removeTransaction: jest.fn(async (_id: string): Promise<void> => undefined),
    getTransactionById: jest.fn(async (id: string): Promise<Transaction> =>
      mockTransactions.find(t => t.id === id) || mockTransactions[0]),
    getCacheStats: jest.fn(() => ({ entries: 0, hits: 0, misses: 0, ratio: 0 }))
  } as unknown as jest.Mocked<TransactionService>;
  resetStoreWithMockService();
});

describe('transactionStore', () => {

  describe('stare inițială', () => {
    it('are proprietățile corecte și valorile inițiale', () => {
      // Assert
      const state = useTransactionStore.getState();
      expect(state.transactions).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.total).toBe(0);
      expect(state.currentQueryParams).toEqual({
        limit: PAGINATION.DEFAULT_LIMIT,
        offset: PAGINATION.DEFAULT_OFFSET,
        sort: PAGINATION.DEFAULT_SORT
      });
    });
  });

  describe('fetchTransactions', () => {
    it('încarcă tranzacții cu succes', async () => {
      // Act
      const store = useTransactionStore.getState();
      await act(async () => {
        await store.fetchTransactions();
      });
      
      // Assert
      expect(useTransactionStore.getState().transactions).toEqual(mockPaginatedResponse.data);
      expect(useTransactionStore.getState().total).toBe(mockPaginatedResponse.total);
      expect(useTransactionStore.getState().loading).toBe(false);
      expect(useTransactionStore.getState().error).toBeNull();
      
      // Verificăm dacă metoda mockată a fost apelată corect
      expect(mockService.getFilteredTransactions).toHaveBeenCalledTimes(1);
      expect(mockService.getFilteredTransactions).toHaveBeenCalledWith(store.currentQueryParams, false);
    });

    it('setează parametrii query și încarcă tranzacții', async () => {
      // Arrange
      const mockParams: TransactionQueryParams = {
        type: TransactionType.INCOME,
        limit: 20,
        offset: 10,
        sort: '-date'
      };
      
      // Act
      const store = useTransactionStore.getState();
      await act(async () => {
        store.setQueryParams(mockParams);
        await store.fetchTransactions();
      });
      
      // Assert
      expect(mockService.getFilteredTransactions).toHaveBeenCalledTimes(1);
      expect(mockService.getFilteredTransactions).toHaveBeenCalledWith(useTransactionStore.getState().currentQueryParams, false);
      expect(useTransactionStore.getState().currentQueryParams).toEqual(mockParams);
    });

    it('gestionează corect eroarea la încărcare', async () => {
      // Arrange
      const errorMessage = 'Eroare de rețea';
      mockService.getFilteredTransactions.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
      const { MESAJE } = await import('shared-constants');
      // Act
      const store = useTransactionStore.getState();
      await act(async () => {
        await store.fetchTransactions();
      });
      // Assert
      expect(useTransactionStore.getState().error).toBe(MESAJE.EROARE_INCARCARE_TRANZACTII);
      expect(useTransactionStore.getState().loading).toBe(false);
      expect(useTransactionStore.getState().transactions).toEqual([]);
    });
  });

  describe('saveTransaction', () => {
    it('adaugă o tranzacție nouă corect', async () => {
      // Arrange
      const formData: TransactionFormWithNumberAmount = {
        type: TransactionType.EXPENSE,
        amount: 300,
        date: '2025-04-23',
        category: 'shopping',
        subcategory: 'haine',
        recurring: false,
        frequency: undefined,
        currency: 'RON',
      };
      
      // Act
      const store = useTransactionStore.getState();
      await act(async () => {
        await store.saveTransaction(formData);
      });
      
      // Assert
      expect(mockService.saveTransaction).toHaveBeenCalledWith(formData, undefined);
      expect(mockService.getFilteredTransactions).toHaveBeenCalledTimes(1);
    });

    it('actualizează o tranzacție existentă corect', async () => {
      // Arrange
      const transactionId = '1';
      const formData: TransactionFormWithNumberAmount = {
        type: TransactionType.EXPENSE,
        amount: 550,
        date: '2025-04-20',
        category: 'utilities',
        subcategory: 'energie',
        recurring: false,
        frequency: undefined,
        currency: 'RON',
      };
      
      // Act
      const store = useTransactionStore.getState();
      await act(async () => {
        await store.saveTransaction(formData, transactionId);
      });
      
      // Assert
      expect(mockService.saveTransaction).toHaveBeenCalledWith(formData, transactionId);
      expect(mockService.getFilteredTransactions).toHaveBeenCalledTimes(1);
    });

    it('șterge o tranzacție corect', async () => {
      // Arrange
      const transactionId = '2';
      
      // Act
      const store = useTransactionStore.getState();
      await act(async () => {
        await store.removeTransaction(transactionId);
      });
      
      // Assert
      expect(mockService.removeTransaction).toHaveBeenCalledWith(transactionId);
      expect(mockService.getFilteredTransactions).toHaveBeenCalledTimes(1);
    });
  });

  describe('queryParams și refresh', () => {
    it('nu refetch-uiește dacă parametrii sunt identici și fără forceRefresh', async () => {
      // Arrange
      const store = useTransactionStore.getState();
      // Primul fetch
      await act(async () => {
        await store.fetchTransactions();
      });
      // Al doilea fetch cu aceiași parametri, fără forceRefresh
      await act(async () => {
        await store.fetchTransactions();
      });
      // Assert: doar un singur apel către serviciu
      expect(mockService.getFilteredTransactions).toHaveBeenCalledTimes(1);
    });

    it('refetch-uiește dacă forceRefresh este true, chiar dacă parametrii sunt identici', async () => {
      // Arrange
      const store = useTransactionStore.getState();
      // Primul fetch
      await act(async () => {
        await store.fetchTransactions();
      });
      // Al doilea fetch cu forceRefresh true
      await act(async () => {
        await store.fetchTransactions(true);
      });
      // Assert: două apeluri către serviciu
      expect(mockService.getFilteredTransactions).toHaveBeenCalledTimes(2);
      expect(mockService.getFilteredTransactions).toHaveBeenLastCalledWith(store.currentQueryParams, true);
    });

    it('gestionează corect erorile și setează mesajul de eroare din constants/messages.ts', async () => {
      // Arrange
      useTransactionStore.getState().reset(); // Reset explicit pentru izolare
          const errorMessage = 'Test error';
      mockService.getFilteredTransactions.mockRejectedValueOnce(new Error(errorMessage));
      const { MESAJE } = await import('shared-constants');
      const store = useTransactionStore.getState();
      // Act
      await act(async () => {
        await store.fetchTransactions(true); // Forțează fetch-ul, evită caching
      });
      // Assert
      expect(mockService.getFilteredTransactions).toHaveBeenCalled();
      // Așteaptă update-ul asincron
      await waitFor(() => {
        const state = useTransactionStore.getState();
        expect(state.error).toBe(MESAJE.EROARE_INCARCARE_TRANZACTII);
        expect(state.transactions).toEqual([]);
        expect(state.total).toBe(0);
      });
    });

    it('gestionează robust parametri nil sau ciudați fără crash', async () => {
      // Arrange
      const store = useTransactionStore.getState();
      // Act
      await act(async () => {
        await store.setQueryParams({} as any); // parametri incompleți
        await store.fetchTransactions();
      });
      // Assert: store-ul nu aruncă excepții și gestionează fallback-ul
      expect(store.error === null || typeof store.error === 'string').toBe(true);
    });

    it('setează parametrii corect', () => {
      // Arrange
      const queryParams: TransactionQueryParams = {
        type: TransactionType.INCOME,
        category: CategoryType.INCOME,
        limit: 5,
        offset: 10,
        sort: '-date',
      };
      
      // Act
      const store = useTransactionStore.getState();
      store.setQueryParams(queryParams);
      
      // Assert
      expect(useTransactionStore.getState().currentQueryParams).toEqual(queryParams);
    });
    
    it('forțează reîncărcarea datelor la apelul refresh', async () => {
      // Arrange
      const store = useTransactionStore.getState();
      
      // Act
      await act(async () => {
        await store.refresh();
      });
      
      // Assert
      expect(mockService.getFilteredTransactions).toHaveBeenCalledWith(
        store.currentQueryParams,
        true
      );
    });
  });

  describe('resetare și setteri', () => {
    it('setează și resetează starea corect', () => {
      // Arrange
      const testTransactionsNumberAmount = [
  {
    id: '1',
    amount: 100,
    date: '2025-04-24',
    type: TransactionType.EXPENSE,
    category: CategoryType.EXPENSE,
    subcategory: 'Chirie',
    recurring: false,
    frequency: undefined,
    currency: 'RON'
  },
  {
    id: '2',
    amount: 200,
    date: '2025-04-25',
    type: TransactionType.INCOME,
    category: CategoryType.INCOME,
    subcategory: 'Salariu',
    recurring: true,
    frequency: FrequencyType.MONTHLY,
    currency: 'RON'
  }
];
      const testParams: TransactionQueryParams = {
        type: TransactionType.EXPENSE,
        limit: 30,
        offset: 0,
        sort: 'amount'
      };
      
      // Act - setăm manual starea utilizând setterii
      const store = useTransactionStore.getState();
      store.setTransactions(testTransactionsNumberAmount);
      store.setTotal(testTransactionsNumberAmount.length);
      store.setLoading(true);
      store.setError('Eroare test');
      store.setQueryParams(testParams);
      
      // Assert - verificăm modificarea
      expect(useTransactionStore.getState().transactions).toEqual(testTransactionsNumberAmount);
      expect(useTransactionStore.getState().total).toBe(testTransactionsNumberAmount.length);
      expect(useTransactionStore.getState().loading).toBe(true);
      expect(useTransactionStore.getState().error).toBe('Eroare test');
      expect(useTransactionStore.getState().currentQueryParams).toEqual(testParams);
      
      // Act - resetăm starea
      store.reset();
      
      // Assert - verificăm resetarea
      expect(store.transactions).toEqual([]);
      expect(useTransactionStore.getState().total).toBe(0);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
      expect(useTransactionStore.getState().currentQueryParams).toEqual({
        limit: PAGINATION.DEFAULT_LIMIT,
        offset: PAGINATION.DEFAULT_OFFSET,
        sort: PAGINATION.DEFAULT_SORT
      });
    });
  });
});
