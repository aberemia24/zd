import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  breadcrumb, 
  breadcrumbSeparator,
  type BreadcrumbProps as CVABreadcrumbProps,
  type BreadcrumbSeparatorProps as CVABreadcrumbSeparatorProps
} from '../../../styles/cva-v2';
import { cn } from '../../../styles/cva-v2';
import { NAVIGATION } from '@budget-app/shared-constants';

/**
 * Tipuri pentru Breadcrumb Component
 */
export interface BreadcrumbItem {
  /** Textul afișat */
  label: string;
  /** URL-ul pentru navigare (opțional pentru ultimul item) */
  href?: string;
  /** Icon opțional */
  icon?: React.ReactNode;
  /** Identificator unic */
  id?: string;
}

export interface BreadcrumbProps extends CVABreadcrumbProps {
  /** Lista de breadcrumb items */
  items?: BreadcrumbItem[];
  /** Separator type (moștenit din CVA) */
  separatorType?: CVABreadcrumbSeparatorProps['type'];
  /** CSS classes adiționale */
  className?: string;
  /** Data test ID pentru testare */
  testId?: string;
  /** Callback pentru click pe item */
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  /** Afișează iconul home pentru primul item */
  showHomeIcon?: boolean;
  /** Afișează path-ul curent automat */
  autoPath?: boolean;
  /** Configurația pentru autoPath (mapare rute → labels) */
  pathLabels?: Record<string, string>;
  /** Numărul maxim de items afișate (restul se collapse) */
  maxItems?: number;
}

/**
 * Hook pentru generarea automată a breadcrumbs din path-ul curent
 */
const useAutoBreadcrumbs = (pathLabels: Record<string, string> = {}) => {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Adaugă Home
    breadcrumbs.push({
      id: 'home',
      label: NAVIGATION.BREADCRUMBS.HOME,
      href: '/',
      icon: '🏠'
    });
    
    // Construiește breadcrumbs din segmente
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Folosește label custom sau fallback la segment
      const label = pathLabels[currentPath] || 
                   pathLabels[segment] || 
                   segment.charAt(0).toUpperCase() + segment.slice(1);
      
      breadcrumbs.push({
        id: `segment-${index}`,
        label,
        href: index === pathSegments.length - 1 ? undefined : currentPath
      });
    });
    
    return breadcrumbs;
  };
  
  return generateBreadcrumbs();
};

/**
 * Componentă pentru un breadcrumb item individual
 */
const BreadcrumbItemComponent: React.FC<{
  item: BreadcrumbItem;
  index: number;
  isLast: boolean;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  testId?: string;
}> = ({ item, index, isLast, onItemClick, testId }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onItemClick) {
      e.preventDefault();
      onItemClick(item, index);
    }
  };

  const content = (
    <>
      {item.icon && (
        <span className="mr-1 flex-shrink-0" aria-hidden="true">
          {item.icon}
        </span>
      )}
      <span className={cn(
        "transition-colors duration-200",
        isLast 
          ? "text-carbon-900 dark:text-carbon-100 font-medium cursor-default"
          : "text-carbon-600 dark:text-carbon-400 hover:text-copper-600 dark:hover:text-copper-400"
      )}>
        {item.label}
      </span>
    </>
  );

  if (item.href && !isLast) {
    return (
      <Link
        to={item.href}
        className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-500 focus-visible:ring-offset-2 rounded-sm"
        onClick={handleClick}
        data-testid={testId ? `${testId}-item-${index}` : undefined}
        aria-current={isLast ? 'page' : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <span 
      className="inline-flex items-center"
      data-testid={testId ? `${testId}-item-${index}` : undefined}
      aria-current={isLast ? 'page' : undefined}
    >
      {content}
    </span>
  );
};

/**
 * Componentă pentru separator
 */
const BreadcrumbSeparatorComponent: React.FC<{
  type: CVABreadcrumbSeparatorProps['type'];
  testId?: string;
  index: number;
}> = ({ type, testId, index }) => {
  return (
    <span 
      className={cn(breadcrumbSeparator({ type }))}
      aria-hidden="true"
      data-testid={testId ? `${testId}-separator-${index}` : undefined}
    />
  );
};

/**
 * Componenta principală Breadcrumb
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  variant = 'default',
  separatorType = 'chevron',
  className,
  testId = 'breadcrumb',
  onItemClick,
  showHomeIcon = true,
  autoPath = false,
  pathLabels = {},
  maxItems,
  ...props
}) => {
  // Generează breadcrumbs automat dacă autoPath este activat
  const autoBreadcrumbs = useAutoBreadcrumbs(pathLabels);
  const finalItems = autoPath ? autoBreadcrumbs : (items || []);
  
  // Aplicăm maxItems dacă este specificat
  const displayItems = maxItems && finalItems.length > maxItems
    ? [
        ...finalItems.slice(0, 1), // primul item (Home)
        { 
          id: 'ellipsis', 
          label: '...', 
          icon: undefined 
        },
        ...finalItems.slice(-(maxItems - 2)) // ultimele items
      ]
    : finalItems;

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <nav 
      className={cn(breadcrumb({ variant }), className)}
      aria-label={NAVIGATION.ARIA.BREADCRUMB}
      data-testid={testId}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.id === 'ellipsis';
          
          return (
            <li key={item.id || index} className="flex items-center space-x-2">
              {/* Renderează item-ul */}
              {isEllipsis ? (
                <span 
                  className="text-carbon-500 dark:text-carbon-500 cursor-default"
                  data-testid={`${testId}-ellipsis`}
                >
                  {item.label}
                </span>
              ) : (
                <BreadcrumbItemComponent
                  item={item}
                  index={index}
                  isLast={isLast}
                  onItemClick={onItemClick}
                  testId={testId}
                />
              )}
              
              {/* Renderează separator (nu pentru ultimul item) */}
              {!isLast && (
                <BreadcrumbSeparatorComponent
                  type={separatorType}
                  testId={testId}
                  index={index}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

/**
 * Hook pentru utilizare în componente custom
 */
export const useBreadcrumb = (pathLabels?: Record<string, string>) => {
  const breadcrumbs = useAutoBreadcrumbs(pathLabels);
  
  return {
    breadcrumbs,
    currentPage: breadcrumbs[breadcrumbs.length - 1]?.label || '',
    pathDepth: breadcrumbs.length
  };
};

export default Breadcrumb; 
