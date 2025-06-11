Stiluri rafinate pentru componentMap
Am analizat stilurile existente și voi furniza îmbunătățiri complete pentru a adăuga efecte vizuale moderne, subtile și accesibile pentru toate componentele. Voi organiza acest răspuns pe categorii de componente pentru claritate.
1. Componente de acțiune (Button, etc.)
typescriptbutton: {
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
2. Componente de form (Input, Select, Checkbox, etc.)
typescriptinput: {
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
3. Componente de feedback (Alert, Badge, Toast, etc.)
typescriptbadge: {
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
4. Componente de layout (Card, Container, Modal, etc.)
typescriptcard: {
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
5. Componente de navigare (Tab, Sidebar, Navbar, etc.)
typescripttab: {
  base: `px-4 py-2 text-sm font-medium
         transition-all duration-200
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`,
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

navbar: {
  base: `bg-white border-b border-secondary-200 shadow-sm
         transition-all duration-200`,
  variants: {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md',
    secondary: 'bg-gradient-to-r from-secondary-700 to-secondary-800 text-white shadow-md',
    transparent: 'bg-transparent border-transparent',
  }
},
6. Componente de date (Table, etc.)
typescript'table-container': {
  base: 'overflow-x-auto rounded-lg shadow-sm bg-white border border-secondary-100',
},

table: {
  base: 'min-w-full divide-y divide-secondary-200',
  variants: {
    striped: 'min-w-full divide-y divide-secondary-200 [&>tbody>*:nth-child(odd)]:bg-secondary-50',
    bordered: 'min-w-full divide-y divide-secondary-200 border-collapse border border-secondary-200 [&>*>tr>*]:border [&>*>tr>*]:border-secondary-200',
    'hover-rows': 'min-w-full divide-y divide-secondary-200 [&>tbody>tr:hover]:bg-primary-50/50',
  }
},

'table-header': {
  base: `bg-gradient-to-r from-secondary-50 to-secondary-100/50 
         text-left text-xs font-medium text-secondary-500 uppercase tracking-wider py-3 px-4
         transition-colors duration-200
         first:rounded-tl-lg last:rounded-tr-lg`,
},

'table-cell': {
  base: 'px-4 py-3 whitespace-nowrap text-sm text-secondary-900 transition-colors duration-200',
  variants: {
    'with-hover': 'hover:bg-secondary-50 cursor-pointer',
  }
},

'table-row': {
  base: 'transition-colors duration-150 even:bg-secondary-50/30',
  variants: {
    'with-hover': 'hover:bg-primary-50/50 cursor-pointer',
  },
  states: {
    active: 'bg-primary-50',
    selected: 'bg-primary-50/70 hover:bg-primary-50',
  }
},

'table-pagination': {
  base: 'flex items-center justify-between border-t border-secondary-200 px-4 py-3 sm:px-6 bg-secondary-50',
},

'table-page-button': {
  base: `relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md
         transition-all duration-200
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1`,
  variants: {
    active: 'bg-primary-50 text-primary-600 cursor-default',
    default: 'text-secondary-500 hover:bg-secondary-100 active:bg-secondary-200',
    disabled: 'text-secondary-300 cursor-not-allowed',
  }
},

'table-sort-header': {
  base: 'group inline-flex items-center',
},

'table-sort-icon': {
  base: 'w-4 h-4 ml-1 transition-transform duration-200',
  variants: {
    asc: 'text-secondary-500',
    desc: 'text-secondary-500 transform rotate-180',
    none: 'text-secondary-300 opacity-0 group-hover:opacity-100',
  }
},
7. Alte componente utile (Dropdown, Loader, etc.)
typescriptdropdown: {
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
Efecte și stiluri speciale comune
typescript// Adaugă aceste efecte și stiluri comune
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
Note importante:

Accesibilitate îmbunătățită:

Am adăugat focus-visible:ring-2 pentru evidențierea elementelor în focus cu tastatură
Am inclus contrasturi corespunzătoare pentru text și fundal
Am adăugat stări pentru disabled, error, loading


Tranziții rafinate:

Folosesc transition-all pentru tranziții line
Duratele sunt optimizate pentru UX
Am adăugat will-change-transform pentru performanță


Efecte și umbre subtile:

Umbre care se schimbă la hover/active
Mici deplasări pentru feedback tactil (translate-y)
Efecte de gradienți subtile


Tratarea stărilor:

Toate stările importante sunt acoperite: default, hover, active, focus, disabled, loading, error
Am folosit stări nested pentru componente complexe precum taburile


Culori și gradienți:

Am folosit gradienți în loc de culori plate pentru butoane, navbar, headers
Am adăugat variante de stiluri cu gradient pentru componente vizuale (badge, card)



Această implementare completă acoperă toate componentele cu stiluri moderne și oferă consistență vizuală în toată aplicația.