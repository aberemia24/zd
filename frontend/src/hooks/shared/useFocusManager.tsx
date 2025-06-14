import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 🎯 SIMPLE FOCUS MANAGER
 *
 * Gestionează focus-ul în aplicație cu debugging și logging.
 * Simplu, pragmatic, fără over-engineering.
 *
 * BASED ON EXISTING PATTERNS:
 * - Integrare cu useKeyboardHandler
 * - Pattern-uri din LunarGrid focus management
 */

export interface FocusManagerConfig {
  /** Enable/disable focus management */
  enabled?: boolean;

  /** Debug logging */
  debug?: boolean;

  /** Context pentru logging */
  context?: string;

  /** Auto-restore focus când componenta se re-focus-ează */
  autoRestore?: boolean;
}

export interface FocusState {
  /** Elementul cu focus curent */
  current: Element | null;

  /** Elementul cu focus anterior */
  previous: Element | null;

  /** Timestamp ultima schimbare */
  lastChange: number;

  /** Flag dacă focus-ul este programatic */
  isProgrammatic: boolean;
}

/**
 * 🎯 useFocusManager - Simple Focus Management cu Debug
 */
export const useFocusManager = (config: FocusManagerConfig = {}) => {
  const {
    enabled = true,
    debug = process.env.NODE_ENV === 'development',
    context = 'useFocusManager',
    autoRestore = false
  } = config;

  const [focusState, setFocusState] = useState<FocusState>({
    current: null,
    previous: null,
    lastChange: Date.now(),
    isProgrammatic: false
  });

  const lastActiveRef = useRef<Element | null>(null);
  const programmaticRef = useRef(false);

  /**
   * 📝 Debug logging
   */
  const logFocusChange = useCallback((
    type: 'focus' | 'blur' | 'programmatic' | 'restore',
    element: Element | null,
    details?: any
  ) => {
    if (!debug) return;

    console.debug(`[${context}] Focus ${type}:`, {
      element: element?.tagName || 'null',
      id: element?.id || 'no-id',
      className: (element as HTMLElement)?.className || 'no-class',
      timestamp: Date.now(),
      ...details
    });
  }, [debug, context]);

  /**
   * 🎯 Focus pe un element cu logging
   */
  const focusElement = useCallback((element: Element | null, force: boolean = false) => {
    if (!enabled) return false;
    if (!element) return false;

    // Skip dacă elementul e deja focused și nu forțăm
    if (!force && document.activeElement === element) {
      logFocusChange('programmatic', element, { skipped: 'already-focused' });
      return true;
    }

    try {
      programmaticRef.current = true;
      (element as HTMLElement).focus();

      logFocusChange('programmatic', element, { forced: force });
      return true;
    } catch (error) {
      if (debug) {
        console.warn(`[${context}] Focus failed:`, error);
      }
      return false;
    } finally {
      // Reset flag after a microtask pentru a permite event listener-ului să-l detecteze
      setTimeout(() => {
        programmaticRef.current = false;
      }, 0);
    }
  }, [enabled, debug, context, logFocusChange]);

  /**
   * 🔄 Restore focus la elementul anterior
   */
  const restoreFocus = useCallback(() => {
    if (!enabled) return false;

    const elementToRestore = lastActiveRef.current || focusState.previous;
    if (elementToRestore && document.contains(elementToRestore)) {
      logFocusChange('restore', elementToRestore);
      return focusElement(elementToRestore, true);
    }

    logFocusChange('restore', null, { failed: 'no-valid-element' });
    return false;
  }, [enabled, focusState.previous, focusElement, logFocusChange]);

  /**
   * 💾 Salvează focus-ul curent pentru restore ulterior
   */
  const saveFocus = useCallback(() => {
    if (!enabled) return;

    const current = document.activeElement;
    if (current && current !== document.body) {
      lastActiveRef.current = current;
      logFocusChange('focus', current, { saved: true });
    }
  }, [enabled, logFocusChange]);

  /**
   * 🔍 Găsește primul element focusabil în container
   */
  const findFirstFocusable = useCallback((container: Element): Element | null => {
    const focusableSelectors = [
      'input:not([disabled])',
      'button:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    const focusableElements = container.querySelectorAll(focusableSelectors);
    return focusableElements[0] || null;
  }, []);

  /**
   * 👂 Focus/blur event listeners
   */
  useEffect(() => {
    if (!enabled) return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as Element;
      const isProgrammatic = programmaticRef.current;

      setFocusState(prev => ({
        current: target,
        previous: prev.current,
        lastChange: Date.now(),
        isProgrammatic
      }));

             logFocusChange('focus', target, {
         isProgrammatic,
         previousWas: (prev: any) => prev.current?.tagName
       });
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as Element;
      logFocusChange('blur', target);
    };

    if (debug) {
      console.debug(`[${context}] Setting up focus listeners`);
    }

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      if (debug) {
        console.debug(`[${context}] Cleaning up focus listeners`);
      }
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [enabled, debug, context, logFocusChange]);

  /**
   * 🔄 Auto-restore pe mount dacă enabled
   */
  useEffect(() => {
    if (enabled && autoRestore && lastActiveRef.current) {
      restoreFocus();
    }
  }, [enabled, autoRestore, restoreFocus]);

  /**
   * 🛠️ Utility functions
   */
  const utilities = {
    /**
     * Focus primul element dintr-un container
     */
    focusFirst: (container: Element) => {
      const first = findFirstFocusable(container);
      return first ? focusElement(first) : false;
    },

    /**
     * Verifică dacă elementul e focusabil
     */
    isFocusable: (element: Element): boolean => {
      const focusable = findFirstFocusable(element.parentElement || document.body);
      return focusable === element;
    },

    /**
     * Trap focus într-un container (pentru modal-uri)
     */
    trapFocus: (container: Element) => {
      // Implementare simplă pentru trap focus
      const focusableElements = container.querySelectorAll(
        'input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const first = focusableElements[0] as HTMLElement;
      const last = focusableElements[focusableElements.length - 1] as HTMLElement;

             const handleKeyDown = (e: Event) => {
         const keyEvent = e as KeyboardEvent;
         if (keyEvent.key === 'Tab') {
           if (keyEvent.shiftKey && document.activeElement === first) {
             keyEvent.preventDefault();
             last.focus();
           } else if (!keyEvent.shiftKey && document.activeElement === last) {
             keyEvent.preventDefault();
             first.focus();
           }
         }
       };

       container.addEventListener('keydown', handleKeyDown);
       first.focus();

       return () => {
         container.removeEventListener('keydown', handleKeyDown);
       };
    }
  };

  return {
    // State
    focusState,
    enabled,

    // Actions
    focusElement,
    restoreFocus,
    saveFocus,

    // Utilities
    utilities,

    // Computed
    hasFocus: focusState.current !== null,
    isActive: focusState.current === document.activeElement
  };
};

export default useFocusManager;
