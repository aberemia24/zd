// Definirea design tokens pentru Budget App - CARBON COPPER EDITION
// 🖤🔶 Carbon Copper Extended Palette - Premium Fintech Design
// Perfect balance între profesionist și memorabil pentru aplicații fintech

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
      error: "border-ruby-600",
      states: {
        error: "border-ruby-600",
        disabled: "bg-carbon-200 cursor-not-allowed",
      },
    },
    formGroup: "flex flex-col mb-2",
    formLabel: "block mb-1 font-medium text-carbon-700",
    formError: "text-ruby-600 text-xs mt-1",
    checkbox: {
      base: "accent-copper-500",
      error: "accent-ruby-600",
      label: "ml-2 text-carbon-700",
    },
    badge: {
      base: "inline-block px-2 py-0.5 rounded text-xs font-semibold",
      variants: {
        primary: "bg-copper-500 text-carbon-950",
        success: "bg-emerald-600 text-white",
        error: "bg-ruby-600 text-white",
        warning: "bg-amber-500 text-carbon-950",
      },
    },
    alert: {
      base: "border rounded p-4 my-2 text-center",
      variants: {
        success: "bg-emerald-50 border-emerald-200 text-emerald-700",
        error: "bg-red-50 border-ruby-200 text-ruby-700",
        warning: "bg-amber-50 border-amber-200 text-amber-700",
      },
    },
    loader: {
      container: "flex justify-center items-center py-8",
      svg: "animate-spin h-8 w-8 text-copper-500",
      circle: "opacity-25",
      path: "opacity-75",
      text: "ml-3 text-carbon-700 text-sm",
    },
  },
  colors: {
    // Carbon Scale (Premium Carbon Black scale - înlocuiește gray boring)
    // Rich, sophisticated blacks și grays pentru trust profesional
    carbon: {
      50: "#FAFAF9",   // Warm White
      100: "#F5F5F4",  // Off White  
      200: "#E7E5E4",  // Light Stone
      300: "#D6D3D1",  // Medium Light
      400: "#78716C",  // Muted Carbon
      500: "#57534E",  // Medium Carbon
      600: "#44403C",  // Medium Dark
      700: "#292524",  // Dark Stone
      800: "#1C1917",  // Charcoal
      900: "#0C0A09",  // Rich Black
      950: "#0A0908",  // True Black
    },
    // Copper Accents (Star of the show - vedeta paletei)
    // Perfect warmth pentru fintech - mental association cu money
    copper: {
      50: "#FFF7ED",   // Lightest copper
      100: "#FED7AA",  // Pale Peach
      200: "#D88865",  // TEST: Copper warm tone - mai vibrant
      300: "#A86A4F",  // TEST: Hover maro-copper foarte închis
      400: "#F97316",  // Light Orange
      500: "#D88865",  // NEW: Noua culoare principală copper!
      600: "#A86A4F",  // NEW: Noua culoare hover copper!
      700: "#9A3412",  // Darker Copper
      800: "#7C2D12",  // Very Dark Copper
      900: "#431407",  // Darkest Copper
    },
    // Supporting Cast Colors
    // Success - Emerald (stays green pentru financial positive)
    emerald: {
      50: "#ECFDF5",
      100: "#D1FAE5",
      200: "#A7F3D0",
      300: "#6EE7B7",
      400: "#34D399",
      500: "#10B981",
      600: "#059669",  // Main success color
      700: "#047857",
      800: "#065F46",
      900: "#064E3B",
    },
    // Error - Ruby (warm red pentru errors)
    ruby: {
      50: "#FEF2F2",
      100: "#FEE2E2",
      200: "#FECACA",
      300: "#FCA5A5",
      400: "#F87171",
      500: "#EF4444",
      600: "#DC2626",  // Main error color
      700: "#B91C1C",
      800: "#991B1B",
      900: "#7F1D1D",
    },
    // Warning - Amber (golden pentru warnings)
    amber: {
      50: "#FFFBEB",
      100: "#FEF3C7",
      200: "#FDE68A",
      300: "#FCD34D",
      400: "#FBBF24",
      500: "#F59E0B",  // Main warning color
      600: "#D97706",
      700: "#B45309",
      800: "#92400E",
      900: "#78350F",
    },
    
    // Alias pentru compatibilitate cu codul existent
    primary: {
      50: "#FFF7ED",
      100: "#FED7AA",
      200: "#FED7B0",
      300: "#FB923C",
      400: "#F97316",
      500: "#EA580C",  // Copper main
      600: "#C2410C",
      700: "#9A3412",
      800: "#7C2D12",
      900: "#431407",
    },
    secondary: {
      50: "#FAFAF9",
      100: "#F5F5F4",
      200: "#E7E5E4",
      300: "#D6D3D1",
      400: "#78716C",
      500: "#57534E",  // Carbon medium
      600: "#44403C",
      700: "#292524",
      800: "#1C1917",
      900: "#0C0A09",
    },
    accent: {
      50: "#FFF7ED",
      100: "#FED7AA",
      200: "#FED7B0",
      300: "#FB923C",
      400: "#F97316",
      500: "#EA580C",  // Copper accent
      600: "#C2410C",
      700: "#9A3412",
      800: "#7C2D12",
      900: "#431407",
    },
    success: {
      50: "#ECFDF5",
      100: "#D1FAE5",
      200: "#A7F3D0",
      300: "#6EE7B7",
      400: "#34D399",
      500: "#10B981",
      600: "#059669",  // Emerald
      700: "#047857",
      800: "#065F46",
      900: "#064E3B",
    },
    warning: {
      50: "#FFFBEB",
      100: "#FEF3C7",
      200: "#FDE68A",
      300: "#FCD34D",
      400: "#FBBF24",
      500: "#F59E0B",  // Amber
      600: "#D97706",
      700: "#B45309",
      800: "#92400E",
      900: "#78350F",
    },
    error: {
      50: "#FEF2F2",
      100: "#FEE2E2",
      200: "#FECACA",
      300: "#FCA5A5",
      400: "#F87171",
      500: "#EF4444",
      600: "#DC2626",  // Ruby
      700: "#B91C1C",
      800: "#991B1B",
      900: "#7F1D1D",
    },
    // Neutral folosește carbon scale
    gray: {
      50: "#FAFAF9",
      100: "#F5F5F4",
      200: "#E7E5E4",
      300: "#D6D3D1",
      400: "#78716C",
      500: "#57534E",
      600: "#44403C",
      700: "#292524",
      800: "#1C1917",
      900: "#0C0A09",
    },
    
    // Background - Carbon warm pentru premium feel
    background: "#FAFAF9", // Carbon warm white
    
    // Păstrează white și black pentru contrast maxim
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
    // Carbon Copper ambient shadows pentru sophisticated depth
    sm: "0 1px 2px 0 rgba(10, 9, 8, 0.05)",
    md: "0 4px 6px -1px rgba(10, 9, 8, 0.1), 0 2px 4px -1px rgba(10, 9, 8, 0.06)",
    lg: "0 10px 15px -3px rgba(10, 9, 8, 0.1), 0 4px 6px -2px rgba(10, 9, 8, 0.05)",
    xl: "0 20px 25px -5px rgba(10, 9, 8, 0.1), 0 10px 10px -5px rgba(10, 9, 8, 0.04)",
    // Copper glow variants pentru interactive elements și highlights
    glow: "0 8px 32px rgba(234, 88, 12, 0.16)",
    "glow-lg": "0 16px 64px rgba(234, 88, 12, 0.24)",
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px - enhanced for modern look
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
