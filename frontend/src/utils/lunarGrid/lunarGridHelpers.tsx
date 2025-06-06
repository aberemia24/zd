import { useState, useCallback } from 'react';
import { CSSProperties } from 'react';

/**
 * Hook pentru persistent expanded state în LunarGrid
 * Salvează și încarcă starea expanded rows din localStorage
 * 
 * @param year - Anul pentru care se salvează starea
 * @param month - Luna pentru care se salvează starea
 * @returns [expandedRows, setExpandedRows] - Starea și setter-ul pentru expanded rows
 */
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

/**
 * Calculează stilul pentru poziționarea popover-ului
 * @param popover - Obiectul popover cu anchorEl pentru calculul poziției
 * @returns Obiect cu stilurile CSS pentru poziționarea popover-ului
 */
export const calculatePopoverStyle = (
  popover: { anchorEl?: HTMLElement } | null
): CSSProperties => {
  if (!popover || !popover.anchorEl) return {};

  // Verifică dacă elementul este încă în DOM
  try {
    const rect = popover.anchorEl.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    return {
      position: "absolute",
      top: `${rect.top + scrollY}px`,
      left: `${rect.left + scrollX}px`,
    };
  } catch (error) {
    console.warn(
      "Could not get bounding rect for popover anchor element:",
      error,
    );
    return {};
  }
}; 
