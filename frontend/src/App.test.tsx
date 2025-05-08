/**
 * Test pentru App - Orchestrator pentru rutare între pagini
 * Conform regulilor: mock doar pentru external services
 * Owner: Echipa Frontend - Test
 */

import React from 'react';
import { act } from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import utilities din test-utils (funcții helper pentru teste)
import { 
  render, // customRender din test-utils, nu cel din RTL direct
  setupTestUser, 
  setupTestTransactions,
  resetAllStores,
  getActualMessages,
  screen // re-export din test-utils
} from './test-utils';

// Mockăm paginile pentru a testa doar rutarea
jest.mock('./pages/TransactionsPage', () => ({
  __esModule: true,
  default: () => <div data-testid="transactions-page-mock">TransactionsPage Mock</div>
}));

jest.mock('./pages/LunarGridPage', () => ({
  __esModule: true,
  default: () => <div data-testid="lunar-grid-page-mock">LunarGridPage Mock</div>
}));

// Mockăm componentele de autentificare pentru a testa rutarea
jest.mock('./components/features/Auth/LoginForm', () => ({
  __esModule: true,
  default: ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => (
    <div data-testid="login-form">
      <button data-testid="register-link" onClick={onSwitchToRegister}>Register</button>
    </div>
  )
}));

jest.mock('./components/features/Auth/RegisterForm', () => ({
  __esModule: true,
  default: ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => (
    <div data-testid="register-form">
      <button data-testid="login-link" onClick={onSwitchToLogin}>Login</button>
    </div>
  )
}));

// Mockăm Spinner pentru a testa loading
jest.mock('./components/primitives/Spinner', () => ({
  __esModule: true,
  default: ({ size }: { size: number }) => <div data-testid="loading-spinner">Loading...</div>
}));

import { App } from './App';
import { TransactionType, CategoryType, TITLES, MESAJE } from '@shared-constants';

// Stores reale (conform noilor reguli, nu le mock-uim)
import { useTransactionStore } from './stores/transactionStore';
import { useTransactionFormStore } from './stores/transactionFormStore';
import { useTransactionFiltersStore } from './stores/transactionFiltersStore';
import { useAuthStore } from './stores/authStore';

// Mockăm supabaseService (singura componentă externă care trebuie mockată conform regulilor)
jest.mock('./services/supabaseService', () => ({
  supabaseService: {
    fetchTransactions: jest.fn().mockResolvedValue({ data: [], count: 0 }),
    getTransactionById: jest.fn(),
    createTransaction: jest.fn().mockResolvedValue({ id: 'mock-id' }),
    updateTransaction: jest.fn(),
    deleteTransaction: jest.fn()
  }
}));

// Mockăm supabaseAuthService pentru testul de loading
jest.mock('./services/supabaseAuthService', () => ({
  supabaseAuthService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn().mockResolvedValue(null)
  }
}));

// Import serviciile după mock
import { supabaseService } from './services/supabaseService';
import { supabaseAuthService } from './services/supabaseAuthService';

// Configurație globală pentru toate testele
beforeEach(() => {
  // Configurăm un utilizator autentificat pentru toate testele
  // (Rezolvă problema "Utilizatorul nu este autentificat!")
  setupTestUser();
});

// Resetăm store-urile și mock-urile după fiecare test
afterEach(() => {
  jest.clearAllMocks();
  // Folosim utility function pentru reset (mai sigur)
  resetAllStores();
});

describe('App', () => {
  // Testul pentru verificarea tab-urilor de navigare
  it('afișează tab-urile de navigare', async () => {
    setupTestUser();
    
    await act(async () => {
      render(<App />);
    });
    
    // Verificăm că tab-urile apar în pagină
    await waitFor(() => {
      expect(screen.getByTestId('transactions-tab')).toBeInTheDocument();
      expect(screen.getByTestId('lunar-grid-tab')).toBeInTheDocument();
    });
  });

  // Testul pentru afișarea paginii de tranzacții inițial
  it('afișează pagina de tranzacții ca pagină implicită', async () => {
    setupTestUser();
    
    await act(async () => {
      render(<App />);
    });
    
    // Verificăm că pagina de tranzacții este afișată implicit
    await waitFor(() => {
      expect(screen.getByTestId('transactions-page-mock')).toBeInTheDocument();
      // Verificăm că pagina de grid lunar NU este afișată
      expect(screen.queryByTestId('lunar-grid-page-mock')).not.toBeInTheDocument();
    });
  });

  // Testul pentru navigarea la pagina de grid lunar
  it('navighează la pagina de grid lunar la click pe tab', async () => {
    setupTestUser();
    
    await act(async () => {
      render(<App />);
    });
    
    // Găsim tab-ul de grid lunar și facem click pe el
    await waitFor(() => {
      const lunarGridTab = screen.getByTestId('lunar-grid-tab');
      expect(lunarGridTab).toBeInTheDocument();
      
      act(() => {
        fireEvent.click(lunarGridTab);
      });
    });
    
    // Verificăm că pagina de grid lunar este afișată
    await waitFor(() => {
      expect(screen.getByTestId('lunar-grid-page-mock')).toBeInTheDocument();
      // Verificăm că pagina de tranzacții NU mai este afișată
      expect(screen.queryByTestId('transactions-page-mock')).not.toBeInTheDocument();
    });
  });

  // Testul pentru navigarea înapoi la pagina de tranzacții
  it('navighează înapoi la pagina de tranzacții la click pe tab', async () => {
    setupTestUser();
    
    await act(async () => {
      render(<App />);
    });
    
    // Navigăm mai întâi la pagina de grid lunar
    await waitFor(() => {
      const lunarGridTab = screen.getByTestId('lunar-grid-tab');
      expect(lunarGridTab).toBeInTheDocument();
      
      act(() => {
        fireEvent.click(lunarGridTab);
      });
    });
    
    // Apoi navigăm înapoi la pagina de tranzacții
    await waitFor(() => {
      const transactionsTab = screen.getByTestId('transactions-tab');
      expect(transactionsTab).toBeInTheDocument();
      
      act(() => {
        fireEvent.click(transactionsTab);
      });
    });
    
    // Verificăm că pagina de tranzacții este afișată din nou
    await waitFor(() => {
      expect(screen.getByTestId('transactions-page-mock')).toBeInTheDocument();
      // Verificăm că pagina de grid lunar NU mai este afișată
      expect(screen.queryByTestId('lunar-grid-page-mock')).not.toBeInTheDocument();
    });
  });

  // Testul pentru afișarea formularului de login când utilizatorul nu este autentificat
  it('afișează formularul de login când utilizatorul nu este autentificat', async () => {
    // Nu apelăm setupTestUser() pentru a simula un utilizator neautentificat
    // Resetăm explicit starea de autentificare pentru a fi siguri că utilizatorul nu este autentificat
    await act(async () => {
      useAuthStore.setState({ user: null, loading: false, error: null });
    });
    
    await act(async () => {
      render(<App />);
    });
    
    // Verificăm că formularul de login este afișat
    await waitFor(() => {
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      // Verificăm că tab-urile de navigare NU sunt afișate
      expect(screen.queryByTestId('transactions-tab')).not.toBeInTheDocument();
      expect(screen.queryByTestId('lunar-grid-tab')).not.toBeInTheDocument();
    });
  });

  // Testul pentru afișarea formularului de înregistrare
  it('afișează formularul de înregistrare la click pe link', async () => {
    // Resetăm explicit starea de autentificare pentru a fi siguri că utilizatorul nu este autentificat
    await act(async () => {
      useAuthStore.setState({ user: null, loading: false, error: null });
    });
    
    await act(async () => {
      render(<App />);
    });
    
    // Găsim link-ul de înregistrare și facem click pe el
    await waitFor(() => {
      const registerLink = screen.getByTestId('register-link');
      expect(registerLink).toBeInTheDocument();
      
      act(() => {
        fireEvent.click(registerLink);
      });
    });
    
    // Verificăm că formularul de înregistrare este afișat
    await waitFor(() => {
      expect(screen.getByTestId('register-form')).toBeInTheDocument();
      // Verificăm că formularul de login NU mai este afișat
      expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    });
  });

  // Testul pentru afișarea spinner-ului de încărcare
  it('afișează spinner-ul de încărcare când loading=true', async () => {
    // Mockuim starea de loading folosind metoda checkUser care setează loading=true
    // Conform regulilor, nu mock-uim store-ul, ci folosim metodele existente
    jest.spyOn(supabaseAuthService, 'getCurrentUser').mockImplementation(() => {
      // Returnam o promisiune care nu se rezolvă imediat pentru a menține loading=true
      return new Promise(resolve => {
        // Rezolvăm cu null pentru a menține user=null în store
        setTimeout(() => resolve(null), 100);
      });
    });
    
    // Setăm starea de loading folosind API-ul public al store-ului
    await act(async () => {
      // Folosim setState în loc de a modifica direct proprietățile
      useAuthStore.setState({ user: null, loading: true, error: null });
    });
    
    await act(async () => {
      render(<App />);
    });
    
    // Verificăm că spinner-ul este afișat
    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });
});
