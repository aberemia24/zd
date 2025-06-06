/**
 * 🎨 CORE TYPES - Carbon Copper Design System
 * Definițiile de tipuri partajate pentru întregul sistem CVA
 */

/**
 * Tipuri pentru culorile din Carbon Copper palette
 */
export type ColorType = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'neutral';

/**
 * Tipuri pentru dimensiuni standard
 */
export type SizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Tipuri pentru variante comune
 */
export type VariantType = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

/**
 * Tipuri pentru stări interactive
 */
export type StateType = 'default' | 'hover' | 'focus' | 'active' | 'disabled';

/**
 * Tipuri pentru intensitatea efectelor
 */
export type IntensityType = 'subtle' | 'normal' | 'strong';

/**
 * Tipuri pentru layout și spacing
 */
export type SpacingType = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Tipuri pentru typography
 */
export type FontWeightType = 'normal' | 'medium' | 'semibold' | 'bold';
export type FontSizeType = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';

/**
 * Tipuri pentru animații
 */
export type AnimationType = 'bounce-subtle' | 'scale-in' | 'fade-in' | 'slide-up';

/**
 * Tipuri pentru orientare și direcție
 */
export type DirectionType = 'horizontal' | 'vertical';
export type AlignmentType = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type JustifyType = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

/**
 * Base props pentru toate componentele CVA
 */
export interface BaseComponentProps {
  className?: string;
}

/**
 * Props pentru componente care suportă culori
 */
export interface ColorableProps extends BaseComponentProps {
  color?: ColorType;
}

/**
 * Props pentru componente cu dimensiuni
 */
export interface SizableProps extends BaseComponentProps {
  size?: SizeType;
}

/**
 * Props pentru componente cu variante
 */
export interface VariantProps extends BaseComponentProps {
  variant?: VariantType;
} 
