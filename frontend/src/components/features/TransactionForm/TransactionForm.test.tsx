/**
 * Test pentru TransactionForm - Abordare simplificată fără mockuri pentru stores
 * Conform regulilor: mock doar pentru external services
 * 
 * Implementat folosind pattern-ul recomandat pentru testarea formularelor complexe
 * cu valori inițiale, conform memoriei (focalizare pe teste individuale pentru fiecare câmp)
 */
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import '@testing-library/jest-dom';
import TransactionForm from './TransactionForm';
import { MESAJE } from '@shared-constants/messages';
import { TransactionType, CategoryType } from '@shared-constants/enums';
import { useTransactionFormStore } from '../../../stores/transactionFormStore';
import { useTransactionStore } from '../../../stores/transactionStore';

// Mock pentru supabaseService (external service) conform regulilor de testare
jest.mock('../../../services/supabaseService', () => ({
  supabaseService: {
    createTransaction: jest.fn().mockResolvedValue({ id: 'mock-id' }),
    getTransactionById: jest.fn(),
    fetchTransactions: jest.fn(),
    updateTransaction: jest.fn(),
    deleteTransaction: jest.fn()
  }
}));

// Import supabaseService după mock pentru acces la funcțiile mock-uite
import { supabaseService } from '../../../services/supabaseService';

/**
 * Setup și reset pentru teste
 */
beforeEach(() => {
  jest.clearAllMocks(); // Reset toate mock-urile
  
  // Resetăm store-ul pentru un test curat
  act(() => {
    useTransactionFormStore.getState().resetForm();
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('TransactionForm - UI și integrare', () => {
  /**
   * Teste pentru UI - verificare prezență elemente individuale
   */
  describe('Componente UI', () => {
    it('afișează selectorul de tip tranzacție', async () => {
      render(<TransactionForm onSave={jest.fn()} onCancel={jest.fn()} />);
      expect(screen.getByTestId('type-select')).toBeInTheDocument();
    });

    it('afișează input-ul pentru sumă', async () => {
      render(<TransactionForm onSave={jest.fn()} onCancel={jest.fn()} />);
      expect(screen.getByTestId('amount-input')).toBeInTheDocument();
    });
    
    it('afișează butonul de salvare (add transaction)', async () => {
      render(<TransactionForm onSave={jest.fn()} onCancel={jest.fn()} />);
      expect(screen.getByTestId('add-transaction-button')).toBeInTheDocument(); // ID-ul corect din componentă
    });
    
    it('afișează butonul de anulare', async () => {
      render(<TransactionForm onSave={jest.fn()} onCancel={jest.fn()} />);
      expect(screen.getByTestId('cancel-btn')).toBeInTheDocument();
    });
  });

  /**
   * Teste pentru interacțiune UI - stare butoane, clickuri etc.
   */
  describe('Interacțiuni UI', () => {
    it('dezactivează butonul de salvare când loading=true', async () => {
      // Setăm loading=true în store
      act(() => {
        useTransactionFormStore.getState().setLoading(true);
      });
      
      // Renderăm componenta
      render(<TransactionForm onSave={jest.fn()} onCancel={jest.fn()} />);
      
      // Verificăm starea butonului
      const saveButton = screen.getByTestId('add-transaction-button');
      expect(saveButton).toBeDisabled();
    });

    it('apelează onCancel la click pe butonul de anulare', async () => {
      const mockCancel = jest.fn();
      render(<TransactionForm onSave={jest.fn()} onCancel={mockCancel} />);
      
      fireEvent.click(screen.getByTestId('cancel-btn'));
      expect(mockCancel).toHaveBeenCalled();
    });
  });

  /**
   * Teste pentru manipularea câmpurilor individuale - aplicația memoriei despre testare formulare
   */
  describe('Manipularea câmpurilor individuale', () => {
    it('actualizează store-ul la modificarea câmpului amount', async () => {
      // ARRANGE
      render(<TransactionForm onSave={jest.fn()} onCancel={jest.fn()} />);
      
      // ACT - modificare câmp individual
      const input = screen.getByTestId('amount-input') as HTMLInputElement;
      await act(async () => {
        fireEvent.change(input, { target: { value: '42' } });
      });
      
      // ASSERT - verificare un singur câmp
      expect(useTransactionFormStore.getState().form.amount).toBe('42');
    });

    it('actualizează store-ul la modificarea câmpului type', async () => {
      // ARRANGE
      render(<TransactionForm onSave={jest.fn()} onCancel={jest.fn()} />);
      
      // ACT - modificare tip
      const typeSelect = screen.getByTestId('type-select');
      await act(async () => {
        fireEvent.change(typeSelect, { target: { name: 'type', value: TransactionType.INCOME } });
      });
      
      // ASSERT - verificare valoare setată în store
      expect(useTransactionFormStore.getState().form.type).toBe(TransactionType.INCOME);
    });
  });

  /**
   * Teste pentru scenarii complete - salvare formular, validari etc.
   */
  describe('Scenarii complete', () => {
    it('apelează supabaseService.createTransaction la submit cu date valide', async () => {
      // ARRANGE - renderăm componenta
      render(<TransactionForm onSave={jest.fn()} onCancel={jest.fn()} />);
      
      // ACT - pregătim date valide direct în store
      act(() => {
        const store = useTransactionFormStore.getState();
        store.setField('type', TransactionType.INCOME);
        store.setField('amount', '100');
        store.setField('category', 'VENITURI');
        store.setField('date', new Date().toISOString().split('T')[0]);
      });
      
      // ACT - apelăm direct handleSubmit
      await act(async () => {
        await useTransactionFormStore.getState().handleSubmit();
      });
      
      // ASSERT - verificăm apelul serviciului extern
      expect(supabaseService.createTransaction).toHaveBeenCalled();
      expect(useTransactionFormStore.getState().success).toBe(MESAJE.SUCCES_ADAUGARE);
    });

    it('setează mai multe câmpuri prin interacțiune utilizator', async () => {
      // ARRANGE
      render(<TransactionForm onSave={jest.fn()} onCancel={jest.fn()} />);
      
      // ACT - modificăm multipli câmpi secvențial
      await act(async () => {
        // Setăm tipul
        fireEvent.change(screen.getByTestId('type-select'), { 
          target: { name: 'type', value: TransactionType.INCOME } 
        });
        
        // Apoi setam suma
        fireEvent.change(screen.getByTestId('amount-input'), { 
          target: { name: 'amount', value: '42' } 
        });
        
        // Activăm checkbox recurring
        fireEvent.click(screen.getByTestId('recurring-checkbox'));
      });
      
      // ASSERT - verificăm valorile din store
      const form = useTransactionFormStore.getState().form;
      expect(form.type).toBe(TransactionType.INCOME);
      expect(form.amount).toBe('42');
      expect(form.recurring).toBe(true);
    });
  });
});