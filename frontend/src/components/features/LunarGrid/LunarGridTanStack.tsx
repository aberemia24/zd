import React, { useCallback, useState, useMemo, CSSProperties, useRef, memo } from 'react';
import { 
  flexRender, 
  Header, 
  Row,
  Cell
} from '@tanstack/react-table';
import { useLunarGridTable, TransformedTableDataRow } from './hooks/useLunarGridTable';

// Importuri din stores - eliminat useTransactionStore conform memoriei anti-pattern
import { useCategoryStore } from '../../../stores/categoryStore';
import { useAuthStore } from '../../../stores/authStore';

// React Query și hooks pentru tranzacții
import { useQueryClient } from '@tanstack/react-query';
// Import direct al hook-urilor specializate pentru mutații
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  type CreateTransactionHookPayload,
  type UpdateTransactionHookPayload
} from '../../../services/hooks/useTransactionMutations';

// Importăm tipuri și constante din shared-constants (sursa de adevăr)
import { TransactionType, FrequencyType } from '@shared-constants';
import { LUNAR_GRID, LUNAR_GRID_MESSAGES } from '@shared-constants';

// Import componentele UI
import Button from '../../primitives/Button/Button';
import CellTransactionPopover from './CellTransactionPopover';

// Import CVA styling system
import { cn } from '../../../styles/new/shared/utils';
import {   dataTable,   tableHeader,   tableCell } from '../../../styles/new/data';
import { 
  flex as flexContainer, 
  container as gridContainer 
} from '../../../styles/new/components/layout';

// Helper function pentru formatarea sumelor (memorare globală deoarece este statică)
const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('ro-RO', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export interface LunarGridTanStackProps {
  year: number;
  month: number;
}

// Interfața pentru starea celulei în editare
interface EditingCellState {
  id: string;
  category: string;
  subcategory?: string;
  day: number;
  amount: string;
  type: TransactionType;
  inputRef?: React.RefObject<HTMLInputElement>;
}

// Interfața pentru starea popover-ului
interface PopoverState {
  id?: string;
  category: string;
  subcategory?: string;
  day: number;
  type: TransactionType;
  amount?: string;
  anchorEl: HTMLElement;
}

// Componenta principală - utilizăm memo pentru a preveni re-renderizări inutile
const LunarGridTanStack: React.FC<LunarGridTanStackProps> = memo(({ year, month }) => {
  // State pentru editare inline și popover
  const [editingCell, setEditingCell] = useState<EditingCellState | null>(null);
  const [popover, setPopover] = useState<PopoverState | null>(null);
  
  // Referință pentru input focus
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Hooks pentru mutații de tranzacții - migrare de la Zustand la React Query
  const { mutate: createTransactionMutation } = useCreateTransaction();
  const { mutate: updateTransactionMutation } = useUpdateTransaction();
  const { mutate: deleteTransactionMutation } = useDeleteTransaction();
  
  // Cache pentru invalidare după mutații
  const queryClient = useQueryClient();
  
  // Funcție pentru determinarea tipului de tranzacție
  const determineTransactionType = useCallback((category: string): TransactionType => {
    const categories = useCategoryStore.getState().categories;
    const foundCategory = categories.find((c: any) => c.name === category);
    return (foundCategory?.type || 'expense') as TransactionType;
  }, []);
  
  // Handler pentru double click pe celule (editare inline)
  const handleCellDoubleClick = useCallback((
    e: React.MouseEvent, 
    category: string, 
    subcategory: string | undefined, 
    day: number, 
    amount: string
  ) => {
    e.stopPropagation();
    
    // Dacă este deja popover deschis, îl închidem
    if (popover) {
      setPopover(null);
    }
    
    // Setăm starea de editare pentru celula curentă
    const cellId = `${category}-${subcategory || 'null'}-${day}`;
    
    setEditingCell({
      id: cellId,
      category,
      subcategory,
      day,
      amount: amount && amount !== '-' ? amount.replace(/[^\d,.-]/g, '') : '',
      type: determineTransactionType(category),
      inputRef: inputRef
    });
    
    // Focus pe input după render
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 10);
  }, [popover, determineTransactionType, inputRef]);
  
  // Handler pentru salvarea valorii din input inline
  const handleInlineEditSave = useCallback((newAmount: string) => {
    if (!editingCell) return;
    
    const { category, subcategory, day, type: transactionType } = editingCell;
    
    if (isNaN(Number(newAmount)) || !newAmount) {
      setEditingCell(null);
      return;
    }
    
    // Construim data
    const date = new Date(year, month - 1, day).toISOString().slice(0, 10);
    
    // Folosim React Query mutation în loc de Zustand conform memoriei [d7b6eb4b]
    // Nu trimitem userId, acesta este gestionat în hook-ul useTransactions
    const createPayload: CreateTransactionHookPayload = {
      amount: Number(newAmount),
      category,
      subcategory: subcategory || undefined,
      type: transactionType,
      date,
      recurring: false,
      // Fără description - eliminat complet
      frequency: undefined
    };
    
    createTransactionMutation(createPayload, {
      onSuccess: () => {
        setEditingCell(null);
        // Se poate adăuga notificare UI aici
      },
      onError: (error: Error) => {
        console.error('Eroare la crearea tranzacției:', error);
        setEditingCell(null);
        // Se poate adăuga notificare eroare aici
      }
    });
  }, [editingCell, year, month, createTransactionMutation]);
  
  // Handler pentru anularea editării inline
  const handleInlineEditCancel = useCallback(() => {
    setEditingCell(null);
  }, []);
  
  // Handler pentru keypress în inputul inline
  const handleInlineKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInlineEditSave((e.target as HTMLInputElement).value);
    } else if (e.key === 'Escape') {
      handleInlineEditCancel();
    }
  }, [handleInlineEditSave, handleInlineEditCancel]);
  
  // Handler pentru click pe celulă - adaptat pentru tipul așteptat de useLunarGridTable
  const handleCellClick = useCallback(
    (e: React.MouseEvent, category: string, subcategory: string | undefined, day: number, amount: string) => {
      // Prevenim click-ul de la propagare pentru a evita conflicte cu expand/collapse
      e.stopPropagation();
      
      // Dacă suntem deja în modul editare, nu deschidem popover
      if (editingCell) return;
      
      // Deschide popover pentru editare tranzacție complexă (nu doar sumă)
      setPopover({
        category,
        subcategory,
        day,
        type: determineTransactionType(category), // forțăm tipul corect în loc de parametrul type care poate fi undefined
        amount,
        anchorEl: e.currentTarget as HTMLElement
      });
    }, 
    [editingCell, determineTransactionType]
  );
  
  // Handler pentru salvarea tranzacției din popover - optimizat cu useCallback
  const handleSavePopover = useCallback(
    async (formData: {
      amount: string;
      recurring: boolean;
      frequency?: FrequencyType;
    }) => {
      if (!popover) {
        return;
      }

      // Extragem detaliile din starea popover
      const { id: transactionIdToEdit, category, subcategory, day, type: transactionTypeFromPopover } = popover;

      const date = new Date(year, month - 1, day).toISOString().slice(0, 10);

      const commonPayload = {
        amount: Number(formData.amount),
        category,
        subcategory: subcategory || undefined,
        type: transactionTypeFromPopover,
        date,
        // Eliminăm complet câmpul description și nu mai adaugăm userId (gestionat în useTransactions)
        recurring: formData.recurring,
        frequency: formData.recurring ? formData.frequency : undefined,
      };

      createTransactionMutation(commonPayload, {
        onSuccess: () => {
          setPopover(null);
        },
        onError: (err: Error) => {
          // Eroare tratată în UI fără console.log
          setPopover(null);
        }
      });
    }, 
    [popover, year, month, createTransactionMutation]
  );

  // Interogare tabel optimizată
  const {
    table,
    isLoading,
    error,
    columns,
    days,
    dailyBalances,
    tableContainerRef
  } = useLunarGridTable(
    year, 
    month, 
    {}, // expandedCategories este gestionat intern de TanStack now
    handleCellClick, 
    handleCellDoubleClick
  );

  // State pentru celula în editare inline - optimizat cu useCallback
  const renderEditableCell = useCallback((category: string, subcategory: string | undefined, day: number) => {
    if (!editingCell) return null;

    const cellId = `${category}-${subcategory || 'null'}-${day}`;

    if (editingCell.id !== cellId) return null;

    return (
      <input
        type="number"
        ref={editingCell.inputRef}
        value={editingCell.amount}
        onChange={(e) => setEditingCell(prev => prev ? { ...prev, amount: e.target.value } : null)}
        onKeyDown={handleInlineKeyDown}
        onBlur={() => handleInlineEditSave(editingCell.amount)}
        className={cn(
          'px-3 py-2 text-sm border border-primary-300 rounded-md',
          'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'transition-all duration-150'
        )}
        data-testid={`inline-edit-input-${day}`}
        autoFocus
      />
    );
  }, [editingCell, handleInlineKeyDown, handleInlineEditSave]);

  // Funcție pentru calcularea sumei totale - memoizată
  const monthTotal = useMemo(() => 
    days.reduce((acc, day) => acc + (dailyBalances[day] || 0), 0), 
  [days, dailyBalances]);
  
  // Helper pentru stiluri de valori - optimizat cu useCallback
  const getBalanceStyle = useCallback((value: number): string => {
    if (!value) return 'text-gray-400';
    return value > 0 
      ? 'text-emerald-600 font-medium' 
      : 'text-red-600 font-medium';
  }, []);

  // Gestionarea poziției popover-ului - memoizată
  const popoverStyle = useMemo((): CSSProperties => {
    if (!popover) return {};
    
    const rect = popover.anchorEl.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    
    return {
      position: 'absolute',
      top: `${rect.top + scrollY}px`,
      left: `${rect.left + scrollX}px`,
    };
  }, [popover]);

  // Funcție helper pentru randarea recursivă a rândurilor - optimizată
  const renderRow = useCallback((row: Row<TransformedTableDataRow>, level: number = 0): React.ReactNode => {
    const { original } = row;
    
    return (
      <React.Fragment key={row.id}>
        <tr className={cn(
          'transition-all duration-150',
          original.isCategory 
            ? 'bg-gray-50 hover:bg-gray-100 font-medium'
            : 'hover:bg-gray-50',
          row.getIsExpanded() ? 'border-b border-gray-200' : ''
        )}>
          {row.getVisibleCells().map((cell, cellIdx) => {
            const isFirstCell = cellIdx === 0;
            return (
              <td 
                key={cell.id}
                className={cn(
                  tableCell({ variant: 'default' }),
                  isFirstCell && level > 0 ? 'pl-8' : '',
                  isFirstCell ? 'sticky left-0 bg-inherit z-10' : 'text-right'
                )}
              >
                {renderEditableCell(
                  original.category,
                  original.subcategory,
                  cell.column.id.startsWith('day-') ? parseInt(cell.column.id.split('-')[1]) : 0
                ) || (flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode)}
              </td>
            );
          })}
        </tr>
        
        {/* Rânduri expandate */}
        {row.getIsExpanded() && row.subRows && row.subRows.length > 0 && (
          row.subRows.map((subRow) => renderRow(subRow, level + 1))
        )}
      </React.Fragment>
    );
  }, [renderEditableCell, tableCell]);

  // Renderizare (layout principal)
  return (
    <>
      <div className={cn(flexContainer({ direction: 'row', justify: 'start', gap: 'md' }), 'mb-4')}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => table.getToggleAllRowsExpandedHandler()(!table.getIsAllRowsExpanded())}
          dataTestId="toggle-expand-all"
        >
          {table.getIsAllRowsExpanded() ? LUNAR_GRID.COLLAPSE_ALL : LUNAR_GRID.EXPAND_ALL}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => table.resetExpanded()}
          dataTestId="reset-expanded"
        >
          {LUNAR_GRID.RESET_EXPANSION}
        </Button>
      </div>

      <div 
        ref={tableContainerRef}
        className={cn(
          gridContainer({ size: 'full' }),
          'relative overflow-x-auto rounded-lg border border-gray-200',
          isLoading ? 'opacity-60' : '',
          'transition-all duration-150'
        )}
        data-testid="lunar-grid-container"
      >
        {isLoading && (
          <div className="flex items-center justify-center p-4 text-gray-600" data-testid="loading-indicator">
            {LUNAR_GRID.LOADING}
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center p-4 text-red-600 bg-red-50 rounded-md" data-testid="error-indicator">
            {LUNAR_GRID_MESSAGES.EROARE_INCARCARE}
          </div>
        )}
        
        {!isLoading && !error && table.getRowModel().rows.length === 0 && (
          <div className="flex items-center justify-center p-4 text-gray-600" data-testid="no-data-indicator">
            {LUNAR_GRID.NO_DATA}
          </div>
        )}
        
        {!isLoading && !error && table.getRowModel().rows.length > 0 && (
          <table 
            className={cn(dataTable({ variant: 'striped' }))}
            data-testid="lunar-grid-table"
          >
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {table.getFlatHeaders().map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      tableHeader(),
                      header.id === 'category' 
                        ? 'sticky left-0 z-20 text-left' 
                        : 'text-right'
                    )}
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext()) as React.ReactNode}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => renderRow(row))}
              
              {/* Rând de total */}
              <tr className={cn(
                'bg-gray-100 font-bold border-t-2 border-gray-300',
                'hover:bg-gray-200 transition-colors duration-150'
              )} data-testid="sold-row">
                <td className={cn(
                  tableCell({ variant: 'default' }),
                  'sticky left-0 bg-gray-100 z-10 font-bold'
                )}>
                  {LUNAR_GRID.TOTAL_BALANCE}
                </td>
                {days.map((day) => {
                  const balance = dailyBalances[day] || 0;
                  return (
                    <td 
                      key={day} 
                      className={cn(
                        tableCell({ variant: 'numeric' }),
                        getBalanceStyle(balance),
                        'transition-colors duration-150'
                      )}
                    >
                      {balance !== 0 ? formatMoney(balance) : '-'}
                    </td>
                  );
                })}
                <td className={cn(
                  tableCell({ variant: 'numeric' }),
                  getBalanceStyle(monthTotal),
                  'font-bold',
                  'transition-colors duration-150'
                )}>
                  {formatMoney(monthTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      
      {/* Popover pentru editare tranzacție */}
      {popover && (
        <div 
          className={cn(
            'fixed z-50 shadow-lg rounded-lg',
            'animate-fadeIn transition-all duration-150'
          )}
          style={popoverStyle}
          data-testid="transaction-popover"
        >
          <CellTransactionPopover
            initialAmount={popover.amount || ''}
            day={popover.day}
            month={month}
            year={year}
            category={popover.category}
            subcategory={popover.subcategory || ''}
            type={popover.type}
            onSave={handleSavePopover}
            onCancel={() => setPopover(null)}
          />
        </div>
      )}
    </>
  );
});

// Adăugăm displayName pentru debugging mai ușor
LunarGridTanStack.displayName = 'LunarGridTanStack';

export default LunarGridTanStack;
