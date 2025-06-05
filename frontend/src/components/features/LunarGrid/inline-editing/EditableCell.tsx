import React, { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { cn } from "../../../../styles/cva-v2";
import { cva } from "class-variance-authority";
import { useInlineCellEdit } from "./useInlineCellEdit";
import { EXCEL_GRID } from "@shared-constants";
import { TransactionType } from '@shared-constants';

/**
 * Componenta EditableCell pentru LunarGrid
 * Implementează inline editing cu visual feedback conform Creative Phase decisions
 * OPTIMIZAT cu pattern-urile validate din QuickAddModal (Task #5)
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
        selected: "bg-blue-50 border-2 border-blue-400 cursor-text",
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
    if (isReadonly) return "readonly";
    if (isSaving) return TransactionType.SAVING;
    if (error) return "error";
    if (isEditing) return "editing";
    if (isSelected || isFocused) return "selected";
    return "normal";
  }, [isReadonly, isSaving, error, isEditing, isSelected, isFocused]);

  // OPTIMIZARE: useMemo pentru formatted display value - Pattern din QuickAddModal
  const displayValue = useMemo(() => {
    if (value === "" || value === null || value === undefined) return "";

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

  // ENHANCED ARIA SUPPORT - Pattern din QuickAddModal cu aria-live announcements
  const [ariaAnnouncement, setAriaAnnouncement] = useState<string>("");
  
  // Screen reader announcements pentru edit mode transitions
  useEffect(() => {
    if (isEditing) {
      setAriaAnnouncement(`Started editing ${validationType} cell. Press Enter to save, Escape to cancel.`);
    } else if (ariaAnnouncement && !isEditing) {
      setAriaAnnouncement(`Stopped editing ${validationType} cell.`);
      // Clear announcement după 3 secunde
      const timer = setTimeout(() => setAriaAnnouncement(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [isEditing, validationType, ariaAnnouncement]);
  
  // Enhanced aria-describedby pentru status changes cu loading feedback
  const enhancedAriaDescribedBy = useMemo(() => {
    const parts = [`cell-${cellId}-description`];
    if (error) parts.push(`error-${cellId}`);
    if (isSaving) parts.push(`saving-${cellId}`);
    if (ariaAnnouncement) parts.push(`announcement-${cellId}`);
    return parts.join(" ");
  }, [cellId, error, isSaving, ariaAnnouncement]);

  // Enhanced ARIA labels pentru controlled/uncontrolled modes
  const getAriaLabel = useCallback(() => {
    const baseLabel = `${validationType} cell`;
    const valueLabel = displayValue ? ` with value ${displayValue}` : "";
    const modeLabel = isControlled ? " (controlled mode)" : "";
    const editLabel = isEditing ? " - currently editing" : "";
    const readonlyLabel = isReadonly ? " (read-only)" : " (editable)";
    
    return `${baseLabel}${valueLabel}${modeLabel}${editLabel}${readonlyLabel}`;
  }, [validationType, displayValue, isControlled, isEditing, isReadonly]);

  // ENHANCED ARIA SUPPORT pentru F2 key activation și type-to-edit mode entry
  const announceEditActivation = useCallback((method: 'f2' | 'double-click' | 'character-type') => {
    const methodMessages = {
      'f2': 'Edit mode activated with F2 key',
      'double-click': 'Edit mode activated with double-click', 
      'character-type': 'Edit mode activated by typing'
    };
    setAriaAnnouncement(`${methodMessages[method]}. ${validationType} cell editing started.`);
  }, [validationType]);

  // OPTIMIZARE: Enhanced ARIA described by ID-uri pentru constante
  const ariaIds = useMemo(() => ({
    description: `cell-${cellId}-description`,
    error: `error-${cellId}`,
    saving: `saving-${cellId}`,
    announcement: `announcement-${cellId}`
  }), [cellId]);

  // ENHANCED FOCUS MANAGEMENT - Pattern din QuickAddModal cu Focus Trap
  const focusTrapRef = useRef<HTMLDivElement>(null);
  
  // Focus trap logic pentru edit mode
  const handleFocusTrap = useCallback((e: React.KeyboardEvent) => {
    if (!isEditing || !focusTrapRef.current) return;
    
    // Focus trap pentru Tab cycling în edit mode
    if (e.key === "Tab") {
      e.preventDefault();
      
      // În edit mode, input-ul este singurul element focusable
      // Tab cycling se limitează la input pentru consistency
      if (inputRef.current) {
        inputRef.current.focus();
        // Selectează textul pentru instant edit experience
        inputRef.current.select();
      }
    }
  }, [isEditing, inputRef]);

  // Enhanced auto-focus pentru edit mode entry cu timing control
  useEffect(() => {
    if (isEditing && inputRef.current) {
      // Delay pentru a asigura că DOM-ul este gata
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Selectează textul pentru instant edit experience
          inputRef.current.select();
        }
      }, 10);
      
      return () => clearTimeout(timer);
    }
  }, [isEditing, inputRef]);

  // Focus restoration la exit din edit mode
  const handleEditExit = useCallback(() => {
    if (focusTrapRef.current) {
      // Restore focus la celula prin focus-ul pe container
      focusTrapRef.current.focus();
    }
  }, []);

  // Enhanced onCancel cu focus restoration
  const handleEnhancedCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    // Focus restoration delay pentru a permite state update
    setTimeout(() => {
      handleEditExit();
    }, 50);
  }, [onCancel, handleEditExit]);

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

  // ENHANCED CONTROLLED MODE BLUR HANDLER - Pattern din QuickAddModal
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
        setAriaAnnouncement("Edit cancelled. Unsaved changes kept.");
        return; // Nu ieși din edit mode
      }
      
      setAriaAnnouncement("Edit cancelled. Unsaved changes discarded.");
    } else {
      setAriaAnnouncement("Edit cancelled.");
    }
    
    handleEnhancedCancel();
  }, [hasUnsavedChanges, validationType, handleEnhancedCancel]);

  // Enhanced save wrapper cu error handling - SIMPLIFIED VERSION
  const handleSaveWithErrorHandling = useCallback(async (convertedValue: string | number) => {
    try {
      await Promise.resolve(onSave(convertedValue));
      setAriaAnnouncement(`${validationType} value saved successfully.`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save value';
      setAriaAnnouncement(`Error occurred: ${errorMessage}`);
      console.error("Save error:", err);
      throw err; // Re-throw pentru handling în caller
    }
  }, [onSave, validationType]);

  // Enhanced Enter handling cu validation și save - USING handleSaveWithErrorHandling
  const handleEnhancedEnter = useCallback(async (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inputRef.current) return;
    
    const inputValue = inputRef.current.value.trim();
    
    // Basic validation înainte de save
    if (!inputValue && validationType !== "text") {
      setAriaAnnouncement(`${validationType} cannot be empty. Please enter a valid value.`);
      return;
    }
    
    // Type-specific validation
    if (validationType === "amount" || validationType === "percentage") {
      const numValue = parseFloat(inputValue);
      if (isNaN(numValue)) {
        setAriaAnnouncement(`Invalid ${validationType}. Please enter a valid number.`);
        return;
      }
      if (validationType === "percentage" && (numValue < 0 || numValue > 100)) {
        setAriaAnnouncement("Percentage must be between 0 and 100.");
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
        handleEditExit();
      }, 50);
    } catch (err) {
      console.error("Save error:", err);
      setAriaAnnouncement(`Failed to save ${validationType}. Please try again.`);
    }
  }, [validationType, handleSaveWithErrorHandling, handleEditExit, inputRef]);

  // Enhanced auto-save la blur cu error handling - MOVED AFTER ALL DEPENDENCIES
  const handleEnhancedBlur = useCallback(async (e: React.FocusEvent) => {
    // Verifică dacă focus-ul rămâne în componenta curentă
    if (focusTrapRef.current?.contains(e.relatedTarget as Node)) {
      return; // Nu salvează dacă focus-ul rămâne în edit mode
    }
    
    if (isControlled) {
      await handleControlledBlur();
    } else {
      handleBlur(); // FIXED: removed argument 'e'
    }
    
    setAriaAnnouncement(`Auto-saved ${validationType} value on blur.`);
  }, [isControlled, handleControlledBlur, handleBlur, validationType]);

  // Handle keyboard events cu enhanced shortcuts și focus trap
  const handleCombinedKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Previne form submission în toate cazurile
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Enhanced keyboard shortcuts pentru toate stările
    if (e.key === "Escape" && isEditing) {
      e.preventDefault();
      e.stopPropagation();
      handleEnhancedEscape(e);
    }
    
    if (e.key === "Enter" && isEditing && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleEnhancedEnter(e);
    }
    
    // Focus management și activare editing
    if (!isEditing && !isReadonly) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        if (isSelected || isFocused) {
          announceEditActivation('f2');
          if (onStartEdit) {
            onStartEdit();
          } else {
            startEdit();
          }
        }
      }
    }
    
    // Enhanced focus trap în grid pentru editing mode
    if (isEditing && e.key === "Tab") {
      handleFocusTrap(e);
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
  }, [isEditing, isReadonly, isSelected, isFocused, onStartEdit, startEdit, handleEnhancedEscape, isControlled, inlineKeyDown, onKeyDown, handleFocusTrap, handleEnhancedEnter, announceEditActivation]);

  // Handle cell click pentru focus și start edit (single click activation)
  const handleCellClick = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // LGI TASK 5: Single click NU mai activează editarea inline
    // În schimb, va fi folosit pentru modal (implementat în parent component)
    if (!isEditing) {
      // Dacă avem handler pentru single click modal, îl apelăm
      if (onSingleClick && e) {
        onSingleClick(e);
      } else {
        onFocus?.();
      }
    }
  }, [isEditing, onSingleClick, onFocus]);

  // Handle character typing pentru immediate edit activation (type-to-edit) - FIXED dependencies
  const handleCharacterTyping = useCallback((e: React.KeyboardEvent) => {
    // Type-to-edit: daca nu suntem în edit mode și se tastează un caracter
    if (!isEditing && !isReadonly && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const char = e.key;
      // Verifică dacă este un caracter printabil (nu F1-F12, arrows, etc.)
      if (char.length === 1 && char.match(/[a-zA-Z0-9.,\-\s]/)) {
        e.preventDefault();
        // Anunță activarea prin typing pentru screen readers
        announceEditActivation('character-type');
        // Activează editarea cu caracterul tastat
        if (onStartEdit) {
          onStartEdit();
        } else {
          startEdit();
        }
        // După activare, setează valoarea cu caracterul tastat
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.value = char;
            inputRef.current.setSelectionRange(1, 1); // Cursor la sfârșitul caracterului
            // Trigger onChange event
            const event = new Event("input", { bubbles: true });
            inputRef.current.dispatchEvent(event);
          }
        }, 0);
        return;
      }
    }

    // Continue cu keyboard handling normal
    handleCombinedKeyDown(e);
  }, [isEditing, isReadonly, onStartEdit, startEdit, inputRef, handleCombinedKeyDown, announceEditActivation]);

  // Handle double click pentru start edit - FIXED dependencies
  const handleCellDoubleClick = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isEditing && !isReadonly) {
      // LGI TASK 5: Double click activează inline editing cu ARIA announcement
      announceEditActivation('double-click');
      if (onStartEdit) {
        onStartEdit();
      } else {
        handleDoubleClick();
      }
    }
  }, [isEditing, isReadonly, onStartEdit, handleDoubleClick, announceEditActivation]);

  // OPTIMIZARE: useMemo pentru loading spinner animation class - Pattern din QuickAddModal
  const loadingSpinnerClass = useMemo(() => {
    return cn(
      "w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin",
      {
        "transition-opacity duration-300 ease-in-out": true,
        "opacity-100": isSaving,
        "opacity-0": !isSaving
      }
    );
  }, [isSaving]);

  // ENHANCED LOADING STATES - Pattern din QuickAddModal cu smooth transitions
  const loadingOverlayClass = useMemo(() => {
    return cn(
      "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out",
      {
        "bg-white bg-opacity-75 backdrop-blur-sm": isEditing,
        "bg-carbon-100 dark:bg-carbon-800 bg-opacity-50": !isEditing,
        "opacity-100 pointer-events-auto": isSaving,
        "opacity-0 pointer-events-none": !isSaving
      }
    );
  }, [isEditing, isSaving]);

  // Enhanced error animation cu smooth transitions
  const errorDisplayClass = useMemo(() => {
    return cn(
      "absolute top-full left-0 z-10 mt-1 px-2 py-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded shadow-sm whitespace-nowrap",
      "transition-all duration-300 ease-in-out transform",
      {
        "opacity-100 translate-y-0 scale-100": error,
        "opacity-0 -translate-y-2 scale-95 pointer-events-none": !error
      }
    );
  }, [error]);

  // Simulate loading progress pentru enhanced UX
  useEffect(() => {
    if (isSaving) {
      let progressValue = 0;
      const progressInterval = setInterval(() => {
        progressValue += 10;
        if (progressValue >= 90) {
          clearInterval(progressInterval);
        }
      }, 100);
      
      return () => clearInterval(progressInterval);
    }
  }, [isSaving]);

  // Enhanced success feedback cu aria announcement
  const [showSuccessFeedback, setShowSuccessFeedback] = useState<boolean>(false);
  
  useEffect(() => {
    if (!isSaving && showSuccessFeedback) {
      const timer = setTimeout(() => {
        setShowSuccessFeedback(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, showSuccessFeedback]);

  // Enhanced focus management pentru input editing
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, inputRef]);

  // DEVELOPMENT VALIDATION ENHANCED - Pattern din QuickAddModal cu metrici
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Enhanced props validation cu detalii specifice
      const validationErrors: string[] = [];
      
      if (!cellId || typeof cellId !== "string") {
        validationErrors.push("cellId is required and must be a non-empty string");
      }
      
      if (!onSave || typeof onSave !== "function") {
        validationErrors.push("onSave is required and must be a function");
      }
      
      if (!["amount", "text", "percentage", "date"].includes(validationType)) {
        validationErrors.push(`validationType must be one of: amount, text, percentage, date. Got: ${validationType}`);
      }
      
      // Enhanced TypeScript validation pentru controlled/uncontrolled modes
      if (propIsEditing !== undefined && propError === undefined) {
        console.warn("[EditableCell] Using controlled isEditing but error is uncontrolled. Consider controlling error state too.");
      }
      
      if (propIsSaving !== undefined && propIsEditing === undefined) {
        console.warn("[EditableCell] Using controlled isSaving but isEditing is uncontrolled. Consider controlling both states.");
      }
      
      // Validation pentru formatters și value types
      if (validationType === "amount" || validationType === "percentage") {
        if (value !== null && value !== undefined && value !== "" && isNaN(Number(value))) {
          console.warn(`[EditableCell] ${validationType} value should be numeric. Got:`, typeof value, value);
        }
      }
      
      // Performance metrics pentru development
      const renderTime = performance.now();
      console.debug(`[EditableCell] ${cellId} rendered in ${renderTime.toFixed(2)}ms`, {
        props: Object.keys({ cellId, value, validationType, isEditing, error, isSaving }).length,
        controlled: isControlled ? "controlled" : "uncontrolled",
        state: cellState
      });
      
      if (validationErrors.length > 0) {
        console.error("[EditableCell] Validation errors:", validationErrors);
      }
    }
  }, [cellId, onSave, validationType, propIsEditing, propError, propIsSaving, value, isControlled, cellState, isEditing, error, isSaving]);

  if (isEditing) {
    return (
      <div
        ref={focusTrapRef}
        className={cn(cellVariants({ state: cellState }), className)}
        data-testid={testId || `editable-cell-editing-${cellId}`}
        role="gridcell"
        aria-label={getAriaLabel()}
        aria-describedby={enhancedAriaDescribedBy}
        aria-live="polite"
        tabIndex={-1}
        onKeyDown={handleCharacterTyping}
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
            // Previne form submission
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
            }
            handleCombinedKeyDown(e);
          }}
          onBlur={handleEnhancedBlur}
          placeholder={inputPlaceholder}
          className={inputClasses}
          data-testid={`editable-cell-input-${cellId}`}
          aria-label={`Edit ${validationType} value`}
          aria-describedby={enhancedAriaDescribedBy}
          disabled={isSaving}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
        <div id={ariaIds.description} className="sr-only">
          {ariaAnnouncement}
        </div>
        {/* ENHANCED LOADING FEEDBACK - Pattern din QuickAddModal cu ARIA */}
        {isSaving && (
          <div
            id={ariaIds.saving}
            className={loadingOverlayClass}
            role="status"
            aria-live="polite"
            aria-label={EXCEL_GRID.INLINE_EDITING.SAVING || "Saving..."}
          >
            <div className={loadingSpinnerClass} />
          </div>
        )}
        {/* ENHANCED ERROR DISPLAY - Pattern din QuickAddModal cu enhanced ARIA */}
        {error && (
          <div
            id={ariaIds.error}
            className={errorDisplayClass}
            data-testid={`editable-cell-error-${cellId}`}
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
        {/* ARIA LIVE ANNOUNCEMENTS REGION - Pattern din QuickAddModal */}
        {ariaAnnouncement && (
          <div
            id={ariaIds.announcement}
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {ariaAnnouncement}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={focusTrapRef}
      className={cellClasses}
      onClick={(e) => handleCellClick(e)}
      onDoubleClick={(e) => handleCellDoubleClick(e)}
      onKeyDown={handleCharacterTyping}
      tabIndex={isReadonly ? -1 : 0}
      data-testid={testId || `editable-cell-${cellId}`}
      role="gridcell"
      aria-label={getAriaLabel()}
      aria-describedby={ariaIds.description}
      aria-live="polite"
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
      {/* ENHANCED LOADING FEEDBACK - Pattern din QuickAddModal cu ARIA */}
      {isSaving && (
        <div
          id={ariaIds.saving}
          className={loadingOverlayClass}
          role="status"
          aria-live="polite"
          aria-label={EXCEL_GRID.INLINE_EDITING.SAVING || "Saving..."}
        >
          <div className={loadingSpinnerClass} />
        </div>
      )}
      {/* ARIA DESCRIPTION pentru screen readers */}
      <div id={ariaIds.description} className="sr-only">
        {`${validationType} cell. Double-click to edit, F2 to edit, or type to start editing.`}
      </div>
      {/* ARIA LIVE ANNOUNCEMENTS REGION pentru non-editing state */}
      {ariaAnnouncement && (
        <div
          id={ariaIds.announcement}
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {ariaAnnouncement}
        </div>
      )}
    </div>
  );
};

// REACT.MEMO CU CUSTOM COMPARISON - Pattern validat din QuickAddModal
// Target: 60% reducere re-renders pentru 17 props
export const EditableCell = React.memo(EditableCellComponent, (prevProps, nextProps) => {
  // Custom comparison pentru optimizare maximă
  return (
    prevProps.cellId === nextProps.cellId &&
    prevProps.value === nextProps.value &&
    prevProps.validationType === nextProps.validationType &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.error === nextProps.error &&
    prevProps.isSaving === nextProps.isSaving &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isFocused === nextProps.isFocused &&
    prevProps.isReadonly === nextProps.isReadonly &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.className === nextProps.className &&
    prevProps.onSave === nextProps.onSave &&
    prevProps.onFocus === nextProps.onFocus &&
    prevProps.onKeyDown === nextProps.onKeyDown &&
    prevProps.onStartEdit === nextProps.onStartEdit &&
    prevProps.onCancel === nextProps.onCancel &&
    prevProps.onSingleClick === nextProps.onSingleClick &&
    prevProps["data-testid"] === nextProps["data-testid"]
  );
});

// DisplayName pentru debugging - Pattern din QuickAddModal
EditableCell.displayName = "EditableCell";
