import { TransactionValidated } from '@shared-constants/transaction.schema';
import { CategoryType } from '@shared-constants/enums';
import { EXCEL_GRID } from '@shared-constants';

// Structuri pentru caching
const categoryAmountsCache = new Map<string, Record<number, number>>();
const subcategoryAmountsCache = new Map<string, Record<number, number>>();
const cellSumCache = new Map<string, number>();

/**
 * Generează o cheie unică pentru cache pe baza parametrilor
 * @param keys Array de valori pentru a construi cheia cache
 * @returns Cheie string unică
 */
function generateCacheKey(...keys: (string | number)[]): string {
  return keys.join(':');
}

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
 * Calculează sumele zilnice pentru o categorie dată cu memorizare
 * 
 * @param categoryName Numele categoriei
 * @param transactions Lista de tranzacții validate
 * @returns Obiect cu zilele ca chei și sumele ca valori
 * @example
 * calculateAmountsForCategory('Cheltuieli', transactions) // { 1: 100, 2: 250, 3: 0 }
 */
export function calculateAmountsForCategory(categoryName: string, transactions: TransactionValidated[]): Record<number, number> {
  // Generare cheie unică pentru caching
  const cacheKey = generateCacheKey(categoryName, transactions.length, transactions[0]?.date || '');
  
  // Verificare cache
  if (categoryAmountsCache.has(cacheKey)) {
    return categoryAmountsCache.get(cacheKey)!;
  }
  
  // Calcul efectiv dacă nu există în cache
  const result = new Map<number, number>();
  transactions.filter(t => t.category === categoryName).forEach(t => {
    const day = new Date(t.date).getDate();
    result.set(day, (result.get(day) || 0) + t.amount);
  });
  
  const resultObj = Object.fromEntries(result);
  
  // Salvare în cache
  categoryAmountsCache.set(cacheKey, resultObj);
  
  return resultObj;
}

/**
 * Calculează sumele zilnice pentru o subcategorie dată cu memorizare
 * 
 * Aceasta este o funcție de performanță crucială deoarece este apelată 
 * de mai multe ori în timpul render-ului pentru fiecare celulă din grid.
 * 
 * @param categoryName Numele categoriei
 * @param subcategoryName Numele subcategoriei
 * @param transactions Lista de tranzacții validate
 * @returns Obiect cu zilele ca chei și sumele ca valori
 * @example
 * calculateAmountsForSubcategory('Cheltuieli', 'Alimente', transactions)
 */
export function calculateAmountsForSubcategory(
  categoryName: string,
  subcategoryName: string,
  transactions: TransactionValidated[]
): Record<number, number> {
  // Generare cheie unică pentru caching
  const cacheKey = generateCacheKey(
    categoryName, 
    subcategoryName, 
    transactions.length,
    transactions[0]?.date || ''
  );
  
  // Verificare cache
  if (subcategoryAmountsCache.has(cacheKey)) {
    return subcategoryAmountsCache.get(cacheKey)!;
  }
  
  // Calcul efectiv dacă nu există în cache
  const result = new Map<number, number>();
  transactions
    .filter(t => t.category === categoryName && t.subcategory === subcategoryName)
    .forEach(t => {
      const day = new Date(t.date).getDate();
      result.set(day, (result.get(day) || 0) + t.amount);
    });
  
  const resultObj = Object.fromEntries(result);
  
  // Salvare în cache
  subcategoryAmountsCache.set(cacheKey, resultObj);
  
  return resultObj;
}

/**
 * Calculează soldul zilnic pentru toate categoriile
 * 
 * Aplicația îți permite să vezi bilanțul zilnic combinat al 
 * veniturilor și cheltuielilor pentru a monitoriza fluxul de numerar.
 * 
 * @param transactions Lista de tranzacții validate
 * @returns Obiect cu zilele ca chei și soldurile ca valori
 * @example
 * calculateDailyBalance(transactions) // { 1: 500, 2: -200, 3: 100 }
 */
export function calculateDailyBalance(transactions: TransactionValidated[]): Record<number, number> {
  const result = new Map<number, number>();
  transactions.forEach(t => {
    const day = new Date(t.date).getDate();
    // Venituri adaugă la sold, cheltuieli scad
    let amount = t.amount;
    if (t.category !== CategoryType.INCOME && t.category !== CategoryType.SAVING) {
      amount = -Math.abs(amount); // Asigurăm valoare negativă pentru cheltuieli
    }
    result.set(day, (result.get(day) || 0) + amount);
  });
  return Object.fromEntries(result);
}

/**
 * Calculează suma totală pentru o celulă din grid cu memorare
 * 
 * Această funcție este critică pentru performanță în LunarGrid, fiind 
 * apelată pentru fiecare celulă din tabel în timpul render-ului și interacțiunilor.
 * 
 * @param category Categoria
 * @param subcategory Subcategoria (opțional)
 * @param day Ziua lunii
 * @param transactions Lista de tranzacții
 * @returns Suma pentru celulă
 * @example
 * getSumForCell('Cheltuieli', 'Alimente', 15, transactions) // 250.50
 * getSumForCell(EXCEL_GRID.HEADERS.SOLD, undefined, 1, transactions) // 1500
 */
export function getSumForCell(
  category: string,
  subcategory: string | undefined,
  day: number,
  transactions: TransactionValidated[]
): number {
  // Generare cheie unică pentru caching
  const cacheKey = generateCacheKey(category, subcategory || 'null', day, transactions.length);
  
  // Verificare cache
  if (cellSumCache.has(cacheKey)) {
    return cellSumCache.get(cacheKey)!;
  }
  
  // Calculăm suma în funcție de tipul rândului
  let result: number;
  
  if (category === EXCEL_GRID.HEADERS.SOLD) {
    // Pentru rândul de SOLD, calculăm soldurile zilnice
    const balances = calculateDailyBalance(transactions);
    result = balances[day] || 0;
  } else if (!subcategory) {
    // Pentru rânduri de categorie
    const amounts = calculateAmountsForCategory(category, transactions);
    result = amounts[day] || 0;
  } else {
    // Pentru rânduri de subcategorie
    const amounts = calculateAmountsForSubcategory(category, subcategory, transactions);
    result = amounts[day] || 0;
  }
  
  // Salvare în cache
  cellSumCache.set(cacheKey, result);
  
  return result;
}

/**
 * Resetează cache-ul pentru a forța recalcularea valorilor
 * Trebuie apelată după modificări în tranzacții sau setul de date
 */
export function resetCalculationsCache(): void {
  categoryAmountsCache.clear();
  subcategoryAmountsCache.clear();
  cellSumCache.clear();
}

/**
 * Calculează totalul pentru o categorie sau subcategorie
 * @param amounts Obiect cu sume zilnice
 * @returns Suma totală
 */
export function calculateTotal(amounts: Record<number, number>): number {
  return Object.values(amounts).reduce((sum, amount) => sum + amount, 0);
}
