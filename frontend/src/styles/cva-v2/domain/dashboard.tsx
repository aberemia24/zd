import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎨 DASHBOARD DOMAIN - Carbon Copper Design System
 * Componente specifice pentru dashboard și overview screens
 */

/**
 * Dashboard container principal
 */
export const dashboard = cva([
  "min-h-screen bg-carbon-50 dark:bg-carbon-950",
  "transition-colors duration-300"
], {
  variants: {
    layout: {
      default: "p-6",
      compact: "p-4",
      spacious: "p-8"
    },
    variant: {
      default: "",
      professional: "bg-gradient-to-br from-carbon-50 to-copper-50/30 dark:from-carbon-950 dark:to-copper-950/10"
    }
  },
  defaultVariants: { layout: "default", variant: "default" }
});

/**
 * Dashboard widget/card pentru metrici financiare
 */
export const dashboardWidget = cva([
  "bg-white dark:bg-carbon-900 rounded-lg border border-carbon-200 dark:border-carbon-700",
  "p-6 shadow-sm hover:shadow-md transition-all duration-200"
], {
  variants: {
    variant: {
      default: "",
      highlighted: [
        "ring-2 ring-copper-500/20 border-copper-300",
        "dark:ring-copper-400/30 dark:border-copper-600"
      ],
      warning: [
        "ring-2 ring-amber-500/20 border-amber-300", 
        "dark:ring-amber-400/30 dark:border-amber-600"
      ],
      success: [
        "ring-2 ring-emerald-500/20 border-emerald-300",
        "dark:ring-emerald-400/30 dark:border-emerald-600" 
      ]
    },
    size: {
      sm: "p-4",
      md: "p-6",
      lg: "p-8"
    },
    interactive: {
      true: "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
      false: ""
    }
  },
  defaultVariants: { variant: "default", size: "md", interactive: false }
});

/**
 * Dashboard metric pentru afișarea valorilor importante
 */
export const dashboardMetric = cva([
  "flex flex-col items-center text-center transition-all duration-200"
], {
  variants: {
    trend: {
      up: "text-emerald-600 dark:text-emerald-400",
      down: "text-red-600 dark:text-red-400", 
      neutral: "text-carbon-700 dark:text-carbon-300",
      stable: "text-copper-600 dark:text-copper-400"
    },
    size: {
      sm: "space-y-1",
      md: "space-y-2",
      lg: "space-y-3"
    }
  },
  defaultVariants: { trend: "neutral", size: "md" }
});

/**
 * Dashboard header pentru titluri și navigation
 */
export const dashboardHeader = cva([
  "flex items-center justify-between mb-6 pb-4",
  "border-b border-carbon-200 dark:border-carbon-700"
], {
  variants: {
    variant: {
      default: "",
      compact: "mb-4 pb-2",
      spacious: "mb-8 pb-6"
    }
  },
  defaultVariants: { variant: "default" }
});

/**
 * Type exports pentru TypeScript
 */
export type DashboardProps = VariantProps<typeof dashboard>;
export type DashboardWidgetProps = VariantProps<typeof dashboardWidget>;
export type DashboardMetricProps = VariantProps<typeof dashboardMetric>;
export type DashboardHeaderProps = VariantProps<typeof dashboardHeader>; 
