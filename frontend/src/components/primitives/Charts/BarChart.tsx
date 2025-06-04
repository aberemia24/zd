/**
 * 📊 BAR CHART COMPONENT - Task 8.3
 * Componentă pentru chart-uri în bare cu Recharts și Carbon Design System styling
 */

import React, { useCallback, useMemo } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import {
  formatChartCurrency,
  formatChartPercentage,
  DEFAULT_CHART_THEME,
} from '../../../utils/charts';
import type { BarChartProps } from '../../../types/charts';
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

export const BarChart: React.FC<BarChartProps> = ({
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
  orientation = 'vertical',
  barSize = 32,
  stackedBars = false,
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
  
  const barColors = useMemo(() => {
    if (colors) return colors;
    
    // Generează culori automat pentru fiecare yAxisKey
    const defaultColors: Record<string, string> = {};
    yAxisKeys.forEach((key, index) => {
      defaultColors[key] = theme.colors.accent[index % theme.colors.accent.length];
    });
    
    return defaultColors;
  }, [colors, yAxisKeys, theme.colors.accent]);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  const handleBarClick = useCallback((data: any, index: number) => {
    if (onDataPointClick) {
      onDataPointClick(data, index);
    }
  }, [onDataPointClick]);

  const handleBarHover = useCallback((data: any, index: number) => {
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
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between space-x-3 mb-1">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700 capitalize">
                {entry.dataKey.replace(/([A-Z])/g, ' $1').trim()}
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

  if (!data || data.length === 0) {
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
          <RechartsBarChart
            data={data}
            margin={{
              top: theme.spacing.margin,
              right: theme.spacing.margin,
              bottom: theme.spacing.margin,
              left: theme.spacing.margin,
            }}
            onClick={handleBarClick}
            onMouseMove={handleBarHover}
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

            {yAxisKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={barColors[key]}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
                maxBarSize={barSize}
                animationDuration={animations ? theme.animations.duration : 0}
                stackId={stackedBars ? 'stack' : undefined}
                radius={[2, 2, 0, 0]} // Rounded top corners
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// =============================================================================
// EXPORT & TYPES
// =============================================================================

export default BarChart;

// Re-export types for convenience
export type { BarChartProps } from '../../../types/charts'; 