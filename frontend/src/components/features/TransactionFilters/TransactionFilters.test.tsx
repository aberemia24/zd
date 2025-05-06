/**
 * Test pentru TransactionFilters - Abordare simplificată fără mockuri pentru stores
 * Conform regulilor: mock doar pentru external services
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import '@testing-library/jest-dom';
import TransactionFilters from './';
import { TransactionType, CategoryType } from '@shared-constants';
import { MOCK_LABELS } from '../../../test/mockData';
import { useTransactionFiltersStore } from '../../../stores/transactionFiltersStore';

// Resetăm store-ul după fiecare test
afterEach(() => {
  act(() => {
    // Resetăm filtrele la valorile implicite
    useTransactionFiltersStore.getState().resetFilters();
  });
});

describe('TransactionFilters', () => {
  it('afișează opțiunile de tip și categorie', () => {
    // Mock pentru callback-uri
    const onTypeChange = jest.fn();
    const onCategoryChange = jest.fn();
    
    render(<TransactionFilters onTypeChange={onTypeChange} onCategoryChange={onCategoryChange} />);
    
    expect(screen.getByLabelText(MOCK_LABELS.TYPE_FILTER)).toBeInTheDocument();
    expect(screen.getByLabelText(MOCK_LABELS.CATEGORY_FILTER)).toBeInTheDocument();
  });
  
  it('actualizează store-ul când se schimbă tipul', () => {
    // Mock pentru callback-uri
    const onTypeChange = jest.fn();
    const onCategoryChange = jest.fn();
    
    render(<TransactionFilters onTypeChange={onTypeChange} onCategoryChange={onCategoryChange} />);
    
    // Selectează alt tip
    act(() => {
      fireEvent.change(screen.getByLabelText(MOCK_LABELS.TYPE_FILTER), 
        { target: { value: TransactionType.EXPENSE } }
      );
    });
    
    // Verificăm că callback-ul a fost apelat
    expect(onTypeChange).toHaveBeenCalledWith(TransactionType.EXPENSE);
    
    // Verificăm că store-ul a fost actualizat (opțional, testul se bazează doar pe comportamentul componentei)
    expect(useTransactionFiltersStore.getState().filterType).toBe(TransactionType.EXPENSE);
  });
  
  it('actualizează store-ul când se schimbă categoria', () => {
    // Mock pentru callback-uri
    const onTypeChange = jest.fn();
    const onCategoryChange = jest.fn();
    
    render(<TransactionFilters onTypeChange={onTypeChange} onCategoryChange={onCategoryChange} />);
    
    // Selectează altă categorie
    act(() => {
      fireEvent.change(screen.getByLabelText(MOCK_LABELS.CATEGORY_FILTER), 
        { target: { value: CategoryType.EXPENSE } }
      );
    });
    
    // Verificăm că callback-ul a fost apelat
    expect(onCategoryChange).toHaveBeenCalledWith(CategoryType.EXPENSE);
    
    // Verificăm că store-ul a fost actualizat (opțional, testul se bazează doar pe comportamentul componentei)
    expect(useTransactionFiltersStore.getState().filterCategory).toBe(CategoryType.EXPENSE);
  });
  
  it('reflectă corect schimbările de stare din store', () => {
    // Setăm valori inițiale în store
    act(() => {
      useTransactionFiltersStore.getState().setFilterType(TransactionType.INCOME);
      useTransactionFiltersStore.getState().setFilterCategory(CategoryType.INCOME);
    });
    
    // Mock pentru callback-uri
    const onTypeChange = jest.fn();
    const onCategoryChange = jest.fn();
    
    // Renderăm componenta după ce am setat store-ul
    render(<TransactionFilters onTypeChange={onTypeChange} onCategoryChange={onCategoryChange} />);
    
    // Verificăm că dropdown-urile reflectă valorile din store
    expect((screen.getByLabelText(MOCK_LABELS.TYPE_FILTER) as HTMLSelectElement).value).toBe(TransactionType.INCOME);
    expect((screen.getByLabelText(MOCK_LABELS.CATEGORY_FILTER) as HTMLSelectElement).value).toBe(CategoryType.INCOME);
  });
});
