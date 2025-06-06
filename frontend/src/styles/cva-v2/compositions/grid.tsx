import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎨 GRID COMPOSITIONS - Carbon Copper Design System
 * Componente pentru grid system și table layouts
 */

/**
 * Grid container principal
 */
export const gridContainer = cva([
  "overflow-auto rounded-lg transition-all duration-200 ease-in-out"
], {
  variants: {
    variant: {
      default: [
        "bg-carbon-50 shadow-sm border border-carbon-300",
        "dark:bg-carbon-900 dark:border-carbon-700 dark:shadow-copper-900/10"
      ],
      professional: [
        "bg-carbon-50 shadow-lg border border-carbon-200", 
        "hover:shadow-xl transition-shadow duration-300",
        "dark:bg-carbon-900 dark:border-carbon-700 dark:shadow-copper-900/20",
        "dark:hover:shadow-copper-800/30"
      ],
      elevated: [
        "bg-carbon-50 shadow-xl border border-carbon-100 ring-1 ring-carbon-100",
        "dark:bg-carbon-900 dark:border-carbon-700 dark:ring-carbon-600/20"
      ]
    },
    size: {
      compact: "h-[500px]",
      default: "h-[790px]",
      large: "h-[1000px]", 
      fullscreen: "h-[calc(100vh-120px)] min-h-[400px]"
    },
    state: {
      loading: "opacity-75 pointer-events-none",
      error: "border-red-500/50 shadow-red-500/10 dark:border-red-400/50",
      focused: "ring-2 ring-copper-500/20 border-copper-300 dark:ring-copper-400/30 dark:border-copper-400/50"
    }
  },
  defaultVariants: { variant: "professional", size: "default" }
});

/**
 * Grid cell pentru table data
 */
export const gridCell = cva([
  "px-4 py-2.5 transition-all duration-150 ease-in-out",
  "border-r border-carbon-200 last:border-r-0 relative",
  "dark:border-carbon-600"
], {
  variants: {
    type: {
      data: "text-carbon-900 dark:text-carbon-100",
      header: [
        "font-medium text-carbon-700 dark:text-carbon-300",
        "bg-carbon-100 dark:bg-carbon-800"
      ],
      financial: [
        "font-mono tabular-nums text-right",
        "text-carbon-900 dark:text-carbon-100"
      ],
      action: "text-center",
      subcategory: "text-carbon-900 dark:text-carbon-100 pl-6",
      value: "text-carbon-900 dark:text-carbon-100",
      category: [
        "font-semibold text-carbon-900 dark:text-carbon-100",
        "bg-carbon-100 dark:bg-carbon-800"
      ],
      balance: [
        "font-mono tabular-nums text-right font-bold",
        "text-carbon-900 dark:text-carbon-100"
      ]
    },
    alignment: {
      left: "text-left",
      center: "text-center", 
      right: "text-right"
    },
    size: {
      sm: "px-2 py-1 text-xs",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base"
    },
    state: {
      default: "",
      selected: "bg-copper-50 dark:bg-copper-900/20",
      editing: "bg-copper-100 dark:bg-copper-800/30",
      readonly: "bg-carbon-50/30 dark:bg-carbon-800/30",
      active: "bg-copper-100 ring-2 ring-copper-400 dark:bg-copper-800/50 dark:ring-copper-500",
      positive: "text-green-600 dark:text-green-400",
      negative: "text-red-600 dark:text-red-400"
    }
  },
  defaultVariants: { type: "data", alignment: "left", size: "md", state: "default" }
});

/**
 * Grid row pentru table rows
 */
export const gridRow = cva([
  "border-b border-carbon-200 dark:border-carbon-600",
  "transition-colors duration-150 hover:bg-carbon-50 dark:hover:bg-carbon-800/50"
], {
  variants: {
    variant: {
      default: "",
      striped: "even:bg-carbon-50/50 dark:even:bg-carbon-800/25",
      interactive: "cursor-pointer hover:bg-copper-50 dark:hover:bg-copper-900/20"
    },
    type: {
      default: "",
      category: [
        "font-semibold bg-carbon-100 dark:bg-carbon-800",
        "border-b-2 border-carbon-300 dark:border-carbon-600"
      ],
      subcategory: "pl-4",
      total: [
        "font-bold border-t-2 border-carbon-400 dark:border-carbon-500",
        "bg-carbon-200 dark:bg-carbon-700 sticky top-0 z-20"
      ]
    },
    state: {
      default: "",
      selected: "bg-copper-100 dark:bg-copper-800/40",
      disabled: "opacity-50 cursor-not-allowed",
      expanded: "bg-carbon-100/80 dark:bg-carbon-800/80"
    }
  },
  defaultVariants: { variant: "default", type: "default", state: "default" }
});

/**
 * Grid header pentru table headers
 */
export const gridHeader = cva([
  "bg-carbon-100 dark:bg-carbon-800",
  "border-b-2 border-carbon-300 dark:border-carbon-600",
  "font-medium text-carbon-700 dark:text-carbon-300"
], {
  variants: {
    sortable: {
      true: "cursor-pointer hover:bg-carbon-200 dark:hover:bg-carbon-700",
      false: ""
    },
    sorted: {
      asc: "text-copper-600 dark:text-copper-400",
      desc: "text-copper-600 dark:text-copper-400",
      none: ""
    },
    sticky: {
      true: "sticky top-0 z-10",
      false: ""
    }
  },
  defaultVariants: { sortable: false, sorted: "none", sticky: false }
});

/**
 * Grid expand icon pentru row expansion
 */
export const gridExpandIcon = cva([
  "inline-flex items-center justify-center w-4 h-4",
  "transition-transform duration-200 cursor-pointer",
  "text-carbon-600 dark:text-carbon-400 hover:text-copper-600 dark:hover:text-copper-400"
], {
  variants: {
    expanded: {
      true: "rotate-90",
      false: "rotate-0"
    },
    variant: {
      default: "",
      professional: "hover:bg-carbon-100 dark:hover:bg-carbon-700 rounded-sm"
    }
  },
  defaultVariants: { expanded: false, variant: "default" }
});

/**
 * Grid input pentru inline editing
 */
export const gridInput = cva([
  "w-full bg-transparent border-0 p-0 text-sm",
  "focus:outline-none focus:bg-copper-50 dark:focus:bg-copper-900/20",
  "transition-colors duration-200"
], {
  variants: {
    variant: {
      default: "",
      editing: "bg-copper-50/50 dark:bg-copper-900/50"
    },
    type: {
      text: "text-left",
      number: "text-right font-mono tabular-nums",
      select: "cursor-pointer"
    },
    state: {
      default: "",
      editing: "ring-1 ring-copper-300 dark:ring-copper-600",
      error: "ring-1 ring-red-400 dark:ring-red-500"
    }
  },
  defaultVariants: { variant: "default", type: "text", state: "default" }
});

/**
 * Grid subcategory row - specialized styling pentru subcategory rows în LunarGrid
 */
export const gridSubcategoryRow = cva([
  "group border-t border-carbon-100/60 dark:border-carbon-600/60", 
  "transition-all duration-150 ease-in-out"
], {
  variants: {
    variant: {
      default: "hover:bg-carbon-50/60 dark:hover:bg-carbon-800/60",
      professional: [
        "hover:bg-carbon-50/80 hover:shadow-sm dark:hover:bg-carbon-800/80",
        "border-l-2 border-l-transparent",
        "hover:border-l-carbon-300 dark:hover:border-l-carbon-500"
      ],
      active: "bg-carbon-50/80 border-l-2 border-l-carbon-400 dark:bg-carbon-800/80 dark:border-l-carbon-400",
      custom: [
        "bg-copper-50/30 hover:bg-copper-50/60 dark:bg-copper-900/30 dark:hover:bg-copper-900/60",
        "border-l-2 border-l-copper-200 dark:border-l-copper-600",
        "hover:border-l-copper-400 dark:hover:border-l-copper-400"
      ],
    },
  },
  defaultVariants: {
    variant: "professional",
  },
});

/**
 * Grid subcategory state - state management pentru adding/editing subcategories
 */
export const gridSubcategoryState = cva([
  "transition-all duration-150"
], {
  variants: {
    variant: {
      default: "bg-carbon-50/30 dark:bg-carbon-800/30",
      adding: "bg-carbon-50/30 animate-slide-down dark:bg-carbon-800/30",
      editing: "bg-copper-50/30 dark:bg-copper-900/30",
      custom: "bg-copper-50/30 dark:bg-copper-900/30",
    },
    cell: {
      normal: "",
      backdrop: "bg-carbon-50/50 dark:bg-carbon-800/50",
    },
  },
  defaultVariants: {
    variant: "default",
    cell: "normal",
  },
});

/**
 * Grid interactive - behavior interactiv pentru butoane și zones
 */
export const gridInteractive = cva([
  "transition-all duration-200 cursor-pointer"
], {
  variants: {
    variant: {
      default: "hover:bg-carbon-50 dark:hover:bg-carbon-800",
      professional: [
        "hover:bg-carbon-50/80 active:scale-98 dark:hover:bg-carbon-800/80",
        "hover:shadow-sm rounded-md"
      ],
      button: [
        "hover:bg-carbon-100 active:bg-carbon-200 dark:hover:bg-carbon-700 dark:active:bg-carbon-600",
        "focus:ring-2 focus:ring-copper-500/20 dark:focus:ring-copper-400/30"
      ],
      subtle: "hover:bg-carbon-50/60 dark:hover:bg-carbon-800/60",
      category: "hover:bg-carbon-100/80 hover:shadow-sm dark:hover:bg-carbon-700/80",
      subcategory: "hover:bg-carbon-50/80 dark:hover:bg-carbon-800/80",
    },
    size: {
      sm: "p-1",
      md: "p-2",
      lg: "p-3",
      auto: "",
    },
    state: {
      active: "bg-carbon-100 shadow-sm dark:bg-carbon-700",
      disabled: "cursor-not-allowed opacity-50",
      loading: "cursor-wait opacity-75",
    },
  },
  defaultVariants: {
    variant: "professional",
    size: "md",
  },
});

/**
 * Type exports pentru TypeScript
 */
export type GridContainerProps = VariantProps<typeof gridContainer>;
export type GridCellProps = VariantProps<typeof gridCell>;
export type GridRowProps = VariantProps<typeof gridRow>;
export type GridHeaderProps = VariantProps<typeof gridHeader>;
export type GridExpandIconProps = VariantProps<typeof gridExpandIcon>;
export type GridInputProps = VariantProps<typeof gridInput>;
export type GridSubcategoryRowProps = VariantProps<typeof gridSubcategoryRow>;
export type GridSubcategoryStateProps = VariantProps<typeof gridSubcategoryState>;
export type GridInteractiveProps = VariantProps<typeof gridInteractive>; 