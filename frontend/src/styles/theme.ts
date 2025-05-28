// Definirea design tokens pentru Budget App
// Acesta este entrypoint-ul pentru toate variabilele de stil

import type { Theme } from "./themeTypes";

export const theme: Theme = {
  // --- COMPONENTE/STĂRI ---
  // Layout semantic pentru spacing între elemente de formular și grupuri de butoane
  layout: {
    formRow: "flex flex-wrap gap-4 mb-4", // Spațiere între inputuri pe rând
    buttonGroup: "flex gap-2 mt-4", // Spațiere între butoane de acțiune
  },
  components: {
    button: {
      disabled: "opacity-50 cursor-not-allowed",
      states: {
        disabled: "opacity-50 cursor-not-allowed",
      },
    },
    input: {
      error: "border-error-500",
      states: {
        error: "border-error-500",
        disabled: "bg-gray-100 cursor-not-allowed",
      },
    },
    formGroup: "flex flex-col mb-2",
    formLabel: "block mb-1 font-medium text-secondary-700",
    formError: "text-error-600 text-xs mt-1",
    checkbox: {
      base: "accent-accent",
      error: "accent-error",
      label: "ml-2 text-secondary-700",
    },
    badge: {
      base: "inline-block px-2 py-0.5 rounded text-xs font-semibold",
      variants: {
        primary: "bg-primary-500 text-white",
        success: "bg-success-500 text-white",
        error: "bg-error-500 text-white",
        warning: "bg-warning-500 text-white",
      },
    },
    alert: {
      base: "border rounded p-4 my-2 text-center",
      variants: {
        success: "bg-success-50 border-success-200 text-success-700",
        error: "bg-error-50 border-error-200 text-error-700",
        warning: "bg-warning-50 border-warning-200 text-warning-700",
      },
    },
    loader: {
      container: "flex justify-center items-center py-8",
      svg: "animate-spin h-8 w-8 text-primary-500",
      circle: "opacity-25",
      path: "opacity-75",
      text: "ml-3 text-gray-700 text-sm",
    },
  },
  colors: {
    // Primary - Forest Green (înlocuiește blue-ul actual)
    primary: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#16a34a", // Main forest green
      600: "#15803d",
      700: "#166534",
      800: "#14532d",
      900: "#052e16",
    },
    // Secondary - Navy Blue
    secondary: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#334155", // Navy blue
      600: "#1e293b",
      700: "#0f172a",
      800: "#020617",
      900: "#020617",
    },
    // Success - Păstrează verde pentru venituri
    success: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#059669", // Darker green pentru contrast
      600: "#047857",
      700: "#065f46",
      800: "#064e3b",
      900: "#022c22",
    },
    // Warning - Accent Gold (înlocuiește yellow)
    warning: {
      50: "#fffdf7",
      100: "#fffaeb",
      200: "#fef3c7",
      300: "#fde68a",
      400: "#fcd34d",
      500: "#f59e0b", // Deep gold
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    // Error - Earth Red (păstrat dar ajustat)
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecdd3",
      300: "#fca5a5",
      400: "#f87171",
      500: "#dc2626", // Earth red
      600: "#991b1b",
      700: "#7f1d1d",
      800: "#650a0a",
      900: "#450a0a",
    },
    // Gray - Warm grays (înlocuiește cold grays)
    gray: {
      50: "#fafaf9",
      100: "#f5f5f4",
      200: "#e7e5e4",
      300: "#d6d3d1",
      400: "#a8a29e",
      500: "#78716c",
      600: "#57534e",
      700: "#44403c",
      800: "#292524",
      900: "#1c1917",
    },
    // Păstrează white și black
    white: "#ffffff",
    black: "#000000",
  },
  spacing: {
    0: "0",
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "6rem", // 96px
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    full: "9999px",
  },
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      md: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
    },
    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },
};

// Export default pentru import simplu
export default theme;
