import { cva, type VariantProps } from "class-variance-authority";

/**
 * GRID.TS - Componente Grid Excel-like cu CVA
 * 🎨 LGI-TASK-08: PROFESSIONAL STYLING OVERHAUL
 * Enhanced cu modern design patterns și professional appearance
 *
 * Migration Mapping:
 * - grid.ts → gridContainer, gridTable, gridCell variants
 * - table.ts → tableRow, tableHeader, pagination
 *
 * EXCEL-LIKE FEATURES PRESERVED + PROFESSIONAL ENHANCEMENT:
 * ✅ Multi-cell selection cu enhanced visual feedback
 * ✅ Frozen columns/rows (sticky positioning) cu shadow depth
 * ✅ Inline editing states cu refined focus indicators
 * ✅ Expandable categories cu smooth animations
 * ✅ Cell hover/active/focus states cu professional transitions
 * ✅ Sortable headers cu enhanced UX indicators
 * ✅ Calculate/formula cells cu refined styling
 * ✅ Value type styling (positive/negative) cu color psychology
 * 🎨 NEW: Professional theme variants cu elevated visual hierarchy
 * 🎨 NEW: Modern spacing și typography system
 * 🎨 NEW: Refined color palette cu accessibility compliance
 */

// =============================================================================
// GRID CONTAINER & TABLE - Foundation cu Professional Enhancement
// =============================================================================

export const gridContainer = cva(
  ["overflow-auto rounded-lg", "transition-all duration-200 ease-in-out"],
  {
    variants: {
      variant: {
        default: "bg-white shadow-sm border border-gray-200/60",
        professional: [
          "bg-white shadow-lg border border-gray-200/80",
          "hover:shadow-xl transition-shadow duration-300"
        ],
        elevated: "bg-white shadow-xl border border-gray-100 ring-1 ring-gray-100/50",
        minimal: "bg-white border border-gray-100",
      },
      size: {
        compact: "h-[500px]",
        default: "h-[790px]", 
        large: "h-[1000px]",
        fullscreen: "h-[calc(100vh-120px)] min-h-[400px]",
      },
      state: {
        loading: "opacity-75 pointer-events-none",
        error: "border-red-200 shadow-red-100",
        focused: "ring-2 ring-blue-500/20 border-blue-300",
      },
    },
    defaultVariants: {
      variant: "professional",
      size: "default",
    },
  },
);

export const gridTable = cva(
  "w-full text-sm align-middle border-separate border-spacing-0",
  {
    variants: {
      variant: {
        default: "",
        professional: "font-medium",
        striped: "border-collapse",
        minimal: "border-0",
      },
      density: {
        compact: "text-xs",
        default: "text-sm",
        comfortable: "text-sm leading-relaxed",
      },
    },
    defaultVariants: {
      variant: "professional",
      density: "default",
    },
  },
);

// =============================================================================
// GRID HEADERS - Professional sticky positioning
// =============================================================================

export const gridHeader = cva(
  [
    "sticky top-0 z-30", 
    "transition-all duration-200 ease-in-out"
  ],
  {
    variants: {
      variant: {
        default: "bg-gray-50",
        professional: [
          "bg-white shadow-md",
          "border-b-2 border-gray-200"
        ],
        minimal: "bg-white border-b border-gray-100",
        elevated: "bg-white border-b-2 border-gray-200 shadow-lg",
      },
    },
    defaultVariants: {
      variant: "professional",
    },
  },
);

export const gridHeaderCell = cva(
  [
    "px-4 py-3 font-semibold text-gray-700",
    "transition-all duration-150 ease-in-out",
    "border-b border-gray-200"
  ],
  {
    variants: {
      variant: {
        default: "",
        professional: [
          "font-semibold text-gray-900 tracking-tight bg-white",
          "hover:bg-gray-50"
        ],
        sticky: [
          "sticky left-0 z-40 text-left bg-white",
          "shadow-[2px_0_8px_-2px_rgba(0,0,0,0.15)]",
          "border-r border-gray-200"
        ],
        numeric: "text-right font-mono tabular-nums bg-white",
        sortable: [
          "cursor-pointer select-none bg-white",
          "hover:bg-gray-50 active:bg-gray-100"
        ],
      },
      state: {
        sorted: [
          "bg-blue-50 text-blue-900 font-bold",
          "border-b-2 border-blue-300"
        ],
        hovered: "bg-gray-50",
      },
    },
    defaultVariants: {
      variant: "professional",
    },
  },
);

// =============================================================================
// GRID ROWS - Enhanced category și subcategory styling
// =============================================================================

export const gridCategoryRow = cva(
  [
    "cursor-pointer group",
    "transition-all duration-200 ease-in-out"
  ],
  {
    variants: {
      variant: {
        default: "bg-gray-50/80 hover:bg-gray-100/80",
        professional: [
          "bg-gradient-to-r from-gray-50/90 to-gray-100/60",
          "hover:from-gray-100/90 hover:to-gray-150/60",
          "hover:shadow-sm border-l-4 border-l-transparent",
          "hover:border-l-blue-400"
        ],
        income: [
          "bg-gradient-to-r from-green-50/90 to-green-100/60",
          "hover:from-green-100/90 hover:to-green-150/60",
          "hover:border-l-green-400"
        ],
        expense: [
          "bg-gradient-to-r from-red-50/90 to-red-100/60", 
          "hover:from-red-100/90 hover:to-red-150/60",
          "hover:border-l-red-400"
        ],
        expanded: [
          "bg-blue-50/90 border-l-4 border-l-blue-500",
          "shadow-sm"
        ],
      },
      state: {
        selected: [
          "bg-blue-100/90 border-l-4 border-l-blue-600",
          "shadow-md ring-1 ring-blue-200/50"
        ],
      },
    },
    defaultVariants: {
      variant: "professional",
    },
  },
);

export const gridSubcategoryRow = cva(
  [
    "group border-t border-gray-100/60", 
    "transition-all duration-150 ease-in-out"
  ],
  {
    variants: {
      variant: {
        default: "hover:bg-gray-50/60",
        professional: [
          "hover:bg-gray-50/80 hover:shadow-sm",
          "border-l-2 border-l-transparent",
          "hover:border-l-gray-300"
        ],
        active: "bg-gray-50/80 border-l-2 border-l-gray-400",
        custom: [
          "bg-blue-50/30 hover:bg-blue-50/60",
          "border-l-2 border-l-blue-200",
          "hover:border-l-blue-400"
        ],
      },
    },
    defaultVariants: {
      variant: "professional",
    },
  },
);

export const gridTotalRow = cva(
  [
    "font-bold border-t-2 transition-all duration-200 sticky top-12 z-20",
    "bg-gray-100"
  ],
  {
    variants: {
      variant: {
        default: "border-gray-300",
        professional: [
          "border-gray-400 shadow-md bg-white"
        ],
        balance: [
          "border-blue-400 shadow-md bg-blue-50"
        ],
      },
    },
    defaultVariants: {
      variant: "professional",
    },
  },
);

// =============================================================================
// GRID CELLS - Professional Excel-like cell behaviors
// =============================================================================

export const gridCell = cva(
  [
    "px-4 py-2.5 transition-all duration-150 ease-in-out",
    "border-r border-gray-100/60 last:border-r-0",
    "relative"
  ],
  {
    variants: {
      // CELL TYPES pentru diferențiere vizuală profesionistă
      type: {
        header: [
          "font-semibold bg-gray-50/95 text-gray-900",
          "sticky top-0 z-10 backdrop-blur-sm"
        ],
        category: [
          "font-semibold text-gray-900 sticky left-0 z-10",
          "cursor-pointer bg-gradient-to-r from-gray-50/95 to-gray-100/60",
          "shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]"
        ],
        subcategory: [
          "sticky left-0 z-10 pl-8 font-medium text-gray-700",
          "bg-white/95 hover:bg-gray-50/80 backdrop-blur-sm",
          "shadow-[1px_0_2px_-1px_rgba(0,0,0,0.03)]"
        ],
        value: [
          "text-right cursor-pointer tabular-nums font-medium",
          "hover:bg-blue-50/60 focus:bg-blue-100/60",
          "hover:shadow-inner"
        ],
        balance: [
          "font-bold text-right tabular-nums",
          "sticky left-0 z-20 bg-gray-100",
          "shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
        ],
        formula: [
          "font-mono text-xs text-blue-900",
          "bg-gradient-to-r from-blue-50/90 to-blue-100/60",
          "cursor-pointer hover:from-blue-100/90 hover:to-blue-150/60",
          "border border-blue-200/60 rounded-sm"
        ],
        total: [
          "font-bold text-right tabular-nums",
          "bg-gradient-to-r from-gray-100/95 to-gray-200/80"
        ],
      },

      // CELL STATES pentru enhanced interactions
      state: {
        default: "",
        hover: [
          "bg-gray-50/80 shadow-inner",
          "ring-1 ring-gray-200/40"
        ],
        active: [
          "bg-blue-50/80 shadow-inner",
          "ring-2 ring-blue-400/60 ring-inset"
        ],
        editing: [
          "bg-yellow-50/90 shadow-lg",
          "ring-2 ring-yellow-400/80 ring-inset",
          "cursor-text z-20"
        ],
        calculating: [
          "animate-pulse bg-gradient-to-r from-gray-100 to-gray-200",
          "before:absolute before:inset-0 before:bg-gradient-to-r",
          "before:from-transparent before:via-white/60 before:to-transparent",
          "before:animate-[shimmer_1.5s_ease-in-out_infinite]"
        ],
        selected: [
          "bg-blue-100/80 shadow-inner",
          "ring-2 ring-blue-500/60 ring-inset"
        ],
        multiselect: [
          "bg-indigo-100/80 shadow-inner",
          "ring-2 ring-indigo-500/60 ring-inset"
        ],
        error: [
          "bg-red-50/90 text-red-900",
          "ring-2 ring-red-400/60 ring-inset animate-pulse"
        ],
        readonly: [
          "bg-gray-50/60 text-gray-600 cursor-not-allowed",
          "opacity-75"
        ],
        positive: "text-green-700 font-semibold",
        negative: "text-red-700 font-semibold",
        zero: "text-gray-500 font-medium",
        new: [
          "bg-green-50/90 text-green-900",
          "ring-2 ring-green-400/60 ring-inset",
          "animate-[highlight_2s_ease-out]"
        ],
      },

      // CELL SIZES pentru responsive design
      size: {
        compact: "px-2 py-1 text-xs",
        default: "px-4 py-2.5 text-sm",
        comfortable: "px-6 py-3 text-sm",
        large: "px-8 py-4 text-base",
      },
    },
    defaultVariants: {
      type: "value",
      state: "default",
      size: "default",
    },
  },
);

// =============================================================================
// GRID INTERACTIONS - Icons, buttons, popover
// =============================================================================

export const gridExpandIcon = cva(
  [
    "inline-flex items-center justify-center",
    "transition-all duration-200 ease-in-out",
    "select-none"
  ],
  {
    variants: {
      variant: {
        default: "text-gray-500 hover:text-gray-700",
        professional: [
          "text-gray-600 hover:text-gray-800",
          "hover:bg-gray-100/60 rounded-sm",
          "hover:shadow-sm"
        ],
        minimal: "text-gray-400 hover:text-gray-600",
      },
      size: {
        sm: "w-4 h-4 p-0.5",
        default: "w-5 h-5 p-1",
        lg: "w-6 h-6 p-1.5",
      },
      state: {
        expanded: "rotate-90 text-blue-600",
        collapsed: "rotate-0",
        disabled: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "professional",
      size: "default",
      state: "collapsed",
    },
  },
);

export const gridCellActions = cva(
  [
    "absolute right-0 top-0 bottom-0",
    "flex items-center gap-1 px-2",
    "transition-all duration-200 ease-in-out",
    "bg-gradient-to-l from-white via-white/95 to-transparent"
  ],
  {
    variants: {
      variant: {
        default: "opacity-0 group-hover:opacity-100",
        professional: [
          "opacity-0 group-hover:opacity-100",
          "backdrop-blur-sm shadow-sm",
          "border-l border-gray-200/60"
        ],
        always: "opacity-100",
        subtle: "opacity-60 hover:opacity-100",
      },
      position: {
        right: "right-0",
        left: "left-0 bg-gradient-to-r from-white via-white/95 to-transparent",
        center: "left-1/2 transform -translate-x-1/2",
      },
    },
    defaultVariants: {
      variant: "professional",
      position: "right",
    },
  },
);

export const gridActionButton = cva(
  [
    "inline-flex items-center justify-center",
    "rounded transition-all duration-150 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-1"
  ],
  {
    variants: {
      variant: {
        default: [
          "text-gray-500 hover:text-gray-700",
          "hover:bg-gray-100 focus:ring-gray-300"
        ],
        professional: [
          "text-gray-600 hover:text-gray-800",
          "hover:bg-gray-100/80 hover:shadow-sm",
          "focus:ring-blue-300 active:scale-95"
        ],
        danger: [
          "text-red-500 hover:text-red-700",
          "hover:bg-red-50 focus:ring-red-300"
        ],
        success: [
          "text-green-500 hover:text-green-700", 
          "hover:bg-green-50 focus:ring-green-300"
        ],
        primary: [
          "text-blue-600 hover:text-blue-800",
          "hover:bg-blue-50 focus:ring-blue-300"
        ],
      },
      size: {
        xs: "w-5 h-5 p-0.5 text-xs",
        sm: "w-6 h-6 p-1 text-sm",
        default: "w-7 h-7 p-1.5",
        lg: "w-8 h-8 p-2",
      },
    },
    defaultVariants: {
      variant: "professional",
      size: "sm",
    },
  },
);

export const gridPopover = cva(
  [
    "absolute z-50 p-4 rounded-lg shadow-lg border",
    "bg-white transition-all duration-200 ease-in-out",
    "animate-in fade-in-0 zoom-in-95"
  ],
  {
    variants: {
      variant: {
        default: "border-gray-200 shadow-md",
        professional: [
          "border-gray-200/80 shadow-xl",
          "backdrop-blur-sm bg-white/98",
          "ring-1 ring-gray-100/50"
        ],
        elevated: "border-gray-100 shadow-2xl",
        minimal: "border-gray-100 shadow-sm",
      },
      size: {
        sm: "p-3 text-sm",
        default: "p-4",
        lg: "p-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "professional", 
      size: "default",
    },
  },
);

// =============================================================================
// GRID UTILITIES - Messages, actions, overlays
// =============================================================================

export const gridMessage = cva(
  [
    "flex items-center gap-2 px-3 py-2 rounded-md",
    "text-sm transition-all duration-200 ease-in-out"
  ],
  {
    variants: {
      variant: {
        info: [
          "bg-blue-50/80 text-blue-800 border border-blue-200/60",
          "shadow-sm"
        ],
        success: [
          "bg-green-50/80 text-green-800 border border-green-200/60",
          "shadow-sm"
        ],
        warning: [
          "bg-yellow-50/80 text-yellow-800 border border-yellow-200/60",
          "shadow-sm"
        ],
        error: [
          "bg-red-50/80 text-red-800 border border-red-200/60",
          "shadow-sm"
        ],
        professional: [
          "bg-gray-50/80 text-gray-800 border border-gray-200/60",
          "shadow-sm backdrop-blur-sm"
        ],
      },
    },
    defaultVariants: {
      variant: "professional",
    },
  },
);

export const gridActionGroup = cva(
  [
    "flex items-center gap-1",
    "transition-all duration-200 ease-in-out"
  ],
  {
    variants: {
      variant: {
        default: "",
        professional: "gap-2",
        compact: "gap-0.5",
        spaced: "gap-3",
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },
    },
    defaultVariants: {
      variant: "professional",
      orientation: "horizontal",
    },
  },
);

export const gridOverlay = cva(
  [
    "absolute inset-0 flex items-center justify-center",
    "transition-all duration-300 ease-in-out"
  ],
  {
    variants: {
      variant: {
        loading: [
          "bg-white/80 backdrop-blur-sm",
          "animate-in fade-in-0"
        ],
        error: [
          "bg-red-50/90 text-red-800",
          "animate-in fade-in-0 slide-in-from-top-1"
        ],
        empty: [
          "bg-gray-50/60 text-gray-600",
          "animate-in fade-in-0"
        ],
        professional: [
          "bg-white/90 backdrop-blur-md",
          "shadow-inner animate-in fade-in-0"
        ],
      },
    },
    defaultVariants: {
      variant: "professional",
    },
  },
);

// =============================================================================
// PROFESSIONAL BADGE SYSTEM pentru subcategorii și status indicators
// =============================================================================

export const gridBadge = cva(
  [
    "inline-flex items-center gap-1 px-2 py-1",
    "text-xs font-medium rounded-full",
    "transition-all duration-150 ease-in-out"
  ],
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700",
        professional: [
          "bg-gray-100/80 text-gray-800",
          "hover:bg-gray-200/80 border border-gray-200/60"
        ],
        custom: [
          "bg-blue-100/80 text-blue-800",
          "hover:bg-blue-200/80 border border-blue-200/60"
        ],
        success: [
          "bg-green-100/80 text-green-800",
          "border border-green-200/60"
        ],
        warning: [
          "bg-yellow-100/80 text-yellow-800",
          "border border-yellow-200/60"
        ],
        error: [
          "bg-red-100/80 text-red-800",
          "border border-red-200/60"
        ],
      },
      size: {
        sm: "px-1.5 py-0.5 text-xs",
        default: "px-2 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "professional",
      size: "default",
    },
  },
);

// =============================================================================
// PROFESSIONAL INPUT SYSTEM pentru inline editing
// =============================================================================

export const gridInput = cva(
  [
    "w-full bg-transparent border-0 focus:outline-none",
    "transition-all duration-150 ease-in-out",
    "placeholder:text-gray-400"
  ],
  {
    variants: {
      variant: {
        default: "text-gray-900",
        professional: [
          "text-gray-900 font-medium",
          "focus:ring-0 focus:border-0"
        ],
        numeric: [
          "text-right tabular-nums font-medium",
          "text-gray-900"
        ],
        text: "text-left",
      },
      state: {
        editing: [
          "bg-yellow-50/90 rounded px-2 py-1",
          "ring-2 ring-yellow-400/60"
        ],
        valid: [
          "bg-green-50/90 rounded px-2 py-1",
          "ring-2 ring-green-400/60"
        ],
        invalid: [
          "bg-red-50/90 rounded px-2 py-1",
          "ring-2 ring-red-400/60"
        ],
      },
    },
    defaultVariants: {
      variant: "professional",
    },
  },
);

// =============================================================================
// Type exports pentru componente grid (exclus cele eliminate prin consolidare)
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
export type GridBadgeProps = VariantProps<typeof gridBadge>;
export type GridInputProps = VariantProps<typeof gridInput>;

// =============================================================================
// 🚨 CONSOLIDATION: Interactive și Value State components păstrate dar consolidate
export type GridInteractiveProps = VariantProps<typeof gridInteractive>;
export type GridValueStateProps = VariantProps<typeof gridValueState>;
export type GridTransactionCellProps = VariantProps<typeof gridTransactionCell>;
export type GridSubcategoryStateProps = VariantProps<typeof gridSubcategoryState>;

// Interactive States CVA pentru eliminarea "cursor-pointer interactive hover:..." 
export const gridInteractive = cva(
  ["transition-all duration-200 cursor-pointer"],
  {
    variants: {
      variant: {
        default: "hover:bg-gray-50",
        professional: [
          "hover:bg-gray-50/80 active:scale-98",
          "hover-lift rounded-md"
        ],
        button: [
          "hover:bg-gray-100 active:bg-gray-200",
          "focus:ring-2 focus:ring-blue-500/20"
        ],
        subtle: "hover:bg-gray-50/60",
        category: "hover:bg-gray-100/80 hover:shadow-sm",
        subcategory: "hover:bg-gray-50/80",
        addButton: [
          "hover:bg-gray-50/80 text-gray-600 hover:text-gray-800",
          "hover-lift transition-all duration-200"
        ],
      },
      size: {
        sm: "p-1",
        md: "p-2",
        lg: "p-3",
        auto: "",
      },
      state: {
        active: "bg-gray-100 shadow-sm",
        disabled: "cursor-not-allowed opacity-50",
        loading: "cursor-wait opacity-75",
      },
      rounded: {
        none: "",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
      },
    },
    defaultVariants: {
      variant: "professional",
      size: "md",
      rounded: "md",
    },
  },
);

// Value State CVA pentru eliminarea "text-emerald-600" "text-red-600" etc.
export const gridValueState = cva(
  ["font-medium transition-colors duration-150"],
  {
    variants: {
      state: {
        positive: "text-emerald-600",
        negative: "text-red-600", 
        neutral: "text-gray-600",
        empty: "text-gray-400",
      },
      background: {
        none: "",
        subtle: "",
        ring: "",
      },
      weight: {
        normal: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    compoundVariants: [
      {
        state: "positive",
        background: "subtle",
        class: "bg-green-50/30",
      },
      {
        state: "negative", 
        background: "subtle",
        class: "bg-red-50/30",
      },
      {
        state: "positive",
        background: "ring",
        class: "ring-1 ring-green-200 bg-green-50/30",
      },
      {
        state: "negative",
        background: "ring", 
        class: "ring-1 ring-red-200 bg-red-50/30",
      },
    ],
    defaultVariants: {
      state: "neutral",
      background: "none",
      weight: "normal",
    },
  },
);

// Transaction Cell State CVA pentru eliminarea "ring-1 ring-blue-200 bg-blue-50/30"
export const gridTransactionCell = cva(
  ["w-full h-full min-h-[40px] transition-all duration-150"],
  {
    variants: {
      state: {
        empty: "",
        existing: "ring-1 ring-blue-200 bg-blue-50/30",  // Existing transaction (UPDATE)
        new: "ring-1 ring-green-200 bg-green-50/30",      // New transaction (CREATE)
        editing: "ring-2 ring-blue-400 bg-blue-50/50",
        error: "ring-2 ring-red-400 bg-red-50/50",
      },
      density: {
        compact: "min-h-[32px]",
        normal: "min-h-[40px]",
        comfortable: "min-h-[48px]",
      },
    },
    defaultVariants: {
      state: "empty",
      density: "normal",
    },
  },
);

// Subcategory Row State CVA pentru eliminarea "bg-gray-50/30 animate-slide-down"
export const gridSubcategoryState = cva(
  ["transition-all duration-150"],
  {
    variants: {
      variant: {
        default: "bg-gray-50/30",
        adding: "bg-gray-50/30 animate-slide-down",
        editing: "bg-blue-50/30",
        custom: "bg-blue-50/30",
      },
      cell: {
        normal: "",
        backdrop: "bg-gray-50/50 backdrop-professional",
      },
    },
    defaultVariants: {
      variant: "default",
      cell: "normal",
    },
  },
);
