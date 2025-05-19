/**
 * Componente de layout cu stiluri rafinate
 * Folosește sistemul de design tokens și respectă arhitectura aplicației
 */

export const layoutComponents = {
  card: {
    base: `bg-white rounded-lg overflow-hidden 
           transition-all duration-200
           will-change-transform`,
    variants: {
      default: `border border-secondary-200 shadow-sm 
                hover:shadow-md hover:border-secondary-300
                hover:-translate-y-0.5`,
      elevated: `shadow-md 
                hover:shadow-lg hover:-translate-y-1
                active:shadow-sm active:translate-y-0`,
      flat: `border border-secondary-200
            hover:border-secondary-300
            hover:bg-secondary-50/50`,
      interactive: `border border-secondary-200 shadow-sm 
                    hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5
                    cursor-pointer active:shadow-inner active:translate-y-0.5`,
      'gradient-border': `border-2 border-transparent bg-white
                          shadow-sm
                          hover:shadow-md
                          bg-gradient-to-r from-primary-500 to-secondary-500
                          [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] 
                          [mask-composite:exclude]`,
    },
    sizes: {
      sm: 'p-3 rounded',
      md: 'p-5 rounded-md',
      lg: 'p-7 rounded-lg',
    }
  },

  'card-header': {
    base: 'px-5 py-4 border-b border-secondary-200 bg-gradient-to-r from-secondary-50 to-secondary-100/50 font-semibold',
  },

  'card-body': {
    base: 'p-5',
  },

  'card-footer': {
    base: 'px-5 py-4 border-t border-secondary-200 bg-gradient-to-r from-secondary-50 to-secondary-100/50',
  },

  // Section within a card
  'card-section': {
    base: 'p-5',
  },

  modal: {
    base: `fixed inset-0 z-50 flex items-center justify-center
           transition-opacity duration-300 ease-out`,
    variants: {
      default: 'bg-black bg-opacity-50',
      blur: 'backdrop-blur-sm bg-black bg-opacity-30',
    }
  },

  'modal-content': {
    base: `bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-auto
           transform transition-all duration-300 ease-out
           scale-100 opacity-100 translate-y-0`,
    sizes: {
      sm: 'w-full max-w-md',
      md: 'w-full max-w-lg',
      lg: 'w-full max-w-2xl',
      xl: 'w-full max-w-4xl',
      full: 'w-full max-w-full h-full rounded-none',
    }
  },

  'modal-header': {
    base: 'px-6 py-4 border-b border-secondary-200 bg-gradient-to-r from-secondary-50 to-white flex justify-between items-center',
  },

  'modal-body': {
    base: 'p-6',
  },

  'modal-footer': {
    base: 'px-6 py-4 border-t border-secondary-200 bg-gradient-to-r from-secondary-50 to-white flex justify-end space-x-2',
  },

  container: {
    base: 'mx-auto px-4 sm:px-6 lg:px-8',
    sizes: {
      sm: 'max-w-4xl',
      md: 'max-w-5xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
    }
  },
  
  grid: {
    base: 'grid',
    variants: {
      cols1: 'grid-cols-1',
      cols2: 'grid-cols-1 md:grid-cols-2',
      cols3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      cols4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      auto: 'grid-cols-auto',
    }
  },
  
  divider: {
    base: 'border-t my-6',
    variants: {
      light: 'border-secondary-100',
      default: 'border-secondary-200',
      dark: 'border-secondary-300',
      gradient: 'h-px bg-gradient-to-r from-secondary-200 via-secondary-300 to-secondary-200 border-0',
    }
  },
};
