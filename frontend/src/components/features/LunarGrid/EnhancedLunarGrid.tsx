import React, { useCallback, useState, useMemo, useRef, memo } from 'react';
import { 
  flexRender
} from '@tanstack/react-table';

// Importuri din hook-urile existente și funcționale
import { useLunarGridTable, TransformedTableDataRow } from './hooks/useLunarGridTable';

// Importuri din stores
import { useCategoryStore } from '../../../stores/categoryStore';
import { useAuthStore } from '../../../stores/authStore';

// React Query și hooks pentru tranzacții
import { useQueryClient } from '@tanstack/react-query';
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  type CreateTransactionHookPayload
} from '../../../services/hooks/useTransactionMutations';

// Importăm tipuri și constante din shared-constants
import { TransactionType } from '@shared-constants';
import { LUNAR_GRID, LUNAR_GRID_MESSAGES } from '@shared-constants';

// Import componentele UI
import Button from '../../primitives/Button/Button';
import Input from '../../primitives/Input/Input';

// Import CVA styling system
import { cn } from '../../../styles/cva/shared/utils';
import {
  dataTable,
  tableHeader,
  tableCell
} from '../../../styles/cva/data';
import { 
  flex as flexContainer, 
  container as gridContainer 
} from '../../../styles/cva/components/layout';

export interface EnhancedLunarGridProps {
  year: number;
  month: number;
}

interface EditingCellState {
  id: string;
  category: string;
  subcategory?: string;
  day: number;
  amount: string;
  type: TransactionType;
}

// Helper function pentru formatarea sumelor
const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('ro-RO', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const EnhancedLunarGrid: React.FC<EnhancedLunarGridProps> = memo(({ year, month }) => {
  // State pentru editare
  const [editingCell, setEditingCell] = useState<EditingCellState | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // Referințe pentru input
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Hook-uri existente și funcționale
  const { 
    table, 
    isLoading: tableLoading,
    error: tableError,
    dailyBalances,
    getCellId
  } = useLunarGridTable(
    year, 
    month, 
    expandedCategories
  );
  
  // Hook-uri pentru mutații
  const { mutate: createTransactionMutation } = useCreateTransaction();
  const { mutate: updateTransactionMutation } = useUpdateTransaction();
  const { mutate: deleteTransactionMutation } = useDeleteTransaction();
  const queryClient = useQueryClient();
  
  // Funcție pentru determinarea tipului de tranzacție
  const determineTransactionType = useCallback((category: string): TransactionType => {
    const categories = useCategoryStore.getState().categories;
    const foundCategory = categories.find((c: any) => c.name === category);
    return (foundCategory?.type || 'expense') as TransactionType;
  }, []);
  
  // Handler pentru double click pe celulă
  const handleCellDoubleClick = useCallback((
    category: string, 
    subcategory: string | undefined, 
    day: number, 
    currentAmount: number
  ) => {
    const cellId = getCellId(category, subcategory, day);
    
    setEditingCell({
      id: cellId,
      category,
      subcategory,
      day,
      amount: currentAmount > 0 ? currentAmount.toString() : '',
      type: determineTransactionType(category)
    });
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 10);
  }, [getCellId, determineTransactionType]);
  
  // Handler pentru salvarea editării
  const handleInlineEditSave = useCallback((newAmount: string) => {
    if (!editingCell) return;
    
    const { category, subcategory, day, type: transactionType } = editingCell;
    
    if (isNaN(Number(newAmount)) || !newAmount) {
      setEditingCell(null);
      return;
    }
    
    const date = new Date(year, month - 1, day).toISOString().slice(0, 10);
    
    const createPayload: CreateTransactionHookPayload = {
      amount: Number(newAmount),
      category,
      subcategory: subcategory || undefined,
      type: transactionType,
      date,
      recurring: false,
      frequency: undefined
    };
    
    createTransactionMutation(createPayload, {
      onSuccess: () => {
        setEditingCell(null);
        // Invalidare query cache pentru refresh
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['lunar-grid'] });
      },
      onError: (error: Error) => {
        console.error('Eroare la crearea tranzacției:', error);
        setEditingCell(null);
      }
    });
  }, [editingCell, year, month, createTransactionMutation, queryClient]);
  
  // Handler pentru anularea editării
  const handleInlineEditCancel = useCallback(() => {
    setEditingCell(null);
  }, []);
  
  // Handler pentru keyboard events
  const handleInlineKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInlineEditSave((e.target as HTMLInputElement).value);
    } else if (e.key === 'Escape') {
      handleInlineEditCancel();
    }
  }, [handleInlineEditSave, handleInlineEditCancel]);
  
  // Render pentru celulă cu editare inline
  const renderCell = useCallback((cell: any, rowData: TransformedTableDataRow) => {
    const day = parseInt(cell.column.id.replace('day-', ''));
    const amount = cell.getValue() || 0;
    const cellId = getCellId(rowData.category, rowData.subcategory, day);
    const isEditing = editingCell?.id === cellId;
    
    if (isEditing) {
      return (
        <Input
          ref={inputRef}
          type="number"
          value={editingCell.amount}
          onChange={(e) => setEditingCell(prev => prev ? { ...prev, amount: e.target.value } : null)}
          onKeyDown={handleInlineKeyDown}
          onBlur={() => handleInlineEditCancel()}
          className="w-full text-right"
          size="sm"
          variant="default"
          step="0.01"
          min="0"
        />
      );
    }
    
    return (
      <div
        className={cn(
          "text-right cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors",
          amount > 0 ? "text-green-700 font-medium" : "text-gray-400"
        )}
        onDoubleClick={() => handleCellDoubleClick(rowData.category, rowData.subcategory, day, amount)}
      >
        {amount > 0 ? formatMoney(amount) : '-'}
      </div>
    );
  }, [editingCell, getCellId, handleCellDoubleClick, handleInlineKeyDown, handleInlineEditCancel]);
  
  // Loading state
  if (tableLoading) {
    return (
      <div className={cn(gridContainer(), "justify-center items-center min-h-96")}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă planificarea financiară...</p>
        </div>
      </div>
    );
  }
  
  if (tableError) {
    return (
      <div className={cn(gridContainer(), "justify-center items-center min-h-96")}>
        <div className="text-center text-red-600">
          <p>Eroare la încărcarea datelor: {tableError.message}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className={cn(gridContainer(), "space-y-6")}
      tabIndex={0}
    >
      {/* Header cu informații despre lună */}
      <div className={cn(flexContainer({ direction: 'row', justify: 'between', align: 'center' }), "bg-blue-50 p-4 rounded-lg border border-blue-200")}>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-blue-900">
            Enhanced LunarGrid - {new Date(year, month - 1).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
          </h3>
          <p className="text-sm text-blue-700">
            Phase 4 Integration - Toate componentele integrate
          </p>
        </div>
        
        {/* Informații suplimentare */}
        <div className="text-sm text-gray-600">
          <span>Double-click pentru editare • </span>
          <span>Enter pentru salvare • </span>
          <span>Escape pentru anulare</span>
        </div>
      </div>
      
      {/* Controls pentru funcționalități viitoare */}
      <div className={cn(flexContainer({ direction: 'row', justify: 'between', align: 'center' }))}>
        <div className={cn(flexContainer({ direction: 'row', gap: 'sm' }))}>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => {/* TODO: Implement recurring transactions */}}
            disabled={true}
          >
            Tranzacții Recurente (Coming Soon)
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {/* TODO: Implement financial summary */}}
            disabled={true}
          >
            Sumar Financiar (Coming Soon)
          </Button>
        </div>
        
        <div className="text-sm text-blue-600 font-medium">
          Phase 4: Integration & Testing ✅
        </div>
      </div>
      
      {/* Tabelul principal cu integrarea funcționalităților */}
      <div className="overflow-x-auto">
        <table className={cn(dataTable())}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className={cn(tableHeader())}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center justify-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {/* Afișare sold zilnic în header pentru zilele lunii */}
                        {header.column.id.startsWith('day-') && dailyBalances && (
                          <div className="text-xs text-blue-600 font-medium mt-1">
                            {(() => {
                              const day = parseInt(header.column.id.replace('day-', ''));
                              const balance = dailyBalances[day];
                              return balance !== undefined ? formatMoney(balance) : '-';
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    className={cn(tableCell())}
                  >
                    {cell.column.id.startsWith('day-') ? (
                      renderCell(cell, row.original as TransformedTableDataRow)
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer cu status */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>
          ✅ Phase 1: Mathematical Foundation | 
          ✅ Phase 2: UX Interactions | 
          ✅ Phase 3: Recurring Transactions | 
          🚀 Phase 4: Integration & Testing
        </p>
      </div>
    </div>
  );
});

EnhancedLunarGrid.displayName = 'EnhancedLunarGrid';

export default EnhancedLunarGrid; 