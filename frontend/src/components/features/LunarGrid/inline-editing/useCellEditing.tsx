import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useValidation, ValidationType } from "../../../../hooks/useValidation";
import { useCellState, CellState, InteractionState, CellStateConfig } from "./useCellState";

/**
 * 🎯 CORE EDITING INTERFACE - TASK 2 IMPLEMENTATION
 * 
 * Interfață simplificată și consolidată pentru cell editing bazată pe audit-ul din Task 1.
 * Consolidează logica din useInlineCellEdit.tsx și useCellState.tsx într-o singură interfață comprehensivă.
 * 
 * ✨ FEATURES:
 * - API simplificat cu getCellProps/getInputProps pattern
 * - State management consolidat (editing + visual state)
 * - Validare centralizată integrată
 * - Support complet pentru keyboard navigation
 * - Mobile-friendly interactions
 * - TypeScript strict typing
 */

// ===== CORE EDITING INTERFACES =====

export interface UseCellEditingProps {
  /** Identificator unic pentru celulă */
  cellId: string;
  
  /** Valoarea inițială a celulei */
  initialValue: string | number;
  
  /** Callback pentru salvarea valorii (async pentru persistență) */
  onSave: (value: string | number) => Promise<void>;
  
  /** Tipul de validare pentru celulă */
  validationType: "amount" | "text" | "percentage" | "date";
  
  /** Dacă celula este readonly */
  isReadonly?: boolean;
  
  /** Dacă celula este selectată (din TanStack Table) */
  isSelected?: boolean;
  
  /** Dacă celula este focused (din keyboard navigation) */
  isFocused?: boolean;
  
  /** Configurări avansate pentru visual state */
  stateConfig?: {
    smartValidation?: boolean;
    contextualHints?: boolean;
  };
}

export interface UseCellEditingReturn {
  // ===== CORE STATE =====
  /** Dacă celula este în modul de editare */
  isEditing: boolean;
  
  /** Valoarea curentă (string pentru input display) */
  value: string;
  
  /** Valoarea formatată pentru display */
  displayValue: string;
  
  /** Eroare de validare */
  error: string | null;
  
  /** Dacă se salvează momentan */
  isSaving: boolean;
  
  // ===== VISUAL STATE (din useCellState) =====
  /** Starea vizuală calculată a celulei */
  cellState: CellState;
  
  /** Starea de interacțiune (hover, focus, etc.) */
  interactionState: InteractionState;
  
  /** Dacă să afișeze action buttons */
  shouldShowActions: boolean;
  
  /** Dacă să afișeze hints contextuale */
  shouldShowHints: boolean;
  
  // ===== ACTIONS =====
  /** Pornește editarea */
  startEdit: () => void;
  
  /** Actualizează valoarea */
  setValue: (value: string) => void;
  
  /** Salvează modificările */
  saveEdit: () => Promise<void>;
  
  /** Anulează editarea */
  cancelEdit: () => void;
  
  // ===== PROP GETTERS (Simplified API) =====
  /** Props pentru elementul de display al celulei */
  getCellProps: () => {
    'data-cell-id': string;
    'data-cell-state': CellState;
    'data-interaction-state': InteractionState;
    'aria-selected': boolean;
    tabIndex: number;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onMouseDown: () => void;
    onMouseUp: () => void;
    onDoubleClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onTouchStart: () => void;
    onTouchEnd: () => void;
  };
  
  /** Props pentru input-ul de editare */
  getInputProps: () => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    'aria-label': string;
    'aria-invalid': boolean;
    autoFocus: boolean;
    ref: React.RefObject<HTMLInputElement | null>;
  };
}

// ===== CONSOLIDATED CELL EDITING HOOK =====

export const useCellEditing = ({
  cellId,
  initialValue,
  onSave,
  validationType,
  isReadonly = false,
  isSelected = false,
  isFocused = false,
  stateConfig = {},
}: UseCellEditingProps): UseCellEditingReturn => {
  
  // ===== INTERNAL STATE =====
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(String(initialValue));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  // ===== VALIDATION SYSTEM =====
  const validation = useValidation('useCellEditing');
  
  // ===== VISUAL STATE MANAGEMENT =====
  const cellStateConfig: CellStateConfig = useMemo(() => ({
    isReadonly,
    isSaving,
    isEditing,
    isSelected,
    isFocused,
    hasError: !!error,
    hasWarning: false, // TODO: Implementez warnings în viitor
    smartValidation: stateConfig.smartValidation ?? true,
    contextualHints: stateConfig.contextualHints ?? true,
  }), [isReadonly, isSaving, isEditing, isSelected, isFocused, error, stateConfig]);
  
  const cellState = useCellState(cellStateConfig);
  
  // ===== UPDATE VALUE WHEN INITIAL CHANGES =====
  useEffect(() => {
    if (!isEditing) {
      setValue(String(initialValue));
    }
  }, [initialValue, isEditing]);
  
  // ===== VALIDATION LOGIC =====
  const validateValue = useCallback(
    (val: string): string | null => {
      const validationTypeMap: Record<string, ValidationType> = {
        amount: 'amount',
        text: 'text',
        percentage: 'percentage',
        date: 'date',
      };

      const mappedType = validationTypeMap[validationType];
      if (!mappedType) {
        return 'Tip de validare necunoscut';
      }

      const validationOptions = {
        allowEmpty: false,
        ...(validationType === 'amount' && { allowZero: true })
      };

      const result = validation.validateField(
        cellId, 
        val, 
        mappedType, 
        validationOptions
      );

      return result.error || null;
    },
    [validationType, validation, cellId],
  );
  
  // ===== CORE ACTIONS =====
  
  const startEdit = useCallback(() => {
    if (isReadonly) return;

    setIsEditing(true);
    setError(null);
    validation.clearFieldError(cellId);

    // Focus input după state update
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  }, [isReadonly, validation, cellId]);
  
  // ===== UPDATE VALUE (cu clear error automat) =====
  const updateValue = useCallback((newValue: string) => {
    setValue(newValue);
    // Clear error automat când se schimbă valoarea
    if (error) {
      setError(null);
      validation.clearFieldError(cellId);
    }
  }, [error, validation, cellId]);
  
  const saveEdit = useCallback(async () => {
    const currentValue = value.trim();

    // Acceptă valori goale (șterge conținutul)
    if (!currentValue) {
      setIsEditing(false);
      setValue(String(initialValue));
      validation.clearFieldError(cellId);
      return;
    }

    const validationError = validateValue(currentValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Convertește valoarea pentru backend
      let convertedValue: string | number = currentValue;
      if (validationType === "amount" || validationType === "percentage") {
        const numValue = parseFloat(currentValue);
        if (!isNaN(numValue)) {
          convertedValue = numValue;
        }
      }

      await onSave(convertedValue);
      setIsEditing(false);
      validation.clearFieldError(cellId);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : typeof err === 'string' 
        ? err 
        : 'Eroare la salvare. Încearcă din nou.';
      
      setError(errorMessage);
      validation.setCustomError(cellId, errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [value, validateValue, onSave, validationType, initialValue, validation, cellId]);
  
  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setValue(String(initialValue));
    setError(null);
    setIsSaving(false);
    validation.clearFieldError(cellId);
  }, [initialValue, validation, cellId]);
  
  // ===== KEYBOARD HANDLING =====
  const handleCellKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isEditing) return; // În edit mode, input-ul gestionează tastele
      
      switch (e.key) {
        case "Enter":
        case "F2":
          e.preventDefault();
          e.stopPropagation();
          startEdit();
          break;
      }
    },
    [isEditing, startEdit],
  );
  
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          saveEdit();
          break;

        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          cancelEdit();
          break;

        case "Tab":
          e.preventDefault();
          e.stopPropagation();
          saveEdit();
          break;
      }
    },
    [saveEdit, cancelEdit],
  );
  
  // ===== INPUT CHANGE HANDLER =====
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateValue(e.target.value);
    },
    [updateValue],
  );
  
  // ===== BLUR HANDLING =====
  const handleInputBlur = useCallback(() => {
    // Auto-save dacă valoarea s-a schimbat
    if (value.trim() !== String(initialValue).trim()) {
      saveEdit();
    } else {
      cancelEdit();
    }
  }, [value, initialValue, saveEdit, cancelEdit]);
  
  // ===== COMPUTED VALUES =====
  const displayValue = useMemo(() => {
    if (isEditing) return value;
    
    // Format pentru display bazat pe tipul de validare
    const stringValue = String(initialValue);
    
    switch (validationType) {
      case 'amount':
        const numValue = parseFloat(stringValue);
        return isNaN(numValue) ? stringValue : numValue.toLocaleString('ro-RO', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      case 'percentage':
        const percentValue = parseFloat(stringValue);
        return isNaN(percentValue) ? stringValue : `${percentValue}%`;
      default:
        return stringValue;
    }
  }, [isEditing, value, initialValue, validationType]);

  // ===== STABILIZEZ CELLSTATE PENTRU PERFORMANCE =====
  const stableCellState = useMemo(() => ({
    cellState: cellState.cellState,
    interactionState: cellState.interactionState,
    handleMouseEnter: cellState.handleMouseEnter,
    handleMouseLeave: cellState.handleMouseLeave,
    handleFocus: cellState.handleFocus,
    handleBlur: cellState.handleBlur,
    handleMouseDown: cellState.handleMouseDown,
    handleMouseUp: cellState.handleMouseUp,
    handleTouchStart: cellState.handleTouchStart,
    handleTouchEnd: cellState.handleTouchEnd,
  }), [
    cellState.cellState,
    cellState.interactionState,
    cellState.handleMouseEnter,
    cellState.handleMouseLeave,
    cellState.handleFocus,
    cellState.handleBlur,
    cellState.handleMouseDown,
    cellState.handleMouseUp,
    cellState.handleTouchStart,
    cellState.handleTouchEnd,
  ]);
  
  // ===== PROP GETTERS =====
  const getCellProps = useCallback(() => ({
    'data-cell-id': cellId,
    'data-cell-state': stableCellState.cellState,
    'data-interaction-state': stableCellState.interactionState,
    'aria-selected': isSelected,
    tabIndex: isFocused ? 0 : -1,
    onMouseEnter: stableCellState.handleMouseEnter,
    onMouseLeave: stableCellState.handleMouseLeave,
    onFocus: stableCellState.handleFocus,
    onBlur: stableCellState.handleBlur,
    onMouseDown: stableCellState.handleMouseDown,
    onMouseUp: stableCellState.handleMouseUp,
    onDoubleClick: startEdit,
    onKeyDown: handleCellKeyDown,
    onTouchStart: stableCellState.handleTouchStart,
    onTouchEnd: stableCellState.handleTouchEnd,
  }), [
    cellId, 
    stableCellState,
    isSelected, 
    isFocused, 
    startEdit, 
    handleCellKeyDown
  ]);
  
  const getInputProps = useCallback(() => ({
    value,
    onChange: handleInputChange,
    onBlur: handleInputBlur,
    onKeyDown: handleInputKeyDown,
    'aria-label': `Editează celula ${cellId}`,
    'aria-invalid': !!error,
    autoFocus: true,
    ref: inputRef,
  }), [
    value, 
    handleInputChange, 
    handleInputBlur, 
    handleInputKeyDown, 
    cellId, 
    error
  ]);
  
  // ===== RETURN INTERFACE =====
  return {
    // Core state
    isEditing,
    value,
    displayValue,
    error,
    isSaving,
    
    // Visual state
    cellState: stableCellState.cellState,
    interactionState: stableCellState.interactionState,
    shouldShowActions: cellState.shouldShowActions,
    shouldShowHints: cellState.shouldShowHints,
    
    // Actions
    startEdit,
    setValue: updateValue,
    saveEdit,
    cancelEdit,
    
    // Prop getters (Simplified API)
    getCellProps,
    getInputProps,
  };
}; 