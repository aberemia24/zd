import React from 'react';
import { flexRender, type HeaderGroup, type Table } from "@tanstack/react-table";

// Constante din shared-constants
import { UI } from "@shared-constants";

// CVA styling imports
import { cn } from "../../../../styles/cva/shared/utils";
import {
  gridHeader,
  gridHeaderCell,
  gridTotalRow,
  gridCell,
} from "../../../../styles/cva/grid";

// Utilitare
import { formatCurrencyForGrid } from "../../../../utils/lunarGrid";

// Types pentru data row
import { type TransformedTableDataRow } from "../hooks/useLunarGridTable";

interface LunarGridHeaderProps {
  table: Table<TransformedTableDataRow>;
  dailyBalances: Record<number, number>;
}

const LunarGridHeader: React.FC<LunarGridHeaderProps> = ({ 
  table, 
  dailyBalances 
}) => {
  return (
    <thead className={cn(gridHeader({ variant: "professional" }))}>
      {/* 🎨 Professional Header cu enhanced styling */}
      <tr>
        {table.getFlatHeaders().map((header, index) => {
          const isFirstColumn = index === 0;
          const isNumericColumn = header.id.startsWith("day-") || header.id === "total";
          
          return (
            <th
              key={header.id}
              colSpan={header.colSpan}
              className={cn(
                gridHeaderCell({ 
                  variant: isFirstColumn ? "sticky" : isNumericColumn ? "numeric" : "professional",
                }),
                "text-professional-heading contrast-enhanced",
                isFirstColumn && "min-w-[200px]",
                isNumericColumn && "w-20"
              )}
              style={{ width: header.getSize() }}
            >
              {flexRender(header.column.columnDef.header, header.getContext()) as React.ReactNode}
            </th>
          );
        })}
      </tr>
      
      {/* 🎨 Professional Balance Row cu enhanced styling */}
      <tr className={cn(gridTotalRow({ variant: "balance" }))}>
        {table.getFlatHeaders().map((header, index) => {
          const isFirstColumn = index === 0;
          
          if (isFirstColumn) {
            return (
              <th
                key={`balance-${header.id}`}
                className={cn(
                  gridCell({ type: "balance" }),
                  "text-professional-heading contrast-enhanced"
                )}
              >
                {UI.LUNAR_GRID_TOOLTIPS.DAILY_BALANCES}
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
                    state: dailyBalance > 0 ? "positive" : dailyBalance < 0 ? "negative" : "zero" 
                  }),
                  "text-xs font-financial contrast-high",
                  dailyBalance > 0 ? "value-positive" : dailyBalance < 0 ? "value-negative" : "value-neutral"
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
                    state: monthTotal > 0 ? "positive" : monthTotal < 0 ? "negative" : "zero" 
                  }),
                  "text-sm font-financial contrast-enhanced",
                  monthTotal > 0 ? "value-positive" : monthTotal < 0 ? "value-negative" : "value-neutral"
                )}
              >
                {monthTotal !== 0 ? formatCurrencyForGrid(monthTotal) : "—"}
              </th>
            );
          }
          
          return (
            <th
              key={`balance-${header.id}`}
              className={cn(gridCell({ type: "balance" }))}
            >
              —
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default LunarGridHeader; 