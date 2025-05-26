/**
 * Tipuri TypeScript pentru testele E2E
 */

// Tipuri pentru conturi de test
export interface TestAccount {
  email: string;
  password: string;
  type: 'real_account' | 'generated' | 'temporary';
  description?: string;
  id?: string;
}

// Tipuri pentru configurarea testelor
export interface TestConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
}

// Tipuri pentru rezultatele testelor
export interface TestResult {
  success: boolean;
  message?: string;
  screenshot?: string;
  duration?: number;
}

// Tipuri pentru date de test
export interface TransactionTestData {
  type: 'INCOME' | 'EXPENSE' | 'SAVING';
  amount: number;
  category: string;
  subcategory?: string;
  description?: string;
  date?: string;
}

// Tipuri pentru assertii
export interface AssertionOptions {
  timeout?: number;
  retries?: number;
  soft?: boolean;
}

// Tipuri pentru page state
export interface PageState {
  isLoggedIn: boolean;
  currentPage: string;
  hasErrors: boolean;
  isLoading: boolean;
} 