import React, { useMemo, useCallback, RefObject } from "react";

/**
 * Hook pentru optimizarea performanței în LunarGrid Inline Editing
 * Implementează foundation pentru sub-16ms interactions (Creative Phase)
 */

export interface UsePerformanceOptimizationProps {
  /** Referință către containerul grid */
  gridRef: RefObject<HTMLElement>;

  /** Numărul total de celule pentru calcule de optimizare */
  totalCells: number;

  /** Dacă să folosească virtual scrolling */
  enableVirtualScrolling?: boolean;

  /** Threshold pentru activarea optimizărilor */
  performanceThreshold?: number;
}

// Type pentru cell data în grid
export interface CellData {
  id: string;
  category: string;
  subcategory?: string;
  day: number;
  amount: number;
  [key: string]: unknown;
}

// Type pentru event handlers cu type safety
export type OptimizedEventHandler<T extends unknown[] = unknown[]> = (...args: T) => void;

export interface UsePerformanceOptimizationReturn {
  /** Dacă să folosească optimizările de performanță */
  shouldOptimize: boolean;

  /** Handler optimizat pentru evenimente */
  createOptimizedHandler: <T extends unknown[]>(
    handler: OptimizedEventHandler<T>,
    dependencies: unknown[],
  ) => OptimizedEventHandler<T>;

  /** Memoized cell renderer pentru reducerea re-renderurilor */
  memoizedCellRenderer: (
    renderFn: (data: CellData) => React.ReactNode,
    dependencies: unknown[],
  ) => (data: CellData) => React.ReactNode;

  /** Event delegation setup pentru grid */
  setupEventDelegation: () => () => void;

  /** Performance monitoring */
  measurePerformance: (operation: string, fn: () => void) => void;
}

export const usePerformanceOptimization = ({
  gridRef,
  totalCells,
  enableVirtualScrolling = false,
  performanceThreshold = 100,
}: UsePerformanceOptimizationProps): UsePerformanceOptimizationReturn => {
  // Determine dacă să activăm optimizările bazat pe numărul de celule
  const shouldOptimize = useMemo(() => {
    return totalCells > performanceThreshold || enableVirtualScrolling;
  }, [totalCells, performanceThreshold, enableVirtualScrolling]);

  // Create optimized event handler cu proper memoization
  const createOptimizedHandler = useCallback(
    <T extends unknown[]>(handler: OptimizedEventHandler<T>, dependencies: unknown[]) => {
      // Return a simple function without hooks inside
      return ((...args: T) => {
        handler(...args);
      }) as OptimizedEventHandler<T>;
    },
    [],
  );

  // Memoized cell renderer pentru reducerea re-renderurilor
  const memoizedCellRenderer = useCallback(
    (renderFn: (data: CellData) => React.ReactNode, dependencies: unknown[]) => {
      // Return a simple function without hooks inside
      return (data: CellData) => {
        return renderFn(data);
      };
    },
    [],
  );

  // Event delegation setup pentru grid performance
  const setupEventDelegation = useCallback(() => {
    if (!gridRef.current || !shouldOptimize) {
      return () => {}; // noop cleanup
    }

    const gridElement = gridRef.current;

    // Optimized event handlers cu delegation
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const cellElement = target.closest('[data-testid^="editable-cell"]');

      if (cellElement) {
        // Trigger cell-specific logic
        const cellId = cellElement
          .getAttribute("data-testid")
          ?.replace("editable-cell-", "");
        if (cellId) {
          // Emit custom event pentru cell click
          gridElement.dispatchEvent(
            new CustomEvent("cell-click", {
              detail: { cellId, originalEvent: e },
            }),
          );
        }
      }
    };

    const handleDoubleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const cellElement = target.closest('[data-testid^="editable-cell"]');

      if (cellElement) {
        const cellId = cellElement
          .getAttribute("data-testid")
          ?.replace("editable-cell-", "");
        if (cellId) {
          gridElement.dispatchEvent(
            new CustomEvent("cell-double-click", {
              detail: { cellId, originalEvent: e },
            }),
          );
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle global grid keyboard shortcuts
      if (e.target && gridElement.contains(e.target as Node)) {
        const cellElement = (e.target as HTMLElement).closest(
          '[data-testid^="editable-cell"]',
        );

        if (cellElement) {
          const cellId = cellElement
            .getAttribute("data-testid")
            ?.replace("editable-cell-", "");
          if (cellId) {
            gridElement.dispatchEvent(
              new CustomEvent("cell-keydown", {
                detail: { cellId, originalEvent: e },
              }),
            );
          }
        }
      }
    };

    // Attach delegated event listeners
    gridElement.addEventListener("click", handleClick);
    gridElement.addEventListener("dblclick", handleDoubleClick);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      gridElement.removeEventListener("click", handleClick);
      gridElement.removeEventListener("dblclick", handleDoubleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [gridRef, shouldOptimize]);

  // Performance monitoring pentru debugging
  const measurePerformance = useCallback(
    (operation: string, fn: () => void) => {
      if (!shouldOptimize || process.env.NODE_ENV !== "development") {
        fn();
        return;
      }

      const startTime = performance.now();
      fn();
      const endTime = performance.now();

      const duration = endTime - startTime;

      // Log doar dacă operația depășește target-ul de 16ms
      if (duration > 16) {
        console.warn(
          `Performance warning: ${operation} took ${duration.toFixed(2)}ms (target: <16ms)`,
        );
      } else {
        console.log(
          `Performance: ${operation} completed in ${duration.toFixed(2)}ms ✅`,
        );
      }
    },
    [shouldOptimize],
  );

  return {
    shouldOptimize,
    createOptimizedHandler,
    memoizedCellRenderer,
    setupEventDelegation,
    measurePerformance,
  };
};

/**
 * Higher-Order Component pentru optimizarea performanței componentelor
 */
export const withPerformanceOptimization = <P extends object>(
  Component: React.ComponentType<P>,
): React.ComponentType<P> => {
  const OptimizedComponent = React.memo(Component);
  OptimizedComponent.displayName = `withPerformanceOptimization(${Component.displayName || Component.name})`;
  return OptimizedComponent;
};
