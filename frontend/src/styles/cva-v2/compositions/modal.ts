import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎨 MODAL COMPOSITIONS - Carbon Copper Design System
 * Componente pentru modal și dialog systems
 */

/**
 * Modal base component
 */
export const modal = cva([
  "fixed inset-0 z-50 flex items-center justify-center p-4",
  "bg-carbon-950/50 backdrop-blur-sm",
  "transition-all duration-300 ease-in-out"
], {
  variants: {
    variant: {
      default: "",
      centered: "items-center justify-center",
      "top-centered": "items-start justify-center pt-16"
    },
    size: {
      sm: "max-w-md",
      md: "max-w-lg", 
      lg: "max-w-xl",
      xl: "max-w-2xl",
      full: "max-w-full"
    }
  },
  defaultVariants: { variant: "default", size: "md" }
});

/**
 * Modal content container
 */
export const modalContent = cva([
  "relative bg-carbon-50 dark:bg-carbon-900",
  "rounded-lg border border-carbon-200 dark:border-carbon-700",
  "shadow-xl p-6 w-full max-h-[80vh] overflow-y-auto",
  "animate-in fade-in zoom-in-95 duration-300"
], {
  variants: {
    variant: {
      default: "",
      elevated: "shadow-2xl ring-1 ring-carbon-900/10 dark:ring-copper-400/20"
    }
  },
  defaultVariants: { variant: "default" }
});

/**
 * Modal overlay (backdrop)
 */
export const modalOverlay = cva([
  "fixed inset-0 z-40 bg-carbon-950/50 backdrop-blur-sm",
  "transition-opacity duration-300"
], {
  variants: {
    visible: {
      true: "opacity-100",
      false: "opacity-0 pointer-events-none"
    }
  },
  defaultVariants: { visible: true }
});

/**
 * Type exports pentru TypeScript
 */
export type ModalProps = VariantProps<typeof modal>;
export type ModalContentProps = VariantProps<typeof modalContent>;
export type ModalOverlayProps = VariantProps<typeof modalOverlay>; 