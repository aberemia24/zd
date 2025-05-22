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
// Import direct al hook-urilor specializate pentru mutații
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  type CreateTransactionHookPayload,
  type UpdateTransactionHookPayload
} from '../../../services/hooks/transactionMutations';

// Tipuri
import type { Transaction } from '../../../types/Transaction';
import type { CustomCategory } from '../../../types/Category'; 

// Importuri din shared-constants (sursa unică de adevăr) conform memoriei 886c7659
import { EXCEL_GRID } from '@shared-constants';
import { MESAJE } from '@shared-constants/messages';
import { TransactionType, FrequencyType } from '@shared-constants/enums';
import { API } from '@shared-constants/api';

// Import doar componente existente
import CellTransactionPopover from './CellTransactionPopover';
import type { Row } from '@tanstack/react-table';

export interface LunarGridTanStackProps {
  year: number;
  month: number;
}

// Interfață pentru celula în editare
interface EditingCellState {
  id: string;
  category: string;
  subcategory?: string;
  day: number;
  amount: string;
  type: TransactionType;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const LunarGridTanStack: React.FC<LunarGridTanStackProps> = ({ year, month }) => {
  // User și autorizare
  const user = useAuthStore((state) => state.user);
  const userId = user?.id || '';
  
  // Acces la queryClient pentru operații manuale când e nevoie
  const queryClient = useQueryClient();
  
  // Categorii și state management
  const categories = useCategoryStore((state) => state.categories);
  
  // State pentru celula în curs de editare (editare inline)
  const [editingCell, setEditingCell] = useState<EditingCellState | null>(null);
  
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
  
  // Obținem mutațiile din hook-urile specializate
  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();
  
  // State de încărcare pentru mutații
  const isCreating = createTransactionMutation.isPending;
  const isUpdating = updateTransactionMutation.isPending;
  const isDeleting = deleteTransactionMutation.isPending;
  
  // Helper pentru a determina tipul tranzacției - funcție LOCALĂ, nu referință externă
  const determineTransactionType = useCallback((category: string): TransactionType => {
    if (category === 'VENITURI') return TransactionType.INCOME;
    if (category === 'ECONOMII') return TransactionType.SAVING;
    return TransactionType.EXPENSE;
  }, []);
  
  // Handler pentru double-click pe celulă - activează editarea inline
  const handleCellDoubleClick = useCallback(
    (e: React.MouseEvent, category: string, subcategory: string | undefined, day: number, amount: string) => {
      // Prevenim propagarea și default behavior
      e.preventDefault();
      e.stopPropagation();
      
      const transactionType = determineTransactionType(category);
      
      // Generăm un ID unic pentru celula editată
      const cellId = `${category}-${subcategory || 'null'}-${day}`;
      
      // Creăm o referință pentru input pentru a-l putea focaliza
      const inputRef = React.createRef<HTMLInputElement>();
      
      // Setăm starea de editare pentru această celulă
      setEditingCell({
        id: cellId,
        category,
        subcategory,
        day,
        amount,
        type: transactionType,
        inputRef
      });
      
      // Focus pe input după render
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
      
      // Anulează și orice popover existent
      setPopover(null);
    }, 
    [year, month, determineTransactionType]
  );
  
  // Handler pentru salvarea valorii după editare inline
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
    
    createTransactionMutation.mutate(createPayload, {
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
  
  // Notă: Funcția determineTransactionType a fost mutată mai sus
  
  // Handler pentru click pe celulă - adaptat pentru tipul așteptat de useLunarGridTable
  const handleCellClick = useCallback(
    (e: React.MouseEvent, category: string, subcategory: string | undefined, day: number, amount: string, type: string) => {
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
  
  // Handler pentru salvarea tranzacției din popover
  const handleSavePopover = useCallback(
    async (formData: {
      amount: string;
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
        // Eliminăm complet câmpul description și nu mai adaugăm userId (gestionat în useTransactions)
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
    isLoading,
    error,
    getCellId,
    dailyBalances,
    days
  } = useLunarGridTable(
    year, 
    month, 
    {}, // expandedCategories nu mai e folosit, TanStack gestionează intern
    handleCellClick, 
    handleCellDoubleClick
  );

  // Render cu constante și clase existente
  return (
    <div>
      <div className="flex justify-end space-x-2 mb-2">
        <button 
          onClick={() => table.toggleAllRowsExpanded(true)}
          className="btn btn-secondary" 
          data-testid="expand-all-btn"
        >
          {EXCEL_GRID.TABLE_CONTROLS.EXPAND_ALL}
        </button>
        <button 
          onClick={() => table.toggleAllRowsExpanded(false)}
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
                {table.getFlatHeaders().map((header) => (
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
              {/* Rendering recursiv pentru categorii și subcategorii */}
              {table.getRowModel().rows.map(row => renderRow(row))}
              {/* Rândul custom Sold la final */}
              <tr className="bg-gray-100 font-bold border-t-2" data-testid="sold-row">
                <td
                  className="sticky left-0 bg-gray-100 z-10 px-4 py-2"
                  data-testid="sold-label"
                >
                  {EXCEL_GRID.HEADERS.SOLD}
                </td>
                {days.map((day: number) => {
                  const balance = dailyBalances[day] || 0;
                  const colorClass = balance === 0 ? 'text-secondary-400' : balance > 0 ? 'text-success-600 font-medium' : 'text-error-600 font-medium';
                  return (
                    <td
                      key={day}
                      className={`px-4 py-2 text-right ${colorClass}`}
                      data-testid={`sold-day-${day}`}
                    >
                      {typeof balance === 'number' ? (balance !== 0 ? balance.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—') : '—'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        )}
      </div>
      
      {/* Popover pentru editare tranzacție complexă */}
      {popover && !editingCell && (
        <div className="absolute top-0 left-0 z-50" style={{ 
          position: 'absolute',
          top: popover.anchorEl ? `${popover.anchorEl.getBoundingClientRect().bottom}px` : '0px',
          left: popover.anchorEl ? `${popover.anchorEl.getBoundingClientRect().left}px` : '0px'
        }}>
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
        </div>
      )}
    </div>
  );
};

// Adaug funcția recursivă renderRow înainte de return:
const renderRow = (row: Row<TransformedTableDataRow>, level: number = 0): React.ReactNode => {
  console.log('ROW', row.id, row.original);
  // Folosesc cheia robustă generată în pipeline
  const rowKey = row.id;
  return (
    <React.Fragment key={rowKey}>
      <tr className={row.getCanExpand() ? "bg-primary-50" : ""}>
        {row.getVisibleCells().map((cell: Cell<TransformedTableDataRow, unknown>, idx: number) => (
          <td
            key={cell.id}
            style={idx === 0 && level > 0 ? { paddingLeft: 32 * level } : undefined}
            className={idx === 0 && level > 0 ? "pl-8" : ""}
          >
            {/* Săgeată doar dacă este rând de categorie și are subRows */}
            {idx === 0 &&
              row.original &&
              row.original.isCategory === true &&
              Array.isArray(row.subRows) &&
              row.subRows.length > 0 && (
                <span
                  onClick={e => {
                    e.stopPropagation();
                    row.toggleExpanded();
                  }}
                  style={{ cursor: "pointer", marginRight: 8 }}
                  aria-expanded={row.getIsExpanded()}
                  data-testid={`expand-btn-${row.original.category}`}
                >
                  {row.getIsExpanded() ? "▼" : "▶"}
                </span>
              )}
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
      {row.getIsExpanded() && row.subRows.length > 0 &&
        row.subRows.map((subRow: Row<TransformedTableDataRow>) => renderRow(subRow, level + 1))
      }
    </React.Fragment>
  );
};

export default LunarGridTanStack;
