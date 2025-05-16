
import { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';

// Import-uri din bibliotecile externe
import { TransactionValidated } from '@shared-constants/transaction.schema';
import { EXCEL_GRID } from '@shared-constants';

// Import-uri tipuri locale
import type { LunarGridRowData, UseLunarGridTableResult } from '../types';

// Import-uri utilitare existente
import {
  getDaysInMonth,
  formatCurrency,
  getBalanceStyleClass,
  transformTransactionsToRowData,
  getSumForCell as getAmountForCell
} from '../../../../utils/lunarGrid';

/**
 * Hook pentru gestionarea datelor și stării pentru LunarGrid bazat pe TanStack Table
 * Abstractizează logica de procesare a datelor și construcția tabelului
 * Utilizează utilitare pentru transformarea datelor și virtualizare pentru performanță
 */

export function useLunarGridTable(
  transactions: TransactionValidated[],
  categories: { name: string; subcategories: { name: string }[] }[],
  expandedCategories: Record<string, boolean>,
  year: number,
  month: number,
  onCellClick?: (e: React.MouseEvent, category: string, subcategory: string, day: number, amount: string, type: string) => void,
  onCellDoubleClick?: (e: React.MouseEvent, category: string, subcategory: string, day: number, amount: string) => void
): UseLunarGridTableResult {
  // Referință pentru container (necesar pentru virtualizare)
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Calculăm zilele din lună folosind utilitar existent
  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

  // State pentru datele tabelului
  const [tableData, setTableData] = useState<LunarGridRowData[]>([]);

  // Adăugăm efect pentru debug
  useEffect(() => {
    console.log('Transactions count:', transactions.length);
    console.log('Categories count:', categories.length);
    console.log('Table data length:', tableData.length);
  }, [transactions, categories, tableData]);

  // Sincronizăm state-ul când datele se schimbă
  useEffect(() => {
    const transformed = transformTransactionsToRowData(transactions, categories, expandedCategories);
    setTableData(transformed);
  }, [transactions, categories, expandedCategories]);

  // Generare coloane pentru tabel
  const columns = useMemo<ColumnDef<LunarGridRowData>[]>(() => {
    // Coloana pentru categorie
    const categoryColumn: ColumnDef<LunarGridRowData> = {
      id: 'category',
      header: EXCEL_GRID.HEADERS.LUNA,
      accessorFn: (row: LunarGridRowData) => row.isCategory ? row.category : row.subcategory,
      cell: ({ row, getValue }: any) => {
        const value = getValue() as string;
        const isCategory = row.original.isCategory;

        return (
          <div className="flex items-center">
            {isCategory ? (
              <>
                {expandedCategories[row.original.category] ? (
                  <span className="mr-1" data-testid={`expand-btn-${row.original.category}`}>▼</span>
                ) : (
                  <span className="mr-1" data-testid={`expand-btn-${row.original.category}`}>▶</span>
                )}
                <span className="font-semibold">{value}</span>
              </>
            ) : (
              <div className="flex items-center pl-8">
                <div className="w-4 h-0 border-t border-secondary-400 mr-2" />
                <span>{value}</span>
              </div>
            )}
          </div>
        );
      },
      size: 200,
    };

    // Coloane pentru zilele lunii
    const dayColumns = days.map((day: number) => ({
      id: `day-${day}`,
      header: String(day),
      accessorFn: (row: LunarGridRowData) => row.dailyAmounts[day] || 0,
      cell: ({ getValue, row }: any) => {
        const value = getValue() as number;
        const colorClass = getBalanceStyleClass(value);

        return (
          <div
            className={`text-right ${colorClass}`}
            data-testid={`cell-${row.original.category}-${row.original.subcategory || 'category'}-${day}`}
            onClick={(e) => {
              // Procesăm click doar pentru rânduri non-SOLD
              if (row.original.category !== EXCEL_GRID.HEADERS.SOLD) {
                const amount = value !== 0 ? Math.abs(value).toString() : '';
                onCellClick?.(e, row.original.category, row.original.subcategory || '', day, amount, '');
              }
            }}
            onDoubleClick={(e) => {
              // Procesăm dublu-click doar pentru rânduri non-SOLD
              if (row.original.category !== EXCEL_GRID.HEADERS.SOLD) {
                const amount = value !== 0 ? Math.abs(value).toString() : '';
                onCellDoubleClick?.(e, row.original.category, row.original.subcategory || '', day, amount);
              }
            }}
          >
            {value !== 0 ? formatCurrency(value) : '—'}
          </div>
        );
      },
      size: 80,
    }));

    return [categoryColumn, ...dayColumns];
  }, [days, expandedCategories, onCellClick, onCellDoubleClick]);

  // Inițializare tabel TanStack
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  
  // Efect de debugging eliminat pentru optimizare
  
  // Funcție utilitară pentru obținerea sumelor pentru celule
  const getSumForCell = useCallback((category: string, subcategory: string, day: number) => {
    const row = tableData.find((r: LunarGridRowData) => 
      r.category === category && 
      (subcategory ? r.subcategory === subcategory : r.isCategory)
    );
    return row ? row.dailyAmounts[day] || 0 : 0;
  }, [tableData]);
  
  // Calculare solduri zilnice
  const dailyBalances = useMemo(() => {
    return tableData.find((r: LunarGridRowData) => r.category === EXCEL_GRID.HEADERS.SOLD)?.dailyAmounts || {};
  }, [tableData]);

  // Funcție pentru actualizarea datelor tabelului
  const updateTableData = useCallback((newTransactions: TransactionValidated[]) => {
    const transformed = transformTransactionsToRowData(newTransactions, categories, expandedCategories);
    setTableData(transformed);
  }, [categories, expandedCategories]);

  // Returnăm toate datele necesare pentru componenta principală, fără referințe la virtualizare
  return {
    table,
    data: tableData,
    columns,
    days,
    tableContainerRef,
    dailyBalances,
    getSumForCell,
    updateTableData
  };
}
