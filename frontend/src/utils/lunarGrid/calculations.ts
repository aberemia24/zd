import { TransactionValidated } from '@shared-constants/transaction.schema';

/**
 * Generează array cu zilele din lună [1,2,3,...,31]
 * @param year Anul
 * @param month Luna (1-12)
 * @returns Array cu zilele lunii
 * @throws {Error} Dacă luna este invalidă
 */
export function getDaysInMonth(year: number, month: number): number[] {
  if (month < 1 || month > 12) {
    throw new Error(`Lună invalidă: ${month}. Trebuie să fie între 1-12.`);
  }
  
  const date = new Date(year, month, 0);
  if (isNaN(date.getTime())) {
    throw new Error(`Data invalidă: an=${year}, lună=${month}`);
  }
  
  const daysCount = date.getDate();
  return Array.from({ length: daysCount }, (_, i) => i + 1);
}

/**
 * Calculează sumele zilnice pentru o categorie
 * @param categoryName Numele categoriei
 * @param transactions Lista de tranzacții
 * @returns Obiect cu sume pe zile {1: suma, 2: suma, ...}
 */
export function calculateAmountsForCategory(
  categoryName: string,
  transactions: TransactionValidated[]
): Record<number, number> {
  const result = new Map<number, number>();
  
  transactions
    .filter(t => t.category === categoryName)
    .forEach(t => {
      const day = new Date(t.date).getDate();
      result.set(day, (result.get(day) || 0) + t.amount);
    });
    
  return Object.fromEntries(result);
}

/**
 * Calculează sumele zilnice pentru o subcategorie
 * @param categoryName Numele categoriei
 * @param subcategoryName Numele subcategoriei
 * @param transactions Lista de tranzacții
 * @returns Obiect cu sume pe zile {1: suma, 2: suma, ...}
 */
export function calculateAmountsForSubcategory(
  categoryName: string,
  subcategoryName: string,
  transactions: TransactionValidated[]
): Record<number, number> {
  const result = new Map<number, number>();
  
  transactions
    .filter(t => t.category === categoryName && t.subcategory === subcategoryName)
    .forEach(t => {
      const day = new Date(t.date).getDate();
      result.set(day, (result.get(day) || 0) + t.amount);
    });
    
  return Object.fromEntries(result);
}

/**
 * Calculează soldurile zilnice pentru toate tranzacțiile
 * @param transactions Lista de tranzacții
 * @returns Obiect cu solduri pe zile {1: sold, 2: sold, ...}
 */
export function calculateDailyBalances(
  transactions: TransactionValidated[]
): Record<number, number> {
  const result = new Map<number, number>();
  
  transactions.forEach(t => {
    const day = new Date(t.date).getDate();
    result.set(day, (result.get(day) || 0) + t.amount);
  });
  
  return Object.fromEntries(result);
}

/**
 * Obține suma pentru o celulă specifică
 * @param category Categoria
 * @param subcategory Subcategoria (opțional)
 * @param day Ziua lunii
 * @param transactions Lista de tranzacții
 * @returns Suma pentru celula specificată
 */
export function getSumForCell(
  category: string,
  subcategory: string | null,
  day: number,
  transactions: TransactionValidated[]
): number {
  const filtered = subcategory
    ? transactions.filter(t => 
        t.category === category && 
        t.subcategory === subcategory && 
        new Date(t.date).getDate() === day
      )
    : transactions.filter(t => 
        t.category === category && 
        new Date(t.date).getDate() === day
      );
      
  return filtered.reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculează totalul pentru o categorie sau subcategorie
 * @param amounts Obiect cu sume zilnice
 * @returns Suma totală
 */
export function calculateTotal(amounts: Record<number, number>): number {
  return Object.values(amounts).reduce((sum, amount) => sum + amount, 0);
}
