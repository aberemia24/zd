/**
 * Test pentru store-ul Zustand de tranzacții
 * Testare fără mock-uri pentru stores, doar pentru servicii externe
 */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { act, waitFor } from '@testing-library/react';
// Import corect din shared-constants cu alias
import { PAGINATION, MESAJE } from '@shared-constants';
import { TransactionType, CategoryType, FrequencyType } from '@shared-constants/enums';
import { API } from '@shared-constants/api';
import type { TransactionValidated, CreateTransaction } from '@shared-constants/transaction.schema';
import type { Pagination, TransactionPage } from '../services/supabaseService';

// Import utils pentru testare
import { setupTestUser, resetAllStores } from '../test-utils';

// Import serviciul real pentru mockare
import { supabaseService } from '../services/supabaseService';

// Import store-ul pentru testare
import { useTransactionStore, TransactionQueryParamsWithRecurring } from './transactionStore';
import type { TransactionFormWithNumberAmount } from '../types/transaction';

// Mock pentru middleware Zustand (dezactivează persist și devtools în teste)
jest.mock('zustand/middleware', () => ({
  persist: (config: any) => (set: any, get: any, api: any) => {
    // execută factory-ul original, dar fără persist
    return config(set, get, api);
  },
  // Folosim numele prefixat cu 'mock' conform regulilor Jest
  devtools: (fn: any) => fn
}));

// Date de test pentru tranzacții - adaptate la TransactionValidated
const mockTransactions: TransactionValidated[] = [
  { 
    id: '1', 
    amount: 100,
    date: '2025-04-24', 
    type: TransactionType.EXPENSE,
    category: CategoryType.EXPENSE,
    subcategory: 'Chirie',
    recurring: false,
    frequency: FrequencyType.MONTHLY, // Folosim o valoare validă din enum în loc de undefined
    created_at: '2025-04-24T10:00:00Z',
    updated_at: '2025-04-24T10:00:00Z'
  },
  { 
    id: '2', 
    amount: 200,
    date: '2025-04-25', 
    type: TransactionType.INCOME,
    category: CategoryType.INCOME,
    subcategory: 'Salariu',
    recurring: true,
    frequency: FrequencyType.MONTHLY,
    created_at: '2025-04-25T10:00:00Z',
    updated_at: '2025-04-25T10:00:00Z'
  }
];

// Date pentru formular de tranzacții (format compatibil cu CreateTransaction)
const mockTransactionForm: TransactionFormWithNumberAmount = {
  amount: 300,
  date: '2025-04-26',
  type: TransactionType.EXPENSE,
  category: CategoryType.EXPENSE,
  subcategory: 'Cumparaturi',
  recurring: false,
  frequency: FrequencyType.MONTHLY,
  currency: 'RON' // Adăugat pentru compatibilitate cu TransactionFormWithNumberAmount
};

// Setup pentru fiecare test
beforeEach(async () => {
  // Resetăm toate mock-urile și store-urile
  jest.clearAllMocks();
  await resetAllStores();
  
  // Setup utilizator autentificat pentru toate testele
  await setupTestUser();
  
  // Configurăm mocks pentru supabaseService - conform regulilor de testare
  // Mock doar pentru serviciile externe, fără mockuri pentru store-uri
  jest.spyOn(supabaseService, 'fetchTransactions').mockImplementation((_userId, _pagination, _filters) => {
    return Promise.resolve({
      data: mockTransactions,
      count: mockTransactions.length
    });
  });
  
  jest.spyOn(supabaseService, 'createTransaction').mockImplementation((payload) => {
    // Transformăm datele din formular în TransactionValidated pentru contractul API
    return Promise.resolve({
      id: 'new-transaction-id',
      type: payload.type,
      amount: typeof payload.amount === 'number' ? payload.amount : Number(payload.amount),
      date: payload.date,
      category: payload.category || '',
      subcategory: payload.subcategory || '',
      recurring: payload.recurring || false,
      frequency: payload.frequency,
      description: payload.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  });
  
  jest.spyOn(supabaseService, 'updateTransaction').mockImplementation((id, payload) => {
    // Întoarcem un obiect TransactionValidated
    return Promise.resolve({
      id: id,
      type: payload.type || TransactionType.EXPENSE,
      amount: typeof payload.amount === 'number' ? payload.amount : Number(payload.amount || 0),
      date: payload.date || new Date().toISOString(),
      category: payload.category || '',
      subcategory: payload.subcategory || '',
      recurring: payload.recurring || false,
      frequency: payload.frequency,
      description: payload.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  });
  
  jest.spyOn(supabaseService, 'deleteTransaction').mockImplementation(() => {
    return Promise.resolve();
  });
});

// Rulăm teste pentru store-ul de tranzacții
describe('TransactionStore', () => {
  // Testăm inițializarea store-ului
  it('ar trebui să încarce valorile inițiale corect', () => {
    const state = useTransactionStore.getState();
    expect(state.transactions).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.currentQueryParams).toEqual({
      limit: PAGINATION.DEFAULT_LIMIT,
      offset: PAGINATION.DEFAULT_OFFSET,
      sort: PAGINATION.DEFAULT_SORT
    });
  });

  // Testăm fetchTransactions
  describe('fetchTransactions', () => {
    it('ar trebui să încarce tranzacțiile din supabaseService', async () => {
      // Executăm acțiunea de fetch
      await act(async () => {
        await useTransactionStore.getState().fetchTransactions();
      });
      
      // Verificăm că a fost apelat serviciul
      expect(supabaseService.fetchTransactions).toHaveBeenCalled();
      
      // Verificăm că starea a fost actualizată corect
      const state = useTransactionStore.getState();
      expect(state.transactions).toEqual(mockTransactions);
      expect(state.total).toBe(mockTransactions.length);
      expect(state.loading).toBe(false);
    });

    it('ar trebui să seteze eroare când fetchTransactions eșuează', async () => {
      // Override implementation pentru test specific
      jest.spyOn(supabaseService, 'fetchTransactions').mockImplementation(() => {
        return Promise.reject(new Error('Eroare la încărcare'));
      });

      // Executăm acțiunea care ar trebui să eșueze
      await act(async () => {
        await useTransactionStore.getState().fetchTransactions();
      });

      // Verificăm că starea a fost actualizată cu eroarea
      const state = useTransactionStore.getState();
      expect(state.transactions).toEqual([]);
      expect(state.error).toBe(MESAJE.EROARE_INCARCARE_TRANZACTII);
    });

    it('ar trebui să folosească cache-ul dacă parametrii sunt identici', async () => {
      // Prima cerere - încarcă datele
      await act(async () => {
        await useTransactionStore.getState().fetchTransactions();
      });

      // Resetăm contorul de apeluri pentru a urmări mai ușor
      jest.clearAllMocks();

      // A doua cerere - nu ar trebui să mai facă fetch dacă nu e forțată
      await act(async () => {
        await useTransactionStore.getState().fetchTransactions();
      });

      // Verificăm că nu a mai fost apelat serviciul
      expect(supabaseService.fetchTransactions).not.toHaveBeenCalled();
    });

    it('ar trebui să ignore cache-ul când e folosit forceRefresh', async () => {
      // Prima cerere
      await act(async () => {
        await useTransactionStore.getState().fetchTransactions();
      });

      // Resetăm counter
      jest.clearAllMocks();

      // A doua cerere cu forceRefresh=true
      await act(async () => {
        await useTransactionStore.getState().fetchTransactions(true);
      });

      // Verificăm că a fost apelat din nou serviciul în ciuda cache-ului
      expect(supabaseService.fetchTransactions).toHaveBeenCalled();
    });
  });

  // Testăm setQueryParams
  describe('setQueryParams', () => {
    it('ar trebui să actualizeze parametrii și să declanșeze fetchTransactions', async () => {
      // Parametri noi pentru test
      const newParams: TransactionQueryParamsWithRecurring = {
        type: TransactionType.EXPENSE,
        category: CategoryType.EXPENSE,
        limit: 10,
        offset: 0,
        sort: 'date',
        recurring: true
      };

      // Executăm acțiunea
      await act(async () => {
        useTransactionStore.getState().setQueryParams(newParams);
      });

      // Verificăm că parametrii s-au actualizat
      expect(useTransactionStore.getState().currentQueryParams).toEqual(newParams);
      
      // Verificăm că a fost declanșat fetchTransactions
      expect(supabaseService.fetchTransactions).toHaveBeenCalled();
    });
  });

  // Testăm saveTransaction
  describe('saveTransaction', () => {
    it('ar trebui să creeze o tranzacție nouă și să actualizeze lista', async () => {
      // Executăm acțiunea de salvare
      await act(async () => {
        await useTransactionStore.getState().saveTransaction(mockTransactionForm);
      });

      // Verificăm că a fost apelat serviciul corect
      expect(supabaseService.createTransaction).toHaveBeenCalledWith(mockTransactionForm);
      
      // Verificăm că au fost invalidate cache-ul și declanșată reîncărcarea
      expect(supabaseService.fetchTransactions).toHaveBeenCalled();
    });

    it('ar trebui să actualizeze o tranzacție existentă', async () => {
      const transactionId = '123';
      
      // Executăm acțiunea de actualizare
      await act(async () => {
        await useTransactionStore.getState().saveTransaction(mockTransactionForm, transactionId);
      });

      // Verificăm că a fost apelat serviciul corect
      expect(supabaseService.updateTransaction).toHaveBeenCalledWith(transactionId, mockTransactionForm);
      
      // Verificăm că au fost invalidate cache-ul și declanșată reîncărcarea
      expect(supabaseService.fetchTransactions).toHaveBeenCalled();
    });

    it('ar trebui să seteze eroare când tranzacția nu poate fi salvată', async () => {
      // Override implementation pentru test specific
      jest.spyOn(supabaseService, 'createTransaction').mockImplementation(() => {
        return Promise.reject(new Error('Eroare la salvare'));
      });

      // Executăm acțiunea care ar trebui să eșueze
      let error;
      await act(async () => {
        try {
          await useTransactionStore.getState().saveTransaction(mockTransactionForm);
        } catch (err) {
          error = err;
        }
      });

      // Verificăm că starea a fost actualizată cu eroarea
      expect(useTransactionStore.getState().error).toBe(MESAJE.EROARE_SALVARE_TRANZACTIE);
      expect(error).toBeDefined();
    });
  });

  // Testăm removeTransaction
  describe('removeTransaction', () => {
    it('ar trebui să șteargă o tranzacție și să actualizeze lista', async () => {
      const transactionId = '123';
      
      // Executăm acțiunea de ștergere
      await act(async () => {
        await useTransactionStore.getState().removeTransaction(transactionId);
      });

      // Verificăm că a fost apelat serviciul corect
      expect(supabaseService.deleteTransaction).toHaveBeenCalledWith(transactionId);
      
      // Verificăm că au fost invalidate cache-ul și declanșată reîncărcarea
      expect(supabaseService.fetchTransactions).toHaveBeenCalled();
    });

    it('ar trebui să seteze eroare când tranzacția nu poate fi ștearsă', async () => {
      // Override implementation pentru test specific
      jest.spyOn(supabaseService, 'deleteTransaction').mockImplementation(() => {
        return Promise.reject(new Error('Eroare la ștergere'));
      });

      const transactionId = '123';
      
      // Executăm acțiunea care ar trebui să eșueze
      let error;
      await act(async () => {
        try {
          await useTransactionStore.getState().removeTransaction(transactionId);
        } catch (err) {
          error = err;
        }
      });

      // Verificăm că starea a fost actualizată cu eroarea
      expect(useTransactionStore.getState().error).toBe(MESAJE.EROARE_STERGERE_TRANZACTIE);
      expect(error).toBeDefined();
    });
  });

  // Testăm refresh
  describe('refresh', () => {
    it('ar trebui să apeleze fetchTransactions cu forceRefresh=true', async () => {
      // Executăm acțiunea de refresh
      await act(async () => {
        await useTransactionStore.getState().refresh();
      });

      // Verificăm că a fost apelat fetchTransactions cu forceRefresh=true
      expect(supabaseService.fetchTransactions).toHaveBeenCalled();
    });

    it('ar trebui să prevină apeluri multiple dacă loading=true', async () => {
      // Setăm starea de loading
      useTransactionStore.setState({ loading: true });
      
      // Încercăm să apelăm refresh
      await act(async () => {
        await useTransactionStore.getState().refresh();
      });

      // Verificăm că fetchTransactions nu a fost apelat
      expect(supabaseService.fetchTransactions).not.toHaveBeenCalled();
    });
  });

  // Testăm reset
  describe('reset', () => {
    it('ar trebui să reseteze toate valorile la default', async () => {
      // Întâi modificăm starea pentru a testa resetarea
      useTransactionStore.setState({
        transactions: mockTransactions,
        total: mockTransactions.length,
        currentQueryParams: {
          type: TransactionType.EXPENSE,
          limit: 5,
          offset: 10,
          sort: 'amount'
        },
        loading: true,
        error: 'Eroare test'
      });

      // Act - resetăm starea
      useTransactionStore.getState().reset();

      // Assert - verificăm resetarea
      const store = useTransactionStore.getState();
      expect(store.transactions).toEqual([]);
      expect(store.total).toBe(0);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
      expect(store.currentQueryParams).toEqual({
        limit: PAGINATION.DEFAULT_LIMIT,
        offset: PAGINATION.DEFAULT_OFFSET,
        sort: PAGINATION.DEFAULT_SORT
      });
    });
  });
});
