import { useCallback, useEffect, useRef } from 'react';

/**
 * 🎹 CENTRALIZED KEYBOARD HANDLER
 *
 * Consolidează pattern-urile de keyboard handling din întreaga aplicație.
 * Simplu, pragmatic, fără over-engineering.
 *
 * 🔧 BASED ON EXISTING PATTERNS:
 * - useGlobalKeyboardShortcuts.shouldIgnoreShortcut
 * - useInlineCellEdit.handleKeyDown
 * - EditableCell.handleKeyDownWrapper
 * - useKeyboardNavigationSimplified
 */

export interface KeyboardHandlerConfig {
  /** Enable/disable handler-ul */
  enabled?: boolean;

  /** Previne handling când user editează în input */
  respectEditing?: boolean;

  /** Debug logging pentru development */
  debug?: boolean;

  /** Context pentru logging */
  context?: string;
}

export interface KeyboardHandlers {
  // Navigation essentials
  onArrowUp?: (e: KeyboardEvent) => void;
  onArrowDown?: (e: KeyboardEvent) => void;
  onArrowLeft?: (e: KeyboardEvent) => void;
  onArrowRight?: (e: KeyboardEvent) => void;

  // Edit essentials
  onEnter?: (e: KeyboardEvent) => void;
  onEscape?: (e: KeyboardEvent) => void;
  onTab?: (e: KeyboardEvent) => void;
  onF2?: (e: KeyboardEvent) => void;
  onDelete?: (e: KeyboardEvent) => void;
  onBackspace?: (e: KeyboardEvent) => void;

  // Modifier combinations (common ones only)
  onCtrlEnter?: (e: KeyboardEvent) => void;
  onShiftEnter?: (e: KeyboardEvent) => void;

  // Alpha-numeric detection pentru Excel-like
  onAlphaNumeric?: (e: KeyboardEvent, char: string) => void;

  // Catch-all
  onOtherKey?: (e: KeyboardEvent) => void;
}

/**
 * 🎹 useKeyboardHandler - Simple Centralized Keyboard Management
 *
 * Consolidează pattern-urile existente fără complicații.
 */
export const useKeyboardHandler = (
  handlers: KeyboardHandlers,
  config: KeyboardHandlerConfig = {}
) => {
  const {
    enabled = true,
    respectEditing = true,
    debug = process.env.NODE_ENV === 'development',
    context = 'useKeyboardHandler'
  } = config;

  const handlersRef = useRef(handlers);

  // Update refs when props change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  /**
   * 🚫 EXACT PATTERN din useGlobalKeyboardShortcuts.shouldIgnoreShortcut
   */
  const shouldIgnoreEvent = useCallback((target: EventTarget | null): boolean => {
    if (!respectEditing) return false;
    if (!target || !(target instanceof Element)) return false;

    const tagName = target.tagName.toLowerCase();
    const isEditable = target.getAttribute('contenteditable') === 'true';
    const isInput = ['input', 'textarea', 'select'].includes(tagName);

    return isInput || isEditable;
  }, [respectEditing]);

  /**
   * 🎯 Main handler - consolidează logica existentă
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    // Skip dacă user editează (PATTERN existent)
    if (shouldIgnoreEvent(e.target)) return;

    const currentHandlers = handlersRef.current;

    // Debug logging
    if (debug) {
      console.debug(`[${context}] Key:`, {
        key: e.key,
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey
      });
    }

    // Handle modifier combinations first
    if (e.ctrlKey && e.key === 'Enter' && currentHandlers.onCtrlEnter) {
      currentHandlers.onCtrlEnter(e);
      return;
    }

    if (e.shiftKey && e.key === 'Enter' && currentHandlers.onShiftEnter) {
      currentHandlers.onShiftEnter(e);
      return;
    }

    // Handle individual keys (PATTERN din useKeyboardNavigationSimplified)
    switch (e.key) {
      case 'ArrowUp':
        currentHandlers.onArrowUp?.(e);
        break;
      case 'ArrowDown':
        currentHandlers.onArrowDown?.(e);
        break;
      case 'ArrowLeft':
        currentHandlers.onArrowLeft?.(e);
        break;
      case 'ArrowRight':
        currentHandlers.onArrowRight?.(e);
        break;
      case 'Enter':
        currentHandlers.onEnter?.(e);
        break;
      case 'Escape':
        currentHandlers.onEscape?.(e);
        break;
      case 'Tab':
        currentHandlers.onTab?.(e);
        break;
      case 'F2':
        currentHandlers.onF2?.(e);
        break;
      case 'Delete':
        currentHandlers.onDelete?.(e);
        break;
      case 'Backspace':
        currentHandlers.onBackspace?.(e);
        break;
      default:
        // Alpha-numeric detection (PATTERN din EditableCell)
        if (/^[a-zA-Z0-9]$/.test(e.key) && currentHandlers.onAlphaNumeric) {
          currentHandlers.onAlphaNumeric(e, e.key);
        } else if (currentHandlers.onOtherKey) {
          currentHandlers.onOtherKey(e);
        }
        break;
    }
  }, [enabled, shouldIgnoreEvent, debug, context]);

  /**
   * 🔌 Event listener setup (PATTERN existent)
   */
  useEffect(() => {
    if (!enabled) return;

    if (debug) {
      console.debug(`[${context}] Setting up keyboard listeners`);
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (debug) {
        console.debug(`[${context}] Cleaning up keyboard listeners`);
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown, debug, context]);

  /**
   * 🛠️ Utility helpers pentru common patterns
   */
  const utilities = {
    /**
     * Excel-like cell editing (CONSOLIDEAZĂ EditableCell logic)
     */
    createCellEditingHandlers: (
      startEdit: () => void,
      deleteContent: () => void,
      isReadonly: boolean = false
    ) => ({
      onF2: (e: KeyboardEvent) => {
        if (!isReadonly) {
          e.preventDefault();
          startEdit();
        }
      },
      onEnter: (e: KeyboardEvent) => {
        if (!isReadonly) {
          e.preventDefault();
          startEdit();
        }
      },
      onDelete: (e: KeyboardEvent) => {
        if (!isReadonly) {
          e.preventDefault();
          e.stopPropagation();
          deleteContent();
        }
      },
      onAlphaNumeric: (e: KeyboardEvent) => {
        if (!isReadonly) {
          e.preventDefault();
          startEdit();
        }
      }
    }),

    /**
     * Grid navigation (CONSOLIDEAZĂ useKeyboardNavigationSimplified)
     */
    createNavigationHandlers: (
      moveUp: () => void,
      moveDown: () => void,
      moveLeft: () => void,
      moveRight: () => void,
      select: () => void
    ) => ({
      onArrowUp: (e: KeyboardEvent) => {
        e.preventDefault();
        moveUp();
      },
      onArrowDown: (e: KeyboardEvent) => {
        e.preventDefault();
        moveDown();
      },
      onArrowLeft: (e: KeyboardEvent) => {
        e.preventDefault();
        moveLeft();
      },
      onArrowRight: (e: KeyboardEvent) => {
        e.preventDefault();
        moveRight();
      },
      onEnter: (e: KeyboardEvent) => {
        e.preventDefault();
        select();
      }
    })
  };

  return {
    handleKeyDown,
    utilities,
    enabled,
    context
  };
};

export default useKeyboardHandler;
