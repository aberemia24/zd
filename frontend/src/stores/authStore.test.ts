import { act } from 'react';
import { useAuthStore } from './authStore';
import { supabaseAuthService, AuthErrorType } from '../services/supabaseAuthService';
import { MESAJE } from '@shared-constants';
import { resetAllStores } from '../test-utils';

// Mock module pentru supabaseAuthService (serviciu extern, conform regulilor globale)
jest.mock('../services/supabaseAuthService', () => ({
  __esModule: true,
  AuthErrorType: {
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    PASSWORD_WEAK: 'PASSWORD_WEAK',
    EMAIL_INVALID: 'EMAIL_INVALID',
    USER_NOT_FOUND: 'USER_NOT_FOUND'
  },
  supabaseAuthService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

describe('authStore', () => {
  // Folosim resetAllStores() din test-utils conform regulilor globale
  beforeEach(() => {
    resetAllStores();
    // clear mocks - păstrăm acest pas pentru mockurile de servicii externe
    (supabaseAuthService.login as jest.Mock).mockReset();
    (supabaseAuthService.register as jest.Mock).mockReset();
    (supabaseAuthService.logout as jest.Mock).mockReset();
    (supabaseAuthService.getCurrentUser as jest.Mock).mockReset();
  });
  
  // Asigurăm cleanup și după teste
  afterEach(() => {
    resetAllStores();
  });

  it('login cu succes setează user', async () => {
    // Mock rezultat API pentru autentificare reușită
    (supabaseAuthService.login as jest.Mock).mockResolvedValueOnce({ 
      user: { id: 'mock-id', email: 'test@mock.com' }, 
      error: null 
    });
    
    // Apelăm funcția de login din store și așteptăm finalizarea
    await act(async () => {
      await useAuthStore.getState().login('test@mock.com', '12345678');
    });
    
    // Verificăm că userul a fost setat corect în store
    const { user, errorType, loading } = useAuthStore.getState();
    expect(user).toEqual({ id: 'mock-id', email: 'test@mock.com' });
    expect(errorType).toBeUndefined();
    expect(loading).toBe(false);
  });

  it('login cu credentiale greșite setează errorType și error', async () => {
    // Mock rezultat API pentru autentificare eșuată
    (supabaseAuthService.login as jest.Mock).mockResolvedValueOnce({ 
      user: null, 
      error: MESAJE.EROARE_AUTENTIFICARE, 
      errorType: 'INVALID_CREDENTIALS' 
    });
    
    await act(async () => {
      await useAuthStore.getState().login('fail@fail.com', 'wrongpass');
    });
    
    const { user, error, errorType, loading } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(error).toBe(MESAJE.EROARE_AUTENTIFICARE);
    expect(errorType).toBe('INVALID_CREDENTIALS');
    expect(loading).toBe(false);
  });

  it('register cu parolă slabă returnează eroare', async () => {
    // Mock rezultat API pentru înregistrare cu parolă slabă
    (supabaseAuthService.register as jest.Mock).mockResolvedValueOnce({ 
      user: null, 
      error: MESAJE.PAROLA_PREA_SLABA, 
      errorType: 'PASSWORD_WEAK' 
    });
    
    await act(async () => {
      await useAuthStore.getState().register('new@mock.com', 'short');
    });
    
    const { user, error, errorType, loading } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(error).toBe(MESAJE.PAROLA_PREA_SLABA);
    expect(errorType).toBe('PASSWORD_WEAK');
    expect(loading).toBe(false);
  });

  it('register cu succes setează user', async () => {
    // Mock rezultat API pentru înregistrare reușită
    (supabaseAuthService.register as jest.Mock).mockResolvedValueOnce({ 
      user: { id: 'mock-id', email: 'new@mock.com' }, 
      error: null 
    });
    
    await act(async () => {
      await useAuthStore.getState().register('new@mock.com', '12345678');
    });
    
    const { user, errorType, loading } = useAuthStore.getState();
    expect(user).toEqual({ id: 'mock-id', email: 'new@mock.com' });
    expect(errorType).toBeUndefined();
    expect(loading).toBe(false);
  });

  it('logout resetează user', async () => {
    // Setup cu act() pentru a respecta regulile - pregătim store cu user existent
    act(() => {
      useAuthStore.setState({ 
        user: { id: 'mock-id', email: 'test@mock.com' }, 
        loading: false, 
        error: null, 
        errorType: undefined 
      });
    });
    
    // Mock rezultat API pentru logout
    (supabaseAuthService.logout as jest.Mock).mockResolvedValueOnce(undefined);
    
    await act(async () => {
      await useAuthStore.getState().logout();
    });
    
    const { user, loading } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(loading).toBe(false);
  });
  
  it('checkUser setează utilizatorul curent din sesiune', async () => {
    // Mock rezultat API pentru getCurrentUser
    (supabaseAuthService.getCurrentUser as jest.Mock).mockResolvedValueOnce({ 
      id: 'session-user-id', 
      email: 'session@example.com' 
    });
    
    await act(async () => {
      await useAuthStore.getState().checkUser();
    });
    
    const { user, loading } = useAuthStore.getState();
    expect(user).toEqual({ id: 'session-user-id', email: 'session@example.com' });
    expect(loading).toBe(false);
  });
});
