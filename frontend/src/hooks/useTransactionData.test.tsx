import { renderHook, act, waitFor } from '@testing-library/react';
import { useTransactionData } from '.';
import { TransactionQueryParams } from '.';
import { Transaction } from '../types/Transaction';
import { TransactionType } from '../constants/enums';
import { TransactionService } from '../services/transactionService';

// Mock pentru clasa TransactionService
jest.mock('../services/transactionService', () => {
  return {
    TransactionService: jest.fn().mockImplementation(() => ({
      getFilteredTransactions: jest.fn(),
      getTransactionById: jest.fn(),
      saveTransaction: jest.fn(),
      removeTransaction: jest.fn()
    }))
  };
});

// Date de test
const mockTransactions = [{ id: '1', type: TransactionType.INCOME, amount: '100' } as Transaction];
const mockPaginatedResponse = {
  data: mockTransactions,
  total: 50,
  limit: 10,
  offset: 0
};

// Creăm un mock pentru TransactionService
const createMockTransactionService = () => {
  return new TransactionService() as jest.Mocked<TransactionService>;
};

describe('useTransactionData', () => {
  // În fiecare test, vom crea un nou mock pentru TransactionService
  let mockTransactionService: jest.Mocked<TransactionService>;
  let mockPromise: Promise<any>;
  let mockPromiseResolve: (value: any) => void;
  let mockPromiseReject: (reason?: any) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Creăm un nou mock service pentru fiecare test
    mockTransactionService = createMockTransactionService();
    
    // Setăm promisiunea și rezolvatorii pentru testele asincrone
    mockPromise = new Promise((resolve, reject) => {
      mockPromiseResolve = resolve;
      mockPromiseReject = reject;
    });

    // Mock implementare getFilteredTransactions
    mockTransactionService.getFilteredTransactions = jest.fn().mockReturnValue(mockPromise);
  });

  // Test pentru fetch inițial la montare
  it('face fetch inițial la date la montare', async () => {
    // Parametrii de query impliciti
    const queryParams: TransactionQueryParams = { limit: 10, offset: 0, sort: 'date' };

    // Renderăm hook-ul
    const { result } = renderHook(() => useTransactionData({
      queryParams,
      transactionService: mockTransactionService
    }));

    // Initial, loading ar trebui să fie true și transactions goale
    expect(result.current.loading).toBe(true);
    expect(result.current.transactions).toEqual([]);

    // Rezolvăm promisiunea pentru a simula terminarea fetch-ului
    mockPromiseResolve(mockPaginatedResponse);

    // Așteptăm actualizarea stării după resolved promise
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // După fetch, loading ar trebui să fie false și datele încărcate
    expect(result.current.loading).toBe(false);
    expect(result.current.transactions).toEqual(mockTransactions);
    expect(result.current.total).toBe(50);
    expect(mockTransactionService.getFilteredTransactions).toHaveBeenCalledWith(queryParams, false);
  });

  // Test pentru refetching la schimbarea query params
  it('reîncarcă datele când se schimbă query params', async () => {
    // Parametrii de query inițiali
    const queryParams: TransactionQueryParams = { limit: 10, offset: 0, sort: 'date' };
    
    // Renderăm hook-ul
    const { result, rerender } = renderHook(
      (props) => useTransactionData(props),
      { 
        initialProps: {
          queryParams,
          transactionService: mockTransactionService
        }
      }
    );

    // Rezolvăm promisiunea inițială
    mockPromiseResolve(mockPaginatedResponse);
    
    // Așteptăm actualizarea stării după resolved promise
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Resetăm mock-urile și pregătim o nouă promisiune pentru a doua reîncărcare
    mockTransactionService.getFilteredTransactions.mockClear();
    const secondMockPromise = Promise.resolve(mockPaginatedResponse);
    mockTransactionService.getFilteredTransactions.mockReturnValue(secondMockPromise);

    // Schimbăm query params pentru a declanșa reîncărcarea
    const newQueryParams: TransactionQueryParams = { ...queryParams, type: TransactionType.INCOME };
    rerender({
      queryParams: newQueryParams,
      transactionService: mockTransactionService
    });

    // Așteptăm actualizarea stării după reîncărcare
    await waitFor(() => {
      expect(mockTransactionService.getFilteredTransactions).toHaveBeenCalledTimes(1);
    });

    // Verificăm că s-a făcut un nou fetch cu parametrii schimbați
    expect(mockTransactionService.getFilteredTransactions).toHaveBeenCalledTimes(1);
    expect(mockTransactionService.getFilteredTransactions).toHaveBeenCalledWith(newQueryParams, false);
  });

  // Test pentru gestionarea erorilor de la API
  it('gestionează erorile de la API', async () => {
    const queryParams: TransactionQueryParams = {
      limit: 10,
      offset: 0,
      sort: 'date',
    };

    // Mock pentru console.error pentru a evita mesaje în consolă
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const { result } = renderHook(() => useTransactionData({
      queryParams,
      transactionService: mockTransactionService,
    }));

    // Rezolvăm promisiunea cu o eroare
    mockPromiseReject(new Error('Eroare API simulată'));

    // Așteptăm procesarea erorii
    await waitFor(() => expect(result.current.error).toBeTruthy());

    // Verificăm starea după eroare
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Eroare API simulată');
    expect(result.current.transactions).toEqual([]);

    // Verificăm că eroarea a fost logată
    expect(console.error).toHaveBeenCalled();

    // Restaurăm console.error original
    console.error = originalConsoleError;
  });

  // Test pentru forțarea refresh-ului
  it('permite forțarea refresh-ului datelor', async () => {
    const queryParams: TransactionQueryParams = {
      limit: 10,
      offset: 0,
      sort: 'date',
    };

    const { result } = renderHook(() => useTransactionData({
      queryParams,
      transactionService: mockTransactionService,
    }));

    // Rezolvăm primul fetch
    mockPromiseResolve(mockPaginatedResponse);

    // Așteptăm primul fetch
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Resetăm mock-ul pentru a putea verifica un nou apel
    mockTransactionService.getFilteredTransactions.mockClear();
    const refreshPromise = Promise.resolve(mockPaginatedResponse);
    mockTransactionService.getFilteredTransactions.mockReturnValueOnce(refreshPromise);

    // Forțăm refresh-ul
    act(() => {
      result.current.refresh(); // refresh apelează intern fetchTransactions(true)
    });

    // Așteptăm finalizarea noului fetch
    await waitFor(() => expect(mockTransactionService.getFilteredTransactions).toHaveBeenCalled());
    
    // Verificăm că s-a făcut un nou fetch cu aceiași parametri și forced=true
    expect(mockTransactionService.getFilteredTransactions).toHaveBeenCalledWith(queryParams, true);
  });

  // Test pentru caching (evitarea fetch-urilor redundante)
  it('evită fetch-uri redundante cu aceiași parametri', async () => {
    const queryParams: TransactionQueryParams = {
      limit: 10,
      offset: 0,
      sort: 'date',
    };

    // Primul render cu parametrii inițiali
    const { result, rerender } = renderHook(
      (props) => useTransactionData(props),
      {
        initialProps: {
          queryParams,
          transactionService: mockTransactionService,
        },
      }
    );

    // Verificăm că loading este initial true
    expect(result.current.loading).toBe(true);

    // Rezolvăm promisiunea pentru primul fetch
    mockPromiseResolve(mockPaginatedResponse);

    // Așteptăm finalizarea primului fetch
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Confirmăm că s-a făcut un apel către serviciu
    expect(mockTransactionService.getFilteredTransactions).toHaveBeenCalledTimes(1);
    expect(mockTransactionService.getFilteredTransactions).toHaveBeenCalledWith(queryParams, false);

    // Resetăm mock-ul pentru a detecta orice apeluri ulterioare
    mockTransactionService.getFilteredTransactions.mockClear();
    
    // Re-render cu exact aceiași parametri (nu ar trebui să declanșeze un nou fetch)
    rerender({
      queryParams: { ...queryParams }, // Clonăm obiectul pentru a ne asigura că e o nouă referință
      transactionService: mockTransactionService,
    });

    // Așteptăm un timp pentru eventuale apeluri asinc
    await new Promise(resolve => setTimeout(resolve, 50));

    // Nu ar trebui să se facă un nou fetch dacă params sunt aceiași 
    expect(mockTransactionService.getFilteredTransactions).not.toHaveBeenCalled();
  });
});
