/**
 * Test de integrare pentru TransactionFilters cu store-ul real (Zustand)
 * Conform regulilor: folosim store-ul real (nu mock-uri)
 * Owner: Echipa Frontend - Test
 */
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import custom render și utilități de test (STRUCTURĂ OFICIALĂ)
import { 
  render, 
  screen, 
  setupTestUser, 
  resetAllStores,
  act // Folosim helper-ul act din test-utils pentru uniformitate
} from '../../../test-utils';

// Import componenta și store real (CONFORM REGULII: NU MOCK-UIM STORE-URI ZUSTAND)
import TransactionFilters from './TransactionFilters';
import { TransactionType, CategoryType } from '@shared-constants';
import { useTransactionFiltersStore } from '../../../stores/transactionFiltersStore';

describe('TransactionFilters - Integrare cu store-ul real', () => {
  /**
   * Setup și reset pentru fiecare test
   * IMPORTANT: Reset înainte de fiecare test pentru a evita contaminații cross-test
   */
  beforeEach(() => {
    jest.clearAllMocks(); // Curățăm orice mock creat în teste anterioare
    resetAllStores(); // Reset store-uri folosind helper-ul oficial
    setupTestUser(); // Setup utilizator de test folosind helper-ul oficial
  });
  
  afterEach(() => {
    resetAllStores();
  });

  /**
   * Test de integrare cu store-ul real (Zustand):
   * Modificările din store sunt reflectate în UI
   */
  it('reflectă modificările din store-ul real în UI', async () => {
    // ARRANGE - setăm valorile în store-ul real Zustand
    act(() => {
      useTransactionFiltersStore.getState().setFilterType(TransactionType.EXPENSE);
      useTransactionFiltersStore.getState().setFilterCategory(CategoryType.EXPENSE);
    });
    
    // Render componenta care primește valorile direct din store
    render(
      <TransactionFilters
        type={useTransactionFiltersStore.getState().filterType}
        category={useTransactionFiltersStore.getState().filterCategory}
        onTypeChange={jest.fn()}
        onCategoryChange={jest.fn()}
      />
    );
    
    // ACT - luăm referințele la selectoare
    const typeSelector = await screen.findByTestId('type-filter') as HTMLSelectElement;
    const categorySelector = await screen.findByTestId('category-filter') as HTMLSelectElement;
    
    // ASSERT - verificăm că UI reflectă valorile din store
    expect(typeSelector.value).toBe(TransactionType.EXPENSE);
    expect(categorySelector.value).toBe(CategoryType.EXPENSE);
  });

  /**
   * Test pentru butonul "Resetează filtre"
   * Verifică dacă butonul resetează filtrele la valorile implicite
   */
  it('resetează filtrele la valorile implicite când se apasă butonul de resetare', async () => {
    // ARRANGE - setăm valori custom în store
    act(() => {
      useTransactionFiltersStore.getState().setFilterType(TransactionType.EXPENSE);
      useTransactionFiltersStore.getState().setFilterCategory(CategoryType.EXPENSE);
    });
    
    // Mock pentru funcțiile care vor primi evenimentele de resetare
    const typeChangeFn = jest.fn();
    const categoryChangeFn = jest.fn();

    // Render componenta cu callbacks care primesc evenimentele de resetare
    render(
      <TransactionFilters
        type={useTransactionFiltersStore.getState().filterType}
        category={useTransactionFiltersStore.getState().filterCategory}
        onTypeChange={typeChangeFn}
        onCategoryChange={categoryChangeFn}
      />
    );

    // ACT - apăsăm butonul de resetare
    const resetButton = screen.getByText('Resetează filtre');
    await act(async () => {
      fireEvent.click(resetButton);
    });

    // ASSERT - verificăm că valorile au fost resetate la string gol
    expect(typeChangeFn).toHaveBeenCalledWith('');
    expect(categoryChangeFn).toHaveBeenCalledWith('');
  });
});
