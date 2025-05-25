import React, { useCallback, useState, useMemo, CSSProperties, useRef, memo } from 'react';
import { 
  flexRender, 
  Row
} from '@tanstack/react-table';
import { useLunarGridTable, TransformedTableDataRow } from './hooks/useLunarGridTable';

// Importuri din stores
import { useCategoryStore } from '../../../stores/categoryStore';

// React Query și hooks pentru tranzacții
import {
  useCreateTransaction,
  type CreateTransactionHookPayload
} from '../../../services/hooks/useTransactionMutations';

// Importăm tipuri și constante din shared-constants (sursa de adevăr)
import { TransactionType, FrequencyType } from '@shared-constants';
import { LUNAR_GRID, LUNAR_GRID_MESSAGES } from '@shared-constants';

// Import componentele UI
import Button from '../../primitives/Button/Button';

// Enhanced Modal Architecture Integration
import { 
  ModalManagerProvider, 
  ModalRouter, 
  useModalRouter,
  CellContext 
} from './modals';

// Import CVA styling system
import { cn } from '../../../styles/cva/shared/utils';
import { dataTable, tableHeader, tableCell, tableRow } from '../../../styles/cva/data';
import { 
  flex as flexContainer, 
  container as gridContainer 
} from '../../../styles/cva/components/layout';

// Helper function pentru formatarea sumelor (memorare globală deoarece este statică)
const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('ro-RO', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export interface LunarGridEnhancedProps {
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
}

// Enhanced LunarGrid Main Component
const LunarGridEnhancedCore: React.FC<LunarGridEnhancedProps> = memo(({ year, month }) => {
  // State pentru editare inline
  const [editingCell, setEditingCell] = useState<EditingCellState | null>(null);
  const [selectedCells, setSelectedCells] = useState<any[]>([]);
  
  // Referință pentru input focus
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Enhanced Modal Architecture Integration
  const modalRouter = useModalRouter();
  
  // Hooks pentru mutații de tranzacții
  const { mutate: createTransactionMutation } = useCreateTransaction();
  
  // Funcție pentru determinarea tipului de tranzacție
  const determineTransactionType = useCallback((category: string): TransactionType => {
    const categories = useCategoryStore.getState().categories;
    const foundCategory = categories.find((c: any) => c.name === category);
    return (foundCategory?.type || 'expense') as TransactionType;
  }, []);

  // Helper pentru crearea cell context
  const createCellContext = useCallback((
    category: string, 
    subcategory: string | undefined, 
    day: number
  ): CellContext => ({
    category,
    subcategory,
    day,
    month,
    year
  }), [month, year]);

  // Enhanced Modal Handlers
  
  // Quick Add Modal Handler
  const handleQuickAdd = useCallback(async (data: any) => {
    const createPayload: CreateTransactionHookPayload = {
      amount: Number(data.amount),
      category: data.category,
      subcategory: data.subcategory || undefined,
      type: data.type as TransactionType,
      date: data.date,
      recurring: data.recurring || false,
      frequency: data.recurring ? data.frequency : undefined
    };
    
    return new Promise<void>((resolve, reject) => {
      createTransactionMutation(createPayload, {
        onSuccess: () => resolve(),
        onError: (error: Error) => reject(error)
      });
    });
  }, [createTransactionMutation]);

  // Advanced Edit Modal Handler
  const handleAdvancedEdit = useCallback(async (data: any) => {
    // Mock implementation - în realitate ar fi update transaction
    console.log('Advanced Edit:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, []);

  // Recurring Setup Modal Handler
  const handleRecurringSetup = useCallback(async (data: any) => {
    // Mock implementation - în realitate ar fi create recurring template
    console.log('Recurring Setup:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, []);

  // Bulk Operations Modal Handler
  const handleBulkOperations = useCallback(async (data: any) => {
    // Mock implementation - în realitate ar fi bulk transaction operations
    console.log('Bulk Operations:', data);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }, []);

  // Financial Export Handler
  const handleFinancialExport = useCallback(async (format: 'csv' | 'pdf' | 'json') => {
    // Mock implementation - în realitate ar fi export data
    console.log('Financial Export:', format);
    await new Promise(resolve => setTimeout(resolve, 500));
  }, []);

  // OPTIMIZED Click Handlers - delegated to useLunarGridTable

  // Handler pentru single click pe celule - Quick Add Modal
  const handleCellClick = useCallback((
    e: React.MouseEvent, 
    category: string, 
    subcategory: string | undefined, 
    day: number, 
    amount: string
  ) => {
    e.stopPropagation();
    
    if (editingCell) return;
    
    const cellContext = createCellContext(category, subcategory, day);
    
    // Open Quick Add Modal
    modalRouter.openQuickAdd(cellContext, amount && amount !== '—' ? amount.replace(/[^\d,.-]/g, '') : '');
  }, [editingCell, createCellContext, modalRouter]);

  // Handler pentru double click pe celule - Advanced Edit
  const handleCellDoubleClick = useCallback((
    e: React.MouseEvent, 
    category: string, 
    subcategory: string | undefined, 
    day: number, 
    amount: string
  ) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (editingCell) return;
    
    const cellContext = createCellContext(category, subcategory, day);
    
    // Mock existing transaction pentru advanced edit
    const existingTransaction = {
      id: `${category}-${subcategory}-${day}-${Date.now()}`,
      amount: amount && amount !== '—' ? Number(amount.replace(/[^\d,.-]/g, '')) : 0,
      description: `Tranzacție ${category}`,
      type: determineTransactionType(category),
      category,
      subcategory,
      date: new Date(year, month - 1, day).toISOString().slice(0, 10),
      recurring: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Open Advanced Edit Modal
    modalRouter.openAdvancedEdit(cellContext, existingTransaction);
  }, [editingCell, createCellContext, modalRouter, determineTransactionType, year, month]);

  // Grid Table Hook WITH integrated click handlers
  const {
    table,
    isLoading,
    error,
    days,
    dailyBalances,
    tableContainerRef
  } = useLunarGridTable(
    year, 
    month, 
    {}, 
    handleCellClick, 
    handleCellDoubleClick
  );

  // Enhanced Modal Actions
  const handleBulkActionsClick = useCallback(() => {
    if (selectedCells.length === 0) return;
    
    const firstCell = selectedCells[0];
    const cellContext = createCellContext(firstCell.category, firstCell.subcategory, firstCell.day);
    
    modalRouter.openBulkOperations(cellContext, 'create', selectedCells);
  }, [selectedCells, createCellContext, modalRouter]);

  const handleFinancialPreviewClick = useCallback(() => {
    // Mock transactions pentru financial preview
    const mockTransactions = days.map(day => ({
      id: `mock-${day}`,
      amount: dailyBalances[day] || 0,
      description: `Tranzacții ziua ${day}`,
      type: (dailyBalances[day] || 0) > 0 ? 'income' as const : 'expense' as const,
      category: 'Analiză Lunară',
      date: new Date(year, month - 1, day).toISOString().slice(0, 10),
      recurring: false
    })).filter(t => t.amount !== 0);
    
    const cellContext = createCellContext('Analiză Lunară', 'Previzualizare', 1);
    modalRouter.openFinancialPreview(cellContext, mockTransactions);
  }, [days, dailyBalances, year, month, createCellContext, modalRouter]);

  // Funcție pentru calcularea sumei totale
  const monthTotal = useMemo(() => 
    days.reduce((acc, day) => acc + (dailyBalances[day] || 0), 0), 
  [days, dailyBalances]);
  
  // Helper pentru stiluri de valori
  const getBalanceStyle = useCallback((value: number): string => {
    if (!value) return 'text-gray-400';
    return value > 0 
      ? 'text-emerald-600 font-medium' 
      : 'text-red-600 font-medium';
  }, []);

  // Renderizare (layout principal)
  return (
    <>
      {/* Enhanced Action Bar */}
      <div className={cn(flexContainer({ direction: 'row', justify: 'between', gap: 'md' }), 'mb-4')}>
        <div className={cn(flexContainer({ direction: 'row', justify: 'start', gap: 'sm' }))}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.getToggleAllRowsExpandedHandler()(!table.getIsAllRowsExpanded())}
            data-testid="toggle-expand-all"
          >
            {table.getIsAllRowsExpanded() ? LUNAR_GRID.COLLAPSE_ALL : LUNAR_GRID.EXPAND_ALL}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.resetExpanded()}
            data-testid="reset-expanded"
          >
            {LUNAR_GRID.RESET_EXPANSION}
          </Button>
        </div>
        
        {/* Enhanced Modal Actions */}
        <div className={cn(flexContainer({ direction: 'row', justify: 'end', gap: 'sm' }))}>
          <Button
            variant="primary"
            size="sm"
            onClick={handleBulkActionsClick}
            disabled={selectedCells.length === 0}
            data-testid="bulk-actions"
          >
            📋 Operații în Masă ({selectedCells.length})
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleFinancialPreviewClick}
            data-testid="financial-preview"
          >
            📊 Previzualizare Financiară
          </Button>
        </div>
      </div>

      {/* Enhanced Modal Architecture Status */}
      {modalRouter.isModalOpen && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-700">
            <span className="font-medium">Modal activ:</span> {modalRouter.currentModal}
            {modalRouter.isLoading && (
              <span className="ml-2 text-blue-600">• Se încarcă...</span>
            )}
          </div>
        </div>
      )}

      <div 
        ref={tableContainerRef}
        className={cn(
          gridContainer({ size: 'full' }),
          'relative overflow-x-auto rounded-lg border border-gray-200',
          isLoading ? 'opacity-60' : '',
          'transition-all duration-150'
        )}
        data-testid="lunar-grid-enhanced-container"
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
            data-testid="lunar-grid-enhanced-table"
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
              {table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr 
                    className={cn(
                      tableRow({
                        editability: row.original.isCategory ? 'readonly' : 'editable'
                      }),
                      row.getIsExpanded() ? 'border-b border-gray-200' : ''
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td 
                        key={cell.id}
                        className={cn(
                          tableCell({
                            variant: cell.column.id.startsWith('day-') ? 'numeric' : 'default',
                            editability: row.original.isCategory 
                              ? 'category'
                              : (cell.column.id.startsWith('day-') && !row.original.isCategory ? 'editable' : 'readonly')
                          }),
                          cell.column.id === 'category' ? 'sticky left-0 bg-inherit z-10' : ''
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Rânduri expandate */}
                  {row.getIsExpanded() && row.subRows && row.subRows.length > 0 && (
                    row.subRows.map((subRow) => (
                      <tr 
                        key={subRow.id}
                        className={cn(
                          tableRow({ editability: 'editable' })
                        )}
                      >
                        {subRow.getVisibleCells().map((cell) => (
                          <td 
                            key={cell.id}
                            className={cn(
                              tableCell({
                                variant: cell.column.id.startsWith('day-') ? 'numeric' : 'default',
                                editability: cell.column.id.startsWith('day-') ? 'editable' : 'readonly'
                              }),
                              cell.column.id === 'category' ? 'sticky left-0 bg-inherit z-10 pl-8' : ''
                            )}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </React.Fragment>
              ))}
              
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
                      {balance !== 0 ? formatMoney(balance) : '—'}
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
      
      {/* Enhanced Modal Router Integration */}
      <ModalRouter
        onQuickAdd={handleQuickAdd}
        onAdvancedEdit={handleAdvancedEdit}
        onRecurringSetup={handleRecurringSetup}
        onBulkOperations={handleBulkOperations}
        onFinancialExport={handleFinancialExport}
        transactions={[]} // Mock - în realitate ar fi dat real
        selectedCells={selectedCells}
      />
    </>
  );
});

// Enhanced LunarGrid cu Provider Wrapper
export const LunarGridEnhanced: React.FC<LunarGridEnhancedProps> = (props) => {
  return (
    <ModalManagerProvider>
      <LunarGridEnhancedCore {...props} />
    </ModalManagerProvider>
  );
};

// Adăugăm displayName pentru debugging mai ușor
LunarGridEnhanced.displayName = 'LunarGridEnhanced';
LunarGridEnhancedCore.displayName = 'LunarGridEnhancedCore';

export default LunarGridEnhanced; 