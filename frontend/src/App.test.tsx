/**
 * Test pentru App - Abordare simplificată fără mockuri pentru stores
 * Conform regulilor: mock doar pentru external services
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import '@testing-library/jest-dom';
import { App } from './App';
import { TransactionType, CategoryType, TITLES } from '@shared-constants';
import { MOCK_LABELS, MOCK_BUTTONS, MOCK_TABLE } from './test/mockData';
import { useTransactionStore } from './stores/transactionStore';
import { useTransactionFormStore } from './stores/transactionFormStore';
import { useTransactionFiltersStore } from './stores/transactionFiltersStore';

// Mock pentru supabaseService (external service)
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

// Resetăm store-urile și mock-urile după fiecare test
afterEach(() => {
  jest.clearAllMocks();
  act(() => {
    // Reset stores la valori implicite pentru a evita efecte secundare între teste
    useTransactionStore.getState().reset?.();
    useTransactionFormStore.getState().resetForm?.();
    useTransactionFiltersStore.getState().resetFilters?.();
  });
});

describe('App', () => {
  it('afișează titlul principal corect', () => {
    render(<App />);
    expect(screen.getByText(TITLES.TRANZACTII)).toBeInTheDocument();
  });

  it('afișează filtrele de tranzacții', () => {
    render(<App />);
    expect(screen.getByLabelText(MOCK_LABELS.TYPE_FILTER, { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText(MOCK_LABELS.CATEGORY_FILTER, { exact: false })).toBeInTheDocument();
  });
  
  it('actualizează filtrul de tip de tranzacție la schimbare', () => {
    render(<App />);
    
    // Setter spy pentru a verifica apeluri
    const setFilterTypeSpy = jest.spyOn(useTransactionFiltersStore.getState(), 'setFilterType');
    
    // Selectează alt tip prin UI
    const typeFilter = screen.getByLabelText(MOCK_LABELS.TYPE_FILTER, { exact: false });
    act(() => {
      fireEvent.change(typeFilter, { target: { value: TransactionType.EXPENSE } });
    });
    
    // Verifică că s-a apelat setter-ul cu valoarea corectă
    expect(setFilterTypeSpy).toHaveBeenCalledWith(TransactionType.EXPENSE);
    
    // Curăță spy-ul
    setFilterTypeSpy.mockRestore();
  });

  it('actualizează filtrul de categorie la schimbare', () => {
    render(<App />);
    
    // Setter spy pentru a verifica apeluri
    const setFilterCategorySpy = jest.spyOn(useTransactionFiltersStore.getState(), 'setFilterCategory');
    
    // Selectează altă categorie prin UI
    const categoryFilter = screen.getByLabelText(MOCK_LABELS.CATEGORY_FILTER, { exact: false });
    act(() => {
      fireEvent.change(categoryFilter, { target: { value: CategoryType.EXPENSE } });
    });
    
    // Verifică că s-a apelat setter-ul cu valoarea corectă
    expect(setFilterCategorySpy).toHaveBeenCalledWith(CategoryType.EXPENSE);
    
    // Curăță spy-ul
    setFilterCategorySpy.mockRestore();
  });
  
  it('apelează supabaseService la trimiterea unui formular valid', async () => {
    render(<App />);
    
    // Completez date minime în formular
    act(() => {
      useTransactionFormStore.getState().setField('type', TransactionType.INCOME);
      useTransactionFormStore.getState().setField('amount', '100');
      useTransactionFormStore.getState().setField('category', CategoryType.INCOME);
      useTransactionFormStore.getState().setField('date', new Date().toISOString().split('T')[0]);
    });
    
    // Folosim un spy pe handleSubmit din store
    const handleSubmitSpy = jest.spyOn(useTransactionFormStore.getState(), 'handleSubmit');
    const fetchTransactionsSpy = jest.spyOn(useTransactionStore.getState(), 'fetchTransactions');
    
    // Trimit formularul
    const submitButton = screen.getByText(MOCK_BUTTONS.ADD);
    fireEvent.click(submitButton);
    
    // Verifică că handleSubmit a fost apelat
    expect(handleSubmitSpy).toHaveBeenCalled();
    
    // Așteaptă să se proceseze operațiunile asincrone 
    await waitFor(() => {
      expect(supabaseService.createTransaction).toHaveBeenCalled();
    });
    
    // După salvare, lista de tranzacții ar trebui reîncărcată
    await waitFor(() => {
      expect(fetchTransactionsSpy).toHaveBeenCalled();
    });
    
    // Curăță spy-urile
    handleSubmitSpy.mockRestore();
    fetchTransactionsSpy.mockRestore();
  });

  it('afișează starea de loading', () => {
    // Setăm starea de loading direct în store
    act(() => {
      useTransactionStore.getState().setLoading(true);
    });
    
    render(<App />);
    
    // Verifică că se afișează indicatorul de încărcare
    expect(screen.getByText(MOCK_TABLE.LOADING)).toBeInTheDocument();
  });

  it('afișează mesajul de eroare din store', () => {
    // Definim mesajul de eroare și îl setăm în store
    const errorMessage = 'Eroare la încărcarea tranzacțiilor';
    
    act(() => {
      useTransactionStore.getState().setError(errorMessage);
    });
    
    render(<App />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
