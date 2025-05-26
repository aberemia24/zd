import React from 'react';
import { cn } from '../../../../styles/cva/shared/utils';
import { cva } from 'class-variance-authority';
import { useInlineCellEdit } from './useInlineCellEdit';
import { EXCEL_GRID } from '@shared-constants';

/**
 * Componenta EditableCell pentru LunarGrid
 * Implementează inline editing cu visual feedback conform Creative Phase decisions
 */

export interface EditableCellProps {
  cellId: string;
  value: string | number;
  onSave: (value: string | number) => Promise<void>; // amount/percentage = number, text/date = string
  validationType: 'amount' | 'text' | 'percentage' | 'date';
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
  'data-testid'?: string;
}

// CVA variants pentru cell states
const cellVariants = cva(
  "relative w-full h-full text-sm transition-all duration-150 border-0 outline-none",
  {
    variants: {
      state: {
        normal: "bg-white hover:bg-gray-50 cursor-pointer text-gray-900",
        selected: "bg-blue-50 border-2 border-blue-400 cursor-text",
        editing: "bg-white ring-2 ring-blue-500 ring-inset cursor-text",
        error: "bg-red-50 border-2 border-red-400 cursor-text",
        saving: "bg-gray-100 opacity-70 cursor-wait",
        readonly: "bg-gray-50 cursor-default opacity-60"
      },
      editable: {
        true: "hover:bg-gray-50",
        false: "cursor-default"
      }
    },
    defaultVariants: {
      state: "normal",
      editable: true
    }
  }
);

const inputVariants = cva(
  "w-full h-full px-2 py-1 text-sm font-normal border-0 outline-none bg-transparent",
  {
    variants: {
      validationType: {
        amount: "text-right font-mono",
        percentage: "text-right font-mono",
        text: "text-left",
        date: "text-center font-mono"
      }
    },
    defaultVariants: {
      validationType: "text"
    }
  }
);

export const EditableCell: React.FC<EditableCellProps> = ({
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
  'data-testid': testId
}) => {
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
    inputRef
  } = useInlineCellEdit({
    cellId,
    initialValue: value,
    onSave,
    validationType,
    isReadonly
  });

  // Use prop values if provided, otherwise internal state
  const isEditing = propIsEditing !== undefined ? propIsEditing : internalEditing;
  const error = propError !== undefined ? propError : internalError;
  const isSaving = propIsSaving !== undefined ? propIsSaving : internalIsSaving;
  
  // Check if we're in controlled mode
  const isControlled = propIsEditing !== undefined;

  // Determine cell state pentru CVA
  const getCellState = () => {
    if (isReadonly) return 'readonly';
    if (isSaving) return 'saving';
    if (error) return 'error';
    if (isEditing) return 'editing';
    if (isSelected || isFocused) return 'selected';
    return 'normal';
  };

  // Format value pentru display
  const formatDisplayValue = (val: string | number): string => {
    if (val === '' || val === null || val === undefined) return '';
    
    switch (validationType) {
      case 'amount':
        const numVal = typeof val === 'number' ? val : parseFloat(String(val));
        return isNaN(numVal) ? String(val) : numVal.toLocaleString('ro-RO', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        
      case 'percentage':
        const percentVal = typeof val === 'number' ? val : parseFloat(String(val));
        return isNaN(percentVal) ? String(val) : `${percentVal.toLocaleString('ro-RO')}%`;
        
      case 'date':
        try {
          const dateVal = new Date(val);
          return dateVal.toLocaleDateString('ro-RO');
        } catch {
          return String(val);
        }
        
      default:
        return String(val);
    }
  };

  // Combined keyboard handler
  const handleCombinedKeyDown = (e: React.KeyboardEvent) => {
    // Handle F2 key pentru start edit (Excel behavior)
    if (e.key === 'F2' && !isEditing && !isReadonly) {
      e.preventDefault();
      if (onStartEdit) {
        onStartEdit();
      } else {
        startEdit();
      }
      return;
    }
    
    // Handle Enter key pentru start edit când selected
    if (e.key === 'Enter' && !isEditing && (isSelected || isFocused) && !isReadonly) {
      e.preventDefault();
      if (onStartEdit) {
        onStartEdit();
      } else {
        startEdit();
      }
      return;
    }

    // Handle Escape în edit mode
    if (e.key === 'Escape' && isEditing) {
      e.preventDefault();
      if (onCancel) {
        onCancel();
      }
      return;
    }
    
    // Pass to inline edit handler dacă editing
    if (isEditing) {
      if (isControlled && e.key === 'Enter') {
        // În controlled mode, handle Enter save direct
        e.preventDefault();
        const inputValue = (inputRef.current?.value || '').trim();
        let convertedValue: string | number = inputValue;
        if (validationType === 'amount' || validationType === 'percentage') {
          convertedValue = parseFloat(inputValue);
        }
        Promise.resolve(onSave(convertedValue)).catch(err => console.error('Save error:', err));
        return;
      }
      inlineKeyDown(e);
    }
    
    // Pass to parent handler
    onKeyDown?.(e);
  };

  // Handle cell click pentru focus și start edit (single click activation)
  const handleCellClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!isEditing && !isReadonly) {
      // Single click activează editarea conform Creative Phase 1 decisions
      if (onStartEdit) {
        onStartEdit();
      } else {
        startEdit();
      }
    } else if (!isEditing) {
      onFocus?.();
    }
  };

  // Handle character typing pentru immediate edit activation (type-to-edit)
  const handleCharacterTyping = (e: React.KeyboardEvent) => {
    // Type-to-edit: daca nu suntem în edit mode și se tastează un caracter
    if (!isEditing && !isReadonly && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const char = e.key;
      // Verifică dacă este un caracter printabil (nu F1-F12, arrows, etc.)
      if (char.length === 1 && char.match(/[a-zA-Z0-9.,\-\s]/)) {
        e.preventDefault();
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
            const event = new Event('input', { bubbles: true });
            inputRef.current.dispatchEvent(event);
          }
        }, 0);
        return;
      }
    }
    
    // Continue cu keyboard handling normal
    handleCombinedKeyDown(e);
  };

  // Handle double click pentru start edit
  const handleCellDoubleClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!isEditing && !isReadonly) {
      if (onStartEdit) {
        onStartEdit();
      } else {
        handleDoubleClick();
      }
    }
  };

  if (isEditing) {
    const inputPlaceholder = placeholder || 
      EXCEL_GRID.INLINE_EDITING.PLACEHOLDER[validationType.toUpperCase() as keyof typeof EXCEL_GRID.INLINE_EDITING.PLACEHOLDER] || 
      EXCEL_GRID.INLINE_EDITING.PLACEHOLDER.TEXT;

    return (
      <div 
        className={cn(cellVariants({ state: getCellState() }), className)}
        data-testid={testId || `editable-cell-editing-${cellId}`}
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
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
            }
            handleCombinedKeyDown(e);
          }}
          onBlur={isControlled ? async () => {
            // În controlled mode, salvăm direct cu prop-ul onSave
            try {
              // Capturăm valoarea efectivă din input
              const inputValue = (inputRef.current?.value || '').trim();
              let convertedValue: string | number = inputValue;
              if (validationType === 'amount' || validationType === 'percentage') {
                const numValue = parseFloat(inputValue);
                if (!isNaN(numValue)) {
                  convertedValue = numValue;
                }
              }
              await Promise.resolve(onSave(convertedValue));
            } catch (err) {
              console.error('Save error:', err);
            }
          } : handleBlur}
          placeholder={inputPlaceholder}
          className={cn(inputVariants({ validationType }), {
            'border-red-500': error,
            'border-blue-500': !error
          })}
          data-testid={`editable-cell-input-${cellId}`}
          aria-label={`Edit ${validationType} value`}
          aria-describedby={`cell-${cellId}-description`}
          disabled={isSaving}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
        <div 
          id={`cell-${cellId}-description`}
          className="sr-only"
        >
          {`${validationType} cell editing mode`}
        </div>
        {isSaving && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
            role="status"
            aria-label="Saving..."
          >
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {error && (
          <div 
            id={`error-${cellId}`}
            className="absolute top-full left-0 z-10 mt-1 px-2 py-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded shadow-sm whitespace-nowrap"
            data-testid={`editable-cell-error-${cellId}`}
            role="alert"
          >
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(cellVariants({ 
        state: getCellState(), 
        editable: !isReadonly 
      }), className, {
        'cursor-not-allowed': isReadonly
      })}
      onClick={(e) => handleCellClick(e)}
      onDoubleClick={(e) => handleCellDoubleClick(e)}
      onKeyDown={handleCharacterTyping}
      tabIndex={isReadonly ? -1 : 0}
      data-testid={testId || `editable-cell-${cellId}`}
      role="gridcell"
      aria-label={`${validationType} cell with value ${formatDisplayValue(value)}`}
    >
      <div className="w-full h-full px-2 py-1 flex items-center">
        {formatDisplayValue(value)}
        {(isSelected || isFocused) && !isReadonly && (
          <span 
            className="ml-2 text-xs text-gray-500 opacity-75"
            data-testid={`editable-cell-hint-${cellId}`}
          >
            {EXCEL_GRID.INLINE_EDITING.EDIT_HINT}
          </span>
        )}
      </div>
      {isSaving && (
        <div 
          className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center"
          role="status"
          aria-label="Saving..."
        >
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}; 