/**
 * Tip pentru o subcategorie (folosit la venituri, economii sau cheltuieli)
 * key - cheia de localizare pentru subcategorie (ex: 'income.salary', 'expenses.housing.gas')
 */
export interface Subcategorie {
    key: string;
}
/**
 * Tip pentru grupul de venituri
 */
export type Venituri = Subcategorie[];
/**
 * Tip pentru grupul de economii
 */
export type Economii = Subcategorie[];
/**
 * Tip pentru grupul de cheltuieli, organizate pe categorii mari (ex: locuință, sănătate etc.)
 * Fiecare cheie este o categorie, iar valoarea este un array de subcategorii
 */
export type Cheltuieli = {
    [categorie: string]: Subcategorie[];
};
/**
 * Tipul principal pentru structura de categorii folosită în aplicație
 */
export interface CategoriiConfig {
    income: Venituri;
    savings: Economii;
    expenses: Cheltuieli;
}
export declare const categorii: CategoriiConfig;
/**
 * Tipurile posibile de tranzacții folosite în aplicație
 * - income: venit
 * - expense: cheltuială
 * - saving: economie
 * - transfer: transfer între conturi
 */
export type TransactionType = 'income' | 'expense' | 'saving' | 'transfer';
/**
 * Tipuri de recurență pentru tranzacții recurente
 */
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
/**
 * Modelul principal pentru o tranzacție (venit, cheltuială, economie, transfer)
 * Inspirat din best practices ale aplicațiilor de bugetare consacrate (YNAB, Mint, Revolut, etc)
 */
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
