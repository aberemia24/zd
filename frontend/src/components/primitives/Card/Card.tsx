/**
 * 💳 CARD COMPONENT - Task 8.4
 * Componentă pentru afișarea datelor financiare în card-uri elegante
 * Cu suport pentru trend indicators, icoane și acțiuni interactive
 */

import React, { ReactNode } from 'react';
import { cn } from '../../../styles/cva-v2';
import { card, type CardProps } from '../../../styles/cva-v2/primitives';
import { formatCurrencyRON } from '../../../utils/financial';
import type { FinancialCardData } from '../../../types/financial';

// =============================================================================
// TREND INDICATOR COMPONENT
// =============================================================================

interface TrendIndicatorProps {
  direction: 'up' | 'down' | 'neutral';
  value: number;
  label: string;
  size?: 'sm' | 'md';
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ 
  direction, 
  value, 
  label, 
  size = 'md' 
}) => {
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  
  const trendColors = {
    up: 'text-copper-600 dark:text-copper-400',
    down: 'text-ruby-600 dark:text-ruby-400',
    neutral: 'text-carbon-600 dark:text-carbon-400',
  };

  const arrows = {
    up: '↗',
    down: '↘',
    neutral: '→',
  };

  return (
    <div className={cn("flex items-center space-x-1", trendColors[direction])}>
      <span className={cn("font-mono", iconSize)}>{arrows[direction]}</span>
      <span className={cn("font-medium", textSize)}>
        {value > 0 ? '+' : ''}{value.toFixed(1)}%
      </span>
      <span className={cn("text-carbon-500 dark:text-carbon-400", textSize)}>
        {label}
      </span>
    </div>
  );
};

// =============================================================================
// CARD VALUE DISPLAY COMPONENT
// =============================================================================

interface CardValueProps {
  value: number | string;
  type: 'amount' | 'percentage' | 'count' | 'text';
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

const CardValue: React.FC<CardValueProps> = ({ 
  value, 
  type, 
  variant = 'default',
  size = 'md' 
}) => {
  const formatValue = () => {
    switch (type) {
      case 'amount':
        return typeof value === 'number' ? formatCurrencyRON(value) : value;
      case 'percentage':
        return typeof value === 'number' ? `${value.toFixed(1)}%` : value;
      case 'count':
        return typeof value === 'number' ? value.toLocaleString('ro-RO') : value;
      case 'text':
      default:
        return value;
    }
  };

  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-bold',
  };

  const variantClasses = {
    default: 'text-carbon-900 dark:text-carbon-100',
    success: 'text-copper-600 dark:text-copper-400',
    warning: 'text-amber-600 dark:text-amber-400',
    error: 'text-ruby-600 dark:text-ruby-400',
  };

  return (
    <div className={cn(
      sizeClasses[size],
      variantClasses[variant],
      type === 'amount' || type === 'count' ? 'font-mono tabular-nums' : ''
    )}>
      {formatValue()}
    </div>
  );
};

// =============================================================================
// MAIN CARD COMPONENT
// =============================================================================

export interface CardComponentProps extends CardProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  data?: FinancialCardData;
  loading?: boolean;
  error?: string | null;
  onClick?: () => void;
  icon?: ReactNode;
  actions?: ReactNode;
}

export const Card: React.FC<CardComponentProps> = ({
  title,
  subtitle,
  children,
  className,
  variant = 'default',
  size = 'md',
  data,
  loading = false,
  error = null,
  onClick,
  icon,
  actions,
  ...props
}) => {
  // =============================================================================
  // LOADING STATE
  // =============================================================================
  
  if (loading) {
    return (
      <div className={cn(card({ variant, size }), className)} {...props}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-carbon-200 rounded dark:bg-carbon-700"></div>
          <div className="h-8 bg-carbon-200 rounded dark:bg-carbon-700"></div>
          <div className="h-3 bg-carbon-200 rounded w-2/3 dark:bg-carbon-700"></div>
        </div>
      </div>
    );
  }

  // =============================================================================
  // ERROR STATE
  // =============================================================================
  
  if (error) {
    return (
      <div className={cn(card({ variant: 'default', size }), 'border-ruby-300', className)} {...props}>
        <div className="text-center py-4">
          <div className="text-ruby-600 dark:text-ruby-400 mb-2">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-sm text-ruby-700 dark:text-ruby-300">{error}</p>
        </div>
      </div>
    );
  }

  // =============================================================================
  // DATA CARD RENDERING
  // =============================================================================
  
  if (data) {
    const cardVariant = data.variant === 'success' ? 'highlight' : 
                        data.variant === 'error' ? 'default' : 
                        variant;

    return (
      <div 
        className={cn(
          card({ variant: cardVariant, size }), 
          onClick || data.onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '',
          className
        )} 
        onClick={onClick || data.onClick}
        data-testid={`financial-card-${data.id}`}
        {...props}
      >
        <div className="space-y-3">
          {/* Header cu titlu și icona */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {(icon || data.icon) && (
                <div className="text-copper-600 dark:text-copper-400">
                  {icon || <span className="text-xl">{data.icon}</span>}
                </div>
              )}
              <h3 className="text-sm font-medium text-carbon-700 dark:text-carbon-300">
                {data.title}
              </h3>
            </div>
            {actions && (
              <div className="text-carbon-500 dark:text-carbon-400">
                {actions}
              </div>
            )}
          </div>

          {/* Valoarea principală */}
          <CardValue 
            value={data.value} 
            type={data.type} 
            variant={data.variant}
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
          />

          {/* Descriere și trend */}
          <div className="space-y-2">
            {data.description && (
              <p className="text-sm text-carbon-600 dark:text-carbon-400">
                {data.description}
              </p>
            )}
            
            {data.trend && (
              <TrendIndicator 
                direction={data.trend.direction}
                value={data.trend.value}
                label={data.trend.label}
                size={size === 'sm' ? 'sm' : 'md'}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // =============================================================================
  // GENERIC CARD RENDERING
  // =============================================================================
  
  return (
    <div 
      className={cn(
        card({ variant, size }), 
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '',
        className
      )} 
      onClick={onClick}
      {...props}
    >
      {(title || subtitle || icon || actions) && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {icon && (
                <div className="text-copper-600 dark:text-copper-400">
                  {icon}
                </div>
              )}
              {title && (
                <h3 className="text-lg font-semibold text-carbon-900 dark:text-carbon-100">
                  {title}
                </h3>
              )}
            </div>
            {actions && (
              <div className="text-carbon-500 dark:text-carbon-400">
                {actions}
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-carbon-600 dark:text-carbon-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
};

// =============================================================================
// EXPORT & TYPES
// =============================================================================

export default Card;

// Re-export types for convenience
export type { FinancialCardData } from '../../../types/financial'; 