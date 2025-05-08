/**
 * Test pentru LunarGridPage - Abordare simplificată fără mockuri pentru stores
 * Conform regulilor: mock doar pentru external services
 * Owner: Echipa Frontend - Test
 */

import React from 'react';
import { act } from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { EXCEL_GRID } from '@shared-constants/ui';
import '@testing-library/jest-dom';

// Import utilities din test-utils
import { 
  render, 
  setupTestUser, 
  resetAllStores,
  screen 
} from '../test-utils';

import LunarGridPage from './LunarGridPage';
import { TITLES, TransactionType, TransactionStatus } from '@shared-constants';

// Stores reale (conform noilor reguli, nu le mock-uim)
import { useTransactionStore } from '../stores/transactionStore';

// Mockăm supabaseService (singura componentă externă care trebuie mockată conform regulilor)
jest.mock('../services/supabaseService', () => ({
  supabaseService: {
    fetchTransactions: jest.fn().mockResolvedValue({ data: [], count: 0 }),
  }
}));

// Nu mai mockăm LunarGrid - folosim componenta reală conform abordării user-centric
// Și conform regulilor de testare din BEST_PRACTICES.md
// Mock-uim doar serviciile externe, nu componentele interne

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

describe('LunarGridPage', () => {
  it('afișează titlul corect', async () => {
    await act(async () => {
      render(<LunarGridPage />);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('lunar-grid-title')).toHaveTextContent(TITLES.GRID_LUNAR);
    });
  });

  it('afișează luna și anul curent inițial', async () => {
    await act(async () => {
      render(<LunarGridPage />);
    });
    
    // Obținem luna și anul curent pentru verificare
    const currentDate = new Date();
    // Conversia lowercase pentru a asigura match case-insensitive
    const currentMonth = currentDate.toLocaleString('ro-RO', { month: 'long' }).toLowerCase();
    const currentYear = currentDate.getFullYear().toString();
    
    // Verificăm că luna și anul curent sunt afișate
    await waitFor(() => {
      const currentMonthElement = screen.getByTestId('current-month');
      // Convertim și textContent-ul la lowercase pentru comparare case-insensitive
      const monthText = (currentMonthElement.textContent || "").toLowerCase();
      expect(monthText).toContain(currentMonth);
      expect(monthText).toContain(currentYear);
    });
  });

  it('navighează la luna anterioară la click pe butonul prev', async () => {
    await act(async () => {
      render(<LunarGridPage />);
    });
    
    // Salvăm textul inițial al lunii
    let initialText = "";
    await waitFor(() => {
      const element = screen.getByTestId('current-month');
      expect(element).toBeInTheDocument();
      initialText = element.textContent || "";
    });
    
    // Facem click pe butonul de luna anterioară
    await waitFor(() => {
      const prevButton = screen.getByTestId('prev-month-btn');
      expect(prevButton).toBeInTheDocument();
      
      act(() => {
        fireEvent.click(prevButton);
      });
    });
    
    // Verificăm că luna s-a schimbat
    await waitFor(() => {
      expect(screen.getByTestId('current-month').textContent).not.toBe(initialText);
    });
  });

  it('navighează la luna următoare la click pe butonul next', async () => {
    await act(async () => {
      render(<LunarGridPage />);
    });
    
    // Salvăm textul inițial al lunii
    let initialText = "";
    await waitFor(() => {
      const element = screen.getByTestId('current-month');
      expect(element).toBeInTheDocument();
      initialText = element.textContent || "";
    });
    
    // Facem click pe butonul de luna următoare
    await waitFor(() => {
      const nextButton = screen.getByTestId('next-month-btn');
      expect(nextButton).toBeInTheDocument();
      
      act(() => {
        fireEvent.click(nextButton);
      });
    });
    
    // Verificăm că luna s-a schimbat
    await waitFor(() => {
      expect(screen.getByTestId('current-month').textContent).not.toBe(initialText);
    });
  });

  it('afișează gridul lunar', async () => {
    // Folosim waitFor pentru a aștepta render-ul asincron
    // Conform memoriei 3cb5254f-a08f-4ff1-8fcd-21e707c69101 despre testarea în React
    await act(async () => {
      render(<LunarGridPage />);
    });
    
    // Așteptăm ca gridul să fie afișat
    await waitFor(() => {
      expect(screen.getByTestId('lunar-grid-table')).toBeInTheDocument();
    });
  });

  it('afișează indicator de încărcare când loading=true', async () => {
    // Mockăm fetchTransactions ca să nu schimbe loading=false automat
    const fetchPromise = new Promise(() => {}); // never resolves
    const fetchSpy = jest.spyOn(useTransactionStore.getState(), 'fetchTransactions').mockImplementation(() => fetchPromise as any);

    // Setăm loading=true în store chiar înainte de render
    useTransactionStore.setState({ ...useTransactionStore.getState(), loading: true });

    await act(async () => {
      render(<LunarGridPage />);
    });

    // Verificăm că indicatorul de loading este vizibil imediat după render
    const loadingDiv = screen.getByTestId('loading-indicator');
    expect(loadingDiv).toHaveTextContent(EXCEL_GRID.LOADING);

    fetchSpy.mockRestore();
  });

  it('apelează fetchTransactions la montare', async () => {
    // Spionam metoda fetchTransactions din store
    const fetchTransactionsSpy = jest.spyOn(useTransactionStore.getState(), 'fetchTransactions');
    
    await act(async () => {
      render(<LunarGridPage />);
    });
    
    // Verificăm că s-a apelat fetchTransactions
    await waitFor(() => {
      expect(fetchTransactionsSpy).toHaveBeenCalled();
    });
    
    fetchTransactionsSpy.mockRestore();
  });
});
