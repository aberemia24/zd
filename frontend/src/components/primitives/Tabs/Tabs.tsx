import React, { useState, useCallback, useRef, useEffect, createContext, useContext } from 'react';
import { tab, type TabProps as CVATabProps, cn, hoverBackground } from '../../../styles/cva-v2';
import { NAVIGATION } from '@budget-app/shared-constants';

/**
 * Context pentru Tab system
 */
interface TabContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: CVATabProps['variant'];
  onTabClose?: (id: string) => void;
  onTabAdd?: () => void;
  closeable?: boolean;
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

export const useTabContext = (): TabContextValue => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};

/**
 * Tipuri pentru Tab Components
 */
export interface TabItem {
  /** Identificator unic pentru tab */
  id: string;
  /** Textul afișat pe tab */
  label: string;
  /** Conținutul tab-ului */
  content: React.ReactNode;
  /** Icon opțional */
  icon?: React.ReactNode;
  /** Tab poate fi închis */
  closeable?: boolean;
  /** Tab este disabled */
  disabled?: boolean;
  /** Metadata pentru tab */
  metadata?: Record<string, any>;
}

export interface TabsProps {
  /** Lista de tab-uri */
  tabs: TabItem[];
  /** Tab-ul activ implicit */
  defaultActiveTab?: string;
  /** Tab-ul activ (controlled mode) */
  activeTab?: string;
  /** Callback pentru schimbarea tab-ului activ */
  onTabChange?: (tabId: string) => void;
  /** Callback pentru închiderea unui tab */
  onTabClose?: (tabId: string) => void;
  /** Callback pentru adăugarea unui tab nou */
  onTabAdd?: () => void;
  /** Varianta stilistică din CVA */
  variant?: CVATabProps['variant'];
  /** CSS classes adiționale */
  className?: string;
  /** Data test ID pentru testare */
  testId?: string;
  /** Tab-urile pot fi închise */
  closeable?: boolean;
  /** Afișează butonul de adăugare tab nou */
  showAddButton?: boolean;
  /** Numărul maxim de tab-uri */
  maxTabs?: number;
  /** Callback pentru reordonarea tab-urilor */
  onTabReorder?: (fromIndex: number, toIndex: number) => void;
  /** Persistă starea tab-urilor în localStorage */
  persist?: boolean;
  /** Cheia pentru localStorage */
  persistKey?: string;
}

/**
 * Hook pentru gestionarea stării tab-urilor
 */
export const useTabs = (props: TabsProps) => {
  const {
    tabs,
    defaultActiveTab,
    activeTab: controlledActiveTab,
    onTabChange,
    persist = false,
    persistKey = 'app-tabs-state'
  } = props;

  // Determină tab-ul activ inițial
  const getInitialActiveTab = useCallback(() => {
    if (controlledActiveTab) return controlledActiveTab;
    if (persist && persistKey) {
      const saved = localStorage.getItem(persistKey);
      if (saved) {
        try {
          const { activeTab } = JSON.parse(saved);
          if (tabs.find(tab => tab.id === activeTab)) {
            return activeTab;
          }
        } catch {
          // Ignore invalid JSON
        }
      }
    }
    return defaultActiveTab || tabs[0]?.id || '';
  }, [controlledActiveTab, defaultActiveTab, tabs, persist, persistKey]);

  const [internalActiveTab, setInternalActiveTab] = useState(getInitialActiveTab);

  // Actualizează tab-ul activ
  const setActiveTab = useCallback((tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
      
      // Persistă în localStorage
      if (persist && persistKey) {
        try {
          localStorage.setItem(persistKey, JSON.stringify({ activeTab: tabId }));
        } catch {
          // Ignore localStorage errors
        }
      }
    }
    onTabChange?.(tabId);
  }, [controlledActiveTab, onTabChange, persist, persistKey]);

  const activeTab = controlledActiveTab ?? internalActiveTab;

  return { activeTab, setActiveTab };
};

/**
 * Componenta Tab individuală
 */
export interface TabButtonProps {
  tab: TabItem;
  isActive: boolean;
  variant?: CVATabProps['variant'];
  onClose?: (id: string) => void;
  closeable?: boolean;
  testId?: string;
}

export const TabButton: React.FC<TabButtonProps> = ({
  tab: tabItem,
  isActive,
  variant = 'underline',
  onClose,
  closeable = false,
  testId
}) => {
  const { id, label, icon, disabled, closeable: tabCloseable } = tabItem;
  const isCloseable = closeable && (tabCloseable ?? true);
  const { setActiveTab } = useTabContext();

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose?.(id);
  }, [id, onClose]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      setActiveTab(id);
    }
  }, [disabled, setActiveTab, id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) {
        setActiveTab(id);
      }
    }
  }, [id, disabled, setActiveTab]);

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${id}`}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      className={cn(
        tab({ variant, active: isActive }),
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        'relative inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-testid={testId ? `${testId}-tab-${id}` : `tab-${id}`}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span className="truncate max-w-32">{label}</span>
      
      {isCloseable && (
        <button
          type="button"
                          className={cn("ml-2 p-1 rounded-full", hoverBackground({ variant: "light" }))}
          onClick={handleClose}
          aria-label={NAVIGATION.TABS.CLOSE_TAB}
          data-testid={testId ? `${testId}-close-${id}` : `close-tab-${id}`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </button>
  );
};

/**
 * Componenta TabList - lista de tab-uri
 */
export interface TabListProps {
  tabs: TabItem[];
  variant?: CVATabProps['variant'];
  onTabAdd?: () => void;
  showAddButton?: boolean;
  maxTabs?: number;
  testId?: string;
  className?: string;
}

export const TabList: React.FC<TabListProps> = ({
  tabs,
  variant = 'underline',
  onTabAdd,
  showAddButton = false,
  maxTabs,
  testId,
  className
}) => {
  const { activeTab, onTabClose, closeable } = useTabContext();

  const canAddTab = !maxTabs || tabs.length < maxTabs;

  return (
    <div
      role="tablist"
      aria-label={NAVIGATION.ARIA.TAB_LIST}
      className={cn(
        'flex items-center overflow-x-auto scrollbar-hide',
        variant === 'card' && 'border-b border-gray-200',
        className
      )}
      data-testid={testId ? `${testId}-tablist` : 'tablist'}
    >
      {tabs.map((tabItem) => (
        <TabButton
          key={tabItem.id}
          tab={tabItem}
          isActive={activeTab === tabItem.id}
          variant={variant}
          onClose={onTabClose}
          closeable={closeable}
          testId={testId}
        />
      ))}
      
      {showAddButton && canAddTab && (
        <button
          type="button"
          className={cn(
            tab({ variant, active: false }),
            'ml-2 border border-dashed border-gray-300 text-gray-500',
            'hover:border-gray-400 hover:text-gray-700 transition-colors'
          )}
          onClick={onTabAdd}
          aria-label={NAVIGATION.TABS.NEW_TAB}
          data-testid={testId ? `${testId}-add-tab` : 'add-tab'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * Componenta TabPanel - conținutul tab-ului
 */
export interface TabPanelProps {
  tab: TabItem;
  isActive: boolean;
  testId?: string;
  className?: string;
  children?: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  tab,
  isActive,
  testId,
  className,
  children
}) => {
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${tab.id}`}
      aria-labelledby={`tab-${tab.id}`}
      aria-label={NAVIGATION.ARIA.TAB_PANEL}
      hidden={!isActive}
      tabIndex={0}
      className={cn(
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        isActive ? 'block' : 'hidden',
        className
      )}
      data-testid={testId ? `${testId}-panel-${tab.id}` : `panel-${tab.id}`}
    >
      {children || tab.content}
    </div>
  );
};

/**
 * Componenta principală Tabs
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  activeTab: controlledActiveTab,
  onTabChange,
  onTabClose,
  onTabAdd,
  variant = 'underline',
  className,
  testId,
  closeable = false,
  showAddButton = false,
  maxTabs,
  persist = false,
  persistKey = 'app-tabs-state'
}) => {
  const { activeTab, setActiveTab } = useTabs({
    tabs,
    defaultActiveTab,
    activeTab: controlledActiveTab,
    onTabChange,
    persist,
    persistKey
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      let newIndex = currentIndex;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          break;
        case 'ArrowRight':
          e.preventDefault();
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      if (newIndex !== currentIndex && tabs[newIndex] && !tabs[newIndex].disabled) {
        setActiveTab(tabs[newIndex].id);
        // Focus pe noul tab
        const tabButton = containerRef.current?.querySelector(`[data-testid="${testId ? testId + '-' : ''}tab-${tabs[newIndex].id}"]`) as HTMLElement;
        tabButton?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [tabs, activeTab, setActiveTab, testId]);

  const contextValue: TabContextValue = {
    activeTab,
    setActiveTab,
    variant,
    onTabClose,
    onTabAdd,
    closeable
  };

  return (
    <TabContext.Provider value={contextValue}>
      <div 
        ref={containerRef}
        className={cn('w-full', className)}
        data-testid={testId || 'tabs'}
      >
        <TabList
          tabs={tabs}
          variant={variant}
          onTabAdd={onTabAdd}
          showAddButton={showAddButton}
          maxTabs={maxTabs}
          testId={testId}
        />
        
        <div className="mt-4">
          {tabs.map((tabItem) => (
            <TabPanel
              key={tabItem.id}
              tab={tabItem}
              isActive={activeTab === tabItem.id}
              testId={testId}
            />
          ))}
        </div>
      </div>
    </TabContext.Provider>
  );
};

/**
 * Hook pentru integrarea cu global keyboard shortcuts
 */
export const useTabsKeyboardIntegration = (
  tabs: TabItem[],
  activeTab: string,
  setActiveTab: (id: string) => void,
  onTabClose?: (id: string) => void,
  onTabAdd?: () => void
) => {
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      // Ctrl+T - New Tab
      if (e.ctrlKey && e.key === 't' && !e.shiftKey) {
        e.preventDefault();
        onTabAdd?.();
        return;
      }

      // Ctrl+W - Close Tab
      if (e.ctrlKey && e.key === 'w' && !e.shiftKey) {
        e.preventDefault();
        onTabClose?.(activeTab);
        return;
      }

      // Ctrl+Tab - Next Tab
      if (e.ctrlKey && e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        if (tabs[nextIndex]) {
          setActiveTab(tabs[nextIndex].id);
        }
        return;
      }

      // Ctrl+Shift+Tab - Previous Tab
      if (e.ctrlKey && e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        if (tabs[prevIndex]) {
          setActiveTab(tabs[prevIndex].id);
        }
        return;
      }
    };

    document.addEventListener('keydown', handleGlobalShortcuts);
    return () => document.removeEventListener('keydown', handleGlobalShortcuts);
  }, [tabs, activeTab, setActiveTab, onTabClose, onTabAdd]);
};

export default Tabs; 
