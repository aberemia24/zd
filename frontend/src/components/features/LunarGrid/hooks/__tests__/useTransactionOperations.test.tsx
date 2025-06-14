import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { queryKeys } from '../../../../../services/hooks/reactQueryUtils';
import { useTransactionOperations } from '../useTransactionOperations';

// 🧪 Mock mutation hooks să nu facă network
vi.mock('../../../../../services/hooks/transactionMutations', () => {
  return {
    useCreateTransaction: () => ({ mutateAsync: vi.fn(() => Promise.resolve()) }),
    useUpdateTransaction: () => ({ mutateAsync: vi.fn(() => Promise.resolve()) }),
    useDeleteTransactionMonthly: () => ({ mutateAsync: vi.fn(() => Promise.resolve()) })
  };
});

vi.mock('../../../../hooks/useLunarGridPreferences', () => {
  return { useLunarGridPreferences: () => ({ preferences: { deleteConfirmationEnabled: false } }) };
});

vi.mock('../../../primitives/ConfirmationModal', () => {
  return {
    useConfirmationModal: () => ({
      modalProps: {},
      showConfirmation: vi.fn()
    })
  };
});

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

// ---------- TEST ----------

describe('useTransactionOperations - optimistic update', () => {
  const year = 2025;
  const month = 6;
  const userId = 'uid';

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };

  it('patches monthly cache local fără invalidateQueries', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapperLocal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );

    // Primul populate cache cu array gol
    const key = queryKeys.transactions.monthly(year, month, userId);
    qc.setQueryData(key, { data: [], count: 0 });

    const { result } = renderHook(() => useTransactionOperations({ year, month, userId }), {
      wrapper: wrapperLocal,
    });

    const tx = {
      amount: 100,
      type: 'expense',
      date: '2025-06-14',
      category: 'Food',
      description: '',
      subcategory: undefined,
      isRecurring: false,
    } as any;

    await act(async () => {
      await result.current.handleSaveTransaction(tx);
    });

    const cached: any = qc.getQueryData(key);
    expect(cached?.data.length).toBe(1);
    expect(cached.data[0].amount).toBe(100);
  });
});
