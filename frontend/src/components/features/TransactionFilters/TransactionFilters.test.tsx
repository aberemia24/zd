/**
 * Test pentru TransactionFilters - Abordare simplificată fără mockuri pentru stores
 * Conform regulilor: mock doar pentru external services
 * Owner: Echipa Frontend - Test
 * 
 * Test implementat folosind pattern-ul recomandat pentru testarea formularelor complexe
 * cu valori inițiale, conform memoriei (împart verificarea în teste focalizate).
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
import TransactionFilters from './';
import { TransactionType, CategoryType, LABELS } from '@shared-constants';
import { useTransactionFiltersStore } from '../../../stores/transactionFiltersStore';

describe('TransactionFilters', () => {
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
  
  // Implementăm testele folosind pattern-ul "verificare focalizată pe un singur câmp per test"
  // conform recomandării din memoria 3cb5254f-a08f-4ff1-8fcd-21e707c69101
  /**
   * Teste Simple - Verificare prezență elemente UI 
   */
  it('afișează filtrul de tip', async () => {
    // ARRANGE
    render(<TransactionFilters 
      type="" 
      category="" 
      onTypeChange={jest.fn()} 
      onCategoryChange={jest.fn()} 
    />);
    
    // ACT & ASSERT - independent test pentru fiecare element
    const typeFilterElement = await screen.findByTestId('type-filter');
    expect(typeFilterElement).toBeInTheDocument();
  });

  it('afișează filtrul de categorie', async () => {
    // ARRANGE
    render(<TransactionFilters 
      type="" 
      category="" 
      onTypeChange={jest.fn()} 
      onCategoryChange={jest.fn()} 
    />);
    
    // ACT & ASSERT
    const categoryFilterElement = await screen.findByTestId('category-filter');
    expect(categoryFilterElement).toBeInTheDocument();
  });

  /**
   * Test pentru verificarea schimbării tipului de tranzacție 
   */
  it('apelează onTypeChange cu valoarea corectă când se schimbă tipul', async () => {
    // ARRANGE - inițializăm un mock pentru callback-ul onTypeChange
    const mockTypeChange = jest.fn();
    
    // Render cu mock-ul nostru
    render(<TransactionFilters 
      type="" 
      category="" 
      onTypeChange={mockTypeChange} 
      onCategoryChange={jest.fn()} 
    />);
    
    // ACT - găsim și modificăm selectorul
    const typeSelector = await screen.findByTestId('type-filter');
    
    // Simulăm o modificare de valoare
    await act(async () => {
      fireEvent.change(typeSelector, { target: { value: TransactionType.EXPENSE } });
    });

    // ASSERT - verificăm dacă callback-ul a fost apelat cu valoarea corectă
    expect(mockTypeChange).toHaveBeenCalledWith(TransactionType.EXPENSE);
  });

  /**
   * Test pentru verificarea schimbării categoriei
   */
  it('apelează onCategoryChange cu valoarea corectă când se schimbă categoria', async () => {
    // ARRANGE - inițializăm un mock pentru callback-ul onCategoryChange
    const mockCategoryChange = jest.fn();
    
    // Render cu mock-ul nostru
    render(<TransactionFilters 
      type="" 
      category="" 
      onTypeChange={jest.fn()} 
      onCategoryChange={mockCategoryChange} 
    />);
    
    // ACT - găsim și modificăm selectorul
    const categorySelector = await screen.findByTestId('category-filter');
    
    // Simulăm o modificare de valoare - folosim o valoare validă din enum
    await act(async () => {
      fireEvent.change(categorySelector, { target: { value: CategoryType.EXPENSE } });
    });

    // ASSERT - verificăm dacă callback-ul a fost apelat cu valoarea corectă
    expect(mockCategoryChange).toHaveBeenCalledWith(CategoryType.EXPENSE);
  });

  /**
   * Test pentru verificarea propagării valorilor din store spre UI - tip
   * Primă parte a pattern-ului "testare focalizată pe un câmp"
   */
  it('reflectă valoarea tipului din props în UI', async () => {
    // ARRANGE - setat tipul direct ca prop
    render(<TransactionFilters 
      type={TransactionType.INCOME} 
      category="" 
      onTypeChange={jest.fn()} 
      onCategoryChange={jest.fn()} 
    />);
    
    // ACT - luăm referința la selector
    const typeSelector = await screen.findByTestId('type-filter') as HTMLSelectElement;
    
    // ASSERT - verificăm valoarea selectată
    await waitFor(() => {
      expect(typeSelector.value).toBe(TransactionType.INCOME);
    });
  });

  /**
   * Test pentru verificarea propagării valorilor din store spre UI - categorie
   * A doua parte a pattern-ului "testare focalizată pe un câmp"
   */  
  it('reflectă valoarea categoriei din props în UI', async () => {
    // ARRANGE - setat categoria direct ca prop (folosim valoare validă din enum)
    render(<TransactionFilters 
      type="" 
      category={CategoryType.EXPENSE} 
      onTypeChange={jest.fn()} 
      onCategoryChange={jest.fn()} 
    />);
    
    // ACT - luăm referința la selector
    const categorySelector = await screen.findByTestId('category-filter') as HTMLSelectElement;
    
    // ASSERT - verificăm valoarea selectată
    await waitFor(() => {
      expect(categorySelector.value).toBe(CategoryType.EXPENSE);
    });
  });
});
