/**
 * Test pentru TransactionForm - Abordare simplificată fără mockuri pentru stores
 * Conform regulilor: mock doar pentru external services
 */
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import '@testing-library/jest-dom';
import TransactionForm from './TransactionForm';
import { MESAJE } from '@shared-constants/messages';
import { useTransactionFormStore } from '../../../stores/transactionFormStore';

// Mock pentru supabaseService (external service)
jest.mock('../../../services/supabaseService', () => ({
  supabaseService: {
    createTransaction: jest.fn().mockResolvedValue({ id: 'mock-id' }),
    getTransactionById: jest.fn(),
    fetchTransactions: jest.fn(),
    updateTransaction: jest.fn(),
    deleteTransaction: jest.fn()
  }
}));

// Import supabaseService după mock
import { supabaseService } from '../../../services/supabaseService';

// Resetăm mock-urile și store-ul după fiecare test
afterEach(() => {
  jest.clearAllMocks();
  act(() => {
    useTransactionFormStore.getState().resetForm();
  });
});

describe('TransactionForm - integrare', () => {
  test('Afișează toate câmpurile principale', () => {
    render(<TransactionForm onSave={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByTestId('type-select')).toBeInTheDocument();
    expect(screen.getByTestId('amount-input')).toBeInTheDocument();
    expect(screen.getByTestId('save-btn')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-btn')).toBeInTheDocument();
  });

  test('Butonul Save este dezactivat când loading=true', () => {
    act(() => {
      useTransactionFormStore.getState().setLoading(true);
    });
    render(<TransactionForm onSave={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByTestId('save-btn')).toBeDisabled();
  });

  test('Click pe Cancel apelează onCancel', () => {
    const onCancel = jest.fn();
    render(<TransactionForm onSave={jest.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByTestId('cancel-btn'));
    expect(onCancel).toHaveBeenCalled();
  });

  test('Modificarea unui câmp actualizează store-ul', () => {
    render(<TransactionForm onSave={jest.fn()} onCancel={jest.fn()} />);
    const input = screen.getByTestId('amount-input') as HTMLInputElement;
    act(() => {
      fireEvent.change(input, { target: { value: '42' } });
    });
    expect(useTransactionFormStore.getState().form.amount).toBe('42');
  });

  test('Apelarea directă a handleSubmit cu date valide funcționează corect', async () => {
    // Renderăm formularul pentru a avea acces la store
    render(<TransactionForm onSave={jest.fn()} onCancel={jest.fn()} />);
    
    // Pregătim date valide direct în store
    act(() => {
      const store = useTransactionFormStore.getState();
      store.setField('type', 'INCOME');
      store.setField('amount', '100');
      store.setField('category', 'VENITURI');
      store.setField('date', new Date().toISOString().split('T')[0]);
    });
    
    // Apelăm direct handleSubmit din store
    await act(async () => {
      await useTransactionFormStore.getState().handleSubmit();
    });
    
    // Verificăm că serviciul extern a fost apelat
    expect(supabaseService.createTransaction).toHaveBeenCalled();
    
    // Verificăm că mesajul de succes a fost setat în store
    expect(useTransactionFormStore.getState().success).toBe(MESAJE.SUCCES_ADAUGARE);
  });
  
  test('Interacțiunea utilizator cu formularul setează valorile în store', () => {
    render(<TransactionForm onSave={jest.fn()} onCancel={jest.fn()} />);
    
    // Completează câmpuri prin interacțiune utilizator
    act(() => {
      fireEvent.change(screen.getByTestId('type-select'), { 
        target: { name: 'type', value: 'INCOME' } 
      });
      
      fireEvent.change(screen.getByTestId('amount-input'), { 
        target: { name: 'amount', value: '42' } 
      });
    });
    
    // Verifică că valorile au fost setate în store
    expect(useTransactionFormStore.getState().form.type).toBe('INCOME');
    expect(useTransactionFormStore.getState().form.amount).toBe('42');
  });
});