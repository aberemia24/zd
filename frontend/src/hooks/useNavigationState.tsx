import { useState, useEffect, useCallback, useRef } from 'react';
import { useStatePersistence } from './useStatePersistence';
import { NAVIGATION } from '@budget-app/shared-constants';

/**
 * 🧭 Navigation State Management & Persistence
 * Hook centralizat pentru gestionarea stării de navigare a aplicației
 */

export interface BreadcrumbItem {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}

export interface TabState {
  id: string;
  title: string;
  href: string;
  isActive?: boolean;
  closeable?: boolean;
}

export interface NavigationState {
  // Sidebar state
  sidebarExpanded: boolean;
  sidebarVariant: 'desktop' | 'mobile';
  
  // Active navigation context
  currentPage: string;
  lastVisitedPages: string[];
  
  // Breadcrumb state
  breadcrumbHistory: BreadcrumbItem[];
  breadcrumbMaxItems: number;
  
  // Tabs state
  openTabs: TabState[];
  activeTabId: string | null;
  
  // User preferences
  persistenceEnabled: boolean;
  autoHideSidebar: boolean;
  maxOpenTabs: number;
}

export interface NavigationActions {
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  setSidebarVariant: (variant: 'desktop' | 'mobile') => void;
  
  // Page navigation actions
  navigateToPage: (page: string, label?: string) => void;
  
  // Breadcrumb actions
  addBreadcrumb: (item: BreadcrumbItem) => void;
  clearBreadcrumbs: () => void;
  navigateToBreadcrumb: (id: string) => void;
  
  // Tabs actions
  openTab: (tab: Omit<TabState, 'isActive'>) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (keepTabId: string) => void;
  
  // Preferences actions
  togglePersistence: () => void;
  setMaxOpenTabs: (count: number) => void;
  
  // State management
  clearAllState: () => void;
  restoreDefaultState: () => void;
  syncComponents: () => void;
}

const DEFAULT_NAVIGATION_STATE: NavigationState = {
  sidebarExpanded: true,
  sidebarVariant: 'desktop',
  currentPage: '/',
  lastVisitedPages: [],
  breadcrumbHistory: [],
  breadcrumbMaxItems: 5,
  openTabs: [],
  activeTabId: null,
  persistenceEnabled: true,
  autoHideSidebar: false,
  maxOpenTabs: 8,
};

/**
 * Hook principal pentru navigation state cu persistence
 */
export const useNavigationState = () => {
  // State persistence pentru fiecare component
  const sidebarState = useStatePersistence({
    key: NAVIGATION.STORAGE.SIDEBAR_EXPANDED,
    defaultValue: DEFAULT_NAVIGATION_STATE.sidebarExpanded,
    debug: false,
  });

  const breadcrumbState = useStatePersistence<BreadcrumbItem[]>({
    key: NAVIGATION.STORAGE.BREADCRUMB_HISTORY,
    defaultValue: DEFAULT_NAVIGATION_STATE.breadcrumbHistory,
    debounceMs: 300,
    debug: false,
  });

  const globalNavState = useStatePersistence<Omit<NavigationState, 'sidebarExpanded' | 'breadcrumbHistory'>>({
    key: NAVIGATION.STORAGE.NAVIGATION_STATE,
    defaultValue: {
      sidebarVariant: DEFAULT_NAVIGATION_STATE.sidebarVariant,
      currentPage: DEFAULT_NAVIGATION_STATE.currentPage,
      lastVisitedPages: DEFAULT_NAVIGATION_STATE.lastVisitedPages,
      breadcrumbMaxItems: DEFAULT_NAVIGATION_STATE.breadcrumbMaxItems,
      openTabs: DEFAULT_NAVIGATION_STATE.openTabs,
      activeTabId: DEFAULT_NAVIGATION_STATE.activeTabId,
      persistenceEnabled: DEFAULT_NAVIGATION_STATE.persistenceEnabled,
      autoHideSidebar: DEFAULT_NAVIGATION_STATE.autoHideSidebar,
      maxOpenTabs: DEFAULT_NAVIGATION_STATE.maxOpenTabs,
    },
    debounceMs: 500,
    debug: false,
  });

  const lastSyncRef = useRef<number>(0);
  const [syncInProgress, setSyncInProgress] = useState(false);

  // Combine state-ul din toate sursele
  const navigationState: NavigationState = {
    sidebarExpanded: sidebarState.value,
    breadcrumbHistory: breadcrumbState.value,
    ...globalNavState.value,
  };

  // Sidebar actions
  const toggleSidebar = useCallback(() => {
    sidebarState.setValue(!sidebarState.value);
  }, [sidebarState]);

  const setSidebarExpanded = useCallback((expanded: boolean) => {
    sidebarState.setValue(expanded);
  }, [sidebarState]);

  const setSidebarVariant = useCallback((variant: 'desktop' | 'mobile') => {
    globalNavState.setValue(prev => ({ ...prev, sidebarVariant: variant }));
  }, [globalNavState]);

  // Page navigation
  const navigateToPage = useCallback((page: string, label?: string) => {
    globalNavState.setValue(prev => {
      const newLastVisited = [page, ...prev.lastVisitedPages.filter(p => p !== page)].slice(0, 10);
      
      return {
        ...prev,
        currentPage: page,
        lastVisitedPages: newLastVisited,
      };
    });

    // Auto-add breadcrumb dacă este furnizat label
    if (label) {
      addBreadcrumb({
        id: page,
        label,
        href: page,
        isActive: true,
      });
    }
  }, [globalNavState]);

  // Breadcrumb actions
  const addBreadcrumb = useCallback((item: BreadcrumbItem) => {
    breadcrumbState.setValue(prev => {
      const filtered = prev.filter(b => b.id !== item.id);
      const updated = [...filtered, { ...item, isActive: true }]
        .map((b, index, arr) => ({ ...b, isActive: index === arr.length - 1 }))
        .slice(-navigationState.breadcrumbMaxItems);
      
      return updated;
    });
  }, [breadcrumbState, navigationState.breadcrumbMaxItems]);

  const clearBreadcrumbs = useCallback(() => {
    breadcrumbState.setValue([]);
  }, [breadcrumbState]);

  const navigateToBreadcrumb = useCallback((id: string) => {
    const item = navigationState.breadcrumbHistory.find(b => b.id === id);
    if (item) {
      navigateToPage(item.href, item.label);
      
      // Șterge breadcrumb-urile după acest item
      const index = navigationState.breadcrumbHistory.findIndex(b => b.id === id);
      if (index >= 0) {
        breadcrumbState.setValue(navigationState.breadcrumbHistory.slice(0, index + 1));
      }
    }
  }, [navigationState.breadcrumbHistory, navigateToPage, breadcrumbState]);

  // Tabs actions
  const openTab = useCallback((tab: Omit<TabState, 'isActive'>) => {
    globalNavState.setValue(prev => {
      // Verifică dacă tab-ul există deja
      const existingIndex = prev.openTabs.findIndex(t => t.id === tab.id);
      
      if (existingIndex >= 0) {
        // Activează tab-ul existent
        const updatedTabs = prev.openTabs.map((t, index) => ({
          ...t,
          isActive: index === existingIndex,
        }));
        
        return {
          ...prev,
          openTabs: updatedTabs,
          activeTabId: tab.id,
        };
      }
      
      // Adaugă tab nou
      let newTabs = [...prev.openTabs, { ...tab, isActive: true }];
      
      // Respectă limita de taburi
      if (newTabs.length > prev.maxOpenTabs) {
        newTabs = newTabs.slice(-prev.maxOpenTabs);
      }
      
      // Dezactivează celelalte taburi
      newTabs = newTabs.map((t, index) => ({
        ...t,
        isActive: index === newTabs.length - 1,
      }));
      
      return {
        ...prev,
        openTabs: newTabs,
        activeTabId: tab.id,
      };
    });
  }, [globalNavState]);

  const closeTab = useCallback((tabId: string) => {
    globalNavState.setValue(prev => {
      const updatedTabs = prev.openTabs.filter(t => t.id !== tabId);
      
      let newActiveTabId = prev.activeTabId;
      
      // Dacă am închis tab-ul activ, activează următorul disponibil
      if (prev.activeTabId === tabId && updatedTabs.length > 0) {
        newActiveTabId = updatedTabs[Math.max(0, updatedTabs.length - 1)].id;
      } else if (updatedTabs.length === 0) {
        newActiveTabId = null;
      }
      
      return {
        ...prev,
        openTabs: updatedTabs.map(t => ({
          ...t,
          isActive: t.id === newActiveTabId,
        })),
        activeTabId: newActiveTabId,
      };
    });
  }, [globalNavState]);

  const setActiveTab = useCallback((tabId: string) => {
    globalNavState.setValue(prev => ({
      ...prev,
      openTabs: prev.openTabs.map(t => ({
        ...t,
        isActive: t.id === tabId,
      })),
      activeTabId: tabId,
    }));
  }, [globalNavState]);

  const closeAllTabs = useCallback(() => {
    globalNavState.setValue(prev => ({
      ...prev,
      openTabs: [],
      activeTabId: null,
    }));
  }, [globalNavState]);

  const closeOtherTabs = useCallback((keepTabId: string) => {
    globalNavState.setValue(prev => {
      const keptTab = prev.openTabs.find(t => t.id === keepTabId);
      return {
        ...prev,
        openTabs: keptTab ? [{ ...keptTab, isActive: true }] : [],
        activeTabId: keptTab ? keepTabId : null,
      };
    });
  }, [globalNavState]);

  // Preferences actions
  const togglePersistence = useCallback(() => {
    globalNavState.setValue(prev => ({
      ...prev,
      persistenceEnabled: !prev.persistenceEnabled,
    }));
  }, [globalNavState]);

  const setMaxOpenTabs = useCallback((count: number) => {
    globalNavState.setValue(prev => {
      let updatedTabs = prev.openTabs;
      
      // Dacă limita nouă e mai mică, închide tab-urile în exces
      if (count < updatedTabs.length) {
        updatedTabs = updatedTabs.slice(-count);
      }
      
      return {
        ...prev,
        maxOpenTabs: count,
        openTabs: updatedTabs,
      };
    });
  }, [globalNavState]);

  // State management
  const clearAllState = useCallback(() => {
    sidebarState.clearValue();
    breadcrumbState.clearValue();
    globalNavState.clearValue();
  }, [sidebarState, breadcrumbState, globalNavState]);

  const restoreDefaultState = useCallback(() => {
    setSidebarExpanded(DEFAULT_NAVIGATION_STATE.sidebarExpanded);
    clearBreadcrumbs();
    globalNavState.setValue({
      sidebarVariant: DEFAULT_NAVIGATION_STATE.sidebarVariant,
      currentPage: DEFAULT_NAVIGATION_STATE.currentPage,
      lastVisitedPages: DEFAULT_NAVIGATION_STATE.lastVisitedPages,
      breadcrumbMaxItems: DEFAULT_NAVIGATION_STATE.breadcrumbMaxItems,
      openTabs: DEFAULT_NAVIGATION_STATE.openTabs,
      activeTabId: DEFAULT_NAVIGATION_STATE.activeTabId,
      persistenceEnabled: DEFAULT_NAVIGATION_STATE.persistenceEnabled,
      autoHideSidebar: DEFAULT_NAVIGATION_STATE.autoHideSidebar,
      maxOpenTabs: DEFAULT_NAVIGATION_STATE.maxOpenTabs,
    });
  }, [setSidebarExpanded, clearBreadcrumbs, globalNavState]);

  const syncComponents = useCallback(() => {
    if (syncInProgress) return;
    
    setSyncInProgress(true);
    const now = Date.now();
    
    // Previne sync prea frecvent
    if (now - lastSyncRef.current < 100) {
      setSyncInProgress(false);
      return;
    }
    
    lastSyncRef.current = now;
    
    // Trigger reload pentru toate store-urile
    setTimeout(() => {
      sidebarState.reloadValue();
      breadcrumbState.reloadValue();
      globalNavState.reloadValue();
      setSyncInProgress(false);
    }, 50);
  }, [syncInProgress, sidebarState, breadcrumbState, globalNavState]);

  // Auto-sync când se schimbă URL-ul
  useEffect(() => {
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      if (currentPath !== navigationState.currentPage) {
        navigateToPage(currentPath);
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [navigationState.currentPage, navigateToPage]);

  const actions: NavigationActions = {
    toggleSidebar,
    setSidebarExpanded,
    setSidebarVariant,
    navigateToPage,
    addBreadcrumb,
    clearBreadcrumbs,
    navigateToBreadcrumb,
    openTab,
    closeTab,
    setActiveTab,
    closeAllTabs,
    closeOtherTabs,
    togglePersistence,
    setMaxOpenTabs,
    clearAllState,
    restoreDefaultState,
    syncComponents,
  };

  return {
    state: navigationState,
    actions,
    isLoaded: sidebarState.isLoaded && breadcrumbState.isLoaded && globalNavState.isLoaded,
    errors: [sidebarState.error, breadcrumbState.error, globalNavState.error].filter(Boolean),
    syncInProgress,
  };
};

export default useNavigationState;
