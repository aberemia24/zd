import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { queryKeys } from '../../../../../services/hooks/reactQueryUtils';
import { useMonthlyTransactions } from '../../../../../services/hooks/useMonthlyTransactions';
import { useTransactionOperations } from '../useTransactionOperations';

// Mock mutation hooks
vi.mock('../../../../../services/hooks/transactionMutations', () => ({
  useCreateTransaction: () => ({ mutateAsync: vi.fn(() => Promise.resolve()) }),
  useUpdateTransaction: () => ({ mutateAsync: vi.fn(() => Promise.resolve()) }),
  useDeleteTransactionMonthly: () => ({ mutateAsync: vi.fn(() => Promise.resolve()) })
}));

vi.mock('../../../../../hooks/useLunarGridPreferences', () => ({
  useLunarGridPreferences: () => ({ preferences: { deleteConfirmationEnabled: false } })
}));

vi.mock('../../../primitives/ConfirmationModal', () => ({
  useConfirmationModal: () => ({ modalProps: {}, showConfirmation: vi.fn() })
}));

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

const TestGrid: React.FC<{ year: number; month: number; userId: string }> = ({ year, month, userId }) => {
  const { handleSaveTransaction } = useTransactionOperations({ year, month, userId });
  const { transactions } = useMonthlyTransactions(year, month, userId, { staleTime: 5 * 60 * 1000, refetchOnMount: false, refetchOnWindowFocus: false });

  return (
    <div>
      <div data-testid="count">{transactions.length}</div>
      <button data-testid="add" onClick={() => handleSaveTransaction({ amount: 123, type: 'expense', date: '2025-06-14', category: 'Misc', description: '', subcategory: undefined, isRecurring: false } as any)}>
        Add
      </button>
    </div>
  );
};

describe('LunarGrid optimistic integration', () => {
  it('adds transaction in UI instantly without refetch flicker', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const key = queryKeys.transactions.monthly(2025, 6, 'uid');
    qc.setQueryData(key, { data: [], count: 0 });

    render(
      <QueryClientProvider client={qc}>
        <TestGrid year={2025} month={6} userId="uid" />
      </QueryClientProvider>
    );

    // iniţial 0
    expect(screen.getByTestId('count').textContent).toBe('0');

    await userEvent.click(screen.getByTestId('add'));

    // după click → instant 1
    expect(screen.getByTestId('count').textContent).toBe('1');
  });
});
