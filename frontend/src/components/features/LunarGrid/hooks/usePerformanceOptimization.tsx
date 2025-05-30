import { useMemo, useCallback, useRef } from 'react';

/**
 * Hook custom pentru optimizări de performanță în componente React
 * Oferă utilități pentru memoizare stabilă și prevenirea re-render-urilor
 */
export function usePerformanceOptimization() {
  // Cache de referințe stable pentru funcții
  const stableRefs = useRef<Record<string, unknown>>({});
  
  /**
   * Creează o funcție stabilă care nu își schimbă identitatea între re-render-uri
   * Util pentru a evita regenerarea handlerilor în componente
   */
  const createStableCallback = useCallback(<T extends (...args: unknown[]) => unknown>(
    key: string,
    callback: T
  ): T => {
    if (!stableRefs.current[key]) {
      stableRefs.current[key] = callback;
    }
    return stableRefs.current[key] as T;
  }, []);
  
  /**
   * Creează un obiect stabil care nu își schimbă identitatea între re-render-uri
   * Util pentru a evita regenerarea obiectelor folosite în props
   */
  const createStableObject = useCallback(<T extends Record<string, unknown>>(
    key: string,
    object: T
  ): T => {
    if (!stableRefs.current[key]) {
      stableRefs.current[key] = object;
    }
    return stableRefs.current[key] as T;
  }, []);
  
  /**
   * Actualizează o referință stabilă dacă valorile s-au schimbat
   * Returnează referința (posibil actualizată)
   */
  const updateStableReference = useCallback(<T extends Record<string, unknown>>(
    key: string,
    newValue: T,
    compareFunc?: (prev: T, next: T) => boolean
  ): T => {
    const prevValue = stableRefs.current[key] as T;
    
    // Dacă nu există valoare anterioară, setăm noua valoare
    if (!prevValue) {
      stableRefs.current[key] = newValue;
      return newValue;
    }
    
    // Dacă există o funcție de comparare, o folosim
    if (compareFunc) {
      if (!compareFunc(prevValue, newValue)) {
        stableRefs.current[key] = newValue;
        return newValue;
      }
      return prevValue;
    }
    
    // Verificare simplă de egalitate
    if (JSON.stringify(prevValue) !== JSON.stringify(newValue)) {
      stableRefs.current[key] = newValue;
      return newValue;
    }
    
    return prevValue;
  }, []);
  
  /**
   * Verifică dacă două obiecte sunt diferite la nivel superficial (shallow diff)
   * Folosit pentru a decide dacă trebuie actualizate referințele
   */
  const shallowDiff = useCallback(<T extends Record<string, unknown>>(
    prevObj: T, 
    nextObj: T
  ): boolean => {
    // Verificăm dacă sunt aceleași referințe
    if (prevObj === nextObj) return false;
    
    // Verificăm dacă au aceleași chei
    const prevKeys = Object.keys(prevObj);
    const nextKeys = Object.keys(nextObj);
    
    if (prevKeys.length !== nextKeys.length) return true;
    
    // Verificăm dacă valorile sunt egale (comparație shallow)
    for (const key of prevKeys) {
      if (prevObj[key] !== nextObj[key]) {
        return true;
      }
    }
    
    return false;
  }, []);
  
  return {
    createStableCallback,
    createStableObject,
    updateStableReference,
    shallowDiff
  };
}

export default usePerformanceOptimization;
