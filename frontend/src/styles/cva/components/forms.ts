import { cva, type VariantProps } from "class-variance-authority";

/**
 * FORMS.TS - Componente de acțiune și formular cu CVA
 * Migrare de la componentMap cu Professional Blue Palette
 *
 * Migration Mapping:
 * - actionComponents.ts → button, buttonGroup
 * - formComponents.ts → input, select, textarea, checkbox, label
 */

// =============================================================================
// BUTTON COMPONENT - Migrated from actionComponents.ts
// =============================================================================

export const button = cva(
  // Base classes - subtle și moderne conform creative decisions
  [
    "inline-flex items-center justify-center font-medium",
    "transition-colors duration-150", // Reduced from 200ms
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        // Professional Blue Palette principal
        primary: [
          "bg-blue-600 text-white", // Changed from gradient to solid blue
          "hover:bg-blue-700",
          "focus-visible:ring-blue-500",
        ],
        secondary: [
          "bg-white text-gray-900 border border-gray-200",
          "hover:bg-gray-50",
          "focus-visible:ring-gray-500",
        ],
        success: [
          "bg-emerald-600 text-white", // Changed to emerald
          "hover:bg-emerald-700",
          "focus-visible:ring-emerald-500",
        ],
        danger: [
          "bg-red-600 text-white",
          "hover:bg-red-700",
          "focus-visible:ring-red-500",
        ],
        ghost: [
          "bg-transparent text-gray-600",
          "hover:bg-gray-50",
          "focus-visible:ring-gray-500",
        ],
        outline: [
          "bg-transparent border border-gray-300 text-gray-700",
          "hover:bg-gray-50",
          "focus-visible:ring-gray-500",
        ],
        link: [
          "bg-transparent text-blue-600 underline",
          "hover:text-blue-700",
          "focus-visible:ring-blue-500",
        ],
      },
      size: {
        xs: "h-7 px-2 text-xs rounded",
        sm: "h-8 px-3 text-sm rounded-md",
        md: "h-10 px-4 text-sm rounded-md",
        lg: "h-11 px-8 text-base rounded-lg",
        xl: "h-12 px-8 text-lg rounded-lg",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export const buttonGroup = cva("inline-flex", {
  variants: {
    variant: {
      attached: [
        "[&>*:not(:first-child)]:-ml-px",
        "[&>*:not(:first-child)]:rounded-l-none",
        "[&>*:not(:last-child)]:rounded-r-none",
        "[&>*:focus-visible]:relative [&>*:focus-visible]:z-10",
      ],
      spaced: "space-x-2",
    },
  },
  defaultVariants: {
    variant: "spaced",
  },
});

// =============================================================================
// FORM COMPONENTS - Migrated from formComponents.ts
// =============================================================================

export const inputWrapper = cva("relative flex flex-col", {
  variants: {
    size: {
      sm: "space-y-1",
      md: "space-y-1.5",
      lg: "space-y-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const label = cva("block text-sm font-medium text-gray-700", {
  variants: {
    variant: {
      default: "text-gray-700",
      success: "text-emerald-700",
      error: "text-red-700",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
    required: {
      true: "after:content-['*'] after:ml-1 after:text-red-500",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export const input = cva(
  [
    "w-full rounded-md border bg-white px-3 py-2 text-sm",
    "placeholder:text-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
    "transition-colors duration-150",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-gray-300 text-gray-900",
          "hover:border-gray-400",
          "focus:border-blue-500 focus:ring-blue-500",
        ],
        success: [
          "border-emerald-300 text-gray-900",
          "hover:border-emerald-400",
          "focus:border-emerald-500 focus:ring-emerald-500",
        ],
        error: [
          "border-red-300 text-gray-900",
          "hover:border-red-400",
          "focus:border-red-500 focus:ring-red-500",
        ],
      },
      size: {
        sm: "h-8 px-2.5 py-1.5 text-sm",
        md: "h-10 px-3 py-2 text-sm",
        lg: "h-11 px-4 py-2.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export const select = cva(
  [
    "w-full rounded-md border bg-white px-3 py-2 text-sm pr-8",
    "bg-no-repeat bg-right bg-[length:1em_1em]",
    "bg-[url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")]",
    "appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
    "transition-colors duration-150",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-gray-300 text-gray-900",
          "hover:border-gray-400",
          "focus:border-blue-500 focus:ring-blue-500",
        ],
        success: [
          "border-emerald-300 text-gray-900",
          "hover:border-emerald-400",
          "focus:border-emerald-500 focus:ring-emerald-500",
        ],
        error: [
          "border-red-300 text-gray-900",
          "hover:border-red-400",
          "focus:border-red-500 focus:ring-red-500",
        ],
      },
      size: {
        sm: "h-8 px-2.5 py-1.5 text-sm",
        md: "h-10 px-3 py-2 text-sm",
        lg: "h-11 px-4 py-2.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export const textarea = cva(
  [
    "w-full min-h-[100px] rounded-md border bg-white px-3 py-2 text-sm",
    "placeholder:text-gray-400 resize-vertical",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
    "transition-colors duration-150",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-gray-300 text-gray-900",
          "hover:border-gray-400",
          "focus:border-blue-500 focus:ring-blue-500",
        ],
        success: [
          "border-emerald-300 text-gray-900",
          "hover:border-emerald-400",
          "focus:border-emerald-500 focus:ring-emerald-500",
        ],
        error: [
          "border-red-300 text-gray-900",
          "hover:border-red-400",
          "focus:border-red-500 focus:ring-red-500",
        ],
      },
      size: {
        sm: "px-2.5 py-2 text-sm",
        md: "px-3 py-2.5 text-sm",
        lg: "px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export const checkbox = cva(
  [
    "h-4 w-4 rounded border text-blue-600",
    "focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "border-gray-300",
        success: "border-emerald-300 text-emerald-600 focus:ring-emerald-500",
        error: "border-red-300 text-red-600 focus:ring-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// =============================================================================
// TYPE EXPORTS pentru TypeScript autocomplete
// =============================================================================

export type ButtonProps = VariantProps<typeof button>;
export type ButtonGroupProps = VariantProps<typeof buttonGroup>;
export type InputProps = VariantProps<typeof input>;
export type SelectProps = VariantProps<typeof select>;
export type TextareaProps = VariantProps<typeof textarea>;
export type CheckboxProps = VariantProps<typeof checkbox>;
export type LabelProps = VariantProps<typeof label>;
