import { cva, type VariantProps } from "class-variance-authority";

/**
 * 🎨 LAYOUT COMPOSITIONS - Carbon Copper Design System
 * Componente pentru structura paginilor și layout-uri
 */

/**
 * Container component pentru consistent content width
 */
export const container = cva([
  "mx-auto px-4 sm:px-6 lg:px-8"
], {
  variants: {
    maxWidth: {
      sm: "max-w-sm",
      md: "max-w-md", 
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
      full: "max-w-full",
      none: "max-w-none"
    },
    padding: {
      none: "px-0",
      sm: "px-4",
      md: "px-6", 
      lg: "px-8",
      xl: "px-12"
    }
  },
  defaultVariants: { maxWidth: "7xl", padding: "lg" }
});

/**
 * Grid component pentru Tailwind grid layouts
 */
export const grid = cva([
  "grid"
], {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7",
      8: "grid-cols-8",
      9: "grid-cols-9",
      10: "grid-cols-10",
      11: "grid-cols-11",
      12: "grid-cols-12",
      none: "grid-cols-none",
      auto: "grid-cols-auto"
    },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
      16: "gap-16",
      20: "gap-20"
    },
    responsive: {
      true: "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      false: ""
    }
  },
  defaultVariants: { cols: 1, gap: 4, responsive: false }
});

/**
 * Flex component pentru flexible layouts
 */
export const flexLayout = cva([
  "flex"
], {
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col",
      "row-reverse": "flex-row-reverse",
      "col-reverse": "flex-col-reverse"
    },
    wrap: {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
      "wrap-reverse": "flex-wrap-reverse"
    },
    justify: {
      start: "justify-start",
      end: "justify-end", 
      center: "justify-center",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly"
    },
    align: {
      start: "items-start",
      end: "items-end",
      center: "items-center",
      baseline: "items-baseline",
      stretch: "items-stretch"
    },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
      16: "gap-16"
    }
  },
  defaultVariants: { 
    direction: "row", 
    wrap: "nowrap", 
    justify: "start", 
    align: "start", 
    gap: 0 
  }
});

/**
 * Stack component pentru vertical/horizontal stacking
 */
export const stackLayout = cva([
  "flex"
], {
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row"
    },
    spacing: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
      16: "gap-16",
      20: "gap-20"
    },
    align: {
      start: "items-start",
      end: "items-end",
      center: "items-center",
      stretch: "items-stretch"
    },
    justify: {
      start: "justify-start",
      end: "justify-end",
      center: "justify-center",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly"
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap"
    }
  },
  defaultVariants: { 
    direction: "vertical", 
    spacing: 4, 
    align: "stretch", 
    justify: "start", 
    wrap: false 
  }
});

/**
 * Section component pentru consistent page sections
 */
export const section = cva([
  "py-8"
], {
  variants: {
    variant: {
      default: [
        "bg-carbon-50 dark:bg-carbon-900"
      ],
      primary: [
        "bg-copper-50 dark:bg-copper-950"
      ],
      secondary: [
        "bg-carbon-100 dark:bg-carbon-800"
      ],
      elevated: [
        "bg-carbon-50 shadow-lg border border-carbon-200",
        "dark:bg-carbon-900 dark:border-carbon-700 dark:shadow-copper-900/20"
      ],
      transparent: "bg-transparent"
    },
    padding: {
      none: "py-0",
      sm: "py-4",
      md: "py-8",
      lg: "py-12",
      xl: "py-16",
      "2xl": "py-20"
    },
    margin: {
      none: "my-0",
      sm: "my-4",
      md: "my-8",
      lg: "my-12",
      xl: "my-16"
    },
    width: {
      full: "w-full",
      contained: "max-w-7xl mx-auto"
    }
  },
  defaultVariants: { 
    variant: "default", 
    padding: "md", 
    margin: "none", 
    width: "full" 
  }
});

/**
 * Grid area component pentru CSS Grid areas
 */
export const gridArea = cva([
  "grid-area"
], {
  variants: {
    area: {
      header: "[grid-area:header]",
      sidebar: "[grid-area:sidebar]", 
      main: "[grid-area:main]",
      footer: "[grid-area:footer]",
      aside: "[grid-area:aside]"
    }
  }
});

/**
 * Responsive grid template pentru common layouts
 */
export const gridTemplate = cva([
  "grid min-h-screen"
], {
  variants: {
    layout: {
      "app-layout": [
        "grid-template-areas-['header_header']['sidebar_main']['footer_footer']",
        "grid-template-rows-[auto_1fr_auto]",
        "grid-template-columns-[250px_1fr]",
        "md:grid-template-areas-['header']['main']['footer']",
        "md:grid-template-columns-[1fr]"
      ],
      "dashboard": [
        "grid-template-areas-['header_header_header']['sidebar_main_aside']['footer_footer_footer']",
        "grid-template-rows-[auto_1fr_auto]", 
        "grid-template-columns-[250px_1fr_300px]",
        "lg:grid-template-areas-['header_header']['sidebar_main']['footer_footer']",
        "lg:grid-template-columns-[250px_1fr]",
        "md:grid-template-areas-['header']['main']['footer']",
        "md:grid-template-columns-[1fr]"
      ],
      "content": [
        "grid-template-areas-['header']['main']['footer']",
        "grid-template-rows-[auto_1fr_auto]",
        "grid-template-columns-[1fr]"
      ]
    }
  },
  defaultVariants: { layout: "content" }
});

/**
 * Type exports pentru TypeScript
 */
export type ContainerProps = VariantProps<typeof container>;
export type GridProps = VariantProps<typeof grid>;
export type FlexLayoutProps = VariantProps<typeof flexLayout>;
export type StackLayoutProps = VariantProps<typeof stackLayout>;
export type SectionProps = VariantProps<typeof section>;
export type GridAreaProps = VariantProps<typeof gridArea>;
export type GridTemplateProps = VariantProps<typeof gridTemplate>; 
