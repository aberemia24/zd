/**
 * Helperi oficiali pentru resetare și setup user în teste, conform regulilor globale (mock doar pentru servicii externe).
 * OWNER: echipa testare
 * 
 * Ajută la configurarea unui mediu consistent pentru teste:
 * - Mock-uri doar pentru servicii externe (nu pentru store-uri)
 * - Setup pentru user și state consistent
 * - Prevenirea erorilor frecvente (ex: utilizator neautentificat)
 */

import { act } from 'react';
import { render, RenderOptions, waitFor } from '@testing-library/react';
import React from 'react';
import { API } from '@shared-constants/api';
import { MESAJE } from '@shared-constants';
import { TransactionType, CategoryType, FrequencyType } from '@shared-constants/enums';

// Mock pentru fetch folosit în teste
export const mockApiResponse = (data: any, error = null) => ({
  data,
  error
});

// Mockuiește global fetch-ul pentru teste
export const mockFetch = (response: any = {}) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(response)
  });
  return global.fetch;
};

// Import-uri pentru store-uri (conform noilor reguli - folosim store-urile reale)
let useAuthStore: any;
let useTransactionStore: any;
let useTransactionFormStore: any;
let useTransactionFiltersStore: any;

try {
  // Încearcă să importe dinamoc store-urile
  useAuthStore = require('./stores/authStore').useAuthStore;
  useTransactionStore = require('./stores/transactionStore').useTransactionStore;
  useTransactionFormStore = require('./stores/transactionFormStore').useTransactionFormStore;
  useTransactionFiltersStore = require('./stores/transactionFiltersStore').useTransactionFiltersStore;
} catch (e) {
  console.warn('Eroare la importul store-urilor', e);
}

/**
 * Configurează un utilizator de test autentificat
 * 
 * Acest helper rezolvă problema "Utilizatorul nu este autentificat!" în teste
 * injectând un utilizator de test în authStore
 */
export function setupTestUser() {
  if (!useAuthStore) return;
  
  act(() => {
    // Injectăm un utilizator fictiv în store
    useAuthStore.setState({
      user: { id: 'test-user-id', email: 'test@example.com' },
      loading: false,
      error: null,
      errorType: null,
    });
  });
}

/**
 * Configurează tranzacții de test în store
 * 
 * Acest helper injectează date de test în transaction store pentru a evita
 * încărcarea de date reale din API
 */
export function setupTestTransactions() {
  if (!useTransactionStore) return;
  
  act(() => {
    useTransactionStore.setState({
      transactions: [
        {
          id: '1',
          type: TransactionType.EXPENSE,
          amount: 100,
          currency: 'RON',
          category: 'EXPENSE',
          subcategory: 'Chirie',
          date: '2025-04-24',
          recurring: false,
          frequency: undefined,
        },
        {
          id: '2',
          type: TransactionType.INCOME,
          amount: 200,
          currency: 'RON',
          category: 'INCOME',
          subcategory: 'Salariu',
          date: '2025-04-25',
          recurring: true,
          frequency: FrequencyType.MONTHLY,
        },
      ],
      total: 2,
      loading: false,
      error: null,
      _lastQueryParams: undefined,
    });
  });
}

/**
 * Mock pentru supabaseService - înlocuiește complet serviciul cu mock-uri pentru toate metodele
 * 
 * Conform regulilor: mock doar pentru servicii externe
 */
export function mockSupabaseService() {
  const mockTransactions = [
    {
      id: '1',
      type: TransactionType.EXPENSE,
      amount: 100,
      currency: 'RON',
      category: 'EXPENSE',
      subcategory: 'Chirie',
      date: '2025-04-24',
      recurring: false,
      frequency: undefined,
    },
    {
      id: '2',
      type: TransactionType.INCOME,
      amount: 200,
      currency: 'RON',
      category: 'INCOME',
      subcategory: 'Salariu',
      date: '2025-04-25',
      recurring: true,
      frequency: FrequencyType.MONTHLY,
    },
  ];

  // Mock pentru serviciul Supabase - trebuie să fie extern pentru a putea fi accesat și modificat
  const mockSupabase: any = {
    fetchTransactions: jest.fn().mockResolvedValue({ data: mockTransactions, count: mockTransactions.length }),
    createTransaction: jest.fn().mockImplementation((data) => Promise.resolve({ ...data, id: 'mock-id' })),
    updateTransaction: jest.fn().mockImplementation((id, data) => Promise.resolve({ ...data, id })),
    deleteTransaction: jest.fn().mockResolvedValue({ success: true }),
    getTransactionById: jest.fn().mockImplementation((id) => {
      const transaction = mockTransactions.find(t => t.id === id);
      return Promise.resolve(transaction || null);
    }),
  };

  // Înlocuiește modulul supabaseService cu mock-ul nostru
  jest.mock('./services/supabaseService', () => ({
    supabaseService: mockSupabase
  }));

  return mockSupabase;
}

/**
 * Resetează toate store-urile la starea inițială - versiune care utilizează act()
 * 
 * Acest helper trebuie apelat după fiecare test pentru a evita
 * efecte secundare între teste
 */
export function resetAllStores() {
  act(() => {
    try {
      // Dacă store-urile au metode de reset, le folosim
      if (useTransactionStore?.getState()?.reset) {
        useTransactionStore.getState().reset();
      }
      
      if (useTransactionFormStore?.getState()?.resetForm) {
        useTransactionFormStore.getState().resetForm();
      }
      
      if (useTransactionFiltersStore?.getState()?.resetFilters) {
        useTransactionFiltersStore.getState().resetFilters();
      }
      
      // Resetăm explicit starea de autentificare
      if (useAuthStore) {
        useAuthStore.setState({
          user: null,
          loading: false,
          error: null,
          errorType: null,
        });
      }
    } catch (e) {
      console.warn('Eroare la resetarea store-urilor', e);
    }
  });
}

/**
 * Returnează mesajele actuale din aplicație (pentru teste care verifică texte)
 * 
 * Rezolvă problema cu assert-urile de mesaje care nu corespund cu cele reale
 */
export function getActualMessages() {
  // Folosim MESAJE din shared-constants/messages.ts care sunt sursa de adevăr pentru mesajele din aplicație
  // plus orice alte mesaje de backup pentru compatibilitate cu testele anterioare
  return {
    ...MESAJE,
    // Dacă vreunul din aceste mesaje lipsește din MESAJE, îl adaugăm ca fallback
    // Astfel nu suprascriem valorile din MESAJE, care este sursa de adevăr,
    // dar ne asigurăm că testele au toate mesajele de care au nevoie
    ...(!MESAJE.CAMPURI_OBLIGATORII && {
      CAMPURI_OBLIGATORII: "Toate câmpurile obligatorii trebuie completate!"
    }),
    ...(!MESAJE.FRECV_RECURENTA && {
      FRECV_RECURENTA: "Selectează frecvența pentru tranzacțiile recurente!"
    }),
    ...(!MESAJE.SUCCES_ADAUGARE && {
      SUCCES_ADAUGARE: "Tranzacție adăugată cu succes!"
    }),
    ...(!MESAJE.EROARE_GENERALA && {
      EROARE_GENERALA: "A apărut o eroare. Te rugăm să încerci din nou."
    }),
  };
}

// Custom render care adaugă provideri dacă sunt necesari
export function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options });
}

// Re-export tot din RTL
export * from '@testing-library/react';
export { customRender as render };
