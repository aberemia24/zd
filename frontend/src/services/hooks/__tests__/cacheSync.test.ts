import { QueryClient } from '@tanstack/react-query';
import { syncGlobalTransactionCache, invalidateGlobalTransactionCache } from '../cacheSync';
import { TransactionValidated, TransactionType } from '@budget-app/shared-constants';
import { TransactionType } from '@budget-app/shared-constants';

describe('Cache Sync Functionality', () => {
  let queryClient: QueryClient;
  const mockUserId = 'test-user-123';
  
  const mockTransaction: TransactionValidated = {
    id: 'tx-123',
    amount: 100,
    description: 'Test transaction',
    category: 'Food',
    type: TransactionType.EXPENSE,
    date: '2025-05-29',
    created_at: '2025-05-29T10:00:00Z',
    updated_at: '2025-05-29T10:00:00Z'
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    
    // Clear dev logging flag
    if (typeof window !== 'undefined') {
      window.__CACHE_SYNC_LOGGING__ = false;
    }
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('syncGlobalTransactionCache', () => {
    it('should skip sync when no global caches exist', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      syncGlobalTransactionCache({
        queryClient,
        userId: mockUserId,
        operation: 'create',
        transaction: mockTransaction
      });

      // Nu ar trebui să apărut logging pentru că nu există cache-uri
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should successfully sync create operation to existing infinite cache', () => {
      const existingData = {
        pages: [{
          data: [],
          nextCursor: null,
          hasNextPage: false
        }],
        pageParams: [null]
      };

      // Setup existing infinite query cache
      const cacheKey = ['transactions', 'infinite', mockUserId, {}];
      queryClient.setQueryData(cacheKey, existingData);

      // Sync new transaction
      syncGlobalTransactionCache({
        queryClient,
        userId: mockUserId,
        operation: 'create',
        transaction: mockTransaction
      });

      // Verify transaction was added to first page
      const updatedData = queryClient.getQueryData(cacheKey) as any;
      expect(updatedData.pages[0].data).toHaveLength(1);
      expect(updatedData.pages[0].data[0]).toEqual(mockTransaction);
    });

    it('should successfully sync update operation', () => {
      const existingTransaction = { ...mockTransaction, amount: 50 };
      const existingData = {
        pages: [{
          data: [existingTransaction],
          nextCursor: null,
          hasNextPage: false
        }],
        pageParams: [null]
      };

      const cacheKey = ['transactions', 'infinite', mockUserId, {}];
      queryClient.setQueryData(cacheKey, existingData);

      const updatedTransaction = { ...mockTransaction, amount: 150 };

      syncGlobalTransactionCache({
        queryClient,
        userId: mockUserId,
        operation: 'update',
        transaction: updatedTransaction
      });

      const updatedData = queryClient.getQueryData(cacheKey) as any;
      expect(updatedData.pages[0].data[0].amount).toBe(150);
    });

    it('should successfully sync delete operation', () => {
      const existingData = {
        pages: [{
          data: [mockTransaction],
          nextCursor: null,
          hasNextPage: false
        }],
        pageParams: [null]
      };

      const cacheKey = ['transactions', 'infinite', mockUserId, {}];
      queryClient.setQueryData(cacheKey, existingData);

      syncGlobalTransactionCache({
        queryClient,
        userId: mockUserId,
        operation: 'delete',
        transaction: {} as TransactionValidated,
        deletedId: mockTransaction.id
      });

      const updatedData = queryClient.getQueryData(cacheKey) as any;
      expect(updatedData.pages[0].data).toHaveLength(0);
    });

    it('should handle multiple infinite query caches', () => {
      const existingData = {
        pages: [{ data: [], nextCursor: null, hasNextPage: false }],
        pageParams: [null]
      };

      // Setup multiple cache keys
      const cacheKey1 = ['transactions', 'infinite', mockUserId, { category: 'Food' }];
      const cacheKey2 = ['transactions', 'infinite', mockUserId, { type: TransactionType.EXPENSE }];
      
      queryClient.setQueryData(cacheKey1, existingData);
      queryClient.setQueryData(cacheKey2, existingData);

      syncGlobalTransactionCache({
        queryClient,
        userId: mockUserId,
        operation: 'create',
        transaction: mockTransaction
      });

      // Both caches should be updated
      const updatedData1 = queryClient.getQueryData(cacheKey1) as any;
      const updatedData2 = queryClient.getQueryData(cacheKey2) as any;
      
      expect(updatedData1.pages[0].data).toHaveLength(1);
      expect(updatedData2.pages[0].data).toHaveLength(1);
    });

    it('should handle errors gracefully in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Simulate error by providing invalid parameters
      expect(() => {
        syncGlobalTransactionCache({
          queryClient: null as any,
          userId: mockUserId,
          operation: 'create',
          transaction: mockTransaction
        });
      }).toThrow();

      expect(consoleSpy).toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
      consoleSpy.mockRestore();
    });

    it('should fail silently in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Should not throw in production
      expect(() => {
        syncGlobalTransactionCache({
          queryClient: null as any,
          userId: mockUserId,
          operation: 'create',
          transaction: mockTransaction
        });
      }).not.toThrow();

      process.env.NODE_ENV = originalEnv;
      consoleSpy.mockRestore();
    });
  });

  describe('invalidateGlobalTransactionCache', () => {
    it('should invalidate all global transaction caches for user', () => {
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
      
      invalidateGlobalTransactionCache(queryClient, mockUserId);
      
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['transactions', 'infinite', mockUserId],
        exact: false
      });
      
      invalidateSpy.mockRestore();
    });

    it('should handle invalidation errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')
        .mockImplementation(() => { throw new Error('Invalidation failed'); });
      
      expect(() => {
        invalidateGlobalTransactionCache(queryClient, mockUserId);
      }).not.toThrow();
      
      expect(consoleSpy).toHaveBeenCalled();
      
      invalidateSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('Dev Logging', () => {
    it('should log operations in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation();
      
      const existingData = {
        pages: [{ data: [], nextCursor: null, hasNextPage: false }],
        pageParams: [null]
      };
      
      queryClient.setQueryData(['transactions', 'infinite', mockUserId, {}], existingData);
      
      syncGlobalTransactionCache({
        queryClient,
        userId: mockUserId,
        operation: 'create',
        transaction: mockTransaction
      });

      expect(consoleGroupSpy).toHaveBeenCalledWith('[CACHE-SYNC] CREATE');
      expect(consoleLogSpy).toHaveBeenCalledWith('Transaction ID:', mockTransaction.id);
      expect(consoleLogSpy).toHaveBeenCalledWith('Global caches updated:', 1);
      expect(consoleGroupEndSpy).toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
      consoleGroupSpy.mockRestore();
      consoleLogSpy.mockRestore();
      consoleGroupEndSpy.mockRestore();
    });

    it('should not log in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();
      
      const existingData = {
        pages: [{ data: [], nextCursor: null, hasNextPage: false }],
        pageParams: [null]
      };
      
      queryClient.setQueryData(['transactions', 'infinite', mockUserId, {}], existingData);
      
      syncGlobalTransactionCache({
        queryClient,
        userId: mockUserId,
        operation: 'create',
        transaction: mockTransaction
      });

      expect(consoleGroupSpy).not.toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
      consoleGroupSpy.mockRestore();
    });
  });
}); 
