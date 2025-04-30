// Tipul pentru o tranzacție financiară
// Folosit în întreaga aplicație pentru consistență și siguranță la tipare
import { TransactionType, FrequencyType } from '@shared-constants/enums';

export type Transaction = {
  _id?: string;
  id?: string;
  userId?: string;
  type: TransactionType; // ex: 'income', 'expense', 'saving'
  amount: string; // valoare numerică sub formă de string (pentru input controlat)
  currency: string; // ex: 'RON', 'EUR', 'USD'
  date: string; // format ISO sau local
  category: string;
  subcategory: string;
  recurring?: boolean;
  frequency?: FrequencyType;
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
  type?: string;
  category?: string;
  subcategory?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
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
