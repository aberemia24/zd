import React, { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { cn } from "../../../../styles/cva-v2";
import { cva } from "class-variance-authority";
import { useInlineCellEdit } from "./useInlineCellEdit";
import { EXCEL_GRID } from "@budget-app/shared-constants";

/**
 * Componenta EditableCell pentru LunarGrid
 * Implementează inline editing cu visual feedback conform Creative Phase decisions
 * OPTIMIZAT cu pattern-urile validate din QuickAddModal (Task #5)
 * 
 * TASK 11: Implementat timer-based click detection pentru single vs double click
 */

export interface EditableCellProps {
  cellId: string;
  value: string | number;
  onSave: (value: string | number) => Promise<void>; // amount/percentage = number, text/date = string
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
  onSingleClick?: (e: React.MouseEvent) => void; // LGI TASK 5: Handler pentru single click modal
  "data-testid"?: string;
}

// CVA variants pentru cell states - OPTIMIZAT cu useMemo în componentă
const cellVariants = cva(
  "relative w-full h-full text-sm transition-all duration-150 border-0 outline-none",
  {
    variants: {
      state: {
        normal: "bg-white cursor-pointer text-carbon-900 dark:text-carbon-100 hover:bg-carbon-50 dark:hover:bg-carbon-800/50",
        selected: "bg-blue-50 border-2 border-blue-400 cursor-pointer",
        editing: "bg-white ring-2 ring-blue-500 ring-inset cursor-text",
        error: "bg-red-50 border-2 border-red-400 cursor-text",
        saving: "bg-carbon-100 dark:bg-carbon-800 opacity-70 cursor-wait",
        readonly: "bg-carbon-50 dark:bg-carbon-900 cursor-default opacity-60",
      },
      editable: {
        true: "hover:bg-carbon-50 dark:hover:bg-carbon-800/50",
        false: "cursor-default",
      },
    },
    defaultVariants: {
      state: "normal",
      editable: true,
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

/**
 * EditableCell Component - OPTIMIZAT cu React.memo
 * Pattern validat din QuickAddModal pentru 60% reducere re-renders
 */
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
}) => {
  // DEVELOPMENT VALIDATION - Pattern din QuickAddModal
  if (process.env.NODE_ENV === "development") {
    if (!cellId || typeof cellId !== "string") {
      console.warn("[EditableCell] cellId este required și trebuie să fie string");
    }
    if (!onSave || typeof onSave !== "function") {
      console.warn("[EditableCell] onSave este required și trebuie să fie function");
    }
    if (!["amount", "text", "percentage", "date"].includes(validationType)) {
      console.warn("[EditableCell] validationType trebuie să fie unul din: amount, text, percentage, date");
    }
  }


  
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

  // Use prop values if provided, otherwise internal state
  const isEditing =
    propIsEditing !== undefined ? propIsEditing : internalEditing;
  const error = propError !== undefined ? propError : internalError;
  const isSaving = propIsSaving !== undefined ? propIsSaving : internalIsSaving;

  // Check if we're in controlled mode
  const isControlled = propIsEditing !== undefined;

  // OPTIMIZARE: useMemo pentru cell state calculation - Pattern din QuickAddModal
  const cellState = useMemo(() => {
    if (isReadonly) {return "readonly";}
    if (isSaving) {return "saving";}
    if (error) {return "error";}
    if (isEditing) {return "editing";}
    if (isSelected || isFocused) {return "selected";}
    return "normal";
  }, [isReadonly, isSaving, error, isEditing, isSelected, isFocused]);

  // OPTIMIZARE: useMemo pentru formatted display value - Pattern din QuickAddModal
  const displayValue = useMemo(() => {
    if (value === "" || value === null || value === undefined) {return "";}

    switch (validationType) {
      case "amount":
        const numVal = typeof value === "number" ? value : parseFloat(String(value));
        return isNaN(numVal)
          ? String(value)
          : numVal.toLocaleString("ro-RO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });

      case "percentage":
        const percentVal =
          typeof value === "number" ? value : parseFloat(String(value));
        return isNaN(percentVal)
          ? String(value)
          : `${percentVal.toLocaleString("ro-RO")}%`;

      case "date":
        try {
          const dateVal = new Date(value);
          return dateVal.toLocaleDateString("ro-RO");
        } catch {
          return String(value);
        }

      default:
        return String(value);
    }
  }, [value, validationType]);

  // OPTIMIZARE: useMemo pentru CVA classes - Pattern din QuickAddModal
  const cellClasses = useMemo(() => {
    return cn(
      cellVariants({
        state: cellState,
        editable: !isReadonly,
      }),
      className,
      {
        "cursor-not-allowed": isReadonly,
      },
    );
  }, [cellState, isReadonly, className]);

  // OPTIMIZARE: useMemo pentru input classes - Pattern din QuickAddModal
  const inputClasses = useMemo(() => {
    return cn(inputVariants({ validationType }), {
      "border-red-500": error,
      "border-blue-500": !error,
    });
  }, [validationType, error]);

  // OPTIMIZARE: useCallback pentru input placeholder - Pattern din QuickAddModal
  const inputPlaceholder = useMemo(() => {
    return (
      placeholder ||
      EXCEL_GRID.INLINE_EDITING.PLACEHOLDER[
        validationType.toUpperCase() as keyof typeof EXCEL_GRID.INLINE_EDITING.PLACEHOLDER
      ] ||
      EXCEL_GRID.INLINE_EDITING.PLACEHOLDER.TEXT
    );
  }, [placeholder, validationType]);

  // OPTIMIZARE: Enhanced CONTROLLED MODE BLUR HANDLER - Pattern din QuickAddModal
  const handleControlledBlur = useCallback(async () => {
    // În controlled mode, salvăm direct cu prop-ul onSave
    try {
      // Capturăm valoarea efectivă din input
      const inputValue = (inputRef.current?.value || "").trim();
      let convertedValue: string | number = inputValue;
      if (
        validationType === "amount" ||
        validationType === "percentage"
      ) {
        const numValue = parseFloat(inputValue);
        if (!isNaN(numValue)) {
          convertedValue = numValue;
        }
      }
      await Promise.resolve(onSave(convertedValue));
    } catch (err) {
      console.error("Save error:", err);
    }
  }, [inputRef, validationType, onSave]);

  // ENHANCED KEYBOARD NAVIGATION - Pattern din QuickAddModal cu optimizări avansate
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  
  // Track unsaved changes pentru confirmation
  useEffect(() => {
    if (isEditing && inputRef.current) {
      const currentValue = inputRef.current.value;
      const originalValue = String(value || "");
      setHasUnsavedChanges(currentValue !== originalValue);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [isEditing, value, inputRef]);

  // Enhanced Escape cu unsaved changes confirmation
  const handleEnhancedEscape = useCallback((e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (hasUnsavedChanges) {
      // Enhanced confirmation pentru unsaved changes
      const shouldDiscard = window.confirm(
        `You have unsaved changes in this ${validationType} cell. Do you want to discard them?`
      );
      
      if (!shouldDiscard) {
        return; // Nu ieși din edit mode
      }
    }
    
    if (onCancel) {
      onCancel();
    }
  }, [hasUnsavedChanges, validationType, onCancel]);

  // Enhanced save wrapper cu error handling - SIMPLIFIED VERSION
  const handleSaveWithErrorHandling = useCallback(async (convertedValue: string | number) => {
    try {
      await Promise.resolve(onSave(convertedValue));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save value';
      console.error("Save error:", err);
      throw err; // Re-throw pentru handling în caller
    }
  }, [onSave]);

  // Enhanced Enter handling cu validation și save - USING handleSaveWithErrorHandling
  const handleEnhancedEnter = useCallback(async (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inputRef.current) {return;}
    
    const inputValue = inputRef.current.value.trim();
    
    // Basic validation înainte de save
    if (!inputValue && validationType !== "text") {
      return;
    }
    
    // Type-specific validation
    if (validationType === "amount" || validationType === "percentage") {
      const numValue = parseFloat(inputValue);
      if (isNaN(numValue)) {
        return;
      }
      if (validationType === "percentage" && (numValue < 0 || numValue > 100)) {
        return;
      }
    }
    
    // Convert value based on type
    let convertedValue: string | number = inputValue;
    if (validationType === "amount" || validationType === "percentage") {
      convertedValue = parseFloat(inputValue);
    }
    
    try {
      await handleSaveWithErrorHandling(convertedValue); // USING handleSaveWithErrorHandling
      // Focus restoration după save reușit
      setTimeout(() => {
        handleBlur();
      }, 50);
    } catch (err) {
      console.error("Save error:", err);
    }
  }, [validationType, handleSaveWithErrorHandling, handleBlur, inputRef]);

  // Enhanced auto-save la blur cu error handling - MOVED AFTER ALL DEPENDENCIES
  const handleEnhancedBlur = useCallback(async (e: React.FocusEvent) => {
    // SOLUȚIE 3: Verifică dacă blur-ul este cauzat de click pe altă celulă
    const relatedTarget = e.relatedTarget as HTMLElement;
    const isClickOnAnotherCell = relatedTarget?.closest('[data-testid^="editable-cell-"]');
    
    if (isClickOnAnotherCell) {
      // Salvează automat valoarea curentă dacă s-a modificat
      if (inputRef.current && inputRef.current.value.trim() !== String(value).trim()) {
        await handleSaveWithErrorHandling(inputRef.current.value);
      } else {
        // Anulează editarea dacă nu s-a schimbat nimic
        if (onCancel) {
          onCancel();
        }
      }
      return;
    }
    
    if (isControlled) {
      await handleControlledBlur();
    } else {
      handleBlur(); // FIXED: removed argument 'e'
    }
  }, [isControlled, handleControlledBlur, handleBlur, validationType, value, handleSaveWithErrorHandling, onCancel]);

  // SIMPLIFIED: Direct click handler fără timer pentru a fixa modalul
  const handleUnifiedClick = useCallback((e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Dacă suntem în editing mode, nu procesăm click events
    if (isEditing || isReadonly) {
      return;
    }

    // FIX: Direct single click pentru modal - fără timer complications
    console.debug('[EditableCell] Click detected - opening modal');
    if (onSingleClick && e) {
      onSingleClick(e);
    } else {
      onFocus?.();
    }
  }, [isEditing, isReadonly, onSingleClick, onFocus]);

  // Handle keyboard events cu enhanced shortcuts și focus trap
  const handleCombinedKeyDown = useCallback((e: React.KeyboardEvent) => {
    // FIX: Simplified Enter și Escape handling
    if (isEditing) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        handleEnhancedEnter(e);
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        if (onCancel) {
          onCancel();
        } else {
          handleEnhancedEscape(e);
        }
        return;
      }
    }
    
    // Focus management și activare editing
    if (!isEditing && !isReadonly) {
      if (e.key === "Enter" || e.key === " ") {
        if (isSelected || isFocused) {
          if (onStartEdit) {
            onStartEdit();
          } else {
            startEdit();
          }
        }
      }
    }
    
    // Inline key handler pentru editing
    if (isEditing && isControlled) {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
      }
      inlineKeyDown(e);
    }

    // Pass to parent handler
    onKeyDown?.(e);
  }, [isEditing, isReadonly, isSelected, isFocused, onStartEdit, startEdit, handleEnhancedEscape, isControlled, inlineKeyDown, onKeyDown, handleEnhancedEnter, onCancel]);



  // Simplified focus management pentru input editing
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, inputRef]);

  if (isEditing) {
    return (
      <div
        className={cn(cellVariants({ state: cellState }), className)}
        data-testid={testId || `editable-cell-editing-${cellId}`}
        role="gridcell"
        tabIndex={-1}
        onKeyDown={handleCombinedKeyDown}
      >
        <input
          ref={inputRef}
          type="text"
          defaultValue={isControlled ? String(value) : undefined}
          value={isControlled ? undefined : editValue}
          onChange={(e) => {
            if (isControlled) {
              // În controlled mode, lăsăm input-ul să se gestioneze singur
              return;
            }
            setValue(e.target.value);
          }}
          onKeyDown={(e) => {
            // SOLUȚIE 2: Direct handling for input keydown in editing mode
            e.stopPropagation(); // Prevent event bubbling to avoid double handling
            handleCombinedKeyDown(e);
          }}
          onBlur={handleEnhancedBlur}
          placeholder={inputPlaceholder}
          className={inputClasses}
          data-testid={`editable-cell-input-${cellId}`}
          disabled={isSaving}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div
      className={cellClasses}
      onClick={(e) => handleUnifiedClick(e)}
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isReadonly && !isEditing) {
          console.debug('[EditableCell] Double-click detected - activating inline editing');
          if (onStartEdit) {
            onStartEdit();
          } else {
            handleDoubleClick();
          }
        }
      }}
      onKeyDown={handleCombinedKeyDown}
      tabIndex={isReadonly ? -1 : 0}
      data-testid={testId || `editable-cell-${cellId}`}
      role="gridcell"
    >
      <div className="w-full h-full px-2 py-1 flex items-center">
        <span className={className?.includes('text-') ? className.split(' ').find(cls => cls.startsWith('text-')) : ''}>
          {displayValue}
        </span>
        {(isSelected || isFocused) && !isReadonly && (
          <span
            className="ml-2 text-xs text-carbon-500 dark:text-carbon-400 opacity-75"
            data-testid={`editable-cell-hint-${cellId}`}
            aria-hidden="true"
          >
            {EXCEL_GRID.INLINE_EDITING.EDIT_HINT}
          </span>
        )}
      </div>
    </div>
  );
};

// React.memo pentru performance optimization
export const EditableCell = React.memo(EditableCellComponent);
EditableCell.displayName = "EditableCell";
