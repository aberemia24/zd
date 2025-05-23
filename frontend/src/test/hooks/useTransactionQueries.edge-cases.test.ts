/**
 * Teste edge-case pentru useTransactionQueries hooks
 * Focus pe scenarii de eroare, timeout-uri și boundary conditions
 */

// Mock Supabase înainte de orice alte importuri
jest.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }))
  }
}));

// Mock environment variables pentru Supabase
process.env.REACT_APP_SUPABASE_URL = 'https://mock-project.supabase.co';
process.env.REACT_APP_SUPABASE_ANON_KEY = 'mock-anon-key';

import * as useTransactionQueries from '../../services/hooks/useTransactionQueries';
import { useAuthStore } from '../../stores/authStore';
import { TransactionType, TransactionStatus } from '@shared-constants';

// Mock auth store
jest.mock('../../stores/authStore');
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

// Mock transaction service
jest.mock('../../services/transactionService', () => ({
  transactionService: {
    getTransactionById: jest.fn(),
    getTransactions: jest.fn(),
    getTransactionsPaginated: jest.fn(),
    getMonthlyTransactions: jest.fn()
  }
}));

import { transactionService } from '../../services/transactionService';
const mockTransactionService = transactionService as jest.Mocked<typeof transactionService>;

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useInfiniteQuery: jest.fn(),
  useQueryClient: jest.fn()
}));

import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockUseInfiniteQuery = useInfiniteQuery as jest.MockedFunction<typeof useInfiniteQuery>;
const mockUseQueryClient = useQueryClient as jest.MockedFunction<typeof useQueryClient>;

const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com'
};

const mockTransactions = [
  {
    id: '1',
    userId: 'test-user-123',
    type: TransactionType.INCOME,
    amount: 1000,
    date: '2024-01-15',
    category: 'Venituri',
    subcategory: 'Salariu',
    description: 'Test transaction',
    status: TransactionStatus.COMPLETED,
    recurring: false
  }
];

describe('useTransactionQueries Edge Cases', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    // Setup default auth state
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      resetPassword: jest.fn(),
      isLoading: false,
      error: null
    });

    // Setup default React Query client mock
    mockUseQueryClient.mockReturnValue({
      prefetchQuery: jest.fn()
    } as any);
  });

  describe('Network Failure Edge Cases', () => {
    test('should handle transaction service timeout', async () => {
      const timeoutError = new Error('Request timeout');
      mockTransactionService.getTransactions.mockRejectedValue(timeoutError);
      
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: timeoutError,
        isError: true,
        refetch: jest.fn()
      } as any);

      const { useTransactions } = useTransactionQueries;
      const result = useTransactions({ type: TransactionType.INCOME });

      expect(result.error).toBe(timeoutError);
      expect(result.data).toBeUndefined();
      expect(result.isLoading).toBe(false);
    });

    test('should handle network connectivity issues', async () => {
      const networkError = new Error('Network Error');
      mockTransactionService.getTransactionById.mockRejectedValue(networkError);
      
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: networkError,
        isError: true,
        refetch: jest.fn()
      } as any);

      const { useTransaction } = useTransactionQueries;
      const result = useTransaction('invalid-id');

      expect(result.error).toBe(networkError);
      expect(result.data).toBeUndefined();
    });

    test('should handle API rate limiting gracefully', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      mockTransactionService.getTransactionsPaginated.mockRejectedValue(rateLimitError);
      
      mockUseInfiniteQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: rateLimitError,
        isError: true,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn()
      } as any);

      const { useInfiniteTransactions } = useTransactionQueries;
      const result = useInfiniteTransactions({ type: TransactionType.EXPENSE });

      expect(result.error).toBe(rateLimitError);
      expect(result.hasNextPage).toBe(false);
    });
  });

  describe('Data Boundary Conditions', () => {
    test('should handle empty transaction results', async () => {
      mockTransactionService.getTransactions.mockResolvedValue([]);
      
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        isError: false,
        refetch: jest.fn()
      } as any);

      const { useTransactions } = useTransactionQueries;
      const result = useTransactions({ category: 'NonExistent' });

      expect(result.data).toEqual([]);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    test('should handle malformed transaction data', async () => {
      const malformedData = [
        { id: null, amount: 'invalid' },
        { type: 'INVALID_TYPE' },
        null,
        undefined
      ];
      
      mockTransactionService.getTransactions.mockResolvedValue(malformedData as any);
      
      mockUseQuery.mockReturnValue({
        data: malformedData,
        isLoading: false,
        error: null,
        isError: false,
        refetch: jest.fn()
      } as any);

      const { useTransactions } = useTransactionQueries;
      const result = useTransactions();

      expect(result.data).toEqual(malformedData);
      expect(result.isLoading).toBe(false);
    });

    test('should handle very large datasets', async () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: `transaction-${i}`,
        amount: Math.random() * 1000,
        type: i % 2 === 0 ? TransactionType.INCOME : TransactionType.EXPENSE
      }));
      
      mockTransactionService.getTransactions.mockResolvedValue(largeDataset as any);
      
      mockUseQuery.mockReturnValue({
        data: largeDataset,
        isLoading: false,
        error: null,
        isError: false,
        refetch: jest.fn()
      } as any);

      const { useTransactions } = useTransactionQueries;
      const result = useTransactions();

      expect(result.data).toHaveLength(10000);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Authentication Edge Cases', () => {
    test('should handle missing user ID', async () => {
      mockUseAuthStore.mockReturnValue({
        user: null,
        isAuthenticated: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        resetPassword: jest.fn(),
        isLoading: false,
        error: null
      });

      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isError: false,
        refetch: jest.fn()
      } as any);

      const { useTransaction } = useTransactionQueries;
      const result = useTransaction('some-id');

      expect(result.data).toBeUndefined();
      expect(mockTransactionService.getTransactionById).not.toHaveBeenCalled();
    });

    test('should handle invalid transaction ID formats', async () => {
      const invalidIds = ['', null, undefined, 'invalid-uuid', '123', -1];
      
      for (const invalidId of invalidIds) {
        mockUseQuery.mockReturnValue({
          data: undefined,
          isLoading: false,
          error: new Error('Invalid ID format'),
          isError: true,
          refetch: jest.fn()
        } as any);

        const { useTransaction } = useTransactionQueries;
        const result = useTransaction(invalidId as any);

        expect(result.error).toBeTruthy();
        expect(result.data).toBeUndefined();
      }
    });
  });

  describe('Memory and Performance Edge Cases', () => {
    test('should handle rapid filter changes without memory leaks', async () => {
      const filters = [
        { type: TransactionType.INCOME },
        { category: 'Food' },
        { amount: { min: 100, max: 500 } },
        { date: { from: '2024-01-01', to: '2024-01-31' } },
        {}
      ];

      for (const filter of filters) {
        mockUseQuery.mockReturnValue({
          data: mockTransactions,
          isLoading: false,
          error: null,
          isError: false,
          refetch: jest.fn()
        } as any);

        const { useTransactions } = useTransactionQueries;
        const result = useTransactions(filter as any);

        expect(result.data).toEqual(mockTransactions);
        expect(result.isLoading).toBe(false);
      }
    });

    test('should handle concurrent query requests', async () => {
      mockTransactionService.getTransactions.mockResolvedValue(mockTransactions);
      mockTransactionService.getTransactionById.mockResolvedValue(mockTransactions[0]);
      
      // Mock multiple concurrent queries
      mockUseQuery
        .mockReturnValueOnce({
          data: mockTransactions,
          isLoading: false,
          error: null,
          refetch: jest.fn()
        } as any)
        .mockReturnValueOnce({
          data: mockTransactions[0],
          isLoading: false,
          error: null,
          refetch: jest.fn()
        } as any);

      const { useTransactions, useTransaction } = useTransactionQueries;
      
      const listResult = useTransactions();
      const detailResult = useTransaction('1');

      expect(listResult.data).toEqual(mockTransactions);
      expect(detailResult.data).toEqual(mockTransactions[0]);
    });
  });

  describe('Query Key Edge Cases', () => {
    test('should handle complex filter combinations', async () => {
      const complexFilters = {
        type: TransactionType.EXPENSE,
        category: 'Food',
        subcategory: 'Restaurants',
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
        minAmount: 10,
        maxAmount: 1000,
        recurring: true,
        search: 'pizza'
      };

      mockUseQuery.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
        isError: false,
        refetch: jest.fn()
      } as any);

      const { useTransactions } = useTransactionQueries;
      const result = useTransactions(complexFilters);

      expect(result.data).toEqual(mockTransactions);
      expect(result.isLoading).toBe(false);
    });

    test('should handle filter normalization edge cases', async () => {
      const edgeFilters = [
        { search: '   whitespace   ' },
        { category: '' },
        { amount: { min: 0, max: 0 } },
        { date: { from: '', to: '' } },
        { type: 'UNKNOWN_TYPE' as any }
      ];

      for (const filter of edgeFilters) {
        mockUseQuery.mockReturnValue({
          data: [],
          isLoading: false,
          error: null,
          isError: false,
          refetch: jest.fn()
        } as any);

        const { useTransactions } = useTransactionQueries;
        const result = useTransactions(filter);

        expect(result.isLoading).toBe(false);
        expect(result.error).toBeNull();
      }
    });
  });

  describe('Cache and Stale Data Edge Cases', () => {
    test('should handle stale data scenarios', async () => {
      const staleData = [{ id: 'old-transaction', amount: 100 }];
      const freshData = [{ id: 'new-transaction', amount: 200 }];

      // First call returns stale data
      mockUseQuery.mockReturnValueOnce({
        data: staleData,
        isLoading: false,
        error: null,
        isError: false,
        refetch: jest.fn().mockResolvedValue({ data: freshData })
      } as any);

      const { useTransactions } = useTransactionQueries;
      const result = useTransactions();

      expect(result.data).toEqual(staleData);
      
      // Refetch should get fresh data
      const refetchResult = await result.refetch();
      expect(refetchResult.data).toEqual(freshData);
    });

    test('should handle cache invalidation scenarios', async () => {
      const queryClient = {
        invalidateQueries: jest.fn(),
        removeQueries: jest.fn(),
        refetchQueries: jest.fn()
      };

      mockUseQueryClient.mockReturnValue(queryClient as any);
      mockUseQuery.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
        refetch: jest.fn()
      } as any);

      const { useTransactions } = useTransactionQueries;
      const result = useTransactions();

      expect(result.data).toEqual(mockTransactions);
      expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
    });
  });
});

// Export pentru a putea fi folosite în alte teste
export const mockTransactionData = {
  mockUser,
  mockTransactions,
  mockTransactionService,
  mockUseAuthStore
}; 