import { useEffect, useMemo } from 'react';

// Types pentru hook
interface UseLunarGridEffectsAndNavigationProps {
  validTransactions: any[];
  table: any;
}

// Hook pentru effects și navigation preparation în LunarGrid
export const useLunarGridEffectsAndNavigation = ({
  validTransactions,
  table,
}: UseLunarGridEffectsAndNavigationProps) => {
  
  // 🚨 VERIFICARE TEMPORARĂ: Detectează tranzacții fără subcategorie (nu ar trebui să existe)
  useEffect(() => {
    if (validTransactions && validTransactions.length > 0) {
      const transactionsWithoutSubcategory = validTransactions.filter(t => 
        t.category && (!t.subcategory || t.subcategory.trim() === "")
      );
      
      if (transactionsWithoutSubcategory.length > 0) {
        console.error("🚨 TRANZACȚII FĂRĂ SUBCATEGORIE DETECTATE (Date murdare):", 
          transactionsWithoutSubcategory.map(t => ({
            id: t.id,
            amount: t.amount,
            date: t.date,
            category: t.category,
            subcategory: t.subcategory,
            description: t.description
          }))
        );
        console.warn("⚠️ Aceste tranzacții ar trebui șterse sau migrate către subcategorii!");
      }
    }
  }, [validTransactions]);

  // 🚨 FILTRARE TEMPORARĂ: Exclude tranzacții fără subcategorie din procesare
  const cleanTransactions = useMemo(() => {
    return validTransactions.filter(t => 
      t.category && t.subcategory && t.subcategory.trim() !== ""
    );
  }, [validTransactions]);

  // 🎯 LGI-TASK-06: Prepare data pentru keyboard navigation
  const navigationRows = useMemo(() => {
    return table.getRowModel().rows.map((row: any) => ({
      category: row.original.category,
      subcategory: row.original.subcategory,
      isExpanded: row.getIsExpanded(),
    }));
  }, [table]);

  return {
    cleanTransactions,
    navigationRows,
  };
}; 