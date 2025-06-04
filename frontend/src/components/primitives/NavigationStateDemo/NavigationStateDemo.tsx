import React from 'react';
import { useNavigationState } from '../../../hooks/useNavigationState';
import { useBreadcrumbNavigation } from '../Breadcrumb/useBreadcrumbNavigation';
import Button from '../Button/Button';
import { Breadcrumb } from '../Breadcrumb/Breadcrumb';
import { cn } from '../../../styles/cva-v2';
import { NAVIGATION } from '@shared-constants';

/**
 * 🧭 Navigation State Demo Component
 * Demonstrează funcționalitatea sistemului de navigation state persistence
 */
export const NavigationStateDemo: React.FC = () => {
  const { state, actions, isLoaded, errors, syncInProgress } = useNavigationState();
  const breadcrumbNav = useBreadcrumbNavigation({
    autoAddCurrent: true,
    maxVisible: 5,
  });

  const handleAddTab = () => {
    const tabId = `tab-${Date.now()}`;
    actions.openTab({
      id: tabId,
      title: `Tab ${state.openTabs.length + 1}`,
      href: `/page-${tabId}`,
      closeable: true,
    });
  };

  const handleAddBreadcrumb = () => {
    const label = `Page ${breadcrumbNav.breadcrumbs.length + 1}`;
    const href = `/page-${Date.now()}`;
    breadcrumbNav.addBreadcrumb(label, href);
  };

  const handleNavigateToPage = (page: string, label: string) => {
    actions.navigateToPage(page, label);
    breadcrumbNav.addBreadcrumb(label, page);
  };

  if (!isLoaded) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Se încarcă navigation state...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="border border-carbon-200 dark:border-carbon-700 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-carbon-900 dark:text-carbon-100">
          🧭 Navigation State Demo
        </h1>
        <p className="text-carbon-600 dark:text-carbon-400 mb-6">
          Demonstrație pentru sistemul de navigation state persistence. 
          Toate schimbările sunt salvate automat în localStorage.
        </p>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            <h3 className="text-red-800 dark:text-red-200 font-medium mb-2">Erori persistence:</h3>
            <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-sm">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Sync Status */}
        {syncInProgress && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
            <div className="text-blue-800 dark:text-blue-200">
              🔄 Sincronizare componente în progres...
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Controls */}
      <div className="border border-carbon-200 dark:border-carbon-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3 text-carbon-900 dark:text-carbon-100">
          📋 Sidebar State
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Status:</span>{' '}
              <span className={cn(
                "px-2 py-1 rounded text-xs",
                state.sidebarExpanded 
                  ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                  : "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200"
              )}>
                {state.sidebarExpanded ? 'Extins' : 'Restrâns'}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Variant:</span> {state.sidebarVariant}
            </div>
          </div>
          <div className="space-y-2">
            <Button 
              onClick={actions.toggleSidebar}
              variant="outline"
              size="sm"
            >
              {state.sidebarExpanded ? 'Restrânge' : 'Extinde'} Sidebar
            </Button>
            <div className="space-x-2">
              <Button 
                onClick={() => actions.setSidebarVariant('desktop')}
                variant={state.sidebarVariant === 'desktop' ? 'primary' : 'ghost'}
                size="xs"
              >
                Desktop
              </Button>
              <Button 
                onClick={() => actions.setSidebarVariant('mobile')}
                variant={state.sidebarVariant === 'mobile' ? 'primary' : 'ghost'}
                size="xs"
              >
                Mobile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Controls */}
      <div className="border border-carbon-200 dark:border-carbon-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3 text-carbon-900 dark:text-carbon-100">
          🍞 Breadcrumb Navigation
        </h2>
        
        {/* Current Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumb items={breadcrumbNav.breadcrumbs.map(b => ({
            label: b.label,
            href: b.href,
            id: b.id,
          }))} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Button 
              onClick={handleAddBreadcrumb}
              variant="outline"
              size="sm"
            >
              Adaugă Breadcrumb
            </Button>
            <Button 
              onClick={breadcrumbNav.clearHistory}
              variant="ghost"
              size="sm"
            >
              Șterge Istoric
            </Button>
          </div>
          <div className="space-y-2">
            <Button 
              onClick={() => handleNavigateToPage('/transactions', 'Tranzacții')}
              variant="ghost"
              size="sm"
            >
              Navighează la Tranzacții
            </Button>
            <Button 
              onClick={() => handleNavigateToPage('/lunar-grid', 'Grid Lunar')}
              variant="ghost"
              size="sm"
            >
              Navighează la LunarGrid
            </Button>
          </div>
        </div>

        <div className="mt-3 text-sm text-carbon-600 dark:text-carbon-400">
          <div>Breadcrumbs active: {breadcrumbNav.breadcrumbs.length}</div>
          <div>Can navigate back: {breadcrumbNav.canNavigateBack ? 'Da' : 'Nu'}</div>
          <div>Current page: {breadcrumbNav.currentBreadcrumb?.label || 'N/A'}</div>
        </div>
      </div>

      {/* Tabs Controls */}
      <div className="border border-carbon-200 dark:border-carbon-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3 text-carbon-900 dark:text-carbon-100">
          📑 Tabs Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Button 
              onClick={handleAddTab}
              variant="outline"
              size="sm"
            >
              Adaugă Tab
            </Button>
            <Button 
              onClick={actions.closeAllTabs}
              variant="ghost"
              size="sm"
              disabled={state.openTabs.length === 0}
            >
              Închide Toate ({state.openTabs.length})
            </Button>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Active Tab:</span> {state.activeTabId || 'Niciunul'}
            </div>
            <div className="text-sm">
              <span className="font-medium">Max Tabs:</span> {state.maxOpenTabs}
            </div>
          </div>
        </div>

        {/* Open Tabs List */}
        {state.openTabs.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-carbon-700 dark:text-carbon-300">
              Taburi deschise:
            </h3>
            <div className="space-y-1">
              {state.openTabs.map((tab, index) => (
                <div 
                  key={tab.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded border",
                    tab.isActive 
                      ? "border-copper-300 bg-copper-50 dark:bg-copper-900/20 dark:border-copper-700"
                      : "border-carbon-200 dark:border-carbon-700"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{tab.title}</span>
                    {tab.isActive && (
                      <span className="text-xs bg-copper-600 text-white px-1 rounded">
                        activ
                      </span>
                    )}
                  </div>
                  <div className="space-x-1">
                    {!tab.isActive && (
                      <Button 
                        onClick={() => actions.setActiveTab(tab.id)}
                        variant="ghost"
                        size="xs"
                      >
                        Activează
                      </Button>
                    )}
                    <Button 
                      onClick={() => actions.closeTab(tab.id)}
                      variant="ghost"
                      size="xs"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* State Management */}
      <div className="border border-carbon-200 dark:border-carbon-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3 text-carbon-900 dark:text-carbon-100">
          ⚙️ State Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Current Page:</span> {state.currentPage}
            </div>
            <div className="text-sm">
              <span className="font-medium">Persistence:</span>{' '}
              <span className={cn(
                "px-2 py-1 rounded text-xs",
                state.persistenceEnabled 
                  ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                  : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
              )}>
                {state.persistenceEnabled ? 'Activă' : 'Dezactivată'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Button 
              onClick={actions.togglePersistence}
              variant="outline"
              size="sm"
            >
              {state.persistenceEnabled ? 'Dezactivează' : 'Activează'} Persistence
            </Button>
            <Button 
              onClick={actions.syncComponents}
              variant="ghost"
              size="sm"
              disabled={syncInProgress}
            >
              🔄 Sincronizează Componente
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={actions.restoreDefaultState}
            variant="secondary"
            size="sm"
          >
            🔄 Restaurează Default
          </Button>
          <Button 
            onClick={actions.clearAllState}
            variant="destructive"
            size="sm"
          >
            🗑️ Șterge Tot State-ul
          </Button>
        </div>

        {/* Last Visited Pages */}
        {state.lastVisitedPages.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-carbon-700 dark:text-carbon-300 mb-2">
              Pagini recente:
            </h3>
            <div className="text-xs text-carbon-600 dark:text-carbon-400 space-y-1">
              {state.lastVisitedPages.slice(0, 5).map((page, index) => (
                <div key={index} className="truncate">
                  {index + 1}. {page}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div className="border border-carbon-200 dark:border-carbon-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3 text-carbon-900 dark:text-carbon-100">
          🐞 Debug Info
        </h2>
        <details>
          <summary className="cursor-pointer text-sm font-medium text-carbon-700 dark:text-carbon-300">
            View Raw State (click to expand)
          </summary>
          <pre className="mt-2 p-3 bg-carbon-50 dark:bg-carbon-900 rounded text-xs overflow-auto max-h-64">
            {JSON.stringify(state, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default NavigationStateDemo; 