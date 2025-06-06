/**
 * Serviciu optimizat pentru gestionarea tranzacțiilor
 *
 * Acest serviciu utilizează utilitarele de performanță pentru a optimiza
 * interogările, mutațiile și managementul cache-ului pentru tranzacții.
 */

import { API } from "@budget-app/shared-constants/api";
import { Transaction, TransactionFilters } from "../types/Transaction";
import { createCachedQueryFn } from "./reactQueryUtils";
import { memoizeRequest } from "../utils/performanceUtils";

// Tip pentru răspunsul paginat
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  nextCursor?: string | number;
}

/**
 * Construiește URL-ul pentru API cu parametrii de interogare
 */
function buildQueryUrl(endpoint: string, params?: Record<string, any>): string {
  const url = new URL(endpoint, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Serviciu pentru tranzacții cu optimizări de performanță
 */
class TransactionService {
  /**
   * Obține o tranzacție după ID
   * Memorăm rezultatul pentru a evita cereri redundante
   */
  getTransactionById = memoizeRequest(
    async (id: string | number): Promise<Transaction> => {
      const response = await fetch(`${API.ROUTES.TRANSACTIONS}/${id}`);

      if (!response.ok) {
        throw new Error(
          `Eroare la obținerea tranzacției: ${response.statusText}`,
        );
      }

      return response.json();
    },
    {
      maxAge: 5 * 60 * 1000, // 5 minute
      keyGenerator: (id) => `transaction:${id}`,
    },
  );

  /**
   * Obține lista de tranzacții cu filtre opționale
   * Utilizează cache pentru a optimiza cereri repetate
   */
  getTransactions = createCachedQueryFn(
    async (filters?: TransactionFilters): Promise<Transaction[]> => {
      const queryUrl = buildQueryUrl(API.ROUTES.TRANSACTIONS, filters);
      const response = await fetch(queryUrl);

      if (!response.ok) {
        throw new Error(
          `Eroare la obținerea tranzacțiilor: ${response.statusText}`,
        );
      }

      return response.json();
    },
    {
      cacheKey: (filters) =>
        `transactions:list:${JSON.stringify(filters || {})}`,
      maxAge: 5 * 60 * 1000, // 5 minute
    },
  );

  /**
   * Obține tranzacții paginate pentru infinite loading
   */
  getTransactionsPaginated = async (
    params: TransactionFilters,
  ): Promise<PaginatedResponse<Transaction>> => {
    const queryUrl = buildQueryUrl(API.ROUTES.TRANSACTIONS, {
      ...params,
      paginated: true,
    });

    const response = await fetch(queryUrl);

    if (!response.ok) {
      throw new Error(
        `Eroare la obținerea tranzacțiilor paginate: ${response.statusText}`,
      );
    }

    return response.json();
  };

  /**
   * Obține tranzacțiile pentru o lună specifică
   * Optimizat pentru vizualizarea lunară
   */
  getMonthlyTransactions = createCachedQueryFn(
    async (
      filters: { month: number; year: number } & Omit<
        TransactionFilters,
        "month" | "year"
      >,
    ): Promise<Transaction[]> => {
      const { month, year, ...otherFilters } = filters;

      // Calculăm data de început și sfârșit pentru luna specificată
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Ultima zi a lunii

      const queryUrl = buildQueryUrl(API.ROUTES.TRANSACTIONS, {
        ...otherFilters,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        includeAdjacentDays: filters.includeAdjacentDays || false,
      });

      const response = await fetch(queryUrl);

      if (!response.ok) {
        throw new Error(
          `Eroare la obținerea tranzacțiilor lunare: ${response.statusText}`,
        );
      }

      return response.json();
    },
    {
      cacheKey: (filters) =>
        `transactions:monthly:${filters.month}:${filters.year}:${JSON.stringify(filters)}`,
      maxAge: 5 * 60 * 1000, // 5 minute
    },
  );

  /**
   * Creează o nouă tranzacție
   */
  createTransaction = async (
    transaction: Omit<Transaction, "id">,
  ): Promise<Transaction> => {
    const response = await fetch(API.ROUTES.TRANSACTIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error(`Eroare la crearea tranzacției: ${response.statusText}`);
    }

    return response.json();
  };

  /**
   * Actualizează o tranzacție existentă
   */
  updateTransaction = async (
    id: string | number,
    transaction: Partial<Transaction>,
  ): Promise<Transaction> => {
    const response = await fetch(`${API.ROUTES.TRANSACTIONS}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error(
        `Eroare la actualizarea tranzacției: ${response.statusText}`,
      );
    }

    return response.json();
  };

  /**
   * Șterge o tranzacție
   */
  deleteTransaction = async (id: string | number): Promise<void> => {
    const response = await fetch(`${API.ROUTES.TRANSACTIONS}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Eroare la ștergerea tranzacției: ${response.statusText}`,
      );
    }
  };

  /**
   * Exportă tranzacțiile în format CSV sau Excel
   */
  exportTransactions = async (
    filters: TransactionFilters,
    format: "csv" | "excel" = "csv",
  ): Promise<Blob> => {
    const queryUrl = buildQueryUrl(`${API.ROUTES.TRANSACTIONS}/export`, {
      ...filters,
      format,
    });

    const response = await fetch(queryUrl);

    if (!response.ok) {
      throw new Error(
        `Eroare la exportul tranzacțiilor: ${response.statusText}`,
      );
    }

    return response.blob();
  };

  /**
   * Importă tranzacții din fișier
   */
  importTransactions = async (
    file: File,
  ): Promise<{ total: number; imported: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API.ROUTES.TRANSACTIONS}/import`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Eroare la importul tranzacțiilor: ${response.statusText}`,
      );
    }

    return response.json();
  };
}

// Exportăm o instanță singleton
export const transactionService = new TransactionService();

// Exportăm tipul serviciului pentru DI și mock-uri
export type ITransactionService = TransactionService;
