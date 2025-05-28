/**
 * Inline Editing System pentru LunarGrid
 * Phase 1 - Core Infrastructure
 */

// Core hooks
export { useInlineCellEdit } from "./useInlineCellEdit";
export type {
  UseInlineCellEditProps,
  UseInlineCellEditReturn,
} from "./useInlineCellEdit";

export { useGridNavigation } from "./useGridNavigation";
export type {
  GridPosition,
  UseGridNavigationProps,
  UseGridNavigationReturn,
} from "./useGridNavigation";

export {
  usePerformanceOptimization,
  withPerformanceOptimization,
} from "./usePerformanceOptimization";
export type {
  UsePerformanceOptimizationProps,
  UsePerformanceOptimizationReturn,
} from "./usePerformanceOptimization";

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

// Transition components
export {
  LunarGridTransition,
  useLunarGridTransition,
} from "./LunarGridTransition";
export type { LunarGridTransitionProps } from "./LunarGridTransition";
