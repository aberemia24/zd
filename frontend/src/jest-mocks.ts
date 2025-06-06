/**
 * Mock-uri globale pentru Jest folosite în teste
 * OWNER: echipa testare
 *
 * Acest fișier conține mock-uri comune reutilizabile pentru teste.
 * Se poate include la începutul fiecărui fișier de test care necesită mock-uri comune.
 */

import { MESAJE } from "@budget-app/shared-constants/messages";
import { FrequencyType, CategoryType } from "@budget-app/shared-constants/enums";

// Mock pentru user autentificat
export const mockAuthUser = {
  id: "mock-test-user-id",
  email: "test@example.com",
};

// Exportăm și mesaje mock pentru a evita discrepanțe între texte în teste
export const MOCK_MESAJE = {
  CAMPURI_OBLIGATORII: "Completează toate câmpurile obligatorii",
  FRECV_RECURENTA: "Selectează frecvența pentru tranzacție recurentă",
  SUCCES_ADAUGARE: "Tranzacție adăugată cu succes!",
  USER_NEAUTENTIFICAT: "Utilizatorul nu este autentificat!",
};

// FORM_DEFAULTS pentru teste
export const MOCK_FORM_DEFAULTS = {
  amount: 0,
  description: "",
  date: new Date().toISOString().split("T")[0],
  type: "EXPENSE",
  category: "EXPENSE",
  subcategory: "",
  isRecurring: false,
  frequency: "MONTHLY",
};

// State inițial pentru formularul de tranzacție
export const INITIAL_FORM_STATE = {
  ...MOCK_FORM_DEFAULTS,
  id: "",
  user_id: mockAuthUser.id,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Helper pentru crearea unui state complet pentru TransactionFormStore
export const createMockTransactionFormState = (overrides = {}) => {
  const formData = {
    ...INITIAL_FORM_STATE,
    ...overrides,
  };

  return {
    form: formData,
    loading: false,
    success: "",
    error: "",
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

// [REGULĂ] Nu mock-uim store-uri Zustand conform regulilor globale. Orice excepție trebuie documentată în PR și DEV_LOG.md.
// Importuri pentru store-uri Zustand și funcții de mock au fost eliminate. Folosește doar store-urile reale în teste.

// Mock pentru authStore - stare autentificată
export const mockAuthState = {
  user: mockAuthUser,
  loading: false,
  error: null,
  errorType: undefined,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  checkUser: jest.fn(),
};

// Mock pentru supabaseService
export const mockSupabaseService = {
  fetchTransactions: jest
    .fn()
    .mockResolvedValue({ data: [], count: 0, error: null }),
  getTransactionById: jest.fn().mockResolvedValue({ data: null, error: null }),
  createTransaction: jest.fn().mockImplementation((data) => {
    return Promise.resolve({
      id: "mock-created-id",
      user_id: mockAuthUser.id,
      ...data,
      created_at: new Date().toISOString(),
    });
  }),
  updateTransaction: jest.fn().mockImplementation((id, data) => {
    return Promise.resolve({
      id,
      user_id: mockAuthUser.id,
      ...data,
      updated_at: new Date().toISOString(),
    });
  }),
  deleteTransaction: jest
    .fn()
    .mockResolvedValue({ data: { id: "mock-id" }, error: null }),
};
