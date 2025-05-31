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
    "transition-opacity duration-300 ease-out",
  ],
  {
    variants: {
      overlay: {
        default: "bg-black bg-opacity-50",
        blur: "backdrop-blur-sm bg-black bg-opacity-30",
      },
    },
    defaultVariants: {
      overlay: "default",
    },
  },
);

export const modalContent = cva(
  [
    "bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-auto",
    "transform transition-all duration-300 ease-out",
    "scale-100 opacity-100 translate-y-0",
  ],
  {
    variants: {
      size: {
        sm: "w-full max-w-md",
        md: "w-full max-w-lg",
        lg: "w-full max-w-2xl",
        xl: "w-full max-w-4xl",
        full: "w-full max-w-full h-full rounded-none",
      },
    },
    defaultVariants: {
      size: "md",
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
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    },
    gap: {
      sm: "gap-1",
      md: "gap-2",
      lg: "gap-4",
      xl: "gap-6",
    },
  },
  defaultVariants: {
    direction: "row",
    align: "center",
    gap: "md",
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
// LUNAR GRID PAGE COMPONENTS - New components pentru LunarGridPage audit fix
// =============================================================================

/**
 * Header principal pentru pagina LunarGrid cu variante pentru different states
 */
export const pageHeader = cva("", {
  variants: {
    layout: {
      default: "flex flex-col md:flex-row justify-between items-center mb-6",
      fullscreen: "flex flex-col md:flex-row justify-between items-center mb-4",
      compact: "flex flex-col md:flex-row justify-between items-center mb-4"
    },
    padding: {
      default: "px-4",
      none: "",
      sm: "px-2",
      lg: "px-6"
    }
  },
  defaultVariants: {
    layout: "default",
    padding: "default"
  }
});

/**
 * Indicator pentru fullscreen mode cu professional styling
 */
export const fullscreenIndicator = cva([
  "absolute top-1 right-1 z-10 text-xs text-gray-500 bg-white/90 px-2 py-1 rounded-md shadow-sm",
  "transition-all duration-200"
], {
  variants: {
    variant: {
      default: "",
      pro: "backdrop-blur-sm border border-gray-200/60"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

/**
 * Backdrop pentru fullscreen mode
 */
export const fullscreenBackdrop = cva([
  "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all duration-300"
], {
  variants: {
    variant: {
      default: "",
      subtle: "bg-black/10",
      strong: "bg-black/30"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

/**
 * Container pentru title și loading indicator
 */
export const titleSection = cva("flex items-center space-x-3", {
  variants: {
    variant: {
      default: "",
      professional: "flex items-center gap-3"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

/**
 * Styling pentru page title
 */
export const pageTitle = cva("text-3xl font-bold text-gray-900", {
  variants: {
    variant: {
      default: "",
      professional: "text-professional-heading contrast-enhanced",
      large: "text-4xl"
    },
    weight: {
      normal: "font-semibold",
      bold: "font-bold",
      heavy: "font-black"
    }
  },
  defaultVariants: {
    variant: "default",
    weight: "bold"
  }
});

/**
 * Loading indicator pentru transitions
 */
export const transitionLoader = cva("flex items-center text-sm text-blue-600", {
  variants: {
    variant: {
      default: "",
      professional: "flex items-center gap-2 text-professional-body",
      subtle: "text-gray-500"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

/**
 * Spinner pentru loading states
 */
export const spinner = cva("animate-spin rounded-full border-2 border-t-transparent", {
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12"
    },
    color: {
      primary: "border-blue-600",
      professional: "border-primary-500",
      gray: "border-gray-400"
    }
  },
  defaultVariants: {
    size: "sm",
    color: "primary"
  }
});

/**
 * Controls section pentru navigare și layout toggle
 */
export const controlsSection = cva("flex items-center space-x-4 mt-4 md:mt-0", {
  variants: {
    variant: {
      default: "",
      professional: "flex items-center gap-4 mt-4 md:mt-0",
      compact: "flex items-center gap-2 mt-2 md:mt-0"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

/**
 * Form elements styling pentru selectors
 */
export const formSelect = cva([
  "form-select rounded-md border-gray-300 text-sm",
  "focus:border-primary-500 focus:ring-primary-500",
  "transition-colors duration-150"
], {
  variants: {
    variant: {
      default: "",
      professional: "border-gray-200 bg-white shadow-sm hover:border-gray-300",
      minimal: "border-transparent bg-gray-50"
    },
    size: {
      sm: "text-xs py-1 px-2",
      md: "text-sm py-2 px-3",
      lg: "text-base py-3 px-4"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md"
  }
});

export const formInput = cva([
  "form-input rounded-md border-gray-300 text-sm",
  "focus:border-primary-500 focus:ring-primary-500",
  "transition-colors duration-150"
], {
  variants: {
    variant: {
      default: "",
      professional: "border-gray-200 bg-white shadow-sm hover:border-gray-300",
      minimal: "border-transparent bg-gray-50"
    },
    size: {
      sm: "text-xs py-1 px-2",
      md: "text-sm py-2 px-3", 
      lg: "text-base py-3 px-4"
    },
    width: {
      auto: "",
      sm: "w-16",
      md: "w-24",
      lg: "w-32",
      full: "w-full"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    width: "auto"
  }
});

/**
 * Loading state container
 */
export const loadingContainer = cva("flex justify-center items-center", {
  variants: {
    padding: {
      sm: "py-4",
      md: "py-8",
      lg: "py-12"
    },
    layout: {
      default: "",
      fullscreen: "py-8",
      compact: "py-4"
    },
    spacing: {
      default: "px-4",
      none: "",
      auto: ""
    }
  },
  defaultVariants: {
    padding: "md",
    layout: "default",
    spacing: "default"
  }
});

/**
 * Loading message text
 */
export const loadingText = cva("ml-3 text-gray-700", {
  variants: {
    variant: {
      default: "",
      professional: "text-professional-body",
      muted: "text-gray-500"
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md"
  }
});

/**
 * Content wrapper cu padding condițional
 */
export const contentWrapper = cva("", {
  variants: {
    padding: {
      default: "px-4",
      none: "",
      conditional: "" // va fi setat dinamic
    }
  },
  defaultVariants: {
    padding: "default"
  }
});

/**
 * Label responsiv pentru text scurt pe dispozitive mici
 */
export const responsiveLabel = cva("hidden sm:inline", {
  variants: {
    variant: {
      default: "",
      professional: "text-professional-body font-medium"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

/**
 * Button styling extensions pentru layout modes
 */
export const layoutButton = cva("flex items-center gap-2 transition-all duration-200", {
  variants: {
    state: {
      default: "hover:bg-blue-50",
      active: "ring-2 ring-blue-300 bg-blue-50",
      professional: "hover:bg-gray-50 focus:ring-2 focus:ring-primary-200"
    }
  },
  defaultVariants: {
    state: "default"
  }
});

// =============================================================================
// TYPE EXPORTS pentru TypeScript autocomplete
// =============================================================================

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

// Type exports pentru noile componente LunarGridPage
export type PageHeaderProps = VariantProps<typeof pageHeader>;
export type FullscreenIndicatorProps = VariantProps<typeof fullscreenIndicator>;
export type FullscreenBackdropProps = VariantProps<typeof fullscreenBackdrop>;
export type TitleSectionProps = VariantProps<typeof titleSection>;
export type PageTitleProps = VariantProps<typeof pageTitle>;
export type TransitionLoaderProps = VariantProps<typeof transitionLoader>;
export type SpinnerProps = VariantProps<typeof spinner>;
export type ControlsSectionProps = VariantProps<typeof controlsSection>;
export type FormSelectProps = VariantProps<typeof formSelect>;
export type FormInputProps = VariantProps<typeof formInput>;
export type LoadingContainerProps = VariantProps<typeof loadingContainer>;
export type LoadingTextProps = VariantProps<typeof loadingText>;
export type ContentWrapperProps = VariantProps<typeof contentWrapper>;
export type ResponsiveLabelProps = VariantProps<typeof responsiveLabel>;
export type LayoutButtonProps = VariantProps<typeof layoutButton>;
