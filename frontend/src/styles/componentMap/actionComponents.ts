/**
 * Componente de acțiune cu stiluri rafinate
 * Folosește sistemul de design tokens și respectă arhitectura aplicației
 */

export const actionComponents = {
  button: {
    base: `font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center 
           relative overflow-hidden shadow-sm 
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
           active:shadow-inner active:translate-y-0.5`,
    variants: {
      primary: `bg-gradient-to-br from-primary-500 to-primary-600 text-white
                hover:from-primary-600 hover:to-primary-700 hover:shadow-md
                active:from-primary-700 active:to-primary-800
                focus-visible:ring-primary-300`,
                
      secondary: `bg-white text-secondary-700 border border-secondary-300 
                  hover:bg-secondary-50 hover:shadow-md hover:text-secondary-800
                  active:bg-secondary-100 active:text-secondary-900
                  focus-visible:ring-secondary-200`,
                  
      success: `bg-gradient-to-br from-success-500 to-success-600 text-white 
                hover:from-success-600 hover:to-success-700 hover:shadow-md
                active:from-success-700 active:to-success-800
                focus-visible:ring-success-300`,
                
      danger: `bg-gradient-to-br from-error-500 to-error-600 text-white 
              hover:from-error-600 hover:to-error-700 hover:shadow-md
              active:from-error-700 active:to-error-800
              focus-visible:ring-error-300`,
              
      warning: `bg-gradient-to-br from-warning-400 to-warning-500 text-black
                hover:from-warning-500 hover:to-warning-600 hover:shadow-md
                active:from-warning-600 active:to-warning-700
                focus-visible:ring-warning-300`,
              
      ghost: `bg-transparent text-primary-600 
              hover:bg-primary-50 hover:text-primary-700
              active:bg-primary-100 active:text-primary-800
              focus-visible:ring-primary-200`,
              
      outline: `bg-transparent border-2 border-current text-primary-600 
                hover:bg-primary-50 hover:text-primary-700
                active:bg-primary-100 active:text-primary-800
                focus-visible:ring-primary-200`,
                
      link: `bg-transparent text-primary-600 underline p-0 shadow-none
             hover:text-primary-700 hover:bg-transparent
             active:text-primary-800
             focus-visible:ring-primary-200 focus-visible:ring-offset-0`,
    },
    sizes: {
      xs: 'text-xs px-2.5 py-1.5 rounded',
      sm: 'text-sm px-3 py-1.5 rounded-md',
      md: 'text-sm px-4 py-2 rounded-md leading-4',
      lg: 'text-base px-5 py-2.5 rounded-lg',
      xl: 'text-lg px-6 py-3 rounded-xl',
    },
    states: {
      disabled: 'opacity-50 cursor-not-allowed pointer-events-none shadow-none border-opacity-50',
      loading: 'opacity-80 cursor-wait',
      active: 'translate-y-0.5 shadow-inner',
    }
  },

  'button-group': {
    base: 'inline-flex',
    variants: {
      attached: `inline-flex [&>*:not(:first-child)]:-ml-px 
                [&>*:not(:first-child)]:rounded-l-none 
                [&>*:not(:last-child)]:rounded-r-none
                [&>*:focus-visible]:relative [&>*:focus-visible]:z-10`,
      spaced: 'inline-flex space-x-2',
    }
  },
};
