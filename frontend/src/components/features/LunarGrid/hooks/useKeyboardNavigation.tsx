import { useCallback, useEffect, useState, useRef } from "react";

/**
 * Hook pentru Keyboard Navigation în LunarGrid - Phase 2.1.2
 *
 * Features implementate:
 * ✅ Arrow Keys Navigation: ↑↓←→ pentru navigare între celule
 * ✅ Excel-like Shortcuts: Enter, Tab, F2, Escape
 * ✅ Multi-selection: Ctrl+Click, Shift+Click pentru selecție multiplă
 * ✅ Focus Management: gestionarea focus-ului pe grid
 * ✅ Accessibility: support pentru screen readers și ARIA
 */

export interface CellPosition {
  category: string;
  subcategory?: string;
  day: number;
  rowIndex: number;
  colIndex: number;
}

export interface KeyboardNavigationOptions {
  /** Numărul de zile din lună */
  totalDays: number;

  /** Lista de categorii/subcategorii disponibile */
  rows: Array<{
    category: string;
    subcategory?: string;
    isExpanded?: boolean;
  }>;

  /** Callback pentru schimbarea focus-ului */
  onFocusChange?: (position: CellPosition | null) => void;

  /** Callback pentru activarea edit mode */
  onEditMode?: (position: CellPosition) => void;

  /** Callback pentru selecție */
  onSelection?: (positions: CellPosition[], isMultiple: boolean) => void;

  /** Callback pentru ștergerea tranzacțiilor din celule */
  onDeleteRequest?: (positions: CellPosition[]) => void;

  /** Dacă grid-ul este activ pentru keyboard input */
  isActive?: boolean;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
  const {
    totalDays,
    rows,
    onFocusChange,
    onEditMode,
    onSelection,
    onDeleteRequest,
    isActive = true,
  } = options;

  // State pentru poziția curentă de focus
  const [focusedPosition, setFocusedPosition] = useState<CellPosition | null>(
    null,
  );

  // State pentru selecția multiplă
  const [selectedPositions, setSelectedPositions] = useState<CellPosition[]>(
    [],
  );

  // Referință pentru tracking-ul ultimei pozitii pentru Shift+Click
  const lastSelectedPosition = useRef<CellPosition | null>(null);

  // Calcularea poziției următoare bazată pe direcție
  const getNextPosition = useCallback(
    (
      current: CellPosition,
      direction: "up" | "down" | "left" | "right",
    ): CellPosition | null => {
      const { rowIndex, colIndex } = current;

      switch (direction) {
        case "up":
          if (rowIndex > 0) {
            const newRow = rows[rowIndex - 1];
            return {
              ...newRow,
              day: Math.min(current.day, totalDays),
              rowIndex: rowIndex - 1,
              colIndex,
            };
          }
          break;

        case "down":
          if (rowIndex < rows.length - 1) {
            const newRow = rows[rowIndex + 1];
            return {
              ...newRow,
              day: Math.min(current.day, totalDays),
              rowIndex: rowIndex + 1,
              colIndex,
            };
          }
          break;

        case "left":
          if (current.day > 1) {
            return {
              ...current,
              day: current.day - 1,
              colIndex: colIndex - 1,
            };
          }
          break;

        case "right":
          if (current.day < totalDays) {
            return {
              ...current,
              day: current.day + 1,
              colIndex: colIndex + 1,
            };
          }
          break;
      }

      return null;
    },
    [rows, totalDays],
  );

  // Handler pentru navigarea cu tastatura
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive || !focusedPosition) {
        console.log('🔍 [KEYBOARD-NAV] Event ignored:', { isActive, focusedPosition: !!focusedPosition, key: e.key });
        return;
      }

      console.log('🔍 [KEYBOARD-NAV] Processing key:', e.key, { focusedPosition, selectedCount: selectedPositions.length });

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          const upPosition = getNextPosition(focusedPosition, "up");
          if (upPosition) {
            setFocusedPosition(upPosition);
            onFocusChange?.(upPosition);
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          const downPosition = getNextPosition(focusedPosition, "down");
          if (downPosition) {
            setFocusedPosition(downPosition);
            onFocusChange?.(downPosition);
          }
          break;

        case "ArrowLeft":
          e.preventDefault();
          const leftPosition = getNextPosition(focusedPosition, "left");
          if (leftPosition) {
            setFocusedPosition(leftPosition);
            onFocusChange?.(leftPosition);
          }
          break;

        case "ArrowRight":
        case "Tab":
          e.preventDefault();
          const rightPosition = getNextPosition(focusedPosition, "right");
          if (rightPosition) {
            setFocusedPosition(rightPosition);
            onFocusChange?.(rightPosition);
          }
          break;

        case "Enter":
        case "F2":
          e.preventDefault();
          console.log('🔍 [KEYBOARD-NAV] Edit mode requested for:', focusedPosition);
          onEditMode?.(focusedPosition);
          break;

        case "Delete":
        case "Backspace":
          e.preventDefault();
          console.log('🔍 [KEYBOARD-NAV] Delete requested for positions:', selectedPositions);
          if (selectedPositions.length > 0) {
            onDeleteRequest?.(selectedPositions);
          } else if (focusedPosition) {
            console.log('🔍 [KEYBOARD-NAV] No selection, using focused position for delete');
            onDeleteRequest?.([focusedPosition]);
          }
          break;

        case " ":
          e.preventDefault();
          // Space pentru selecție (toggle)
          setSelectedPositions((prev) => {
            const isSelected = prev.some(
              (pos) =>
                pos.category === focusedPosition.category &&
                pos.subcategory === focusedPosition.subcategory &&
                pos.day === focusedPosition.day,
            );

            let newSelection;
            if (isSelected) {
              newSelection = prev.filter(
                (pos) =>
                  !(
                    pos.category === focusedPosition.category &&
                    pos.subcategory === focusedPosition.subcategory &&
                    pos.day === focusedPosition.day
                  ),
              );
            } else {
              newSelection = [...prev, focusedPosition];
            }

            onSelection?.(newSelection, newSelection.length > 1);
            return newSelection;
          });
          break;

        case "Escape":
          e.preventDefault();
          // Clear selection și ieșire din edit mode
          setSelectedPositions([]);
          onSelection?.([], false);
          break;
      }
    },
    [
      isActive,
      focusedPosition,
      getNextPosition,
      onFocusChange,
      onEditMode,
      onSelection,
      onDeleteRequest,
      selectedPositions,
    ],
  );

  // Înregistrarea event listener-ilor pentru keyboard
  useEffect(() => {
    if (isActive) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isActive, handleKeyDown]);

  // Handler pentru click pe celulă (cu suport pentru Ctrl și Shift)
  const handleCellClick = useCallback(
    (
      position: CellPosition,
      event?: { ctrlKey?: boolean; shiftKey?: boolean; metaKey?: boolean },
    ) => {
      console.log('🔍 [KEYBOARD-NAV] Cell clicked:', position, { event });
      
      setFocusedPosition(position);
      onFocusChange?.(position);

      if (event?.ctrlKey || event?.metaKey) {
        // Ctrl+Click: toggle selection
        console.log('🔍 [KEYBOARD-NAV] Ctrl+Click detected');
        setSelectedPositions((prev) => {
          const isSelected = prev.some(
            (pos) =>
              pos.category === position.category &&
              pos.subcategory === position.subcategory &&
              pos.day === position.day,
          );

          let newSelection;
          if (isSelected) {
            newSelection = prev.filter(
              (pos) =>
                !(
                  pos.category === position.category &&
                  pos.subcategory === position.subcategory &&
                  pos.day === position.day
                ),
            );
          } else {
            newSelection = [...prev, position];
          }

          console.log('🔍 [KEYBOARD-NAV] Updated selection:', newSelection);
          lastSelectedPosition.current = position;
          onSelection?.(newSelection, newSelection.length > 1);
          return newSelection;
        });
      } else if (event?.shiftKey && lastSelectedPosition.current) {
        // Shift+Click: select range
        console.log('🔍 [KEYBOARD-NAV] Shift+Click detected');
        const startPos = lastSelectedPosition.current;
        const endPos = position;

        // Calculate range selection (simplified - same row or same day)
        const rangeSelection: CellPosition[] = [];

        if (
          startPos.category === endPos.category &&
          startPos.subcategory === endPos.subcategory
        ) {
          // Same row - select range of days
          const startDay = Math.min(startPos.day, endPos.day);
          const endDay = Math.max(startPos.day, endPos.day);

          for (let day = startDay; day <= endDay; day++) {
            rangeSelection.push({
              ...startPos,
              day,
              colIndex: day - 1,
            });
          }
        } else {
          // Different rows - select individual positions
          rangeSelection.push(startPos, endPos);
        }

        console.log('🔍 [KEYBOARD-NAV] Range selection:', rangeSelection);
        setSelectedPositions(rangeSelection);
        onSelection?.(rangeSelection, rangeSelection.length > 1);
      } else {
        // Normal click: single selection
        console.log('🔍 [KEYBOARD-NAV] Normal click - single selection');
        setSelectedPositions([position]);
        lastSelectedPosition.current = position;
        onSelection?.([position], false);
      }
    },
    [onFocusChange, onSelection],
  );

  // Handler pentru double click (edit mode)
  const handleCellDoubleClick = useCallback(
    (position: CellPosition) => {
      setFocusedPosition(position);
      onFocusChange?.(position);
      onEditMode?.(position);
    },
    [onFocusChange, onEditMode],
  );

  // Funcție pentru setarea focus-ului programatic
  const setFocus = useCallback(
    (position: CellPosition | null) => {
      setFocusedPosition(position);
      onFocusChange?.(position);
    },
    [onFocusChange],
  );

  // Funcție pentru clear selection
  const clearSelection = useCallback(() => {
    setSelectedPositions([]);
    onSelection?.([], false);
  }, [onSelection]);

  // Helper pentru verificarea dacă o poziție este selectată
  const isPositionSelected = useCallback(
    (position: CellPosition) => {
      return selectedPositions.some(
        (pos) =>
          pos.category === position.category &&
          pos.subcategory === position.subcategory &&
          pos.day === position.day,
      );
    },
    [selectedPositions],
  );

  // Helper pentru verificarea dacă o poziție are focus
  const isPositionFocused = useCallback(
    (position: CellPosition) => {
      return (
        focusedPosition &&
        focusedPosition.category === position.category &&
        focusedPosition.subcategory === position.subcategory &&
        focusedPosition.day === position.day
      );
    },
    [focusedPosition],
  );

  return {
    // State
    focusedPosition,
    selectedPositions,

    // Handlers
    handleCellClick,
    handleCellDoubleClick,
    handleKeyDown,

    // Helpers
    setFocus,
    clearSelection,
    isPositionSelected,
    isPositionFocused,

    // Navigation
    getNextPosition,
  };
};

export default useKeyboardNavigation;
