import { useCallback, useEffect } from 'react';
import { useNavigationState, BreadcrumbItem } from '../../../hooks/useNavigationState';
import { NAVIGATION } from '@budget-app/shared-constants';

/**
 * 🧭 Breadcrumb Navigation Integration
 * Hook pentru integrarea componentei Breadcrumb cu navigation state centralizat
 */

export interface BreadcrumbNavigationOptions {
  /** Auto-add breadcrumb pentru pagina curentă */
  autoAddCurrent?: boolean;
  /** Limita de breadcrumb-uri afișate */
  maxVisible?: number;
  /** Callback la navigare */
  onNavigate?: (item: BreadcrumbItem) => void;
  /** Prefixul pentru generarea ID-urilor automate */
  idPrefix?: string;
}

export const useBreadcrumbNavigation = (options: BreadcrumbNavigationOptions = {}) => {
  const {
    autoAddCurrent = true,
    maxVisible = 5,
    onNavigate,
    idPrefix = 'breadcrumb'
  } = options;

  const { state, actions } = useNavigationState();

  // Breadcrumb-urile vizibile (limitate la maxVisible)
  const visibleBreadcrumbs = state.breadcrumbHistory.slice(-maxVisible);

  /**
   * Adaugă un breadcrumb în istoric
   */
  const addBreadcrumb = useCallback((label: string, href?: string) => {
    const finalHref = href || window.location.pathname;
    const item: BreadcrumbItem = {
      id: `${idPrefix}-${Date.now()}`,
      label,
      href: finalHref,
      isActive: true,
    };

    actions.addBreadcrumb(item);
  }, [actions, idPrefix]);

  /**
   * Navighează la un breadcrumb specific
   */
  const navigateTo = useCallback((item: BreadcrumbItem) => {
    actions.navigateToBreadcrumb(item.id);
    
    // Callback personalizado
    onNavigate?.(item);
    
    // Actualizează URL-ul
    if (item.href && item.href !== window.location.pathname) {
      window.history.pushState({}, '', item.href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [actions, onNavigate]);

  /**
   * Navighează înapoi la breadcrumb-ul anterior
   */
  const navigateBack = useCallback(() => {
    if (visibleBreadcrumbs.length >= 2) {
      const previousItem = visibleBreadcrumbs[visibleBreadcrumbs.length - 2];
      navigateTo(previousItem);
    }
  }, [visibleBreadcrumbs, navigateTo]);

  /**
   * Navighează la primul breadcrumb (home)
   */
  const navigateHome = useCallback(() => {
    if (visibleBreadcrumbs.length > 0) {
      const homeItem = visibleBreadcrumbs[0];
      navigateTo(homeItem);
    }
  }, [visibleBreadcrumbs, navigateTo]);

  /**
   * Șterge istoricul de breadcrumb-uri
   */
  const clearHistory = useCallback(() => {
    actions.clearBreadcrumbs();
  }, [actions]);

  /**
   * Determină dacă se poate naviga înapoi
   */
  const canNavigateBack = visibleBreadcrumbs.length >= 2;

  /**
   * Determină dacă se poate naviga acasă
   */
  const canNavigateHome = visibleBreadcrumbs.length > 1;

  /**
   * Determină breadcrumb-ul activ curent
   */
  const currentBreadcrumb = visibleBreadcrumbs.find(b => b.isActive) || visibleBreadcrumbs[visibleBreadcrumbs.length - 1];

  /**
   * Auto-add breadcrumb pentru pagina curentă la modificarea URL-ului
   */
  useEffect(() => {
    if (!autoAddCurrent) return;

    const currentPath = window.location.pathname;
    const currentBreadcrumbExists = state.breadcrumbHistory.some(b => b.href === currentPath);

    if (!currentBreadcrumbExists) {
      // Generează label bazat pe URL
      const segments = currentPath.split('/').filter(Boolean);
      const label = segments.length > 0 
        ? segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1)
        : NAVIGATION.BREADCRUMBS.HOME;

      addBreadcrumb(label, currentPath);
    }
  }, [state.currentPage, state.breadcrumbHistory, autoAddCurrent, addBreadcrumb]);

  /**
   * Generează label-uri mai friendly pentru rute comune
   */
  const generateFriendlyLabel = useCallback((path: string): string => {
    const routeLabels: Record<string, string> = {
      '/': NAVIGATION.BREADCRUMBS.HOME,
      '/transactions': NAVIGATION.ITEMS.TRANSACTIONS,
      '/lunar-grid': NAVIGATION.ITEMS.LUNAR_GRID,
      '/accounts': NAVIGATION.ITEMS.ACCOUNTS,
      '/reports': NAVIGATION.ITEMS.REPORTS,
      '/options': NAVIGATION.ITEMS.OPTIONS,
      '/settings': NAVIGATION.ITEMS.SETTINGS,
    };

    return routeLabels[path] || path.split('/').pop()?.replace('-', ' ') || 'Pagină';
  }, []);

  /**
   * Adaugă breadcrumb cu label friendly
   */
  const addFriendlyBreadcrumb = useCallback((href?: string) => {
    const finalHref = href || window.location.pathname;
    const friendlyLabel = generateFriendlyLabel(finalHref);
    addBreadcrumb(friendlyLabel, finalHref);
  }, [addBreadcrumb, generateFriendlyLabel]);

  return {
    // State
    breadcrumbs: visibleBreadcrumbs,
    currentBreadcrumb,
    canNavigateBack,
    canNavigateHome,
    isLoaded: state.persistenceEnabled,
    
    // Actions
    addBreadcrumb,
    addFriendlyBreadcrumb,
    navigateTo,
    navigateBack,
    navigateHome,
    clearHistory,
    
    // Utils
    generateFriendlyLabel,
  };
};

export default useBreadcrumbNavigation; 
