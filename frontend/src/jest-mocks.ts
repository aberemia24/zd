/**
 * Mock-uri globale pentru Jest folosite în teste
 * OWNER: echipa testare
 * 
 * Acest fișier conține mock-uri comune reutilizabile pentru teste.
 * Se poate include la începutul fiecărui fișier de test care necesită mock-uri comune.
 */

import { MESAJE } from '@shared-constants/messages';
import { FrequencyType, CategoryType } from '@shared-constants/enums';

// Mock pentru user autentificat
export const mockAuthUser = { id: 'mock-test-user-id', email: 'test@example.com' };

// Exportăm și mesaje mock pentru a evita discrepanțe între texte în teste
export const MOCK_MESAJE = {
  CAMPURI_OBLIGATORII: "Completează toate câmpurile obligatorii",
  FRECV_RECURENTA: "Selectează frecvența pentru tranzacție recurentă",
  SUCCES_ADAUGARE: "Tranzacție adăugată cu succes!",
  USER_NEAUTENTIFICAT: "Utilizatorul nu este autentificat!"
};

// FORM_DEFAULTS pentru teste
export const MOCK_FORM_DEFAULTS = {
  amount: 0,
  description: '',
  date: new Date().toISOString().split('T')[0],
  type: 'EXPENSE',
  category: 'EXPENSE',
  subcategory: '',
  isRecurring: false,
  frequency: 'MONTHLY'
};

// State inițial pentru formularul de tranzacție
export const INITIAL_FORM_STATE = {
  ...MOCK_FORM_DEFAULTS,
  id: '',
  user_id: mockAuthUser.id,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Helper pentru crearea unui state complet pentru TransactionFormStore
export const createMockTransactionFormState = (overrides = {}) => {
  const formData = {
    ...INITIAL_FORM_STATE,
    ...overrides
  };
  
  return {
    form: formData,
    loading: false,
    success: '',
    error: '',
    subcategories: [],
    // Metodele mock 
    setField: jest.fn(),
    resetForm: jest.fn(),
    submitForm: jest.fn(),
    updateTransaction: jest.fn(),
    deleteTransaction: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
  };
};

// --- DRY MOCK SETUP HELPERS ---

import { setMockFormState, useTransactionFormStore } from './__mocks__/stores/transactionFormStore';
import { setMockTransactionState, useTransactionStore } from './__mocks__/stores/transactionStore';
import { setMockAuthState, useAuthStore } from './__mocks__/stores/authStore';

/**
 * Setup mock pentru useTransactionFormStore hook + state, cu posibilitate de override și custom onSave/onCancel.
 * Returnează { onSave, onCancel } pentru a fi folosite în teste.
 */
export function setupTransactionFormMocks({
  formOverrides = {},
  storeOverrides = {},
  onSave = jest.fn(),
  onCancel = jest.fn(),
} = {}) {
  jest.clearAllMocks();
  const initialForm = {
    type: '',
    amount: '',
    category: '',
    subcategory: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    frequency: FrequencyType.MONTHLY,
    ...formOverrides
  };
  setMockFormState({
    form: { ...initialForm },
    error: '',
    success: '',
    loading: false,
    setForm: jest.fn((newForm) => setMockFormState({ form: { ...useTransactionFormStore.getState().form, ...newForm } })),
    setError: jest.fn((error) => setMockFormState({ error })),
    setSuccess: jest.fn((success) => setMockFormState({ success })),
    setLoading: jest.fn((loading) => setMockFormState({ loading })),
    resetForm: jest.fn(() => setMockFormState({ form: { ...initialForm }, error: '', success: '', loading: false })),
    validateForm: jest.fn((form: any) => true),
    handleSubmit: jest.fn(async (e) => {
      e?.preventDefault?.();
      const state = useTransactionFormStore.getState();
      state.setLoading(true);
      if (state.validateForm(state.form)) {
        await new Promise<void>(resolve => setTimeout(resolve, 10));
        onSave(state.form);
        state.setSuccess(MESAJE.SUCCES_ADAUGARE);
      } else {
        state.setError(MESAJE.EROARE_GENERALA);
      }
      state.setLoading(false);
    }),
    ...storeOverrides
  });
  return { onSave, onCancel };
}

/**
 * Setup mock pentru useTransactionStore hook + state, cu override.
 */
export function setupTransactionStoreMocks({ storeOverrides = {} } = {}) {
  setMockTransactionState({
    transactions: [],
    total: 0,
    loading: false,
    error: null,
    getAllSubcategories: jest.fn((category) => {
      if (!category) return [];
      if (category === CategoryType.EXPENSE) return ['Supermarket', 'Haine'];
      return ['Subcategorie Default'];
    }),
    ...storeOverrides
  });
}

/**
 * Setup mock pentru useAuthStore hook + state, cu override.
 */
export function setupAuthStoreMocks({ storeOverrides = {} } = {}) {
  setMockAuthState({
    user: { id: 'test-user-id', email: 'test@example.com' },
    loading: false,
    error: null,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    checkUser: jest.fn(),
    ...storeOverrides
  });
}

// Mock pentru authStore - stare autentificată
export const mockAuthState = {
  user: mockAuthUser,
  loading: false,
  error: null,
  errorType: undefined,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  checkUser: jest.fn()
};

// Mock pentru supabaseService
export const mockSupabaseService = {
  fetchTransactions: jest.fn().mockResolvedValue({ data: [], count: 0, error: null }),
  getTransactionById: jest.fn().mockResolvedValue({ data: null, error: null }),
  createTransaction: jest.fn().mockImplementation((data) => {
    return Promise.resolve({
      id: 'mock-created-id',
      user_id: mockAuthUser.id,
      ...data,
      created_at: new Date().toISOString()
    });
  }),
  updateTransaction: jest.fn().mockImplementation((id, data) => {
    return Promise.resolve({
      id,
      user_id: mockAuthUser.id,
      ...data,
      updated_at: new Date().toISOString()
    });
  }),
  deleteTransaction: jest.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null })
};

// Export hooks for tests
export { useTransactionFormStore, useTransactionStore, useAuthStore };
