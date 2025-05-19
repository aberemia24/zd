/**
 * Componente de formular cu stiluri rafinate
 * Folosește sistemul de design tokens și respectă arhitectura aplicației
 */

export const formComponents = {
  input: {
    base: `w-full border rounded-lg px-3 py-2 
           transition-all duration-200
           bg-white shadow-sm
           placeholder:text-secondary-400
           appearance-none focus:outline-none`,
    variants: {
      primary: `border-secondary-300 text-secondary-900
                hover:border-secondary-400 hover:shadow
                focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:shadow-md`,
                
      success: `border-success-300 text-secondary-900
                hover:border-success-400 hover:shadow
                focus:border-success-500 focus:ring-2 focus:ring-success-100 focus:shadow-md`,
                
      error: `border-error-300 text-secondary-900
              hover:border-error-400 hover:shadow
              focus:border-error-500 focus:ring-2 focus:ring-error-100 focus:shadow-md`,
    },
    sizes: {
      sm: 'px-2.5 py-1.5 text-sm rounded',
      md: 'px-3 py-2 text-sm rounded-md',
      lg: 'px-4 py-2.5 text-base rounded-lg',
      xl: 'px-5 py-3 text-lg rounded-xl',
    },
    states: {
      disabled: 'bg-secondary-50 cursor-not-allowed text-secondary-400 shadow-none border-secondary-200',
      readonly: 'bg-secondary-50 cursor-default shadow-none',
      error: 'border-error-500 focus:ring-error-200',
    }
  },

  select: {
    base: `w-full appearance-none bg-white border rounded-lg px-3 py-2 pr-8
           transition-all duration-200
           shadow-sm
           bg-no-repeat bg-right
           focus:outline-none
           bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")]
           bg-[length:1em_1em]
           pr-[2.5em]`,
    variants: {
      primary: `border-secondary-300 text-secondary-900
                hover:border-secondary-400 hover:shadow
                focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:shadow-md`,
      success: `border-success-300 text-secondary-900
                hover:border-success-400 hover:shadow
                focus:border-success-500 focus:ring-2 focus:ring-success-100 focus:shadow-md`,
      error: `border-error-300 text-secondary-900
              hover:border-error-400 hover:shadow
              focus:border-error-500 focus:ring-2 focus:ring-error-100 focus:shadow-md`,
    },
    sizes: {
      sm: 'px-2.5 py-1.5 text-sm rounded',
      md: 'px-3 py-2 text-sm rounded-md',
      lg: 'px-4 py-2.5 text-base rounded-lg',
      xl: 'px-5 py-3 text-lg rounded-xl',
    },
    states: {
      disabled: 'bg-secondary-50 cursor-not-allowed text-secondary-400 shadow-none border-secondary-200',
      readonly: 'bg-secondary-50 cursor-default shadow-none',
      error: 'border-error-500 focus:ring-error-200',
    }
  },

  textarea: {
    base: `w-full min-h-[100px] border rounded-lg px-3 py-2 
           transition-all duration-200
           bg-white shadow-sm
           placeholder:text-secondary-400
           appearance-none focus:outline-none resize-vertical`,
    variants: {
      primary: `border-secondary-300 text-secondary-900
                hover:border-secondary-400 hover:shadow
                focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:shadow-md`,
      success: `border-success-300 text-secondary-900
                hover:border-success-400 hover:shadow
                focus:border-success-500 focus:ring-2 focus:ring-success-100 focus:shadow-md`,
      error: `border-error-300 text-secondary-900
              hover:border-error-400 hover:shadow
              focus:border-error-500 focus:ring-2 focus:ring-error-100 focus:shadow-md`,
    },
    sizes: {
      sm: 'px-2.5 py-2 text-sm rounded',
      md: 'px-3 py-2.5 text-sm rounded-md',
      lg: 'px-4 py-3 text-base rounded-lg',
      xl: 'px-5 py-3.5 text-lg rounded-xl',
    },
    states: {
      disabled: 'bg-secondary-50 cursor-not-allowed text-secondary-400 shadow-none border-secondary-200',
      readonly: 'bg-secondary-50 cursor-default shadow-none',
      error: 'border-error-500 focus:ring-error-200',
    }
  },

  checkbox: {
    base: `h-4 w-4 rounded border-secondary-300 
           shadow-sm
           transition-colors duration-200
           focus:outline-none focus:ring-2 focus:ring-offset-2`,
    variants: {
      primary: 'text-primary-600 focus:ring-primary-500 checked:border-primary-600 checked:bg-primary-600',
      success: 'text-success-600 focus:ring-success-500 checked:border-success-600 checked:bg-success-600',
      error: 'text-error-600 focus:ring-error-500 checked:border-error-600 checked:bg-error-600',
    },
    states: {
      disabled: 'opacity-50 cursor-not-allowed bg-secondary-100',
      error: 'border-error-500 focus:ring-error-300',
    }
  },

  'checkbox-group': {
    base: 'flex items-center space-x-2',
    variants: {
      vertical: 'flex-col items-start space-y-2 space-x-0',
    },
    states: {
      disabled: 'opacity-60',
    }
  },

  'checkbox-label': {
    base: 'ml-2 block text-sm font-medium text-secondary-700 select-none transition-colors duration-200',
    states: {
      disabled: 'text-secondary-400',
      error: 'text-error-600',
    }
  },

  radio: {
    base: `h-4 w-4 border-secondary-300 
           shadow-sm
           transition-colors duration-200
           focus:outline-none focus:ring-2 focus:ring-offset-2`,
    variants: {
      primary: 'text-primary-600 focus:ring-primary-500 checked:border-primary-600 checked:bg-primary-600',
      success: 'text-success-600 focus:ring-success-500 checked:border-success-600 checked:bg-success-600',
      error: 'text-error-600 focus:ring-error-500 checked:border-error-600 checked:bg-error-600',
    },
    states: {
      disabled: 'opacity-50 cursor-not-allowed bg-secondary-100',
      error: 'border-error-500 focus:ring-error-300',
    }
  },

  'radio-label': {
    base: 'ml-2 block text-sm font-medium text-secondary-700 select-none transition-colors duration-200',
    states: {
      disabled: 'text-secondary-400',
      error: 'text-error-600',
    }
  },
};
