/**
 * Dedicated types file for LunarGrid table functionality
 * Created to break circular dependency between hooks/useLunarGridTable.tsx and types.tsx
 */

import type { Table, ColumnDef } from "@tanstack/react-table";

// Interface pentru sumele zilnice
export interface DailyAmount {
  [dayKey: `day-${number}`]: number;
}

// Tip pentru datele transformate pentru TanStack Table
export type TransformedTableDataRow = {
  id: string;
  category: string;
  subcategory?: string;
  isCategory: boolean;
  total: number;
  subRows?: TransformedTableDataRow[]; // Pentru subrows native
} & DailyAmount;

// Tip pentru maparea tranzacțiilor individuale
export type TransactionMap = Map<string, string>; // key: "category-subcategory-day", value: transactionId

// Interface pentru rezultatul hook-ului useLunarGridTable
export interface UseLunarGridTableResult {
  table: Table<TransformedTableDataRow>;
  tableContainerRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  error: Error | null;
  getCellId: (
    category: string,
    subcategory: string | undefined,
    day: number,
  ) => string;
  columns: ColumnDef<TransformedTableDataRow>[];
  days: number[];
  dailyBalances: Record<number, number>;
  transactionMap: TransactionMap;
} 