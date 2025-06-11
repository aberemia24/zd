import { useCallback, useEffect, useState } from "react";
import React from "react";

/**
 * Simplified Keyboard Navigation Hook for LunarGrid - V3 Refactor
 * 
 * SIMPLIFIED FEATURES:
 * ✅ Arrow Keys Navigation: ↑↓←→ for cell movement
 * ✅ Enter/F2: Edit mode activation
 * ✅ Single Focus: Track one focused cell
 * ✅ Single Click: Simple cell selection
 * ✅ Double Click: Inline editing (Excel-like)
 * ✅ Delete/Backspace: Single cell deletion
 * 
 * REMOVED FEATURES (for simplicity):
 * ❌ Multi-selection (Ctrl+Click, Shift+Click)
 * ❌ Range selection algorithm
 * ❌ Space bar selection toggle
 * ❌ Debug logging overhead
 * 
 * Target: 416 → ~120 lines (70% reduction)
 */

// Essential interface - simplified from original
export interface CellPosition {
  categoryIndex: number;
  day: number;
  category: string;
  subcategory?: string;
  rowIndex: number;
  colIndex: number;
}

// Legacy interface compatibility (for backward compatibility with Row/Table components)
// REMOVED: CellPositionComplex is no longer needed after unifying CellPosition types.

// Simplified options - removed complex callbacks
export interface KeyboardNavigationOptions {
  totalDays: number;
  totalRows: number;
  rows?: Array<{
    category: string;
    subcategory?: string;
    isExpanded?: boolean;
  }>;
  onFocusChange?: (position: CellPosition | null) => void;
  onEditMode?: (position: CellPosition) => void;
  onDeleteRequest?: (positions: CellPosition[]) => void;
  isActive?: boolean;
}

export const useKeyboardNavigationSimplified = (options: KeyboardNavigationOptions) => {
  const {
    totalDays,
    totalRows,
    rows,
    onFocusChange,
    onEditMode,
    onDeleteRequest,
    isActive = true,
  } = options;

  console.log('⚙️ [KeyboardNav] isActive:', isActive); // Log isActive at start

  // Stări separate pentru focus și selecție
  const [focusedPosition, setFocusedPosition] = useState<CellPosition | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<CellPosition[]>([]);
  const focusedPositionRef = React.useRef(focusedPosition); // Ref to hold latest focusedPosition

  // Update ref whenever focusedPosition changes
  useEffect(() => {
    focusedPositionRef.current = focusedPosition;
    console.log('🔄 [KeyboardNav] focusedPosition updated:', focusedPosition);
  }, [focusedPosition]);

  // Simplified navigation calculation
  const getNextPosition = useCallback(
    (current: CellPosition, direction: "up" | "down" | "left" | "right"): CellPosition | null => {
      const { categoryIndex, day } = current;

      let nextCategoryIndex = categoryIndex;
      let nextDay = day;

      switch (direction) {
        case "up":
          nextCategoryIndex = categoryIndex > 0 ? categoryIndex - 1 : 0; // Ensure not less than 0
          break;
        
        case "down":
          nextCategoryIndex = categoryIndex < totalRows - 1 ? categoryIndex + 1 : totalRows - 1; // Ensure not greater than totalRows - 1
          break;
        
        case "left":
          nextDay = day > 1 ? day - 1 : 1; // Ensure not less than 1
          break;
        
        case "right":
          nextDay = day < totalDays ? day + 1 : totalDays; // Ensure not greater than totalDays
          break;
      }
      
      // Retrieve category and subcategory from rows array for the new position
      if (rows && nextCategoryIndex >= 0 && nextCategoryIndex < totalRows &&
          nextDay >= 1 && nextDay <= totalDays) {
        const rowData = rows[nextCategoryIndex];
        if (rowData) {
          const newPosition = {
            categoryIndex: nextCategoryIndex,
            day: nextDay,
            category: rowData.category,
            subcategory: rowData.subcategory,
            rowIndex: nextCategoryIndex,
            colIndex: nextDay - 1,
          };
          return newPosition;
        }
      }
      return null;
    },
    [totalRows, totalDays, rows],
  );

  // Simplified keyboard handler - essential keys only
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive || !focusedPositionRef.current) return;

      let newPosition: CellPosition | null = null;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          newPosition = getNextPosition(focusedPositionRef.current, "up");
          break;

        case "ArrowDown":
          e.preventDefault();
          newPosition = getNextPosition(focusedPositionRef.current, "down");
          break;

        case "ArrowLeft":
          e.preventDefault();
          newPosition = getNextPosition(focusedPositionRef.current, "left");
          break;

        case "ArrowRight":
        case "Tab":
          e.preventDefault();
          newPosition = getNextPosition(focusedPositionRef.current, "right");
          break;

        case "Enter":
        case "F2":
          e.preventDefault();
          onEditMode?.(focusedPositionRef.current);
          break;

        case "Escape":
          e.preventDefault();
          setFocusedPosition(null);
          onFocusChange?.(null);
          break;

        case "Delete":
        case "Backspace":
          e.preventDefault();
          if (focusedPositionRef.current && onDeleteRequest) {
            onDeleteRequest([focusedPositionRef.current]);
          }
          break;
      }

      // Update focus if new position is valid
      if (newPosition) {
        setFocusedPosition(newPosition);
        onFocusChange?.(newPosition);
      }
    },
    [isActive, getNextPosition, onFocusChange, onEditMode, onDeleteRequest],
  );

  // Event listener registration
  useEffect(() => {
    if (isActive) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isActive, handleKeyDown]);

  // Click pe celulă: setează focusul ȘI selecția
  const handleCellClick = useCallback(
    (position: CellPosition, modifiers?: { ctrlKey?: boolean; shiftKey?: boolean; metaKey?: boolean }) => {
      setFocusedPosition(position);
      setSelectedPositions([position]); // La un click simplu, resetăm selecția la celula curentă
      onFocusChange?.(position);
    },
    [onFocusChange],
  );

  // Double-click handler for inline editing (Excel-like)
  const handleCellDoubleClick = useCallback(
    (position: CellPosition) => {
      setFocusedPosition(position);
      onFocusChange?.(position);
      onEditMode?.(position);
    },
    [onFocusChange, onEditMode],
  );

  // Direct focus setter
  const setFocus = useCallback(
    (position: CellPosition | null) => {
      setFocusedPosition(position);
      onFocusChange?.(position);
    },
    [onFocusChange],
  );

  // Simple position check helpers
  const isPositionFocused = useCallback(
    (position: CellPosition) => {
      const isFocused = focusedPosition !== null &&
        focusedPosition.categoryIndex === position.categoryIndex &&
        focusedPosition.day === position.day &&
        focusedPosition.category === position.category &&
        focusedPosition.subcategory === position.subcategory;
      return isFocused;
    },
    [focusedPosition],
  );

  const isPositionSelected = useCallback(
    (position: CellPosition) => {
      return selectedPositions.some(p => 
        p.categoryIndex === position.categoryIndex &&
        p.day === position.day &&
        p.category === position.category &&
        p.subcategory === position.subcategory
      );
    },
    [selectedPositions],
  );

  // Simplified return interface
  return {
    // Core state
    focusedPosition,
    
    // Essential handlers
    handleCellClick,
    handleCellDoubleClick,
    handleKeyDown,
    
    // Utilities
    setFocus,
    isPositionFocused,
    isPositionSelected,
    
    // Navigation helper
    getNextPosition,
  };
};

export default useKeyboardNavigationSimplified; 