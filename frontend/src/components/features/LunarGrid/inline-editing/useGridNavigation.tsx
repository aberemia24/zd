import { useState, useCallback, useEffect, RefObject } from 'react';

/**
 * Hook pentru gestionarea navigării Excel-like în LunarGrid
 * Implementează Phase 1 din Progressive Enhancement Navigation (Creative Phase)
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
  isEnabled?: boolean;
}

export interface UseGridNavigationReturn {
  // State
  currentCell: GridPosition | null;
  focusedCell: GridPosition;
  isNavigating: boolean;
  
  // Actions
  focusCell: (row: number, col: number) => void;
  moveFocus: (direction: 'up' | 'down' | 'left' | 'right') => void;
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
  isEnabled = true
}: UseGridNavigationProps): UseGridNavigationReturn => {
  // State pentru poziția curentă focusată
  const [focusedCell, setFocusedCell] = useState<GridPosition>({ row: 0, col: 0 });
  const [currentCell, setCurrentCell] = useState<GridPosition | null>(null);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  
  // Focus a specific cell (pentru teste)
  const focusCell = useCallback((row: number, col: number) => {
    if (!isEnabled) return;
    
    const position = { row, col };
    setFocusedCell(position);
    setCurrentCell(position);
    setIsNavigating(true);
    onCellFocus(row, col);
    
    // Simulate DOM focus pentru teste
    setTimeout(() => setIsNavigating(false), 10);
  }, [onCellFocus, isEnabled]);

  // Move focus în direcția specificată
  const moveFocus = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!isEnabled) return;
    
    setIsNavigating(true);
    
    setFocusedCell(prev => {
      const next = { ...prev };
      
      switch (direction) {
        case 'up':
          next.row = Math.max(0, prev.row - 1);
          break;
        case 'down':
          next.row = Math.min(totalRows - 1, prev.row + 1);
          break;
        case 'left':
          next.col = Math.max(0, prev.col - 1);
          break;
        case 'right':
          next.col = Math.min(totalCols - 1, prev.col + 1);
          break;
      }
      
      // Notify parent despre focus change
      if (next.row !== prev.row || next.col !== prev.col) {
        setCurrentCell(next);
        onCellFocus(next.row, next.col);
      }
      
      return next;
    });
    
    setTimeout(() => setIsNavigating(false), 10);
  }, [totalRows, totalCols, onCellFocus, isEnabled]);
  
  // Start edit pentru celula curent focusată
  const startEdit = useCallback(() => {
    if (!isEnabled) return;
    onCellEdit(focusedCell.row, focusedCell.col);
  }, [focusedCell, onCellEdit, isEnabled]);
  
  // Handle Tab navigation (move to next cell, wrap to next row)
  const handleTabNavigation = useCallback((shiftKey: boolean) => {
    if (!isEnabled) return;
    
    setFocusedCell(prev => {
      let nextRow = prev.row;
      let nextCol = prev.col;
      
      if (shiftKey) {
        // Shift+Tab: move backwards
        nextCol--;
        if (nextCol < 0) {
          nextCol = totalCols - 1;
          nextRow = Math.max(0, nextRow - 1);
        }
      } else {
        // Tab: move forwards
        nextCol++;
        if (nextCol >= totalCols) {
          nextCol = 0;
          nextRow = Math.min(totalRows - 1, nextRow + 1);
        }
      }
      
      const next = { row: nextRow, col: nextCol };
      
      // Notify parent despre focus change
      if (next.row !== prev.row || next.col !== prev.col) {
        onCellFocus(next.row, next.col);
      }
      
      return next;
    });
  }, [totalRows, totalCols, onCellFocus, isEnabled]);
  
  // Keyboard event handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isEnabled) return;
    
    // Check if gridRef exists and contains target, or if we're in test environment
    if (gridRef && gridRef.current) {
      const isInGrid = gridRef.current.contains(e.target as Node);
      if (!isInGrid) return;
    }
    
    // Prevent default pentru navigation keys
    const navigationKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'F2'];
    if (navigationKeys.includes(e.key)) {
      e.preventDefault();
    }
    
    switch (e.key) {
      case 'ArrowUp':
        moveFocus('up');
        break;
        
      case 'ArrowDown':
        moveFocus('down');
        break;
        
      case 'ArrowLeft':
        moveFocus('left');
        break;
        
      case 'ArrowRight':
        moveFocus('right');
        break;
        
      case 'Tab':
        handleTabNavigation(e.shiftKey);
        break;
        
      case 'Enter':
      case 'F2':
        startEdit();
        break;
        
      case 'Escape':
        // Clear focus sau exit edit mode
        // Handled by individual cells
        break;
    }
  }, [moveFocus, handleTabNavigation, startEdit, isEnabled, gridRef]);
  
  // Handle cell click pentru focus
  const handleCellClick = useCallback((row: number, col: number) => {
    if (!isEnabled) return;
    
    setFocusedCell({ row, col });
    onCellFocus(row, col);
  }, [onCellFocus, isEnabled]);
  
  // Attach keyboard event listener
  useEffect(() => {
    if (!isEnabled) return;
    
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      handleKeyDown(e);
    };
    
    // Attach la document pentru a prinde toate key events
    document.addEventListener('keydown', handleGlobalKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleKeyDown, isEnabled]);
  
  // Update focused cell când grid dimensions se schimbă
  useEffect(() => {
    setFocusedCell(prev => ({
      row: Math.min(prev.row, Math.max(0, totalRows - 1)),
      col: Math.min(prev.col, Math.max(0, totalCols - 1))
    }));
  }, [totalRows, totalCols]);
  
  return {
    // State
    currentCell,
    focusedCell,
    isNavigating,
    
    // Actions
    focusCell,
    moveFocus,
    setFocusedCell,
    startEdit,
    
    // Event handlers
    handleKeyDown,
    handleCellClick
  };
}; 