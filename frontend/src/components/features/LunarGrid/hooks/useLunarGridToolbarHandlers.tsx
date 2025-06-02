import { useCallback } from 'react';

// Types pentru toolbar handlers
interface UseLunarGridToolbarHandlersProps {
  table: any;
  setExpandedRows: (newState: Record<string, boolean>) => void;
  validTransactions: any[];
}

// Hook pentru handlers de toolbar în LunarGrid
export const useLunarGridToolbarHandlers = ({
  table,
  setExpandedRows,
  validTransactions,
}: UseLunarGridToolbarHandlersProps) => {
  
  // Handler pentru toggle expand/collapse all
  const handleToggleExpandAll = useCallback(() => {
    const isCurrentlyExpanded = table.getIsAllRowsExpanded();
    const newExpandedState: Record<string, boolean> = {};
    
    if (!isCurrentlyExpanded) {
      // Expandează toate
      table.getRowModel().rows.forEach((row: any) => {
        if (row.getCanExpand()) {
          newExpandedState[row.id] = true;
        }
      });
    }
    // Dacă se colapsează, lăsăm newExpandedState gol (toate false)
    
    setExpandedRows(newExpandedState);
    table.toggleAllRowsExpanded(!isCurrentlyExpanded);
  }, [table, setExpandedRows]);

  // Handler pentru reset expanded state
  const handleResetExpanded = useCallback(() => {
    setExpandedRows({});
    table.resetExpanded();
  }, [table, setExpandedRows]);

  // Handler pentru clean orphan transactions
  const handleCleanOrphans = useCallback(() => {
    // TODO: Implementați logica pentru ștergerea tranzacțiilor orfane
    console.log("Ștergerea tranzacțiilor orfane nu este implementată în versiunea actuală");
  }, []);

  // Calculează numărul de tranzacții orfane
  const orphanTransactionsCount = validTransactions.filter(t => 
    t.category && (!t.subcategory || t.subcategory.trim() === "")
  ).length;

  return {
    handleToggleExpandAll,
    handleResetExpanded,
    handleCleanOrphans,
    orphanTransactionsCount,
    getIsAllRowsExpanded: () => table.getIsAllRowsExpanded(),
  };
}; 