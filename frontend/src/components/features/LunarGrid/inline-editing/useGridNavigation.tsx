import { useState, useCallback, useEffect, RefObject } from "react";

/**
 * SIMPLIFIED Hook pentru gestionarea navigării Excel-like în LunarGrid
 * Redus de la 346 linii la ~80 linii - păstrează doar esențialul
 * 
 * KEPT: Arrow keys, Enter/F2 edit, basic focus management
 * REMOVED: Tab cycling, complex ARIA, focus trap, navigation tracking, performance optimizations
 */

export interface GridPosition {
  row: number;
  col: number;
}

export interface UseGridNavigationProps {
  gridRef: RefObject<HTMLDivElement>;
  totalRows: number;
  totalCols: number;
  onCellFocus: (row: number, col: number) => void;
  onCellEdit: (row: number, col: number) => void;
  onNavigate?: (params: {
    from: GridPosition;
    to: GridPosition;
    direction: string;
    key: string;
  }) => void;
  isEnabled?: boolean;
}

export interface UseGridNavigationReturn {
  // State
  currentCell: GridPosition | null;
  focusedCell: GridPosition;
  isNavigating: boolean;

  // Actions
  focusCell: (row: number, col: number) => void;
  moveFocus: (direction: "up" | "down" | "left" | "right") => void;
  setFocusedCell: (position: GridPosition) => void;
  startEdit: () => void;

  // Event handlers
  handleKeyDown: (e: KeyboardEvent) => void;
  handleCellClick: (row: number, col: number) => void;
}

export const useGridNavigation = ({
  gridRef,
  totalRows,
  totalCols,
  onCellFocus,
  onCellEdit,
  onNavigate,
  isEnabled = true,
}: UseGridNavigationProps): UseGridNavigationReturn => {
  // Basic state management
  const [focusedCell, setFocusedCell] = useState<GridPosition>({ row: 0, col: 0 });
  const [currentCell, setCurrentCell] = useState<GridPosition | null>(null);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // SIMPLIFIED: Focus a specific cell
  const focusCell = useCallback((row: number, col: number) => {
    if (!isEnabled) return;
    const position = { row, col };
    setFocusedCell(position);
    setCurrentCell(position);
    onCellFocus(row, col);
  }, [onCellFocus, isEnabled]);

  // SIMPLIFIED: Move focus with boundary checking
  const moveFocus = useCallback((direction: "up" | "down" | "left" | "right") => {
    if (!isEnabled) return;
    
    setFocusedCell((prev) => {
      const next = { ...prev };
      
      switch (direction) {
        case "up": next.row = Math.max(0, prev.row - 1); break;
        case "down": next.row = Math.min(totalRows - 1, prev.row + 1); break;
        case "left": next.col = Math.max(0, prev.col - 1); break;
        case "right": next.col = Math.min(totalCols - 1, prev.col + 1); break;
      }
      
      // Update focus if position changed
      if (next.row !== prev.row || next.col !== prev.col) {
        setCurrentCell(next);
        onCellFocus(next.row, next.col);
        
        // Simple navigation callback (simplified)
        onNavigate?.({ from: prev, to: next, direction, key: `Arrow${direction}` });
      }
      
      return next;
    });
  }, [totalRows, totalCols, onCellFocus, onNavigate, isEnabled]);

  // SIMPLIFIED: Start edit for current focused cell
  const startEdit = useCallback(() => {
    if (!isEnabled) return;
    onCellEdit(focusedCell.row, focusedCell.col);
  }, [focusedCell, onCellEdit, isEnabled]);

  // SIMPLIFIED: Handle keyboard events (essential keys only)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isEnabled) return;
    
    switch (e.key) {
      case "ArrowUp": e.preventDefault(); moveFocus("up"); break;
      case "ArrowDown": e.preventDefault(); moveFocus("down"); break;
      case "ArrowLeft": e.preventDefault(); moveFocus("left"); break;
      case "ArrowRight": e.preventDefault(); moveFocus("right"); break;
      case "Enter":
      case "F2": e.preventDefault(); startEdit(); break;
    }
  }, [moveFocus, startEdit, isEnabled]);

  // SIMPLIFIED: Handle cell click
  const handleCellClick = useCallback((row: number, col: number) => {
    if (!isEnabled) return;
    focusCell(row, col);
  }, [focusCell, isEnabled]);

  // SIMPLIFIED: Event listener setup
  useEffect(() => {
    if (!isEnabled) return;
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, isEnabled]);

  return {
    currentCell,
    focusedCell,
    isNavigating,
    focusCell,
    moveFocus,
    setFocusedCell,
    startEdit,
    handleKeyDown,
    handleCellClick,
  };
}; 