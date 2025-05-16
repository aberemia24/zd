import React, { useCallback, useState, useMemo } from 'react';
import { 
  flexRender, 
  Header, 
  Row as TableRow,
  Cell
} from '@tanstack/react-table';
import { useLunarGridTable, TransformedTableDataRow } from './hooks/useLunarGridTable';

// Importuri din stores - eliminat useTransactionStore conform memoriei anti-pattern
import { useCategoryStore } from '../../../stores/categoryStore';
import { useAuthStore } from '../../../stores/authStore';

// React Query și hooks pentru tranzacții
import { useQueryClient } from '@tanstack/react-query';
import { 
  useTransactions, 
  type CreateTransactionHookPayload, 
  type UpdateTransactionHookPayload
} from '../../../services/hooks/useTransactions';

// Tipuri
import type { Transaction } from '../../../types/transaction';
import type { CustomCategory } from '../../../types/Category'; 

// Importuri din shared-constants (sursa unică de adevăr) conform memoriei 886c7659
import { EXCEL_GRID } from '@shared-constants';
import { MESAJE } from '@shared-constants/messages';
import { TransactionType, FrequencyType } from '@shared-constants/enums';
import { API } from '@shared-constants/api';

// Import doar componente existente
import CellTransactionPopover from './CellTransactionPopover';

export interface LunarGridTanStackProps {
  year: number;
  month: number;
}

const LunarGridTanStack: React.FC<LunarGridTanStackProps> = ({ year, month }) => {
  // User și autorizare
  const user = useAuthStore((state) => state.user);
  const userId = user?.id || '';
  
  // Acces la queryClient pentru operații manuale când e nevoie
  const queryClient = useQueryClient();
  
  // Categorii și state management
  const categories = useCategoryStore((state) => state.categories);
  
  // State pentru expandare categorii - folosim Record<string, boolean> pentru compatibilitate cu useLunarGridTable
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // State pentru popover de editare
  const [popover, setPopover] = useState<{
    id?: string;
    amount?: string;
    category: string;
    subcategory?: string;
    day: number;
    type: TransactionType;
    anchorEl: HTMLElement;
  } | null>(null);
  
  // Query params pentru React Query
  const queryParams = useMemo(() => ({
    year,
    month,
    limit: 1000,
    offset: 0,
    sort: 'date',
    order: 'asc' as const
  }), [year, month]);
  
  // Obținem mutațiile din hook-ul useTransactions
  const {
    createTransaction: createTransactionMutation,
    isCreating,
    updateTransaction: updateTransactionMutation,
    isUpdating,
    deleteTransaction: deleteTransactionMutation,
    isDeleting
  } = useTransactions(queryParams, userId);
  
  // Funcții pentru gestionarea categoriilor
  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);
  
  // Expandează toate categoriile
  const expandAll = useCallback(() => {
    const allExpanded: Record<string, boolean> = {};
    categories.forEach((cat: CustomCategory) => {
      allExpanded[cat.name] = true;
    });
    setExpandedCategories(allExpanded);
  }, [categories]);
  
  // Colapsează toate categoriile
  const collapseAll = useCallback(() => {
    const allCollapsed: Record<string, boolean> = {};
    categories.forEach((cat: CustomCategory) => {
      allCollapsed[cat.name] = false;
    });
    setExpandedCategories(allCollapsed);
  }, [categories]);
  
  // Handler pentru double-click pe celulă (creare tranzacție) - adaptat pentru semnătura așteptată de useLunarGridTable
  const handleCellDoubleClick = useCallback(
    (e: React.MouseEvent, category: string, subcategory: string | undefined, day: number, amount: string) => {
      const transactionType = determineTransactionType(category);
      const newAmount = prompt(EXCEL_GRID.PROMPTS.ENTER_AMOUNT, amount);
      
      if (!newAmount || isNaN(Number(newAmount))) return;
      
      // Construim data
      const date = new Date(year, month - 1, day).toISOString().slice(0, 10);
      
      // Folosim React Query mutation în loc de Zustand conform memoriei [d7b6eb4b]
      const createPayload: CreateTransactionHookPayload = {
        amount: Number(newAmount),
        category,
        subcategory: subcategory || undefined,
        type: transactionType,
        date,
        recurring: false,
        description: '', // Câmp obligatoriu conform noii structuri
        frequency: undefined
      };
      
      createTransactionMutation.mutate(createPayload, {
        onSuccess: () => {
          console.log('Tranzacție creată cu succes!');
          // Se poate adăuga notificare UI aici
        },
        onError: (error: Error) => {
          console.error('Eroare la crearea tranzacției:', error);
          // Se poate adăuga notificare eroare aici
        }
      });
    }, 
    [year, month, createTransactionMutation]
  );
  
  // Helper pentru a determina tipul tranzacției - funcție LOCALĂ, nu referință externă
  const determineTransactionType = (category: string): TransactionType => {
    if (category === 'VENITURI') return TransactionType.INCOME;
    if (category === 'ECONOMII') return TransactionType.SAVING;
    return TransactionType.EXPENSE;
  };
  
  // Handler pentru click pe celulă - adaptat pentru tipul așteptat de useLunarGridTable
  const handleCellClick = useCallback(
    (e: React.MouseEvent, category: string, subcategory: string | undefined, day: number, amount: string, type: string) => {
      // Deschide popover pentru editare tranzacție
      setPopover({
        category,
        subcategory,
        day,
        type: type as TransactionType,
        amount,
        anchorEl: e.currentTarget as HTMLElement
      });
    }, 
    []
  );
  
  // Handler pentru salvarea tranzacției din popover
  const handleSavePopover = useCallback(
    async (formData: {
      amount: string;
      description: string; 
      recurring: boolean;
      frequency?: FrequencyType;
    }) => {
      if (!popover) {
        console.error("Date lipsă din popover la salvare.");
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
        description: formData.description,
        recurring: formData.recurring,
        frequency: formData.recurring ? formData.frequency : undefined,
      };

      if (transactionIdToEdit) {
        // Operație de UPDATE
        updateTransactionMutation.mutate(
          { 
            id: transactionIdToEdit, 
            transactionData: commonPayload 
          }, 
          {
            onSuccess: () => {
              setPopover(null);
              console.log('Tranzacție actualizată cu succes!');
            },
            onError: (error: Error) => {
              console.error('Eroare la actualizarea tranzacției:', error);
            },
          }
        );
      } else {
        // Operație de CREATE
        createTransactionMutation.mutate(commonPayload, {
          onSuccess: () => {
            setPopover(null);
            console.log('Tranzacție creată cu succes!');
          },
          onError: (error: Error) => {
            console.error('Eroare la crearea tranzacției:', error);
          },
        });
      }
    },
    [popover, year, month, createTransactionMutation, updateTransactionMutation]
  );
  
  // Folosește hook-ul useLunarGridTable pentru logica tabelului
  
  const { 
    table,
    tableContainerRef,
    isLoading, // Adăugat
    error // Adăugat
  } = useLunarGridTable(
    year, 
    month, 
    expandedCategories, 
    handleCellClick, 
    handleCellDoubleClick
  );

  // Render cu constante și clase existente
  return (
    <div>
      <div className="flex justify-end space-x-2 mb-2">
        <button 
          onClick={() => expandAll()}
          className="btn btn-secondary" 
          data-testid="expand-all-btn"
        >
          {EXCEL_GRID.TABLE_CONTROLS.EXPAND_ALL}
        </button>
        <button 
          onClick={() => collapseAll()}
          className="btn btn-secondary" 
          data-testid="collapse-all-btn"
        >
          {EXCEL_GRID.TABLE_CONTROLS.COLLAPSE_ALL}
        </button>
      </div>
      
      {/* TanStack Table implementation */}
      <div 
        ref={tableContainerRef}
        className="overflow-auto rounded-lg shadow-token bg-secondary-50 h-[600px]"
      >
        {isLoading ? (
          <div className="text-center py-token-xl text-secondary-600" data-testid="loading-indicator">
            {EXCEL_GRID.LOADING}
          </div>
        ) : error ? (
          <div className="text-center py-token-xl text-red-500" data-testid="error-indicator">
            {MESAJE.EROARE_INCARCARE_TRANZACTII} {error.message}
          </div>
        ) : table.getRowModel().rows.length === 0 ? (
          <div className="text-center py-token-xl text-secondary-600" data-testid="no-data-indicator">
            {EXCEL_GRID.NO_DATA}
          </div>
        ) : (
          <table 
            className="w-full text-sm align-middle border-separate border-spacing-0"
            data-testid="lunar-grid-table"
          >
            <thead className="bg-secondary-100 sticky top-0">
              <tr>
                {table.getFlatHeaders().map((header: Header<TransformedTableDataRow, unknown>) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 font-medium text-secondary-700 border-b border-secondary-200"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row: TableRow<TransformedTableDataRow>) => {
                const isCategory = row.original.type === 'category';
                const isExpanded = expandedCategories[row.original.category || ''];
                
                return (
                  <tr
                    key={row.id}
                    className={
                      isCategory
                        ? "bg-primary-50 hover:bg-primary-100 cursor-pointer"
                        : "hover:bg-secondary-50"
                    }
                    onClick={
                      isCategory
                        ? () => toggleCategory(row.original.category || '')
                        : undefined
                    }
                    data-testid={`row-${row.id}`}
                    data-category={row.original.category}
                    data-subcategory={row.original.subcategory}
                  >
                    {row.getVisibleCells().map((cell: Cell<TransformedTableDataRow, unknown>) => (
                      <td 
                        key={cell.id}
                        className="border-t border-secondary-200 py-2 px-3 first:border-l last:border-r"
                        data-testid={`cell-${cell.column.id}-${row.id}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Popover pentru editare tranzacție */}
      {popover && (
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
          anchorRef={{ current: popover.anchorEl }}
        />
      )}
    </div>
  );
};

export default LunarGridTanStack;
