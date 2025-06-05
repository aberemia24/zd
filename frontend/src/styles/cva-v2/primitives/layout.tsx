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
 * Type exports pentru TypeScript
 */
export type CardProps = VariantProps<typeof card>;
export type ListProps = VariantProps<typeof list>;
export type ListItemProps = VariantProps<typeof listItem>;
export type FlexProps = VariantProps<typeof flex>;
export type FormGroupProps = VariantProps<typeof formGroup>; 