import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎨 FEEDBACK PRIMITIVES - Carbon Copper Design System
 * Componente pentru feedback vizual și labeling
 */

/**
 * Badge pentru status și categorii
 */
export const badge = cva([
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  "transition-colors duration-200"
], {
  variants: {
    variant: {
      primary: "bg-copper-500/10 text-copper-600 dark:bg-copper-400/20 dark:text-copper-300",
      secondary: "bg-carbon-500/10 text-carbon-700 dark:bg-carbon-400/20 dark:text-carbon-300",
      success: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-300", 
      warning: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/20 dark:text-amber-300",
      neutral: "bg-carbon-200/50 text-carbon-800 dark:bg-carbon-700/50 dark:text-carbon-200"
    }
  },
  defaultVariants: { variant: "neutral" }
});

/**
 * Label pentru form fields
 */
export const label = cva([
  "text-sm font-medium leading-none",
  "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
], {
  variants: {
    variant: {
      default: "text-carbon-900 dark:text-carbon-100",
      error: "text-red-600 dark:text-red-400",
      success: "text-emerald-600 dark:text-emerald-400",
      muted: "text-carbon-500 dark:text-carbon-400"
    },
    required: {
      true: "after:content-['*'] after:ml-0.5 after:text-red-600 dark:after:text-red-400",
      false: ""
    }
  },
  defaultVariants: { variant: "default", required: false }
});

/**
 * Input wrapper pentru spacing consistent
 */
export const inputWrapper = cva([
  "space-y-2"
], {
  variants: {
    variant: {
      default: "",
      compact: "space-y-1",
      spacious: "space-y-3"
    }
  },
  defaultVariants: { variant: "default" }
});

/**
 * 💬 TOOLTIP COMPONENT
 * Tooltip pentru informații suplimentare cu Carbon Copper styling
 */
export const tooltip = cva([
  // Base styles
  "absolute z-50 px-3 py-2 text-sm font-medium",
  "bg-neutral-900 dark:bg-neutral-100",
  "text-neutral-100 dark:text-neutral-900",
  "rounded-md shadow-lg",
  "pointer-events-none",
  "transition-all duration-200",
  "max-w-xs break-words",
  
  // Arrow styles (will be positioned via data attributes)
  "before:content-[''] before:absolute before:w-2 before:h-2",
  "before:bg-neutral-900 dark:before:bg-neutral-100",
  "before:rotate-45",
], {
  variants: {
    placement: {
      top: [
        "mb-2",
        "before:top-full before:left-1/2 before:-translate-x-1/2 before:-mt-1"
      ],
      bottom: [
        "mt-2", 
        "before:bottom-full before:left-1/2 before:-translate-x-1/2 before:-mb-1"
      ],
      left: [
        "mr-2",
        "before:left-full before:top-1/2 before:-translate-y-1/2 before:-ml-1"
      ],
      right: [
        "ml-2",
        "before:right-full before:top-1/2 before:-translate-y-1/2 before:-mr-1"
      ],
    },
    variant: {
      default: [
        "bg-neutral-900 dark:bg-neutral-100",
        "text-neutral-100 dark:text-neutral-900",
        "before:bg-neutral-900 dark:before:bg-neutral-100"
      ],
      info: [
        "bg-blue-600 dark:bg-blue-500",
        "text-white",
        "before:bg-blue-600 dark:before:bg-blue-500"
      ],
      warning: [
        "bg-amber-600 dark:bg-amber-500", 
        "text-white",
        "before:bg-amber-600 dark:before:bg-amber-500"
      ],
      error: [
        "bg-red-600 dark:bg-red-500",
        "text-white", 
        "before:bg-red-600 dark:before:bg-red-500"
      ],
      success: [
        "bg-green-600 dark:bg-green-500",
        "text-white",
        "before:bg-green-600 dark:before:bg-green-500"
      ]
    }
  },
  defaultVariants: {
    placement: "top",
    variant: "default"
  }
});

export interface TooltipProps extends VariantProps<typeof tooltip> {
  content: string;
  children: React.ReactNode;
  delay?: number;
  disabled?: boolean;
}

/**
 * 📊 PROGRESS COMPONENT
 * Progress bar pentru tracking progres cu Carbon Copper styling
 */
export const progressContainer = cva([
  "w-full bg-neutral-200 dark:bg-neutral-700",
  "rounded-full overflow-hidden",
  "transition-all duration-300"
], {
  variants: {
    size: {
      sm: "h-1",
      md: "h-2", 
      lg: "h-3",
      xl: "h-4"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

export const progressBar = cva([
  "h-full transition-all duration-500 ease-out",
  "rounded-full"
], {
  variants: {
    variant: {
      default: "bg-blue-600 dark:bg-blue-500",
      success: "bg-green-600 dark:bg-green-500", 
      warning: "bg-amber-600 dark:bg-amber-500",
      error: "bg-red-600 dark:bg-red-500",
      financial: "bg-copper-600 dark:bg-copper-500"
    },
    animated: {
      true: "bg-gradient-to-r from-current to-current bg-[length:200%_100%] animate-pulse",
      false: ""
    }
  },
  defaultVariants: {
    variant: "default",
    animated: false
  }
});

export const progressLabel = cva([
  "text-sm font-medium",
  "text-neutral-700 dark:text-neutral-300"
], {
  variants: {
    position: {
      top: "mb-2",
      bottom: "mt-2", 
      inline: "inline-block mr-3"
    }
  },
  defaultVariants: {
    position: "top"
  }
});

export interface ProgressContainerProps extends VariantProps<typeof progressContainer> {}
export interface ProgressBarProps extends VariantProps<typeof progressBar> {}
export interface ProgressLabelProps extends VariantProps<typeof progressLabel> {}

/**
 * Type exports pentru TypeScript
 */
export type BadgeProps = VariantProps<typeof badge>;
export type LabelProps = VariantProps<typeof label>;
export type InputWrapperProps = VariantProps<typeof inputWrapper>;

/**
 * 🍞 TOAST COMPONENT
 * Toast pentru notificări temporare cu Carbon Copper styling
 */
export const toastContainer = cva([
  // Base styles
  "fixed z-50 flex flex-col gap-2 p-4 pointer-events-none",
  "transition-all duration-300 ease-in-out"
], {
  variants: {
    position: {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "top-center": "top-4 left-1/2 -translate-x-1/2",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "bottom-center": "bottom-4 left-1/2 -translate-x-1/2"
    }
  },
  defaultVariants: { position: "top-right" }
});

export const toast = cva([
  // Base styles
  "relative flex items-center gap-3 p-4 rounded-lg shadow-lg",
  "min-w-[300px] max-w-md pointer-events-auto",
  "border border-neutral-200 dark:border-neutral-700",
  "backdrop-blur-sm transition-all duration-300 ease-in-out",
  
  // Animation states
  "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-2",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-top-2"
], {
  variants: {
    variant: {
      info: [
        "bg-blue-50/95 dark:bg-blue-950/95",
        "text-blue-900 dark:text-blue-100",
        "border-blue-200 dark:border-blue-800"
      ],
      success: [
        "bg-emerald-50/95 dark:bg-emerald-950/95", 
        "text-emerald-900 dark:text-emerald-100",
        "border-emerald-200 dark:border-emerald-800"
      ],
      warning: [
        "bg-amber-50/95 dark:bg-amber-950/95",
        "text-amber-900 dark:text-amber-100", 
        "border-amber-200 dark:border-amber-800"
      ],
      error: [
        "bg-red-50/95 dark:bg-red-950/95",
        "text-red-900 dark:text-red-100",
        "border-red-200 dark:border-red-800"
      ]
    },
    size: {
      sm: "p-3 text-sm min-w-[250px]",
      md: "p-4 text-sm min-w-[300px]",
      lg: "p-5 text-base min-w-[350px]"
    }
  },
  defaultVariants: { variant: "info", size: "md" }
});

export const toastIcon = cva([
  "flex-shrink-0 text-xl"
], {
  variants: {
    variant: {
      info: "text-blue-600 dark:text-blue-400",
      success: "text-emerald-600 dark:text-emerald-400",
      warning: "text-amber-600 dark:text-amber-400", 
      error: "text-red-600 dark:text-red-400"
    }
  },
  defaultVariants: { variant: "info" }
});

export const toastContent = cva([
  "flex-1 flex flex-col gap-1"
]);

export const toastTitle = cva([
  "font-medium text-sm leading-tight"
]);

export const toastDescription = cva([
  "text-sm opacity-90 leading-relaxed"
]);

export const toastCloseButton = cva([
  "flex-shrink-0 p-1 rounded-md transition-colors",
  "hover:bg-black/10 dark:hover:bg-white/10",
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current/20"
], {
  variants: {
    variant: {
      info: "text-blue-600 dark:text-blue-400",
      success: "text-emerald-600 dark:text-emerald-400", 
      warning: "text-amber-600 dark:text-amber-400",
      error: "text-red-600 dark:text-red-400"
    }
  },
  defaultVariants: { variant: "info" }
});

/**
 * 📋 DROPDOWN COMPONENT
 * Dropdown menu pentru navigație și acțiuni cu Carbon Copper styling
 */
export const dropdown = cva([
  "absolute z-10 mt-1 rounded-md bg-white dark:bg-neutral-800 shadow-lg",
  "ring-1 ring-black/5 dark:ring-white/10",
  "focus:outline-none",
  "transform transition-all duration-150 ease-out",
  "origin-top-right opacity-100 scale-100",
  "border border-neutral-200 dark:border-neutral-700"
], {
  variants: {
    size: {
      sm: "w-48",
      md: "w-56", 
      lg: "w-64",
      xl: "w-72"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

export const dropdownItem = cva([
  "block px-4 py-2 text-sm",
  "text-neutral-700 dark:text-neutral-300",
  "transition-colors duration-150",
  "hover:bg-neutral-50 dark:hover:bg-neutral-700",
  "hover:text-neutral-900 dark:hover:text-neutral-100",
  "focus:bg-neutral-50 dark:focus:bg-neutral-700",
  "focus:text-neutral-900 dark:focus:text-neutral-100",
  "focus:outline-none cursor-pointer"
], {
  variants: {
    variant: {
      default: "",
      active: "bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100",
      danger: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-300"
    },
    disabled: {
      true: "text-neutral-400 dark:text-neutral-600 pointer-events-none cursor-not-allowed",
      false: ""
    }
  },
  defaultVariants: {
    variant: "default",
    disabled: false
  }
});

/**
 * Type exports pentru Toast component
 */
export type ToastContainerProps = VariantProps<typeof toastContainer>;
export type ToastProps = VariantProps<typeof toast>;
export type ToastIconProps = VariantProps<typeof toastIcon>;
export type ToastCloseButtonProps = VariantProps<typeof toastCloseButton>;

/**
 * Type exports pentru Dropdown component
 */
export type DropdownProps = VariantProps<typeof dropdown>;
export type DropdownItemProps = VariantProps<typeof dropdownItem>; 
