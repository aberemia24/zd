/**
 * Test pentru App - Abordare simplificată fără mockuri pentru stores
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

// Constants pentru mockuri folosite în teste (anterior erau importate din mockData)
const MOCK_LABELS = {
  TYPE_FILTER: 'Tip tranzacție',
  CATEGORY_FILTER: 'Categorie'
};

const MOCK_BUTTONS = {
  ADD: 'Adaugă tranzacție',
  SAVE: 'Salvează',
  CANCEL: 'Anulează'
};

const MOCK_TABLE = {
  LOADING: 'Se încarcă tranzacțiile...'
};

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

// Import serviciul după mock
import { supabaseService } from './services/supabaseService';

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
  // Testul pentru verificarea titlului principal
  it('afișează titlul principal corect', () => {
    // Definim utilizatorul autentificat înainte de render pentru a evita probleme de autentificare
    // Folosim helper-ul creat în test-utils
    setupTestUser();
    
    // Render cu customRender din test-utils
    const { container } = render(<App />);
    
    // Verificăm că titlul apare în pagină
    expect(screen.getByText(TITLES.TRANZACTII)).toBeInTheDocument();
  });

  // Testul pentru verificarea filtrelor de tranzacții
  it('afișează filtrele de tranzacții', async () => {
    // Configurăm starea inițială
    setupTestUser();
    
    // Render componentei App
    render(<App />);
    
    // Folosim waitFor pentru a aștepta ca filtrele să fie disponibile (render asincron)
    await waitFor(() => {
      // Folosim data-testid pentru a selecta elementele specific
      // Evităm folosirea textului "Categorie" care apare în mai multe elemente
      const typeFilter = screen.getByTestId('type-filter');
      const categoryFilter = screen.getByTestId('category-filter');
      
      expect(typeFilter).toBeInTheDocument();
      expect(categoryFilter).toBeInTheDocument();
    });
  });
  
  // Testul pentru actualizarea filtrului de tip tranzacție
  it('actualizează filtrul de tip de tranzacție la schimbare', async () => {
    // Configurăm starea inițială
    setupTestUser();
    
    // Render componentei App
    render(<App />);
    
    // Spionam metoda setFilterType din store pentru a verifica apelul
    const setFilterTypeSpy = jest.spyOn(useTransactionFiltersStore.getState(), 'setFilterType');
    
    // Așteptăm ca filtrul să fie disponibil în DOM
    await waitFor(() => {
      // Găsim filtrul folosind data-testid, care este mai sigur și specific
      const typeFilter = screen.getByTestId('type-filter');
      
      // Schimbăm valoarea filtrului (ACȚIUNE UTILIZATOR)
      act(() => {
        fireEvent.change(typeFilter, { target: { value: TransactionType.EXPENSE } });
      });
      
      // Verificăm că store-ul a fost actualizat corect
      expect(setFilterTypeSpy).toHaveBeenCalledWith(TransactionType.EXPENSE);
    });
    
    // Curățăm spy-ul
    setFilterTypeSpy.mockRestore();
  });

  // Testul pentru actualizarea filtrului de categorie
  it('actualizează filtrul de categorie la schimbare', async () => {
    // Configurăm starea inițială
    setupTestUser();
    
    // Render componentei App
    render(<App />);
    
    // Spionam metoda setFilterCategory din store pentru a verifica apelul
    const setFilterCategorySpy = jest.spyOn(useTransactionFiltersStore.getState(), 'setFilterCategory');
    
    // Așteptăm ca filtrul să fie disponibil în DOM
    await waitFor(() => {
      // Găsim filtrul folosind data-testid în loc de text pentru a evita ambiguitatea
      const categoryFilter = screen.getByTestId('category-filter');
      
      // Schimbăm valoarea filtrului (ACȚIUNE UTILIZATOR)
      act(() => {
        fireEvent.change(categoryFilter, { target: { value: CategoryType.EXPENSE } });
      });
      
      // Verificăm că store-ul a fost actualizat corect
      expect(setFilterCategorySpy).toHaveBeenCalledWith(CategoryType.EXPENSE);
    });
    
    // Curățăm spy-ul
    setFilterCategorySpy.mockRestore();
  });
  
  // Testul pentru trimiterea formularului și crearea tranzacției
  it('apelează supabaseService la trimiterea unui formular valid', async () => {
    // INFORMAȚIE: Această abordare este mai robustă prin apelarea directă a formei
    
    // Configurăm starea inițială
    setupTestUser();
    
    // Mockuim formular valid în formState înainte de render
    await act(async () => {
      const formState = useTransactionFormStore.getState();
      // Completăm date minime necesare pentru un formular valid
      formState.setField('type', TransactionType.INCOME);
      formState.setField('amount', '100');
      formState.setField('category', CategoryType.INCOME);
      formState.setField('date', new Date().toISOString().split('T')[0]);
    });
    
    // Spionăm metodele pe care dorim să le verificăm ÎNAINTE de render
    const handleSubmitSpy = jest.fn();
    const originalHandleSubmit = useTransactionFormStore.getState().handleSubmit;
    
    // Înlocuim metoda originală cu spy-ul nostru
    jest.spyOn(useTransactionFormStore.getState(), 'handleSubmit').mockImplementation(async () => {
      handleSubmitSpy();
      return await originalHandleSubmit();
    });
    
    const fetchTransactionsSpy = jest.spyOn(useTransactionStore.getState(), 'fetchTransactions');
    
    // Render componentei App după ce am setat toate spion-urile
    const { container } = render(<App />);
    
    // Găsim formularul și declanșăm evenimentul de submit direct
    const form = screen.getByTestId('transaction-form');
    await act(async () => {
      fireEvent.submit(form);
    });
    
    // Verificăm că s-a apelat handleSubmit
    expect(handleSubmitSpy).toHaveBeenCalled();
    
    // Așteptăm să se proceseze operațiunile asincrone
    await waitFor(() => {
      // Verificăm că s-a apelat serviciul extern
      expect(supabaseService.createTransaction).toHaveBeenCalled();
    });
    
    // După salvare, ar trebui să se reîncarce lista de tranzacții
    await waitFor(() => {
      expect(fetchTransactionsSpy).toHaveBeenCalled();
    });
    
    // Curățăm spy-urile
    jest.restoreAllMocks();
  });

  // Testul pentru starea de încărcare
  it('afișează starea de loading', async () => {
    // Configurăm starea inițială
    setupTestUser();
    
    // Setăm starea de loading = true în store înainte de render
    await act(async () => {
      useTransactionStore.getState().setLoading(true);
    });
    
    // Render App cu loading = true
    render(<App />);
    
    // Verificăm că se afișează indicatorul de încărcare folosind data-testid în loc de text exact
    // Folosim data-testid="transaction-table-loading" care există deja în componenta TransactionTable
    await waitFor(() => {
      const loadingIndicator = screen.getByTestId('transaction-table-loading');
      expect(loadingIndicator).toBeInTheDocument();
    });
  });

  // Testul pentru afișarea mesajului de eroare
  it('afișează mesajul de eroare din store', async () => {
    // Configurăm starea inițială
    setupTestUser();
    
    // Definiție mesaj de eroare (folosim mesaje din constante în loc de string-uri hardcodate)
    const errorMessage = MESAJE.EROARE_GENERALA || 'Eroare la încărcarea tranzacțiilor';
    
    // Setăm eroarea în store
    await act(async () => {
      useTransactionStore.getState().setError(errorMessage);
    });
    
    // Render App cu eroarea setată
    render(<App />);
    
    // Verificăm că mesajul de eroare apare în interfață
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
