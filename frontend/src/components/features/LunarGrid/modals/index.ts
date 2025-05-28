/**
 * LunarGrid Modals - Simplified Modal Architecture
 *
 * POST-REFACTOR: Minimal Modal System
 * Doar QuickAddModal păstrat conform PRD LunarGrid Plan Shift
 */

// Simplified Modal Architecture - Keep Only Essential
export { QuickAddModal } from "./QuickAddModal";
export type { QuickAddModalProps } from "./QuickAddModal";

// Base Modal Logic Hooks (for QuickAddModal support)
export { useBaseModalLogic } from "./hooks/useBaseModalLogic";
export type { CellContext } from "./hooks/useBaseModalLogic";

// Demo Modal (pentru development reference) - REMOVED: file not found

// Transaction Modal (legacy - poate fi eliminat în viitor)
export { TransactionModal } from "./TransactionModal";
