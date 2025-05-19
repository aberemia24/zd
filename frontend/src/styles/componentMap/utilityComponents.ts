/**
 * Componente utilitare și efecte speciale cu stiluri rafinate
 * Folosește sistemul de design tokens și respectă arhitectura aplicației
 */

export const utilityComponents = {
  dropdown: {
    base: `absolute z-10 mt-1 w-56 rounded-md bg-white shadow-lg 
           ring-1 ring-black ring-opacity-5 divide-y divide-secondary-100 
           focus:outline-none
           transform transition-all duration-200 ease-out
           origin-top-right opacity-100 scale-100`,
  },

  'dropdown-item': {
    base: `block px-4 py-2 text-sm text-secondary-700 
           transition-colors duration-150
           hover:bg-secondary-100 hover:text-secondary-900
           focus:bg-secondary-100 focus:text-secondary-900 focus:outline-none`,
    variants: {
      active: 'bg-primary-100 text-primary-900',
      disabled: 'text-secondary-400 pointer-events-none',
      danger: 'text-error-600 hover:bg-error-50 hover:text-error-700',
    }
  },

  'loader-container': {
    base: 'flex justify-center items-center py-4',
    variants: {
      primary: 'text-primary-500',
      secondary: 'text-secondary-500',
      light: 'text-white',
      dark: 'text-secondary-800',
    }
  },

  'loader-svg': {
    base: 'animate-spin',
    sizes: {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    }
  },

  'loader-circle': {
    base: 'opacity-25',
  },

  'loader-path': {
    base: 'opacity-75',
  },

  'loader-text': {
    base: 'ml-3 text-secondary-700 text-sm animate-pulse',
  },

  pill: {
    base: `inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium
           transition-all duration-200
           shadow-sm`,
    variants: {
      primary: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
      secondary: 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200',
      success: 'bg-success-100 text-success-800 hover:bg-success-200',
      error: 'bg-error-100 text-error-800 hover:bg-error-200',
      warning: 'bg-warning-100 text-warning-800 hover:bg-warning-200',
      // Stiluri cu gradient și umbre
      'primary-gradient': 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow hover:shadow-md',
      'success-gradient': 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow hover:shadow-md',
    }
  },

  'form-group': {
    base: `flex flex-col space-y-1.5 mb-4
           transition-all duration-200`,
    variants: {
      default: '',
      inline: 'sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4',
      grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
    }
  },

  'form-label': {
    base: 'block text-sm font-medium text-secondary-700 transition-colors duration-200',
    states: {
      required: 'after:content-["*"] after:ml-0.5 after:text-error-500',
    }
  },

  'form-error': {
    base: 'text-error-600 text-xs mt-1 transition-all duration-200 opacity-100',
  },

  // Efecte și stiluri speciale comune
  /**
   * Efect vizual pentru eliminarea outline-ului de focus (folosit pentru taburi/NavLink etc.)
   * Se aplică dinamic cu getEnhancedComponentClasses ca efect 'fx-no-outline'.
   * Folosește !important pentru a suprascrie orice stil implicit de browser.
   */
  'fx-no-outline': {
    base: 'outline-none !important shadow-none !important',
  },
  'fx-gradient-text': {
    base: 'bg-clip-text text-transparent bg-gradient-to-r',
    variants: {
      primary: 'from-primary-500 to-primary-700',
      success: 'from-success-500 to-success-700',
      error: 'from-error-500 to-error-700',
      rainbow: 'from-primary-500 via-warning-500 to-error-500',
    }
  },

  'fx-glass': {
    base: 'backdrop-blur-md bg-white/70 border border-white/20',
    variants: {
      dark: 'backdrop-blur-md bg-secondary-900/70 border border-secondary-700/20 text-white',
    }
  },

  'fx-shadow-glow': {
    base: 'transition-all duration-300',
    variants: {
      primary: 'shadow-[0_0_15px_rgba(22,163,74,0.5)]',
      success: 'shadow-[0_0_15px_rgba(5,150,105,0.5)]',
      error: 'shadow-[0_0_15px_rgba(220,38,38,0.5)]',
    }
  },

  'fx-sliding-gradient': {
    base: `relative overflow-hidden before:absolute before:inset-0 
           before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
           before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000
           before:z-10 before:pointer-events-none`,
  },
  
  /**
   * Indicator vizual pentru starea unui buton sau altă componentă
   * Folosit pentru a indica vizual că o componentă este activă/valabilă
   * Se aplică dinamic cu getEnhancedComponentClasses
   */
  indicator: {
    base: 'inline-block rounded-full',
    variants: {
      primary: 'bg-white',
      success: 'bg-success-100',
      warning: 'bg-warning-300',
      error: 'bg-error-300',
    },
    sizes: {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4',
    },
    states: {
      active: 'animate-pulse',
      static: '',
    }
  },
};
