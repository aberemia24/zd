import { cva, type VariantProps } from "class-variance-authority";

/**
 * GRID.TS - Componente Grid Excel-like SPECIFICE
 * 
 * Re-exportă componentele comune din unified-cva și definește doar cele specifice grid-ului
 * Pentru a evita duplicarea de cod și conflictele de styling
 */

// =============================================================================
// RE-EXPORT COMPONENTE COMUNE DIN UNIFIED-CVA
// =============================================================================
export { 
  gridContainer,
  gridCell,
  gridHeader,
  gridExpandIcon,
  gridInput,
  type GridContainerProps,
  type GridCellProps,
  type GridHeaderProps,
  type GridExpandIconProps,
  type GridInputProps
} from "../unified-cva";

// =============================================================================
// COMPONENTE SPECIFICE GRID-ULUI
// =============================================================================

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
          "hover:bg-white"
        ],
        sticky: [
          "sticky left-0 z-40 text-left bg-white",
          "shadow-[2px_0_8px_-2px_rgba(0,0,0,0.15)]",
          "border-r border-gray-200"
        ],
        numeric: "text-right font-mono tabular-nums bg-white",
        sortable: [
          "cursor-pointer select-none bg-white",
          "hover:bg-white active:bg-gray-50"
        ],
      },
      state: {
        sorted: [
          "bg-blue-50 text-blue-900 font-bold",
          "border-b-2 border-blue-300"
        ],
        hovered: "bg-white",
      },
    },
    defaultVariants: {
      variant: "professional",
    },
  },
);

export const gridCategoryRow = cva(
  [
    "cursor-pointer group",
    "transition-all duration-200 ease-in-out"
  ],
  {
    variants: {
      variant: {
        default: "bg-white/80 hover:bg-gray-100/80",
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

// Export doar type-urile pentru componentele nou definite
export type GridTableProps = VariantProps<typeof gridTable>;
export type GridHeaderCellProps = VariantProps<typeof gridHeaderCell>;
export type GridCategoryRowProps = VariantProps<typeof gridCategoryRow>;
export type GridSubcategoryRowProps = VariantProps<typeof gridSubcategoryRow>;
export type GridTotalRowProps = VariantProps<typeof gridTotalRow>;

// Componente adiționale specifice (opțional - pot fi adăugate după testare)
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
    },
    defaultVariants: {
      variant: "professional",
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
      },
      size: {
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
      },
      size: {
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

export const gridMessage = cva(
  [
    "flex items-center gap-2 px-3 py-2 rounded-md",
    "text-sm transition-all duration-200 ease-in-out"
  ],
  {
    variants: {
      variant: {
        info: "bg-blue-50/80 text-blue-800 border border-blue-200/60",
        success: "bg-green-50/80 text-green-800 border border-green-200/60",
        warning: "bg-yellow-50/80 text-yellow-800 border border-yellow-200/60",
        error: "bg-red-50/80 text-red-800 border border-red-200/60",
        professional: "bg-gray-50/80 text-gray-800 border border-gray-200/60",
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
        loading: "bg-white/80 backdrop-blur-sm animate-in fade-in-0",
        error: "bg-red-50/90 text-red-800 animate-in fade-in-0",
        empty: "bg-gray-50/60 text-gray-600 animate-in fade-in-0",
        professional: "bg-white/90 backdrop-blur-md shadow-inner animate-in fade-in-0",
      },
    },
    defaultVariants: {
      variant: "professional",
    },
  },
);

// Export type-urile pentru componentele adiționale
export type GridCellActionsProps = VariantProps<typeof gridCellActions>;
export type GridActionButtonProps = VariantProps<typeof gridActionButton>;
export type GridPopoverProps = VariantProps<typeof gridPopover>;
export type GridMessageProps = VariantProps<typeof gridMessage>;
export type GridActionGroupProps = VariantProps<typeof gridActionGroup>;
export type GridOverlayProps = VariantProps<typeof gridOverlay>;

// =============================================================================
// COMPONENTE INTERACTIVE ȘI STATE MANAGEMENT
// =============================================================================

export const gridSubcategoryState = cva(
  ["transition-all duration-150"],
  {
    variants: {
      variant: {
        default: "bg-white/30",
        adding: "bg-white/30 animate-slide-down",
        editing: "bg-blue-50/30",
        custom: "bg-blue-50/30",
      },
      cell: {
        normal: "",
        backdrop: "bg-white/50 backdrop-professional",
      },
    },
    defaultVariants: {
      variant: "default",
      cell: "normal",
    },
  },
);

export const gridInteractive = cva(
  ["transition-all duration-200 cursor-pointer"],
  {
    variants: {
      variant: {
        default: "hover:bg-white",
        professional: [
          "hover:bg-white/80 active:scale-98",
          "hover-lift rounded-md"
        ],
        button: [
          "hover:bg-gray-100 active:bg-gray-200",
          "focus:ring-2 focus:ring-blue-500/20"
        ],
        subtle: "hover:bg-white/60",
        category: "hover:bg-gray-100/80 hover:shadow-sm",
        subcategory: "hover:bg-white/80",
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
    },
    defaultVariants: {
      variant: "professional",
      size: "md",
    },
  },
);

export const gridValueState = cva(
  ["font-medium transition-colors duration-150"],
  {
    variants: {
      state: {
        positive: "text-green-600",
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
    ],
    defaultVariants: {
      state: "neutral",
      background: "none",
      weight: "normal",
    },
  },
);

export const gridTransactionCell = cva(
  ["w-full h-full min-h-[40px] transition-all duration-150"],
  {
    variants: {
      state: {
        empty: "",
        existing: "ring-1 ring-blue-200 bg-blue-50/30",
        new: "ring-1 ring-green-200 bg-green-50/30",
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

export const gridResizeContainer = cva(
  [
    "relative transition-all duration-300 ease-in-out",
    "overflow-auto rounded-lg"
  ],
  {
    variants: {
      mode: {
        normal: [
          "bg-white shadow-lg border border-gray-200/80",
          "hover:shadow-xl transition-shadow duration-300",
          "h-[790px]"
        ],
        fullscreen: [
          "fixed inset-0 z-50 bg-white",
          "h-screen w-screen overflow-auto",
          "shadow-2xl"
        ],
      },
      state: {
        transitioning: "pointer-events-none opacity-90",
        ready: "pointer-events-auto opacity-100",
      },
    },
    defaultVariants: {
      mode: "normal",
      state: "ready",
    },
  },
);

export const gridResizeButton = cva(
  [
    "absolute top-4 right-4 z-40",
    "flex items-center justify-center",
    "w-10 h-10 rounded-lg",
    "transition-all duration-200 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2"
  ],
  {
    variants: {
      mode: {
        normal: [
          "bg-white/90 hover:bg-white",
          "border border-gray-300/60 hover:border-gray-400",
          "shadow-md hover:shadow-lg",
          "text-gray-600 hover:text-gray-800",
          "focus:ring-blue-500"
        ],
        fullscreen: [
          "bg-gray-800/90 hover:bg-gray-900",
          "border border-gray-600/60 hover:border-gray-500",
          "shadow-lg hover:shadow-xl",
          "text-white hover:text-gray-100",
          "focus:ring-white"
        ],
      },
    },
    defaultVariants: {
      mode: "normal",
    },
  },
);

// Export type-urile pentru toate componentele
export type GridSubcategoryStateProps = VariantProps<typeof gridSubcategoryState>;
export type GridInteractiveProps = VariantProps<typeof gridInteractive>;
export type GridValueStateProps = VariantProps<typeof gridValueState>;
export type GridTransactionCellProps = VariantProps<typeof gridTransactionCell>;
export type GridBadgeProps = VariantProps<typeof gridBadge>;
export type GridResizeContainerProps = VariantProps<typeof gridResizeContainer>;
export type GridResizeButtonProps = VariantProps<typeof gridResizeButton>; 