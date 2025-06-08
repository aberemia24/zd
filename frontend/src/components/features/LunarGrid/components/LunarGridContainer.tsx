import React, { useRef } from 'react';
import { LUNAR_GRID, LUNAR_GRID_MESSAGES } from "@budget-app/shared-constants";

// CVA styling imports
import { 
  cn,
  gridContainer,
  focusRing,
  flex
} from "../../../../styles/cva-v2";

// Interfaces
interface LunarGridContainerProps {
  isLoading: boolean;
  error: Error | null;
  hasData: boolean;
  isFullscreen: boolean;
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  onWheel?: (e: React.WheelEvent) => void;
}

interface LunarGridContainerRef {
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  scrollableContainerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * LunarGridContainer - Container component with state management
 * 
 * Responsibilities:
 * - Container structure and layout
 * - Loading/error/empty state rendering
 * - Fullscreen mode management
 * - Scroll behavior and ref management
 * - CSS class application and container styling
 */
const LunarGridContainer = React.forwardRef<LunarGridContainerRef, LunarGridContainerProps>(
  ({ 
    isLoading, 
    error, 
    hasData,
    isFullscreen, 
    children, 
    className,
    onSubmit,
    onClick,
    onWheel 
  }, ref) => {
    // Internal refs for container management
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const scrollableContainerRef = useRef<HTMLDivElement>(null);

    // Expose refs through forwardRef
    React.useImperativeHandle(ref, () => ({
      tableContainerRef,
      scrollableContainerRef,
    }));

    return (
      <div 
        ref={tableContainerRef}
        className={cn(
          gridContainer({ 
            variant: "professional",
            size: isFullscreen ? "fullscreen" : "default"
          }),
          "transition-all duration-200 hover-lift",
          focusRing({ variant: "default" }),
          className
        )}
        data-testid="lunar-grid-resize-container"
        onSubmit={(e) => {
          // Previne form submission care cauzează page refresh
          e.preventDefault();
          e.stopPropagation();
          onSubmit?.(e);
        }}
        onClick={(e) => {
          // Previne click-uri nedorite care pot cauza navigație
          e.stopPropagation();
          onClick?.(e);
        }}
        onWheel={(e) => {
          // Capturează mouse wheel pentru scroll natural în tabel
          e.stopPropagation();
          onWheel?.(e);
          // Permite scroll-ul natural al browser-ului în container
        }}
        tabIndex={0} // Face container-ul focusable pentru keyboard navigation
        style={{
          scrollBehavior: 'smooth' // Smooth scrolling pentru o experiență mai plăcută
        }}
      >
        {/* Container interior - FĂRĂ overflow duplicat (scroll e gestionat de outer container) */}
        <div 
          ref={scrollableContainerRef}
          className={cn(
            "relative", // REMOVED overflow-auto - scroll is handled by outer gridContainer
            // Height constraints rămân pentru space management
            isFullscreen ? "max-h-[calc(100vh-60px)]" : "max-h-[790px]"
          )}
          data-testid="lunar-grid-container"
        >
          {/* 🎨 Professional Loading State */}
          {isLoading && (
            <div className={cn(
              "text-center p-8 text-gray-600",
              flex({ align: "center", justify: "center" }),
              "animate-fade-in-up"
            )} 
            data-testid="loading-indicator">
              <div className="loading-pulse">
                {LUNAR_GRID.LOADING}
              </div>
            </div>
          )}
          
          {/* 🎨 Professional Error State */}
          {error && (
            <div className={cn(
              "text-center p-8 text-red-600",
              flex({ align: "center", justify: "center" }),
              "animate-slide-down"
            )} 
            data-testid="error-indicator">
              {LUNAR_GRID_MESSAGES.EROARE_INCARCARE}
            </div>
          )}
          
          {/* 🎨 Professional Empty State */}
          {!isLoading && !error && !hasData && (
            <div className={cn(
              "text-center p-8 text-gray-500",
              flex({ align: "center", justify: "center" }),
              "animate-scale-in"
            )} 
            data-testid="no-data-indicator">
              {LUNAR_GRID.NO_DATA}
            </div>
          )}
          
          {/* Main content - only render when we have data and no error/loading */}
          {!isLoading && !error && hasData && children}
        </div>
      </div>
    );
  }
);

LunarGridContainer.displayName = 'LunarGridContainer';

export default LunarGridContainer;
export type { LunarGridContainerProps, LunarGridContainerRef }; 