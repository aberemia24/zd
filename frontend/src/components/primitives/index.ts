/**
 * 🎨 PRIMITIVE COMPONENTS - Carbon Copper Design System
 * Componente de bază reutilizabile migrated la CVA v2
 * 
 * Toate componentele folosesc noul sistem cva-v2 modular pentru:
 * - Tree-shaking optimizat
 * - Type safety îmbunătățit
 * - Arhitectură modulară
 * - Mentenanță ușoară
 */

// Form Components
export { default as Button } from './Button/Button';
export { default as Input } from './Input/Input';
export { default as Select } from './Select/Select';
export { default as Textarea } from './Textarea/Textarea';
export { default as Checkbox } from './Checkbox/Checkbox';
export { default as FormLabel } from './FormLabel/FormLabel';
export { default as FormGroup } from './FormGroup/FormGroup';

// Feedback Components
export { default as Badge } from './Badge/Badge';
export { default as Alert } from './Alert/Alert';
export { Toast, ToastContainer, ToastProvider, useToast, useToastPosition } from './Toast';

// Loading Components
export { default as Loader } from './Loader/Loader';
export { default as Spinner } from './Spinner/Spinner';

// Navigation Components
export { default as NavLink } from './NavLink/NavLink';
export { Sidebar, SidebarItem } from './Sidebar';
export { Breadcrumb, useBreadcrumb, useBreadcrumbNavigation } from './Breadcrumb';
export { ContextMenu, useContextMenu } from './ContextMenu';
export { Tabs, TabButton, TabList, TabPanel, useTabs, useTabContext, useTabsKeyboardIntegration } from './Tabs';
export { Dropdown, useDropdown } from './Dropdown';
export { Pagination, usePagination } from './Pagination';
export { CommandPalette, useCommandPalette, CommandPaletteProvider } from './CommandPalette';
export { NavigationStateDemo } from './NavigationStateDemo';

// Modal Components
export { default as ConfirmationModal } from './ConfirmationModal/ConfirmationModal';
export { Modal, ModalHeader, ModalBody, ModalFooter, useModal, useModalContext } from './Modal';

// UI Components
export { default as ThemeToggle } from './ThemeToggle/ThemeToggle';

// Data Display Components
export { default as Table } from './Table/Table';

// Layout Components
export { default as Container } from './Container/Container';
export { default as Grid } from './Grid/Grid';
export { default as FlexLayout } from './FlexLayout/FlexLayout';
export { default as StackLayout } from './StackLayout/StackLayout';
export { default as Section } from './Section/Section';

// New components
export { Card } from './Card';
export { List } from './List';

// Charts Components
export { BarChart, LineChart, PieChart } from './Charts';

// Supporting UI Components
export { default as Tooltip } from './Tooltip/Tooltip';
export type { TooltipProps } from './Tooltip/Tooltip';

export { default as Progress } from './Progress/Progress';
export type { ProgressProps } from './Progress/Progress';

/**
 * Type exports for primitive components
 */
export type { ButtonProps } from './Button/Button';
export type { InputProps } from './Input/Input';
export type { SelectProps, SelectOption } from './Select/Select';
export type { TextareaProps } from './Textarea/Textarea';
export type { CheckboxProps } from './Checkbox/Checkbox';
export type { FormLabelProps } from './FormLabel/FormLabel';
export type { FormGroupProps } from './FormGroup/FormGroup';
export type { BadgeProps } from './Badge/Badge';
export type { AlertProps } from './Alert/Alert';
export type { ToastProps, ToastData, ToastVariant, ToastPosition, UseToastReturn, ToastProviderProps } from './Toast';
export type { SidebarProps, SidebarItemProps } from './Sidebar';
export type { BreadcrumbProps, BreadcrumbItem } from './Breadcrumb';
export type { ContextMenuProps, ContextMenuOption, ContextMenuState } from './ContextMenu';
export type { TabsProps, TabItem, TabButtonProps, TabListProps, TabPanelProps } from './Tabs';
export type { DropdownProps, DropdownItem } from './Dropdown';
export type { PaginationProps } from './Pagination';
export type { CommandPaletteProps, CommandAction, CommandPaletteProviderProps } from './CommandPalette';
export type { LoaderProps } from './Loader/Loader';
export type { SpinnerProps } from './Spinner/Spinner';
export type { ConfirmationModalProps } from './ConfirmationModal/ConfirmationModal';

// Layout Component Types
export type { ContainerProps } from './Container/Container';
export type { GridProps } from './Grid/Grid';
export type { FlexLayoutProps } from './FlexLayout/FlexLayout';
export type { StackLayoutProps } from './StackLayout/StackLayout';
export type { SectionProps } from './Section/Section';

// Data Display Component Types
export type { TableProps, TableColumn } from './Table/Table';

// New data display types
export type { CardComponentProps, FinancialCardData } from './Card';
export type { ListComponentProps, FinancialListItem, CategoryListItem } from './List';

// New chart types
export type { 
  BarChartProps, 
  LineChartProps, 
  PieChartProps,
  ChartDataPoint,
  TimeSeriesDataPoint,
  CategoryDataPoint
} from './Charts';

/**
 * Migration Status: 
 * ✅ Button - migrated to cva-v2
 * ✅ Input - migrated to cva-v2 with enhanced validation
 * ✅ Select - migrated to cva-v2 with dedicated select variant
 * ✅ Textarea - migrated to cva-v2 with character counting
 * ✅ Checkbox - migrated to cva-v2 with enhanced styling
 * ✅ FormLabel - NEW: migrated to cva-v2 with ARIA support
 * ✅ FormGroup - NEW: migrated to cva-v2 with semantic grouping
 * ✅ Badge - migrated to cva-v2 
 * ✅ Alert - migrated to cva-v2 with Carbon Copper palette
 * ✅ Loader - migrated to cva-v2 with overlay support
 * ✅ Spinner - migrated to cva-v2 with Carbon Copper colors
 * ✅ NavLink - migrated to cva-v2 with active states
 * ✅ Sidebar - NEW: migrated to cva-v2 with desktop/mobile variants
 * ✅ Breadcrumb - NEW: migrated to cva-v2 with hierarchical navigation
 * ✅ ContextMenu - NEW: migrated to cva-v2 with keyboard navigation
 * ✅ Tabs - NEW: migrated to cva-v2 with multi-tab support
 * ✅ ConfirmationModal - migrated to cva-v2 with enhanced styling
 * ✅ ThemeToggle - migrated to cva-v2 with display types
 * ✅ Container - NEW: migrated to cva-v2 with responsive width control
 * ✅ Grid - NEW: migrated to cva-v2 with Tailwind grid system
 * ✅ FlexLayout - NEW: migrated to cva-v2 with flexible layouts
 * ✅ StackLayout - NEW: migrated to cva-v2 with vertical/horizontal stacking
 * ✅ Section - NEW: migrated to cva-v2 with consistent page sections
 * ✅ Table - NEW: migrated to cva-v2 with table component
 * ✅ Card - NEW: migrated to cva-v2 with card component
 * ✅ List - NEW: migrated to cva-v2 with list component
 * ✅ BarChart - NEW: migrated to cva-v2 with bar chart component
 * ✅ LineChart - NEW: migrated to cva-v2 with line chart component
 * ✅ PieChart - NEW: migrated to cva-v2 with pie chart component
 * ✅ Toast - NEW: migrated to cva-v2 with toast notification system
 * 
 * 🎉 ALL PRIMITIVE COMPONENTS + FORM COMPONENTS + FEEDBACK COMPONENTS MIGRATED TO CVA-V2!
 */ 