import { useCallback, useEffect, useState } from "react";

/**
 * Simplified Keyboard Navigation Hook for LunarGrid - V3 Refactor
 * 
 * SIMPLIFIED FEATURES:
 * ✅ Arrow Keys Navigation: ↑↓←→ for cell movement
 * ✅ Enter/F2: Edit mode activation
 * ✅ Single Focus: Track one focused cell
 * ✅ Basic Click: Simple cell selection
 * 
 * REMOVED FEATURES (for simplicity):
 * ❌ Multi-selection (Ctrl+Click, Shift+Click)
 * ❌ Range selection algorithm
 * ❌ Delete/Backspace handling
 * ❌ Space bar selection toggle
 * ❌ Debug logging overhead
 * 
 * Target: 416 → ~120 lines (70% reduction)
 */

// Essential interface - simplified from original
export interface CellPosition {
  categoryIndex: number;
  day: number;
}

// Simplified options - removed complex callbacks
export interface KeyboardNavigationOptions {
  totalDays: number;
  totalRows: number;
  onFocusChange?: (position: CellPosition | null) => void;
  onEditMode?: (position: CellPosition) => void;
  isActive?: boolean;
}

export const useKeyboardNavigationSimplified = (options: KeyboardNavigationOptions) => {
  const {
    totalDays,
    totalRows,
    onFocusChange,
    onEditMode,
    isActive = true,
  } = options;

  // Single focus state - no complex multi-selection
  const [focusedPosition, setFocusedPosition] = useState<CellPosition | null>(null);

  // Simplified navigation calculation
  const getNextPosition = useCallback(
    (current: CellPosition, direction: "up" | "down" | "left" | "right"): CellPosition | null => {
      const { categoryIndex, day } = current;

      switch (direction) {
        case "up":
          return categoryIndex > 0 ? { categoryIndex: categoryIndex - 1, day } : null;
        
        case "down":
          return categoryIndex < totalRows - 1 ? { categoryIndex: categoryIndex + 1, day } : null;
        
        case "left":
          return day > 1 ? { categoryIndex, day: day - 1 } : null;
        
        case "right":
          return day < totalDays ? { categoryIndex, day: day + 1 } : null;
      }
      
      return null;
    },
    [totalRows, totalDays],
  );

  // Simplified keyboard handler - essential keys only
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive || !focusedPosition) return;

      let newPosition: CellPosition | null = null;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          newPosition = getNextPosition(focusedPosition, "up");
          break;

        case "ArrowDown":
          e.preventDefault();
          newPosition = getNextPosition(focusedPosition, "down");
          break;

        case "ArrowLeft":
          e.preventDefault();
          newPosition = getNextPosition(focusedPosition, "left");
          break;

        case "ArrowRight":
        case "Tab":
          e.preventDefault();
          newPosition = getNextPosition(focusedPosition, "right");
          break;

        case "Enter":
        case "F2":
          e.preventDefault();
          onEditMode?.(focusedPosition);
          break;

        case "Escape":
          e.preventDefault();
          setFocusedPosition(null);
          onFocusChange?.(null);
          break;
      }

      // Update focus if new position is valid
      if (newPosition) {
        setFocusedPosition(newPosition);
        onFocusChange?.(newPosition);
      }
    },
    [isActive, focusedPosition, getNextPosition, onFocusChange, onEditMode],
  );

  // Event listener registration
  useEffect(() => {
    if (isActive) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isActive, handleKeyDown]);

  // Simplified cell click - no complex modifiers
  const handleCellClick = useCallback(
    (position: CellPosition, modifiers?: { ctrlKey?: boolean; shiftKey?: boolean; metaKey?: boolean }) => {
      setFocusedPosition(position);
      onFocusChange?.(position);
    },
    [onFocusChange],
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
      return focusedPosition !== null &&
        focusedPosition.categoryIndex === position.categoryIndex &&
        focusedPosition.day === position.day;
    },
    [focusedPosition],
  );

  const isPositionSelected = useCallback(
    (position: CellPosition) => {
      // For simplicity, selected = focused
      return isPositionFocused(position);
    },
    [isPositionFocused],
  );

  // Simplified return interface
  return {
    // Core state
    focusedPosition,
    
    // Essential handlers
    handleCellClick,
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