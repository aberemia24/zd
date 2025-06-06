import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎨 BUTTON PRIMITIVE - Carbon Copper Design System
 * Componenta de bază pentru toate butoanele din aplicație
 */

export const button = cva([
  "inline-flex items-center justify-center rounded-lg font-medium",
  "transition-all duration-200 ease-in-out",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  "disabled:pointer-events-none disabled:opacity-50"
], {
  variants: {
    variant: {
      primary: [
        "bg-copper-500 hover:bg-copper-600 text-carbon-950",
        "shadow hover:shadow-lg transition-shadow duration-200",
        "focus-visible:ring-copper-500 dark:bg-copper-400 dark:hover:bg-copper-500",
        "dark:text-carbon-950 dark:focus-visible:ring-copper-300"
      ],
      secondary: [
        "bg-carbon-500 hover:bg-carbon-600 text-white", 
        "focus-visible:ring-carbon-500 dark:bg-carbon-400 dark:hover:bg-carbon-500"
      ],
      outline: [
        "border border-copper-500 text-copper-600 hover:bg-copper-500 hover:text-carbon-950",
        "focus-visible:ring-copper-500 dark:border-copper-400 dark:text-copper-300",
        "dark:hover:bg-copper-400 dark:hover:text-carbon-950"
      ],
      ghost: [
        "text-carbon-800 hover:bg-carbon-100",
        "focus-visible:ring-carbon-500 dark:text-carbon-200 dark:hover:bg-carbon-800"
      ],
      danger: [
        "bg-red-600 hover:bg-red-700 text-white",
        "focus-visible:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600"
      ]
    },
    size: {
      xs: "h-6 px-2 text-xs",
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm", 
      lg: "h-12 px-6 text-base"
    }
  },
  defaultVariants: { variant: "primary", size: "md" }
});

/**
 * Type export pentru TypeScript
 */
export type ButtonProps = VariantProps<typeof button>; 
