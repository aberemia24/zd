/**
 * 🎨 DOMAIN MODULE - Carbon Copper Design System
 * Barrel exports pentru componente specifice business-ului
 */

// Financial Components
export { 
  balanceDisplay, 
  transactionForm, 
  categoryBadge, 
  amountInput 
} from './financial';
export type { 
  BalanceDisplayProps, 
  TransactionFormProps, 
  CategoryBadgeProps, 
  AmountInputProps 
} from './financial';

// Dashboard Components
export { 
  dashboard, 
  dashboardWidget, 
  dashboardMetric, 
  dashboardHeader 
} from './dashboard';
export type { 
  DashboardProps, 
  DashboardWidgetProps, 
  DashboardMetricProps, 
  DashboardHeaderProps 
} from './dashboard';

// Theme Components
export { 
  themeToggle, 
  themeIndicator, 
  themePreference 
} from './theme-toggle';
export type { 
  ThemeToggleProps, 
  ThemeIndicatorProps, 
  ThemePreferenceProps 
} from './theme-toggle'; 