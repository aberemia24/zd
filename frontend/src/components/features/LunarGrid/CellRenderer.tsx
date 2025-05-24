import React, { useState, useCallback, useMemo } from 'react';
import { Cell } from '@tanstack/react-table';
import { TransformedTableDataRow } from './hooks/useLunarGridTable';
import { TransactionType } from '@shared-constants';

// CVA styling imports
import { cn } from '../../../styles/cva/shared/utils';
import { tableCell } from '../../../styles/cva/data/display';

/**
 * Enhanced Cell Renderer pentru LunarGrid - Phase 2.1
 * 
 * Features implementate:
 * ✅ Cell States: default, hover, selected, editing, disabled
 * ✅ Visual Feedback: CVA styling cu state transitions  
 * ✅ Click Handlers: single click (select) și double click (edit)
 * ✅ Amount Formatting: formatare monetară cu suport pentru zero/negative
 * ✅ Transaction Type Awareness: styling diferit pentru income/expense/saving
 * ✅ Keyboard Accessibility: support pentru focus și keyboard navigation
 */

// Tipuri pentru stările celulelor
export type CellState = 'default' | 'hover' | 'selected' | 'editing' | 'disabled';

export interface CellRendererProps {
  /** Cell instance din TanStack Table */
  cell: Cell<TransformedTableDataRow, unknown>;
  
  /** Categoria pentru această celulă */
  category: string;
  
  /** Subcategoria (opțională) */
  subcategory?: string;
  
  /** Ziua lunii */
  day: number;
  
  /** Suma pentru această celulă */
  amount: number;
  
  /** Tipul tranzacției pentru această categorie */
  transactionType: TransactionType;
  
  /** Starea curentă a celulei */
  state?: CellState;
  
  /** Dacă celula este selectată */
  isSelected?: boolean;
  
  /** Dacă celula este în modul editare */
  isEditing?: boolean;
  
  /** Handler pentru single click */
  onClick?: (e: React.MouseEvent, category: string, subcategory: string | undefined, day: number, amount: number) => void;
  
  /** Handler pentru double click */
  onDoubleClick?: (e: React.MouseEvent, category: string, subcategory: string | undefined, day: number, amount: number) => void;
  
  /** Handler pentru focus (keyboard navigation) */
  onFocus?: (e: React.FocusEvent, category: string, subcategory: string | undefined, day: number) => void;
  
  /** Handler pentru blur */
  onBlur?: (e: React.FocusEvent) => void;
  
  /** Dacă celula este focusabilă pentru keyboard navigation */
  tabIndex?: number;
}

/**
 * Enhanced Cell Renderer Component
 */
export const CellRenderer: React.FC<CellRendererProps> = ({
  cell,
  category,
  subcategory,
  day,
  amount,
  transactionType,
  state = 'default',
  isSelected = false,
  isEditing = false,
  onClick,
  onDoubleClick,
  onFocus,
  onBlur,
  tabIndex = 0
}) => {
  // State local pentru hover effect
  const [isHovered, setIsHovered] = useState(false);
  
  // Formatarea sumei monetare
  const formattedAmount = useMemo(() => {
    if (amount === 0) return '-';
    
    return new Intl.NumberFormat('ro-RO', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(amount));
  }, [amount]);
  
  // Determinarea stării celulei
  const cellState: CellState = useMemo(() => {
    if (isEditing) return 'editing';
    if (isSelected) return 'selected';
    if (isHovered) return 'hover';
    return state;
  }, [isEditing, isSelected, isHovered, state]);
  
  // CVA Styling pentru celulă
  const cellClassName = useMemo(() => {
    const baseClasses = tableCell({ variant: 'clickable' });
    
    // State-specific classes
    const stateClasses = {
      default: 'hover:bg-gray-50',
      hover: 'bg-blue-50 hover:bg-blue-100',
      selected: 'bg-blue-100 ring-2 ring-blue-300 ring-inset',
      editing: 'bg-yellow-50 ring-2 ring-yellow-300 ring-inset',
      disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed'
    };
    
    // Transaction type styling
    const typeClasses = {
      [TransactionType.INCOME]: amount > 0 ? 'text-green-700 font-medium' : 'text-gray-500',
      [TransactionType.EXPENSE]: amount > 0 ? 'text-red-700 font-medium' : 'text-gray-500', 
      [TransactionType.SAVING]: amount > 0 ? 'text-blue-700 font-medium' : 'text-gray-500'
    };
    
    // Amount-specific styling
    const amountClasses = amount === 0 ? 'text-gray-400 italic' : '';
    
    return cn(
      baseClasses,
      stateClasses[cellState],
      typeClasses[transactionType],
      amountClasses,
      'text-right tabular-nums transition-all duration-150',
      'border-r border-gray-100 last:border-r-0',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
    );
  }, [cellState, transactionType, amount]);
  
  // Click handlers
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (cellState === 'disabled') return;
    
    onClick?.(e, category, subcategory, day, amount);
  }, [onClick, category, subcategory, day, amount, cellState]);
  
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (cellState === 'disabled') return;
    
    onDoubleClick?.(e, category, subcategory, day, amount);
  }, [onDoubleClick, category, subcategory, day, amount, cellState]);
  
  // Focus handlers pentru keyboard navigation
  const handleFocus = useCallback((e: React.FocusEvent) => {
    if (cellState === 'disabled') return;
    
    onFocus?.(e, category, subcategory, day);
  }, [onFocus, category, subcategory, day, cellState]);
  
  const handleBlur = useCallback((e: React.FocusEvent) => {
    onBlur?.(e);
  }, [onBlur]);
  
  // Mouse handlers pentru hover state
  const handleMouseEnter = useCallback(() => {
    if (cellState !== 'disabled') {
      setIsHovered(true);
    }
  }, [cellState]);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);
  
  // Keyboard handlers pentru accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (cellState === 'disabled') return;
    
    // Enter sau Space pentru click
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const mouseEvent = new MouseEvent('click', { bubbles: true }) as any;
      handleClick(mouseEvent);
    }
    
    // F2 pentru edit mode (Excel-like)
    if (e.key === 'F2') {
      e.preventDefault();
      const mouseEvent = new MouseEvent('dblclick', { bubbles: true }) as any;
      handleDoubleClick(mouseEvent);
    }
  }, [handleClick, handleDoubleClick, cellState]);
  
  return (
    <td
      className={cellClassName}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={cellState === 'disabled' ? -1 : tabIndex}
      role="gridcell"
      aria-label={`${category}${subcategory ? ` - ${subcategory}` : ''}, Ziua ${day}, ${formattedAmount} RON`}
      data-testid={`lunar-cell-${category}-${subcategory || 'main'}-${day}`}
      data-category={category}
      data-subcategory={subcategory || ''}
      data-day={day}
      data-amount={amount}
      data-transaction-type={transactionType}
      data-state={cellState}
    >
      <span className="block w-full px-1">
        {formattedAmount}
      </span>
    </td>
  );
};

/**
 * Hook pentru gestionarea stării celulelor în LunarGrid
 * Oferă funcționalitate pentru selecție și editare
 */
export interface UseCellStateOptions {
  /** Callback pentru schimbarea selecției */
  onSelectionChange?: (selected: Array<{category: string, subcategory?: string, day: number}>) => void;
  
  /** Callback pentru intrarea în modul editare */
  onEditingChange?: (editing: {category: string, subcategory?: string, day: number} | null) => void;
}

export const useCellState = (options: UseCellStateOptions = {}) => {
  const [selectedCells, setSelectedCells] = useState<Array<{category: string, subcategory?: string, day: number}>>([]);
  const [editingCell, setEditingCell] = useState<{category: string, subcategory?: string, day: number} | null>(null);
  
  // Single cell selection handler
  const handleCellSelect = useCallback((category: string, subcategory: string | undefined, day: number) => {
    const newSelection = [{category, subcategory, day}];
    setSelectedCells(newSelection);
    options.onSelectionChange?.(newSelection);
  }, [options.onSelectionChange]);
  
  // Multi-cell selection handler (cu Ctrl/Cmd)
  const handleCellToggle = useCallback((category: string, subcategory: string | undefined, day: number) => {
    setSelectedCells(prev => {
      const cellId = `${category}-${subcategory || ''}-${day}`;
      const isSelected = prev.some(cell => 
        `${cell.category}-${cell.subcategory || ''}-${cell.day}` === cellId
      );
      
      let newSelection;
      if (isSelected) {
        newSelection = prev.filter(cell => 
          `${cell.category}-${cell.subcategory || ''}-${cell.day}` !== cellId
        );
      } else {
        newSelection = [...prev, {category, subcategory, day}];
      }
      
      options.onSelectionChange?.(newSelection);
      return newSelection;
    });
  }, [options.onSelectionChange]);
  
  // Edit mode handlers
  const handleCellEdit = useCallback((category: string, subcategory: string | undefined, day: number) => {
    const editingData = {category, subcategory, day};
    setEditingCell(editingData);
    options.onEditingChange?.(editingData);
  }, [options.onEditingChange]);
  
  const handleCancelEdit = useCallback(() => {
    setEditingCell(null);
    options.onEditingChange?.(null);
  }, [options.onEditingChange]);
  
  // Clear selections
  const clearSelection = useCallback(() => {
    setSelectedCells([]);
    options.onSelectionChange?.([]);
  }, [options.onSelectionChange]);
  
  // Check if cell is selected
  const isCellSelected = useCallback((category: string, subcategory: string | undefined, day: number) => {
    const cellId = `${category}-${subcategory || ''}-${day}`;
    return selectedCells.some(cell => 
      `${cell.category}-${cell.subcategory || ''}-${cell.day}` === cellId
    );
  }, [selectedCells]);
  
  // Check if cell is editing
  const isCellEditing = useCallback((category: string, subcategory: string | undefined, day: number) => {
    if (!editingCell) return false;
    return editingCell.category === category && 
           editingCell.subcategory === subcategory && 
           editingCell.day === day;
  }, [editingCell]);
  
  return {
    selectedCells,
    editingCell,
    handleCellSelect,
    handleCellToggle,
    handleCellEdit,
    handleCancelEdit,
    clearSelection,
    isCellSelected,
    isCellEditing
  };
};

export default CellRenderer;