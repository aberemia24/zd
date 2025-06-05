import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎨 INPUT PRIMITIVES - Carbon Copper Design System
 * Componente de bază pentru toate input-urile din aplicație
 */

/**
 * Input text standard
 */
export const input = cva([
  "flex w-full rounded-md border px-3 py-2",
  "text-sm transition-colors duration-200",
  "file:border-0 file:bg-transparent file:text-sm file:font-medium",
  "placeholder:text-carbon-500 dark:placeholder:text-carbon-400",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50"
], {
  variants: {
    variant: {
      default: [
        "border-carbon-300 bg-carbon-50",
        "focus-visible:ring-copper-500/30 dark:border-carbon-600 dark:bg-carbon-900",
        "dark:focus-visible:ring-copper-400/30"
      ],
      filled: [
        "border-transparent bg-carbon-100",
        "focus-visible:ring-copper-500/30 dark:bg-carbon-800"
      ],
      error: [
        "border-red-500 bg-carbon-50",
        "focus-visible:ring-red-500 dark:border-red-400 dark:bg-carbon-900",
        "dark:focus-visible:ring-red-400"
      ]
    }
  },
  defaultVariants: { variant: "default" }
});

/**
 * Select dropdown
 */
export const select = cva([
  "flex w-full rounded-md border px-3 py-2",
  "text-sm transition-colors duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50"
], {
  variants: {
    variant: {
      default: [
        "border-carbon-300 bg-carbon-50",
        "focus-visible:ring-copper-500/30 dark:border-carbon-600 dark:bg-carbon-900",
        "dark:focus-visible:ring-copper-400/30"
      ],
      filled: [
        "border-transparent bg-carbon-100",
        "focus-visible:ring-copper-500/30 dark:bg-carbon-800"
      ]
    },
    size: {
      sm: "h-8 px-2 text-xs",
      md: "h-10 px-3 text-sm",
      lg: "h-12 px-4 text-base"
    }
  },
  defaultVariants: { variant: "default", size: "md" }
});

/**
 * Textarea pentru text lung
 */
export const textarea = cva([
  "flex w-full rounded-md border px-3 py-2",
  "text-sm transition-colors duration-200 resize-none",
  "placeholder:text-carbon-500 dark:placeholder:text-carbon-400",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50"
], {
  variants: {
    variant: {
      default: [
        "border-carbon-300 bg-carbon-50",
        "focus-visible:ring-copper-500/30 dark:border-carbon-600 dark:bg-carbon-900",
        "dark:focus-visible:ring-copper-400/30"
      ],
      filled: [
        "border-transparent bg-carbon-100",
        "focus-visible:ring-copper-500/30 dark:bg-carbon-800"
      ]
    },
    size: {
      sm: "min-h-[60px] p-2 text-xs",
      md: "min-h-[80px] p-3 text-sm",
      lg: "min-h-[120px] p-4 text-base"
    }
  },
  defaultVariants: { variant: "default", size: "md" }
});

/**
 * Checkbox pentru selecții
 */
export const checkbox = cva([
  "rounded border transition-colors duration-200",
  "focus:ring-2 focus:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50"
], {
  variants: {
    variant: {
      default: [
        "border-carbon-300 bg-carbon-50 text-copper-600",
        "focus:ring-copper-500/30 dark:border-carbon-600 dark:bg-carbon-900",
        "dark:focus:ring-copper-400/30 dark:text-copper-400"
      ],
      filled: [
        "border-transparent bg-carbon-100 text-copper-600",
        "focus:ring-copper-500/30 dark:bg-carbon-800"
      ]
    },
    size: {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5"
    }
  },
  defaultVariants: { variant: "default", size: "md" }
});

/**
 * Type exports pentru TypeScript
 */
export type InputProps = VariantProps<typeof input>;
export type SelectProps = VariantProps<typeof select>;
export type TextareaProps = VariantProps<typeof textarea>;
export type CheckboxProps = VariantProps<typeof checkbox>; 