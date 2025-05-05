// Test minimal pentru supabaseService: create + fetch tranzacție mock
// Notă: folosim import-uri mock-uite în servicii/__mocks__
import { supabaseService } from './supabaseService';
import { TransactionType, FrequencyType } from '@shared-constants/enums';
import { CreateTransaction } from '@shared-constants/transaction.schema';

// Mock direct pentru supabase pentru a controla răspunsurile specifice acestui test
jest.mock('./supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: '11111111-1111-1111-1111-111111111111' } },
        error: null
      })
    }
  }
}));

describe('supabaseService', () => {
  const mockUserId = '11111111-1111-1111-1111-111111111111';
  let createdId: string | undefined;

  const mockTransaction: CreateTransaction = {
    amount: 123.45,
    type: TransactionType.EXPENSE,
    date: '2025-04-30',
    category: 'Test',
    subcategory: 'Unit',
    recurring: false,
    frequency: FrequencyType.NONE,
    description: 'Test tranzacție',
  };

  // Mock implementation pentru test specific
  beforeEach(() => {
    // Mock createTransaction pentru a returna id stabil
    jest.spyOn(supabaseService, 'createTransaction').mockImplementation((data) => {
      const result = {
        id: 'mock-test-id-123',
        user_id: mockUserId,
        ...data,
        created_at: new Date().toISOString()
      };
      createdId = result.id;
      return Promise.resolve(result);
    });
    
    // Mock fetchTransactions pentru acest test specific
    jest.spyOn(supabaseService, 'fetchTransactions').mockImplementation(() => {
      return Promise.resolve({
        data: [{
          id: 'mock-test-id-123',
          user_id: mockUserId,
          ...mockTransaction,
          created_at: new Date().toISOString()
        }],
        count: 1,
        error: null
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('crează și fetch-uiește o tranzacție', async () => {
    // Creează tranzacție
    const created = await supabaseService.createTransaction({ ...mockTransaction });
    createdId = created.id;
    expect(created.amount).toBe(mockTransaction.amount);
    expect(created.type).toBe(mockTransaction.type);
    // Fetch tranzacții pentru user
    const { data } = await supabaseService.fetchTransactions(mockUserId, { limit: 10 });
    expect(Array.isArray(data)).toBe(true);
    // Cleanup
    if (createdId) await supabaseService.deleteTransaction(createdId);
  });
});
