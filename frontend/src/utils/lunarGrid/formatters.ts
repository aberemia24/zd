import { TransactionType, CategoryType } from '@shared-constants/enums';

// Constante locale pentru formatare
const LOCALE = 'ro-RO';
const TEXT_CLASSES = {
  POSITIVE: 'text-success-600 font-medium',
  NEGATIVE: 'text-error-600 font-medium',
  NEUTRAL: 'text-secondary-400'
};

/**
 * Formatează o valoare numerică ca monedă RON cu 2 zecimale folosind standardele locale
 * @param amount Suma de formatat
 * @returns String formatat (ex: "123,45")
 * @throws {Error} Dacă amount nu este un număr valid
 * @example
 * formatCurrency(1234.56) // "1.234,56"
 * formatCurrency(-1234.56) // "-1.234,56"
 */
export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    console.warn('formatCurrency: amount trebuie să fie un număr valid');
    return '0,00';
  }
  
  return amount.toLocaleString(LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Returnează clasa CSS Tailwind pentru stilizarea sumelor (+/-) bazat pe valoarea numerică
 * 
 * Această funcție aplică style-uri consistente în toată aplicația pentru sumele pozitive, 
 * negative sau zero conform design system-ului.
 * 
 * @param amount Suma pe baza căreia se determină stilul
 * @returns String cu clase CSS Tailwind
 * @example
 * getBalanceStyleClass(100) // "text-success-600 font-medium"
 * getBalanceStyleClass(-50) // "text-error-600 font-medium"
 * getBalanceStyleClass(0)   // "text-secondary-400"
 */
export function getBalanceStyleClass(amount: number): string {
  if (amount > 0) return TEXT_CLASSES.POSITIVE;
  if (amount < 0) return TEXT_CLASSES.NEGATIVE;
  return TEXT_CLASSES.NEUTRAL;
}

/**
 * Determină tipul de tranzacție pe baza categoriei
 * 
 * Maparea categoriilor la tipuri de tranzacții permite sisteme scalabile
 * de clasificare a tranzacțiilor în întreaga aplicație.
 * 
 * @param category Numele categoriei
 * @returns TransactionType corespunzător (INCOME/EXPENSE/SAVING)
 * @example
 * getTransactionTypeForCategory(CATEGORY_TYPES.INCOME) // TransactionType.INCOME
 * getTransactionTypeForCategory('CHELTUIELI')         // TransactionType.EXPENSE
 */
export function getTransactionTypeForCategory(category: string): TransactionType {
  if (category === CategoryType.INCOME) return TransactionType.INCOME;
  if (category === CategoryType.SAVING) return TransactionType.SAVING;
  return TransactionType.EXPENSE;
}

/**
 * Formatează o dată în formatul zz/ll/aaaa conform standardelor aplicației
 * 
 * Funcția gestionează diverse formate de intrare (string, Date, timestamp) și 
 * asigură o formată de ieșire consistentă în întreaga aplicație.
 * 
 * @param date Data de formatat (string, Date sau timestamp)
 * @returns Data formatată ca string în format "zz/ll/aaaa"
 * @throws Tratează excepțiile intern pentru date invalide
 * @example
 * formatDate('2025-01-15')  // "15/01/2025"
 * formatDate(new Date())    // data curentă format zz/ll/aaaa
 */
export function formatDate(date: string | Date | number): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      throw new Error('Data invalidă');
    }
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Eroare la formatarea datei:', error);
    return 'Data invalidă';
  }
}
