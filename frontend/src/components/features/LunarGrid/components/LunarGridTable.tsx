import React, { memo } from 'react';
import { flexRender, Row } from "@tanstack/react-table";

// CVA styling imports - MIGRATED TO CVA-V2
import { 
  cn,
  gridCell,
  gridHeader,
  gridRow,
  textProfessional,
} from "../../../../styles/cva-v2";

// Utilitare
import { formatCurrencyForGrid } from "../../../../utils/lunarGrid";

// Componente
import LunarGridRow from "./LunarGridRow";
import LunarGridHeader from "./LunarGridHeader";

// Types - importăm tipurile din hook-ul useLunarGridTable
import { TransformedTableDataRow } from "../hooks/useLunarGridTable";
import { CellPosition } from "../hooks/useKeyboardNavigationSimplified";

export interface LunarGridTableProps {
  // Table data și config
  table: any; // TanStack table instance
  
  // Daily balances pentru balance row
  dailyBalances: Record<number, number>;
  
  // Row rendering
  renderRow: (row: Row<TransformedTableDataRow>) => React.ReactNode;
  
  // Highlighted cell pentru visual feedback
  highlightedCell: CellPosition | null;
  
  // Keyboard navigation - folosim tipul CellPosition complet
  isPositionSelected?: (position: CellPosition) => boolean;
  isPositionFocused?: (position: CellPosition) => boolean;
  
  // Cell interaction handlers
  onCellClick?: (position: CellPosition, event?: { ctrlKey?: boolean; shiftKey?: boolean; metaKey?: boolean }) => void;
  
  // Header props - adăugate pentru integrarea în tabel
  year: number;
  month: number;
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
  monthOptions?: Array<{ value: string; label: string }>;
  isAllRowsExpanded: boolean;
  onToggleExpandAll: () => void;
  onResetExpanded: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  title?: string;
}

const LunarGridTable: React.FC<LunarGridTableProps> = memo(({
  table,
  dailyBalances,
  renderRow,
  highlightedCell,
  isPositionSelected,
  isPositionFocused,
  onCellClick,
  // Header props
  year,
  month,
  onYearChange,
  onMonthChange,
  monthOptions,
  isAllRowsExpanded,
  onToggleExpandAll,
  onResetExpanded,
  isFullscreen = false,
  onToggleFullscreen,
  title = "Grid Lunar"
}) => {
  return (
    <table 
      className="w-full border-collapse table-auto"
      data-testid="lunar-grid-table"
    >
      {/* 🎨 Table Headers cu headerul integrat */}
      <thead className={cn(gridHeader({ sortable: false, sticky: true }), "border-spacing-0")}>
        {/* 🎯 HEADER INTEGRAT - primul rând cu controale și navigare */}
        <tr className="bg-white border-t-0">
          <LunarGridHeader
            year={year}
            month={month}
            onYearChange={onYearChange}
            onMonthChange={onMonthChange}
            monthOptions={monthOptions}
            isAllRowsExpanded={isAllRowsExpanded}
            onToggleExpandAll={onToggleExpandAll}
            onResetExpanded={onResetExpanded}
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
            title={title}
          />
        </tr>
        
        {/* Headers cu zilele */}
        <tr className="bg-white border-t-0">
          {table.getFlatHeaders().map((header: any, index: number) => {
            const isFirstColumn = index === 0;
            const isNumericColumn = header.id.startsWith("day-") || header.id === "total";
            const isPinned = header.column.getIsPinned();
            
            return (
              <th
                key={header.id}
                colSpan={header.colSpan}
                className={cn(
                  gridCell({ 
                    type: "header",
                    size: "md",
                    frozen: isPinned ? "column" : false
                  }),
                  textProfessional({ variant: "heading", contrast: "enhanced" }),
                  isFirstColumn && "min-w-[200px]",
                  isNumericColumn && "w-20",
                  "select-none cursor-default"
                )}
                style={{ 
                  width: header.getSize(),
                  ...(isPinned && {
                    position: 'sticky',
                    left: 0,
                    zIndex: 10
                  })
                }}
              >
                {flexRender(header.column.columnDef.header, header.getContext()) as React.ReactNode}
              </th>
            );
          })}
        </tr>
        
        {/* 🎨 Professional Balance Row cu enhanced styling */}
        <tr className="bg-white border-t-0">
          {table.getFlatHeaders().map((header: any, index: number) => {
            const isFirstColumn = index === 0;
            const isPinned = header.column.getIsPinned();
            
            if (isFirstColumn) {
              return (
                <th
                  key={`balance-${header.id}`}
                  className={cn(
                    gridCell({ 
                      type: "balance",
                      frozen: "both"
                    }),
                    textProfessional({ variant: "heading", contrast: "enhanced" }),
                    "select-none cursor-default"
                  )}
                  style={{
                    position: 'sticky',
                    left: 0,
                    top: 0,
                    zIndex: 30
                  }}
                >
                  Daily Balances
                </th>
              );
            }
            
            if (header.id.startsWith("day-")) {
              const dayNumber = parseInt(header.id.split("-")[1], 10);
              const dailyBalance = dailyBalances[dayNumber] || 0;
              
              return (
                <th
                  key={`balance-${header.id}`}
                  className={cn(
                    gridCell({ 
                      type: "balance",
                      alignment: "center", // Center alignment pentru daily balance
                      state: dailyBalance > 0 ? "positive" : dailyBalance < 0 ? "negative" : "default" 
                    }),
                    "contrast-high",
                    dailyBalance > 0 ? "value-positive" : dailyBalance < 0 ? "value-negative" : "value-neutral",
                    "select-none cursor-default"
                  )}
                >
                  {dailyBalance !== 0 ? formatCurrencyForGrid(dailyBalance) : "—"}
                </th>
              );
            }
            
            if (header.id === "total") {
              const monthTotal = Object.values(dailyBalances).reduce((sum, val) => sum + val, 0);
              return (
                <th
                  key={`balance-${header.id}`}
                  className={cn(
                    gridCell({ 
                      type: "balance",
                      alignment: "center", // Center alignment pentru month total 
                      state: monthTotal > 0 ? "positive" : monthTotal < 0 ? "negative" : "default" 
                    }),
                    "contrast-high",
                    monthTotal > 0 ? "value-positive" : monthTotal < 0 ? "value-negative" : "value-neutral",
                    "select-none cursor-default"
                  )}
                >
                  {monthTotal !== 0 ? formatCurrencyForGrid(monthTotal) : "—"}
                </th>
              );
            }
            
            return (
              <th
                key={`balance-${header.id}`}
                className={cn(gridCell({ 
                  type: "balance",
                  alignment: "center" // Center alignment pentru empty balance cells
                }))}
              >
                —
              </th>
            );
          })}
        </tr>
      </thead>
      
      {/* 🎨 Table Body cu rows */}
      <tbody>
        {table.getRowModel().rows.map((row: Row<TransformedTableDataRow>) => renderRow(row))}
      </tbody>
    </table>
  );
});

// Add display name for debugging
LunarGridTable.displayName = 'LunarGridTable';

export default LunarGridTable; 