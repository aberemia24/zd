/**
 * CVA STYLING SYSTEM - Main exports
 *
 * Sistem de stilizare modern bazat pe Class Variance Authority
 * Înlocuiește sistemul componentMap cu:
 * - Professional Blue Palette
 * - CVA pentru type safety și performance
 * - Logical domain grouping
 * - 100% capability preservation
 */

// Components domain (forms, feedback, layout)
export * from "./components";

// Grid domain (grid-specific components și effects)
export * from "./grid";

// Data domain (display components, category styling)
export * from "./data";

// Shared utilities (cn function, effects, helpers)
export * from "./shared";

/**
 * Quick access to common components
 * For convenience și backward compatibility
 */

// Forms & Actions (17 exports)
export {
  button,
  buttonGroup,
  input,
  inputWrapper,
  select,
  textarea,
  checkbox,
  label,
  type ButtonProps,
  type ButtonGroupProps,
  type InputProps,
  type SelectProps,
  type TextareaProps,
  type CheckboxProps,
  type LabelProps,
} from "./components/forms";

// Feedback & Utilities (18 exports)
export {
  badge,
  alert,
  toast,
  dropdown,
  dropdownItem,
  loader,
  pill,
  formGroup,
  formError,
  glassEffect,
  type BadgeProps,
  type AlertProps,
  type ToastProps,
  type DropdownProps,
  type DropdownItemProps,
  type LoaderProps,
  type PillProps,
  type FormGroupProps,
  type GlassEffectProps,
} from "./components/feedback";

// Layout & Navigation (22 exports)
export {
  card,
  cardHeader,
  cardBody,
  cardFooter,
  modal,
  modalContent,
  container,
  grid,
  flex,
  divider,
  tab,
  navbar,
  sidebar,
  breadcrumb,
  breadcrumbItem,
  pagination,
  paginationItem,
  type CardProps,
  type ModalProps,
  type ModalContentProps,
  type ContainerProps,
  type GridProps,
  type FlexProps,
  type DividerProps,
  type TabProps,
  type NavbarProps,
  type SidebarProps,
  type BreadcrumbItemProps,
  type PaginationItemProps,
} from "./components/layout";

// Grid Excel-like Components (17 exports)
export {
  gridContainer,
  gridTable,
  gridHeader,
  gridHeaderCell,
  gridCategoryRow,
  gridSubcategoryRow,
  gridTotalRow,
  gridCell,
  gridExpandIcon,
  gridCellActions,
  gridActionButton,
  gridPopover,
  gridMessage,
  gridActionGroup,
  gridOverlay,
  type GridContainerProps,
  type GridTableProps,
  type GridHeaderProps,
  type GridHeaderCellProps,
  type GridCategoryRowProps,
  type GridSubcategoryRowProps,
  type GridTotalRowProps,
  type GridCellProps,
  type GridExpandIconProps,
  type GridCellActionsProps,
  type GridActionButtonProps,
  type GridPopoverProps,
  type GridMessageProps,
  type GridActionGroupProps,
  type GridOverlayProps,
} from "./grid/grid";

// Data Display & Category Management (20 exports)
export {
  tableContainer,
  dataTable,
  tableHeader,
  tableCell,
  tableRow,
  tablePagination,
  tablePageButton,
  tableSortIcon,
  categoryContainer,
  categoryList,
  categoryItem,
  categoryHeader,
  categoryBadge,
  categoryActionButton,
  categoryAddForm,
  categoryDialog,
  modalContainer,
  modalHeader,
  modalTitle,
  modalCloseButton,
  modalBody,
  flexGroup,
  cardSection,
  type TableContainerProps,
  type DataTableProps,
  type TableHeaderProps,
  type TableCellProps,
  type TableRowProps,
  type TablePageButtonProps,
  type TableSortIconProps,
  type CategoryContainerProps,
  type CategoryListProps,
  type CategoryItemProps,
  type CategoryHeaderProps,
  type CategoryBadgeProps,
  type CategoryActionButtonProps,
  type CategoryAddFormProps,
  type CategoryDialogProps,
  type ModalContainerProps,
  type ModalHeaderProps,
  type ModalTitleProps,
  type ModalCloseButtonProps,
  type ModalBodyProps,
  type FlexGroupProps,
  type CardSectionProps,
} from "./data/display";

// Core utilities
export { cn } from "./shared/utils";
