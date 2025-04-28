import { API_URL } from '../constants/api';
import { Transaction, TransactionQueryParams } from '../types/transaction';
import { MESAJE } from '@shared-constants';

/**
 * Răspuns paginat de la API
 */
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  limit: number;
  offset: number;
};

/**
 * Client API pentru operații cu tranzacții
 * 
 * Responsabilități:
 * - Comunicarea de bază cu API-ul
 * - Construirea URL-urilor cu query params
 * - Serializarea/deserializarea datelor
 * - Gestionarea erorilor HTTP
 */
export class TransactionApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Construiește URL-ul complet cu query params
   */
  private buildUrl(path: string = '', queryParams?: Record<string, any>): string {
    // Verificăm dacă baseUrl este un URL absolut sau un path relativ
    let baseIsAbsolute = this.baseUrl.startsWith('http://') || this.baseUrl.startsWith('https://');
    let fullUrl = '';
    
    if (baseIsAbsolute) {
      // Dacă baza e absolută, construim URL-ul normal
      try {
        const url = new URL(path || '', this.baseUrl);
        
        if (queryParams) {
          Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              url.searchParams.append(key, String(value));
            }
          });
        }
        
        fullUrl = url.toString();
      } catch (error) {
        console.error('Eroare URL:', error);
        fullUrl = this.baseUrl + (path || '');
      }
    } else {
      // Dacă baza e relativă, construim URL-ul manual
      fullUrl = this.baseUrl + (path || '');
      
      if (queryParams) {
        const queryStr = Object.entries(queryParams)
          .filter(([_, value]) => value !== undefined && value !== null && value !== '')
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&');
        
        if (queryStr) {
          fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryStr;
        }
      }
    }
    
    return fullUrl;
  }
  
  /**
   * Procesează răspunsul HTTP și gestionează erorile
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
    
    try {
      return await response.json();
    } catch (error) {
      throw new Error(MESAJE.EROARE_FORMAT_DATE);
    }
  }
  
  /**
   * Obține tranzacțiile filtrate de la API
   */
  async getTransactions(queryParams?: TransactionQueryParams): Promise<PaginatedResponse<Transaction>> {
    const url = this.buildUrl('', queryParams);
    
    try {
      const response = await fetch(url);
      return await this.handleResponse<PaginatedResponse<Transaction>>(response);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }
  
  /**
   * Obține o tranzacție după id
   */
  async getTransaction(id: string): Promise<Transaction> {
    const url = this.buildUrl(`/${id}`);
    
    try {
      const response = await fetch(url);
      return await this.handleResponse<Transaction>(response);
    } catch (error) {
      console.error(`Error fetching transaction with id ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Creează o nouă tranzacție
   */
  async createTransaction(data: Partial<Transaction>): Promise<Transaction> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return await this.handleResponse<Transaction>(response);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }
  
  /**
   * Actualizează o tranzacție existentă
   */
  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
    const url = this.buildUrl(`/${id}`);
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return await this.handleResponse<Transaction>(response);
    } catch (error) {
      console.error(`Error updating transaction with id ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Șterge o tranzacție
   */
  async deleteTransaction(id: string): Promise<void> {
    const url = this.buildUrl(`/${id}`);
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      await this.handleResponse<void>(response);
    } catch (error) {
      console.error(`Error deleting transaction with id ${id}:`, error);
      throw error;
    }
  }
}
