/**
 * Barrel file pentru hooks
 * 
 * Exportă toate hook-urile personalizate din aplicație pentru un import mai ușor
 */

// Re-export hooks existente pentru UI
import useThemeEffects, { type UseThemeEffectsResult } from './useThemeEffects';

// Hooks pentru optimizare performanță
export { default as usePrefetchRoutes } from './usePrefetchRoutes';

// Hooks pentru efecte UI
export { 
  useThemeEffects,
  // Tipuri
  type UseThemeEffectsResult
};

// Adăugați aici alte re-exporturi pe măsură ce creați hook-uri
