import { act } from 'react';
import { useAuthStore } from './authStore';
import { supabaseAuthService, AuthErrorType } from '../services/supabaseAuthService';
// Import normal pentru a putea folosi enum-ul ca valoare

// Mock module pentru supabaseAuthService
jest.mock('../services/supabaseAuthService', () => ({
  __esModule: true,
  supabaseAuthService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    // reset store state
    useAuthStore.setState({ user: null, loading: false, error: null, errorType: undefined });
    // clear mocks
    (supabaseAuthService.login as jest.Mock).mockReset();
    (supabaseAuthService.register as jest.Mock).mockReset();
    (supabaseAuthService.logout as jest.Mock).mockReset();
    (supabaseAuthService.getCurrentUser as jest.Mock).mockReset();
  });

  it('login cu succes setează user', async () => {
    (supabaseAuthService.login as jest.Mock).mockResolvedValueOnce({ user: { id: 'mock-id', email: 'test@mock.com' }, error: null });
    await act(async () => {
      await useAuthStore.getState().login('test@mock.com', '12345678');
    });
    const { user, errorType } = useAuthStore.getState();
    expect(user).toEqual({ id: 'mock-id', email: 'test@mock.com' });
    expect(errorType).toBeUndefined();
  });

  it('login cu credentiale greșite setează errorType și error', async () => {
    (supabaseAuthService.login as jest.Mock).mockResolvedValueOnce({ user: null, error: 'Invalid credentials', errorType: 'INVALID_CREDENTIALS' });
    await act(async () => {
      await useAuthStore.getState().login('fail@fail.com', 'wrongpass');
    });
    const { user, error, errorType } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(error).toBe('Invalid credentials');
    expect(errorType).toBe('INVALID_CREDENTIALS');
  });

  it('register cu parolă slabă returnează eroare', async () => {
    (supabaseAuthService.register as jest.Mock).mockResolvedValueOnce({ user: null, error: 'Parolă prea scurtă', errorType: 'PASSWORD_WEAK' });
    await act(async () => {
      await useAuthStore.getState().register('new@mock.com', 'short');
    });
    const { user, error, errorType } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(error).toBe('Parolă prea scurtă');
    expect(errorType).toBe('PASSWORD_WEAK');
  });

  it('register cu succes setează user', async () => {
    (supabaseAuthService.register as jest.Mock).mockResolvedValueOnce({ user: { id: 'mock-id', email: 'new@mock.com' }, error: null });
    await act(async () => {
      await useAuthStore.getState().register('new@mock.com', '12345678');
    });
    const { user, errorType } = useAuthStore.getState();
    expect(user).toEqual({ id: 'mock-id', email: 'new@mock.com' });
    expect(errorType).toBeUndefined();
  });

  it('logout resetează user', async () => {
    // pregătim store cu user existent
    useAuthStore.setState({ user: { id: 'mock-id', email: 'test@mock.com' }, loading: false, error: null, errorType: undefined });
    (supabaseAuthService.logout as jest.Mock).mockResolvedValueOnce(undefined);
    await act(async () => {
      await useAuthStore.getState().logout();
    });
    const { user } = useAuthStore.getState();
    expect(user).toBeNull();
  });
});
