// Tipul pentru o tranzacție financiară
// Folosit în întreaga aplicație pentru consistență și siguranță la tipare
import { TransactionType, FrequencyType, TransactionStatus } from '@shared-constants/enums';
import { TransactionValidated, CreateTransaction } from '@shared-constants/transaction.schema';

// Extind tipul Transaction pentru a fi compatibil atât cu formularele (unde amount e string)
// cât și cu React Query (unde amount e number)
// IMPORTANT: currency este acum opțional pentru compatibilitate cu TransactionValidated
export type Transaction = {
  // Identificatori
  _id?: string;
  id?: string;
  userId?: string;
  
  // Date de bază - obligatorii
  type: TransactionType; // ex: 'income', 'expense', 'saving'
  date: string; // format ISO sau local
  
  // Valori numerice - suport dual pentru string (UI) și number (API)
  amount: number | string; // Suportă atât number (de la API) cât și string (pentru forms)
  actualAmount?: number; // Pentru tranzacții cu sumă efectivă diferită de cea planificată
  
  // Clasificare
  category?: string; // Opțional pentru compatibilitate cu schema.ts
  subcategory?: string; // Opțional pentru compatibilitate cu schema.ts
  
  // Opțiuni recurente
  recurring?: boolean;
  frequency?: FrequencyType;
  
  // Metadate și extensii
  status?: TransactionStatus; // Ex: PLANNED, COMPLETED
  description?: string; // Descriere opțională
  currency?: string; // Opțional (ex: 'RON', 'EUR', 'USD') - nu se mai folosește în FE
  
  // Timestamp-uri (pentru audit)
  created_at?: string;
  updated_at?: string;
};

/**
 * Parametrii pentru filtrarea și paginarea tranzacțiilor
 * Folosit pentru comunicarea cu API și stocarea stării filtrelor
 */
export type TransactionQueryParams = {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  type?: TransactionType; // Modificat din string în TransactionType
  category?: string;
  subcategory?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  recurring?: boolean; // Adăugat pentru filtrarea după tranzacții recurente
};

/**
 * Versiunea formularului de tranzacție cu amount ca număr
 * Folosit intern pentru validare și calcule înainte de a fi transformat în Transaction
 */
export type TransactionFormWithNumberAmount = Omit<Transaction, 'amount'> & {
  type: TransactionType;
  frequency?: FrequencyType;
  amount: number; // amount ca număr pentru calcule și validare
};

export type TransactionQueryParamsWithRecurring = TransactionQueryParams & {
  month?: number;
  year?: number;
  includeAdjacentDays?: boolean;
};
