import { cva, type VariantProps } from "class-variance-authority";
import { modal as primitiveModal, modalContent as primitiveModalContent, modalContainer as primitiveModalContainer } from "../primitives/modal";

/**
 * 🎨 MODAL COMPOSITIONS - Carbon Copper Design System
 * Componente pentru modal și dialog systems
 * 
 * IMPORTANT: Acestea sunt COMPUNERI ale primitive-urilor, nu redefiniri!
 */

/**
 * Enhanced modal overlay cu animații și multiple variante de poziționare
 * Extinde primitive modal cu animații avansate
 */
export const enhancedModalOverlay = cva([
  "transition-all duration-300 ease-in-out",
  "animate-in fade-in duration-300"
], {
  variants: {
    position: {
      center: "items-center justify-center",
      "top-center": "items-start justify-center pt-16",
      "full-screen": "items-center justify-center"
    },
    backdrop: {
      default: "backdrop-blur-none",
      blur: "backdrop-blur-sm",
      "strong-blur": "backdrop-blur-md"
    },
    animation: {
      fade: "animate-in fade-in duration-300",
      slide: "animate-in slide-in-from-bottom-4 duration-300",
      zoom: "animate-in zoom-in-95 duration-300"
    }
  },
  defaultVariants: { 
    position: "center", 
    backdrop: "default",
    animation: "fade"
  }
});

/**
 * Enhanced modal content cu animații și responsive design
 * Extinde primitive modalContent cu efecte vizuale avansate
 */
export const enhancedModalContent = cva([
  "animate-in fade-in zoom-in-95 duration-300",
  "transition-all duration-200"
], {
  variants: {
    elevation: {
      low: "shadow-lg",
      medium: "shadow-xl",
      high: "shadow-2xl ring-1 ring-carbon-900/10 dark:ring-copper-400/20"
    },
    responsive: {
      true: "mx-4 my-4 lg:mx-auto lg:my-8",
      false: ""
    },
    animation: {
      fade: "animate-in fade-in duration-300",
      slide: "animate-in slide-in-from-bottom-4 duration-300", 
      zoom: "animate-in zoom-in-95 duration-300",
      "slide-up": "animate-in slide-in-from-top-4 duration-300"
    }
  },
  defaultVariants: { 
    elevation: "medium",
    responsive: true,
    animation: "zoom"
  }
});

/**
 * Dialog composition pentru modal-uri simple
 * Combină primitive-urile pentru un pattern common
 */
export const dialogModal = {
  overlay: primitiveModal,
  container: primitiveModalContainer,
  content: primitiveModalContent,
  enhancements: {
    overlay: enhancedModalOverlay,
    content: enhancedModalContent
  }
};

/**
 * Full-screen modal composition pentru form-uri complexe
 */
export const fullScreenModal = cva([
  "fixed inset-0 flex flex-col",
  "bg-carbon-50 dark:bg-carbon-900"
], {
  variants: {
    hasHeader: {
      true: "pt-16",
      false: ""
    }
  },
  defaultVariants: { hasHeader: false }
});

/**
 * Type exports pentru TypeScript
 */
export type EnhancedModalOverlayProps = VariantProps<typeof enhancedModalOverlay>;
export type EnhancedModalContentProps = VariantProps<typeof enhancedModalContent>;
export type FullScreenModalProps = VariantProps<typeof fullScreenModal>;

// Re-export primitive types pentru convenience
export type { ModalVariants, ModalContentVariants, ModalContainerVariants } from "../primitives/modal"; 
