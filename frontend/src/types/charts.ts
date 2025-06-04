/**
 * 📊 CHART TYPES - Task 8.3  
 * Tipuri TypeScript pentru componentele de chart-uri financiare cu Recharts
 */

import { TransactionType } from '@shared-constants';

// =============================================================================
// CORE CHART DATA TYPES
// =============================================================================

export interface ChartDataPoint {
  id: string;
  label: string;
  value: number;
  color?: string;
  category?: string;
  date?: Date;
  type?: TransactionType;
}

export interface TimeSeriesDataPoint {
  date: string; // ISO string format pentru Recharts
  timestamp: number;
  income: number;
  expenses: number;
  balance: number;
  net: number; // income - expenses
}

export interface CategoryDataPoint {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  transactionCount: number;
  subcategories?: SubcategoryDataPoint[];
}

export interface SubcategoryDataPoint {
  subcategory: string;
  amount: number;
  percentage: number;
  color: string;
  transactionCount: number;
}

export interface MonthlyComparisonDataPoint {
  month: string;
  year: number;
  monthName: string;
  income: number;
  expenses: number;
  savings: number;
  balance: number;
}

// =============================================================================
// CHART CONFIGURATION TYPES
// =============================================================================

export interface BaseChartProps {
  title?: string;
  subtitle?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  loading?: boolean;
  error?: string | null;
  onDataPointClick?: (dataPoint: any, index: number) => void;
  onDataPointHover?: (dataPoint: any, index: number) => void;
  showTooltip?: boolean;
  showLegend?: boolean;
  showGridLines?: boolean;
  animations?: boolean;
}

export interface LineChartProps extends BaseChartProps {
  data: TimeSeriesDataPoint[];
  xAxisKey: keyof TimeSeriesDataPoint;
  yAxisKeys: (keyof TimeSeriesDataPoint)[];
  colors?: Record<string, string>;
  strokeWidth?: number;
  dotSize?: number;
  showArea?: boolean;
  areaOpacity?: number;
}

export interface BarChartProps extends BaseChartProps {
  data: CategoryDataPoint[] | MonthlyComparisonDataPoint[];
  xAxisKey: string;
  yAxisKeys: string[];
  colors?: Record<string, string>;
  orientation?: 'horizontal' | 'vertical';
  barSize?: number;
  stackedBars?: boolean;
}

export interface PieChartProps extends BaseChartProps {
  data: CategoryDataPoint[];
  valueKey: keyof CategoryDataPoint;
  labelKey: keyof CategoryDataPoint;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
  showPercentages?: boolean;
  centerText?: string;
}

// =============================================================================
// CHART THEME TYPES 
// =============================================================================

export interface ChartTheme {
  colors: {
    primary: string;
    secondary: string;
    income: string;
    expense: string;
    savings: string;
    neutral: string;
    grid: string;
    text: string;
    background: string;
    accent: string[];
  };
  fonts: {
    family: string;
    sizes: {
      title: number;
      subtitle: number;
      axis: number;
      legend: number;
      tooltip: number;
    };
  };
  spacing: {
    margin: number;
    padding: number;
    gap: number;
  };
  animations: {
    duration: number;
    easing: string;
  };
}

// =============================================================================
// INTERACTIVE FEATURES TYPES
// =============================================================================

export interface ChartTooltipData {
  label: string;
  value: number | string;
  color: string;
  unit?: string;
  formatted?: string;
}

export interface ChartLegendItem {
  value: string;
  color: string;
  inactive?: boolean;
  onClick?: () => void;
}

export interface ChartZoomState {
  startIndex: number;
  endIndex: number;
  domain: [number, number];
}

export interface ChartSelection {
  selectedItems: Set<string>;
  selectedRange?: {
    start: Date;
    end: Date;
  };
}

// =============================================================================
// EXPORT AND PRINT TYPES
// =============================================================================

export type ChartExportFormat = 'png' | 'svg' | 'pdf' | 'csv';

export interface ChartExportOptions {
  format: ChartExportFormat;
  filename: string;
  quality?: number; // for PNG (0-1)
  width?: number;
  height?: number;
  includeTitle?: boolean;
  includeData?: boolean; // for CSV export
}

// =============================================================================
// CHART CONTAINER TYPES
// =============================================================================

export interface ChartContainerProps {
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  exportOptions?: ChartExportOptions;
  fullScreenMode?: boolean;
  onToggleFullScreen?: () => void;
}

// =============================================================================
// RESPONSIVE BEHAVIOR TYPES
// =============================================================================

export interface ChartResponsiveConfig {
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  adaptations: {
    mobile: Partial<BaseChartProps>;
    tablet: Partial<BaseChartProps>;
    desktop: Partial<BaseChartProps>;
  };
}

// =============================================================================
// FINANCIAL ANALYSIS TYPES
// =============================================================================

export interface BudgetAnalysisData {
  period: {
    start: Date;
    end: Date;
    label: string;
  };
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number; // percentage
  expensesByCategory: CategoryDataPoint[];
  incomeByCategory: CategoryDataPoint[];
  monthlyTrends: TimeSeriesDataPoint[];
  budgetVsActual?: {
    category: string;
    budgeted: number;
    actual: number;
    variance: number;
    variancePercentage: number;
  }[];
}

export interface TrendAnalysisData {
  direction: 'increasing' | 'decreasing' | 'stable';
  changePercentage: number;
  changeAmount: number;
  confidence: number; // 0-1
  timeframe: string;
} 