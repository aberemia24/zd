/**
 * 📈 LINE CHART COMPONENT - Task 8.3
 * Componentă pentru chart-uri în linie cu Recharts și Carbon Design System styling
 * Optimizată pentru time-series financiare și trend analysis
 */

import React, { useCallback, useMemo } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ReferenceLine,
} from 'recharts';

import {
  formatChartCurrency,
  formatChartDate,
  DEFAULT_CHART_THEME,
} from '../../../utils/charts';
import type { LineChartProps } from '../../../types/charts';
import { cn } from '../../../styles/cva-v2';

// =============================================================================
// STYLES & THEME CONFIGURATION
// =============================================================================

const chartContainerStyles = cn(
  'w-full h-full',
  'bg-white rounded-lg border border-gray-200',
  'p-4 space-y-4'
);

const titleStyles = cn(
  'text-lg font-semibold text-gray-900',
  'mb-2'
);

const subtitleStyles = cn(
  'text-sm text-gray-600',
  'mb-4'
);

// =============================================================================
// COMPONENT IMPLEMENTATION
// =============================================================================

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xAxisKey,
  yAxisKeys,
  title,
  subtitle,
  width = '100%',
  height = 300,
  className,
  loading = false,
  error = null,
  colors,
  strokeWidth = 2,
  dotSize = 4,
  showArea = false,
  areaOpacity = 0.1,
  showTooltip = true,
  showLegend = true,
  showGridLines = true,
  animations = true,
  onDataPointClick,
  onDataPointHover,
}) => {
  // =============================================================================
  // THEME & COLORS
  // =============================================================================

  const theme = DEFAULT_CHART_THEME;
  
  const lineColors = useMemo(() => {
    if (colors) return colors;
    
    // Generează culori automat pentru fiecare yAxisKey
    const defaultColors: Record<string, string> = {};
    yAxisKeys.forEach((key, index) => {
      const keyStr = String(key);
      // Pentru date financiare, folosim culori specifice
      if (keyStr === 'income') {
        defaultColors[keyStr] = theme.colors.income;
      } else if (keyStr === 'expenses') {
        defaultColors[keyStr] = theme.colors.expense;
      } else if (keyStr === 'balance' || keyStr === 'net') {
        defaultColors[keyStr] = theme.colors.primary;
      } else if (keyStr === 'savings') {
        defaultColors[keyStr] = theme.colors.savings;
      } else {
        defaultColors[keyStr] = theme.colors.accent[index % theme.colors.accent.length];
      }
    });
    
    return defaultColors;
  }, [colors, yAxisKeys, theme.colors]);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  const handleLineClick = useCallback((data: any, index: number) => {
    if (onDataPointClick) {
      onDataPointClick(data, index);
    }
  }, [onDataPointClick]);

  const handleLineHover = useCallback((data: any, index: number) => {
    if (onDataPointHover) {
      onDataPointHover(data, index);
    }
  }, [onDataPointHover]);

  // =============================================================================
  // CUSTOM TOOLTIP
  // =============================================================================

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 min-w-[200px]">
        <p className="font-medium text-gray-900 mb-2">
          {formatChartDate(label, 'medium')}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between space-x-3 mb-1">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700 capitalize">
                {entry.dataKey === 'income' ? 'Venituri' :
                 entry.dataKey === 'expenses' ? 'Cheltuieli' :
                 entry.dataKey === 'balance' ? 'Balanță' :
                 entry.dataKey === 'net' ? 'Net' :
                 entry.dataKey === 'savings' ? 'Economii' :
                 entry.dataKey.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatChartCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // =============================================================================
  // DATA PROCESSING
  // =============================================================================

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Sortăm datele după timestamp pentru a asigura cronologia corectă
    return [...data].sort((a, b) => a.timestamp - b.timestamp);
  }, [data]);

  // =============================================================================
  // REFERENCE LINES (for zero line when dealing with negative values)
  // =============================================================================

  const hasNegativeValues = useMemo(() => {
    return processedData.some(item => 
      yAxisKeys.some(key => (item as any)[key] < 0)
    );
  }, [processedData, yAxisKeys]);

  // =============================================================================
  // LOADING & ERROR STATES
  // =============================================================================

  if (loading) {
    return (
      <div className={cn(chartContainerStyles, className)}>
        {title && <h3 className={titleStyles}>{title}</h3>}
        {subtitle && <p className={subtitleStyles}>{subtitle}</p>}
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Se încarcă graficul...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(chartContainerStyles, className)}>
        {title && <h3 className={titleStyles}>{title}</h3>}
        {subtitle && <p className={subtitleStyles}>{subtitle}</p>}
        <div className="flex items-center justify-center h-64 bg-red-50 rounded border border-red-200">
          <div className="text-center">
            <p className="text-sm text-red-600 mb-2">Eroare la încărcarea graficului</p>
            <p className="text-xs text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.length === 0) {
    return (
      <div className={cn(chartContainerStyles, className)}>
        {title && <h3 className={titleStyles}>{title}</h3>}
        {subtitle && <p className={subtitleStyles}>{subtitle}</p>}
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Nu există date pentru afișare</p>
        </div>
      </div>
    );
  }

  // =============================================================================
  // RENDER CHART
  // =============================================================================

  return (
    <div className={cn(chartContainerStyles, className)} style={{ width, height: 'auto' }}>
      {title && <h3 className={titleStyles}>{title}</h3>}
      {subtitle && <p className={subtitleStyles}>{subtitle}</p>}
      
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={processedData}
            margin={{
              top: theme.spacing.margin,
              right: theme.spacing.margin,
              bottom: theme.spacing.margin,
              left: theme.spacing.margin,
            }}
            onClick={handleLineClick}
            onMouseMove={handleLineHover}
          >
            {showGridLines && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.colors.grid}
                opacity={0.6}
              />
            )}
            
            <XAxis
              dataKey={xAxisKey}
              tick={{ 
                fontSize: theme.fonts.sizes.axis,
                fill: theme.colors.text,
                fontFamily: theme.fonts.family,
              }}
              tickLine={{ stroke: theme.colors.grid }}
              axisLine={{ stroke: theme.colors.grid }}
              tickFormatter={(value) => formatChartDate(value, 'short')}
            />
            
            <YAxis
              tick={{ 
                fontSize: theme.fonts.sizes.axis,
                fill: theme.colors.text,
                fontFamily: theme.fonts.family,
              }}
              tickLine={{ stroke: theme.colors.grid }}
              axisLine={{ stroke: theme.colors.grid }}
              tickFormatter={formatChartCurrency}
            />

            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            
            {showLegend && (
              <Legend
                wrapperStyle={{
                  fontSize: theme.fonts.sizes.legend,
                  fontFamily: theme.fonts.family,
                }}
              />
            )}

            {/* Reference line for zero when we have negative values */}
            {hasNegativeValues && (
              <ReferenceLine 
                y={0} 
                stroke={theme.colors.neutral}
                strokeDasharray="2 2"
                opacity={0.7}
              />
            )}

            {/* Render Areas first (if enabled) for background effect */}
            {showArea && yAxisKeys.map((key, index) => (
              <Area
                key={`area-${key}`}
                type="monotone"
                dataKey={key}
                stroke="none"
                fill={lineColors[key]}
                fillOpacity={areaOpacity}
                animationDuration={animations ? theme.animations.duration : 0}
              />
            ))}

            {/* Render Lines */}
            {yAxisKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={lineColors[String(key)]}
                strokeWidth={strokeWidth}
                dot={{ 
                  r: dotSize, 
                  fill: lineColors[String(key)],
                  strokeWidth: 0,
                }}
                activeDot={{ 
                  r: dotSize + 2, 
                  fill: lineColors[String(key)],
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
                name={String(key) === 'income' ? 'Venituri' :
                     String(key) === 'expenses' ? 'Cheltuieli' :
                     String(key) === 'balance' ? 'Balanță' :
                     String(key) === 'net' ? 'Net' :
                     String(key) === 'savings' ? 'Economii' :
                     String(key).charAt(0).toUpperCase() + String(key).slice(1)}
                animationDuration={animations ? theme.animations.duration : 0}
                connectNulls={false}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// =============================================================================
// EXPORT & TYPES
// =============================================================================

export default LineChart;

// Re-export types for convenience
export type { LineChartProps } from '../../../types/charts'; 