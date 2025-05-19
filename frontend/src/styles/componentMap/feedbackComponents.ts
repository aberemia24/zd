/**
 * Componente de feedback cu stiluri rafinate
 * Folosește sistemul de design tokens și respectă arhitectura aplicației
 */

export const feedbackComponents = {
  badge: {
    base: `inline-flex items-center justify-center font-medium rounded-full px-2.5 py-0.5
           text-xs leading-4 whitespace-nowrap
           transition-all duration-200
           shadow-sm`,
    variants: {
      primary: 'bg-primary-100 text-primary-800 border border-primary-200 hover:bg-primary-200',
      secondary: 'bg-secondary-100 text-secondary-800 border border-secondary-200 hover:bg-secondary-200',
      success: 'bg-success-100 text-success-800 border border-success-200 hover:bg-success-200',
      error: 'bg-error-100 text-error-800 border border-error-200 hover:bg-error-200',
      warning: 'bg-warning-100 text-warning-800 border border-warning-200 hover:bg-warning-200',
      info: 'bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200',
      // Stiluri moderne cu gradienți subtile
      'primary-gradient': 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800 border border-primary-200',
      'success-gradient': 'bg-gradient-to-r from-success-50 to-success-100 text-success-800 border border-success-200',
      'error-gradient': 'bg-gradient-to-r from-error-50 to-error-100 text-error-800 border border-error-200',
    },
    sizes: {
      xs: 'px-1.5 py-0.5 text-[0.625rem]',
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1 text-base',
    }
  },

  alert: {
    base: `relative border rounded-lg p-4 my-2 text-sm
           transition-all duration-200
           shadow-sm
           flex items-start`,
    variants: {
      info: `bg-gradient-to-r from-blue-50 to-blue-50/70 border-l-4 border-blue-500 text-blue-800
            hover:shadow-md`,
      success: `bg-gradient-to-r from-success-50 to-success-50/70 border-l-4 border-success-500 text-success-800
               hover:shadow-md`,
      warning: `bg-gradient-to-r from-warning-50 to-warning-50/70 border-l-4 border-warning-500 text-warning-800
               hover:shadow-md`,
      error: `bg-gradient-to-r from-error-50 to-error-50/70 border-l-4 border-error-500 text-error-800
             hover:shadow-md`,
    },
    sizes: {
      sm: 'p-3 text-xs rounded-md',
      md: 'p-4 text-sm rounded-lg',
      lg: 'p-5 text-base rounded-xl',
    }
  },

  // List containers and items
  'list-container': {
    base: 'space-y-2',
  },
  'list-item': {
    base: 'px-4 py-2 hover:bg-secondary-50 flex items-center justify-between',
    states: {
      active: 'bg-secondary-100 font-semibold',
    },
  },

  toast: {
    base: `rounded-lg shadow-lg border-l-4 p-4 max-w-sm w-full 
           pointer-events-auto
           transform transition-all duration-300 ease-in-out
           translate-y-0 opacity-100
           hover:shadow-xl`,
    variants: {
      info: 'bg-gradient-to-r from-blue-50 to-blue-50/80 border-blue-500 text-blue-800',
      success: 'bg-gradient-to-r from-success-50 to-success-50/80 border-success-500 text-success-800',
      warning: 'bg-gradient-to-r from-warning-50 to-warning-50/80 border-warning-500 text-warning-800',
      error: 'bg-gradient-to-r from-error-50 to-error-50/80 border-error-500 text-error-800',
    }
  },

  'toast-container': {
    base: 'fixed z-50 p-4 flex flex-col space-y-2 pointer-events-none',
    variants: {
      topRight: 'top-0 right-0',
      topLeft: 'top-0 left-0',
      bottomRight: 'bottom-0 right-0',
      bottomLeft: 'bottom-0 left-0',
      topCenter: 'top-0 left-1/2 transform -translate-x-1/2',
      bottomCenter: 'bottom-0 left-1/2 transform -translate-x-1/2',
    }
  },
};
