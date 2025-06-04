import React from 'react';
import { Table } from '@tanstack/react-table';

// CVA styling imports - MIGRATED TO CVA-V2
import { cn, button } from "../../../../styles/cva-v2";

import Button from "../../../primitives/Button/Button";
import { LUNAR_GRID, UI } from "@shared-constants";

interface LunarGridToolbarProps {
  table: Table<any>;
  expandedRows: Record<string, boolean>;
  setExpandedRows: (rows: Record<string, boolean>) => void;
  validTransactions: Array<{
    category?: string;
    subcategory?: string | null | undefined;
    [key: string]: any;
  }>;
  onCleanOrphanTransactions: () => void;
}

const LunarGridToolbar: React.FC<LunarGridToolbarProps> = ({
  table,
  expandedRows,
  setExpandedRows,
  validTransactions,
  onCleanOrphanTransactions
}) => {
  const handleToggleExpandAll = () => {
    const isCurrentlyExpanded = table.getIsAllRowsExpanded();
    const newExpandedState: Record<string, boolean> = {};
    
    if (!isCurrentlyExpanded) {
      // Expandează toate
      table.getRowModel().rows.forEach(row => {
        if (row.getCanExpand()) {
          newExpandedState[row.id] = true;
        }
      });
    }
    // Dacă se colapsează, lăsăm newExpandedState gol (toate false)
    
    setExpandedRows(newExpandedState);
    table.toggleAllRowsExpanded(!isCurrentlyExpanded);
  };

  const handleResetExpanded = () => {
    setExpandedRows({});
    table.resetExpanded();
  };

  // Calculează numărul de tranzacții orfane
  const orphanTransactionsCount = validTransactions.filter(t => 
    t.category && (!t.subcategory || t.subcategory.trim() === "")
  ).length;

  const hasOrphanTransactions = orphanTransactionsCount > 0;

  return (
    <div className="flex flex-row justify-start items-center gap-3 mb-4">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleToggleExpandAll}
        data-testid="toggle-expand-all"
      >
        {table.getIsAllRowsExpanded() ? LUNAR_GRID.COLLAPSE_ALL : LUNAR_GRID.EXPAND_ALL}
      </Button>
      
      <Button
        variant="secondary"
        size="sm"
        onClick={handleResetExpanded}
        data-testid="reset-expanded"
      >
        {LUNAR_GRID.RESET_EXPANSION}
      </Button>
      
      {/* 🚨 BUTON TEMPORAR DEBUGGING: Curățare tranzacții orfane */}
      {hasOrphanTransactions && (
        <Button
          variant="danger"
          size="sm"
          onClick={onCleanOrphanTransactions}
          data-testid="clean-orphan-transactions"
        >
          🗑️ Curăță tranzacții orfane ({orphanTransactionsCount})
        </Button>
      )}
    </div>
  );
};

export default LunarGridToolbar; 