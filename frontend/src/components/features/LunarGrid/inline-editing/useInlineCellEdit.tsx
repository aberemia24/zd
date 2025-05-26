import { useState, useCallback, useRef, useEffect } from 'react';
import { EXCEL_GRID } from '@shared-constants';

/**
 * Hook pentru gestionarea inline editing în celule
 * Implementează logica de editare, validare și salvare
 */

export interface UseInlineCellEditProps {
  cellId: string;
  initialValue: string | number;
  onSave: (value: string | number) => Promise<void>; // amount/percentage = number, text/date = string
  validationType: 'amount' | 'text' | 'percentage' | 'date';
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
  isReadonly = false
}: UseInlineCellEditProps): UseInlineCellEditReturn => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(String(initialValue));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Update value when initialValue changes
  useEffect(() => {
    setValue(String(initialValue));
  }, [initialValue]);

  // Validate value based on type
  const validateValue = useCallback((val: string): string | null => {
    const stringVal = String(val).trim();
    if (!stringVal) {
      return EXCEL_GRID.INLINE_EDITING.VALIDATION_ERRORS.EMPTY_VALUE;
    }

    switch (validationType) {
      case 'amount':
        // Acceptăm numere cu punct (450.5) - standard international
        const numVal = parseFloat(stringVal);
        if (isNaN(numVal)) {
          return EXCEL_GRID.INLINE_EDITING.VALIDATION_ERRORS.INVALID_NUMBER;
        }
        if (numVal < 0) {
          return EXCEL_GRID.INLINE_EDITING.VALIDATION_ERRORS.NEGATIVE_VALUE;
        }
        break;

      case 'percentage':
        const percentVal = parseFloat(stringVal);
        if (isNaN(percentVal)) {
          return EXCEL_GRID.INLINE_EDITING.VALIDATION_ERRORS.INVALID_PERCENTAGE;
        }
        if (percentVal < 0 || percentVal > 100) {
          return EXCEL_GRID.INLINE_EDITING.VALIDATION_ERRORS.PERCENTAGE_RANGE;
        }
        break;

      case 'date':
        try {
          const dateVal = new Date(stringVal);
          if (isNaN(dateVal.getTime())) {
            return EXCEL_GRID.INLINE_EDITING.VALIDATION_ERRORS.INVALID_DATE;
          }
        } catch {
          return EXCEL_GRID.INLINE_EDITING.VALIDATION_ERRORS.INVALID_DATE;
        }
        break;

      case 'text':
        if (stringVal.length > 255) {
          return EXCEL_GRID.INLINE_EDITING.VALIDATION_ERRORS.TEXT_TOO_LONG;
        }
        break;
    }

    return null;
  }, [validationType]);

  // Start editing mode
  const startEdit = useCallback(() => {
    if (isReadonly) return;
    
    setIsEditing(true);
    setError(null);
    
    // Focus input after state update
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  }, [isReadonly]);

  // Save value
  const saveValue = useCallback(async () => {
    const validationError = validateValue(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Pentru grid: amount/percentage = number, text/date = string
      // Utilizatorul introduce cu punct (450.5), convertim la number pentru calcule
      let convertedValue: string | number = value;
      if (validationType === 'amount' || validationType === 'percentage') {
        convertedValue = parseFloat(value);
      }

      await onSave(convertedValue);
      setIsEditing(false);
    } catch (err: any) {
      // Show the actual error message from the network
      const errorMessage = err?.message || err?.toString() || EXCEL_GRID.INLINE_EDITING.SAVE_ERROR;
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [value, validateValue, onSave, validationType]);

  // Cancel editing
  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setValue(String(initialValue));
    setError(null);
  }, [initialValue]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        saveValue();
        break;
        
      case 'Escape':
        e.preventDefault();
        cancelEdit();
        break;
        
      case 'Tab':
        // Let Tab bubble up for navigation
        saveValue();
        break;
    }
  }, [saveValue, cancelEdit]);

  // Handle blur (auto-save)
  const handleBlur = useCallback(() => {
    if (isEditing) {
      saveValue();
    }
  }, [isEditing, saveValue]);

  // Handle double click
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
    inputRef
  };
}; 