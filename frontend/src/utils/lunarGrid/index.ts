/**
 * @module lunarGridUtils
 * @description Utilitare pentru gestionarea datelor în LunarGrid
 * @example
 * import { formatCurrency, calculateAmountsForCategory } from '@utils/lunarGrid';
 * 
 * // Formatare sumă
 * const formatted = formatCurrency(1234.56); // "1.234,56"
 * 
 * // Calcul sume pe categorii
 * const amounts = calculateAmountsForCategory('MÂNCARE', transactions);
 */

export * from './formatters';
export * from './calculations';
export * from './dataTransformers';

// Re-export types for convenience
export type { LunarGridRowData } from '../../components/features/LunarGrid/types';

// Barrel export pentru utilitățile LunarGrid
export * from './financialCalculations';
export * from './recurringTransactionGenerator';
