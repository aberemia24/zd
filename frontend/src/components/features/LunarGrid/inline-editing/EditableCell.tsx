// EditableCell.tsx - HIBRID PATTERN SIMPLU
import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Edit2, MoreHorizontal } from "lucide-react";
import * as Popover from '@radix-ui/react-popover';
import { cn } from "../../../../styles/cva-v2";
import { cva } from "class-variance-authority";
import { useInlineCellEdit } from "./useInlineCellEdit";
import { EXCEL_GRID } from "@budget-app/shared-constants";
import { TransactionData } from "../modals/types";

// CVA variants SIMPLU - fără over-engineering
const cellVariants = cva(
  "relative w-full h-full text-sm transition-all duration-150 border-0 outline-none group flex items-center justify-center px-2 py-1",
  {
    variants: {
      state: {
        normal: "bg-white cursor-pointer text-gray-900 hover:bg-gray-50",
        selected: "bg-copper-100 border-2 border-copper-500 cursor-pointer text-copper-900 dark:bg-copper-900/20 dark:border-copper-500 dark:text-copper-100",
        editing: "bg-white ring-2 ring-copper-700 ring-inset cursor-default text-copper-800 dark:bg-copper-50 dark:ring-copper-400 dark:text-copper-900",
        error: "bg-red-50 border-2 border-red-400 cursor-default",
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
  "w-full h-full px-2 py-1 text-sm font-normal border-0 outline-none bg-transparent cursor-text",
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
  onCellClick?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  "data-testid"?: string;
  
  // NEW: Hibrid pattern props
  isHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  showHoverActions?: boolean;
  
  // Props noi pentru popover-ul integrat
  date: string;
  existingTransaction?: TransactionData;
  onSaveTransaction: (transaction: Omit<TransactionData, "id">) => Promise<void>;
  isSavingTransaction?: boolean;
  onTogglePopover: () => void;
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
  onCellClick,
  onClick,
  "data-testid": testId,
  isHovered = false,
  onHoverChange,
  showHoverActions = false,
  date,
  existingTransaction,
  onSaveTransaction,
  isSavingTransaction,
  onTogglePopover,
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
  // Show hover actions when: selected OR focused OR hovered AND not editing and not readonly
  const shouldDisplayActions = (isSelected || isFocused || isActuallyHovered) && !isEditing && !isReadonly;

  // ===== COMPUTED VALUES =====
  const cellState = isReadonly ? "readonly" 
    : isSaving ? "saving"
    : error ? "error"
    : isEditing ? "editing"
    : (isSelected || isFocused) ? "selected" 
    : "normal";

  const displayValue = value === "" || value === null || value === undefined ? "" : String(value);

  // ===== EVENT HANDLERS SIMPLU =====
  
  // 🔒 SIMPLE FIX: Permite doar cifre, punct, virgulă pentru amount/percentage
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (validationType === 'amount' || validationType === 'percentage') {
      const allowedChars = /[0-9.,\-]/;
      const char = e.key;
      
      // Permite control keys (backspace, delete, arrow keys, etc.)
      if (char.length > 1) return;
      
      // Permite doar cifre, punct, virgulă, minus
      if (!allowedChars.test(char)) {
        e.preventDefault();

      }
    }
  }, [validationType]);

  // 🔒 SIMPLE FIX: Filtrează paste content
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    if (validationType === 'amount' || validationType === 'percentage') {
      const pastedText = e.clipboardData.getData('text');
      const cleanText = pastedText.replace(/[^0-9.,\-]/g, '');
      
      if (cleanText !== pastedText) {
        e.preventDefault();
        setValue(cleanText);
  
      }
    }
  }, [validationType, setValue]);

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
  }, [isReadonly, isEditing, onStartEdit, handleDoubleClick, cellId]);

  // Keyboard navigation EXACT conform PRD
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
      // Nu în edit mode - logica EXACTĂ din PRD:
      if (e.key === "F2" && !isReadonly) {
        // F2: Start edit când not editing și not readonly
        e.preventDefault();
        if (onStartEdit) {
          onStartEdit();
        } else {
          startEdit();
        }
      } else if (e.key === "Enter" && !isReadonly && shouldDisplayActions) {
        // Enter: Start edit DOAR când hover actions sunt afișate
        e.preventDefault();
        if (onStartEdit) {
          onStartEdit();
        } else {
          startEdit();
        }
      } else if (e.key === "Escape" && shouldDisplayActions) {
        // Escape: Deselect când hover actions sunt afișate
        e.preventDefault();
        // Trigger deselection prin onHoverChange
        setInternalHovered(false);
        onHoverChange?.(false);
      } else {
      }
    }
    
    onKeyDown?.(e);
  }, [isEditing, onCancel, inlineKeyDown, onStartEdit, startEdit, onKeyDown, isReadonly, shouldDisplayActions, setInternalHovered, onHoverChange, cellId]);

  // ===== MOBILE SUPPORT SIMPLU =====
  const handleTouchStart = useCallback(() => {
    // Mobile: Long press (600ms) = show hover actions
    const timer = setTimeout(() => {
      setInternalHovered(true);
      onHoverChange?.(true);
    }, 600);
    setLongPressTimer(timer);
  }, [onHoverChange, cellId]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer, cellId]);

  // Desktop hover management
  const handleMouseEnter = useCallback(() => {
    setInternalHovered(true);
    onHoverChange?.(true);
  }, [onHoverChange, cellId]);

  const handleMouseLeave = useCallback(() => {
    setInternalHovered(false);
    onHoverChange?.(false);
  }, [onHoverChange, cellId]);

  // ===== HOVER ACTIONS HANDLERS =====
  const handleEditButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStartEdit) {
      onStartEdit();
    } else {
      startEdit();
    }
  }, [onStartEdit, startEdit, cellId]);

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
          onKeyPress={handleKeyPress}
          onPaste={handlePaste}
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
      className={cn(cellVariants({ state: cellState }), className, "w-full h-full")}
      onClick={(e) => {
        // Dacă click-ul a venit de pe un element copil (ex: butoanele de acțiune),
        // nu facem nimic. Doar click-urile directe pe div-ul principal vor declanșa selecția.
        if (e.target !== e.currentTarget) {
          e.stopPropagation();
          return;
        }
        onClick?.(e);
      }}
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
      {/* Cell content simplified */}
      <span>{displayValue}</span>
      
      {/* Hint text pentru selected/focused cells */}
      {(isSelected || isFocused) && !isReadonly && !shouldDisplayActions && (
        <span className="ml-2 text-xs text-gray-500 opacity-75">
          F2 to edit
        </span>
      )}

      {/* CONTAINERUL PENTRU ACȚIUNI */}
      <div className={cn(
        "absolute right-1 top-1 flex gap-1 transition-opacity duration-200 z-10",
        {
          "opacity-100": shouldDisplayActions, // Make visible if selected/focused or hovered
          "opacity-0": !shouldDisplayActions // Hide otherwise
        }
      )}>
        <button
          onClick={handleEditButtonClick}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Edit inline (F2)"
          aria-label="Edit cell inline"
          tabIndex={0}
          data-testid={`edit-button-${cellId}`}
        >
          <Edit2 size={14} />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePopover();
          }}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          title="More options"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>
      
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