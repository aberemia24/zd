/**
 * Test pentru TransactionsPage - Abordare simplificată fără mockuri pentru stores
 * Conform regulilor: mock doar pentru external services
 * Owner: Echipa Frontend - Test
 */

import React from 'react';
import { act } from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import utilities din test-utils
import { 
  render, 
  setupTestUser, 
  resetAllStores,
  screen 
} from '../test-utils';

import TransactionsPage from './TransactionsPage';
import { TransactionType, CategoryType, TITLES, MESAJE } from '@shared-constants';

// Stores reale (conform noilor reguli, nu le mock-uim)
import { useTransactionStore } from '../stores/transactionStore';
import { useTransactionFiltersStore } from '../stores/transactionFiltersStore';

// Mockăm supabaseService (singura componentă externă care trebuie mockată conform regulilor)
jest.mock('../services/supabaseService', () => ({
  supabaseService: {
    fetchTransactions: jest.fn().mockResolvedValue({ data: [], count: 0 }),
    createTransaction: jest.fn().mockResolvedValue({ id: 'mock-id' }),
    updateTransaction: jest.fn(),
    deleteTransaction: jest.fn()
  }
}));

// Import serviciul după mock
import { supabaseService } from '../services/supabaseService';

// Configurație globală pentru toate testele
beforeEach(() => {
  // Configurăm un utilizator autentificat pentru toate testele
  setupTestUser();
});

// Resetăm store-urile și mock-urile după fiecare test
afterEach(() => {
  jest.clearAllMocks();
  resetAllStores();
});

describe('TransactionsPage', () => {
  it('afișează titlul corect', () => {
    render(<TransactionsPage />);
    expect(screen.getByText(TITLES.TRANZACTII)).toBeInTheDocument();
  });

  it('afișează formularul de tranzacții', async () => {
    await act(async () => {
      render(<TransactionsPage />);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('transaction-form')).toBeInTheDocument();
    });
  });

  it('afișează filtrele de tranzacții', async () => {
    render(<TransactionsPage />);
    
    await waitFor(() => {
      const typeFilter = screen.getByTestId('type-filter');
      const categoryFilter = screen.getByTestId('category-filter');
      
      expect(typeFilter).toBeInTheDocument();
      expect(categoryFilter).toBeInTheDocument();
    });
  });

  it('actualizează filtrul de tip de tranzacție la schimbare', async () => {
    render(<TransactionsPage />);
    
    // Spionam metoda setFilterType din store pentru a verifica apelul
    const setFilterTypeSpy = jest.spyOn(useTransactionFiltersStore.getState(), 'setFilterType');
    
    // Așteptăm ca filtrul să fie disponibil în DOM
    await waitFor(() => {
      const typeFilter = screen.getByTestId('type-filter');
      
      // Schimbăm valoarea filtrului (ACȚIUNE UTILIZATOR)
      act(() => {
        fireEvent.change(typeFilter, { target: { value: TransactionType.EXPENSE } });
      });
      
      // Verificăm că store-ul a fost actualizat corect
      expect(setFilterTypeSpy).toHaveBeenCalledWith(TransactionType.EXPENSE);
    });
    
    setFilterTypeSpy.mockRestore();
  });

  it('afișează tabelul de tranzacții', async () => {
    await act(async () => {
      render(<TransactionsPage />);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('transaction-table')).toBeInTheDocument();
    });
  });

  it('afișează mesajul de eroare când există eroare în store', async () => {
    // Mockuim supabaseService.fetchTransactions pentru a arunca o eroare
    // Astfel se va seta mesajul de eroare corect din constante
    const mockFetchTransactions = jest.spyOn(supabaseService, 'fetchTransactions')
      .mockRejectedValueOnce(new Error('Eroare de test'));
    
    // Renderăm componenta care va apela fetchTransactions și va primi eroarea
    await act(async () => {
      render(<TransactionsPage />);
    });
    
    // Verificăm că mesajul de eroare apare în interfață folosind data-testid
    await waitFor(() => {
      const errorElement = screen.getByTestId('fetch-error');
      expect(errorElement).toBeInTheDocument();
      // Verificăm că mesajul de eroare este cel din constante
      expect(errorElement.textContent).toBe(MESAJE.EROARE_INCARCARE_TRANZACTII);
    });
    
    // Curățăm mock-ul
    mockFetchTransactions.mockRestore();
  });

  it('apelează fetchTransactions la montare', async () => {
    // Spionam metoda fetchTransactions din store
    const fetchTransactionsSpy = jest.spyOn(useTransactionStore.getState(), 'fetchTransactions');
    
    await act(async () => {
      render(<TransactionsPage />);
    });
    
    // Verificăm că s-a apelat fetchTransactions
    await waitFor(() => {
      expect(fetchTransactionsSpy).toHaveBeenCalled();
    });
    
    fetchTransactionsSpy.mockRestore();
  });
});
