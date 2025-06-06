// Tipul pentru o tranzacție financiară
// Folosit în întreaga aplicație pentru consistență și siguranță la tipare
import {
  TransactionType,
  FrequencyType,
  TransactionStatus,
} from "@budget-app/shared-constants/enums";
import {
  TransactionValidated,
  CreateTransaction,
} from "@budget-app/shared-constants/transaction.schema";

/**
 * Definițiile de tipuri pentru tranzacții
 */

/**
 * Interfața pentru o tranzacție
 * Versiune actualizată care suportă toate campurile din aplicație
 */
export interface Transaction {
  // Identificatori
  id: string;
  _id?: string; // Pentru compatibilitate cu MongoDB
  userId: string;

  // Date de bază
  type: TransactionType;
  date: string | Date;

  // Valori numerice
  amount: number | string; // Suportă atât number (de la API) cât și string (pentru forms)
  actualAmount?: number; // Pentru tranzacții cu sumă efectivă diferită de cea planificată

  // Clasificare
  category: string;
  subcategory: string;

  // Opțiuni recurente
  recurring?: boolean;
  frequency?: FrequencyType;

  // Metadate și extensii
  status?: TransactionStatus;
  description?: string;
  currency?: string; // Opțional (ex: 'RON', 'EUR', 'USD')

  // Timestamp-uri
  createdAt?: string | Date;
  updatedAt?: string | Date;
  created_at?: string; // Pentru compatibilitate cu API legacy
  updated_at?: string; // Pentru compatibilitate cu API legacy
}

/**
 * Filtru pentru tranzacții
 * Combină toate proprietățile de filtrare disponibile în aplicație
 */
export interface TransactionFilters {
  // Filtre de bază
  type?: TransactionType;
  category?: string;
  subcategory?: string;

  // Filtre de dată
  month?: number;
  year?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  includeAdjacentDays?: boolean;

  // Filtre de valoare
  minAmount?: number;
  maxAmount?: number;

  // Filtre de proprietăți
  recurring?: boolean;
  frequency?: FrequencyType;

  // Filtre de căutare
  search?: string;
  userId?: string;

  // Filtre de paginare și sortare
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  sort?: string;
  order?: "asc" | "desc";
}

/**
 * Versiunea formularului de tranzacție cu amount ca număr
 * Folosit intern pentru validare și calcule înainte de a fi transformat în Transaction
 */
export type TransactionFormWithNumberAmount = Omit<Transaction, "amount"> & {
  amount: number; // amount ca număr pentru calcule și validare
};

// Alias pentru compatibilitate cu codul existent
export type TransactionQueryParams = TransactionFilters;
export type TransactionQueryParamsWithRecurring = TransactionFilters;
