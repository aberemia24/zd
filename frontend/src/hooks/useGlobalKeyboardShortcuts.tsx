import { useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAVIGATION } from '@shared-constants';

/**
 * Global keyboard shortcuts pentru Budget App
 * Consolidează funcționalitatea existentă din LunarGrid și adaugă shortcuts globale
 */

export interface GlobalShortcutConfig {
  /** Activează shortcuts globale (default: true) */
  enabled?: boolean;
  /** Activează shortcuts pentru sidebar (default: true) */
  enableSidebar?: boolean;
  /** Activează shortcuts pentru navigare (default: true) */
  enableNavigation?: boolean;
  /** Activează shortcuts pentru modal (default: true) */
  enableModal?: boolean;
  /** Callback pentru toggle sidebar */
  onToggleSidebar?: () => void;
  /** Callback pentru deschidere context menu */
  onOpenContextMenu?: (position: { x: number; y: number }) => void;
  /** Callback pentru search global */
  onGlobalSearch?: () => void;
  /** Callback pentru toggle dark mode */
  onToggleDarkMode?: () => void;
}

export interface ShortcutInfo {
  key: string;
  description: string;
  combination: string;
}

/**
 * Maparea completă a shortcut-urilor disponibile
 */
export const GLOBAL_SHORTCUTS: Record<string, ShortcutInfo> = {
  // Navigation shortcuts
  HOME: {
    key: 'Alt+H',
    description: 'Navighează la pagina principală',
    combination: 'Alt + H'
  },
  TRANSACTIONS: {
    key: 'Alt+T',
    description: 'Navighează la tranzacții',
    combination: 'Alt + T'
  },
  LUNAR_GRID: {
    key: 'Alt+L',
    description: 'Navighează la Grid Lunar',
    combination: 'Alt + L'
  },
  OPTIONS: {
    key: 'Alt+O',
    description: 'Navighează la opțiuni',
    combination: 'Alt + O'
  },
  
  // UI shortcuts
  TOGGLE_SIDEBAR: {
    key: 'Ctrl+\\',
    description: 'Comută sidebar-ul',
    combination: 'Ctrl + \\'
  },
  GLOBAL_SEARCH: {
    key: 'Ctrl+K',
    description: 'Căutare globală',
    combination: 'Ctrl + K'
  },
  TOGGLE_DARK_MODE: {
    key: 'Ctrl+D',
    description: 'Comută tema întunecată/deschisă',
    combination: 'Ctrl + D'
  },
  CONTEXT_MENU: {
    key: 'Shift+F10',
    description: 'Deschide meniul contextual',
    combination: 'Shift + F10'
  },
  
  // Modal/Tab shortcuts  
  NEW_TAB: {
    key: 'Ctrl+T',
    description: 'Tab nou',
    combination: 'Ctrl + T'
  },
  CLOSE_TAB: {
    key: 'Ctrl+W',
    description: 'Închide tab',
    combination: 'Ctrl + W'
  },
  NEXT_TAB: {
    key: 'Ctrl+Tab',
    description: 'Tab următor',
    combination: 'Ctrl + Tab'
  },
  PREV_TAB: {
    key: 'Ctrl+Shift+Tab',
    description: 'Tab anterior',
    combination: 'Ctrl + Shift + Tab'
  },
  
  // Accessibility shortcuts
  HELP: {
    key: 'F1',
    description: 'Ajutor și shortcuts',
    combination: 'F1'
  },
  ESCAPE: {
    key: 'Escape',
    description: 'Închide modal/anulează acțiune',
    combination: 'Escape'
  }
};

/**
 * Hook pentru gestionarea keyboard shortcuts globale
 * Extinde funcționalitatea din LunarGrid pentru utilizare la nivel de aplicație
 */
export const useGlobalKeyboardShortcuts = (config: GlobalShortcutConfig = {}) => {
  const {
    enabled = true,
    enableSidebar = true,
    enableNavigation = true,
    enableModal = true,
    onToggleSidebar,
    onOpenContextMenu,
    onGlobalSearch,
    onToggleDarkMode
  } = config;

  const navigate = useNavigate();
  const location = useLocation();
  const activeElementRef = useRef<Element | null>(null);

  /**
   * Verifică dacă un shortcut nu trebuie să fie activat
   * (de ex., când utilizatorul editează într-un input)
   */
  const shouldIgnoreShortcut = useCallback((target: EventTarget | null): boolean => {
    if (!target || !(target instanceof Element)) return false;
    
    const tagName = target.tagName.toLowerCase();
    const isEditable = target.getAttribute('contenteditable') === 'true';
    const isInput = ['input', 'textarea', 'select'].includes(tagName);
    
    return isInput || isEditable;
  }, []);

  /**
   * Handler pentru navigation shortcuts
   */
  const handleNavigationShortcut = useCallback((key: string, altKey: boolean) => {
    if (!enableNavigation || !altKey) return false;

    switch (key) {
      case 'h':
      case 'H':
        navigate('/');
        return true;
      case 't':
      case 'T':
        navigate('/transactions');
        return true;
      case 'l':
      case 'L':
        navigate('/lunar-grid');
        return true;
      case 'o':
      case 'O':
        navigate('/options');
        return true;
      default:
        return false;
    }
  }, [enableNavigation, navigate]);

  /**
   * Handler pentru UI shortcuts
   */
  const handleUIShortcut = useCallback((e: KeyboardEvent) => {
    // Toggle Sidebar - Ctrl+\
    if (e.ctrlKey && e.key === '\\' && enableSidebar) {
      e.preventDefault();
      onToggleSidebar?.();
      return true;
    }

    // Global Search - Ctrl+K
    if (e.ctrlKey && e.key === 'k' && enableSidebar) {
      e.preventDefault();
      onGlobalSearch?.();
      return true;
    }

    // Toggle Dark Mode - Ctrl+D
    if (e.ctrlKey && e.key === 'd' && enableSidebar) {
      e.preventDefault();
      onToggleDarkMode?.();
      return true;
    }

    // Context Menu - Shift+F10
    if (e.shiftKey && e.key === 'F10') {
      e.preventDefault();
      const rect = (e.target as Element)?.getBoundingClientRect();
      if (rect) {
        onOpenContextMenu?.({ 
          x: rect.left + rect.width / 2, 
          y: rect.top + rect.height / 2 
        });
      }
      return true;
    }

    return false;
  }, [enableSidebar, onToggleSidebar, onGlobalSearch, onToggleDarkMode, onOpenContextMenu]);

  /**
   * Handler pentru modal/tab shortcuts
   */
  const handleModalShortcut = useCallback((e: KeyboardEvent) => {
    if (!enableModal) return false;

    // Escape - închide modals/anulează acțiuni
    if (e.key === 'Escape') {
      // Lăsăm alte componente să handling-eze Escape
      // Doar loggăm pentru tracking
      console.debug('Global Escape pressed');
      return false; // Nu prevenim default
    }

    // F1 - Help
    if (e.key === 'F1') {
      e.preventDefault();
      // TODO: Implementă help modal cu toate shortcuts-urile
      console.log('Help shortcuts:', GLOBAL_SHORTCUTS);
      return true;
    }

    return false;
  }, [enableModal]);

  /**
   * Main keyboard event handler
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    // Ignoră shortcuts în timpul editării
    if (shouldIgnoreShortcut(e.target)) return;

    // Salvează elementul activ pentru restaurare
    activeElementRef.current = document.activeElement;

    // Încearcă toate tipurile de shortcuts în ordine
    const handled = 
      handleUIShortcut(e) ||
      handleNavigationShortcut(e.key, e.altKey) ||
      handleModalShortcut(e);

    // Log pentru debugging în development
    if (process.env.NODE_ENV === 'development' && handled) {
      console.debug('Global shortcut handled:', {
        key: e.key,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        location: location.pathname
      });
    }
  }, [
    enabled,
    shouldIgnoreShortcut,
    handleUIShortcut,
    handleNavigationShortcut,
    handleModalShortcut,
    location.pathname
  ]);

  /**
   * Attach/detach event listeners
   */
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  /**
   * Utility pentru a obține toate shortcuts-urile disponibile
   */
  const getAvailableShortcuts = useCallback(() => {
    const shortcuts: ShortcutInfo[] = [];
    
    if (enableNavigation) {
      shortcuts.push(
        GLOBAL_SHORTCUTS.HOME,
        GLOBAL_SHORTCUTS.TRANSACTIONS,
        GLOBAL_SHORTCUTS.LUNAR_GRID,
        GLOBAL_SHORTCUTS.OPTIONS
      );
    }
    
    if (enableSidebar) {
      shortcuts.push(
        GLOBAL_SHORTCUTS.TOGGLE_SIDEBAR,
        GLOBAL_SHORTCUTS.GLOBAL_SEARCH,
        GLOBAL_SHORTCUTS.TOGGLE_DARK_MODE
      );
    }
    
    if (enableModal) {
      shortcuts.push(
        GLOBAL_SHORTCUTS.CONTEXT_MENU,
        GLOBAL_SHORTCUTS.HELP,
        GLOBAL_SHORTCUTS.ESCAPE
      );
    }
    
    return shortcuts;
  }, [enableNavigation, enableSidebar, enableModal]);

  /**
   * Utility pentru a verifica dacă un shortcut este activ
   */
  const isShortcutActive = useCallback((shortcutKey: string): boolean => {
    return enabled && GLOBAL_SHORTCUTS[shortcutKey] !== undefined;
  }, [enabled]);

  return {
    // State
    enabled,
    shortcuts: getAvailableShortcuts(),
    
    // Utilities
    isShortcutActive,
    getAvailableShortcuts,
    
    // Constants
    GLOBAL_SHORTCUTS
  };
};

export default useGlobalKeyboardShortcuts; 