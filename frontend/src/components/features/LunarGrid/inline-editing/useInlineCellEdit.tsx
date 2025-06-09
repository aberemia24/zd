import { useState, useCallback, useRef, useEffect } from "react";
import { useValidation, ValidationType } from "../../../../hooks/useValidation";

/**
 * Enhanced Hook pentru gestionarea inline editing în celule cu validare centralizată
 * 
 * FEATURES:
 * - Validare centralizată folosind useValidation hook
 * - Feedback instant cu warnings și context
 * - Error handling enhanced
 * - Support pentru toate tipurile de validare
 */

export interface UseInlineCellEditProps {
  cellId: string;
  initialValue: string | number;
  onSave: (value: string | number) => Promise<void>; // amount/percentage = number, text/date = string
  validationType: "amount" | "text" | "percentage" | "date";
  isReadonly?: boolean;
}

export interface UseInlineCellEditReturn {
  isEditing: boolean;
  value: string;
  error: string | null;
  isSaving: boolean;
  startEdit: () => void;
  setValue: (value: string) => void;
  saveEdit: () => Promise<void>;
  cancelEdit: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleBlur: () => void;
  handleDoubleClick: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const useInlineCellEdit = ({
  cellId,
  initialValue,
  onSave,
  validationType,
  isReadonly = false,
}: UseInlineCellEditProps): UseInlineCellEditReturn => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(String(initialValue));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Enhanced: Validare centralizată
  const validation = useValidation('useInlineCellEdit');

  // Update value when initialValue changes
  useEffect(() => {
    setValue(String(initialValue));
  }, [initialValue]);

  /**
   * Enhanced: Validare folosind sistemul centralizat
   */
  const validateValue = useCallback(
    (val: string): string | null => {
      // Map validation type la tipul centralizat
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

      // 🔧 FIX: Pentru amount, permitem 0 (pentru ștergere tranzacții)
      const validationOptions = {
        allowEmpty: false,
        ...(validationType === 'amount' && { allowZero: true })
      };

      // Validare folosind sistemul centralizat
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

  // Start editing mode
  const startEdit = useCallback(() => {
    if (isReadonly) return;

    setIsEditing(true);
    setError(null);
    validation.clearFieldError(cellId);

    // Focus input after state update
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  }, [isReadonly, validation, cellId]);

  /**
   * Enhanced: Save value cu error handling îmbunătățit și warnings
   */
  const saveValue = useCallback(async () => {
    const currentValue = value.trim();

    // Acceptă valori goale (șterge tranzacția)
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
      // Pentru grid: amount/percentage = number, text/date = string
      // Utilizatorul introduce cu punct (450.5), convertim la number pentru calcule
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

      // Enhanced: Log warnings pentru sume mari
      if (validationType === 'amount' && typeof convertedValue === 'number') {
        const warnings = validation.state.warnings[cellId];
        if (warnings && warnings.length > 0) {
          console.info(`[InlineEdit] ${cellId} warnings:`, warnings);
        }
      }

    } catch (err: unknown) {
      // Enhanced: Error handling cu context
      const errorMessage = err instanceof Error 
        ? err.message 
        : typeof err === 'string' 
        ? err 
        : 'Eroare la salvare. Încearcă din nou.';
      
      setError(errorMessage);
      validation.setCustomError(cellId, errorMessage);
      
      console.error(`[InlineEdit] Save error for ${cellId}:`, {
        error: err,
        cellId,
        value: currentValue,
        validationType,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsSaving(false);
    }
  }, [value, validateValue, onSave, validationType, initialValue, validation, cellId]);

  // Cancel editing cu reset complet
  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setValue(String(initialValue)); // Reset la valoarea inițială
    setError(null);
    setIsSaving(false);
    validation.clearFieldError(cellId);
  }, [initialValue, validation, cellId]);

  // Handle keyboard events cu Escape fix și validare îmbunătățită
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Doar preventDefault pentru tastele pe care le gestionăm, nu stopPropagation

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          e.stopPropagation(); // PREVINE PROPAGAREA care cauzează refresh
          saveValue();
          break;

        case "Escape":
          e.preventDefault();
          e.stopPropagation(); // PREVINE PROPAGAREA 
          cancelEdit(); // Anulare directă, nu prin blur
          break;

        case "Tab":
          // Salvează și permite Tab navigation normal
          e.preventDefault();
          e.stopPropagation(); // PREVINE PROPAGAREA 
          saveValue();
          break;
      }
    },
    [saveValue, cancelEdit],
  );

  // Handle blur cu salvare automată îmbunătățită
  const handleBlur = useCallback(() => {
    // Enhanced: Salvează automat doar dacă valoarea s-a schimbat
    if (value.trim() !== String(initialValue).trim()) {
      saveValue();
    } else {
      // Anulează editarea dacă nu s-a schimbat nimic
      cancelEdit();
    }
  }, [value, initialValue, saveValue, cancelEdit]);

  // Handle double click pentru start editing
  const handleDoubleClick = useCallback(() => {
    startEdit();
  }, [startEdit]);

  return {
    isEditing,
    value,
    error,
    isSaving,
    startEdit,
    setValue,
    saveEdit: saveValue,
    cancelEdit,
    handleKeyDown,
    handleBlur,
    handleDoubleClick,
    inputRef,
  };
};
