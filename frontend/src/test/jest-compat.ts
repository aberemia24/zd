import { vi } from 'vitest';

// Jest compatibility layer for Vitest
// Provides Jest-specific APIs that are commonly used in tests

// Create global jest object with Vitest equivalents
(global as any).jest = {
  fn: vi.fn,
  mock: vi.mock,
  unmock: vi.unmock,
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  restoreAllMocks: vi.restoreAllMocks,
  spyOn: vi.spyOn,
  mocked: vi.mocked,
  useFakeTimers: vi.useFakeTimers,
  useRealTimers: vi.useRealTimers,
  runAllTimers: vi.runAllTimers,
  advanceTimersByTime: vi.advanceTimersByTime,
  setSystemTime: vi.setSystemTime,
  getRealSystemTime: vi.getRealSystemTime,
  clearAllTimers: vi.clearAllTimers,
};

// Environment variables for testing
// Mock Supabase configuration to prevent connection errors in tests
process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

// Mock Supabase module to prevent initialization errors
vi.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn(() => Promise.resolve({ 
        data: { session: null }, 
        error: null 
      })),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      }))
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            range: vi.fn(() => Promise.resolve({
              data: [],
              error: null,
              count: 0
            }))
          }))
        }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => Promise.resolve({ data: null, error: null })),
      delete: vi.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }
}));

// Additional Jest-like globals that might be needed
(global as any).beforeAll = beforeAll;
(global as any).afterAll = afterAll;
(global as any).beforeEach = beforeEach;
(global as any).afterEach = afterEach;
(global as any).describe = describe;
(global as any).it = it;
(global as any).test = test;
(global as any).expect = expect; 