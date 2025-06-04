import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎨 TYPOGRAPHY FOUNDATIONS - Carbon Copper Design System
 * Componente de tipografie profesională pentru aplicații fintech
 */

/**
 * Text profesional cu variante pentru diferite contexte
 */
export const textProfessional = cva("transition-colors duration-200", {
  variants: {
    variant: {
      default: "text-carbon-900 dark:text-carbon-100",
      heading: [
        "text-carbon-900 dark:text-carbon-100 font-semibold",
        "tracking-tight leading-tight"
      ],
      body: [
        "text-carbon-700 dark:text-carbon-300",
        "leading-relaxed"
      ],
      caption: [
        "text-carbon-600 dark:text-carbon-400 text-sm",
        "leading-normal"
      ],
      primary: [
        "text-copper-600 dark:text-copper-300 font-medium",
        "tracking-normal"
      ],
      muted: [
        "text-carbon-500 dark:text-carbon-500",
        "text-sm"
      ]
    },
    contrast: {
      normal: "",
      enhanced: "font-medium contrast-125",
      high: "font-semibold contrast-150"
    }
  },
  defaultVariants: { variant: "default", contrast: "normal" }
});

/**
 * Font pentru date financiare cu numere tabulare
 */
export const fontFinancial = cva([
  "font-mono tabular-nums tracking-tight",
  "text-carbon-900 dark:text-carbon-100"
], {
  variants: {
    weight: {
      normal: "font-normal",
      medium: "font-medium", 
      semibold: "font-semibold",
      bold: "font-bold"
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg"
    }
  },
  defaultVariants: { weight: "normal", size: "base" }
});

/**
 * Type exports pentru TypeScript
 */
export type TextProfessionalProps = VariantProps<typeof textProfessional>;
export type FontFinancialProps = VariantProps<typeof fontFinancial>; 