// Funcții utilitare pentru testare
import { Transaction } from '../types/Transaction';
import { MOCK_USER_ID } from './mockData';

import { render, fireEvent, within } from '@testing-library/react';

// Creează rapid o tranzacție mock cu override-uri
import { TransactionType } from 'shared-constants';

export function createMockTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'mockId',
    _id: 'mockId',
    userId: MOCK_USER_ID,
    type: TransactionType.INCOME,
    amount: '100',
    currency: 'RON',
    date: '2025-04-22',
    category: 'VENITURI',
    subcategory: '',
    recurring: false,
    frequency: undefined,
    ...overrides,
  };
}

// Resetează baza mock de tranzacții
export function resetMockTransactions(transactions: Transaction[], initial: Transaction[]) {
  transactions.length = 0;
  transactions.push(...initial);
}

// Pattern: mock global.fetch cu răspuns customizabil
export function mockFetch(response: any, ok = true, status = 200) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(response)
    } as Response)
  ) as jest.Mock;
}

// Pattern: extragere exhaustivă subcategorii pentru o categorie (pentru dropdown-uri controlate)
export function getAllSubcategories(categories: Record<string, any>, category: string): string[] {
  return categories[category]?.subcategories || [];
}

// Pattern: render cu provider/context (ex: redux, theme, etc.)


// Exemplu generic, adaptează la contextul tău
export function renderWithProviders(ui: React.ReactElement, { providerProps = {}, ...renderOptions } = {}) {
  // return render(<Provider {...providerProps}>{ui}</Provider>, renderOptions);
  return render(ui, renderOptions);
}

// Pattern: resetare rapidă a tuturor mock-urilor Jest
export function clearAllMocks() {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
}
