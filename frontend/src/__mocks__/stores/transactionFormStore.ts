/**
 * Mock pentru transactionFormStore folosit în teste
 * OWNER: echipa tranzacții
 */

import { TransactionType, CategoryType, FrequencyType } from '@shared-constants';
import type { TransactionFormData } from '../../components/features/TransactionForm/TransactionForm';
import type { TransactionFormStoreState } from '../../stores/transactionFormStore';
import type { FormEvent } from 'react';

// State inițial pentru formularul de tranzacție
const INITIAL_FORM_STATE: TransactionFormData = {
  type: '',
  amount: '',
  category: '',
  subcategory: '',
  date: new Date().toISOString().split('T')[0],
  recurring: false,
  frequency: '',
};

// Mock persistent pentru store
// Use any to simplify mock state typing
const mockState: any = {
  form: { ...INITIAL_FORM_STATE },
  loading: false,
  success: '',
  error: '',
  setForm: jest.fn((form) => { mockState.form = { ...mockState.form, ...form }; }),
  setField: jest.fn((name, value) => { (mockState.form as any)[name] = value; }),
  setError: jest.fn((msg) => { mockState.error = msg; }),
  setSuccess: jest.fn((msg) => { mockState.success = msg; }),
  setLoading: jest.fn((val) => { mockState.loading = val; }),
  resetForm: jest.fn(() => { mockState.form = { ...INITIAL_FORM_STATE }; mockState.error=''; mockState.success=''; mockState.loading=false; }),
  validateForm: jest.fn(() => true),
  handleSubmit: jest.fn<Promise<void>, [FormEvent<HTMLFormElement>?]>(async (e?: FormEvent<HTMLFormElement>) => {}),
  setTransactionService: jest.fn(),
  getForm: jest.fn<TransactionFormData, []>(() => mockState.form!),
  getError: jest.fn<string, []>(() => mockState.error!),
  getSuccess: jest.fn<string, []>(() => mockState.success!),
  getLoading: jest.fn<boolean, []>(() => mockState.loading!),
};

// Exportăm un mock pentru useTransactionFormStore hook
export const useTransactionFormStore = jest.fn().mockImplementation((selector: any) => {
  if (typeof selector === 'function') {
    return selector(mockState);
  }
  return mockState;
}) as jest.Mock & { getState: jest.Mock };

// Necesar pentru mockGetState în Zustand
useTransactionFormStore.getState = jest.fn().mockReturnValue(mockState);

// Funcție pentru a actualiza starea mockului în teste
export const setMockFormState = (newState: any): any => {
  // Merge form state if provided
  if (newState.form) {
    mockState.form = { ...mockState.form, ...newState.form };
  }
  // Merge other state properties
  const { form, ...rest } = newState as any;
  Object.assign(mockState, rest as any);
  return mockState;
};
