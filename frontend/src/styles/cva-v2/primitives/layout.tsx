import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎨 LAYOUT PRIMITIVES - Carbon Copper Design System
 * Componente pentru structurarea layout-ului
 */

/**
 * Card pentru gruparea conținutului - extins pentru date financiare
 */
export const card = cva([
  "rounded-lg border bg-carbon-50 transition-all duration-200",
  "dark:bg-carbon-900 dark:border-carbon-700"
], {
  variants: {
    variant: {
      default: "p-6 shadow-sm",
      elevated: "p-6 shadow-md hover:shadow-lg dark:shadow-copper-900/10",
      interactive: "p-6 hover:shadow-md cursor-pointer dark:hover:shadow-copper-800/20",
      financial: "p-4 border-copper-200 bg-gradient-to-br from-copper-50 to-amber-50 dark:from-copper-950 dark:to-amber-950",
      compact: "p-4 shadow-sm",
      highlight: "p-6 border-copper-300 bg-copper-50 shadow-md dark:bg-copper-950 dark:border-copper-700",
    },
    size: {
      sm: "text-sm",
      md: "",
      lg: "text-lg",
    }
  },
  defaultVariants: { 
    variant: "default",
    size: "md"
  }
});

/**
 * Card Header pentru headerele de secțiune din carduri
 */
export const cardHeader = cva([
  "p-4 border-b rounded-t-lg",
  "bg-carbon-50 border-carbon-200",
  "dark:bg-carbon-900 dark:border-carbon-700"
], {
  variants: {
    variant: {
      default: "bg-carbon-50 border-carbon-200 dark:bg-carbon-900 dark:border-carbon-700",
      danger: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700",
      warning: "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700",
      success: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700",
      primary: "bg-copper-50 border-copper-200 dark:bg-copper-950 dark:border-copper-700",
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

/**
 * List pentru afișarea elementelor în listă - optimizat pentru date financiare
 */
export const list = cva([
  "divide-y divide-carbon-200 bg-carbon-50 rounded-lg border border-carbon-200",
  "dark:divide-carbon-700 dark:bg-carbon-900 dark:border-carbon-700"
], {
  variants: {
    variant: {
      default: "",
      compact: "divide-y-0 space-y-1 bg-transparent border-0",
      financial: "bg-gradient-to-b from-copper-50 to-amber-50 border-copper-200 dark:from-copper-950 dark:to-amber-950",
      interactive: "hover:shadow-sm transition-shadow duration-200",
    },
    spacing: {
      none: "",
      sm: "py-2",
      md: "py-3", 
      lg: "py-4",
    }
  },
  defaultVariants: {
    variant: "default",
    spacing: "md"
  }
});

/**
 * List item pentru elementele individuale din listă
 */
export const listItem = cva([
  "flex items-center justify-between transition-colors duration-150"
], {
  variants: {
    variant: {
      default: "px-4 py-3 hover:bg-carbon-100 dark:hover:bg-carbon-800",
      compact: "px-2 py-2 text-sm hover:bg-carbon-100 dark:hover:bg-carbon-800",
      financial: "px-4 py-3 hover:bg-copper-100 dark:hover:bg-copper-900",
      interactive: "px-4 py-3 cursor-pointer hover:bg-copper-100 active:bg-copper-200 dark:hover:bg-copper-900 dark:active:bg-copper-800",
      highlighted: "px-4 py-3 bg-copper-100 border-l-4 border-copper-500 dark:bg-copper-950",
    },
    spacing: {
      none: "",
      sm: "space-x-2",
      md: "space-x-3",
      lg: "space-x-4",
    }
  },
  defaultVariants: {
    variant: "default",
    spacing: "md"
  }
});

/**
 * Flex utility pentru layout flexibil
 */
export const flex = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col",
      "row-reverse": "flex-row-reverse",
      "col-reverse": "flex-col-reverse",
    },
    wrap: {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
      "wrap-reverse": "flex-wrap-reverse",
    },
    justify: {
      start: "justify-start",
      end: "justify-end",
      center: "justify-center",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    align: {
      start: "items-start",
      end: "items-end", 
      center: "items-center",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
    gap: {
      none: "",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
      "2xl": "gap-12",
    },
    width: {
      auto: "",
      full: "w-full",
      screen: "w-screen",
      fit: "w-fit",
    },
    height: {
      auto: "",
      full: "h-full",
      screen: "h-screen",
      fit: "h-fit",
    },
  },
  defaultVariants: {
    direction: "row",
    gap: "none",
  },
});

/**
 * Form group pentru organizarea formularelor
 */
export const formGroup = cva("flex flex-col transition-all duration-150", {
  variants: {
    variant: {
      default: "space-y-1.5 mb-4",
      inline: "sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 mb-4",
      grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Simple Table pentru HTML tables (non-TanStack)
 */
export const simpleTable = cva([
  "w-full border-collapse"
], {
  variants: {
    variant: {
      default: "",
      bordered: "border border-carbon-200 dark:border-carbon-700",
      striped: "",
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

/**
 * Table Header pentru <th> elements
 */
export const tableHeader = cva([
  "text-left p-4 font-medium",
  "text-carbon-700 dark:text-carbon-300",
  "bg-carbon-50 dark:bg-carbon-800",
  "border-b border-carbon-200 dark:border-carbon-700"
], {
  variants: {
    align: {
      left: "text-left",
      center: "text-center", 
      right: "text-right"
    },
    size: {
      sm: "p-2 text-sm",
      md: "p-4",
      lg: "p-6 text-lg"
    }
  },
  defaultVariants: {
    align: "left",
    size: "md"
  }
});

/**
 * Table Cell pentru <td> elements
 */
export const tableCell = cva([
  "p-4 border-b border-carbon-200 dark:border-carbon-700"
], {
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right"
    },
    size: {
      sm: "p-2 text-sm",
      md: "p-4", 
      lg: "p-6"
    },
    variant: {
      default: "",
      loading: "text-center",
      empty: "text-center text-carbon-500 dark:text-carbon-400"
    }
  },
  defaultVariants: {
    align: "left",
    size: "md",
    variant: "default"
  }
});

/**
 * Spacing utilities pentru standardizarea spacing patterns comuni
 */
export const spacingMargin = cva("", {
  variants: {
    bottom: {
      0: "mb-0",
      1: "mb-1", 
      2: "mb-2",
      3: "mb-3",
      4: "mb-4",
      6: "mb-6",
      8: "mb-8",
      12: "mb-12"
    },
    top: {
      0: "mt-0",
      1: "mt-1",
      2: "mt-2", 
      3: "mt-3",
      4: "mt-4",
      6: "mt-6",
      8: "mt-8",
      12: "mt-12"
    },
    y: {
      0: "my-0",
      1: "my-1",
      2: "my-2",
      3: "my-3", 
      4: "my-4",
      6: "my-6",
      8: "my-8"
    }
  },
  defaultVariants: {}
});

/**
 * Space-y patterns pentru vertical spacing în containers
 */
export const spaceY = cva("", {
  variants: {
    spacing: {
      0: "space-y-0",
      1: "space-y-1",
      2: "space-y-2",
      3: "space-y-3",
      4: "space-y-4",
      6: "space-y-6",
      8: "space-y-8",
      12: "space-y-12"
    }
  },
  defaultVariants: {
    spacing: 4
  }
});

/**
 * Loading overlay pentru states de încărcare
 */
export const loadingOverlay = cva([
  "absolute inset-0 flex items-center justify-center transition-all duration-300"
], {
  variants: {
    variant: {
      default: "bg-background/80 dark:bg-surface-dark/80 backdrop-blur-sm z-10",
      glass: "bg-white/50 dark:bg-black/50 backdrop-blur-md z-10",
      subtle: "bg-carbon-50/60 dark:bg-carbon-900/60 backdrop-blur-sm z-5",
      modal: "bg-black/50 backdrop-blur-sm z-50"
    },
    content: {
      spinner: "",
      text: "flex-col gap-2",
      minimal: "opacity-75"
    }
  },
  defaultVariants: {
    variant: "default",
    content: "spinner"
  }
});

/**
 * Type exports pentru TypeScript
 */
export type CardProps = VariantProps<typeof card>;
export type CardHeaderProps = VariantProps<typeof cardHeader>;
export type ListProps = VariantProps<typeof list>;
export type ListItemProps = VariantProps<typeof listItem>;
export type FlexProps = VariantProps<typeof flex>;
export type FormGroupProps = VariantProps<typeof formGroup>;
export type SimpleTableProps = VariantProps<typeof simpleTable>;
export type TableHeaderProps = VariantProps<typeof tableHeader>;
export type TableCellProps = VariantProps<typeof tableCell>; 
