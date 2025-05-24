import { cva, type VariantProps } from "class-variance-authority";

/**
 * DISPLAY.TS - Componente de afișare date și category management cu CVA
 * Migrare de la componentMap cu Professional Blue Palette
 * 
 * Migration Mapping:
 * - dataComponents.ts → table display, pagination, sorting
 * - category.ts → category management, modal, dialog components
 */

// =============================================================================
// TABLE DISPLAY COMPONENTS - Migrated from dataComponents.ts
// =============================================================================

export const tableContainer = cva(
  [
    "overflow-x-auto rounded-lg bg-white border border-gray-100",
    "transition-shadow duration-150"
  ],
  {
    variants: {
      variant: {
        default: "shadow-sm",
        elevated: "shadow-md",
        bordered: "border-gray-200"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export const dataTable = cva(
  "min-w-full divide-y divide-gray-200",
  {
    variants: {
      variant: {
        default: "",
        striped: "[&>tbody>*:nth-child(odd)]:bg-gray-50",
        bordered: "border-collapse border border-gray-200 [&>*>tr>*]:border [&>*>tr>*]:border-gray-200",
        hoverable: "[&>tbody>tr:hover]:bg-blue-50"
      }
    },
    defaultVariants: {
      variant: "hoverable"
    }
  }
);

export const tableHeader = cva(
  [
    "bg-gray-50 text-left text-xs font-medium text-gray-500",
    "uppercase tracking-wider py-3 px-4",
    "transition-colors duration-150",
    "first:rounded-tl-lg last:rounded-tr-lg"
  ],
  {
    variants: {
      sortable: {
        true: "cursor-pointer hover:bg-gray-100"
      }
    }
  }
);

export const tableCell = cva(
  [
    "px-4 py-3 whitespace-nowrap text-sm text-gray-900",
    "transition-colors duration-150"
  ],
  {
    variants: {
      variant: {
        default: "",
        clickable: "hover:bg-gray-50 cursor-pointer",
        numeric: "text-right tabular-nums"
      },
      editability: {
        editable: [
          "hover:bg-blue-50 cursor-text",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
          "active:bg-blue-100 transition-all duration-150"
        ],
        readonly: [
          "bg-slate-50/50 text-slate-600 cursor-default",
          "hover:bg-slate-100/50",
          "font-medium transition-all duration-150"
        ],
        category: [
          "bg-slate-50 text-slate-700 font-semibold cursor-default",
          "border-l-4 border-l-blue-500 pl-6",
          "hover:bg-slate-100 transition-all duration-150"
        ]
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export const tableRow = cva(
  [
    "transition-colors duration-150"
  ],
  {
    variants: {
      variant: {
        default: "even:bg-gray-50/30",
        hoverable: "hover:bg-blue-50 cursor-pointer",
        clickable: "hover:bg-blue-50 cursor-pointer"
      },
      state: {
        active: "bg-blue-50",
        selected: "bg-blue-100 hover:bg-blue-100"
      },
      editability: {
        editable: [
          "bg-white border border-slate-200",
          "hover:bg-blue-50 hover:border-blue-500 hover:shadow-sm",
          "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20",
          "cursor-pointer transition-all duration-150"
        ],
        readonly: [
          "bg-slate-50 border border-slate-200 border-l-4 border-l-blue-500",
          "hover:bg-slate-100 hover:border-slate-300",
          "cursor-default text-slate-600 font-semibold",
          "transition-all duration-150"
        ]
      }
    },
    defaultVariants: {
      variant: "hoverable"
    }
  }
);

export const tablePagination = cva(
  "flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 bg-gray-50"
);

export const tablePageButton = cva(
  [
    "relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md",
    "transition-all duration-150",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
  ],
  {
    variants: {
      variant: {
        active: "bg-blue-50 text-blue-600 cursor-default",
        default: "text-gray-500 hover:bg-gray-100 active:bg-gray-200",
        disabled: "text-gray-300 cursor-not-allowed"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export const tableSortIcon = cva(
  "w-4 h-4 ml-1 transition-transform duration-150",
  {
    variants: {
      direction: {
        asc: "text-gray-500",
        desc: "text-gray-500 transform rotate-180",
        none: "text-gray-300 opacity-0 group-hover:opacity-100"
      }
    },
    defaultVariants: {
      direction: "none"
    }
  }
);

// =============================================================================
// CATEGORY MANAGEMENT - Migrated from category.ts
// =============================================================================

export const categoryContainer = cva(
  [
    "relative w-full rounded-lg",
    "transition-shadow duration-150"
  ],
  {
    variants: {
      variant: {
        default: "bg-white shadow-sm",
        bordered: "bg-white border border-gray-200",
        compact: "max-w-md mx-auto"
      },
      scrollable: {
        true: "overflow-y-auto"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export const categoryList = cva(
  "divide-y divide-gray-100",
  {
    variants: {
      variant: {
        default: "bg-white rounded-lg",
        compact: "text-sm",
        grid: "grid grid-cols-1 md:grid-cols-2 gap-4 divide-y-0"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export const categoryItem = cva(
  [
    "p-4 flex items-center justify-between",
    "transition-colors duration-150"
  ],
  {
    variants: {
      variant: {
        default: "hover:bg-gray-50",
        compact: "p-2 py-2 px-4",
        active: "bg-blue-50 text-blue-700"
      },
      state: {
        selected: "bg-blue-50 border-l-4 border-blue-500",
        disabled: "opacity-50 pointer-events-none"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export const categoryHeader = cva(
  "font-medium mb-4",
  {
    variants: {
      variant: {
        default: "text-lg text-gray-800",
        accent: "text-lg text-blue-700",
        section: "text-lg font-semibold text-blue-700 border-b border-gray-200 pb-2"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export const categoryBadge = cva(
  [
    "ml-2 text-xs rounded-full px-2 py-1",
    "transition-colors duration-150"
  ],
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700",
        custom: "bg-emerald-100 text-emerald-700",
        count: "bg-blue-100 text-blue-700"
      },
      pulse: {
        true: "animate-pulse"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export const categoryActionButton = cva(
  [
    "ml-2 text-xs rounded px-2 py-1",
    "transition-all duration-150",
    "focus:outline-none focus:ring-2 focus:ring-offset-1"
  ],
  {
    variants: {
      variant: {
        edit: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        delete: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        confirm: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
        cancel: "bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500"
      }
    },
    defaultVariants: {
      variant: "edit"
    }
  }
);

export const categoryAddForm = cva(
  "mt-4 flex items-center gap-2",
  {
    variants: {
      variant: {
        default: "mt-6 p-2 border-t border-gray-200 pt-6 gap-2",
        compact: "flex-col items-start"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

// =============================================================================
// MODAL & DIALOG COMPONENTS
// =============================================================================

export const categoryDialog = cva(
  [
    "p-4 bg-white rounded-lg shadow-lg",
    "transition-all duration-150"
  ],
  {
    variants: {
      variant: {
        default: "",
        warning: "border-l-4 border-yellow-500 bg-yellow-50",
        danger: "border-l-4 border-red-500 bg-red-50",
        info: "border-l-4 border-blue-500 bg-blue-50"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export const modalContainer = cva(
  [
    "rounded-lg shadow-lg max-w-4xl mx-auto mt-10",
    "transition-all duration-300 ease-in-out transform"
  ],
  {
    variants: {
      variant: {
        default: "bg-white",
        bordered: "bg-white border border-gray-200"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export const modalHeader = cva(
  [
    "border-b border-gray-200 rounded-t-lg p-6",
    "transition-colors duration-150"
  ],
  {
    variants: {
      variant: {
        default: "bg-gray-50",
        primary: "bg-blue-50",
        secondary: "bg-gray-50"
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
);

export const modalTitle = cva(
  "font-bold text-blue-700",
  {
    variants: {
      size: {
        default: "text-xl",
        large: "text-2xl"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
);

export const modalCloseButton = cva(
  [
    "text-2xl transition-colors duration-150",
    "hover:text-red-600"
  ],
  {
    variants: {
      variant: {
        default: "",
        rounded: "rounded-full"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export const modalBody = cva(
  "bg-white",
  {
    variants: {
      padding: {
        default: "p-6",
        large: "p-8"
      }
    },
    defaultVariants: {
      padding: "default"
    }
  }
);

// =============================================================================
// FLEX UTILITIES
// =============================================================================

export const flexGroup = cva(
  "flex",
  {
    variants: {
      justify: {
        between: "justify-between",
        center: "justify-center", 
        start: "justify-start",
        end: "justify-end"
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end"
      },
      gap: {
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6"
      }
    },
    defaultVariants: {
      justify: "between",
      align: "start",
      gap: "md"
    }
  }
);

export const cardSection = cva(
  [
    "w-1/2 border border-gray-200 rounded-lg p-6 shadow-sm",
    "transition-shadow duration-150"
  ],
  {
    variants: {
      variant: {
        default: "",
        hoverable: "hover:shadow-md"
      }
    },
    defaultVariants: {
      variant: "hoverable"
    }
  }
);

// =============================================================================
// TYPE EXPORTS pentru TypeScript autocomplete
// =============================================================================

export type TableContainerProps = VariantProps<typeof tableContainer>;
export type DataTableProps = VariantProps<typeof dataTable>;
export type TableHeaderProps = VariantProps<typeof tableHeader>;
export type TableCellProps = VariantProps<typeof tableCell>;
export type TableRowProps = VariantProps<typeof tableRow>;
export type TablePageButtonProps = VariantProps<typeof tablePageButton>;
export type TableSortIconProps = VariantProps<typeof tableSortIcon>;
export type CategoryContainerProps = VariantProps<typeof categoryContainer>;
export type CategoryListProps = VariantProps<typeof categoryList>;
export type CategoryItemProps = VariantProps<typeof categoryItem>;
export type CategoryHeaderProps = VariantProps<typeof categoryHeader>;
export type CategoryBadgeProps = VariantProps<typeof categoryBadge>;
export type CategoryActionButtonProps = VariantProps<typeof categoryActionButton>;
export type CategoryAddFormProps = VariantProps<typeof categoryAddForm>;
export type CategoryDialogProps = VariantProps<typeof categoryDialog>;
export type ModalContainerProps = VariantProps<typeof modalContainer>;
export type ModalHeaderProps = VariantProps<typeof modalHeader>;
export type ModalTitleProps = VariantProps<typeof modalTitle>;
export type ModalCloseButtonProps = VariantProps<typeof modalCloseButton>;
export type ModalBodyProps = VariantProps<typeof modalBody>;
export type FlexGroupProps = VariantProps<typeof flexGroup>;
export type CardSectionProps = VariantProps<typeof cardSection>; 