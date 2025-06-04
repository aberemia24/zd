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
  toastCloseButton
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
  ToastCloseButtonProps
} from './feedback';

// Layout - extins cu list components
export { card, list, listItem, flex, formGroup } from './layout';
export type { CardProps, ListProps, ListItemProps, FlexProps, FormGroupProps } from './layout'; 