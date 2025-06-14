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
export { default as Checkbox } from './Checkbox/Checkbox';
export { default as FormGroup } from './FormGroup/FormGroup';
export { default as FormLabel } from './FormLabel/FormLabel';
export { default as Input } from './Input/Input';
export { default as Select } from './Select/Select';
export { default as Textarea } from './Textarea/Textarea';

// Feedback Components
export { default as Alert } from './Alert/Alert';
export { default as Badge } from './Badge/Badge';
export { Toast, ToastContainer, ToastProvider, useToast, useToastPosition } from './Toast';

// Loading Components
export { default as Loader } from './Loader/Loader';
export { default as Spinner } from './Spinner/Spinner';

// Navigation Components
export { Breadcrumb, useBreadcrumb, useBreadcrumbNavigation } from './Breadcrumb';
export { CommandPalette, CommandPaletteProvider, useCommandPalette } from './CommandPalette';
export { ContextMenu, useContextMenu } from './ContextMenu';
export { Dropdown, useDropdown } from './Dropdown';
export { default as NavLink } from './NavLink/NavLink';
export { Pagination, usePagination } from './Pagination';
export { Sidebar, SidebarItem } from './Sidebar';
export { TabButton, TabList, TabPanel, Tabs, useTabContext, useTabs, useTabsKeyboardIntegration } from './Tabs';

// Modal Components
export { default as ConfirmationModal } from './ConfirmationModal/ConfirmationModal';
export { Modal, ModalBody, ModalFooter, ModalHeader, useModal, useModalContext } from './Modal';

// UI Components
export { default as ThemeToggle } from './ThemeToggle/ThemeToggle';

// Data Display Components
export { default as Table } from './Table/Table';

// Layout Components
export { default as Container } from './Container/Container';
export { default as FlexLayout } from './FlexLayout/FlexLayout';
export { default as Grid } from './Grid/Grid';
export { default as Section } from './Section/Section';
export { default as StackLayout } from './StackLayout/StackLayout';

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
export type { AlertProps } from './Alert/Alert';
export type { BadgeProps } from './Badge/Badge';
export type { BreadcrumbItem, BreadcrumbProps } from './Breadcrumb';
export type { ButtonProps } from './Button/Button';
export type { CheckboxProps } from './Checkbox/Checkbox';
export type { CommandAction, CommandPaletteProps, CommandPaletteProviderProps } from './CommandPalette';
export type { ConfirmationModalProps } from './ConfirmationModal/ConfirmationModal';
export type { ContextMenuOption, ContextMenuProps, ContextMenuState } from './ContextMenu';
export type { DropdownItem, DropdownProps } from './Dropdown';
export type { FormGroupProps } from './FormGroup/FormGroup';
export type { FormLabelProps } from './FormLabel/FormLabel';
export type { InputProps } from './Input/Input';
export type { LoaderProps } from './Loader/Loader';
export type { PaginationProps } from './Pagination';
export type { SelectOption, SelectProps } from './Select/Select';
export type { SidebarItemProps, SidebarProps } from './Sidebar';
export type { SpinnerProps } from './Spinner/Spinner';
export type { TabButtonProps, TabItem, TabListProps, TabPanelProps, TabsProps } from './Tabs';
export type { TextareaProps } from './Textarea/Textarea';
export type { ToastData, ToastPosition, ToastProps, ToastProviderProps, ToastVariant, UseToastReturn } from './Toast';

// Layout Component Types
export type { ContainerProps } from './Container/Container';
export type { FlexLayoutProps } from './FlexLayout/FlexLayout';
export type { GridProps } from './Grid/Grid';
export type { SectionProps } from './Section/Section';
export type { StackLayoutProps } from './StackLayout/StackLayout';

// Data Display Component Types
export type { TableColumn, TableProps } from './Table/Table';

// New data display types
export type { CardComponentProps, FinancialCardData } from './Card';
export type { CategoryListItem, FinancialListItem, ListComponentProps } from './List';

// New chart types
export type {
    BarChartProps, CategoryDataPoint, ChartDataPoint, LineChartProps,
    PieChartProps, TimeSeriesDataPoint
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

// Primitives exports
export * from './Alert';
export * from './Badge';
export * from './Breadcrumb';
export * from './Button';
export * from './Card';
export * from './Charts';
export * from './Checkbox';
export * from './CommandPalette';
export * from './ConfirmationModal';
export * from './Container';
export * from './ContextMenu';
export * from './Dropdown';
export * from './FieldGrid';
export * from './FlexLayout';
export * from './FormLayout';
export * from './Grid';
export * from './Input';
export * from './List';
export * from './Loader';
export * from './Modal';
export * from './NavLink';
export * from './Pagination';
export * from './Popover';
export * from './PreferenceToggle';
export * from './Section';
export * from './Select';
export * from './Sidebar';
export * from './SimpleModal';
export * from './Spinner';
export * from './StackLayout';
export * from './Table';
export * from './Tabs';
export * from './Textarea';
export * from './ThemeToggle';
export * from './Toast';

