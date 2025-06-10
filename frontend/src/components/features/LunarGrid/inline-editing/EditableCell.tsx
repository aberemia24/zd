// EditableCell.tsx - ENHANCED PRAGMATIC ARCHITECTURE
import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Edit2, MoreHorizontal, Save, X, AlertCircle } from "lucide-react";
import * as Popover from '@radix-ui/react-popover';
import { cn } from "../../../../styles/cva-v2";
import { cva } from "class-variance-authority";
import { useInlineCellEdit } from "./useInlineCellEdit";
import { EXCEL_GRID } from "@budget-app/shared-constants";
import { TransactionData } from "../modals/types";

// ===== ENHANCED CVA VARIANTS =====
const cellVariants = cva(
  "relative w-full h-full text-sm transition-all duration-150 border-0 outline-none group flex items-center justify-center px-2 py-1",
  {
    variants: {
      state: {
        normal: "bg-white cursor-pointer text-gray-900 hover:bg-gray-50",
        selected: "bg-copper-100 border-2 border-copper-500 cursor-pointer text-copper-900 dark:bg-copper-900/20 dark:border-copper-500 dark:text-copper-100",
        editing: "bg-white ring-2 ring-copper-700 ring-inset cursor-default text-copper-800 dark:bg-copper-50 dark:ring-copper-400 dark:text-copper-900",
        error: "bg-red-50 border-2 border-red-400 cursor-default text-red-800",
        warning: "bg-amber-50 border-2 border-amber-400 cursor-default text-amber-800", // NEW: warning state
        saving: "bg-gray-100 opacity-70 cursor-wait",
        readonly: "bg-gray-50 cursor-default opacity-60",
      },
      interaction: {
        idle: "",
        hover: "shadow-sm",
        focus: "ring-2 ring-blue-500 ring-opacity-50",
        pressed: "scale-98",
      }
    },
    defaultVariants: {
      state: "normal",
      interaction: "idle",
    },
  },
);

const inputVariants = cva(
  "w-full h-full px-2 py-1 text-sm font-normal border-0 outline-none bg-transparent cursor-text",
  {
    variants: {
      validationType: {
        amount: "text-right font-mono tabular-nums",
        percentage: "text-right font-mono tabular-nums",
        text: "text-left",
        date: "text-center font-mono",
      },
    },
    defaultVariants: {
      validationType: "text",
    },
  },
);

// ===== ENHANCED INTERFACE =====
export interface EditableCellProps {
  // Core props (păstrez toate existente)
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
  
  // Enhanced hover props
  isHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  showHoverActions?: boolean;
  
  // Popover integration props
  date: string;
  category: string;
  subcategory?: string;
  validTransactions: TransactionData[];
  onSaveTransaction: (transaction: Omit<TransactionData, "id">) => Promise<void>;
  onDeleteTransaction?: (transactionId: string) => Promise<void>;
  isSavingTransaction?: boolean;
  onTogglePopover: () => void;
  
  // NEW: Enhanced features
  warning?: string | null;
  contextualHints?: boolean;
  smartValidation?: boolean;
  autoSizeInput?: boolean;
}

// ===== ENHANCED CELL STATE MANAGEMENT =====
type CellState = 'normal' | 'selected' | 'editing' | 'error' | 'warning' | 'saving' | 'readonly';
type InteractionState = 'idle' | 'hover' | 'focus' | 'pressed';

interface CellStateManager {
  cellState: CellState;
  interactionState: InteractionState;
  shouldShowActions: boolean;
  shouldShowHints: boolean;
}

// ===== ENHANCED COMPONENT =====
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
  category,
  subcategory,
  validTransactions,
  onSaveTransaction,
  onDeleteTransaction,
  isSavingTransaction,
  onTogglePopover,
  warning,
  contextualHints = true,
  smartValidation = true,
  autoSizeInput = false,
}) => {
  // ===== ENHANCED STATE MANAGEMENT =====
  const [internalHovered, setInternalHovered] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [interactionState, setInteractionState] = useState<InteractionState>('idle');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // Use external hover state if provided, otherwise internal
  const isActuallyHovered = onHoverChange ? isHovered : internalHovered;
  
  // Memoized date parts to prevent infinite re-renders in UniversalTransactionPopover
  const { day, month, year } = useMemo(() => {
    const parts = date.split('-');
    return {
      day: parseInt(parts[2], 10),
      month: parseInt(parts[1], 10),
      year: parseInt(parts[0], 10)
    };
  }, [date]);

  // NOU: Găsește tranzacția existentă aici, într-un mediu stabil
  const existingTransaction = useMemo(() => {
    const dayOfMonth = parseInt(date.split('-')[2], 10);
    return validTransactions.find(t => 
      t.category === category && 
      t.subcategory === subcategory && 
      new Date(t.date).getUTCDate() === dayOfMonth
    );
  }, [validTransactions, category, subcategory, date]);

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

  // ===== ENHANCED COMPUTED STATE =====
  const computedState = useMemo((): CellStateManager => {
    // Determine cell state
    let cellState: CellState = 'normal';
    if (isReadonly) cellState = 'readonly';
    else if (propIsSaving || internalIsSaving) cellState = 'saving';
    else if (propError || internalError) cellState = 'error';
    else if (warning && smartValidation) cellState = 'warning';
    else if (propIsEditing || internalEditing) cellState = 'editing';
    else if (isSelected || isFocused) cellState = 'selected';

    // Determine if actions should show
    const shouldShowActions = (isSelected || isFocused || isActuallyHovered) 
      && !internalEditing && !isReadonly && !propIsSaving && !internalIsSaving;

    // Determine if hints should show
    const shouldShowHints = contextualHints && (isSelected || isFocused) 
      && !internalEditing && !isReadonly && !shouldShowActions;

    return {
      cellState,
      interactionState,
      shouldShowActions,
      shouldShowHints,
    };
  }, [
    isReadonly, propIsSaving, internalIsSaving, propError, internalError, 
    warning, smartValidation, propIsEditing, internalEditing, isSelected, 
    isFocused, isActuallyHovered, contextualHints
  ]);

  // ===== ENHANCED EVENT HANDLERS =====
  
  // Smart input filtering pentru amount/percentage
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!smartValidation) return;
    
    if (validationType === 'amount' || validationType === 'percentage') {
      const allowedChars = /[0-9.,\-]/;
      const char = e.key;
      
      if (char.length > 1) return; // Allow control keys
      
      if (!allowedChars.test(char)) {
        e.preventDefault();
      }
    }
  }, [validationType, smartValidation]);

  // Enhanced paste handler
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!smartValidation) return;
    
    if (validationType === 'amount' || validationType === 'percentage') {
      const pastedText = e.clipboardData.getData('text');
      const cleanText = pastedText.replace(/[^0-9.,\-]/g, '');
      
      if (cleanText !== pastedText) {
        e.preventDefault();
        setValue(cleanText);
      }
    }
  }, [validationType, setValue, smartValidation]);

  // Enhanced double click with interaction feedback
  const handleDoubleClickWrapper = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setInteractionState('pressed');
    setTimeout(() => setInteractionState('hover'), 100);
    
    if (!isReadonly && !internalEditing) {
      if (onStartEdit) {
        onStartEdit();
      } else {
        handleDoubleClick();
      }
    }
  }, [isReadonly, internalEditing, onStartEdit, handleDoubleClick]);

  // Enhanced keyboard handling with better Excel-like behavior
  const handleKeyDownWrapper = useCallback((e: React.KeyboardEvent) => {
    if (internalEditing) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        // Save and move down (Excel behavior)
      } else if (e.key === "Tab") {
        e.preventDefault();
        // Save and move right/left (Excel behavior)
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (onCancel) onCancel();
      }
      inlineKeyDown(e);
    } else {
      // Excel-like navigation and editing shortcuts
      if (e.key === "F2" && !isReadonly) {
        e.preventDefault();
        if (onStartEdit) {
          onStartEdit();
        } else {
          startEdit();
        }
      } else if (e.key === "Enter" && !isReadonly && computedState.shouldShowActions) {
        e.preventDefault();
        if (onStartEdit) {
          onStartEdit();
        } else {
          startEdit();
        }
      } else if (e.key === "Delete" && !isReadonly && (isSelected || isFocused)) {
        // FIXED: Delete key should work when cell is selected/focused, not just when actions are shown
        console.log("🗑️ DELETE KEY PRESSED - clearing cell value", { 
          cellId, 
          value, 
          isReadonly,
          isSelected,
          isFocused,
          shouldShowActions: computedState.shouldShowActions,
          cellState: computedState.cellState,
          interactionState: computedState.interactionState
        });
        e.preventDefault();
        e.stopPropagation();
        // Quick delete value
        onSave("");
      } else if (e.key === "Escape" && computedState.shouldShowActions) {
        e.preventDefault();
        setInternalHovered(false);
        onHoverChange?.(false);
      } else if (/^[a-zA-Z0-9]$/.test(e.key) && !isReadonly) {
        // Start typing to replace (Excel behavior)
        e.preventDefault();
        if (onStartEdit) {
          onStartEdit();
        } else {
          startEdit();
        }
        // Set initial value to typed character
        setTimeout(() => setValue(e.key), 0);
      }
    }
    
    onKeyDown?.(e);
  }, [
    internalEditing, onCancel, inlineKeyDown, onStartEdit, startEdit, 
    onKeyDown, isReadonly, computedState.shouldShowActions, onSave, 
    setValue, setInternalHovered, onHoverChange, isSelected, isFocused, cellId, value
  ]);

  // ===== ENHANCED MOBILE & ACCESSIBILITY SUPPORT =====
  const handleTouchStart = useCallback(() => {
    const timer = setTimeout(() => {
      setInternalHovered(true);
      onHoverChange?.(true);
    }, 600); // 600ms long press
    setLongPressTimer(timer);
  }, [onHoverChange]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  const handleMouseEnter = useCallback(() => {
    setInternalHovered(true);
    setInteractionState('hover');
    onHoverChange?.(true);
  }, [onHoverChange]);

  const handleMouseLeave = useCallback(() => {
    setInternalHovered(false);
    setInteractionState('idle');
    onHoverChange?.(false);
  }, [onHoverChange]);

  const handleFocus = useCallback(() => {
    setInteractionState('focus');
    onFocus?.();
  }, [onFocus]);

  const handleBlurWrapper = useCallback(() => {
    setInteractionState('idle');
    handleBlur();
  }, [handleBlur]);

  // ===== ACTION HANDLERS =====
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
    // LOG PENTRU DEBUG
    console.log("🅿️ Opening Popover for Cell:", {
      cellId,
      existingTransaction
    });
    setIsPopoverOpen(true);
    onTogglePopover();
  }, [onTogglePopover, cellId, existingTransaction]);

  // ===== POPOVER HANDLERS (DISABLED - UniversalTransactionPopover not available) =====
  // TODO: Re-implement when UniversalTransactionPopover is available
  const handlePopoverSave = useCallback(async (data: any) => {
    // Temporary implementation without popover
    console.log("🎯 Transaction save (temporary):", { data, existingTransaction, date });
    setIsPopoverOpen(false);
  }, [existingTransaction, date]);

  const handlePopoverCancel = useCallback(() => setIsPopoverOpen(false), []);

  const handlePopoverDelete = useCallback(async () => {
    if (onDeleteTransaction && existingTransaction?.id) {
      await onDeleteTransaction(existingTransaction.id);
      setIsPopoverOpen(false);
    }
  }, [onDeleteTransaction, existingTransaction]);

  // Temporary placeholder for popover component
  const PopoverComponent = useMemo(() => (
    <div>
      {/* TODO: Re-implement UniversalTransactionPopover when available */}
      <button
        onClick={handleMoreButtonClick}
        className="p-1 rounded hover:bg-copper-100 dark:hover:bg-copper-700 transition-colors focus:outline-none focus:ring-2 focus:ring-copper-500"
        title="Advanced options (disabled)"
        aria-label="Open advanced options (disabled)"
        tabIndex={0}
        data-testid={`more-button-${cellId}`}
        disabled
      >
        <MoreHorizontal size={14} />
      </button>
    </div>
  ), [handleMoreButtonClick, cellId]);

  const handleQuickSave = useCallback(() => {
    if (internalEditing) {
      // Quick save from editing mode
      handleBlur();
    }
  }, [internalEditing, handleBlur]);

  const handleQuickCancel = useCallback(() => {
    if (internalEditing && onCancel) {
      onCancel();
    }
  }, [internalEditing, onCancel]);

  // ===== COMPUTED VALUES =====
  const displayValue = (() => {
    if (value === "" || value === null || value === undefined) {
      return "";
    }
    
    if (validationType === "amount" && (value === 0 || value === "0")) {
      return "";
    }
    
    return String(value);
  })();
  
  const hasValue = displayValue.length > 0;
  const isError = !!(propError || internalError);
  const isWarning = !!(warning && smartValidation);

  // ===== RENDER EDITING STATE =====
  if (internalEditing) {
    return (
      <div
        className={cn(
          cellVariants({ 
            state: computedState.cellState, 
            interaction: computedState.interactionState 
          }), 
          className
        )}
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
          onBlur={handleBlurWrapper}
          onFocus={handleFocus}
          placeholder={placeholder || EXCEL_GRID.INLINE_EDITING.PLACEHOLDER.AMOUNT}
          className={cn(
            inputVariants({ validationType }),
            autoSizeInput && "resize-none"
          )}
          data-testid={`editable-cell-input-${cellId}`}
          disabled={propIsSaving || internalIsSaving}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          onKeyPress={handleKeyPress}
          onPaste={handlePaste}
          aria-label={`Editing ${validationType} cell`}
        />
        
        {/* Enhanced editing controls */}
        <div className="absolute right-1 top-1 flex gap-1 opacity-80">
          <button
            onClick={handleQuickSave}
            className="p-1 rounded hover:bg-green-100 text-green-600"
            title="Save (Enter)"
            tabIndex={-1}
          >
            <Save size={12} />
          </button>
          <button
            onClick={handleQuickCancel}
            className="p-1 rounded hover:bg-red-100 text-red-600"
            title="Cancel (Escape)"
            tabIndex={-1}
          >
            <X size={12} />
          </button>
        </div>
        
        {/* Enhanced loading indicator */}
        {(propIsSaving || internalIsSaving) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
            <div className="w-4 h-4 border-2 border-copper-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Enhanced error/warning display */}
        {(isError || isWarning) && (
          <div className={cn(
            "absolute top-full left-0 z-20 mt-1 px-2 py-1 text-xs rounded shadow-lg border",
            isError ? "text-red-700 bg-red-50 border-red-200" : "text-amber-700 bg-amber-50 border-amber-200"
          )}>
            <div className="flex items-center gap-1">
              <AlertCircle size={10} />
              {propError || internalError || warning}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===== RENDER NORMAL STATE =====
  return (
    <div
      className={cn(
        cellVariants({ 
          state: computedState.cellState, 
          interaction: computedState.interactionState 
        }), 
        className
      )}
      onClick={(e) => {
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
      onFocus={handleFocus}
      tabIndex={isReadonly ? -1 : 0}
      data-testid={testId || `editable-cell-${cellId}`}
      role="gridcell"
      aria-label={`${validationType} cell with value ${displayValue}`}
      aria-selected={isSelected}
      aria-readonly={isReadonly}
    >
      {/* Enhanced cell content */}
      <div className="flex items-center justify-between w-full">
        <span className={cn(
          "truncate",
          !hasValue && "text-gray-400 italic",
          validationType === 'amount' && "font-mono tabular-nums text-right",
          validationType === 'percentage' && "font-mono tabular-nums text-right",
        )}>
          {hasValue ? displayValue : (placeholder || "")}
        </span>
        
        {/* Value type indicator */}
        {hasValue && validationType === 'percentage' && (
          <span className="text-xs text-gray-500 ml-1">%</span>
        )}
      </div>
      
      {/* Enhanced contextual hints */}
      {computedState.shouldShowHints && (
        <div className="absolute bottom-0 right-1 text-xs text-gray-400 opacity-75">
          {isReadonly ? "Read-only" : "F2 to edit"}
        </div>
      )}

      {/* Enhanced action buttons */}
      {computedState.shouldShowActions && (
        <div className="absolute right-1 top-1 flex gap-1 transition-all duration-200 z-10">
          <button
            onClick={handleEditButtonClick}
            className="p-1 rounded hover:bg-copper-100 dark:hover:bg-copper-700 transition-colors focus:outline-none focus:ring-2 focus:ring-copper-500"
            title="Edit inline (F2 or Enter)"
            aria-label="Edit cell inline"
            tabIndex={0}
            data-testid={`edit-button-${cellId}`}
          >
            <Edit2 size={14} />
          </button>
          
          {PopoverComponent}
        </div>
      )}
      
      {/* Enhanced loading overlay */}
      {(propIsSaving || internalIsSaving) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm rounded">
          <div className="w-4 h-4 border-2 border-copper-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Enhanced status indicators */}
      {(isError || isWarning) && (
        <div className="absolute top-0 right-0 -mt-1 -mr-1">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isError ? "bg-red-500" : "bg-amber-500"
          )} />
        </div>
      )}
    </div>
  );
};

export default EditableCellComponent;

// Named export pentru backwards compatibility
export { EditableCellComponent as EditableCell };