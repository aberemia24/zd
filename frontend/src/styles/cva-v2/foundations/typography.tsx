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
 * Heading hierarchy professional pentru aplicații fintech
 */
export const headingProfessional = cva([
  "text-carbon-900 dark:text-carbon-100",
  "tracking-tight leading-tight font-semibold"
], {
  variants: {
    level: {
      h1: "text-3xl font-bold",        // Page titles (ex: "Opțiuni", "Transactions")
      h2: "text-2xl font-semibold",    // Section titles
      h3: "text-xl font-semibold",     // Subsection titles  
      h4: "text-lg font-semibold",     // Group titles, card headers
      h5: "text-base font-semibold",   // List headers, form sections
      h6: "text-sm font-semibold"      // Minor headings, labels
    },
    variant: {
      default: "text-carbon-900 dark:text-carbon-100",
      primary: "text-copper-600 dark:text-copper-300",
      success: "text-green-700 dark:text-green-300",
      warning: "text-orange-700 dark:text-orange-300", 
      danger: "text-red-700 dark:text-red-300",
      muted: "text-carbon-600 dark:text-carbon-400"
    }
  },
  defaultVariants: { level: "h3", variant: "default" }
});

/**
 * Label typography pentru form-uri și interface elements
 */
export const labelProfessional = cva([
  "text-carbon-700 dark:text-carbon-300",
  "font-medium tracking-normal"
], {
  variants: {
    size: {
      sm: "text-xs",     // Helper text, disclaimers
      base: "text-sm",   // Standard form labels
      lg: "text-base"    // Prominent labels
    },
    variant: {
      default: "text-carbon-700 dark:text-carbon-300",
      primary: "text-copper-600 dark:text-copper-400",
      success: "text-green-600 dark:text-green-400",
      warning: "text-orange-600 dark:text-orange-400",
      danger: "text-red-600 dark:text-red-400",
      muted: "text-carbon-500 dark:text-carbon-500"
    },
    required: {
      true: "after:content-['*'] after:text-red-500 after:ml-1"
    }
  },
  defaultVariants: { size: "base", variant: "default" }
});

/**
 * Caption typography pentru descrieri și metadata
 */
export const captionProfessional = cva([
  "text-carbon-600 dark:text-carbon-400", 
  "leading-normal"
], {
  variants: {
    size: {
      xs: "text-xs",   // Timestamps, micro-text
      sm: "text-sm"    // Standard captions, descriptions
    },
    variant: {
      default: "text-carbon-600 dark:text-carbon-400",
      muted: "text-carbon-500 dark:text-carbon-500",
      primary: "text-copper-500 dark:text-copper-400",
      success: "text-green-600 dark:text-green-400",
      warning: "text-orange-600 dark:text-orange-400",
      danger: "text-red-600 dark:text-red-400"
    }
  },
  defaultVariants: { size: "sm", variant: "default" }
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
export type HeadingProfessionalProps = VariantProps<typeof headingProfessional>;
export type LabelProfessionalProps = VariantProps<typeof labelProfessional>;
export type CaptionProfessionalProps = VariantProps<typeof captionProfessional>;
export type FontFinancialProps = VariantProps<typeof fontFinancial>; 