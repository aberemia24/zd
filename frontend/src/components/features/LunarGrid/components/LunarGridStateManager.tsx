import React from 'react';
import { Table } from "@tanstack/react-table";

// Hooks și state management
import { useLunarGridState } from "../hooks/useLunarGridState";
import { useLunarGridTable, TransformedTableDataRow, TransactionMap } from "../hooks/useLunarGridTable";
import { useTransactionOperations } from "../hooks/useTransactionOperations";
import { useSubcategoryOperations } from "../hooks/useSubcategoryOperations";
import { useTableResize } from "../hooks/useTableResize";
import { useKeyboardNavigationSimplified, type CellPosition } from "../hooks/useKeyboardNavigationSimplified";
import { useMonthlyTransactions } from '../../../../services/hooks/useMonthlyTransactions';
import { useDeleteTransactionMonthly } from '../../../../services/hooks/transactionMutations';

// Stores
import { useCategoryStore } from "../../../../stores/categoryStore";
import { useAuthStore } from "../../../../stores/authStore";

// Types și constants
import { TransactionType } from "@budget-app/shared-constants";

// Interfaces pentru state result
interface PopoverState {
  isOpen: boolean;
  category: string;
  subcategory: string | undefined;
  day: number;
  amount: string;
  type: TransactionType;
  element: HTMLElement | null;
  anchorEl?: HTMLElement;
}

interface ModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  category: string;
  subcategory: string | undefined;
  day: number;
  year: number;
  month: number;
  existingValue?: string | number;
  transactionId?: string | null;
  anchorEl?: HTMLElement;
  position?: { top: number; left: number };
}

// HighlightedCell trebuie să fie consistent cu CellPosition pentru a evita erorile TypeScript
interface HighlightedCell extends CellPosition {
  // Extinde CellPosition care are categoryIndex, rowIndex, colIndex
  // Și adaugă proprietățile specifice:
  category: string;
  subcategory: string | undefined;
  day: number;
}

// Consolidated state result interface
export interface LunarGridStateResult {
  // Table data and loading states
  table: Table<TransformedTableDataRow>;
  transactionMap: TransactionMap;
  isLoading: boolean;
  error: Error | null;
  days: number[];
  dailyBalances: Record<number, number>;
  
  // Core editing states
  popover: PopoverState | null;
  setPopover: React.Dispatch<React.SetStateAction<PopoverState | null>>;
  modalState: ModalState | null;
  setModalState: React.Dispatch<React.SetStateAction<ModalState | null>>;
  highlightedCell: CellPosition | null;
  setHighlightedCell: React.Dispatch<React.SetStateAction<CellPosition | null>>;
  
  // Subcategory management states
  addingSubcategory: string | null;
  setAddingSubcategory: React.Dispatch<React.SetStateAction<string | null>>;
  newSubcategoryName: string;
  setNewSubcategoryName: React.Dispatch<React.SetStateAction<string>>;
  subcategoryAction: { type: 'edit' | 'delete'; category: string; subcategory: string } | null;
  editingSubcategoryName: string;
  setEditingSubcategoryName: React.Dispatch<React.SetStateAction<string>>;
  
  // Expanded rows state
  expandedRows: Record<string, boolean>;
  setExpandedRows: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  
  // Categories and auth
  categories: any[];
  user: any;
  
  // Business logic operations
  transactionOps: any;
  subcategoryOps: any;
  
  // Keyboard navigation
  isPositionSelected: (position: CellPosition) => boolean;
  isPositionFocused: (position: CellPosition) => boolean;
  navHandleCellClick: (position: CellPosition, modifiers?: { ctrlKey?: boolean; shiftKey?: boolean; metaKey?: boolean }) => void;
  
  // Table resize
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  
  // Helper functions from subcategory state
  cancelAddingSubcategory: () => void;
  startEditingSubcategory: (category: string, subcategory: string) => void;
  startDeletingSubcategory: (category: string, subcategory: string) => void;
  clearSubcategoryAction: () => void;
  
  // Refs for container management
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  scrollableContainerRef: React.RefObject<HTMLDivElement | null>;
}

// Props for the StateManager component
interface LunarGridStateManagerProps {
  year: number;
  month: number;
  expandedCategories: Record<string, boolean>;
  onCellClick?: (
    e: React.MouseEvent,
    category: string,
    subcategory: string | undefined,
    day: number,
    amount: string,
  ) => void;
  onCellDoubleClick?: (
    e: React.MouseEvent,
    category: string,
    subcategory: string | undefined,
    day: number,
    amount: string,
  ) => void;
  children: (state: LunarGridStateResult) => React.ReactNode;
}

/**
 * LunarGridStateManager - Centralized state management for LunarGrid
 * 
 * Responsibilities:
 * - Hook orchestration and coordination
 * - State synchronization between multiple hooks
 * - Business logic coordination
 * - Props distribution via render prop pattern
 * 
 * Uses render prop pattern to distribute state to consuming components
 */
const LunarGridStateManager: React.FC<LunarGridStateManagerProps> = ({
  year,
  month,
  expandedCategories,
  onCellClick,
  onCellDoubleClick,
  children,
}) => {
  // Store hooks
  const { categories } = useCategoryStore();
  const { user } = useAuthStore();

  // Direct state management pentru popover și modal (nu sunt în useLunarGridState)
  const [popover, setPopover] = React.useState<PopoverState | null>(null);
  const [modalState, setModalState] = React.useState<ModalState | null>(null);

  // Consolidated LunarGrid state (editing, subcategory, expanded rows)
  const {
    // Core editing states
    highlightedCell,
    setHighlightedCell,
    // Subcategory states
    addingSubcategory,
    setAddingSubcategory,
    newSubcategoryName,
    setNewSubcategoryName,
    subcategoryAction,
    editingSubcategoryName,
    setEditingSubcategoryName,
    cancelAddingSubcategory,
    startEditingSubcategory,
    startDeletingSubcategory,
    clearSubcategoryAction,
    // Expanded rows state
    expandedRows,
    setExpandedRows,
  } = useLunarGridState();

  // Monthly transactions hook
  const { transactions: validTransactions } = useMonthlyTransactions(year, month, user?.id, {
    includeAdjacentDays: true,
    refetchOnMount: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // Business logic operations hooks
  const transactionOps = useTransactionOperations({ year, month, userId: user?.id });
  const subcategoryOps = useSubcategoryOperations({
    year,
    month,
    userId: user?.id,
    newSubcategoryName,
    setNewSubcategoryName,
    setAddingSubcategory,
    clearSubcategoryAction,
  });

  // Table data hook
  const { 
    table, 
    isLoading, 
    error, 
    days, 
    dailyBalances, 
    tableContainerRef, 
    transactionMap 
  } = useLunarGridTable(year, month, expandedRows, onCellClick, onCellDoubleClick);

  // Table resize hook
  const { isFullscreen: tableIsFullscreen, toggleFullscreen } = useTableResize();

  // Navigation rows preparation for keyboard navigation
  const navigationRows = React.useMemo(() => {
    return table.getRowModel().rows.map(row => ({
      category: row.original.category,
      subcategory: row.original.subcategory,
      isExpanded: row.getIsExpanded(),
    }));
  }, [table]);

  // Bulk delete mutation for keyboard navigation
  const deleteTransactionMutation = useDeleteTransactionMonthly(year, month, user?.id);

  // Simplified keyboard navigation hook
  const {
    handleCellClick: navHandleCellClick,
    isPositionSelected,
    isPositionFocused,
  } = useKeyboardNavigationSimplified({
    totalDays: days.length,
    totalRows: navigationRows.length,
    isActive: !modalState?.isOpen && !popover?.isOpen,
    onEditMode: (position: CellPosition) => {
      // TODO: Implement edit mode trigger for focused positions
      
    },
  });

  // Internal scrollable container ref (generated within state manager)
  const scrollableContainerRef = React.useRef<HTMLDivElement>(null);

  // Consolidated state result object
  const stateResult: LunarGridStateResult = {
    // Table data and loading states
    table,
    transactionMap,
    isLoading,
    error,
    days,
    dailyBalances,
    
    // Core editing states
    popover,
    setPopover,
    modalState,
    setModalState,
    highlightedCell,
    setHighlightedCell,
    
    // Subcategory management states
    addingSubcategory,
    setAddingSubcategory,
    newSubcategoryName,
    setNewSubcategoryName,
    subcategoryAction,
    editingSubcategoryName,
    setEditingSubcategoryName,
    
    // Expanded rows state
    expandedRows,
    setExpandedRows,
    
    // Categories and auth
    categories,
    user,
    
    // Business logic operations
    transactionOps,
    subcategoryOps,
    
    // Keyboard navigation
    isPositionSelected: (position: CellPosition) => Boolean(isPositionSelected(position)),
    isPositionFocused: (position: CellPosition) => Boolean(isPositionFocused(position)),
    navHandleCellClick,
    
    // Table resize
    isFullscreen: tableIsFullscreen,
    toggleFullscreen,
    
    // Helper functions from subcategory state
    cancelAddingSubcategory,
    startEditingSubcategory,
    startDeletingSubcategory,
    clearSubcategoryAction,
    
    // Refs for container management
    tableContainerRef,
    scrollableContainerRef,
  };

  // Return state via render prop pattern
  return <>{children(stateResult)}</>;
};

LunarGridStateManager.displayName = 'LunarGridStateManager';

export default LunarGridStateManager;
export type { LunarGridStateManagerProps }; 