// EditableCell.tsx - HIBRID PATTERN SIMPLU
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Edit2, MoreHorizontal } from "lucide-react";
import { cn } from "../../../../styles/cva-v2";
import { cva } from "class-variance-authority";
import { useInlineCellEdit } from "./useInlineCellEdit";
import { EXCEL_GRID } from "@budget-app/shared-constants";

// CVA variants SIMPLU - fără over-engineering
const cellVariants = cva(
  "relative w-full h-full text-sm transition-all duration-150 border-0 outline-none group",
  {
    variants: {
      state: {
        normal: "bg-white cursor-pointer text-gray-900 hover:bg-gray-50",
        selected: "bg-blue-50 border-2 border-blue-400 cursor-pointer",
        editing: "bg-white ring-2 ring-blue-500 ring-inset cursor-text",
        error: "bg-red-50 border-2 border-red-400 cursor-text",
        saving: "bg-gray-100 opacity-70 cursor-wait",
        readonly: "bg-gray-50 cursor-default opacity-60",
      },
    },
    defaultVariants: {
      state: "normal",
    },
  },
);

const inputVariants = cva(
  "w-full h-full px-2 py-1 text-sm font-normal border-0 outline-none bg-transparent",
  {
    variants: {
      validationType: {
        amount: "text-right font-mono",
        percentage: "text-right font-mono",
        text: "text-left",
        date: "text-center font-mono",
      },
    },
    defaultVariants: {
      validationType: "text",
    },
  },
);

// Props interface - EXACT ca în plan
export interface EditableCellProps {
  // Existing props (toate păstrate)
  cellId: string;
  value: string | number;
  onSave: (value: string | number) => Promise<void>;
  validationType: "amount" | "text" | "percentage" | "date";
  isEditing?: boolean;
  error?: string | null;
  isSaving?: boolean;
  isSelected?: boolean;
  isFocused?: boolean;
  isReadonly?: boolean;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onStartEdit?: () => void;
  onCancel?: () => void;
  onSingleClick?: (e: React.MouseEvent) => void;
  "data-testid"?: string;
  
  // NEW: Hibrid pattern props
  isHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  showHoverActions?: boolean;
}

const EditableCellComponent: React.FC<EditableCellProps> = ({
  cellId,
  value,
  onSave,
  validationType,
  isEditing: propIsEditing,
  error: propError,
  isSaving: propIsSaving,
  isSelected = false,
  isFocused = false,
  isReadonly = false,
  placeholder,
  className,
  onFocus,
  onKeyDown,
  onStartEdit,
  onCancel,
  onSingleClick,
  "data-testid": testId,
  isHovered = false,
  onHoverChange,
  showHoverActions = false,
}) => {
  // ===== HIBRID PATTERN STATE =====
  const [internalHovered, setInternalHovered] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  // Use external hover state if provided, otherwise internal
  const isActuallyHovered = onHoverChange ? isHovered : internalHovered;

  // ===== INLINE EDIT HOOK =====
  const {
    isEditing: internalEditing,
    value: editValue,
    error: internalError,
    isSaving: internalIsSaving,
    startEdit,
    setValue,
    handleKeyDown: inlineKeyDown,
    handleBlur,
    handleDoubleClick,
    inputRef,
  } = useInlineCellEdit({
    cellId,
    initialValue: value,
    onSave,
    validationType,
    isReadonly,
  });

  // Controlled vs uncontrolled state
  const isEditing = propIsEditing !== undefined ? propIsEditing : internalEditing;
  const error = propError !== undefined ? propError : internalError;
  const isSaving = propIsSaving !== undefined ? propIsSaving : internalIsSaving;

  // ===== HIBRID PATTERN LOGIC =====
  // Show hover actions when: hovered AND (selected OR focused) AND not editing
  const shouldShowHoverActions = isActuallyHovered && (isSelected || isFocused) && !isEditing && !isReadonly;

  // ===== COMPUTED VALUES =====
  const cellState = isReadonly ? "readonly" 
    : isSaving ? "saving"
    : error ? "error"
    : isEditing ? "editing"
    : (isSelected || isFocused) ? "selected"
    : "normal";

  const displayValue = value === "" || value === null || value === undefined ? "" : String(value);

  // ===== EVENT HANDLERS SIMPLU =====
  
  // HIBRID: Single click = select only (nu deschide modal)
  const handleSingleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isEditing || isReadonly) return;
    
    // Doar selectează celula - hover actions vor apărea automat
    onFocus?.();
  }, [isEditing, isReadonly, onFocus]);

  // Double click = start editing (neschimbat)
  const handleDoubleClickWrapper = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isReadonly && !isEditing) {
      if (onStartEdit) {
        onStartEdit();
      } else {
        handleDoubleClick();
      }
    }
  }, [isReadonly, isEditing, onStartEdit, handleDoubleClick]);

  // Keyboard navigation SIMPLU
  const handleKeyDownWrapper = useCallback((e: React.KeyboardEvent) => {
    if (isEditing) {
      // În edit mode: Enter = save, Escape = cancel
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        // useInlineCellEdit handles save
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (onCancel) {
          onCancel();
        }
      }
      inlineKeyDown(e);
    } else {
      // Nu în edit mode: F2/Enter = start edit
      if ((e.key === "F2" || e.key === "Enter") && !isReadonly) {
        e.preventDefault();
        if (onStartEdit) {
          onStartEdit();
        } else {
          startEdit();
        }
      }
    }
    
    onKeyDown?.(e);
  }, [isEditing, onCancel, inlineKeyDown, onStartEdit, startEdit, onKeyDown, isReadonly]);

  // ===== MOBILE SUPPORT SIMPLU =====
  const handleTouchStart = useCallback(() => {
    // Mobile: Long press (500ms) = show hover actions
    const timer = setTimeout(() => {
      setInternalHovered(true);
      onHoverChange?.(true);
    }, 500);
    setLongPressTimer(timer);
  }, [onHoverChange]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  // Desktop hover management
  const handleMouseEnter = useCallback(() => {
    setInternalHovered(true);
    onHoverChange?.(true);
  }, [onHoverChange]);

  const handleMouseLeave = useCallback(() => {
    setInternalHovered(false);
    onHoverChange?.(false);
  }, [onHoverChange]);

  // ===== HOVER ACTIONS HANDLERS =====
  const handleEditButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStartEdit) {
      onStartEdit();
    } else {
      startEdit();
    }
  }, [onStartEdit, startEdit]);

  const handleMoreButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSingleClick?.(e); // Deschide modal pentru advanced editing
  }, [onSingleClick]);

  // ===== RENDER =====
  if (isEditing) {
    return (
      <div
        className={cn(cellVariants({ state: cellState }), className)}
        data-testid={testId || `editable-cell-editing-${cellId}`}
        role="gridcell"
        tabIndex={-1}
      >
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDownWrapper}
          onBlur={handleBlur}
          placeholder={placeholder || EXCEL_GRID.INLINE_EDITING.PLACEHOLDER.AMOUNT}
          className={cn(inputVariants({ validationType }))}
          data-testid={`editable-cell-input-${cellId}`}
          disabled={isSaving}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
        
        {/* Loading indicator simplu */}
        {isSaving && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Error display simplu */}
        {error && (
          <div className="absolute top-full left-0 z-10 mt-1 px-2 py-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded shadow-sm">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(cellVariants({ state: cellState }), className)}
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClickWrapper}
      onKeyDown={handleKeyDownWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={isReadonly ? -1 : 0}
      data-testid={testId || `editable-cell-${cellId}`}
      role="gridcell"
      aria-label={`${validationType} cell with value ${displayValue}`}
    >
      {/* Cell content */}
      <div className="w-full h-full px-2 py-1 flex items-center justify-center">
        <span>{displayValue}</span>
        
        {/* Hint text pentru selected/focused cells */}
        {(isSelected || isFocused) && !isReadonly && !shouldShowHoverActions && (
          <span className="ml-2 text-xs text-gray-500 opacity-75">
            F2 to edit
          </span>
        )}
      </div>

      {/* ===== HIBRID PATTERN: HOVER ACTIONS ===== */}
      {shouldShowHoverActions && (
        <div className="absolute right-1 top-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          {/* Edit button */}
          <button
            onClick={handleEditButtonClick}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Edit inline (F2)"
            aria-label="Edit cell inline"
            tabIndex={0}
            data-testid={`edit-button-${cellId}`}
          >
            <Edit2 size={14} />
          </button>
          
          {/* More options button */}
          <button
            onClick={handleMoreButtonClick}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="More options"
            aria-label="Open advanced options modal"
            tabIndex={0}
            data-testid={`more-button-${cellId}`}
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      )}
      
      {/* Loading overlay pentru non-editing state */}
      {isSaving && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

// React.memo pentru performance
export const EditableCell = React.memo(EditableCellComponent);
EditableCell.displayName = "EditableCell";