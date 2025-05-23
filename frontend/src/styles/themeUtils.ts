// themeUtils.ts
import theme from './theme';
// Tipurile sunt folosite în JSDoc, deci trebuie să le păstrăm
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ComponentVariant, ComponentSize, ComponentClasses, ComponentState, ComponentType } from './themeTypes';

// Import pentru stilurile rafinate - applyVisualEffects este exportat pentru utilizare viitoare
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getEnhancedComponentClasses, applyVisualEffects } from './componentMapIntegration';

// Re-export pentru getEnhancedComponentClasses - ACEASTA ESTE FUNCȚIA RECOMANDATĂ DE UTILIZAT
export { getEnhancedComponentClasses, applyVisualEffects };

// NOTĂ IMPORTANTĂ: Noul sistem de stiluri rafinate folosește următoarele tipuri
// definite în themeTypes.ts. Verificați că folosiți aceste tipuri în loc de string-uri!
// - ComponentType: 'button' | 'input' | 'card' | etc.
// - ComponentVariant: 'primary' | 'secondary' | 'success' | etc.
// - ComponentSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
// - ComponentState: 'disabled' | 'active' | 'hover' | etc.

/**
 * @deprecated Acest obiect componentMap este păstrat doar pentru compatibilitate cu codul vechi.
 * Pentru cod nou, folosiți configurațiile din directorul componentMap/ și getEnhancedComponentClasses().
 * Va fi eliminat într-o versiune viitoare.
 */
const componentMap: Record<string, {
  base?: string;
  variants?: Record<string, string>;
  sizes?: Record<string, string>;
  states?: Record<string, string>;
}> = {
  button: {
    base: `font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center 
         relative overflow-hidden shadow-sm hover:shadow-md active:shadow-inner
         focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`,
    variants: {
      primary: `bg-gradient-to-r from-primary-500 to-primary-600 text-white 
              hover:from-primary-600 hover:to-primary-700
              active:from-primary-700 active:to-primary-800`,
              
      secondary: `bg-white text-secondary-700 border border-secondary-300 
                hover:bg-secondary-50 active:bg-secondary-100
                focus-visible:ring-secondary-300`,
                
      success: `bg-gradient-to-r from-success-500 to-success-600 text-white 
              hover:from-success-600 hover:to-success-700
              active:from-success-700 active:to-success-800`,
              
      danger: `bg-gradient-to-r from-error-500 to-error-600 text-white 
             hover:from-error-600 hover:to-error-700
             active:from-error-700 active:to-error-800`,
             
      ghost: `bg-transparent text-primary-600 
            hover:bg-primary-50 active:bg-primary-100
            focus-visible:ring-primary-300`,
            
      outline: `bg-transparent border-2 border-current text-primary-600 
              hover:bg-primary-50 active:bg-primary-100`,
              
      link: `bg-transparent text-primary-600 underline p-0 shadow-none
           hover:text-primary-700 active:text-primary-800`,
    },
    sizes: {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
      xl: 'px-6 py-3 text-lg',
    },
    states: {
      disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
      loading: 'opacity-70 cursor-wait',
      active: 'transform translate-y-px',
    }
  },
  
  input: {
    base: `w-full border rounded-lg px-3 py-2 transition-all duration-200
         bg-white shadow-sm focus:shadow-md
         appearance-none focus:outline-none`,
    variants: {
      primary: `border-secondary-300 text-secondary-900
              hover:border-secondary-400
              focus:border-primary-500 focus:ring-2 focus:ring-primary-100`,
              
      success: `border-success-300 text-secondary-900
              hover:border-success-400
              focus:border-success-500 focus:ring-2 focus:ring-success-100`,
              
      error: `border-error-300 text-secondary-900
            hover:border-error-400
            focus:border-error-500 focus:ring-2 focus:ring-error-100`,
    },
    sizes: {
      sm: 'px-2.5 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2.5 text-base',
      xl: 'px-5 py-3 text-lg',
    },
    states: {
      disabled: 'bg-secondary-50 cursor-not-allowed text-secondary-400',
      readonly: 'bg-secondary-50 cursor-default',
      error: 'border-error-500 focus:ring-error-200',
    }
  },
  
  // Noi adăugări - toate componentele primitive care lipsesc
  
  select: {
    base: `w-full appearance-none bg-white border rounded-lg px-3 py-2 pr-8
         transition-all duration-200 shadow-sm focus:shadow-md
         focus:outline-none`,
    variants: {
      primary: `border-secondary-300 text-secondary-900
              hover:border-secondary-400
              focus:border-primary-500 focus:ring-2 focus:ring-primary-100`,
      success: `border-success-300 text-secondary-900
              hover:border-success-400
              focus:border-success-500 focus:ring-2 focus:ring-success-100`,
      error: `border-error-300 text-secondary-900
            hover:border-error-400
            focus:border-error-500 focus:ring-2 focus:ring-error-100`,
    },
    sizes: {
      sm: 'px-2.5 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2.5 text-base',
      xl: 'px-5 py-3 text-lg',
    },
    states: {
      disabled: 'bg-secondary-50 cursor-not-allowed text-secondary-400',
      readonly: 'bg-secondary-50 cursor-default',
      error: 'border-error-500 focus:ring-error-200',
    }
  },
  
  textarea: {
    base: `w-full min-h-[100px] border rounded-lg px-3 py-2 transition-all duration-200
         bg-white shadow-sm focus:shadow-md
         appearance-none focus:outline-none resize-vertical`,
    variants: {
      primary: `border-secondary-300 text-secondary-900
              hover:border-secondary-400
              focus:border-primary-500 focus:ring-2 focus:ring-primary-100`,
      success: `border-success-300 text-secondary-900
              hover:border-success-400
              focus:border-success-500 focus:ring-2 focus:ring-success-100`,
      error: `border-error-300 text-secondary-900
            hover:border-error-400
            focus:border-error-500 focus:ring-2 focus:ring-error-100`,
    },
    sizes: {
      sm: 'px-2.5 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2.5 text-base',
      xl: 'px-5 py-3 text-lg',
    },
    states: {
      disabled: 'bg-secondary-50 cursor-not-allowed text-secondary-400',
      readonly: 'bg-secondary-50 cursor-default',
      error: 'border-error-500 focus:ring-error-200',
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
  
  checkbox: {
    base: `h-4 w-4 rounded border-secondary-300 text-primary-600
         focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`,
    variants: {
      primary: 'text-primary-600 focus:ring-primary-500',
      success: 'text-success-600 focus:ring-success-500',
      error: 'text-error-600 focus:ring-error-500',
    },
    states: {
      disabled: 'opacity-50 cursor-not-allowed',
      error: 'border-error-500',
    }
  },
  
  'checkbox-label': {
    base: 'ml-2 block text-sm font-medium text-secondary-700',
    states: {
      disabled: 'text-secondary-400',
    }
  },
  
  radio: {
    base: `h-4 w-4 border-secondary-300 text-primary-600
         focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`,
    variants: {
      primary: 'text-primary-600 focus:ring-primary-500',
      success: 'text-success-600 focus:ring-success-500',
      error: 'text-error-600 focus:ring-error-500',
    },
    states: {
      disabled: 'opacity-50 cursor-not-allowed',
      error: 'border-error-500',
    }
  },
  
  'radio-label': {
    base: 'ml-2 block text-sm font-medium text-secondary-700',
    states: {
      disabled: 'text-secondary-400',
    }
  },
  
  'radio-group': {
    base: 'flex items-center space-x-4',
    variants: {
      vertical: 'flex-col items-start space-y-2 space-x-0',
    },
    states: {
      disabled: 'opacity-60',
    }
  },
  
  badge: {
    base: `inline-flex items-center justify-center font-medium rounded-full px-2.5 py-0.5
         text-xs leading-4 whitespace-nowrap`,
    variants: {
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-secondary-100 text-secondary-800',
      success: 'bg-success-100 text-success-800',
      error: 'bg-error-100 text-error-800',
      warning: 'bg-warning-100 text-warning-800',
      info: 'bg-blue-100 text-blue-800',
    },
    sizes: {
      xs: 'px-1.5 py-0.5 text-xxs',
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1 text-base',
    }
  },
  
  'badge-variant': {
    variants: {
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-secondary-100 text-secondary-800',
      success: 'bg-success-100 text-success-800',
      error: 'bg-error-100 text-error-800',
      warning: 'bg-warning-100 text-warning-800',
      info: 'bg-blue-100 text-blue-800',
    }
  },
  
  alert: {
    base: `relative border rounded-lg p-4 my-2 text-sm
         flex items-start`,
    variants: {
      info: `bg-blue-50 border-l-4 border-blue-300 text-blue-800`,
      success: `bg-success-50 border-l-4 border-success-300 text-success-800`,
      warning: `bg-warning-50 border-l-4 border-warning-300 text-warning-800`,
      error: `bg-error-50 border-l-4 border-error-300 text-error-800`,
    },
    sizes: {
      sm: 'p-3 text-xs',
      md: 'p-4 text-sm',
      lg: 'p-5 text-base',
    }
  },
  
  'alert-variant': {
    variants: {
      info: `bg-blue-50 border-l-4 border-blue-300 text-blue-800`,
      success: `bg-success-50 border-l-4 border-success-300 text-success-800`,
      warning: `bg-warning-50 border-l-4 border-warning-300 text-warning-800`,
      error: `bg-error-50 border-l-4 border-error-300 text-error-800`,
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
    base: 'ml-3 text-secondary-700 text-sm',
  },
  
  card: {
    base: `bg-white rounded-lg overflow-hidden transition-shadow duration-200`,
    variants: {
      default: `border border-secondary-200 shadow-sm hover:shadow-md`,
      elevated: `shadow-md hover:shadow-lg`,
      flat: `border border-secondary-200`,
      interactive: `border border-secondary-200 shadow-sm 
                  hover:shadow-md hover:border-primary-200 
                  cursor-pointer active:shadow-inner`,
    },
    sizes: {
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-7',
    }
  },
  
  'card-header': {
    base: 'px-5 py-4 border-b border-secondary-200 bg-secondary-50 font-semibold',
  },
  
  'card-body': {
    base: 'p-5',
  },
  
  'card-footer': {
    base: 'px-5 py-4 border-t border-secondary-200 bg-secondary-50',
  },
  
  'form-group': {
    base: `flex flex-col space-y-1.5 mb-4`,
    variants: {
      default: '',
      inline: 'sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4',
      grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
    }
  },
  
  'form-label': {
    base: 'block text-sm font-medium text-secondary-700',
    states: {
      required: 'after:content-["*"] after:ml-0.5 after:text-error-500',
    }
  },
  
  'form-error': {
    base: 'text-error-600 text-xs mt-1',
  },
  
  'form-success-message': {
    base: 'text-success-600 block mt-token w-full text-center',
  },
  
  'form-error-message': {
    base: 'text-error-600 block mt-token w-full text-center',
  },
  
  'form-container': {
    base: 'bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto',
  },
  
  'transaction-form': {
    base: 'flex flex-wrap gap-token mb-token items-end',
  },
  
  'button-group': {
    base: 'inline-flex',
    variants: {
      attached: 'inline-flex [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none',
      spaced: 'inline-flex space-x-2',
    }
  },
  
  'input-group': {
    base: 'flex',
    variants: {
      attached: 'flex [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none',
    }
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
      cols2: 'grid-cols-1 sm:grid-cols-2',
      cols3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      cols4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    }
  },
  
  flex: {
    base: 'flex',
    variants: {
      row: 'flex-row',
      col: 'flex-col',
      rowReverse: 'flex-row-reverse',
      colReverse: 'flex-col-reverse',
      wrap: 'flex-wrap',
      nowrap: 'flex-nowrap',
    }
  },
  
  'table-container': {
    base: 'overflow-x-auto rounded-lg shadow-sm bg-white',
  },
  
  table: {
    base: 'min-w-full divide-y divide-secondary-200',
    variants: {
      striped: 'min-w-full divide-y divide-secondary-200 [&>tbody>*:nth-child(odd)]:bg-secondary-50',
      bordered: 'min-w-full divide-y divide-secondary-200 border-collapse border border-secondary-200 [&>*>tr>*]:border [&>*>tr>*]:border-secondary-200',
    }
  },
  
  'table-header': {
    base: 'bg-secondary-50 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider py-3 px-4',
  },
  
  'table-cell': {
    base: 'px-4 py-3 whitespace-nowrap text-sm text-secondary-900',
  },
  
  'table-row': {
    base: 'hover:bg-secondary-50 transition-colors duration-150',
    states: {
      active: 'bg-primary-50',
      selected: 'bg-primary-50',
    }
  },
  
  modal: {
    base: 'fixed inset-0 z-50 flex items-center justify-center',
    variants: {
      default: 'bg-black bg-opacity-50',
      blur: 'backdrop-blur-sm bg-black bg-opacity-30',
    }
  },
  
  'modal-content': {
    base: 'bg-white rounded-lg shadow-xl max-h-[90vh] overflow-auto',
    sizes: {
      sm: 'w-full max-w-md',
      md: 'w-full max-w-lg',
      lg: 'w-full max-w-2xl',
      xl: 'w-full max-w-4xl',
      full: 'w-full max-w-full h-full rounded-none',
    }
  },
  
  'modal-header': {
    base: 'px-6 py-4 border-b border-secondary-200 flex justify-between items-center',
  },
  
  'modal-body': {
    base: 'p-6',
  },
  
  'modal-footer': {
    base: 'px-6 py-4 border-t border-secondary-200 flex justify-end space-x-2',
  },
  
  sidebar: {
    base: 'flex flex-col h-full bg-white border-r border-secondary-200',
    sizes: {
      sm: 'w-64',
      md: 'w-72',
      lg: 'w-80',
    }
  },
  
  'sidebar-header': {
    base: 'p-4 border-b border-secondary-200 font-semibold',
  },
  
  'sidebar-content': {
    base: 'flex-1 overflow-auto',
  },
  
  'sidebar-footer': {
    base: 'p-4 border-t border-secondary-200',
  },
  
  navbar: {
    base: 'bg-white border-b border-secondary-200 shadow-sm',
    variants: {
      primary: 'bg-primary-600 text-white',
      secondary: 'bg-secondary-700 text-white',
      transparent: 'bg-transparent',
    }
  },
  
  'navbar-container': {
    base: 'flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8',
  },
  
  toast: {
    base: 'rounded-lg shadow-lg border-l-4 p-4 max-w-sm w-full pointer-events-auto',
    variants: {
      info: 'bg-blue-50 border-blue-500 text-blue-800',
      success: 'bg-success-50 border-success-500 text-success-800',
      warning: 'bg-warning-50 border-warning-500 text-warning-800',
      error: 'bg-error-50 border-error-500 text-error-800',
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
  
  dropdown: {
    base: 'absolute z-10 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-secondary-100 focus:outline-none',
  },
  
  'dropdown-item': {
    base: 'block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900',
    variants: {
      active: 'bg-primary-100 text-primary-900',
      disabled: 'text-secondary-400 pointer-events-none',
      danger: 'text-error-600 hover:bg-error-50 hover:text-error-700',
    }
  },
  
  tab: {
    base: 'px-4 py-2 text-sm font-medium',
    variants: {
      underline: 'border-b-2 border-transparent hover:border-secondary-300 hover:text-secondary-700',
      pill: 'rounded-full hover:bg-secondary-100 hover:text-secondary-700',
      card: 'rounded-t-lg hover:bg-secondary-50 hover:text-secondary-700',
    },
    states: {
      active: 'data-[variant=underline]:border-b-2 data-[variant=underline]:border-primary-500 data-[variant=underline]:text-primary-600 data-[variant=pill]:bg-primary-100 data-[variant=pill]:text-primary-700 data-[variant=card]:bg-white data-[variant=card]:text-primary-600 data-[variant=card]:border-t data-[variant=card]:border-l data-[variant=card]:border-r data-[variant=card]:border-secondary-200'
    }
  },
  
  'tab-panel': {
    base: 'p-4',
    variants: {
      card: 'bg-white border border-secondary-200 rounded-b-lg p-4',
    }
  },
  
  'tab-panels': {
    base: 'mt-4',
  },
  
  'button-state': {
    states: {
      disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
      loading: 'opacity-70 cursor-wait',
      active: 'transform translate-y-px',
    }
  },
  
  'input-state': {
    states: {
      disabled: 'bg-secondary-50 cursor-not-allowed text-secondary-400',
      readonly: 'bg-secondary-50 cursor-default',
      error: 'border-error-500 focus:ring-error-200',
    }
  }
};

/**
 * @deprecated Folosiți `getEnhancedComponentClasses` în loc de această funcție.
 * Aceasta este păstrată doar pentru compatibilitate cu codul existent.
 * 
 * Funcție extinsă pentru a genera clase CSS pentru componente bazate pe tipul, varianta, dimensiunea și starea lor
 * @param componentType - Tipul componentei (button, input, select, etc.)
 * @param variant - Varianta de stilizare (primary, secondary, success, etc.)
 * @param size - Dimensiunea (xs, sm, md, lg, xl)
 * @param state - Starea (default, hover, active, focus, disabled, loading, error, success)
 * @returns String cu clasele CSS concatenate
 */
export function getComponentClasses(
  componentType: string,
  variant?: string,
  size?: string,
  state?: string
): ComponentClasses {
  // Afișare avertisment despre funcția deprecată în development
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '[DEPRECATED] getComponentClasses este o funcție deprecată și va fi eliminată în versiunile viitoare.'
      + ' Folosiți `getEnhancedComponentClasses` din componentMapIntegration.ts în loc.'
    );
  }

  const config = componentMap[componentType];
  if (!config) {
    console.warn(`No configuration found for component type: ${componentType}`);
    return '';
  }

  // Adună toate clasele aplicabile
  const classes: string[] = [];
  
  // Clasele de bază pentru componenta respectivă
  if (config.base) {
    classes.push(config.base);
  }
  
  // Clasele pentru varianta specificată
  if (variant && config.variants && config.variants[variant]) {
    classes.push(config.variants[variant]);
  }
  
  // Clasele pentru dimensiunea specificată
  if (size && config.sizes && config.sizes[size]) {
    classes.push(config.sizes[size]);
  }
  
  // Clasele pentru starea specificată
  if (state && config.states && config.states[state]) {
    // Verificăm dacă config.states[state] este un string sau un obiect
    const stateValue = config.states[state];
    if (typeof stateValue === 'string') {
      classes.push(stateValue);
    } else if (variant && typeof stateValue === 'object' && stateValue !== null) {
      // Dacă este un obiect, încercăm să luăm starea specifică variantei
      const stateObj = stateValue as Record<string, string>;
      if (stateObj[variant]) {
        classes.push(stateObj[variant]);
      }
    }
  }

  // Filtrăm valorile undefined sau goale și le unim cu spații
  return classes.filter(Boolean).join(' ');
}

/**
 * Convertește o valoare de culoare din temă într-o clasă Tailwind
 * @param type - Tipul de clasă (text, bg, border)
 * @param color - Cheia culorii din temă (primary, secondary, success, etc.)
 * @param shade - Nuanța culorii (50, 100, 200, ..., 900)
 * @returns Clasa Tailwind corespunzătoare
 */
export function getColorClass(type: 'text' | 'bg' | 'border', color: string, shade?: string | number): string {
  const prefix = {
    text: 'text',
    bg: 'bg',
    border: 'border',
  }[type];
  
  return shade ? `${prefix}-${color}-${shade}` : `${prefix}-${color}`;
}

/**
 * Obține valoarea dintr-o cale specificată în temă (ex: 'colors.primary.500')
 * @param path - Calea către valoarea din temă
 * @returns Valoarea din temă sau undefined dacă nu există
 */
export function getThemeValue(path: string): unknown {
  const parts = path.split('.');
  let value: unknown = theme;
  
  for (const key of parts) {
    if (value && typeof value === 'object' && key in value) {
      // @ts-expect-error: acces nested controlat
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return value;
}

/**
 * Generează clase responsive pentru diferite breakpoints
 * @param config - Configurația claselor pentru fiecare breakpoint
 * @returns String concatenat de clase responsive
 * @example
 * responsive({
 *   base: 'text-sm',
 *   sm: 'text-base',
 *   md: 'text-lg',
 *   lg: 'text-xl'
 * }) 
 * // => "text-sm sm:text-base md:text-lg lg:text-xl"
 */
export function responsive(config: Record<string, string>): string {
  return Object.entries(config)
    .map(([breakpoint, value]) => (breakpoint === 'base' ? value : `${breakpoint}:${value}`))
    .join(' ');
}