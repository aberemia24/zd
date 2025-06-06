import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎨 VISUAL EFFECTS FOUNDATIONS - Carbon Copper Design System
 * Efecte vizuale pentru depth și atmosphere
 */

/**
 * Ambient glow effects pentru depth și hierarchy
 */
export const ambientGlow = cva("transition-all duration-300", {
  variants: {
    size: {
      sm: "shadow-sm hover:shadow-md dark:shadow-copper-900/20 dark:hover:shadow-copper-800/30",
      md: "shadow-md hover:shadow-lg dark:shadow-copper-900/25 dark:hover:shadow-copper-800/40", 
      lg: "shadow-lg hover:shadow-xl dark:shadow-copper-900/30 dark:hover:shadow-copper-800/50"
    },
    color: {
      primary: "hover:shadow-copper-500/20 dark:hover:shadow-copper-400/30",
      accent: "hover:shadow-copper-600/20 dark:hover:shadow-copper-300/30",
      success: "hover:shadow-emerald-500/20 dark:hover:shadow-emerald-400/30",
      warning: "hover:shadow-amber-500/20 dark:hover:shadow-amber-400/30"
    }
  },
  defaultVariants: { size: "md", color: "primary" }
});

/**
 * Glass effect pentru modern UI elements
 */
export const glassEffect = cva("backdrop-blur-sm", {
  variants: {
    opacity: {
      light: "bg-white/80 dark:bg-carbon-900/80",
      medium: "bg-white/90 dark:bg-carbon-900/90", 
      heavy: "bg-white/95 dark:bg-carbon-900/95"
    },
    border: {
      none: "",
      subtle: "border border-carbon-200/50 dark:border-carbon-700/50",
      visible: "border border-carbon-300/70 dark:border-carbon-600/70"
    }
  },
  defaultVariants: { opacity: "medium", border: "subtle" }
});

/**
 * Type exports pentru TypeScript
 */
export type AmbientGlowProps = VariantProps<typeof ambientGlow>;
export type GlassEffectProps = VariantProps<typeof glassEffect>; 
