import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎨 THEME TOGGLE DOMAIN - Carbon Copper Design System
 * Componente pentru schimbarea temei și preferințele UI
 */

/**
 * Theme toggle button pentru dark/light mode
 */
export const themeToggle = cva([
  "inline-flex items-center justify-center rounded-lg",
  "transition-all duration-300 ease-in-out",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  "hover:scale-105 active:scale-95"
], {
  variants: {
    variant: {
      default: [
        "bg-carbon-100 hover:bg-carbon-200 text-carbon-700",
        "dark:bg-carbon-800 dark:hover:bg-carbon-700 dark:text-carbon-300",
        "focus-visible:ring-copper-500"
      ],
      outline: [
        "border border-carbon-300 bg-transparent hover:bg-carbon-50",
        "dark:border-carbon-600 dark:hover:bg-carbon-800",
        "text-carbon-700 dark:text-carbon-300"
      ],
      minimal: [
        "bg-transparent hover:bg-carbon-100",
        "dark:hover:bg-carbon-800",
        "text-carbon-600 dark:text-carbon-400"
      ]
    },
    size: {
      sm: "h-8 w-8 p-1",
      md: "h-10 w-10 p-2", 
      lg: "h-12 w-12 p-3"
    },
    state: {
      light: "text-amber-600 dark:text-amber-400",
      dark: "text-slate-600 dark:text-slate-400",
      auto: "text-copper-600 dark:text-copper-400"
    }
  },
  defaultVariants: { variant: "default", size: "md", state: "auto" }
});

/**
 * Theme indicator pentru a arăta tema curentă
 */
export const themeIndicator = cva([
  "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
  "transition-colors duration-200"
], {
  variants: {
    theme: {
      light: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      dark: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
      auto: "bg-copper-100 text-copper-700 dark:bg-copper-900/30 dark:text-copper-300"
    }
  },
  defaultVariants: { theme: "auto" }
});

/**
 * Theme preference panel pentru setări avansate
 */
export const themePreference = cva([
  "p-4 bg-carbon-50 dark:bg-carbon-900 rounded-lg",
  "border border-carbon-200 dark:border-carbon-700"
], {
  variants: {
    variant: {
      default: "",
      compact: "p-3",
      detailed: "p-6 space-y-4"
    }
  },
  defaultVariants: { variant: "default" }
});

/**
 * Type exports pentru TypeScript
 */
export type ThemeToggleProps = VariantProps<typeof themeToggle>;
export type ThemeIndicatorProps = VariantProps<typeof themeIndicator>;
export type ThemePreferenceProps = VariantProps<typeof themePreference>; 