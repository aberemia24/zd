import { TransactionType } from '@budget-app/shared-constants';
import type { CurrencyConfig } from '../../types/financial'; // Assuming CurrencyConfig is in financial.tsx types

// =============================================================================
// CURRENCY CONFIGURATION
// =============================================================================

export const RON_CURRENCY: CurrencyConfig = {
  code: 'RON',
  symbol: 'lei',
  locale: 'ro-RO',
  decimalPlaces: 2,
  thousandsSeparator: '.', // Standard for ro-RO locale with Intl.NumberFormat
  decimalSeparator: ',',   // Standard for ro-RO locale with Intl.NumberFormat
};

// =============================================================================
// CURRENCY FORMATTING
// =============================================================================

/**
 * Formatează o sumă în lei românești cu separatorii corecți
 */
export function formatCurrencyRON(amount: number): string {
  return new Intl.NumberFormat(RON_CURRENCY.locale, {
    style: 'currency',
    currency: RON_CURRENCY.code,
    minimumFractionDigits: RON_CURRENCY.decimalPlaces,
    maximumFractionDigits: RON_CURRENCY.decimalPlaces,
  }).format(amount);
}

/**
 * Formatează sumă numerică cu separatori pentru RON (fără simbolul monetar)
 */
export function formatAmountRON(amount: number): string {
  return new Intl.NumberFormat(RON_CURRENCY.locale, {
    minimumFractionDigits: RON_CURRENCY.decimalPlaces,
    maximumFractionDigits: RON_CURRENCY.decimalPlaces,
  }).format(amount);
}

/**
 * Parsează string cu valută RON în număr
 */
export function parseCurrencyRON(value: string): number {
  // Elimină simboluri monetare și spații non-numerice, păstrând semnul, cifrele, virgula și punctul
  const cleanValue = value
    .replace(new RegExp(`[^\\d\\${RON_CURRENCY.decimalSeparator}\\${RON_CURRENCY.thousandsSeparator}-]`, 'g'), '') 
    .replace(new RegExp(`\\${RON_CURRENCY.thousandsSeparator}`, 'g'), '') // Elimină separatorul de mii
    .replace(RON_CURRENCY.decimalSeparator, '.'); // Înlocuiește separatorul zecimal cu punct pentru parseFloat
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formatează sumă cu culoare bazată pe tip (verde pentru venit, roșu pentru cheltuială)
 */
export function formatAmountWithColor(amount: number, type: TransactionType): {
  formatted: string;
  color: string;
  bgColor: string;
} {
  const isIncome = type === TransactionType.INCOME;
  
  return {
    formatted: formatCurrencyRON(Math.abs(amount)),
    color: isIncome ? 'text-success-600' : 'text-error-600',
    bgColor: isIncome ? 'bg-success-50' : 'bg-error-50',
  };
}

// =============================================================================
// DATE FORMATTING
// =============================================================================

/**
 * Formatează data pentru afișare în tabel (format românesc)
 */
export function formatDateRON(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Formatează data și ora pentru afișare detaliată
 */
export function formatDateTimeRON(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Obține numele lunii în română
 */
export function getMonthNameRON(monthIndex: number): string {
  // Asigură-te că monthIndex este valid (0-11)
  if (monthIndex < 0 || monthIndex > 11) {
    // Poți arunca o eroare sau returna un string gol/default
    console.warn(`Invalid month index: ${monthIndex}`);
    return ''; 
  }
  const date = new Date(2000, monthIndex, 1); // An și zi arbitrare, doar luna contează
  return new Intl.DateTimeFormat('ro-RO', { month: 'long' }).format(date);
}
