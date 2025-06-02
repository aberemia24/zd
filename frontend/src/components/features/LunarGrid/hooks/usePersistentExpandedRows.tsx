import { useState, useCallback } from 'react';

// Hook pentru persistent expanded state în LunarGrid
export const usePersistentExpandedRows = (year: number, month: number) => {
  const storageKey = `lunarGrid-expanded-${year}-${month}`;
  
  // Încarcă starea din localStorage la mount
  const [expandedRows, setExpandedRowsState] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Eroare la încărcarea stării expanded din localStorage:', error);
      return {};
    }
  });

  // Salvează starea în localStorage de fiecare dată când se schimbă
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