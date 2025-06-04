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