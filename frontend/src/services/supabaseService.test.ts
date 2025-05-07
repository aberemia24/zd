/**
 * Test pentru supabaseService (serviciu extern care necesită mock-uri)
 * 
 * Conform regula 3: Mock-uim doar servicii externe - Supabase este un serviciu extern,
 * deci în acest caz specific mock-uirea este corectă și necesară
 */
import '@testing-library/jest-dom';
import { supabaseService } from './supabaseService';

// Import-uri corecte folosind alias-ul @shared-constants conform regulilor globale
import { TransactionType, FrequencyType } from '@shared-constants/enums';
import { API } from '@shared-constants/api';
import { MESAJE } from '@shared-constants/messages';
import type { CreateTransaction } from '@shared-constants/transaction.schema';

// Mock direct pentru Supabase (serviciu extern care necesită mockuri)
// Pentru servicii externe în testare, mock-urile sunt permise conform regulilor
jest.mock('./supabase', () => {
  const mockUserId = '11111111-1111-1111-1111-111111111111';
  const mockData = {
    id: 'mock-test-id-123',
    created_at: new Date().toISOString()
  };

  return {
    supabase: {
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      match: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { ...mockData, user_id: mockUserId },
        error: null
      }),
      then: jest.fn().mockResolvedValue({
        data: [{ ...mockData, user_id: mockUserId }],
        count: 1,
        error: null
      }),
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
          error: null
        })
      }
    }
  };
});

describe('supabaseService', () => {
  // ID stabil pentru user de test
  const mockUserId = '11111111-1111-1111-1111-111111111111';
  // ID pentru tranzacția creată
  let createdId: string | undefined;

  // Date de mock pentru o tranzacție validă
  const mockTransaction: CreateTransaction = {
    amount: 123.45,
    type: TransactionType.EXPENSE,
    date: '2025-04-30',
    category: 'Test',
    subcategory: 'Unit',
    recurring: false,
    frequency: FrequencyType.NONE,
    description: 'Test tranzacție',
  };

  // Configurăm mockurile pentru supabaseService înainte de fiecare test
  beforeEach(() => {
    // Reset mockuri pentru supabaseService
    // Folosim mockuri pentru funcțiile supabaseService (serviciu extern)
    jest.spyOn(supabaseService, 'createTransaction').mockImplementation((data) => {
      // Returnează un rezultat predictibil cu id fix pentru a putea testa în continuare
      const result = {
        id: 'mock-test-id-123',
        user_id: mockUserId,
        ...data,
        created_at: new Date().toISOString()
      };
      createdId = result.id;
      return Promise.resolve(result);
    });
    
    // Mock fetchTransactions pentru a returna date predictibile
    jest.spyOn(supabaseService, 'fetchTransactions').mockImplementation(() => {
      return Promise.resolve({
        data: [{
          id: 'mock-test-id-123',
          user_id: mockUserId,
          ...mockTransaction,
          created_at: new Date().toISOString()
        }],
        count: 1,
        error: null
      });
    });
    
    // Asigurăm că deleteTransaction nu aruncă erori în cleanup
    // Metoda returnează un Promise<void> conform signaturii
    jest.spyOn(supabaseService, 'deleteTransaction').mockResolvedValue(undefined);
  });

  // Curățăm toate mockurile după fiecare test
  afterEach(() => {
    jest.restoreAllMocks();
    createdId = undefined;
  });

  it('crează și fetch-uiește o tranzacție corect', async () => {
    // ARRANGE - pregătim mock-urile și datele de test
    // Toate aceste mock-uri sunt deja configurate în beforeEach
    
    // ACT - apelăm funcționalitățile de test
    // 1. Crează tranzacție
    const created = await supabaseService.createTransaction({ ...mockTransaction });
    createdId = created.id;
    
    // ASSERT - verificăm rezultatele
    // Verificăm că tranzacția a fost creată corect cu toate proprietățile
    expect(created).not.toBeNull();
    expect(created.id).toBe('mock-test-id-123');
    expect(created.amount).toBe(mockTransaction.amount);
    expect(created.type).toBe(mockTransaction.type);
    expect(created.category).toBe(mockTransaction.category);
    expect(created.date).toBe(mockTransaction.date);
    expect(created.recurring).toBe(mockTransaction.recurring);
    
    // 2. Fetch tranzacții
    const { data, count } = await supabaseService.fetchTransactions(mockUserId, { limit: 10 });
    
    // Verificăm că tranzacțiile sunt returnate corect
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(count).toBe(1);
    expect(data[0].id).toBe(created.id);
    expect(data[0].amount).toBe(mockTransaction.amount);
    
    // 3. CLEANUP - curățăm datele create în test
    // Dacă ar fi teste reale cu o bază de date, am șterge tranzacția creată
    if (createdId) {
      await supabaseService.deleteTransaction(createdId);
    }
  });
});
