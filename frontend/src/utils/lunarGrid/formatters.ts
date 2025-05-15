import { TransactionType } from '@shared-constants/enums';

/**
 * Formatează o valoare numerică ca monedă RON cu 2 zecimale
 * @param amount Suma de formatat
 * @returns String formatat (ex: "123,45")
 * @throws {Error} Dacă amount nu este un număr valid
 */
export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    console.warn('formatCurrency: amount trebuie să fie un număr valid');
    return '0,00';
  }
  
  return amount.toLocaleString('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Returnează clasa CSS Tailwind pentru stilizarea sumelor (+/-)
 * @param amount Suma pe baza căreia se determină stilul
 * @returns String cu clase CSS
 */
export function getBalanceStyleClass(amount: number): string {
  if (amount > 0) return 'text-success-600 font-medium';
  if (amount < 0) return 'text-error-600 font-medium';
  return 'text-secondary-400';
}

/**
 * Determină tipul de tranzacție pe baza categoriei
 * @param category Numele categoriei
 * @returns TransactionType corespunzător
 */
export function getTransactionTypeForCategory(category: string): TransactionType {
  if (category === 'VENITURI') return TransactionType.INCOME;
  if (category === 'ECONOMII') return TransactionType.SAVING;
  return TransactionType.EXPENSE;
}

/**
 * Formatează o dată în formatul zz/ll/aaaa
 * @param date Data de formatat (string, Date sau timestamp)
 * @returns Data formatată ca string
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
    return 'Data invalida';
  }
}
