/**
 * Barrel file pentru hooks
 *
 * Exportă toate hook-urile personalizate din aplicație pentru un import mai ușor
 */

// Event handling hooks
export { useFocusManager } from "./shared/useFocusManager";
export { useKeyboardHandler } from "./shared/useKeyboardHandler";

// Hooks pentru optimizare performanță
export { useUnifiedExport } from "./shared/useUnifiedExport"; // Modern unified implementation
export { useExport } from "./useExport"; // Legacy compatibility wrapper
export { useNavigationState } from './useNavigationState';
export { usePrefetchRoutes } from "./usePrefetchRoutes";
export { useURLFilters } from "./useURLFilters";

// Adăugați aici alte re-exporturi pe măsură ce creați hook-uri
