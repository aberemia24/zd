/**
 * 🎨 FOUNDATIONS MODULE - Carbon Copper Design System
 * Barrel exports pentru typography, animations și effects
 */

// Typography
export {
  textProfessional,
  headingProfessional,
  labelProfessional,
  captionProfessional,
  fontFinancial,
  type TextProfessionalProps,
  type HeadingProfessionalProps,
  type LabelProfessionalProps,
  type CaptionProfessionalProps,
  type FontFinancialProps
} from './typography';

// Animations & Interactions
export { hoverScale, focusRing, animations } from './animations';
export type { HoverScaleProps, FocusRingProps, AnimationsProps } from './animations';

// Feedback Animations
export { 
  toastAnimations, 
  modalAnimations, 
  modalOverlayAnimations, 
  alertAnimations, 
  loadingAnimations, 
  accessibleAnimations, 
  focusAnimations 
} from './feedback-animations';
export type { 
  ToastAnimationsProps, 
  ModalAnimationsProps, 
  ModalOverlayAnimationsProps, 
  AlertAnimationsProps, 
  LoadingAnimationsProps, 
  AccessibleAnimationsProps, 
  FocusAnimationsProps 
} from './feedback-animations';

// Visual Effects
export { ambientGlow, glassEffect } from './effects';
export type { AmbientGlowProps, GlassEffectProps } from './effects';

// Interactive States
export { hoverBackground, interactiveText, interactiveBorder } from './interactive';
export type { HoverBackgroundProps, InteractiveTextProps, InteractiveBorderProps } from './interactive';

// 🎯 Layout Constants - pentru pozitionare și spacing consistent
export const LAYOUT_CONSTANTS = {
  MODAL: {
    OVERLAY: {
      BASE_CLASS: 'fixed inset-0 bg-black',
      OPACITY: {
        SUBTLE: 'bg-opacity-10',     // Extra subtil pentru momente non-intruzive  
        DEFAULT: 'bg-opacity-30',    // Mărit pentru mai bună vizibilitate
        MEDIUM: 'bg-opacity-35',     // Pentru modaluri importante
        STRONG: 'bg-opacity-45'      // Pentru acțiuni critice
      }
    },
    Z_INDEX: {
      OVERLAY: 'z-40',        // Layer pentru overlay
      MODAL: 'z-50',          // Layer pentru modal content
      POPUP: 'z-60'           // Layer pentru popups/tooltips peste modal
    },
    POSITIONING: {
      OFFSET: 12,             // Spațiu între celulă și modal
      ESTIMATED_WIDTH: 320,   // Lățime estimată modal pentru calcule
      ESTIMATED_HEIGHT: 400   // Înălțime estimată modal pentru calcule
    }
  }
} as const; 
