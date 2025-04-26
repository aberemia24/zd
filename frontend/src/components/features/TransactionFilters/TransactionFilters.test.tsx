import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionFilters from './';
import { TransactionType, CategoryType } from '../../../constants/enums';
import { MOCK_OPTIONS, MOCK_LABELS, MOCK_BUTTONS, MOCK_TABLE, MOCK_PLACEHOLDERS } from '../../../test/mockData';

// Mock pentru store-ul Zustand - folosim string-uri pentru enum valori
// Important: Trebuie să respectăm regula Jest care nu permite referințe externe în mock factory
jest.mock('../../../stores/transactionFiltersStore', () => {
  // Folosim prefix 'mock' pentru a evita eroarea Jest
  const mockSetFilterType = jest.fn();
  const mockSetFilterCategory = jest.fn();
  
  return {
    useTransactionFiltersStore: jest.fn((selector: any) => {
      const state = {
        // Folosim valorile string direct în loc de enum-uri
        filterType: 'income', // Echivalent cu TransactionType.INCOME
        filterCategory: 'income', // Echivalent cu CategoryType.INCOME
        setFilterType: mockSetFilterType,
        setFilterCategory: mockSetFilterCategory
      };
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    })
  };
});

describe('TransactionFilters', () => {
  const mockSetFilterType = jest.fn();
  const mockSetFilterCategory = jest.fn();
  
  beforeEach(() => {
    // Reset mock-urile pentru fiecare test
    jest.clearAllMocks();
    
    // Configurăm mock-ul pentru store-ul Zustand
    const { useTransactionFiltersStore } = require('../../../stores/transactionFiltersStore');
    useTransactionFiltersStore.mockImplementation((selector: any) => {
      const state = {
        // Folosim valori string în loc de enum-uri, pentru consistență cu mock-ul definit mai sus
        filterType: 'income', // TransactionType.INCOME
        filterCategory: 'income', // CategoryType.INCOME
        setFilterType: mockSetFilterType,
        setFilterCategory: mockSetFilterCategory
      };
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
  });

  it('afișează opțiunile de tip și categorie', () => {
    render(<TransactionFilters />);
    expect(screen.getByLabelText(MOCK_LABELS.TYPE_FILTER)).toBeInTheDocument();
    expect(screen.getByLabelText(MOCK_LABELS.CATEGORY_FILTER)).toBeInTheDocument();
  });
  
  it('apelează setFilterType când se schimbă tipul', () => {
    render(<TransactionFilters />);
    
    // Selectează alt tip
    fireEvent.change(screen.getByLabelText(MOCK_LABELS.TYPE_FILTER), { target: { value: TransactionType.EXPENSE } });
    expect(mockSetFilterType).toHaveBeenCalledWith(TransactionType.EXPENSE);
  });
  
  it('apelează setFilterCategory când se schimbă categoria', () => {
    render(<TransactionFilters />);
    
    // Selectează altă categorie
    fireEvent.change(screen.getByLabelText(MOCK_LABELS.CATEGORY_FILTER), { target: { value: CategoryType.EXPENSE } });
    expect(mockSetFilterCategory).toHaveBeenCalledWith(CategoryType.EXPENSE);
  });
});
