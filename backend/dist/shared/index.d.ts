export interface Subcategorie {
    key: string;
}
export type Venituri = Subcategorie[];
export type Economii = Subcategorie[];
export type Cheltuieli = {
    [categorie: string]: Subcategorie[];
};
export interface CategoriiConfig {
    income: Venituri;
    savings: Economii;
    expenses: Cheltuieli;
}
export declare const categorii: CategoriiConfig;
export type TransactionType = 'income' | 'expense' | 'saving' | 'transfer';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    currency: string;
    date: string;
    category: string;
    subcategory: string;
    description?: string;
    recurring?: boolean;
    recurrence?: RecurrenceType;
    status?: 'cleared' | 'pending' | 'scheduled';
    accountId?: string;
    createdAt?: string;
    updatedAt?: string;
}
