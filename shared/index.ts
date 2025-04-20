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

// Importăm config-ul JSON cu toate categoriile și subcategoriile
// (asigură validarea tipurilor la runtime și la build)
// @ts-ignore
import categories from './categories.json';

export const categorii: CategoriiConfig = categories;
