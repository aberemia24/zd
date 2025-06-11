/**
 * 🗂️ DATA TABLE CVA - Carbon Design System inspired
 * Componente pentru afișarea datelor tabulare în Budget App
 * Bazat pe Carbon Design System cu adaptări pentru sistemul financiar
 */

import { cva, type VariantProps } from 'class-variance-authority';

// =============================================================================
// DATA TABLE CONTAINER
// =============================================================================
export const dataTableContainer = cva([
  // Base styles - Carbon Design System inspired
  'w-full',
  'bg-surface-base',
  'border',
  'border-border-subtle',
  'rounded-token',
  'overflow-hidden',
  'shadow-token',
  
  // Carbon table styling
  'font-financial-primary',
], {
  variants: {
    size: {
      xs: 'text-sm',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    zebra: {
      true: '[&>table>tbody>tr:nth-child(even)]:bg-surface-subtle',
      false: '',
    },
    border: {
      none: 'border-0',
      subtle: 'border-border-subtle',
      strong: 'border-border-strong',
    },
    interactive: {
      true: 'hover:shadow-hover transition-shadow duration-200',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    zebra: false,
    border: 'subtle',
    interactive: true,
  },
});

// =============================================================================
// DATA TABLE HEADER
// =============================================================================
export const dataTableHeader = cva([
  // Base styles
  'w-full',
  'bg-surface-raised',
  'border-b',
  'border-border-subtle',
  'px-token-lg',
  'py-token-md',
  
  // Typography
  'font-financial-primary',
  'font-semibold',
  'text-text-primary',
], {
  variants: {
    size: {
      xs: 'px-token-sm py-token-xs text-xs',
      sm: 'px-token-md py-token-sm text-sm',
      md: 'px-token-lg py-token-md text-base',
      lg: 'px-token-xl py-token-lg text-lg',
      xl: 'px-token-2xl py-token-xl text-xl',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    size: 'md',
    align: 'left',
  },
});

// =============================================================================
// DATA TABLE (TABLE ELEMENT)
// =============================================================================
export const dataTable = cva([
  // Base table styles
  'w-full',
  'border-collapse',
  'border-spacing-0',
  
  // Font
  'font-financial-primary',
], {
  variants: {
    layout: {
      auto: 'table-auto',
      fixed: 'table-fixed',
    },
  },
  defaultVariants: {
    layout: 'auto',
  },
});

// =============================================================================
// TABLE HEAD
// =============================================================================
export const dataTableHead = cva([
  // Base styles
  'bg-surface-raised',
  'border-b',
  'border-border-subtle',
], {
  variants: {
    sticky: {
      true: 'sticky top-0 z-10',
      false: '',
    },
  },
  defaultVariants: {
    sticky: false,
  },
});

// =============================================================================
// TABLE HEADER CELL
// =============================================================================
export const dataTableHeaderCell = cva([
  // Base styles
  'px-token-lg',
  'py-token-md',
  'text-left',
  'font-semibold',
  'text-text-primary',
  'border-r',
  'border-border-subtle',
  'last:border-r-0',
  
  // Carbon sortable styling
  'group',
  'relative',
], {
  variants: {
    sortable: {
      true: [
        'cursor-pointer',
        'hover:bg-surface-hover',
        'transition-colors',
        'duration-200',
        'select-none',
      ],
      false: '',
    },
    sorted: {
      none: '',
      asc: 'bg-surface-selected text-text-primary',
      desc: 'bg-surface-selected text-text-primary',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    size: {
      xs: 'px-token-sm py-token-xs text-xs',
      sm: 'px-token-md py-token-sm text-sm',
      md: 'px-token-lg py-token-md text-base',
      lg: 'px-token-xl py-token-lg text-lg',
      xl: 'px-token-2xl py-token-xl text-xl',
    },
  },
  defaultVariants: {
    sortable: false,
    sorted: 'none',
    align: 'left',
    size: 'md',
  },
});

// =============================================================================
// SORT INDICATOR
// =============================================================================
export const sortIndicator = cva([
  // Base styles
  'absolute',
  'right-token-sm',
  'top-1/2',
  'transform',
  '-translate-y-1/2',
  'transition-all',
  'duration-200',
  'text-text-secondary',
], {
  variants: {
    direction: {
      none: 'opacity-0 group-hover:opacity-50',
      asc: 'opacity-100 rotate-0 text-text-primary',
      desc: 'opacity-100 rotate-180 text-text-primary',
    },
  },
  defaultVariants: {
    direction: 'none',
  },
});

// =============================================================================
// TABLE BODY
// =============================================================================
export const dataTableBody = cva([
  // Base styles
  'bg-surface-base',
]);

// =============================================================================
// TABLE ROW
// =============================================================================
export const dataTableRow = cva([
  // Base styles
  'border-b',
  'border-border-subtle',
  'last:border-b-0',
  'transition-colors',
  'duration-200',
], {
  variants: {
    interactive: {
      true: [
        'hover:bg-surface-hover',
        'cursor-pointer',
      ],
      false: '',
    },
    selected: {
      true: 'bg-surface-selected',
      false: '',
    },
    expandable: {
      true: 'group',
      false: '',
    },
  },
  defaultVariants: {
    interactive: false,
    selected: false,
    expandable: false,
  },
});

// =============================================================================
// TABLE CELL
// =============================================================================
export const dataTableCell = cva([
  // Base styles
  'px-token-lg',
  'py-token-md',
  'text-text-primary',
  'border-r',
  'border-border-subtle',
  'last:border-r-0',
  'align-top',
], {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    size: {
      xs: 'px-token-sm py-token-xs text-xs',
      sm: 'px-token-md py-token-sm text-sm',
      md: 'px-token-lg py-token-md text-base',
      lg: 'px-token-xl py-token-lg text-lg',
      xl: 'px-token-2xl py-token-xl text-xl',
    },
    numeric: {
      true: 'font-mono text-right tabular-nums',
      false: '',
    },
    truncate: {
      true: 'truncate max-w-0',
      false: '',
    },
  },
  defaultVariants: {
    align: 'left',
    size: 'md',
    numeric: false,
    truncate: false,
  },
});

// =============================================================================
// EXPANSION CELL
// =============================================================================
export const expansionCell = cva([
  // Base styles
  'w-12',
  'px-token-md',
  'py-token-md',
  'text-center',
  'border-r',
  'border-border-subtle',
], {
  variants: {
    size: {
      xs: 'w-8 px-token-sm py-token-xs',
      sm: 'w-10 px-token-sm py-token-sm',
      md: 'w-12 px-token-md py-token-md',
      lg: 'w-14 px-token-lg py-token-lg',
      xl: 'w-16 px-token-xl py-token-xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// =============================================================================
// EXPANSION ICON
// =============================================================================
export const expansionIcon = cva([
  // Base styles
  'w-4',
  'h-4',
  'text-text-secondary',
  'transition-transform',
  'duration-200',
  'cursor-pointer',
  'hover:text-text-primary',
], {
  variants: {
    expanded: {
      true: 'rotate-90',
      false: 'rotate-0',
    },
  },
  defaultVariants: {
    expanded: false,
  },
});

// =============================================================================
// SELECTION CELL
// =============================================================================
export const selectionCell = cva([
  // Base styles
  'w-12',
  'px-token-md',
  'py-token-md',
  'text-center',
  'border-r',
  'border-border-subtle',
], {
  variants: {
    size: {
      xs: 'w-8 px-token-sm py-token-xs',
      sm: 'w-10 px-token-sm py-token-sm',
      md: 'w-12 px-token-md py-token-md',
      lg: 'w-14 px-token-lg py-token-lg',
      xl: 'w-16 px-token-xl py-token-xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// =============================================================================
// EMPTY STATE
// =============================================================================
export const dataTableEmptyState = cva([
  // Base styles
  'py-token-2xl',
  'px-token-lg',
  'text-center',
  'text-text-secondary',
  'bg-surface-base',
], {
  variants: {
    size: {
      xs: 'py-token-lg px-token-md text-xs',
      sm: 'py-token-xl px-token-lg text-sm',
      md: 'py-token-2xl px-token-lg text-base',
      lg: 'py-token-3xl px-token-xl text-lg',
      xl: 'py-token-4xl px-token-2xl text-xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// =============================================================================
// TOOLBAR
// =============================================================================
export const dataTableToolbar = cva([
  // Base styles
  'flex',
  'items-center',
  'justify-between',
  'gap-token-md',
  'px-token-lg',
  'py-token-md',
  'bg-surface-raised',
  'border-b',
  'border-border-subtle',
], {
  variants: {
    size: {
      xs: 'px-token-sm py-token-xs gap-token-sm',
      sm: 'px-token-md py-token-sm gap-token-sm',
      md: 'px-token-lg py-token-md gap-token-md',
      lg: 'px-token-xl py-token-lg gap-token-lg',
      xl: 'px-token-2xl py-token-xl gap-token-xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// =============================================================================
// PAGINATION
// =============================================================================
export const dataTablePagination = cva([
  // Base styles
  'flex',
  'items-center',
  'justify-between',
  'gap-token-md',
  'px-token-lg',
  'py-token-md',
  'bg-surface-raised',
  'border-t',
  'border-border-subtle',
], {
  variants: {
    size: {
      xs: 'px-token-sm py-token-xs gap-token-sm text-xs',
      sm: 'px-token-md py-token-sm gap-token-sm text-sm',
      md: 'px-token-lg py-token-md gap-token-md text-base',
      lg: 'px-token-xl py-token-lg gap-token-lg text-lg',
      xl: 'px-token-2xl py-token-xl gap-token-xl text-xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================
export type DataTableContainerProps = VariantProps<typeof dataTableContainer>;
export type DataTableHeaderProps = VariantProps<typeof dataTableHeader>;
export type DataTableProps = VariantProps<typeof dataTable>;
export type DataTableHeadProps = VariantProps<typeof dataTableHead>;
export type DataTableHeaderCellProps = VariantProps<typeof dataTableHeaderCell>;
export type SortIndicatorProps = VariantProps<typeof sortIndicator>;
export type DataTableBodyProps = VariantProps<typeof dataTableBody>;
export type DataTableRowProps = VariantProps<typeof dataTableRow>;
export type DataTableCellProps = VariantProps<typeof dataTableCell>;
export type ExpansionCellProps = VariantProps<typeof expansionCell>;
export type ExpansionIconProps = VariantProps<typeof expansionIcon>;
export type SelectionCellProps = VariantProps<typeof selectionCell>;
export type DataTableEmptyStateProps = VariantProps<typeof dataTableEmptyState>;
export type DataTableToolbarProps = VariantProps<typeof dataTableToolbar>;
export type DataTablePaginationProps = VariantProps<typeof dataTablePagination>; 
