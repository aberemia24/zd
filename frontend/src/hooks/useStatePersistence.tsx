import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook unificat pentru state persistence
 * Consolidează pattern-urile existente din settingsStore, useDarkMode, usePersistentExpandedRows
 */

export type StorageType = 'localStorage' | 'sessionStorage' | 'url';

export interface PersistenceConfig<T> {
  /** Cheia pentru storage */
  key: string;
  /** Tipul de storage (default: localStorage) */
  storageType?: StorageType;
  /** Valoarea default dacă nu există în storage */
  defaultValue: T;
  /** Serializer custom (default: JSON.stringify) */
  serialize?: (value: T) => string;
  /** Deserializer custom (default: JSON.parse) */
  deserialize?: (value: string) => T;
  /** Validare valoare la încărcare */
  validate?: (value: unknown) => value is T;
  /** Debounce pentru salvări (ms, default: 0) */
  debounceMs?: number;
  /** Activează logging pentru debug */
  debug?: boolean;
}

export interface PersistenceHookReturn<T> {
  /** Valoarea persistată */
  value: T;
  /** Setter pentru valoare cu persistență automată */
  setValue: (newValue: T | ((prev: T) => T)) => void;
  /** Șterge valoarea din storage și resetează la default */
  clearValue: () => void;
  /** Reîncarcă valoarea din storage */
  reloadValue: () => void;
  /** Verifică dacă valoarea este încărcată din storage */
  isLoaded: boolean;
  /** Eroare de persistence (dacă există) */
  error: string | null;
}

/**
 * Hook pentru localStorage persistence
 */
export const useLocalStoragePersistence = <T,>(
  config: PersistenceConfig<T>
): PersistenceHookReturn<T> => {
  const {
    key,
    defaultValue,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    validate,
    debounceMs = 0,
    debug = false
  } = config;

  const [value, setValueState] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const log = useCallback((message: string, data?: unknown) => {
    if (debug) {
      console.debug(`[useLocalStoragePersistence:${key}] ${message}`, data);
    }
  }, [debug, key]);

  /**
   * Încarcă valoarea din localStorage
   */
  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) {
        log('No stored value found, using default');
        setValueState(defaultValue);
        setIsLoaded(true);
        return;
      }

      const parsed = deserialize(stored);
      
      if (validate && !validate(parsed)) {
        log('Stored value failed validation, using default', parsed);
        setValueState(defaultValue);
        setError('Valoarea din storage nu a trecut validarea');
      } else {
        log('Loaded value from storage', parsed);
        setValueState(parsed);
        setError(null);
      }
      
      setIsLoaded(true);
    } catch (err) {
      log('Error loading from storage', err);
      setError(`Eroare la încărcarea din localStorage: ${err}`);
      setValueState(defaultValue);
      setIsLoaded(true);
    }
  }, [key, defaultValue, deserialize, validate, log]);

  /**
   * Salvează valoarea în localStorage
   */
  const saveToStorage = useCallback((newValue: T) => {
    try {
      const serialized = serialize(newValue);
      localStorage.setItem(key, serialized);
      log('Saved value to storage', newValue);
      setError(null);
    } catch (err) {
      log('Error saving to storage', err);
      setError(`Eroare la salvarea în localStorage: ${err}`);
    }
  }, [key, serialize, log]);

  /**
   * Salvează cu debounce dacă este configurat
   */
  const debouncedSave = useCallback((newValue: T) => {
    if (debounceMs > 0) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      debounceTimeoutRef.current = setTimeout(() => {
        saveToStorage(newValue);
      }, debounceMs);
    } else {
      saveToStorage(newValue);
    }
  }, [debounceMs, saveToStorage]);

  /**
   * Setter principal cu persistență
   */
  const setValue = useCallback((newValue: T | ((prev: T) => T)) => {
    const finalValue = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(value)
      : newValue;
    
    setValueState(finalValue);
    debouncedSave(finalValue);
  }, [value, debouncedSave]);

  /**
   * Șterge valoarea și resetează la default
   */
  const clearValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setValueState(defaultValue);
      setError(null);
      log('Cleared value from storage');
    } catch (err) {
      log('Error clearing storage', err);
      setError(`Eroare la ștergerea din localStorage: ${err}`);
    }
  }, [key, defaultValue, log]);

  /**
   * Reîncarcă din storage
   */
  const reloadValue = useCallback(() => {
    setIsLoaded(false);
    loadFromStorage();
  }, [loadFromStorage]);

  // Încarcă valoarea la mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Cleanup debounce la unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    value,
    setValue,
    clearValue,
    reloadValue,
    isLoaded,
    error
  };
};

/**
 * Hook pentru URL parameter persistence
 */
export const useURLPersistence = <T extends Record<string, any>>(
  config: Omit<PersistenceConfig<T>, 'storageType'>
): PersistenceHookReturn<T> => {
  const { key, defaultValue, debug = false } = config;
  const [value, setValueState] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const log = useCallback((message: string, data?: unknown) => {
    if (debug) {
      console.debug(`[useURLPersistence:${key}] ${message}`, data);
    }
  }, [debug, key]);

  /**
   * Încarcă din URL parameters
   */
  const loadFromURL = useCallback(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const newValue = { ...defaultValue };
      let hasChanges = false;

      for (const [paramKey, paramValue] of Object.entries(defaultValue)) {
        const urlValue = urlParams.get(paramKey);
        if (urlValue !== null) {
          (newValue as any)[paramKey] = urlValue;
          hasChanges = true;
        }
      }

      if (hasChanges) {
        log('Loaded values from URL', newValue);
        setValueState(newValue);
      } else {
        log('No URL params found, using default');
        setValueState(defaultValue);
      }
      
      setIsLoaded(true);
      setError(null);
    } catch (err) {
      log('Error loading from URL', err);
      setError(`Eroare la încărcarea din URL: ${err}`);
      setValueState(defaultValue);
      setIsLoaded(true);
    }
  }, [defaultValue, log]);

  /**
   * Salvează în URL parameters
   */
  const saveToURL = useCallback((newValue: T) => {
    try {
      const params = new URLSearchParams();
      
      for (const [paramKey, paramValue] of Object.entries(newValue)) {
        if (paramValue !== null && paramValue !== undefined && paramValue !== '') {
          params.set(paramKey, String(paramValue));
        }
      }

      const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState({}, '', newURL);
      
      log('Saved values to URL', newValue);
      setError(null);
    } catch (err) {
      log('Error saving to URL', err);
      setError(`Eroare la salvarea în URL: ${err}`);
    }
  }, [log]);

  const setValue = useCallback((newValue: T | ((prev: T) => T)) => {
    const finalValue = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(value)
      : newValue;
    
    setValueState(finalValue);
    saveToURL(finalValue);
  }, [value, saveToURL]);

  const clearValue = useCallback(() => {
    const clearedURL = window.location.pathname;
    window.history.replaceState({}, '', clearedURL);
    setValueState(defaultValue);
    setError(null);
    log('Cleared URL parameters');
  }, [defaultValue, log]);

  const reloadValue = useCallback(() => {
    setIsLoaded(false);
    loadFromURL();
  }, [loadFromURL]);

  // Încarcă din URL la mount
  useEffect(() => {
    loadFromURL();
  }, [loadFromURL]);

  // Listen pentru popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      log('Popstate event detected, reloading from URL');
      loadFromURL();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [loadFromURL, log]);

  return {
    value,
    setValue,
    clearValue,
    reloadValue,
    isLoaded,
    error
  };
};

/**
 * Hook principal care alege tipul de persistence în funcție de config
 * Evită conditional hooks prin folosirea directă a hook-urilor
 */
export const useStatePersistence = <T,>(
  config: PersistenceConfig<T>
): PersistenceHookReturn<T> => {
  const { storageType = 'localStorage' } = config;

  // Apelăm toate hook-urile necondițional
  const localStorageResult = useLocalStoragePersistence(config);
  const urlResult = useURLPersistence(config as PersistenceConfig<Record<string, any>>);
  
  // Returnăm rezultatul în funcție de tipul de storage
  if (storageType === 'localStorage') {
    return localStorageResult;
  } else if (storageType === 'url') {
    return urlResult as PersistenceHookReturn<T>;
  } else if (storageType === 'sessionStorage') {
    throw new Error('sessionStorage persistence nu este încă implementat');
  } else {
    throw new Error(`Tip de storage nesuportat: ${storageType}`);
  }
};

export default useStatePersistence; 
