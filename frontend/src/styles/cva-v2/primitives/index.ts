/**
 * 🎨 PRIMITIVES MODULE - Carbon Copper Design System
 * Barrel exports pentru componente primitive de bază
 */

// Button
export { button } from './button';
export type { ButtonProps } from './button';

// Inputs
export { input, select, textarea, checkbox } from './inputs';
export type { InputProps, SelectProps, TextareaProps, CheckboxProps } from './inputs';

// Feedback
export { 
  badge, 
  label, 
  inputWrapper,
  tooltip,
  progressContainer,
  progressBar,
  progressLabel,
  toastContainer,
  toast,
  toastIcon,
  toastContent,
  toastTitle,
  toastDescription,
  toastCloseButton,
  dropdown,
  dropdownItem
} from './feedback';
export type { 
  BadgeProps, 
  LabelProps, 
  InputWrapperProps,
  TooltipProps,
  ProgressContainerProps,
  ProgressBarProps,
  ProgressLabelProps,
  ToastContainerProps,
  ToastProps,
  ToastIconProps,
  ToastCloseButtonProps,
  DropdownProps,
  DropdownItemProps
} from './feedback';

// Layout - extins cu list components
  export { 
    card, 
    cardHeader, 
    list, 
    listItem, 
    flex, 
    formGroup, 
    simpleTable, 
    tableHeader, 
    tableCell,
    spacingMargin,
    spaceY,
    loadingOverlay
  } from './layout';
  export type { CardProps, CardHeaderProps, ListProps, ListItemProps, FlexProps, FormGroupProps, SimpleTableProps, TableHeaderProps, TableCellProps } from './layout';

// Navigation
export { tab, tabList, tabPanel } from './navigation';
export type { TabProps, TabListProps, TabPanelProps } from './navigation'; 
