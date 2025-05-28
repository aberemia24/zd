import { cva, type VariantProps } from "class-variance-authority";

/**
 * GRID.TS - Componente Grid Excel-like cu CVA
 * Migrare de la componentMap cu 100% capability preservation
 *
 * Migration Mapping:
 * - grid.ts → gridContainer, gridTable, gridCell variants
 * - table.ts → tableRow, tableHeader, pagination
 *
 * EXCEL-LIKE FEATURES PRESERVED:
 * ✅ Multi-cell selection
 * ✅ Frozen columns/rows (sticky positioning)
 * ✅ Inline editing states
 * ✅ Expandable categories
 * ✅ Cell hover/active/focus states
 * ✅ Sortable headers
 * ✅ Calculate/formula cells
 * ✅ Value type styling (positive/negative)
 */

// =============================================================================
// GRID CONTAINER & TABLE - Foundation
// =============================================================================

export const gridContainer = cva(
  ["overflow-auto rounded-lg h-[600px]", "transition-all duration-150"],
  {
    variants: {
      variant: {
        default: "bg-white shadow-sm",
        bordered: "bg-white border border-gray-200 shadow-sm",
        elevated: "bg-white shadow-md",
      },
      state: {
        loading: "opacity-75",
        error: "border-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const gridTable = cva(
  "w-full text-sm align-middle border-separate border-spacing-0",
  {
    variants: {
      variant: {
        default: "",
        striped: "border-collapse",
        bordered: "border border-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// =============================================================================
// GRID HEADERS - Sticky positioning pentru Excel-like behavior
// =============================================================================

export const gridHeader = cva(
  ["bg-gray-50 sticky top-0 z-10", "transition-colors duration-150"],
  {
    variants: {
      variant: {
        default: "",
        primary: "bg-blue-50",
        bordered: "border-b border-gray-200",
      },
    },
    defaultVariants: {
      variant: "bordered",
    },
  },
);

export const gridHeaderCell = cva(
  [
    "px-4 py-2 font-medium text-gray-700 border-b border-gray-200",
    "transition-colors duration-150",
  ],
  {
    variants: {
      variant: {
        default: "",
        sticky: "sticky left-0 z-20 text-left bg-gray-50",
        numeric: "text-right",
        sortable: "cursor-pointer hover:bg-gray-100",
      },
      state: {
        sorted: "bg-gray-200 text-gray-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// =============================================================================
// GRID ROWS - Category și subcategory expansion
// =============================================================================

export const gridCategoryRow = cva(
  ["cursor-pointer", "transition-colors duration-150"],
  {
    variants: {
      variant: {
        default: "bg-gray-100 hover:bg-gray-200",
        primary: "bg-blue-50 hover:bg-blue-100",
        expanded: "bg-blue-50",
      },
      state: {
        selected: "bg-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const gridSubcategoryRow = cva(
  ["group border-t border-gray-200", "transition-colors duration-150"],
  {
    variants: {
      variant: {
        default: "hover:bg-gray-50",
        active: "bg-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const gridTotalRow = cva(
  "bg-gray-100 font-bold border-t-2 border-gray-300",
  {
    variants: {
      variant: {
        default: "",
        balance: "bg-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// =============================================================================
// GRID CELLS - Excel-like cell behaviors
// =============================================================================

export const gridCell = cva(
  [
    "px-4 py-2 transition-all duration-150",
    "border-r border-gray-100 last:border-r-0",
  ],
  {
    variants: {
      // CELL TYPES pentru diferențiere vizuală
      type: {
        header: "font-semibold bg-gray-50 text-gray-900 sticky top-0 z-10",
        category: [
          "font-medium bg-gray-50 text-gray-900",
          "sticky left-0 z-10 cursor-pointer",
        ],
        subcategory: ["sticky left-0 z-10 pl-8", "bg-white hover:bg-gray-50"],
        value: ["text-right cursor-pointer tabular-nums", "hover:bg-blue-50"],
        balance: [
          "font-bold text-right tabular-nums",
          "sticky left-0 bg-gray-100 z-10",
        ],
        formula: [
          "font-mono text-xs bg-blue-50 text-blue-900",
          "cursor-pointer hover:bg-blue-100",
        ],
        total: ["font-bold text-right tabular-nums", "bg-gray-100"],
      },

      // CELL STATES pentru Excel-like interactions
      state: {
        default: "",
        hover: "bg-gray-50",
        active: "bg-blue-50 ring-2 ring-blue-500 ring-inset",
        editing: [
          "bg-yellow-50 ring-2 ring-yellow-400 ring-inset",
          "cursor-text",
        ],
        calculating: "animate-pulse bg-gray-100",
        selected: "bg-blue-100",
        multiselect: "bg-indigo-100",
        error: "bg-red-50 ring-2 ring-red-500 ring-inset",
      },

      // VALUE TYPES pentru financial styling
      valueType: {
        neutral: "text-gray-600",
        positive: "text-emerald-600 font-medium",
        negative: "text-red-600 font-medium",
        zero: "text-gray-400",
      },

      // FROZEN positioning pentru Excel-like frozen panes
      frozen: {
        row: "sticky top-0 z-20 bg-white",
        column: "sticky left-0 z-10 bg-white",
        both: "sticky top-0 left-0 z-30 bg-white",
      },
    },

    // COMPOUND VARIANTS pentru comportamente complexe
    compoundVariants: [
      {
        type: "formula",
        state: "calculating",
        className: "animate-pulse bg-purple-100 text-purple-900",
      },
      {
        type: "value",
        valueType: "negative",
        className: "bg-red-50",
      },
      {
        type: "category",
        state: "selected",
        className: "bg-blue-200 font-bold",
      },
      {
        frozen: "column",
        type: "category",
        className: "shadow-md border-r-2 border-gray-300",
      },
    ],

    defaultVariants: {
      type: "value",
      state: "default",
      valueType: "neutral",
    },
  },
);

// =============================================================================
// GRID INTERACTIONS - Icons, buttons, popover
// =============================================================================

export const gridExpandIcon = cva(
  ["mr-2 transition-transform duration-150", "cursor-pointer"],
  {
    variants: {
      state: {
        expanded: "transform rotate-90",
        collapsed: "transform rotate-0",
      },
    },
    defaultVariants: {
      state: "collapsed",
    },
  },
);

export const gridCellActions = cva("hidden group-hover:flex space-x-1", {
  variants: {
    position: {
      default: "",
      right: "absolute right-0 top-1/2 -translate-y-1/2 mr-2",
    },
  },
  defaultVariants: {
    position: "default",
  },
});

export const gridActionButton = cva(
  [
    "p-1 rounded transition-colors duration-150",
    "focus:outline-none focus:ring-2 focus:ring-offset-1",
  ],
  {
    variants: {
      variant: {
        default: "text-gray-500 hover:text-gray-700 focus:ring-gray-300",
        edit: "text-gray-500 hover:text-blue-600 focus:ring-blue-300",
        delete: "text-gray-500 hover:text-red-600 focus:ring-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const gridPopover = cva(
  [
    "absolute top-0 left-0 z-50",
    "bg-white shadow-lg rounded-md border border-gray-200",
    "transition-opacity duration-150",
  ],
  {
    variants: {
      state: {
        visible: "opacity-100",
        hidden: "opacity-0 pointer-events-none",
      },
    },
    defaultVariants: {
      state: "hidden",
    },
  },
);

// =============================================================================
// GRID UTILITIES - Messages, actions, overlays
// =============================================================================

export const gridMessage = cva("text-center py-8", {
  variants: {
    variant: {
      default: "text-gray-600",
      error: "text-red-600",
      loading: "text-gray-400",
      empty: "text-gray-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const gridActionGroup = cva("flex justify-end space-x-2 mb-4", {
  variants: {
    variant: {
      default: "",
      compact: "mb-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const gridOverlay = cva(
  "absolute inset-0 flex items-center justify-center z-40",
  {
    variants: {
      variant: {
        default: "bg-white bg-opacity-75",
        loading: "bg-white bg-opacity-75 pointer-events-none",
        dark: "bg-gray-900 bg-opacity-75",
        blur: "backdrop-blur-sm bg-white bg-opacity-30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// =============================================================================
// TYPE EXPORTS pentru TypeScript autocomplete
// =============================================================================

export type GridContainerProps = VariantProps<typeof gridContainer>;
export type GridTableProps = VariantProps<typeof gridTable>;
export type GridHeaderProps = VariantProps<typeof gridHeader>;
export type GridHeaderCellProps = VariantProps<typeof gridHeaderCell>;
export type GridCategoryRowProps = VariantProps<typeof gridCategoryRow>;
export type GridSubcategoryRowProps = VariantProps<typeof gridSubcategoryRow>;
export type GridTotalRowProps = VariantProps<typeof gridTotalRow>;
export type GridCellProps = VariantProps<typeof gridCell>;
export type GridExpandIconProps = VariantProps<typeof gridExpandIcon>;
export type GridCellActionsProps = VariantProps<typeof gridCellActions>;
export type GridActionButtonProps = VariantProps<typeof gridActionButton>;
export type GridPopoverProps = VariantProps<typeof gridPopover>;
export type GridMessageProps = VariantProps<typeof gridMessage>;
export type GridActionGroupProps = VariantProps<typeof gridActionGroup>;
export type GridOverlayProps = VariantProps<typeof gridOverlay>;
