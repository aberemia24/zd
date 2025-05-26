/**
 * Utilități pentru optimizarea performanței aplicației
 * 
 * Acest fișier conține utilități pentru memoizare, caching și măsurare
 * a performanței componentelor și funcțiilor din aplicație.
 */

import { useCallback, useEffect, useRef } from 'react';

/**
 * Registry global pentru caching
 * Permite păstrarea datelor între re-render-uri și între componente
 */
export class CacheRegistry {
  private static cache: Map<string, { value: any; expiry: number }> = new Map();
  
  /**
   * Obține o valoare din cache sau o calculează folosind factory
   * 
   * @param key - Cheia unică pentru cache
   * @param factory - Funcția care produce valoarea dacă nu există în cache
   * @param maxAge - Timpul maxim de păstrare în cache (ms)
   */
  static getOrCompute<T>(key: string, factory: () => T | Promise<T>, maxAge?: number): T | Promise<T> {
    // Verificăm cache-ul curent
    const entry = this.cache.get(key);
    const now = Date.now();
    
    // Dacă există o intrare validă, o returnăm
    if (entry && (!maxAge || entry.expiry > now)) {
      return entry.value;
    }
    
    // Altfel, calculăm valoarea și o punem în cache
    try {
      const value = factory();
      const expiry = maxAge ? now + maxAge : Number.MAX_SAFE_INTEGER;
      
      // Gestionăm atât valori sincrone cât și Promise-uri
      if (value instanceof Promise) {
        return value.then(resolvedValue => {
          this.cache.set(key, { value: resolvedValue, expiry });
          return resolvedValue;
        });
      } else {
        this.cache.set(key, { value, expiry });
        return value;
      }
    } catch (error) {
      console.error('[CacheRegistry] Eroare la calculul valorii:', error);
      throw error;
    }
  }
  
  /**
   * Invalidează o intrare din cache
   */
  static invalidate(key: string): boolean {
    return this.cache.delete(key);
  }
  
  /**
   * Invalidează toate intrările care încep cu un prefix
   */
  static invalidateByPrefix(prefix: string): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }
  
  /**
   * Curăță cache-ul expirat
   */
  static cleanup(): number {
    let count = 0;
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry <= now) {
        this.cache.delete(key);
        count++;
      }
    }
    
    return count;
  }
  
  /**
   * Resetează complet cache-ul
   */
  static reset(): void {
    this.cache.clear();
  }
}

/**
 * Opțiuni pentru memoizarea cererilor
 */
export interface MemoizeOptions<T extends any[]> {
  /** Timpul maxim de păstrare în cache (ms) */
  maxAge?: number;
  /** Generator de cheie personalizat */
  keyGenerator?: (...args: T) => string;
}

/**
 * Memoizează rezultatele unei funcții async
 * Util pentru request-uri repetate către API
 */
export function memoizeRequest<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: MemoizeOptions<T> = {}
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const key = options.keyGenerator 
      ? options.keyGenerator(...args)
      : `memoized:${fn.name}:${JSON.stringify(args)}`;
    
    return CacheRegistry.getOrCompute(
      key,
      () => fn(...args),
      options.maxAge
    ) as Promise<R>;
  };
}

/**
 * Hook pentru măsurarea performanței renderurilor
 * Afișează warning-uri dacă renderul este prea lent
 */
export function useRenderPerformance(
  componentName: string,
  threshold: number = 16 // 60fps = ~16ms per frame
): void {
  const renderStartTime = useRef(0);
  
  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    if (renderTime > threshold) {
      console.warn(
        `[Performance] Componentul ${componentName} a avut un render lent: ${renderTime.toFixed(2)}ms`
      );
    }
    
    // Măsurăm timpul pentru unmount
    const startUnmount = performance.now();
    
    // Funcție de cleanup pentru useEffect
    return () => {
      const unmountTime = performance.now() - startUnmount;
      if (unmountTime > threshold) {
        console.warn(
          `[Performance] Componentul ${componentName} a avut un unmount lent: ${unmountTime.toFixed(2)}ms`
        );
      }
    };
  });
  
  // Setăm timpul de start pentru următorul render
  renderStartTime.current = performance.now();
}

/**
 * Măsoară timpul de execuție al unei funcții
 */
export function measurePerformance<T extends any[], R>(
  fn: (...args: T) => R,
  name: string
): (...args: T) => R {
  return (...args: T): R => {
    const start = performance.now();
    try {
      return fn(...args);
    } finally {
      const executionTime = performance.now() - start;
      if (executionTime > 100) {
        console.warn(
          `[Performance] Funcția ${name} a durat ${executionTime.toFixed(2)}ms`
        );
      }
    }
  };
}

/**
 * Hook pentru a crea o referință la ultima valoare
 * Util pentru a evita re-render-uri inutile
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * Utilitar pentru debounce - limitează rata de apelare a unei funcții
 */
export function debounce<T extends any[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: T) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      fn(...args);
      timeout = null;
    }, delay);
  };
}

/**
 * Hook pentru debounce într-un component React
 */
export function useDebounce<T extends any[]>(
  callback: (...args: T) => void,
  delay: number
): (...args: T) => void {
  // Utilizăm useCallback pentru a păstra referința la funcție
  return useCallback(
    debounce(callback, delay),
    [callback, delay]
  );
}

/**
 * Utilitar pentru throttle - limitează apelurile la o rată maximă
 */
export function throttle<T extends any[]>(
  fn: (...args: T) => void,
  limit: number
): (...args: T) => void {
  let inThrottle = false;
  let lastArgs: T | null = null;
  
  return (...args: T) => {
    lastArgs = args;
    
    if (!inThrottle) {
      inThrottle = true;
      fn(...lastArgs);
      
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs !== args) {
          fn(...lastArgs!);
        }
      }, limit);
    }
  };
}

/**
 * Hook pentru throttle într-un component React
 */
export function useThrottle<T extends any[]>(
  callback: (...args: T) => void,
  limit: number
): (...args: T) => void {
  // Utilizăm useCallback pentru a păstra referința la funcție
  return useCallback(
    throttle(callback, limit),
    [callback, limit]
  );
} 