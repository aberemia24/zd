// Test minimal pentru supabaseService: create + fetch tranzacție mock
import { supabaseService } from './supabaseService';
import { TransactionType, FrequencyType } from '@shared-constants/enums';
import { CreateTransaction } from '@shared-constants/transaction.schema';

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

  it('creează și fetch-uiește o tranzacție', async () => {
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
