
import { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { useReactTable, getCoreRowModel, ColumnDef, Table } from '@tanstack/react-table';

import { TransactionValidated } from '@shared-constants/transaction.schema';
import { EXCEL_GRID } from '@shared-constants';

// Import stores (doar cele necesare, am eliminat useTransactionStore)
import { useCategoryStore } from '../../../../stores/categoryStore';
import { useAuthStore } from '../../../../stores/authStore';
// Înlocuim useTransactions cu wrapper-ul dedicat pentru LunarGrid
import { useLunarGridTransactions, LunarGridTransactionResult } from './useLunarGridTransactions';

import type { LunarGridRowData } from '../types';

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
// Interfață pentru rezultatul hook-ului useLunarGridTable
export interface UseLunarGridTableResult {
  table: Table<TransformedTableDataRow>;
  tableContainerRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  error: Error | null;
  getCellId: (category: string, subcategory: string | undefined, day: number) => string;
  columns: ColumnDef<TransformedTableDataRow>[];
  days: number[];
  dailyBalances: Record<number, number>;
}

export function useLunarGridTable(
  year: number,
  month: number,
  expandedCategories: Record<string, boolean>,
  onCellClick?: (e: React.MouseEvent, category: string, subcategory: string | undefined, day: number, amount: string, type: string) => void,
  onCellDoubleClick?: (e: React.MouseEvent, category: string, subcategory: string | undefined, day: number, amount: string) => void
): UseLunarGridTableResult {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Store hooks (fără useTransactionStore)
  const categories = useCategoryStore(state => state.categories);
  const user = useAuthStore(state => state.user);
  
  // Parametri query gestionați local în loc de useTransactionStore
  const [queryParams, setQueryParams] = useState({
    year,
    month,
    includeAdjacentDays: true
  });
  
  // React Query hook pentru tranzacții - acum folosim wrapper-ul dedicat pentru LunarGrid
  const lunarGridResult = useLunarGridTransactions(queryParams, user?.id);
  
  // Extragem datele din rezultat
  const transactions = useMemo(() => lunarGridResult.data || [], [lunarGridResult.data]);
  const totalCount = useMemo(() => lunarGridResult.count || 0, [lunarGridResult.count]);
  const isLoadingTransactions = lunarGridResult.isLoading;
  const queryError = lunarGridResult.error;

  // Gestionare erori de la React Query
  useEffect(() => {
    if (queryError) {
      console.error("Error fetching transactions:", queryError.message);
    }
  }, [queryError]);

  // Gestionarea schimbării lunii/anului - acum cu state local
  useEffect(() => {
    // Actualizăm parametrii de query când se schimbă anul sau luna
    setQueryParams(prev => ({
      ...prev,
      year,
      month,
      includeAdjacentDays: true
    }));
  }, [year, month]);

  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

  // Pipeline de transformare a datelor
  // Filtrăm tranzacțiile fără ID și facem cast la TransactionValidated pentru compatibilitate
  const validTransactions = useMemo(() => 
    transactions
      .filter(t => t.id !== undefined)
      .map(t => t as unknown as TransactionValidated),
    [transactions]
  );
  
  // Transformăm în formatul necesar pentru tabel
  const rawTableData = useMemo(() => 
    transformTransactionsToRowData(validTransactions, categories, expandedCategories), 
    [validTransactions, categories, expandedCategories]
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
  
  // Funcție pentru a genera un ID unic pentru celule (folosit pentru identificarea celulei în editare)
  const getCellId = useCallback((category: string, subcategory: string | undefined, day: number): string => {
    return `${category}-${subcategory || 'null'}-${day}`;
  }, []);

  return {
    table,
    columns, 
    days,
    tableContainerRef,
    dailyBalances,
    isLoading: isLoadingTransactions,
    error: queryError,
    getCellId, // Adăugat pentru suport editare inline
  } as UseLunarGridTableResult;
}
