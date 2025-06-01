import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { MESAJE } from '@shared-constants';

export const usePersistentExpandedRows = (year: number, month: number) => {
  const storageKey = `lunarGrid-expanded-${year}-${month}`;
  
  const [expandedRows, setExpandedRowsState] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Eroare la încărcarea stării expanded din localStorage:', error);
      return {};
    }
  });

  const setExpandedRows = useCallback((newState: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => {
    setExpandedRowsState(prev => {
      const finalState = typeof newState === 'function' ? newState(prev) : newState;
      
      try {
        localStorage.setItem(storageKey, JSON.stringify(finalState));
      } catch (error) {
        console.warn('Eroare la salvarea stării expanded în localStorage:', error);
      }
      
      return finalState;
    });
  }, [storageKey]);

  return [expandedRows, setExpandedRows] as const;
};

export const handleCleanOrphanTransactions = async (
  user: { id: string } | null | undefined,
  validTransactions: any[],
  deleteTransactionMutation: { mutateAsync: (id: string) => Promise<any> }
) => {
  if (!user?.id) return;
  
  const orphanTransactions = validTransactions.filter(t => 
    t.category && (!t.subcategory || t.subcategory.trim() === "")
  );
  
  if (orphanTransactions.length === 0) {
    toast.success("Nu există tranzacții orfane de curățat!");
    return;
  }
  
  const confirmed = window.confirm(
    `Sigur vrei să ștergi ${orphanTransactions.length} tranzacții fără subcategorie?\n\n` +
    `Acestea sunt:\n${orphanTransactions.map(t => 
      `- ${t.category}: ${t.amount} RON (${t.date})`
    ).join('\n')}`
  );
  
  if (!confirmed) return;
  
  try {
    console.log("🗑️ Ștergând tranzacții orfane:", orphanTransactions.map(t => t.id));
    
    for (const transaction of orphanTransactions) {
      await deleteTransactionMutation.mutateAsync(transaction.id);
      console.log(`✅ Șters: ${transaction.id} (${transaction.category}: ${transaction.amount} RON)`);
    }
    
    toast.success(`${orphanTransactions.length} tranzacții orfane șterse cu succes!`);
  } catch (error) {
    console.error("Eroare la ștergerea tranzacțiilor orfane:", error);
    toast.error(MESAJE.CATEGORII.EROARE_STERGERE_ORFANE);
  }
};

// TODO: Adaugă handleCleanOrphanTransactions aici mai târziu 