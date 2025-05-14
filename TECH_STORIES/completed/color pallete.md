Paleta "Earthy Professional" Completă
1. Culorile Principale
typescriptconst earthyPalette = {
  // Primary - Forest Green (pentru creștere, stabilitate)
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#16a34a', // Main forest green
    600: '#15803d',
    700: '#166534',
    800: '#14532d',
    900: '#052e16',
  },
  
  // Secondary - Navy Blue (pentru autoritate, profesionalism)
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#334155', // Navy blue
    600: '#1e293b',
    700: '#0f172a',
    800: '#020617',
    900: '#020617',
  },
  
  // Accent - Gold (pentru premium touch)
  accent: {
    50: '#fffdf7',
    100: '#fffaeb',
    200: '#fef3c7',
    300: '#fde68a',
    400: '#fcd34d',
    500: '#f59e0b', // Deep gold
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Success - Emerald (pentru venituri, sold pozitiv)
  success: {
    light: '#ecfdf5',
    main: '#059669',
    dark: '#065f46',
  },
  
  // Error - Earth Red (pentru cheltuieli, sold negativ)
  error: {
    light: '#fef2f2',
    main: '#dc2626',
    dark: '#991b1b',
  },
  
  // Neutral - Warm Grays
  neutral: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  },
  
  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#fafaf9',
    tertiary: '#f5f5f4',
    dark: '#0f172a',
  }
};
2. Tipografie & Layout
typescriptconst typography = {
  // Combinație pentru fintech premium
  fontFamily: {
    display: 'Inter, system-ui, sans-serif',     // Pentru titluri
    body: 'Inter, system-ui, sans-serif',        // Pentru text
    mono: 'JetBrains Mono, Menlo, monospace',    // Pentru sume, date
  },
  
  // Scale armonioasă
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px  
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75',
  },
};

// Spacing System (8pt grid)
const spacing = {
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
};
3. Componente Signature
typescript// Stiluri pentru componentele cheie
const components = {
  // Page Layout
  page: {
    background: 'bg-background-secondary',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    header: 'bg-background-primary border-b border-neutral-200',
  },
  
  // Cards (pentru dashboard, tranzacții)
  card: {
    base: 'bg-white rounded-xl shadow-sm border border-neutral-200',
    hover: 'hover:shadow-md transition-shadow duration-200',
    premium: 'ring-1 ring-accent-200',
  },
  
  // Navigation
  nav: {
    primary: 'bg-secondary-700 text-white',
    link: {
      default: 'text-secondary-300 hover:text-white',
      active: 'text-white bg-secondary-600',
    },
  },
  
  // Buttons
  button: {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700',
    accent: 'bg-accent-500 text-white hover:bg-accent-600',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
  },
  
  // Forms
  input: {
    base: 'border border-neutral-300 rounded-lg px-4 py-2.5',
    focus: 'focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
    error: 'border-error-main focus:border-error-main focus:ring-error-light',
  },
  
  // Financial Elements
  amount: {
    positive: 'text-success-main font-medium',
    negative: 'text-error-main font-medium',
    neutral: 'text-neutral-600',
    large: 'font-mono text-lg tabular-nums',
  },
  
  // Grid Lunar specific
  grid: {
    header: 'bg-gradient-to-r from-primary-700 to-secondary-700 text-white',
    category: 'bg-primary-50 border-l-4 border-l-primary-500',
    selected: 'ring-2 ring-accent-400',
    balance: 'bg-gradient-to-r from-accent-50 to-primary-50 font-bold',
  }
};
4. Efecte Vizuale Premium
typescriptconst effects = {
  // Shadows (pentru depth)
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    premium: '0 0 0 1px rgba(236, 253, 245, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  
  // Border Radius
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },
  
  // Animations
  animations: {
    fadeIn: 'animate-in fade-in-50 duration-200',
    slideUp: 'animate-in slide-in-from-bottom-4 duration-300',
    hover: 'transition-all duration-200 ease-out',
    premium: 'transition-all duration-300 ease-out',
  },
  
  // Gradients
  gradients: {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700',
    secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-700',
    accent: 'bg-gradient-to-r from-accent-500 to-accent-600',
    premium: 'bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-700',
  }
};
5. Iconografie & Assets
typescript// Iconițe pentru categorii (Lucide React)
const categoryIcons = {
  VENITURI: { icon: 'TrendingUp', color: 'text-success-main' },
  ECONOMII: { icon: 'PiggyBank', color: 'text-primary-600' },
  NUTRITIE: { icon: 'Utensils', color: 'text-accent-600' },
  LOCUINTA: { icon: 'Home', color: 'text-secondary-600' },
  TRANSPORT: { icon: 'Car', color: 'text-neutral-600' },
  EDUCATIE: { icon: 'GraduationCap', color: 'text-primary-500' },
  SANATATE: { icon: 'Heart', color: 'text-error-main' },
  DIVERTISMENT: { icon: 'Sparkles', color: 'text-accent-500' },
  // ... etc
};

// States & Statuses
const statusStyles = {
  completed: 'bg-success-light text-success-dark border-success-main',
  pending: 'bg-accent-light text-accent-dark border-accent-main',
  cancelled: 'bg-error-light text-error-dark border-error-main',
};
6. Patterns de Design Unique
typescript// Signature touches pentru aplicația ta
const signatureElements = {
  // Premium touches
  premiumCard: `
    relative overflow-hidden
    bg-gradient-to-br from-white to-neutral-50
    border border-neutral-200
    shadow-premium
    before:absolute before:inset-0 
    before:bg-gradient-to-r before:from-transparent before:via-accent-50/20 before:to-transparent
    before:-translate-x-full before:animate-shimmer
  `,
  
  // Financial highlights
  goldHighlight: 'text-accent-600 font-semibold bg-accent-50 px-2 py-1 rounded',
  
  // Status indicators
  statusDot: 'w-2 h-2 rounded-full absolute top-1 right-1',
  
  // Growth indicators
  growthBadge: 'flex items-center space-x-1 text-xs font-medium text-success-dark bg-success-light px-2 py-1 rounded-full',
};
7. Dark Mode Palette
typescriptconst darkMode = {
  background: {
    primary: '#020617',
    secondary: '#0f172a',
    tertiary: '#1e293b',
  },
  
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
  },
  
  // Ajustări pentru dark mode
  primary: {
    // Versiuni mai luminoase pentru contrast
    500: '#34d399',
    600: '#10b981',
  },
  
  accent: {
    // Gold mai subtil pe dark
    500: '#fbbf24',
    600: '#f59e0b',
  }
};
Această paletă îți va da o identitate vizuală premium, solidă și orientată spre creștere - perfect pentru o aplicație financiară care vrea să se diferențieze prin eleganță și profesionalism.