/**
 * 📋 LIST COMPONENT - Task 8.4
 * Componentă pentru afișarea listelor de date financiare
 * Cu suport pentru items interactivi, categorii și acțiuni
 */

import React, { ReactNode, useCallback } from 'react';
import { cn } from '../../../styles/cva-v2';
import { list, listItem, badge, type ListProps, type ListItemProps } from '../../../styles/cva-v2/primitives';
import { formatCurrencyRON, formatDateRON } from '../../../utils/financial';
import type { FinancialListItem, CategoryListItem } from '../../../types/financial';
import { TransactionType } from '@shared-constants';

// =============================================================================
// LIST ITEM ACTIONS COMPONENT
// =============================================================================

interface ListItemActionsProps {
  actions?: {
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
  };
  compact?: boolean;
}

const ListItemActions: React.FC<ListItemActionsProps> = ({ 
  actions, 
  compact = false 
}) => {
  if (!actions || !Object.values(actions).some(Boolean)) return null;

  const buttonSize = compact ? 'w-6 h-6' : 'w-8 h-8';
  const iconSize = compact ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {actions.onView && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            actions.onView!();
          }}
          className={cn(
            buttonSize,
            'flex items-center justify-center rounded-md',
            'hover:bg-carbon-200 dark:hover:bg-carbon-700',
            'text-carbon-600 hover:text-carbon-900 dark:text-carbon-400 dark:hover:text-carbon-100',
            'transition-colors duration-150'
          )}
          data-testid="list-item-view"
        >
          <span className={iconSize}>👁</span>
        </button>
      )}
      {actions.onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            actions.onEdit!();
          }}
          className={cn(
            buttonSize,
            'flex items-center justify-center rounded-md',
            'hover:bg-copper-200 dark:hover:bg-copper-800',
            'text-copper-600 hover:text-copper-900 dark:text-copper-400 dark:hover:text-copper-100',
            'transition-colors duration-150'
          )}
          data-testid="list-item-edit"
        >
          <span className={iconSize}>✏️</span>
        </button>
      )}
      {actions.onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            actions.onDelete!();
          }}
          className={cn(
            buttonSize,
            'flex items-center justify-center rounded-md',
            'hover:bg-ruby-200 dark:hover:bg-ruby-800',
            'text-ruby-600 hover:text-ruby-900 dark:text-ruby-400 dark:hover:text-ruby-100',
            'transition-colors duration-150'
          )}
          data-testid="list-item-delete"
        >
          <span className={iconSize}>🗑️</span>
        </button>
      )}
    </div>
  );
};

// =============================================================================
// FINANCIAL LIST ITEM COMPONENT
// =============================================================================

interface FinancialListItemComponentProps extends ListItemProps {
  item: FinancialListItem;
  onClick?: (item: FinancialListItem) => void;
  showActions?: boolean;
  compact?: boolean;
}

const FinancialListItemComponent: React.FC<FinancialListItemComponentProps> = ({
  item,
  onClick,
  showActions = true,
  compact = false,
  variant = 'financial',
  spacing = 'md',
  ...props
}) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(item);
    }
  }, [onClick, item]);

  const amountColor = item.amount && item.type 
    ? item.type === TransactionType.INCOME 
      ? 'text-copper-600 dark:text-copper-400' 
      : 'text-ruby-600 dark:text-ruby-400'
    : 'text-carbon-900 dark:text-carbon-100';

  return (
    <li 
      className={cn(
        listItem({ variant, spacing }), 
        'group',
        onClick ? 'cursor-pointer' : ''
      )}
      onClick={handleClick}
      data-testid={`financial-list-item-${item.id}`}
      {...props}
    >
      {/* Conținut principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              'font-medium text-carbon-900 dark:text-carbon-100 truncate',
              compact ? 'text-sm' : 'text-base'
            )}>
              {item.title}
            </h4>
            
            {item.subtitle && (
              <p className={cn(
                'text-carbon-600 dark:text-carbon-400 truncate',
                compact ? 'text-xs' : 'text-sm'
              )}>
                {item.subtitle}
              </p>
            )}
            
            {item.description && !compact && (
              <p className="text-sm text-carbon-500 dark:text-carbon-500 mt-1 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>

          {/* Sumă și badge */}
          <div className="flex items-center space-x-3 ml-4">
            {item.amount !== undefined && (
              <div className={cn(
                'font-mono tabular-nums font-semibold',
                compact ? 'text-sm' : 'text-base',
                amountColor
              )}>
                {formatCurrencyRON(item.amount)}
              </div>
            )}
            
            {item.badge && (
              <span className={cn(
                badge({ 
                  variant: item.badge.variant === 'default' ? 'neutral' : 
                          item.badge.variant === 'error' ? 'warning' : 
                          item.badge.variant
                })
              )}>
                {item.badge.text}
              </span>
            )}
          </div>
        </div>

        {/* Metadata secundară */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-4 text-xs text-carbon-500 dark:text-carbon-500">
            {item.category && (
              <span>
                {item.category}
                {item.subcategory && ` > ${item.subcategory}`}
              </span>
            )}
            
            {item.date && (
              <span>{formatDateRON(item.date)}</span>
            )}
          </div>

          {/* Acțiuni */}
          {showActions && item.actions && (
            <ListItemActions actions={item.actions} compact={compact} />
          )}
        </div>
      </div>
    </li>
  );
};

// =============================================================================
// CATEGORY LIST ITEM COMPONENT
// =============================================================================

interface CategoryListItemComponentProps extends ListItemProps {
  item: CategoryListItem;
  onClick?: (item: CategoryListItem) => void;
  showSubcategories?: boolean;
  compact?: boolean;
}

const CategoryListItemComponent: React.FC<CategoryListItemComponentProps> = ({
  item,
  onClick,
  showSubcategories = false,
  compact = false,
  variant = 'financial',
  spacing = 'md',
  ...props
}) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(item);
    }
  }, [onClick, item]);

  const trendIcon = item.trend ? 
    item.trend.direction === 'up' ? '↗️' : 
    item.trend.direction === 'down' ? '↘️' : '➡️' : null;

  return (
    <li 
      className={cn(
        listItem({ variant, spacing }),
        'group',
        onClick ? 'cursor-pointer' : ''
      )}
      onClick={handleClick}
      data-testid={`category-list-item-${item.id}`}
      {...props}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className={cn(
                'font-medium text-carbon-900 dark:text-carbon-100',
                compact ? 'text-sm' : 'text-base'
              )}>
                {item.name}
              </h4>
              {trendIcon && (
                <span className="text-sm">{trendIcon}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mt-1">
              <span className={cn(
                'text-carbon-600 dark:text-carbon-400',
                compact ? 'text-xs' : 'text-sm'
              )}>
                {item.transactionCount} tranzacții
              </span>
              
              <span className={cn(
                'text-carbon-600 dark:text-carbon-400',
                compact ? 'text-xs' : 'text-sm'
              )}>
                {item.percentage.toFixed(1)}% din total
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className={cn(
              'font-mono tabular-nums font-semibold text-carbon-900 dark:text-carbon-100',
              compact ? 'text-sm' : 'text-base'
            )}>
              {formatCurrencyRON(item.totalAmount)}
            </div>
            
            {item.trend && (
              <div className={cn(
                'text-carbon-500 dark:text-carbon-500',
                compact ? 'text-xs' : 'text-sm'
              )}>
                {item.trend.value > 0 ? '+' : ''}{item.trend.value.toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        {/* Subcategorii */}
        {showSubcategories && item.subcategories && item.subcategories.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-carbon-200 dark:border-carbon-700">
            <div className="space-y-1">
              {item.subcategories.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between text-sm">
                  <span className="text-carbon-600 dark:text-carbon-400">
                    {sub.name} ({sub.count})
                  </span>
                  <span className="font-mono text-carbon-700 dark:text-carbon-300">
                    {formatCurrencyRON(sub.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

// =============================================================================
// MAIN LIST COMPONENT
// =============================================================================

export interface ListComponentProps extends ListProps {
  children?: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  data?: FinancialListItem[] | CategoryListItem[];
  type?: 'financial' | 'category';
  loading?: boolean;
  error?: string | null;
  empty?: string | ReactNode;
  onItemClick?: (item: any) => void;
  showActions?: boolean;
  showSubcategories?: boolean;
  compact?: boolean;
  emptyIcon?: string;
}

export const List: React.FC<ListComponentProps> = ({
  children,
  className,
  title,
  subtitle,
  data,
  type = 'financial',
  variant = 'default',
  spacing = 'md',
  loading = false,
  error = null,
  empty = 'Nu există elemente de afișat',
  onItemClick,
  showActions = true,
  showSubcategories = false,
  compact = false,
  emptyIcon = '📋',
  ...props
}) => {
  // =============================================================================
  // LOADING STATE
  // =============================================================================
  
  if (loading) {
    return (
      <div className={cn(list({ variant, spacing }), className)} {...props}>
        {title && (
          <div className="px-4 py-3 border-b border-carbon-200 dark:border-carbon-700">
            <div className="h-5 bg-carbon-200 rounded dark:bg-carbon-700 w-1/3"></div>
          </div>
        )}
        <div className="space-y-0 divide-y divide-carbon-200 dark:divide-carbon-700">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-4 py-3 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-carbon-200 rounded dark:bg-carbon-700 w-2/3"></div>
                  <div className="h-3 bg-carbon-200 rounded dark:bg-carbon-700 w-1/2"></div>
                </div>
                <div className="h-6 bg-carbon-200 rounded dark:bg-carbon-700 w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =============================================================================
  // ERROR STATE
  // =============================================================================
  
  if (error) {
    return (
      <div className={cn(list({ variant, spacing }), 'border-ruby-300', className)} {...props}>
        <div className="text-center py-8">
          <div className="text-ruby-600 dark:text-ruby-400 mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <p className="text-ruby-700 dark:text-ruby-300">{error}</p>
        </div>
      </div>
    );
  }

  // =============================================================================
  // EMPTY STATE
  // =============================================================================
  
  if (!data || data.length === 0) {
    return (
      <div className={cn(list({ variant, spacing }), className)} {...props}>
        {(title || subtitle) && (
          <div className="px-4 py-3 border-b border-carbon-200 dark:border-carbon-700">
            {title && (
              <h3 className="text-lg font-semibold text-carbon-900 dark:text-carbon-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-carbon-600 dark:text-carbon-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="text-center py-8">
          <div className="text-4xl mb-4">{emptyIcon}</div>
          <div className="text-carbon-600 dark:text-carbon-400">
            {typeof empty === 'string' ? <p>{empty}</p> : empty}
          </div>
        </div>
      </div>
    );
  }

  // =============================================================================
  // MAIN RENDER
  // =============================================================================
  
  return (
    <div className={cn(list({ variant, spacing }), className)} {...props}>
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-carbon-200 dark:border-carbon-700">
          {title && (
            <h3 className="text-lg font-semibold text-carbon-900 dark:text-carbon-100">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-carbon-600 dark:text-carbon-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <ul className="divide-y divide-carbon-200 dark:divide-carbon-700">
        {children || (
          data?.map((item) => {
            if (type === 'category') {
              return (
                <CategoryListItemComponent
                  key={item.id}
                  item={item as CategoryListItem}
                  onClick={onItemClick}
                  showSubcategories={showSubcategories}
                  compact={compact}
                  variant={variant === 'financial' ? 'financial' : 'default'}
                  spacing={spacing}
                />
              );
            } else {
              return (
                <FinancialListItemComponent
                  key={item.id}
                  item={item as FinancialListItem}
                  onClick={onItemClick}
                  showActions={showActions}
                  compact={compact}
                  variant={variant === 'financial' ? 'financial' : 'default'}
                  spacing={spacing}
                />
              );
            }
          })
        )}
      </ul>
    </div>
  );
};

// =============================================================================
// EXPORT & TYPES
// =============================================================================

export default List;

// Re-export types for convenience
export type { FinancialListItem, CategoryListItem } from '../../../types/financial'; 