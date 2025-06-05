import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Clock, Hash, Zap } from 'lucide-react';
import { cn } from '../../../styles/cva-v2';
import { modal } from '../../../styles/cva-v2';
import { navigationItem } from '../../../styles/cva-v2/compositions/navigation';
import { NAVIGATION, UI } from '@shared-constants';
import { TransactionType } from '@shared-constants';

/**
 * 🎨 COMMAND PALETTE COMPONENT - CVA v2
 * Command palette pentru quick navigation și actions
 */

export interface CommandAction {
  id: string;
  title: string;
  description?: string;
  category: 'navigation' | 'actions' | 'shortcuts' | 'recent';
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  keywords?: string[];
  href?: string;
  action?: () => void | Promise<void>;
  priority?: number;
}

export interface CommandPaletteProps {
  /** Dacă command palette este deschis */
  isOpen: boolean;
  /** Callback pentru închidere */
  onClose: () => void;
  /** Actions custom adiționale */
  customActions?: CommandAction[];
  /** Placeholder text custom */
  placeholder?: string;
  /** Data testid */
  testId?: string;
}

/**
 * Hook pentru command palette state management
 */
export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentActions, setRecentActions] = useState<string[]>([]);
  
  const open = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);
  
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);
  
  const addToRecent = useCallback((actionId: string) => {
    setRecentActions(prev => {
      const filtered = prev.filter(id => id !== actionId);
      return [actionId, ...filtered].slice(0, 5); // Keep last 5
    });
  }, []);
  
  return {
    isOpen,
    query,
    selectedIndex,
    recentActions,
    setQuery,
    setSelectedIndex,
    open,
    close,
    addToRecent
  };
};

/**
 * Default actions pentru command palette
 */
const getDefaultActions = (navigate: (path: string) => void): CommandAction[] => [
  // Navigation actions
  {
    id: 'nav-dashboard',
    title: NAVIGATION.ITEMS.DASHBOARD,
    description: 'Pagina principală cu overview-ul aplicației',
    category: 'navigation',
    icon: Hash,
    shortcut: 'Alt+H',
    keywords: ['dashboard', 'home', 'acasă', 'principal'],
    href: '/',
    action: () => navigate('/'),
    priority: 10
  },
  {
    id: 'nav-transactions',
    title: NAVIGATION.ITEMS.TRANSACTIONS,
    description: 'Vizualizează și gestionează tranzacțiile',
    category: 'navigation',
    icon: ArrowRight,
    shortcut: 'Alt+T',
    keywords: ['transactions', 'tranzacții', 'plăți', TransactionType.INCOME, TransactionType.EXPENSE],
    href: '/transactions',
    action: () => navigate('/transactions'),
    priority: 10
  },
  {
    id: 'nav-lunar-grid',
    title: NAVIGATION.ITEMS.LUNAR_GRID,
    description: 'Grid lunar pentru planificare financiară',
    category: 'navigation',
    icon: Hash,
    shortcut: 'Alt+L',
    keywords: ['lunar', 'grid', 'calendar', 'planning', 'planificare'],
    href: '/lunar-grid',
    action: () => navigate('/lunar-grid'),
    priority: 10
  },
  {
    id: 'nav-options',
    title: NAVIGATION.ITEMS.OPTIONS,
    description: 'Setări și configurarea aplicației',
    category: 'navigation',
    icon: Hash,
    shortcut: 'Alt+O',
    keywords: ['options', 'settings', 'setări', 'opțiuni', 'config'],
    href: '/options',
    action: () => navigate('/options'),
    priority: 8
  },
  
  // Action shortcuts
  {
    id: 'action-toggle-sidebar',
    title: 'Comută sidebar',
    description: 'Deschide sau închide sidebar-ul de navigare',
    category: 'actions',
    icon: Zap,
    shortcut: 'Ctrl+\\',
    keywords: ['sidebar', 'toggle', 'comută', 'meniu'],
    action: () => {
      // Dispatch custom event pentru sidebar toggle
      window.dispatchEvent(new CustomEvent('command-palette-sidebar-toggle'));
    },
    priority: 7
  },
  {
    id: 'action-toggle-dark-mode',
    title: NAVIGATION.THEME.TOGGLE_DARK_MODE,
    description: NAVIGATION.THEME.TOGGLE_DESCRIPTION,
    category: 'actions',
    icon: Zap,
    shortcut: 'Ctrl+D',
    keywords: ['dark', 'light', 'theme', 'tema', 'întunecată', 'deschisă', 'toggle', 'comută'],
    action: () => {
      // Dispatch custom event pentru dark mode toggle
      window.dispatchEvent(new CustomEvent('command-palette-dark-mode-toggle'));
    },
    priority: 8
  },
  {
    id: 'action-new-tab',
    title: 'Tab nou',
    description: 'Deschide un tab nou în aplicație',
    category: 'actions',
    icon: Zap,
    shortcut: 'Ctrl+T',
    keywords: ['tab', 'nou', 'new', 'deschide'],
    action: () => {
      window.dispatchEvent(new CustomEvent('command-palette-new-tab'));
    },
    priority: 6
  },
  
  // Help shortcuts
  {
    id: 'help-shortcuts',
    title: 'Afișează comenzi rapide',
    description: 'Listă cu toate keyboard shortcuts disponibile',
    category: 'shortcuts',
    icon: Hash,
    shortcut: 'F1',
    keywords: ['help', 'shortcuts', 'comenzi', 'ajutor', 'keyboard'],
    action: () => {
      window.dispatchEvent(new CustomEvent('command-palette-show-help'));
    },
    priority: 5
  }
];

/**
 * Component principal CommandPalette
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  customActions = [],
  placeholder = NAVIGATION.COMMAND_PALETTE.PLACEHOLDER,
  testId = 'command-palette'
}) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Combine default actions cu custom actions
  const allActions = useMemo(() => {
    const defaultActions = getDefaultActions(navigate);
    return [...defaultActions, ...customActions].sort((a, b) => 
      (b.priority || 0) - (a.priority || 0)
    );
  }, [navigate, customActions]);
  
  // Filter actions based on query
  const filteredActions = useMemo(() => {
    if (!query.trim()) {
      return allActions.slice(0, 8); // Show top 8 when no query
    }
    
    const lowerQuery = query.toLowerCase();
    return allActions.filter(action => {
      return (
        action.title.toLowerCase().includes(lowerQuery) ||
        action.description?.toLowerCase().includes(lowerQuery) ||
        action.keywords?.some(keyword => keyword.toLowerCase().includes(lowerQuery)) ||
        action.shortcut?.toLowerCase().includes(lowerQuery)
      );
    }).slice(0, 10); // Limit results
  }, [query, allActions]);
  
  // Reset selected index când se schimbă filtered actions
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredActions]);
  
  // Focus pe input când se deschide
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // Clear query când se închide
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);
  
  // Execute action
  const executeAction = useCallback((action: CommandAction) => {
    try {
      if (action.action) {
        action.action();
      } else if (action.href) {
        navigate(action.href);
      }
      onClose();
    } catch (error) {
      console.error('Command palette action error:', error);
    }
  }, [navigate, onClose]);
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredActions.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredActions.length - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          executeAction(filteredActions[selectedIndex]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
        
      default:
        break;
    }
  }, [filteredActions, selectedIndex, executeAction, onClose]);
  
  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);
  
  // Render category icon
  const getCategoryIcon = useCallback((category: CommandAction['category']) => {
    switch (category) {
      case 'navigation':
        return ArrowRight;
      case 'actions':
        return Zap;
      case 'shortcuts':
        return Hash;
      case 'recent':
        return Clock;
      default:
        return Hash;
    }
  }, []);
  
  if (!isOpen) return null;
  
  return createPortal(
    <div 
      className={modal({ variant: 'default' })}
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
      data-testid={testId}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl mx-4 bg-white dark:bg-carbon-900 rounded-lg shadow-2xl border border-carbon-200 dark:border-carbon-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-carbon-200 dark:border-carbon-700">
          <Search className="w-5 h-5 text-carbon-500 dark:text-carbon-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none text-carbon-900 dark:text-carbon-100 placeholder-carbon-500 dark:placeholder-carbon-400"
            data-testid={`${testId}-input`}
          />
          <div className="text-xs text-carbon-500 dark:text-carbon-400 ml-3">
            {NAVIGATION.COMMAND_PALETTE.HELP_TEXT}
          </div>
        </div>
        
        {/* Results */}
        <div 
          ref={listRef}
          className="max-h-96 overflow-y-auto py-2"
          data-testid={`${testId}-results`}
        >
          {filteredActions.length === 0 ? (
            <div className="px-4 py-8 text-center text-carbon-500 dark:text-carbon-400">
              {NAVIGATION.COMMAND_PALETTE.NO_RESULTS}
            </div>
          ) : (
            filteredActions.map((action, index) => {
              const Icon = action.icon || getCategoryIcon(action.category);
              const isSelected = index === selectedIndex;
              
              return (
                <button
                  key={action.id}
                  onClick={() => executeAction(action)}
                  className={cn(
                    navigationItem({ 
                      variant: isSelected ? 'active' : 'default',
                      size: 'md'
                    }),
                    'w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-carbon-50 dark:hover:bg-carbon-800 transition-colors'
                  )}
                  data-testid={`${testId}-item-${action.id}`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-carbon-100 dark:bg-carbon-800">
                    <Icon className="w-4 h-4 text-carbon-600 dark:text-carbon-400" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-carbon-900 dark:text-carbon-100 truncate">
                      {action.title}
                    </div>
                    {action.description && (
                      <div className="text-sm text-carbon-500 dark:text-carbon-400 truncate">
                        {action.description}
                      </div>
                    )}
                  </div>
                  
                  {/* Shortcut */}
                  {action.shortcut && (
                    <div className="flex-shrink-0 text-xs text-carbon-500 dark:text-carbon-400 font-mono bg-carbon-100 dark:bg-carbon-800 px-2 py-1 rounded">
                      {action.shortcut}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CommandPalette; 