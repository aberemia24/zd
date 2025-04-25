import { TransactionService } from './transactionService';
import { TransactionApiClient, PaginatedResponse } from './transactionApiClient';
import { Transaction } from '../types/Transaction';
import { TransactionQueryParams } from '../hooks/useTransactionFilters';
import { TransactionFormWithNumberAmount } from '../hooks/useTransactionForm';
import { FORM_DEFAULTS } from '../constants/defaults';
import { TransactionType } from '../constants/enums';

// Mock complet pentru TransactionApiClient
jest.mock('./transactionApiClient');
const MockTransactionApiClient = TransactionApiClient as jest.MockedClass<typeof TransactionApiClient>;

describe('TransactionService', () => {
  let service: TransactionService;
  let mockApiClient: jest.Mocked<TransactionApiClient>;

  // Date mock pentru teste
  const mockTransaction: Transaction = {
    _id: '1',
    id: '1',
    type: 'income',
    amount: '100',
    currency: 'RON',
    date: '2025-04-25',
    category: 'VENITURI',
    subcategory: 'Salariu',
  };

  const mockPaginatedResponse: PaginatedResponse<Transaction> = {
    data: [mockTransaction],
    total: 1,
    limit: 10,
    offset: 0
  };

  const mockQueryParams: TransactionQueryParams = {
    limit: 10,
    offset: 0,
    sort: 'date'
  };

  const mockFormData: TransactionFormWithNumberAmount = {
    type: 'income',
    amount: 100, // Notă: în formular folosim number
    date: '2025-04-25',
    category: 'VENITURI',
    subcategory: 'Salariu',
    // Proprietăți obligatorii conform tipului TransactionFormWithNumberAmount
    recurring: false,
    frequency: '',
    // currency este adăugat automat de TransactionService din FORM_DEFAULTS
  };

  beforeEach(() => {
    // Reset mock-uri între teste
    MockTransactionApiClient.mockClear();
    
    // Configurare mock-uri pentru metodele API client
    mockApiClient = {
      getTransactions: jest.fn().mockResolvedValue(mockPaginatedResponse),
      getTransaction: jest.fn().mockResolvedValue(mockTransaction),
      createTransaction: jest.fn().mockResolvedValue(mockTransaction),
      updateTransaction: jest.fn().mockResolvedValue(mockTransaction),
      deleteTransaction: jest.fn().mockResolvedValue(undefined),
      buildUrl: jest.fn(),
    } as unknown as jest.Mocked<TransactionApiClient>;

    // Inițiere serviciu cu mock client
    service = new TransactionService(mockApiClient);
  });

  describe('getFilteredTransactions', () => {
    it('aduce date de la API când cache-ul este gol', async () => {
      const result = await service.getFilteredTransactions(mockQueryParams);
      
      expect(mockApiClient.getTransactions).toHaveBeenCalledWith(mockQueryParams);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('returnează date din cache pentru aceiași parametri', async () => {
      // Prima cerere - va popula cache-ul
      await service.getFilteredTransactions(mockQueryParams);
      
      // Reset mock pentru a verifica că nu mai este apelat
      mockApiClient.getTransactions.mockClear();
      
      // A doua cerere - ar trebui să folosească cache-ul
      const result = await service.getFilteredTransactions(mockQueryParams);
      
      expect(mockApiClient.getTransactions).not.toHaveBeenCalled();
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('ignoră cache-ul când forceRefresh este true', async () => {
      // Prima cerere - va popula cache-ul
      await service.getFilteredTransactions(mockQueryParams);
      
      // Reset mock pentru a verifica că este apelat din nou
      mockApiClient.getTransactions.mockClear();
      
      // A doua cerere cu forceRefresh
      await service.getFilteredTransactions(mockQueryParams, true);
      
      expect(mockApiClient.getTransactions).toHaveBeenCalledTimes(1);
    });

    it('generează chei de cache diferite pentru parametri diferiți', async () => {
      // Prima cerere cu un set de parametri
      await service.getFilteredTransactions(mockQueryParams);
      
      // Reset mock
      mockApiClient.getTransactions.mockClear();
      
      // A doua cerere cu parametri diferiți
      const differentParams: TransactionQueryParams = {
        ...mockQueryParams,
        type: TransactionType.EXPENSE
      };
      
      await service.getFilteredTransactions(differentParams);
      
      // API-ul ar trebui să fie apelat din nou pentru parametrii noi
      expect(mockApiClient.getTransactions).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTransactionById', () => {
    it('apelează API-ul cu ID-ul corect', async () => {
      const id = '123';
      await service.getTransactionById(id);
      
      expect(mockApiClient.getTransaction).toHaveBeenCalledWith(id);
    });
  });

  describe('saveTransaction', () => {
    it('apelează createTransaction când ID-ul lipsește', async () => {
      await service.saveTransaction(mockFormData);
      
      const expectedApiData = {
        ...mockFormData,
        amount: String(mockFormData.amount), // Validează conversia la string
        currency: FORM_DEFAULTS.CURRENCY, // TransactionService adaugă automat currency din FORM_DEFAULTS
      };
      
      expect(mockApiClient.createTransaction).toHaveBeenCalledWith(expectedApiData);
      expect(mockApiClient.updateTransaction).not.toHaveBeenCalled();
    });

    it('apelează updateTransaction când ID-ul este furnizat', async () => {
      const id = '123';
      await service.saveTransaction(mockFormData, id);
      
      const expectedApiData = {
        ...mockFormData,
        amount: String(mockFormData.amount),
        currency: FORM_DEFAULTS.CURRENCY, // TransactionService adaugă automat currency din FORM_DEFAULTS
      };
      
      expect(mockApiClient.updateTransaction).toHaveBeenCalledWith(id, expectedApiData);
      expect(mockApiClient.createTransaction).not.toHaveBeenCalled();
    });

    it('invalidează cache-ul după salvare', async () => {
      // Populăm mai întâi cache-ul
      await service.getFilteredTransactions(mockQueryParams);
      
      // Reset mock API pentru a verifica apelurile ulterioare
      mockApiClient.getTransactions.mockClear();
      
      // Salvăm o tranzacție
      await service.saveTransaction(mockFormData);
      
      // Verificăm că următoarea cerere ignoră cache-ul
      await service.getFilteredTransactions(mockQueryParams);
      
      expect(mockApiClient.getTransactions).toHaveBeenCalledTimes(1);
    });

    it('transformă corect formatul amount de la number la string', async () => {
      await service.saveTransaction(mockFormData);
      
      const capturedApiData = mockApiClient.createTransaction.mock.calls[0][0];
      
      expect(typeof capturedApiData.amount).toBe('string');
      expect(capturedApiData.amount).toBe('100');
    });

    it('aplică valorile implicite pentru câmpurile lipsă', async () => {
      const incompleteFormData = {
        type: 'income',
        amount: 100,
        date: '2025-04-25',
        category: 'VENITURI',
        subcategory: 'Salariu',
        // Lipsește currency
      } as TransactionFormWithNumberAmount;
      
      await service.saveTransaction(incompleteFormData);
      
      const capturedApiData = mockApiClient.createTransaction.mock.calls[0][0];
      
      expect(capturedApiData.currency).toBe(FORM_DEFAULTS.CURRENCY);
    });
  });

  describe('removeTransaction', () => {
    it('apelează deleteTransaction cu ID-ul corect', async () => {
      const id = '123';
      await service.removeTransaction(id);
      
      expect(mockApiClient.deleteTransaction).toHaveBeenCalledWith(id);
    });

    it('invalidează selectiv cache-ul după ștergere', async () => {
      // Configurăm mock-ul pentru a returna o pagină cu tranzacția care va fi ștearsă
      const transactionToDelete = { ...mockTransaction, id: '123', _id: '123' };
      mockApiClient.getTransactions.mockResolvedValueOnce({
        data: [transactionToDelete],
        total: 1,
        limit: 10,
        offset: 0
      });
      
      // Populăm cache-ul cu o pagină care conține tranzacția care va fi ștearsă
      await service.getFilteredTransactions(mockQueryParams);
      
      // Reset mock API pentru a verifica apelurile ulterioare
      mockApiClient.getTransactions.mockClear();
      
      // Ștergem tranzacția
      await service.removeTransaction('123');
      
      // Verificăm că următoarea cerere ignoră cache-ul pentru că tranzacția ștearsă era în cache
      await service.getFilteredTransactions(mockQueryParams);
      
      expect(mockApiClient.getTransactions).toHaveBeenCalledTimes(1);
    });
  });

  describe('cache behavior', () => {
    it('ignoră cache-ul expirat', async () => {
      // Creăm un serviciu cu timp de cache foarte scurt (1ms)
      const shortCacheService = new TransactionService(mockApiClient, 1);
      
      // Prima cerere - va popula cache-ul
      await shortCacheService.getFilteredTransactions(mockQueryParams);
      
      // Reset mock
      mockApiClient.getTransactions.mockClear();
      
      // Așteptăm să expire cache-ul
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // A doua cerere - ar trebui să ignore cache-ul expirat
      await shortCacheService.getFilteredTransactions(mockQueryParams);
      
      expect(mockApiClient.getTransactions).toHaveBeenCalledTimes(1);
    });

    it('respectă limita maximă de intrări în cache', async () => {
      // Creăm un serviciu cu limită de cache foarte mică (2 intrări)
      const limitedCacheService = new TransactionService(mockApiClient, 60000, 2);
      
      // Facem 3 cereri diferite pentru a depași limita cache-ului
      const params1 = { ...mockQueryParams, limit: 5 };
      const params2 = { ...mockQueryParams, limit: 10 };
      const params3 = { ...mockQueryParams, limit: 15 };
      
      // Prima cerere
      await limitedCacheService.getFilteredTransactions(params1);
      mockApiClient.getTransactions.mockClear();
      
      // Verificare cache hit pentru params1
      await limitedCacheService.getFilteredTransactions(params1);
      expect(mockApiClient.getTransactions).not.toHaveBeenCalled();
      mockApiClient.getTransactions.mockClear();
      
      // A doua cerere
      await limitedCacheService.getFilteredTransactions(params2);
      mockApiClient.getTransactions.mockClear();
      
      // Verificare cache hit pentru params2
      await limitedCacheService.getFilteredTransactions(params2);
      expect(mockApiClient.getTransactions).not.toHaveBeenCalled();
      mockApiClient.getTransactions.mockClear();
      
      // A treia cerere - ar trebui să elimine una dintre intrările anterioare
      await limitedCacheService.getFilteredTransactions(params3);
      mockApiClient.getTransactions.mockClear();
      
      // Verificăm că limităm mărimea cache-ului
      const cacheStats = limitedCacheService.getCacheStats();
      expect(cacheStats.entries).toBeLessThanOrEqual(2); // Ar trebui să avem maxim 2 intrări în cache
      
      // Facem din nou o cerere pentru params3 - trebuie să fie cache hit
      await limitedCacheService.getFilteredTransactions(params3);
      expect(mockApiClient.getTransactions).not.toHaveBeenCalled();
    });
    
    it('invalidează selectiv cache-ul pentru operațiunea de creare', async () => {
      // Creăm un serviciu nou
      const service = new TransactionService(mockApiClient);
      
      // Populăm cache-ul cu 2 pagini
      const firstPageParams = { ...mockQueryParams, offset: 0 };
      const secondPageParams = { ...mockQueryParams, offset: 10 };
      
      await service.getFilteredTransactions(firstPageParams);
      await service.getFilteredTransactions(secondPageParams);
      
      // Reset mock-ul și salvăm o tranzacție nouă
      mockApiClient.getTransactions.mockClear();
      await service.saveTransaction(mockFormData);
      
      // Prima pagină ar trebui să fie revalidată (cache invalidat)
      await service.getFilteredTransactions(firstPageParams);
      expect(mockApiClient.getTransactions).toHaveBeenCalledTimes(1);
      mockApiClient.getTransactions.mockClear();
      
      // A doua pagină ar trebui să rămână validă (cache păstrat)
      await service.getFilteredTransactions(secondPageParams);
      expect(mockApiClient.getTransactions).not.toHaveBeenCalled();
    });
    
    it('invalidează selectiv cache-ul pentru operațiunea de actualizare', async () => {
      // Creăm un serviciu nou
      const service = new TransactionService(mockApiClient);
      
      // Populăm cache-ul cu 2 pagini de date diferite
      // Prima pagină conține tranzacția cu ID-ul 1
      mockApiClient.getTransactions.mockResolvedValueOnce({
        data: [mockTransaction], // conține tranzacția cu ID 1
        total: 1,
        limit: 10,
        offset: 0
      });
      
      // A doua pagină nu conține tranzacția cu ID-ul 1
      const secondPageTransaction = { ...mockTransaction, id: '2', _id: '2' };
      mockApiClient.getTransactions.mockResolvedValueOnce({
        data: [secondPageTransaction],
        total: 2,
        limit: 10,
        offset: 10
      });
      
      const firstPageParams = { ...mockQueryParams, offset: 0 };
      const secondPageParams = { ...mockQueryParams, offset: 10 };
      
      await service.getFilteredTransactions(firstPageParams);
      await service.getFilteredTransactions(secondPageParams);
      
      // Reset mock-ul și actualizăm o tranzacție cu ID-ul 1
      mockApiClient.getTransactions.mockClear();
      await service.saveTransaction(mockFormData, '1');
      
      // Prima pagină ar trebui să fie revalidată (conține tranzacția cu ID 1)
      await service.getFilteredTransactions(firstPageParams);
      expect(mockApiClient.getTransactions).toHaveBeenCalledTimes(1);
      mockApiClient.getTransactions.mockClear();
      
      // A doua pagină ar trebui să rămână validă (nu conține tranzacția cu ID 1)
      await service.getFilteredTransactions(secondPageParams);
      expect(mockApiClient.getTransactions).not.toHaveBeenCalled();
    });
    
    it('oferă statistici relevante despre performanța cache-ului', async () => {
      // Creăm un serviciu nou
      const service = new TransactionService(mockApiClient);
      
      // Inițial cache-ul ar trebui să fie gol
      const initialStats = service.getCacheStats();
      expect(initialStats.entries).toBe(0);
      expect(initialStats.hits).toBe(0);
      expect(initialStats.misses).toBe(0);
      
      // Facem o cerere (cache miss)
      await service.getFilteredTransactions(mockQueryParams);
      
      // Verificăm statisticile după primul cache miss
      const statsAfterMiss = service.getCacheStats();
      expect(statsAfterMiss.entries).toBe(1);
      expect(statsAfterMiss.hits).toBe(0);
      expect(statsAfterMiss.misses).toBe(1);
      
      // Facem aceeași cerere (cache hit)
      await service.getFilteredTransactions(mockQueryParams);
      
      // Verificăm statisticile după un cache hit
      const statsAfterHit = service.getCacheStats();
      expect(statsAfterHit.entries).toBe(1);
      expect(statsAfterHit.hits).toBe(1);
      expect(statsAfterHit.misses).toBe(1);
      expect(statsAfterHit.ratio).toBe(0.5); // 1 hit / (1 hit + 1 miss)
    });
  });
});
