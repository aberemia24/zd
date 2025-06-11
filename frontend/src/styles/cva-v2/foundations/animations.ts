import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎨 ANIMATION FOUNDATIONS - Carbon Copper Design System
 * Componente pentru animații și interacțiuni smooth
 */

/**
 * Hover scale effects pentru micro-interacțiuni
 */
export const hoverScale = cva([
  "transition-all duration-200 ease-in-out cursor-pointer",
  "hover:scale-105 active:scale-95"
], {
  variants: {
    intensity: {
      subtle: "hover:scale-[1.02] active:scale-[0.98]",
      normal: "hover:scale-105 active:scale-95",
      strong: "hover:scale-110 active:scale-90"
    }
  },
  defaultVariants: { intensity: "normal" }
});

/**
 * Focus ring pentru accessibility și UX
 */
export const focusRing = cva([
  "focus-visible:outline-none transition-all duration-200"
], {
  variants: {
    variant: {
      default: [
        "focus-visible:ring-2 focus-visible:ring-copper-500/50 focus-visible:ring-offset-2",
        "dark:focus-visible:ring-copper-400/50"
      ],
      primary: [
        "focus-visible:ring-2 focus-visible:ring-copper-500 focus-visible:ring-offset-2",
        "dark:focus-visible:ring-copper-400"
      ],
      accent: [
        "focus-visible:ring-2 focus-visible:ring-copper-600 focus-visible:ring-offset-2",
        "dark:focus-visible:ring-copper-300"
      ],
      none: "focus-visible:ring-0"
    },
    size: {
      sm: "focus-visible:ring-1 focus-visible:ring-offset-1",
      default: "focus-visible:ring-2 focus-visible:ring-offset-2",
      lg: "focus-visible:ring-4 focus-visible:ring-offset-4"
    }
  },
  defaultVariants: { variant: "default", size: "default" }
});

/**
 * Animații generale pentru componente
 */
export const animations = cva("transition-all duration-200 ease-in-out", {
  variants: {
    type: {
      "bounce-subtle": [
        "animate-pulse duration-1000",
        "hover:animate-bounce"
      ],
      "scale-in": [
        "animate-in zoom-in-95 duration-200",
        "hover:scale-105"
      ],
      "fade-in": [
        "animate-in fade-in duration-300"
      ],
      "slide-up": [
        "animate-in slide-in-from-bottom-4 duration-300"
      ]
    }
  },
  defaultVariants: { type: "fade-in" }
});

/**
 * Type exports pentru TypeScript
 */
export type HoverScaleProps = VariantProps<typeof hoverScale>;
export type FocusRingProps = VariantProps<typeof focusRing>;
export type AnimationsProps = VariantProps<typeof animations>; 
