import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎨 NAVIGATION COMPOSITIONS - Carbon Copper Design System
 * Componente pentru navigation și menu systems
 */

/**
 * Navigation container
 */
export const navigation = cva([
  "flex items-center transition-all duration-200"
], {
  variants: {
    variant: {
      primary: [
        "bg-carbon-50 border-b border-carbon-200",
        "dark:bg-carbon-900 dark:border-carbon-700"
      ],
      secondary: [
        "bg-copper-50 border-b border-copper-200",
        "dark:bg-copper-900/20 dark:border-copper-700/50"
      ],
      transparent: "bg-transparent"
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col"
    },
    size: {
      sm: "h-12 px-4",
      md: "h-16 px-6",
      lg: "h-20 px-8"
    }
  },
  defaultVariants: { variant: "primary", orientation: "horizontal", size: "md" }
});

/**
 * Navigation item/link
 */
export const navigationItem = cva([
  "inline-flex items-center px-4 py-2 font-medium",
  "transition-all duration-200 ease-in-out",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
], {
  variants: {
    variant: {
      default: [
        "text-carbon-700 hover:text-copper-600",
        "dark:text-carbon-300 dark:hover:text-copper-400"
      ],
      active: [
        "text-copper-600 bg-copper-50",
        "dark:text-copper-400 dark:bg-copper-900/20"
      ],
      ghost: [
        "text-carbon-600 hover:bg-carbon-100",
        "dark:text-carbon-400 dark:hover:bg-carbon-800"
      ]
    },
    size: {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    }
  },
  defaultVariants: { variant: "default", size: "md" }
});

/**
 * Breadcrumb navigation
 */
export const breadcrumb = cva([
  "flex items-center space-x-2 text-sm",
  "text-carbon-600 dark:text-carbon-400"
], {
  variants: {
    variant: {
      default: "",
      compact: "space-x-1 text-xs"
    }
  },
  defaultVariants: { variant: "default" }
});

/**
 * Breadcrumb separator
 */
export const breadcrumbSeparator = cva([
  "text-carbon-400 dark:text-carbon-600"
], {
  variants: {
    type: {
      slash: "before:content-['/']",
      chevron: "before:content-['›']",
      arrow: "before:content-['→']"
    }
  },
  defaultVariants: { type: "chevron" }
});

/**
 * Type exports pentru TypeScript
 */
export type NavigationProps = VariantProps<typeof navigation>;
export type NavigationItemProps = VariantProps<typeof navigationItem>;
export type BreadcrumbProps = VariantProps<typeof breadcrumb>;
export type BreadcrumbSeparatorProps = VariantProps<typeof breadcrumbSeparator>; 