import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎨 INTERACTIVE FOUNDATIONS - Carbon Copper Design System
 * Utilities pentru stări interactive și hover effects
 */

/**
 * Hover background effects pentru liste, tabele și containere
 */
export const hoverBackground = cva([
  "transition-colors duration-150 ease-in-out"
], {
  variants: {
    variant: {
      subtle: [
        "hover:bg-carbon-50 dark:hover:bg-carbon-800/50",
        "active:bg-carbon-100 dark:active:bg-carbon-700/50"
      ],
      light: [
        "hover:bg-carbon-100 dark:hover:bg-carbon-800",
        "active:bg-carbon-200 dark:active:bg-carbon-700"
      ],
      medium: [
        "hover:bg-carbon-200 dark:hover:bg-carbon-700",
        "active:bg-carbon-300 dark:active:bg-carbon-600"
      ],
      primary: [
        "hover:bg-copper-50 dark:hover:bg-copper-900/20",
        "active:bg-copper-100 dark:active:bg-copper-800/30"
      ],
      success: [
        "hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
        "active:bg-emerald-100 dark:active:bg-emerald-800/30"
      ],
      warning: [
        "hover:bg-amber-50 dark:hover:bg-amber-900/20",
        "active:bg-amber-100 dark:active:bg-amber-800/30"
      ],
      danger: [
        "hover:bg-ruby-50 dark:hover:bg-ruby-900/20",
        "active:bg-ruby-100 dark:active:bg-ruby-800/30"
      ]
    },
    intensity: {
      low: "hover:bg-opacity-30 dark:hover:bg-opacity-30",
      medium: "hover:bg-opacity-60 dark:hover:bg-opacity-60",
      high: "hover:bg-opacity-90 dark:hover:bg-opacity-90"
    }
  },
  defaultVariants: { variant: "subtle", intensity: "medium" }
});

/**
 * Interactive text colors pentru links și buttons
 */
export const interactiveText = cva([
  "transition-colors duration-150 ease-in-out"
], {
  variants: {
    variant: {
      default: [
        "text-carbon-700 dark:text-carbon-300",
        "hover:text-carbon-900 dark:hover:text-carbon-100"
      ],
      primary: [
        "text-copper-600 dark:text-copper-400",
        "hover:text-copper-700 dark:hover:text-copper-300"
      ],
      success: [
        "text-emerald-600 dark:text-emerald-400",
        "hover:text-emerald-700 dark:hover:text-emerald-300"
      ],
      warning: [
        "text-amber-600 dark:text-amber-400",
        "hover:text-amber-700 dark:hover:text-amber-300"
      ],
      danger: [
        "text-ruby-600 dark:text-ruby-400",
        "hover:text-ruby-700 dark:hover:text-ruby-300"
      ],
      muted: [
        "text-carbon-500 dark:text-carbon-400",
        "hover:text-carbon-700 dark:hover:text-carbon-200"
      ]
    },
    state: {
      default: "",
      active: "font-semibold",
      disabled: "opacity-50 cursor-not-allowed hover:text-current"
    }
  },
  defaultVariants: { variant: "default", state: "default" }
});

/**
 * Interactive borders pentru focus și hover states
 */
export const interactiveBorder = cva([
  "transition-all duration-150 ease-in-out"
], {
  variants: {
    variant: {
      default: [
        "border-carbon-200 dark:border-carbon-700",
        "hover:border-carbon-300 dark:hover:border-carbon-600"
      ],
      primary: [
        "border-copper-200 dark:border-copper-800",
        "hover:border-copper-400 dark:hover:border-copper-600"
      ],
      success: [
        "border-emerald-200 dark:border-emerald-800",
        "hover:border-emerald-400 dark:hover:border-emerald-600"
      ],
      warning: [
        "border-amber-200 dark:border-amber-800",
        "hover:border-amber-400 dark:hover:border-amber-600"
      ],
      danger: [
        "border-ruby-200 dark:border-ruby-800",
        "hover:border-ruby-400 dark:hover:border-ruby-600"
      ]
    },
    width: {
      thin: "border",
      medium: "border-2",
      thick: "border-4"
    }
  },
  defaultVariants: { variant: "default", width: "thin" }
});

/**
 * Type exports pentru TypeScript
 */
export type HoverBackgroundProps = VariantProps<typeof hoverBackground>;
export type InteractiveTextProps = VariantProps<typeof interactiveText>;
export type InteractiveBorderProps = VariantProps<typeof interactiveBorder>; 
