/**
 * 🥧 PIE CHART COMPONENT - Task 8.3
 * Componentă pentru chart-uri circulare cu Recharts și Carbon Design System styling
 * Optimizată pentru distribuții financiare și analiza categoriilor
 */

import React, { useCallback, useMemo } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import {
  formatChartCurrency,
  formatChartPercentage,
  DEFAULT_CHART_THEME,
} from '../../../utils/charts';
import type { PieChartProps } from '../../../types/charts';
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

export const PieChart: React.FC<PieChartProps> = ({
  data,
  valueKey,
  labelKey,
  title,
  subtitle,
  width = '100%',
  height = 300,
  className,
  loading = false,
  error = null,
  colors,
  innerRadius = 0,
  outerRadius = 80,
  showLabels = true,
  showPercentages = true,
  centerText,
  showTooltip = true,
  showLegend = true,
  animations = true,
  onDataPointClick,
  onDataPointHover,
}) => {
  // =============================================================================
  // THEME & COLORS
  // =============================================================================

  const theme = DEFAULT_CHART_THEME;
  
  const pieColors = useMemo(() => {
    if (colors && colors.length > 0) return colors;
    
    // Pentru charts financiare, preferăm o paletă de culori consistentă
    return [
      theme.colors.expense,   // Roșu pentru cheltuieli
      theme.colors.income,    // Verde pentru venituri
      theme.colors.primary,   // Albastru principal
      theme.colors.savings,   // Albastru pentru economii
      ...theme.colors.accent, // Restul culorilor din paletă
    ];
  }, [colors, theme.colors]);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  const handlePieClick = useCallback((data: any, index: number) => {
    if (onDataPointClick) {
      onDataPointClick(data, index);
    }
  }, [onDataPointClick]);

  const handlePieHover = useCallback((data: any, index: number) => {
    if (onDataPointHover) {
      onDataPointHover(data, index);
    }
  }, [onDataPointHover]);

  // =============================================================================
  // CUSTOM TOOLTIP
  // =============================================================================

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const value = data[valueKey];
    const label = data[labelKey];
    const percentage = data.percentage || 0;

    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 min-w-[180px]">
        <div className="flex items-center space-x-2 mb-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].color }}
          />
          <span className="font-medium text-gray-900">{label}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Valoare:</span>
            <span className="text-sm font-medium text-gray-900">
              {formatChartCurrency(value)}
            </span>
          </div>
          {showPercentages && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Procent:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatChartPercentage(percentage)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // =============================================================================
  // LABEL RENDERING
  // =============================================================================

  const renderLabel = useCallback((entry: any) => {
    if (!showLabels) return null;
    
    const percentage = entry.percentage || 0;
    
    // Nu afișăm label pentru segmente foarte mici (sub 5%)
    if (percentage < 5) return null;
    
    if (showPercentages) {
      return `${formatChartPercentage(percentage)}`;
    } else {
      return entry[labelKey];
    }
  }, [showLabels, showPercentages, labelKey]);

  // =============================================================================
  // DATA PROCESSING
  // =============================================================================

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Sortăm datele după valoare în ordine descrescătoare
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[valueKey] as number;
      const bValue = b[valueKey] as number;
      return bValue - aValue;
    });
    
    // Calculăm procentele dacă nu sunt deja calculate
    const totalValue = sortedData.reduce((sum, item) => {
      const itemValue = item[valueKey] as number;
      return sum + (itemValue || 0);
    }, 0);
    
    return sortedData.map((item, index) => {
      const itemValue = item[valueKey] as number;
      return {
        ...item,
        percentage: totalValue > 0 ? (itemValue / totalValue) * 100 : 0,
        color: item.color || pieColors[index % pieColors.length],
      };
    });
  }, [data, valueKey, pieColors]);

  // =============================================================================
  // CENTER TEXT FOR DONUT CHARTS
  // =============================================================================

  const CenterLabel = () => {
    if (!centerText || innerRadius === 0) return null;
    
    return (
      <text 
        x="50%" 
        y="50%" 
        textAnchor="middle" 
        dominantBaseline="middle"
        className="fill-current text-gray-700 text-sm font-medium"
      >
        {centerText}
      </text>
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
          <RechartsPieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey={valueKey}
              animationDuration={animations ? theme.animations.duration : 0}
              onClick={handlePieClick}
              onMouseEnter={handlePieHover}
            >
              {processedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                />
              ))}
            </Pie>
            
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            
            {showLegend && (
              <Legend
                wrapperStyle={{
                  fontSize: theme.fonts.sizes.legend,
                  fontFamily: theme.fonts.family,
                }}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color || theme.colors.text }}>
                    {value}
                  </span>
                )}
              />
            )}
            
            <CenterLabel />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// =============================================================================
// EXPORT & TYPES
// =============================================================================

export default PieChart;

// Re-export types for convenience
export type { PieChartProps } from '../../../types/charts'; 