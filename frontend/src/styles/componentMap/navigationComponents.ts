/**
 * Componente de navigare cu stiluri rafinate
 * Folosește sistemul de design tokens și respectă arhitectura aplicației
 */

/**
 * Componente de navigare cu stiluri rafinate
 * Folosește sistemul de design tokens și respectă arhitectura aplicației
 * Efectul vizual 'no-outline' se aplică dinamic via getEnhancedComponentClasses (vezi utilityComponents)
 */
export const navigationComponents = {
  tab: {
    base: `px-4 py-2 text-sm font-medium
           transition-all duration-200`,
    variants: {
      underline: `border-b-2 border-transparent hover:border-secondary-300 hover:text-secondary-700
                 active:border-primary-500 active:text-primary-600`,
      pill: `rounded-full hover:bg-secondary-100 hover:text-secondary-700
            active:bg-primary-100 active:text-primary-700`,
      card: `rounded-t-lg hover:bg-secondary-50 hover:text-secondary-700
            active:bg-white active:text-primary-600 active:border-t active:border-l active:border-r active:border-secondary-200`,
    },
    states: {
      active: {
        underline: 'border-b-2 border-primary-500 text-primary-600',
        pill: 'bg-primary-100 text-primary-700 shadow-sm',
        card: 'bg-white text-primary-600 border-t border-l border-r border-secondary-200 shadow-sm',
      }
    }
  },

  'tab-panel': {
    base: 'p-4 transition-all duration-300 transform opacity-100 translate-y-0',
    variants: {
      card: 'bg-white border border-secondary-200 rounded-b-lg p-4 shadow-sm',
    }
  },

  'tab-panels': {
    base: 'mt-2',
  },

  sidebar: {
    base: `flex flex-col h-full bg-white border-r border-secondary-200
           transition-all duration-300
           shadow-sm`,
    sizes: {
      sm: 'w-64',
      md: 'w-72',
      lg: 'w-80',
    }
  },

  'sidebar-header': {
    base: 'p-4 border-b border-secondary-200 font-semibold bg-gradient-to-r from-secondary-50 to-white',
  },

  'sidebar-content': {
    base: 'flex-1 overflow-y-auto py-4',
  },

  'sidebar-footer': {
    base: 'p-4 border-t border-secondary-200 bg-secondary-50',
  },

  navbar: {
    base: `bg-white border-b border-secondary-200 shadow-sm
           transition-all duration-200`,
    variants: {
      primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md',
      secondary: 'bg-gradient-to-r from-secondary-700 to-secondary-800 text-white shadow-md',
      transparent: 'bg-transparent border-transparent',
    }
  },

  'navbar-container': {
    base: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },

  breadcrumb: {
    base: 'flex items-center space-x-2 text-sm',
  },

  'breadcrumb-item': {
    base: 'text-secondary-500 hover:text-secondary-700 transition-colors duration-200',
    states: {
      active: 'text-secondary-900 font-medium',
    }
  },

  'breadcrumb-separator': {
    base: 'text-secondary-300',
  },

  pagination: {
    base: 'flex items-center justify-center space-x-1',
  },

  'pagination-item': {
    base: `inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium 
           transition-colors duration-200`,
    variants: {
      default: 'text-secondary-600 hover:bg-secondary-100',
    },
    states: {
      active: 'bg-primary-100 text-primary-700',
      disabled: 'text-secondary-300 cursor-not-allowed',
    }
  },

  dropdown: {
    base: `absolute z-10 mt-1 rounded-md bg-white shadow-lg 
           ring-1 ring-black ring-opacity-5 divide-y divide-secondary-100 
           focus:outline-none
           transform transition-all duration-200 ease-out
           origin-top-right opacity-100 scale-100`,
    sizes: {
      sm: 'w-48',
      md: 'w-56',
      lg: 'w-64',
    }
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
};
