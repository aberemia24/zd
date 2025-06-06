import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🧭 NAVIGATION PRIMITIVES - Carbon Copper Design System
 * Componente primitive pentru navigație și organizarea conținutului
 */

/**
 * TAB - Componenta pentru tab-uri
 * Migrare din sistemul vechi CVA cu îmbunătățiri
 */
export const tab = cva(
  [
    "px-4 py-2 text-sm font-medium cursor-pointer",
    "transition-all duration-150 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
  ],
  {
    variants: {
      variant: {
        underline: [
          "border-b-2 border-transparent",
          "hover:border-gray-300 hover:text-gray-700"
        ],
        pill: [
          "rounded-full",
          "hover:bg-gray-100 hover:text-gray-700"
        ],
        card: [
          "rounded-t-lg",
          "hover:bg-gray-50 hover:text-gray-700"
        ],
        minimal: [
          "rounded-md",
          "hover:bg-gray-50 hover:text-gray-700"
        ]
      },
      active: {
        true: "",
        false: ""
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2.5 text-base"
      }
    },
    compoundVariants: [
      {
        variant: "underline",
        active: true,
        className: "border-b-2 border-blue-500 text-blue-600 font-semibold"
      },
      {
        variant: "pill",
        active: true,
        className: "bg-blue-100 text-blue-700 shadow-sm font-semibold"
      },
      {
        variant: "card",
        active: true,
        className: "bg-white text-blue-600 border-t border-l border-r border-gray-200 shadow-sm font-semibold"
      },
      {
        variant: "minimal",
        active: true,
        className: "bg-blue-50 text-blue-700 font-semibold"
      }
    ],
    defaultVariants: {
      variant: "underline",
      active: false,
      size: "md"
    }
  }
);

/**
 * TAB LIST - Container pentru lista de tab-uri
 */
export const tabList = cva([
  "flex",
  "border-b border-gray-200"
], {
  variants: {
    variant: {
      underline: "border-b border-gray-200",
      pill: "bg-gray-100 rounded-full p-1",
      card: "border-b border-gray-200",
      minimal: "gap-1"
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between"
    }
  },
  defaultVariants: {
    variant: "underline",
    justify: "start"
  }
});

/**
 * TAB PANEL - Container pentru conținutul tab-ului
 */
export const tabPanel = cva([
  "py-4",
  "focus:outline-none"
], {
  variants: {
    spacing: {
      none: "p-0",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
      xl: "p-8"
    }
  },
  defaultVariants: {
    spacing: "md"
  }
});

// Type exports
export type TabProps = VariantProps<typeof tab>;
export type TabListProps = VariantProps<typeof tabList>;
export type TabPanelProps = VariantProps<typeof tabPanel>; 
