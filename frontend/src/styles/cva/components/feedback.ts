import { cva, type VariantProps } from "class-variance-authority";

/**
 * FEEDBACK.TS - Componente de feedback și utility cu CVA
 * Migrare de la componentMap cu Professional Blue Palette
 *
 * Migration Mapping:
 * - feedbackComponents.ts → badge, alert, toast
 * - utilityComponents.ts → dropdown, loader, pill
 */

// =============================================================================
// FEEDBACK COMPONENTS - Migrated from feedbackComponents.ts
// =============================================================================

export const badge = cva(
  [
    "inline-flex items-center justify-center font-medium rounded-full",
    "text-xs leading-4 whitespace-nowrap",
    "transition-colors duration-150",
    "border",
  ],
  {
    variants: {
      variant: {
        // Professional Blue Palette - eliminat gradient-urile
        primary: [
          "bg-blue-50 text-blue-800 border-blue-200",
          "hover:bg-blue-100",
        ],
        secondary: [
          "bg-gray-50 text-gray-800 border-gray-200",
          "hover:bg-gray-100",
        ],
        success: [
          "bg-emerald-50 text-emerald-800 border-emerald-200",
          "hover:bg-emerald-100",
        ],
        error: ["bg-red-50 text-red-800 border-red-200", "hover:bg-red-100"],
        warning: [
          "bg-yellow-50 text-yellow-800 border-yellow-200",
          "hover:bg-yellow-100",
        ],
      },
      size: {
        xs: "px-1.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1 text-base",
      },
      pulse: {
        true: "animate-pulse",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  },
);

export const alert = cva(
  [
    "relative rounded-lg p-4 text-sm",
    "transition-colors duration-150",
    "flex items-start space-x-3",
    "border-l-4",
  ],
  {
    variants: {
      variant: {
        // Simplified design - fără gradient-uri
        info: ["bg-blue-50 border-blue-500 text-blue-800"],
        success: ["bg-emerald-50 border-emerald-500 text-emerald-800"],
        warning: ["bg-yellow-50 border-yellow-500 text-yellow-800"],
        error: ["bg-red-50 border-red-500 text-red-800"],
      },
      size: {
        sm: "p-3 text-xs rounded-md",
        md: "p-4 text-sm rounded-lg",
        lg: "p-5 text-base rounded-xl",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "md",
    },
  },
);

export const toast = cva(
  [
    "rounded-lg shadow-lg border-l-4 p-4 max-w-sm w-full",
    "pointer-events-auto",
    "transform transition-all duration-300 ease-in-out",
    "translate-y-0 opacity-100",
  ],
  {
    variants: {
      variant: {
        info: "bg-blue-50 border-blue-500 text-blue-800",
        success: "bg-emerald-50 border-emerald-500 text-emerald-800",
        warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
        error: "bg-red-50 border-red-500 text-red-800",
      },
      position: {
        topRight: "fixed top-4 right-4 z-50",
        topLeft: "fixed top-4 left-4 z-50",
        bottomRight: "fixed bottom-4 right-4 z-50",
        bottomLeft: "fixed bottom-4 left-4 z-50",
        topCenter: "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
        bottomCenter: "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
      },
    },
    defaultVariants: {
      variant: "info",
      position: "topRight",
    },
  },
);

// =============================================================================
// UTILITY COMPONENTS - Migrated from utilityComponents.ts
// =============================================================================

export const dropdown = cva(
  [
    "absolute z-10 mt-1 rounded-md bg-white shadow-lg",
    "ring-1 ring-black ring-opacity-5",
    "focus:outline-none",
    "transform transition-all duration-150 ease-out",
    "origin-top-right opacity-100 scale-100",
  ],
  {
    variants: {
      size: {
        sm: "w-48",
        md: "w-56",
        lg: "w-64",
        xl: "w-72",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const dropdownItem = cva(
  [
    "block px-4 py-2 text-sm text-gray-700",
    "transition-colors duration-150",
    "hover:bg-gray-50 hover:text-gray-900",
    "focus:bg-gray-50 focus:text-gray-900 focus:outline-none",
  ],
  {
    variants: {
      variant: {
        default: "",
        active: "bg-blue-50 text-blue-900",
        danger: "text-red-600 hover:bg-red-50 hover:text-red-700",
      },
      disabled: {
        true: "text-gray-400 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const loader = cva("animate-spin", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    },
    color: {
      primary: "text-blue-600",
      secondary: "text-gray-500",
      white: "text-white",
    },
  },
  defaultVariants: {
    size: "md",
    color: "primary",
  },
});

export const pill = cva(
  [
    "inline-flex items-center justify-center rounded-full",
    "text-xs font-medium",
    "transition-colors duration-150",
  ],
  {
    variants: {
      variant: {
        // Professional Blue Palette - fără gradient-uri
        primary: ["bg-blue-100 text-blue-800", "hover:bg-blue-200"],
        secondary: ["bg-gray-100 text-gray-800", "hover:bg-gray-200"],
        success: ["bg-emerald-100 text-emerald-800", "hover:bg-emerald-200"],
        error: ["bg-red-100 text-red-800", "hover:bg-red-200"],
        warning: ["bg-yellow-100 text-yellow-800", "hover:bg-yellow-200"],
      },
      size: {
        sm: "px-2 py-0.5",
        md: "px-2.5 py-1",
        lg: "px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  },
);

// =============================================================================
// FORM UTILITY COMPONENTS
// =============================================================================

export const formGroup = cva("flex flex-col transition-all duration-150", {
  variants: {
    variant: {
      default: "space-y-1.5 mb-4",
      inline: "sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 mb-4",
      grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const formError = cva([
  "text-red-600 text-xs mt-1",
  "transition-all duration-150 opacity-100",
]);

// =============================================================================
// SPECIAL EFFECTS (simplified)
// =============================================================================

export const glassEffect = cva(
  ["backdrop-blur-md border", "transition-all duration-150"],
  {
    variants: {
      variant: {
        light: "bg-white/70 border-white/20",
        dark: "bg-gray-900/70 border-gray-700/20 text-white",
      },
    },
    defaultVariants: {
      variant: "light",
    },
  },
);

// =============================================================================
// TYPE EXPORTS pentru TypeScript autocomplete
// =============================================================================

export type BadgeProps = VariantProps<typeof badge>;
export type AlertProps = VariantProps<typeof alert>;
export type ToastProps = VariantProps<typeof toast>;
export type DropdownProps = VariantProps<typeof dropdown>;
export type DropdownItemProps = VariantProps<typeof dropdownItem>;
export type LoaderProps = VariantProps<typeof loader>;
export type PillProps = VariantProps<typeof pill>;
export type FormGroupProps = VariantProps<typeof formGroup>;
export type GlassEffectProps = VariantProps<typeof glassEffect>;
