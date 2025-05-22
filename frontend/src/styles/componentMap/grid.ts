// Importăm tipurile necesare pentru componentă
import type { ComponentType, ComponentVariant, ComponentSize, ComponentState } from '../themeTypes';

/**
 * Configurație pentru componenta LunarGrid și elementele asociate
 */
const gridConfig: Record<string, {
  base?: string;
  variants?: Record<string, string>;
  sizes?: Record<string, string>;
  states?: Record<string, string>;
  modifiers?: Record<string, string>;
}> = {
  'grid-container': {
    base: 'overflow-auto rounded-lg shadow-token h-[600px]',
    variants: {
      default: 'bg-surface',
      primary: 'bg-primary-token-50',
      secondary: 'bg-secondary-token-50',
      bordered: 'border border-secondary-token-200'
    },
    states: {
      loading: 'opacity-75',
      error: 'border-error-token'
    }
  },
  
  'grid-table': {
    base: 'w-full text-sm align-middle border-separate border-spacing-0',
    variants: {
      default: '',
      striped: 'border-collapse',
      bordered: 'border border-secondary-token-200'
    }
  },
  
  'grid-header': {
    base: 'bg-secondary-token-100 sticky top-0 z-10',
    variants: {
      default: '',
      primary: 'bg-primary-token-50',
      bordered: 'border-b border-secondary-token-200'
    }
  },
  
  'grid-header-cell': {
    base: 'px-token-md py-token-sm font-medium text-secondary-token-700 border-b border-secondary-token-200',
    variants: {
      default: '',
      sticky: 'sticky left-0 z-20 text-left',
      numeric: 'text-right'
    },
    states: {
      sorted: 'bg-secondary-token-200'
    }
  },

  'grid-category-row': {
    base: 'cursor-pointer',
    variants: {
      default: 'bg-secondary-token-100 hover:bg-secondary-token-200',
      primary: 'bg-primary-token-50 hover:bg-primary-token-100',
      expanded: 'bg-primary-token-50'
    },
    states: {
      selected: 'bg-primary-token-100'
    }
  },

  'grid-category-cell': {
    base: 'sticky left-0 z-10 px-token-md py-token-sm flex items-center',
    variants: {
      default: 'bg-secondary-token-100 hover:bg-secondary-token-200',
      primary: 'bg-primary-token-50 hover:bg-primary-token-100',
      bold: 'font-semibold'
    }
  },
  
  'grid-subcategory-row': {
    base: 'group border-t border-secondary-token-200',
    variants: {
      default: 'hover:bg-secondary-token-100',
      active: 'bg-secondary-token-50'
    }
  },
  
  'grid-subcategory-cell': {
    base: 'sticky left-0 excel-header z-10 px-token-md py-token-sm',
    variants: {
      default: '',
      indented: 'pl-token-lg'
    }
  },
  
  'grid-value-cell': {
    base: 'px-token-md py-token-sm text-right cursor-pointer',
    variants: {
      positive: 'text-success-token-600 font-medium',
      negative: 'text-error-token-600 font-medium',
      neutral: 'text-secondary-token-500'
    },
    states: {
      highlighted: 'bg-secondary-token-100'
    }
  },
  
  'grid-total-row': {
    base: 'bg-gray-100 font-bold border-t-2',
    variants: {
      default: '',
      balance: 'bg-secondary-token-200'
    }
  },
  
  'grid-total-cell': {
    base: 'sticky left-0 bg-gray-100 z-10 px-token-md py-token-sm',
    variants: {
      default: '',
      balance: 'font-bold'
    }
  },
  
  'grid-action-group': {
    base: 'flex justify-end space-x-token-sm mb-token-sm',
    variants: {
      default: '',
      compact: 'mb-token-xs'
    }
  },
  
  'grid-message': {
    base: 'text-center py-token-xl',
    variants: {
      default: 'text-secondary-token-600',
      error: 'text-error-token-600',
      loading: 'text-secondary-token-400'
    }
  },
  
  'grid-expand-icon': {
    base: 'mr-token-xs',
    variants: {
      expanded: 'transform rotate-90',
      collapsed: 'transform rotate-0'
    },
    states: {
      animated: 'transition-transform duration-200'
    }
  },
  
  'grid-cell-actions': {
    base: 'hidden group-hover:flex space-x-token-xs',
    variants: {
      default: '',
      right: 'absolute right-0 top-1/2 -translate-y-1/2 mr-token-sm'
    }
  },

  'grid-action-button': {
    base: 'p-token-xs',
    variants: {
      default: 'text-secondary-token-500 hover:text-secondary-token-700',
      edit: 'text-secondary-token-500 hover:text-accent-token',
      delete: 'text-secondary-token-500 hover:text-error-token-600'
    },
    states: {
      focus: 'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-token-300'
    }
  },
  
  'grid-popover': {
    base: 'absolute top-0 left-0 z-50',
    variants: {
      default: 'bg-surface shadow-token rounded-token',
      withTransition: 'transition-opacity duration-200'
    },
    states: {
      visible: 'opacity-100',
      hidden: 'opacity-0 pointer-events-none'
    }
  }
};

export default gridConfig; 