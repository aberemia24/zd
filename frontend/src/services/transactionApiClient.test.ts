import { TransactionApiClient, PaginatedResponse } from './transactionApiClient';
import { Transaction } from '../types/transaction';
import { API_URL } from '../constants/api';
import { MESAJE } from '../constants/messages';
import { TransactionType, CategoryType } from '../constants/enums';

// Mock pentru fetch global
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('')
  })
) as jest.Mock;

// Mock pentru console.error pentru a evita poluarea output-ului de test
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('TransactionApiClient', () => {
  let apiClient: TransactionApiClient;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    // Atribuim jest.fn() la global.fetch și ținem o referință la el
    mockFetch = global.fetch as jest.Mock;
    mockFetch.mockClear();
    
    // Configurăm mock-ul default pentru fetch 
    mockFetch.mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve('')
    }));
    
    // Inițializăm clientul API pentru teste
    apiClient = new TransactionApiClient();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('metode CRUD', () => {
    it('getTransactions apelează API-ul cu parametrii corecți', async () => {
      // Aranjare
      const mockData = {
        data: [{ id: '1', amount: '100' }],
        total: 1,
        limit: 10,
        offset: 0
      };

      mockFetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData)
      }));

      // Acțiune
      const result = await apiClient.getTransactions({ 
        sort: 'date', 
        limit: 10, 
        offset: 0 
      });

      // Asertare
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it('getTransaction apelează API-ul cu ID-ul corect', async () => {
      // Aranjare
      const id = '1';
      const mockData = { id: '1', amount: '100' };

      mockFetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData)
      }));

      // Acțiune
      const result = await apiClient.getTransaction(id);

      // Asertare
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it('createTransaction trimite metoda POST cu datele corecte', async () => {
      // Aranjare
      const newTransaction = { 
        amount: '100',
        type: TransactionType.EXPENSE
      };
      
      const mockData = { id: '1', ...newTransaction };

      mockFetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData)
      }));

      // Acțiune
      const result = await apiClient.createTransaction(newTransaction);

      // Asertare
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('POST');
      expect(result).toEqual(mockData);
    });

    it('updateTransaction trimite metoda PUT cu datele corecte', async () => {
      // Aranjare
      const id = '1';
      const updateData = { amount: '200' };
      const mockData = { id, ...updateData };

      mockFetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData)
      }));

      // Acțiune
      const result = await apiClient.updateTransaction(id, updateData);

      // Asertare
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('PUT');
      expect(result).toEqual(mockData);
    });

    it('deleteTransaction trimite metoda DELETE', async () => {
      // Aranjare
      const id = '1';

      mockFetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      }));

      // Acțiune
      await apiClient.deleteTransaction(id);

      // Asertare
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][1]?.method).toBe('DELETE');
    });
  });

  describe('gestionare erori', () => {
    it('handleResponse aruncă eroare pentru răspunsuri non-ok', async () => {
      // Aranjare
      mockFetch.mockImplementationOnce(() => Promise.resolve({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Resursa nu a fost găsită')
      }));

      // Acțiune & Asertare
      await expect(apiClient.getTransaction('999')).rejects.toThrow('Resursa nu a fost găsită');
    });

    it('handleResponse aruncă eroare pentru JSON invalid', async () => {
      // Aranjare
      mockFetch.mockImplementationOnce(() => Promise.resolve({
        ok: true, 
        json: () => Promise.reject(new Error('Invalid JSON'))
      }));

      // Acțiune & Asertare
      await expect(apiClient.getTransaction('1')).rejects.toThrow(MESAJE.EROARE_FORMAT_DATE);
    });
  });
});

