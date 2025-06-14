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

// Extended ColorScale pentru Carbon (include 950 pentru True Black)
export type ExtendedColorScale = ColorScale & {
  950: string;
};

export type ThemeColors = {
  // Noile culori Carbon Copper Extended
  carbon: ExtendedColorScale;  // Primary black/gray scale
  copper: ColorScale;          // Primary accent color
  emerald: ColorScale;         // Success color
  ruby: ColorScale;           // Error color  
  amber: ColorScale;          // Warning color
  
  // Alias pentru compatibilitate cu codul existent
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  gray: ColorScale;
  background: string;
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
  "2xl": string;
  "3xl": string;
  "4xl": string;
};

export type Shadows = {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  glow: string;
  "glow-lg": string;
};

export type BorderRadius = {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
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
    "2xl": string;
    "3xl": string;
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
  layout: {
    formRow: string;
    buttonGroup: string;
  };
  components: ThemeComponents;
};

// --- COMPONENTS TOKENS ---
export type ThemeComponents = {
  button: {
    base?: string;
    disabled?: string;
    states?: {
      disabled?: string;
      [key: string]: string | undefined;
    };
    variants?: {
      [key: string]: string | undefined;
    };
    sizes?: {
      [key: string]: string | undefined;
    };
  };
  input: {
    base?: string;
    error?: string;
    states?: {
      error?: string;
      disabled?: string;
      [key: string]: string | undefined;
    };
    variants?: {
      [key: string]: string | undefined;
    };
    sizes?: {
      [key: string]: string | undefined;
    };
  };
  formGroup?: string;
  formLabel?: string;
  formError?: string;
  checkbox: {
    base?: string;
    error?: string;
    label?: string;
    [key: string]: string | undefined;
  };
  badge: {
    base?: string;
    variants?: {
      [key: string]: string | undefined;
    };
  };
  alert: {
    base?: string;
    variants?: {
      [key: string]: string | undefined;
    };
  };
  loader: {
    container?: string;
    svg?: string;
    circle?: string;
    path?: string;
    text?: string;
    [key: string]: string | undefined;
  };
  text?: {
    variants?: { [key: string]: string | undefined };
  };
  spacing?: {
    variants?: { [key: string]: string | undefined };
  };
};

// Tipuri pentru componente
export type ComponentState =
  | "default"
  | "hover"
  | "active"
  | "focus"
  | "disabled"
  | "readonly"
  | "loading"
  | "error"
  | "success"
  | "required"
  | "selected"
  | "pulse";

export type ComponentType =
  | "button"
  | "input"
  | "select"
  | "textarea"
  | "checkbox"
  | "radio"
  | "badge"
  | "alert"
  | "loader"
  | "card"
  | "card-section"
  | "list-container"
  | "list-item"
  | "table"
  | "form-group"
  | "form-label"
  | "form-error"
  | "checkbox-group"
  | "checkbox-label"
  | "container"
  | "grid"
  | "flex"
  | "flex-group"
  | "form-container"
  | "navbar"
  | "sidebar"
  | "modal"
  | "toast"
  | "tab"
  | "dropdown"
  | "pill"
  | "button-group"
  | "input-group"
  | "radio-group"
  | "radio-label"
  | "card-header"
  | "card-body"
  | "card-footer"
  | "form-success-message"
  | "form-error-message"
  | "table-container"
  | "table-header"
  | "table-cell"
  | "table-row"
  | "modal-content"
  | "modal-header"
  | "modal-body"
  | "modal-footer"
  | "sidebar-header"
  | "sidebar-content"
  | "sidebar-footer"
  | "navbar-container"
  | "toast-container"
  | "dropdown-item"
  | "tab-panel"
  | "tab-panels"
  | "button-state"
  | "input-state"
  | "loader-svg"
  | "loader-circle"
  | "loader-path"
  | "loader-text"
  | "loader-container"
  | "badge-variant"
  | "alert-variant"
  | "transaction-form"
  | "indicator"
  | "section-header"
  | "text"
  | "spacing";

export type ComponentVariant =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "danger"
  | "ghost"
  | "outline"
  | "link"
  | "default"
  | "elevated"
  | "flat"
  | "interactive"
  | "vertical"
  | "inline"
  | "grid"
  | "attached"
  | "spaced"
  | "cols1"
  | "cols2"
  | "cols3"
  | "cols4"
  | "row"
  | "col"
  | "rowReverse"
  | "colReverse"
  | "wrap"
  | "nowrap"
  | "striped"
  | "bordered"
  | "blur"
  | "topRight"
  | "topLeft"
  | "bottomRight"
  | "bottomLeft"
  | "topCenter"
  | "bottomCenter"
  | "active"
  | "disabled"
  | "underline"
  | "pill"
  | "card"
  | "light"
  | "dark"
  | "accent"
  | "small"
  | "section"
  | "center"
  | "between"
  | "start"
  | "around"
  | "column"
  | "column-start"
  | "compact"
  | "loose"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "expandable"
  | "dismissible"
  | "border"
  | "shadow"
  | "xs"
  | "center"
  | "between"
  | "start"
  | "around"
  | "column"
  | "column-start"
  | "end";

export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

export type ComponentClasses = string;
