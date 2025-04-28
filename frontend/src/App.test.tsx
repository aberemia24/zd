// @ts-nocheck
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TransactionType, CategoryType, TITLES } from '@shared-constants';
import {
  MOCK_TRANSACTIONS_LIST,
  MOCK_BUTTONS,
  MOCK_LABELS,
  MOCK_TABLE
} from './test/mockData';

// Service mock
const mockGetFilteredTransactions = jest
  .fn()
  .mockResolvedValue({
    data: MOCK_TRANSACTIONS_LIST,
    total: MOCK_TRANSACTIONS_LIST.length,
    limit: 10,
    offset: 0
  });
const mockSaveTransaction = jest.fn((formData: any) =>
  Promise.resolve({ ...(formData as any), _id: 'mock-id' })
);
const mockGetCacheStats = jest.fn().mockReturnValue({
  entries: 1,
  hits: 2,
  misses: 1,
  ratio: 0.67
});

jest.mock('./services/transactionService', () => ({
  TransactionService: jest.fn().mockImplementation(() => ({
    getFilteredTransactions: mockGetFilteredTransactions,
    saveTransaction: mockSaveTransaction,
    getCacheStats: mockGetCacheStats
  }))
}));

// Form store mock
const mockHandleChange = jest.fn();
const mockHandleSubmit = jest.fn();
const mockResetForm = jest.fn();
const mockSetTransactionService = jest.fn();
const mockSetRefreshCallback = jest.fn();

jest.mock('./stores/transactionFormStore', () => ({
  useTransactionFormStore: jest.fn((selector?: any) => {
    const state = {
      form: {
        type: '',
        amount: '',
        date: '',
        category: '',
        subcategory: '',
        recurring: false,
        frequency: ''
      },
      error: '',
      success: '',
      loading: false,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      resetForm: mockResetForm,
      setTransactionService: mockSetTransactionService,
      setRefreshCallback: mockSetRefreshCallback
    };
    return selector ? selector(state) : state;
  })
}));

// Transaction store mock
const mockSetQueryParams = jest.fn();
const mockFetchTransactions = jest.fn();
const mockResetTransactions = jest.fn();
const defaultQueryParams = {
  limit: 10,
  offset: 0,
  sort: 'date',
  type: '',
  category: ''
};

jest.mock('./stores/transactionStore', () => ({
  useTransactionStore: jest.fn((selector?: any) => {
    const state = {
      transactions: MOCK_TRANSACTIONS_LIST,
      loading: false,
      total: MOCK_TRANSACTIONS_LIST.length,
      error: '',
      currentQueryParams: defaultQueryParams,
      setQueryParams: mockSetQueryParams,
      fetchTransactions: mockFetchTransactions,
      resetTransactions: mockResetTransactions
    };
    return selector ? selector(state) : state;
  }),
  defaultQueryParams
}));

// Filters store mock
export const mockSetFilterType = jest.fn();
export const mockSetFilterCategory = jest.fn();

jest.mock('./stores/transactionFiltersStore', () => ({
  useTransactionFiltersStore: jest.fn((selector?: any) => {
    const state = {
      filterType: '',
      filterCategory: '',
      setFilterType: mockSetFilterType,
      setFilterCategory: mockSetFilterCategory
    };
    return selector ? selector(state) : state;
  }),
  mockSetFilterType,
  mockSetFilterCategory
}));

const { App } = require('./App');

describe('App component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('afișează titlul principal corect', () => {
    render(<App />);
    expect(screen.getByText(TITLES.TRANZACTII)).toBeInTheDocument();
  });

  it('permite filtrarea tranzacțiilor cu store-ul Zustand', () => {
    render(<App />);
    const typeFilter = screen.getByLabelText(
      MOCK_LABELS.TYPE_FILTER,
      { exact: false }
    );
    fireEvent.change(typeFilter, {
      target: { value: TransactionType.EXPENSE }
    });
    expect(mockSetFilterType).toHaveBeenCalledWith(
      TransactionType.EXPENSE
    );

    const categoryFilter = screen.getByLabelText(
      MOCK_LABELS.CATEGORY_FILTER,
      { exact: false }
    );
    fireEvent.change(categoryFilter, {
      target: { value: CategoryType.EXPENSE }
    });
    expect(mockSetFilterCategory).toHaveBeenCalledWith(
      CategoryType.EXPENSE
    );
  });

  it('permite adăugarea unei tranzacții noi prin formularul de tranzacție', async () => {
    render(<App />);
    const submitButton = screen.getByText(MOCK_BUTTONS.ADD);
    fireEvent.click(submitButton);
    expect(mockHandleSubmit).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockFetchTransactions).toHaveBeenCalled();
    });
  });

  it('afișează starea de încărcare din store', () => {
    const { useTransactionStore } = require(
      './stores/transactionStore'
    );
    useTransactionStore.mockImplementation((selector: any) =>
      selector({
        transactions: [],
        loading: true,
        total: 0,
        error: '',
        currentQueryParams: defaultQueryParams,
        setQueryParams: mockSetQueryParams,
        fetchTransactions: mockFetchTransactions,
        resetTransactions: mockResetTransactions
      })
    );
    render(<App />);
    expect(screen.getByText(MOCK_TABLE.LOADING)).toBeInTheDocument();
  });

  it('afișează eroarea din store', () => {
    const errorMessage =
      'Eroare la încărcarea tranzacțiilor';
    const { useTransactionStore } = require(
      './stores/transactionStore'
    );
    useTransactionStore.mockImplementation((selector: any) =>
      selector({
        transactions: [],
        loading: false,
        total: 0,
        error: errorMessage,
        currentQueryParams: defaultQueryParams,
        setQueryParams: mockSetQueryParams,
        fetchTransactions: mockFetchTransactions,
        resetTransactions: mockResetTransactions
      })
    );
    render(<App />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
