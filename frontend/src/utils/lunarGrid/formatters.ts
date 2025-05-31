import { TransactionType, CategoryType } from "@shared-constants/enums";

// Constante locale pentru formatare
const LOCALE = "ro-RO";
const TEXT_CLASSES = {
  POSITIVE: "text-success-600 font-medium", // Pentru sold pozitiv (intens)
  NEGATIVE: "text-error-600 font-medium",   // Pentru sold negativ (intens)
  NEUTRAL: "text-gray-400",                 // Pentru valori zero/goale
  // Culori subtile cu border neutru pentru categorii
  INCOME_LIGHT: "text-success-500 font-normal border border-gray-200 rounded-sm px-1",    // Verde light cu border neutral
  EXPENSE_LIGHT: "text-error-400 font-normal border border-gray-200 rounded-sm px-1",     // Roșu mai light cu border neutral
  SAVINGS_LIGHT: "text-blue-500 font-normal border border-gray-200 rounded-sm px-1",      // Albastru light pentru investiții/savings
};

// Nume lunilor în română pentru header-urile LunarGrid
const ROMANIAN_MONTHS = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
];

// 🎯 Step 3.3: Singleton Intl.NumberFormat pentru optimizare CPU
const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formatează o valoare numerică ca monedă RON cu 2 zecimale folosind standardele locale
 * Optimizat cu singleton formatter pentru performanță
 * @param amount Suma de formatat
 * @returns String formatat (ex: "123,45")
 * @throws {Error} Dacă amount nu este un număr valid
 * @example
 * formatCurrency(1234.56) // "1.234,56"
 * formatCurrency(-1234.56) // "-1.234,56"
 */
export function formatCurrency(amount: number): string {
  if (typeof amount !== "number" || isNaN(amount)) {
    console.warn("formatCurrency: amount trebuie să fie un număr valid");
    return "0,00";
  }

  return currencyFormatter.format(amount);
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
export function getTransactionTypeForCategory(
  category: string,
): TransactionType {
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
      throw new Error("Data invalidă");
    }

    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Eroare la formatarea datei:", error);
    return "Data invalidă";
  }
}

/**
 * Formatează ziua pentru header-urile LunarGrid (doar cifra)
 * 
 * Această funcție returnează doar numărul zilei pentru un aspect mai curat
 * în header-urile coloanelor. Luna și anul sunt afișate separat în header-ul principal.
 * 
 * @param day Ziua lunii (1-31)
 * @param month Luna (1-12) - folosită pentru validare
 * @returns String cu numărul zilei (ex: "1", "15", "31")
 * @example
 * formatDayMonth(1, 6)  // "1"
 * formatDayMonth(15, 5) // "15"
 * formatDayMonth(31, 12) // "31"
 */
export function formatDayMonth(day: number, month: number): string {
  if (day < 1 || day > 31 || month < 1 || month > 12) {
    console.warn("formatDayMonth: zi sau lună invalidă", { day, month });
    return day.toString(); // Fallback la numărul zilei
  }

  return day.toString(); // Doar cifra zilei
}

/**
 * Formatează luna și anul pentru header-ul principal al LunarGrid
 * 
 * Această funcție creează un header principal elegant care afișează
 * luna și anul în format românesc: "LunaRomână - Anul"
 * 
 * @param month Luna (1-12)
 * @param year Anul (ex: 2025)
 * @returns String formatat în română (ex: "Mai - 2025", "Decembrie - 2024")
 * @example
 * formatMonthYear(5, 2025)  // "Mai - 2025"
 * formatMonthYear(12, 2024) // "Decembrie - 2024"
 * formatMonthYear(1, 2025)  // "Ianuarie - 2025"
 */
export function formatMonthYear(month: number, year: number): string {
  if (month < 1 || month > 12) {
    console.warn("formatMonthYear: lună invalidă", { month, year });
    return `Luna ${month} - ${year}`; // Fallback
  }

  const monthName = ROMANIAN_MONTHS[month - 1]; // month este 1-indexed
  return `${monthName} - ${year}`;
}

/**
 * Verifică dacă o zi specifică este ziua curentă
 * 
 * @param day Ziua lunii (1-31)
 * @param month Luna (1-12)
 * @param year Anul
 * @returns true dacă este ziua curentă
 * @example
 * isCurrentDay(15, 5, 2025) // true dacă astăzi este 15 Mai 2025
 */
export function isCurrentDay(day: number, month: number, year: number): boolean {
  const today = new Date();
  return (
    today.getDate() === day &&
    today.getMonth() + 1 === month && // getMonth() este 0-indexed
    today.getFullYear() === year
  );
}

/**
 * Returnează clase CSS pentru styling-ul header-urilor zilelor
 * Include highlighting pentru ziua curentă
 * 
 * @param day Ziua lunii (1-31)
 * @param month Luna (1-12)
 * @param year Anul
 * @returns String cu clase CSS Tailwind
 * @example
 * getDayHeaderStyle(15, 5, 2025) // "bg-blue-100 text-blue-800 font-semibold" pentru ziua curentă
 */
export function getDayHeaderStyle(day: number, month: number, year: number): string {
  if (isCurrentDay(day, month, year)) {
    return "text-blue-700 font-semibold border-gray-300";
  }
  return ""; // Default styling din CVA
}

/**
 * Returnează clase CSS pentru styling-ul sumelor bazat pe tipul categoriei
 * Implementează color coding corect: green pentru income, red pentru expense
 * 
 * @param categoryName Numele categoriei
 * @param value Valoarea sumei (pentru cazuri speciale)
 * @returns String cu clase CSS Tailwind
 * @example
 * getCategoryStyleClass("VENITURI", 100) // "text-success-600 font-medium" (verde)
 * getCategoryStyleClass("TRANSPORT", 50) // "text-error-600 font-medium" (roșu)
 * getCategoryStyleClass("", 0) // "text-secondary-400" (gri pentru zero)
 */
export function getCategoryStyleClass(categoryName: string, value: number): string {
  // Pentru valori zero, returnează stil neutru indiferent de categorie
  if (value === 0) return TEXT_CLASSES.NEUTRAL;
  
  // Pentru sold sau cazuri speciale, folosește logica bazată pe valoare (culori intense)
  if (categoryName === "Sold" || categoryName === "SOLD" || categoryName.toLowerCase().includes("sold")) {
    return value > 0 ? TEXT_CLASSES.POSITIVE : TEXT_CLASSES.NEGATIVE;
  }
  
  // Pentru categorii de venituri, folosește verde light
  if (categoryName === "VENITURI" || categoryName.toLowerCase().includes("venit")) {
    return TEXT_CLASSES.INCOME_LIGHT;
  }
  
  // Pentru investiții/savings, folosește albastru light
  if (categoryName === "INVESTITII" || categoryName.toLowerCase().includes("investit")) {
    return TEXT_CLASSES.SAVINGS_LIGHT;
  }
  
  // Pentru toate celelalte categorii (cheltuieli), folosește roșu light
  return TEXT_CLASSES.EXPENSE_LIGHT;
}
