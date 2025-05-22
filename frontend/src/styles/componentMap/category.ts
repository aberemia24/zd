// Importăm tipurile necesare pentru componentă
import type { ComponentType, ComponentVariant, ComponentSize, ComponentState } from '../themeTypes';

/**
 * Configurație pentru componenta CategoryEditor și elementele asociate
 */
const categoryConfig: Record<string, {
  base?: string;
  variants?: Record<string, string>;
  sizes?: Record<string, string>;
  states?: Record<string, string>;
  modifiers?: Record<string, string>;
}> = {
  'category-container': {
    base: 'relative w-full rounded-token shadow-token',
    variants: {
      default: 'bg-surface',
      bordered: 'border border-secondary-token',
      compact: 'max-w-md mx-auto'
    },
    modifiers: {
      'with-scroll': 'overflow-y-auto scrollbar-token',
      'with-shadow': 'shadow-token',
      'with-hover': 'hover:shadow-token-lg transition-token'
    }
  },
  
  'category-list': {
    base: 'divide-y divide-secondary-token-100',
    variants: {
      default: 'bg-surface rounded-token',
      compact: 'text-token-sm',
      grid: 'grid grid-cols-1 md:grid-cols-2 gap-token'
    }
  },
  
  'category-item': {
    base: 'p-token flex items-center justify-between',
    variants: {
      default: 'hover:bg-secondary-token-50',
      compact: 'p-token-sm py-token-sm px-token',
      active: 'bg-primary-token-50 text-primary-token-700'
    },
    states: {
      selected: 'bg-primary-token-50 border-l-4 border-primary-token',
      disabled: 'opacity-50 pointer-events-none'
    },
    modifiers: {
      'with-hover': 'hover:bg-secondary-token-50 transition-token',
      'with-actions': 'grid grid-cols-[1fr,auto] gap-2 py-token-sm px-token items-center'
    }
  },
  
  'category-header': {
    base: 'text-token-lg font-medium mb-token',
    variants: {
      default: 'text-secondary-token-800',
      accent: 'text-primary-token-700',
      section: 'text-token-lg font-semibold mb-token-md text-primary-token-700 border-b border-secondary-token-200 pb-token-sm'
    }
  },
  
  'category-badge': {
    base: 'ml-token-sm text-token-xs rounded-full px-token-sm py-token-xs',
    variants: {
      default: 'bg-secondary-token-100 text-secondary-token-700',
      custom: 'bg-success-token-100 text-success-token-700',
      count: 'bg-primary-token-100 text-primary-token-700'
    },
    states: {
      pulse: 'animate-pulse'
    }
  },

  'category-action-button': {
    base: 'ml-token-sm text-token-xs rounded-token px-token-sm py-token-xs',
    variants: {
      edit: 'bg-accent-token text-white hover:bg-accent-token-dark',
      delete: 'bg-error-token text-white hover:bg-error-token-dark',
      confirm: 'bg-success-token text-white hover:bg-success-token-dark',
      cancel: 'bg-secondary-token-300 text-secondary-token-700 hover:bg-secondary-token-400'
    },
    states: {
      focus: 'ring-2 ring-primary-token-300 ring-offset-1',
      hover: 'scale-105 transition-transform'
    }
  },
  
  'category-add-form': {
    base: 'mt-token flex items-center gap-token-sm',
    variants: {
      default: 'mt-token-md p-token-sm border-t border-secondary-token-200 pt-token-md gap-token-sm',
      compact: 'flex-col items-start'
    }
  },
  
  'category-dialog': {
    base: 'p-token bg-surface rounded-token shadow-token',
    variants: {
      warning: 'border-l-4 border-warning-token bg-warning-token-50',
      danger: 'border-l-4 border-error-token bg-error-token-50',
      info: 'border-l-4 border-info-token bg-info-token-50'
    },
    modifiers: {
      'with-transition': 'transition-token',
      'with-fade': 'animate-fadeIn'
    }
  },
  
  // Efecte vizuale și animații
  'fx-transition': {
    base: 'transition-all duration-300 ease-in-out',
    variants: {
      'modal-open': 'opacity-100 visibility-visible',
      'modal-closed': 'opacity-0 visibility-hidden'
    }
  },
  
  'fx-fade': {
    base: 'transition-opacity duration-300 ease-in-out',
    variants: {
      in: 'opacity-100 transform translate-y-0',
      out: 'opacity-0 transform -translate-y-token-md'
    }
  },
  
  'fx-slide': {
    base: 'transition-transform duration-300 ease-in-out',
    variants: {
      in: 'transform translate-y-0',
      out: 'transform translate-y-token-lg',
      'in-right': 'transform translate-x-0',
      'out-right': 'transform translate-x-token-lg'
    }
  },
  
  // Stiluri pentru modal
  'modal-container': {
    base: 'rounded-lg shadow-lg max-w-4xl mx-auto mt-10',
    variants: {
      default: 'bg-surface',
      bordered: 'border border-secondary-token'
    },
    modifiers: {
      'with-animation': 'transition-all duration-300 ease-in-out transform'
    }
  },
  
  'modal-header': {
    base: 'border-b border-secondary-token-200 bg-primary-token-50 rounded-t-lg p-token-md',
    variants: {
      default: '',
      primary: 'bg-primary-token-50',
      secondary: 'bg-secondary-token-50'
    }
  },
  
  'modal-title': {
    base: 'text-token-xl font-bold text-primary-token-700',
    variants: {
      default: '',
      large: 'text-token-2xl'
    }
  },
  
  'modal-close-button': {
    base: 'text-token-2xl hover:text-error-token transition-colors',
    variants: {
      default: '',
      rounded: 'rounded-full'
    }
  },
  
  'modal-body': {
    base: 'p-token-lg bg-surface',
    variants: {
      default: '',
      padded: 'p-token-lg'
    }
  },
  
  'flex-group': {
    base: 'flex',
    variants: {
      between: 'justify-between items-start',
      center: 'justify-center items-center',
      start: 'justify-start items-start',
      end: 'justify-end items-start'
    },
    sizes: {
      sm: 'gap-token-sm',
      md: 'gap-token',
      lg: 'gap-token-lg'
    }
  },
  
  'card-section': {
    base: 'w-1/2 border border-secondary-token-200 rounded-lg p-token-md shadow-token',
    variants: {
      default: '',
      padded: 'p-token-md',
      bordered: 'border border-secondary-token-200'
    }
  },
  
  'subcategory-name': {
    base: 'pl-token-sm py-token-xs font-medium text-secondary-token-800',
    variants: {
      default: '',
      highlighted: 'text-primary-token-700'
    }
  }
};

export default categoryConfig; 