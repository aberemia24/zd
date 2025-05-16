
import { useMemo, useRef, useCallback, useEffect } from 'react';
import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';

import { TransactionValidated } from '@shared-constants/transaction.schema';
import { EXCEL_GRID } from '@shared-constants';

// Import stores
import { useTransactionStore } from '../../../../stores/transactionStore';
import { useCategoryStore } from '../../../../stores/categoryStore';

import type { LunarGridRowData, UseLunarGridTableResult } from '../types';

// Import-uri utilitare din @utils/lunarGrid (via barrel file)
import {
  getDaysInMonth,
  formatCurrency,
  getBalanceStyleClass,
  transformTransactionsToRowData,
  generateTableColumns,
  transformToTableData,
} from '../../../../utils/lunarGrid';

// Tip pentru datele transformate pentru TanStack Table
export type TransformedTableDataRow = {
  id: string;
  category: string;
  subcategory?: string;
  isCategory: boolean;
  total: number;
  [dayKey: string]: any; // For 'day-1', 'day-2', etc.
};

/**
 * Hook pentru gestionarea datelor și stării pentru LunarGrid bazat pe TanStack Table.
 * Abstractizează logica de procesare a datelor și construcția tabelului.
 */
export function useLunarGridTable(
  year: number,
  month: number,
  expandedCategories: Record<string, boolean>,
  onCellClick?: (e: React.MouseEvent, category: string, subcategory: string | undefined, day: number, amount: string, type: string) => void,
  onCellDoubleClick?: (e: React.MouseEvent, category: string, subcategory: string | undefined, day: number, amount: string) => void
): UseLunarGridTableResult {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Store hooks
  const transactions = useTransactionStore(state => state.transactions);
  const categories = useCategoryStore(state => state.categories);
  const setTransactionQueryParams = useTransactionStore(state => state.setQueryParams);
  const fetchTransactions = useTransactionStore(state => state.fetchTransactions);

  // Gestionarea schimbării lunii/anului
  const lastParamsRef = useRef({ year, month });

  useEffect(() => {
    const { year: prevY, month: prevM } = lastParamsRef.current;
    if (prevY !== year || prevM !== month) {
      lastParamsRef.current = { year, month };
      setTransactionQueryParams({ year, month, includeAdjacentDays: true });
      fetchTransactions(true); // forțăm refresh pentru a ocoli cache-ul lunar
    }
  }, [year, month, setTransactionQueryParams, fetchTransactions]);

  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

  // Pipeline de transformare a datelor
  const rawTableData = useMemo(() => 
    transformTransactionsToRowData(transactions, categories, expandedCategories), 
    [transactions, categories, expandedCategories]
  );

  const tableDataForTanStack = useMemo(() => 
    transformToTableData(rawTableData, year, month), 
    [rawTableData, year, month]
  ) as TransformedTableDataRow[];

  // Generare coloane pentru tabel
  const columns = useMemo<ColumnDef<TransformedTableDataRow>[]>(() => {
    const generatedCols = generateTableColumns(year, month); // Din @utils/lunarGrid/dataTransformers

    return generatedCols.map(colConfig => {
      if (colConfig.accessorKey === 'category') {
        return {
          id: 'category',
          header: colConfig.header,
          accessorFn: (row: TransformedTableDataRow) => row.isCategory ? row.category : row.subcategory,
          cell: ({ row, getValue }) => {
            const displayValue = getValue<string>();
            const original = row.original as TransformedTableDataRow;
            return (
              <div className="flex items-center">
                {original.isCategory ? (
                  <>
                    {expandedCategories[original.category] ? (
                      <span className="mr-1" data-testid={`expand-btn-${original.category}`}>▼</span>
                    ) : (
                      <span className="mr-1" data-testid={`expand-btn-${original.category}`}>▶</span>
                    )}
                    <span className="font-semibold">{displayValue}</span>
                  </>
                ) : (
                  <div className="flex items-center pl-8">
                    <div className="w-4 h-0 border-t border-secondary-400 mr-2" />
                    <span>{displayValue}</span>
                  </div>
                )}
              </div>
            );
          },
          size: 200,
        };
      }
      
      if (colConfig.accessorKey?.startsWith('day-')) {
        const dayNumber = parseInt(colConfig.accessorKey.split('-')[1], 10);
        return {
          id: colConfig.accessorKey,
          header: colConfig.header,
          accessorKey: colConfig.accessorKey,
          cell: ({ getValue, row }) => {
            const value = getValue<number>();
            const original = row.original as TransformedTableDataRow;
            const colorClass = getBalanceStyleClass(value);
            return (
              <div
                className={`text-right ${colorClass}`}
                data-testid={`cell-${original.category}-${original.subcategory || 'category'}-${dayNumber}`}
                onClick={(e) => {
                  if (original.category !== EXCEL_GRID.HEADERS.SOLD) {
                    const amount = value !== 0 ? Math.abs(value).toString() : '';
                    // TODO: type needs to be determined. Placeholder for now.
                    onCellClick?.(e, original.category, original.subcategory, dayNumber, amount, ''); 
                  }
                }}
                onDoubleClick={(e) => {
                  if (original.category !== EXCEL_GRID.HEADERS.SOLD) {
                    const amount = value !== 0 ? Math.abs(value).toString() : '';
                    onCellDoubleClick?.(e, original.category, original.subcategory, dayNumber, amount);
                  }
                }}
              >
                {value !== 0 ? formatCurrency(value) : '—'}
              </div>
            );
          },
          size: 80,
        };
      }

      if (colConfig.accessorKey === 'total') {
        return {
          id: 'total',
          header: colConfig.header,
          accessorKey: colConfig.accessorKey,
          cell: ({ getValue }) => {
            const value = getValue<number>();
            const colorClass = getBalanceStyleClass(value);
            return <div className={`text-right ${colorClass}`}>{formatCurrency(value)}</div>;
          },
          size: 100,
        };
      }
      return colConfig as ColumnDef<TransformedTableDataRow>; // Fallback, ar trebui acoperite toate cazurile
    });
  }, [year, month, expandedCategories, onCellClick, onCellDoubleClick, formatCurrency, getBalanceStyleClass]);

  const table = useReactTable({
    data: tableDataForTanStack,
    columns,
    getCoreRowModel: getCoreRowModel(),
    autoResetExpanded: false, // Conform recomandare utilizator
    getRowId: (row) => row.id, // Conform recomandare utilizator, 'id' vine din transformToTableData
  });

  const dailyBalances = useMemo(() => {
    const soldRow = rawTableData.find((r: LunarGridRowData) => r.category === EXCEL_GRID.HEADERS.SOLD);
    return soldRow ? soldRow.dailyAmounts : {};
  }, [rawTableData]);

  // Funcția getSumForCell originală se baza pe LunarGridRowData.
  // O adaptăm sau o eliminăm dacă nu mai e necesară extern.
  // Pentru moment, o comentăm, deoarece LunarGridTanStack nu pare să o folosească direct.
  /*
  const getSumForCell = useCallback((category: string, subcategory: string | undefined, day: number) => {
    const row = rawTableData.find((r: LunarGridRowData) => 
      r.category === category && 
      (subcategory ? r.subcategory === subcategory : r.isCategory)
    );
    return row ? row.dailyAmounts[day] || 0 : 0;
  }, [rawTableData]);
  */

  return {
    table,
    // data: tableDataForTanStack, // Poate fi util pentru componenta, dar tabelul o are deja
    columns, // Pot fi utile pentru randare custom a headerelor
    days,
    tableContainerRef,
    dailyBalances,
    // getSumForCell, // Comentat momentan
    // updateTableData - nu mai este necesar, datele sunt reactive din store
  } as UseLunarGridTableResult; // TODO: Update UseLunarGridTableResult type
}
