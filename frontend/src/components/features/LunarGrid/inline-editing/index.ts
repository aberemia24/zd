/**
 * Inline Editing System pentru LunarGrid
 * Phase 1 - Core Infrastructure
 * Task 2 - Consolidated Cell Editing Interface
 */

// 🎯 NEW: Consolidated cell editing hook (Task 2)
export { useCellEditing } from "./useCellEditing";
export type {
  UseCellEditingProps,
  UseCellEditingReturn,
} from "./useCellEditing";

// 🔄 LEGACY: Original hooks (will be deprecated in favor of useCellEditing)
export { useInlineCellEdit } from "./useInlineCellEdit";
export type {
  UseInlineCellEditProps,
  UseInlineCellEditReturn,
} from "./useInlineCellEdit";

export { useCellState } from "./useCellState";
export type {
  CellState,
  InteractionState,
  CellStateConfig,
  CellStateReturn,
} from "./useCellState";

export { useGridNavigation } from "./useGridNavigation";
export type {
  GridPosition,
  UseGridNavigationProps,
  UseGridNavigationReturn,
} from "./useGridNavigation";

// Components
export { EditableCell } from "./EditableCell";
export type { EditableCellProps } from "./EditableCell";

export {
  LunarGridInlineIntegration,
  useLunarGridInlineIntegration,
} from "./LunarGridInlineIntegration";
export type {
  LunarGridCellData,
  LunarGridInlineIntegrationProps,
} from "./LunarGridInlineIntegration";
