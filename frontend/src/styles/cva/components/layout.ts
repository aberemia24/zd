import { cva, type VariantProps } from "class-variance-authority";

/**
 * LAYOUT.TS - Componente de layout, navigație și modal cu CVA
 * Migrare de la componentMap cu Professional Blue Palette
 *
 * Migration Mapping:
 * - layoutComponents.ts → card, modal, container, grid, flex
 * - navigationComponents.ts → tab, sidebar, navbar, breadcrumb, pagination
 * - modalComponents.ts → modal variants
 */

// =============================================================================
// LAYOUT COMPONENTS - Migrated from layoutComponents.ts
// =============================================================================

export const card = cva(
  ["bg-white rounded-lg border", "transition-all duration-150"],
  {
    variants: {
      variant: {
        default: [
          "border border-gray-200 shadow-sm",
          "hover:shadow-md hover:border-gray-300",
        ],
        elevated: ["shadow-md", "hover:shadow-lg"],
        flat: [
          "border border-gray-200",
          "hover:border-gray-300 hover:bg-gray-50",
        ],
        interactive: [
          "border border-gray-200 shadow-sm cursor-pointer",
          "hover:shadow-md hover:border-blue-200",
        ],
      },
      size: {
        sm: "p-3 rounded",
        md: "p-5 rounded-md",
        lg: "p-7 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export const cardHeader = cva([
  "px-5 py-4 border-b border-gray-200",
  "bg-gray-50 font-semibold",
]);

export const cardBody = cva("p-5");

export const cardFooter = cva([
  "px-5 py-4 border-t border-gray-200",
  "bg-gray-50",
]);

export const modal = cva(
  [
    "fixed inset-0 z-50 flex items-center justify-center",
    "transition-all duration-300 ease-in-out"
  ],
  {
    variants: {
      variant: {
        default: "bg-black/50 backdrop-blur-sm",
        subtle: "bg-black/30 backdrop-blur-sm",
        strong: "bg-black/70 backdrop-blur-md",
        confirmation: "bg-black/50 backdrop-blur-sm",
        professional: "bg-black/50 backdrop-blur-sm",
      },
      animation: {
        fade: "animate-in fade-in-0 duration-300",
        scale: "animate-in fade-in-0 zoom-in-95 duration-300",
        slideDown: "animate-in fade-in-0 slide-in-from-top-4 duration-300",
        slideUp: "animate-in fade-in-0 slide-in-from-bottom-4 duration-300",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "fade",
    },
  },
);

export const modalContent = cva(
  [
    "relative bg-white rounded-lg shadow-xl",
    "max-w-md w-full mx-4",
    "transition-all duration-300 ease-in-out"
  ],
  {
    variants: {
      size: {
        sm: "max-w-sm",
        default: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "max-w-full h-full",
      },
      content: {
        dialog: "p-6",
        header: "text-lg font-semibold text-gray-900 mb-4",
        text: "text-gray-600 mb-6",
        compact: "p-4",
      },
    },
    defaultVariants: {
      size: "default",
      content: "dialog",
    },
  },
);

export const container = cva("mx-auto px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      sm: "max-w-4xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

export const grid = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      auto: "grid-cols-auto",
    },
    gap: {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
  },
  defaultVariants: {
    cols: 2,
    gap: "md",
  },
});

export const flex = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col",
      "row-reverse": "flex-row-reverse",
      "col-reverse": "flex-col-reverse",
    },
    wrap: {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
      "wrap-reverse": "flex-wrap-reverse",
    },
    justify: {
      start: "justify-start",
      end: "justify-end",
      center: "justify-center",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    align: {
      start: "items-start",
      end: "items-end", 
      center: "items-center",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
    gap: {
      none: "",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
      "2xl": "gap-12",
    },
    width: {
      auto: "",
      full: "w-full",
      screen: "w-screen",
      fit: "w-fit",
    },
    height: {
      auto: "",
      full: "h-full",
      screen: "h-screen",
      fit: "h-fit",
    },
  },
  defaultVariants: {
    direction: "row",
    gap: "none",
  },
});

export const divider = cva("border-t my-6", {
  variants: {
    variant: {
      light: "border-gray-100",
      default: "border-gray-200",
      dark: "border-gray-300",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// =============================================================================
// NAVIGATION COMPONENTS - Migrated from navigationComponents.ts
// =============================================================================

export const tab = cva(
  ["px-4 py-2 text-sm font-medium", "transition-all duration-150"],
  {
    variants: {
      variant: {
        underline: [
          "border-b-2 border-transparent",
          "hover:border-gray-300 hover:text-gray-700",
        ],
        pill: ["rounded-full", "hover:bg-gray-100 hover:text-gray-700"],
        card: ["rounded-t-lg", "hover:bg-gray-50 hover:text-gray-700"],
      },
      active: {
        true: "",
      },
    },
    compoundVariants: [
      {
        variant: "underline",
        active: true,
        className: "border-b-2 border-blue-500 text-blue-600",
      },
      {
        variant: "pill",
        active: true,
        className: "bg-blue-100 text-blue-700 shadow-sm",
      },
      {
        variant: "card",
        active: true,
        className:
          "bg-white text-blue-600 border-t border-l border-r border-gray-200 shadow-sm",
      },
    ],
    defaultVariants: {
      variant: "underline",
    },
  },
);

export const navbar = cva(
  [
    "bg-white border-b border-gray-200 shadow-sm",
    "transition-all duration-150",
  ],
  {
    variants: {
      variant: {
        default: "bg-white",
        primary: "bg-blue-600 text-white shadow-md",
        transparent: "bg-transparent border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const sidebar = cva(
  [
    "flex flex-col h-full bg-white border-r border-gray-200",
    "transition-all duration-300 shadow-sm",
  ],
  {
    variants: {
      size: {
        sm: "w-64",
        md: "w-72",
        lg: "w-80",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const breadcrumb = cva("flex items-center space-x-2 text-sm");

export const breadcrumbItem = cva(
  ["text-gray-500 transition-colors duration-150", "hover:text-gray-700"],
  {
    variants: {
      active: {
        true: "text-gray-900 font-medium",
      },
    },
  },
);

export const pagination = cva("flex items-center justify-center space-x-1");

export const paginationItem = cva(
  [
    "inline-flex items-center justify-center w-8 h-8 rounded-md",
    "text-sm font-medium transition-colors duration-150",
  ],
  {
    variants: {
      variant: {
        default: "text-gray-600 hover:bg-gray-100",
        active: "bg-blue-100 text-blue-700",
        disabled: "text-gray-300 cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// =============================================================================
// 🚨 CONSOLIDATION: Componentele de mai jos au fost eliminate și înlocuite cu composition
// În loc de pageHeader -> folosește flex({ justify: "between", align: "center" }) + spacing
// În loc de titleSection -> folosește flex({ align: "center", gap: "md" })
// În loc de controlsSection -> folosește flex({ align: "center", gap: "md" })
// În loc de fullscreenIndicator -> folosește badge() sau button() cu positioning
// În loc de spinner -> folosește Loading primitive cu size variants
// =============================================================================

// Note: Componentele de mai jos au fost consolidate în componentele principale
// pentru a evita bloating-ul sistemului CVA conform principiului de composition

// =============================================================================
// TYPE EXPORTS pentru TypeScript autocomplete
// =============================================================================

// Type exports pentru componentele de bază
export type CardProps = VariantProps<typeof card>;
export type ModalProps = VariantProps<typeof modal>;
export type ModalContentProps = VariantProps<typeof modalContent>;
export type ContainerProps = VariantProps<typeof container>;
export type GridProps = VariantProps<typeof grid>;
export type FlexProps = VariantProps<typeof flex>;
export type DividerProps = VariantProps<typeof divider>;
export type TabProps = VariantProps<typeof tab>;
export type NavbarProps = VariantProps<typeof navbar>;
export type SidebarProps = VariantProps<typeof sidebar>;
export type BreadcrumbItemProps = VariantProps<typeof breadcrumbItem>;
export type PaginationItemProps = VariantProps<typeof paginationItem>;

// 🚨 CONSOLIDATION NOTE: 
// Type exports pentru componentele specifice eliminate - folosiți composition cu:
// - pageHeader -> flex({ justify: "between", align: "center" })
// - titleSection -> flex({ align: "center", gap: "md" })
// - controlsSection -> flex({ align: "center", gap: "md" })
// - fullscreenIndicator -> badge() + absolute positioning
// - spinner -> Loading primitive
// - formSelect/formInput -> Select/Input primitives
