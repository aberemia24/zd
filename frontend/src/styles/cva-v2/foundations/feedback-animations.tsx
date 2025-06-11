import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎭 FEEDBACK ANIMATIONS - Carbon Copper Design System
 * Animații specializate pentru componente de feedback cu accessibility
 */

/**
 * Animații pentru Toast notifications
 */
export const toastAnimations = cva([
  "transition-all duration-300 ease-in-out",
  "data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full",
  "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full",
  "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
], {
  variants: {
    position: {
      "top-right": [
        "data-[state=open]:slide-in-from-top-2 data-[state=open]:slide-in-from-right-full",
        "data-[state=closed]:slide-out-to-top-2 data-[state=closed]:slide-out-to-right-full"
      ],
      "top-left": [
        "data-[state=open]:slide-in-from-top-2 data-[state=open]:slide-in-from-left-full",
        "data-[state=closed]:slide-out-to-top-2 data-[state=closed]:slide-out-to-left-full"
      ],
      "bottom-right": [
        "data-[state=open]:slide-in-from-bottom-2 data-[state=open]:slide-in-from-right-full",
        "data-[state=closed]:slide-out-to-bottom-2 data-[state=closed]:slide-out-to-right-full"
      ],
      "bottom-left": [
        "data-[state=open]:slide-in-from-bottom-2 data-[state=open]:slide-in-from-left-full",
        "data-[state=closed]:slide-out-to-bottom-2 data-[state=closed]:slide-out-to-left-full"
      ]
    },
    variant: {
      default: "duration-300",
      fast: "duration-200",
      slow: "duration-500",
      "reduced-motion": "duration-0" // Pentru utilizatorii cu prefers-reduced-motion
    }
  },
  defaultVariants: { 
    position: "top-right", 
    variant: "default" 
  }
});

/**
 * Animații pentru Modal components
 */
export const modalAnimations = cva([
  "transition-all duration-300 ease-out",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
], {
  variants: {
    variant: {
      default: "duration-300",
      fast: "duration-200",
      slow: "duration-500",
      "scale-up": [
        "data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-bottom-10",
        "data-[state=closed]:zoom-out-90 data-[state=closed]:slide-out-to-bottom-10"
      ],
      "slide-up": [
        "data-[state=open]:slide-in-from-bottom-full",
        "data-[state=closed]:slide-out-to-bottom-full"
      ],
      "reduced-motion": "duration-0"
    }
  },
  defaultVariants: { variant: "default" }
});

/**
 * Animații pentru Modal overlay/backdrop
 */
export const modalOverlayAnimations = cva([
  "transition-all duration-300 ease-out",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
], {
  variants: {
    variant: {
      default: "duration-300",
      fast: "duration-200",
      slow: "duration-500",
      "reduced-motion": "duration-0"
    }
  },
  defaultVariants: { variant: "default" }
});

/**
 * Animații pentru Alert components
 */
export const alertAnimations = cva([
  "transition-all duration-300 ease-in-out",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2"
], {
  variants: {
    variant: {
      default: "duration-300",
      fast: "duration-200",
      slow: "duration-500",
      "bounce-in": [
        "data-[state=open]:zoom-in-95 data-[state=open]:animate-bounce",
        "data-[state=closed]:zoom-out-95"
      ],
      "reduced-motion": "duration-0"
    }
  },
  defaultVariants: { variant: "default" }
});

/**
 * Animații pentru Loading states (Progress, Spinner)
 */
export const loadingAnimations = cva([
  "transition-all duration-200 ease-in-out"
], {
  variants: {
    type: {
      "fade-in": [
        "animate-in fade-in-0 duration-300"
      ],
      "scale-in": [
        "animate-in zoom-in-95 fade-in-0 duration-300"
      ],
      "pulse": [
        "animate-pulse"
      ],
      "spin": [
        "animate-spin"
      ],
      "bounce": [
        "animate-bounce"
      ],
      "reduced-motion": [
        "duration-0"
      ]
    },
    speed: {
      slow: "duration-1000",
      normal: "duration-500",
      fast: "duration-300"
    }
  },
  defaultVariants: { 
    type: "fade-in", 
    speed: "normal" 
  }
});

/**
 * Accessibility-focused animations
 * Respectă prefers-reduced-motion și oferă alternative
 */
export const accessibleAnimations = cva([
  "motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-in-out",
  "motion-reduce:transition-none motion-reduce:duration-0"
], {
  variants: {
    type: {
      "fade": [
        "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0",
        "motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0"
      ],
      "scale": [
        "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:zoom-in-95",
        "motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:zoom-out-95"
      ],
      "slide": [
        "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:slide-in-from-bottom-4",
        "motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:slide-out-to-bottom-4"
      ]
    },
    priority: {
      high: "motion-reduce:opacity-100", // Asigură vizibilitatea pentru utilizatori cu motion redus
      normal: "motion-reduce:opacity-90",
      low: "motion-reduce:opacity-75"
    }
  },
  defaultVariants: { 
    type: "fade", 
    priority: "high" 
  }
});

/**
 * Focus animations pentru keyboard navigation
 */
export const focusAnimations = cva([
  "transition-all duration-200 ease-in-out",
  "focus-visible:outline-none"
], {
  variants: {
    variant: {
      default: [
        "focus-visible:ring-2 focus-visible:ring-copper-500/50 focus-visible:ring-offset-2",
        "dark:focus-visible:ring-copper-400/50",
        "motion-safe:focus-visible:scale-105"
      ],
      subtle: [
        "focus-visible:ring-1 focus-visible:ring-copper-500/30 focus-visible:ring-offset-1",
        "dark:focus-visible:ring-copper-400/30"
      ],
      strong: [
        "focus-visible:ring-4 focus-visible:ring-copper-500 focus-visible:ring-offset-4",
        "dark:focus-visible:ring-copper-400",
        "motion-safe:focus-visible:scale-110"
      ],
      "high-contrast": [
        "focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
        "dark:focus-visible:ring-white",
        "focus-visible:bg-yellow-200 dark:focus-visible:bg-yellow-800"
      ]
    }
  },
  defaultVariants: { variant: "default" }
});

/**
 * Type exports pentru TypeScript
 */
export type ToastAnimationsProps = VariantProps<typeof toastAnimations>;
export type ModalAnimationsProps = VariantProps<typeof modalAnimations>;
export type ModalOverlayAnimationsProps = VariantProps<typeof modalOverlayAnimations>;
export type AlertAnimationsProps = VariantProps<typeof alertAnimations>;
export type LoadingAnimationsProps = VariantProps<typeof loadingAnimations>;
export type AccessibleAnimationsProps = VariantProps<typeof accessibleAnimations>;
export type FocusAnimationsProps = VariantProps<typeof focusAnimations>; 
