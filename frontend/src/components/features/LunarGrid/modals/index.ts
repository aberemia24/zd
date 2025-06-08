/**
 * LunarGrid Modals - Simplified Modal Architecture (V3 Refactor)
 *
 * POST-REFACTOR: Minimal Modal System
 * Simplified QuickAddModal conform LunarGrid Refactor V3
 */

// Simplified Modal Architecture - Keep Only Essential
export { QuickAddModalSimplified as QuickAddModal } from "./QuickAddModalSimplified";
export type { QuickAddModalProps, CellContext } from "./QuickAddModalSimplified";

// Transaction Modal (legacy - poate fi eliminat în viitor)
export { TransactionModal } from "./TransactionModal";
