import { TransactionApiClient, PaginatedResponse } from './transactionApiClient';
import { Transaction, TransactionQueryParams, TransactionFormWithNumberAmount } from '../types/transaction';
import { FORM_DEFAULTS } from '@shared-constants';

/**
 * Serviciu pentru gestionarea tranzacțiilor
 * 
 * Responsabilități:
 * - Transformarea datelor între formatul UI și API
 * - Validarea datelor înainte de trimitere
 * - Caching și optimizări
 * - Centralizarea logicii de business pentru tranzacții
 */
export class TransactionService {
  private apiClient: TransactionApiClient;
  private cache: Map<string, { data: PaginatedResponse<Transaction>, timestamp: number }>;
  private cacheTimeMs: number;
  private maxCacheEntries: number; // Limita maximă de intrări în cache
  private cacheHits: number; // Contor pentru statistici de cache hits
  private cacheMisses: number; // Contor pentru statistici de cache misses
  
  constructor(
    apiClient?: TransactionApiClient, 
    cacheTimeMs: number = 60000, 
    maxCacheEntries: number = 50
  ) {
    this.apiClient = apiClient || new TransactionApiClient();
    this.cache = new Map();
    this.cacheTimeMs = cacheTimeMs; // Timp implicit de păstrare cache: 1 minut
    this.maxCacheEntries = maxCacheEntries; // Limităm numărul de intrări în cache pentru a evita creșterea excesivă a memoriei
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
  
  /**
   * Generează o cheie unică pentru cache bazată pe parametrii de query
   */
  private getCacheKey(queryParams?: TransactionQueryParams): string {
    return JSON.stringify(queryParams || {});
  }
  
  /**
   * Verifică dacă există o intrare validă în cache pentru parametrii dați
   */
  private getCachedData(queryParams?: TransactionQueryParams): PaginatedResponse<Transaction> | null {
    const key = this.getCacheKey(queryParams);
    const cached = this.cache.get(key);
    
    if (!cached) {
      this.cacheMisses++;
      return null;
    }
    
    // Verifică dacă cache-ul a expirat
    if (Date.now() - cached.timestamp > this.cacheTimeMs) {
      this.cache.delete(key);
      this.cacheMisses++;
      return null;
    }
    
    // Actualizăm timestamp-ul pentru a implementa politica LRU
    // (Least Recently Used - cel mai puțin recent utilizat)
    this.cache.set(key, {
      data: cached.data,
      timestamp: Date.now()
    });
    
    this.cacheHits++;
    return cached.data;
  }
  
  /**
   * Adaugă date în cache cu limitarea dimensiunii pentru a evita creșterea excesivă a memoriei
   */
  private setCacheData(queryParams: TransactionQueryParams | undefined, data: PaginatedResponse<Transaction>): void {
    const key = this.getCacheKey(queryParams);
    
    // Dacă atingem limita de cache, eliminăm cea mai veche intrare (LRU)
    if (this.cache.size >= this.maxCacheEntries) {
      let oldestKey: string | null = null;
      let oldestTimestamp = Infinity;
      
      // Găsim intrarea cea mai veche din cache
      for (const [entryKey, entry] of this.cache.entries()) {
        if (entry.timestamp < oldestTimestamp) {
          oldestTimestamp = entry.timestamp;
          oldestKey = entryKey;
        }
      }
      
      // Eliminăm cea mai veche intrare
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    // Adăugăm noua intrare în cache
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  /**
   * Invalidează cache-ul în mod selectiv pe baza tipului de operațiune și a parametrilor afectați
   * 
   * @param operation - Tipul operațiunii: 'create', 'update', 'delete', 'all'
   * @param queryParams - Parametrii de query ai căror cache trebuie invalidat
   * @param transactionId - ID-ul tranzacției modificate (pentru update/delete operațiuni)
   */
  private invalidateCache(
    operation: 'create' | 'update' | 'delete' | 'all' = 'all',
    queryParams?: TransactionQueryParams,
    transactionId?: string
  ): void {
    // Invalidare completă a cache-ului (comportamentul implicit anterior)
    if (operation === 'all') {
      this.cache.clear();
      return;
    }

    // Dacă avem parametri specifici, invalidează doar acea intrare
    if (queryParams) {
      const key = this.getCacheKey(queryParams);
      this.cache.delete(key);
    }
    
    // Pentru operațiuni de update sau delete, invalidează cache-urile care ar putea conține tranzacția
    if ((operation === 'update' || operation === 'delete') && transactionId) {
      // Iterează prin toate cheile din cache
      for (const [key, cacheEntry] of this.cache.entries()) {
        // Verifică dacă cache-ul conține tranzacția cu ID-ul specificat
        const hasTransaction = cacheEntry.data.data.some(
          transaction => transaction.id === transactionId || transaction._id === transactionId
        );
        
        if (hasTransaction) {
          this.cache.delete(key);
        }
      }
    }
    
    // Pentru create, invalidează doar cache-urile care ar putea fi afectate
    // (de exemplu, prima pagină din orice sortare)
    if (operation === 'create') {
      for (const [key, cacheEntry] of this.cache.entries()) {
        // Decodifică cheia în parametri pentru a verifica dacă e prima pagină
        try {
          const params = JSON.parse(key);
          // Dacă e prima pagină (offset 0), invalidează cache-ul
          if (params.offset === 0 || params.offset === undefined) {
            this.cache.delete(key);
          }
        } catch (e) {
          // Ignoră erorile de parse
        }
      }
    }
  }
  
  /**
   * Transformă datele de formular în formatul API
   */
  private transformFormToApi(formData: TransactionFormWithNumberAmount): Partial<Transaction> {
    // Transformăm între formatul UI și API, cu o atenție specială pentru amount
    // În UI folosim number pentru calcule, dar în API ar trebui să fie string conform tipului Transaction
    return {
      ...formData,
      // Convertim amount la string pentru compatibilitate cu Transaction type
      amount: String(formData.amount),
      // Adăugăm valori implicite dacă lipsesc
      currency: FORM_DEFAULTS.CURRENCY,
    };
  }
  
  /**
   * Obține tranzacțiile filtrate, cu suport pentru cache
   */
  async getFilteredTransactions(
    queryParams?: TransactionQueryParams,
    forceRefresh: boolean = false
  ): Promise<PaginatedResponse<Transaction>> {
    // Verifică cache-ul dacă nu se forțează refresh
    if (!forceRefresh) {
      const cachedData = this.getCachedData(queryParams);
      if (cachedData) {
        return cachedData;
      }
    }
    
    // Obține date proaspete de la API
    const data = await this.apiClient.getTransactions(queryParams);
    
    // Salvează în cache
    this.setCacheData(queryParams, data);
    
    return data;
  }
  
  /**
   * Obține o tranzacție după id
   */
  async getTransactionById(id: string): Promise<Transaction> {
    return await this.apiClient.getTransaction(id);
  }
  
  /**
   * Obține statistici despre cache
   */
  getCacheStats(): { entries: number, hits: number, misses: number, ratio: number } {
    return {
      entries: this.cache.size,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      ratio: this.cacheHits / (this.cacheHits + this.cacheMisses || 1)
    };
  }

  /**
   * Salvează o tranzacție (creare sau actualizare)
   */
  async saveTransaction(formData: TransactionFormWithNumberAmount, id?: string): Promise<Transaction> {
    const apiData = this.transformFormToApi(formData);
    
    let result: Transaction;
    
    if (id) {
      // Actualizare
      result = await this.apiClient.updateTransaction(id, apiData);
      // Invalidează cache-ul selectiv după actualizare
      this.invalidateCache('update', undefined, id);
    } else {
      // Creare
      result = await this.apiClient.createTransaction(apiData);
      // Invalidează cache-ul selectiv după creare
      this.invalidateCache('create');
    }
    
    return result;
  }
  
  /**
   * Șterge o tranzacție
   */
  async removeTransaction(id: string): Promise<void> {
    await this.apiClient.deleteTransaction(id);
    
    // Invalidează cache-ul selectiv după ștergere
    this.invalidateCache('delete', undefined, id);
  }
}
