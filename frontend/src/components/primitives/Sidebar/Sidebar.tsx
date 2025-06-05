import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  cn,
  navigation,
  navigationItem,
  loadingOverlay,
  type NavigationProps,
  type NavigationItemProps
} from '../../../styles/cva-v2';
import { NAVIGATION } from '@shared-constants';
import { useNavigationState } from '../../../hooks/useNavigationState';

/**
 * Props pentru componenta Sidebar
 */
export interface SidebarProps {
  /** Conținutul sidebar-ului */
  children?: React.ReactNode;
  /** CSS classes adiționale */
  className?: string;
  /** Data test ID pentru testare */
  testId?: string;
  /** Callback pentru toggle state */
  onToggle?: (isExpanded: boolean) => void;
  /** Starea inițială (expanded/collapsed) */
  defaultExpanded?: boolean;
  /** Versiunea pentru mobile (hamburger menu) */
  variant?: 'desktop' | 'mobile';
  /** Overlay pentru mobile */
  showOverlay?: boolean;
  /** Callback pentru închiderea overlay-ului */
  onOverlayClick?: () => void;
}

/**
 * Props pentru item-urile din sidebar
 */
export interface SidebarItemProps extends Omit<NavigationItemProps, 'children'> {
  /** Conținutul item-ului */
  children: React.ReactNode;
  /** URL-ul pentru navigare */
  to?: string;
  /** Icon (opțional) */
  icon?: React.ReactNode;
  /** CSS classes adiționale */
  className?: string;
  /** Data test ID pentru testare */
  testId?: string;
  /** Callback pentru click */
  onClick?: () => void;
  /** Indică dacă item-ul este activ */
  isActive?: boolean;
}

/**
 * Item pentru sidebar cu suport pentru navigare
 */
export const SidebarItem: React.FC<SidebarItemProps> = ({
  children,
  to,
  icon,
  className,
  testId,
  onClick,
  isActive = false,
  variant = 'default',
  size = 'md',
  ...props
}) => {
  const location = useLocation();
  
  // Detectează dacă item-ul este activ bazat pe URL
  const isActiveItem = isActive || (to && location.pathname === to);
  
  const itemVariant = isActiveItem ? 'active' : variant;

  const content = (
    <>
      {icon && <span className="mr-3 flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </>
  );

  const commonClasses = cn(
    navigationItem({ variant: itemVariant, size }),
    "w-full justify-start rounded-lg mb-1",
    className
  );

  if (to) {
    return (
      <a
        href={to}
        className={commonClasses}
        data-testid={testId}
        onClick={(e) => {
          e.preventDefault();
          window.history.pushState({}, '', to);
          window.dispatchEvent(new PopStateEvent('popstate'));
          onClick?.();
        }}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={commonClasses}
      data-testid={testId}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
};

/**
 * Componenta principală Sidebar
 * Implementează sidebar persistent pentru desktop și hamburger menu pentru mobile
 */
const Sidebar: React.FC<SidebarProps> = ({
  children,
  className,
  testId = 'sidebar',
  onToggle,
  defaultExpanded = true,
  variant = 'desktop',
  showOverlay = false,
  onOverlayClick,
}) => {
  // Folosește navigation state centralizat cu fallback la props
  const { state, actions } = useNavigationState();
  const [localVariant, setLocalVariant] = useState(variant);

  // Sincronizează variant-ul cu navigation state
  useEffect(() => {
    actions.setSidebarVariant(variant);
    setLocalVariant(variant);
  }, [variant, actions]);

  // Sync cu defaultExpanded doar la primul mount
  useEffect(() => {
    if (defaultExpanded !== state.sidebarExpanded) {
      actions.setSidebarExpanded(defaultExpanded);
    }
  }, []); // Run doar o dată la mount

  // Notifică părintele despre schimbări
  useEffect(() => {
    onToggle?.(state.sidebarExpanded);
  }, [state.sidebarExpanded, onToggle]);

  const handleToggle = () => {
    actions.toggleSidebar();
  };

  // Pentru mobile overlay
  if (variant === 'mobile') {
    return (
      <>
        {/* Overlay */}
        {showOverlay && (
          <div
            className={cn(loadingOverlay({ variant: "modal" }), "lg:hidden")}
            onClick={onOverlayClick}
            data-testid={`${testId}-overlay`}
            aria-label={NAVIGATION.MOBILE.MENU_OVERLAY}
          />
        )}
        
        {/* Mobile sidebar */}
        <aside
          className={cn(
            navigation({ variant: 'primary', orientation: 'vertical' }),
            "fixed left-0 top-0 h-full w-80 z-50 lg:hidden",
            "transform transition-transform duration-300 ease-in-out",
            showOverlay ? "translate-x-0" : "-translate-x-full",
            "shadow-2xl",
            className
          )}
          data-testid={testId}
          aria-label={NAVIGATION.ARIA.NAVIGATION}
        >
          <div className="flex flex-col h-full">
            {/* Header cu buton de închidere */}
            <div className="flex items-center justify-between p-4 border-b border-carbon-200 dark:border-carbon-700">
              <h2 className="text-lg font-semibold text-carbon-900 dark:text-carbon-100">
                {NAVIGATION.ITEMS.DASHBOARD}
              </h2>
              <button
                onClick={onOverlayClick}
                className={cn(
                  navigationItem({ variant: 'ghost', size: 'sm' }),
                  "p-2"
                )}
                data-testid={`${testId}-close-button`}
                aria-label={NAVIGATION.MOBILE.CLOSE_MENU}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {children}
            </div>
          </div>
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        navigation({ variant: 'primary', orientation: 'vertical' }),
        "hidden lg:flex flex-col h-screen sticky top-0",
        "transition-all duration-300 ease-in-out",
        state.sidebarExpanded ? "w-64" : "w-16",
        "border-r border-carbon-200 dark:border-carbon-700",
        className
      )}
      data-testid={testId}
      aria-label={NAVIGATION.ARIA.NAVIGATION}
    >
      {/* Header cu buton toggle */}
      <div className="flex items-center justify-between p-4 border-b border-carbon-200 dark:border-carbon-700">
        {state.sidebarExpanded && (
          <h2 className="text-lg font-semibold text-carbon-900 dark:text-carbon-100 truncate">
            Budget App
          </h2>
        )}
        <button
          onClick={handleToggle}
          className={cn(
            navigationItem({ variant: 'ghost', size: 'sm' }),
            "p-2 ml-auto"
          )}
          data-testid={`${testId}-toggle-button`}
          aria-label={state.sidebarExpanded ? NAVIGATION.SIDEBAR.COLLAPSE : NAVIGATION.SIDEBAR.EXPAND}
          title={state.sidebarExpanded ? NAVIGATION.SIDEBAR.COLLAPSE : NAVIGATION.SIDEBAR.EXPAND}
        >
          <svg 
            className={cn("w-5 h-5 transition-transform duration-200", state.sidebarExpanded && "rotate-180")} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <nav role="navigation" aria-label={NAVIGATION.ARIA.NAVIGATION}>
          {children}
        </nav>
      </div>
      
      {/* Footer (opțional) */}
      <div className="p-4 border-t border-carbon-200 dark:border-carbon-700">
        {state.sidebarExpanded ? (
          <div className="text-xs text-carbon-500 dark:text-carbon-400">
            v1.0.0
          </div>
        ) : (
          <div className="w-8 h-8 bg-carbon-100 dark:bg-carbon-800 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-carbon-600 dark:text-carbon-400">
              V
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 