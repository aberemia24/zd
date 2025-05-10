// Tipuri pentru sistemul de design tokens
// Toate tipurile de bază pentru theme și tokens

// themeTypes.ts
// Tipuri pentru sistemul de design tokens (minimal, semantic, extensibil)

export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export type ThemeColors = {
  primary: ColorScale;
  secondary: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  gray: ColorScale;
  white: string;
  black: string;
};

export type Spacing = {
  0: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
};

export type Shadows = {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
};

export type BorderRadius = {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
};

export type Typography = {
  fontFamily: {
    sans: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
};

export type Theme = {
  colors: ThemeColors;
  spacing: Spacing;
  shadows: Shadows;
  borderRadius: BorderRadius;
  typography: Typography;
  // Extensibil pentru viitor
  [key: string]: any;
};

// Tipuri pentru componente
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentClasses = string;

