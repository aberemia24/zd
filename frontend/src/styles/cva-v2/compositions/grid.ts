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
      action: "text-center"
    },
    alignment: {
      left: "text-left",
      center: "text-center", 
      right: "text-right"
    },
    state: {
      default: "",
      selected: "bg-copper-50 dark:bg-copper-900/20",
      editing: "bg-copper-100 dark:bg-copper-800/30"
    }
  },
  defaultVariants: { type: "data", alignment: "left", state: "default" }
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
    state: {
      default: "",
      selected: "bg-copper-100 dark:bg-copper-800/40",
      disabled: "opacity-50 cursor-not-allowed"
    }
  },
  defaultVariants: { variant: "default", state: "default" }
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
    }
  },
  defaultVariants: { sortable: false, sorted: "none" }
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
    }
  },
  defaultVariants: { expanded: false }
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
    type: {
      text: "text-left",
      number: "text-right font-mono tabular-nums",
      select: "cursor-pointer"
    }
  },
  defaultVariants: { type: "text" }
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