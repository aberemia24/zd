// Importăm tipurile necesare pentru componentă
import type { ComponentType, ComponentVariant, ComponentSize, ComponentState } from '../themeTypes';

/**
 * Configurație pentru componenta de tabel și elementele asociate
 */
const tableConfig: Record<string, {
  base?: string;
  variants?: Record<string, string>;
  sizes?: Record<string, string>;
  states?: Record<string, string>;
  modifiers?: Record<string, string>;
}> = {
  'table-container': {
    base: 'relative w-full overflow-x-auto shadow-token rounded-token',
    variants: {
      default: 'bg-surface',
      bordered: 'border border-secondary-token',
      striped: 'bg-surface rounded-token'
    },
    modifiers: {
      responsive: 'responsive overflow-x-auto',
      'shadow-hover': 'hover:shadow-token-lg transition-token',
      'rounded-corners': 'rounded-token',
      'fade-in': 'animate-fadeIn'
    }
  },
  
  table: {
    base: 'min-w-full divide-y divide-secondary-token border-collapse',
    variants: {
      default: 'table-auto',
      striped: 'table-auto w-full text-token',
      compact: 'table-fixed text-token-xs'
    },
    sizes: {
      sm: 'text-token-xs',
      md: 'text-token',
      lg: 'text-token-lg'
    }
  },
  
  'table-header-row': {
    base: 'bg-secondary-token-50 text-left text-token-xs uppercase tracking-wider',
    variants: {
      default: 'border-b border-secondary-token',
      accent: 'bg-primary-token-50 text-primary-token-700 border-b border-primary-token'
    },
    modifiers: {
      'sticky-header': 'sticky top-0 z-token',
      'gradient-bg-subtle': 'bg-gradient-token from-secondary-token-50 to-secondary-token-100'
    }
  },
  
  'table-header': {
    base: 'p-token text-secondary-token-700 font-medium',
    variants: {
      default: '',
      sortable: 'cursor-pointer hover:bg-secondary-token-100'
    }
  },
  
  'table-row': {
    base: 'bg-surface border-b border-secondary-token-100 last:border-b-0',
    variants: {
      default: '',
      striped: 'even:bg-secondary-token-50',
      highlight: 'hover:bg-primary-token-50'
    },
    states: {
      selected: 'bg-primary-token-50',
      disabled: 'opacity-50 bg-secondary-token-50'
    },
    modifiers: {
      'hover-highlight': 'hover:bg-secondary-token-50',
      'smooth-transition': 'transition-token'
    }
  },
  
  'table-cell': {
    base: 'p-token whitespace-nowrap',
    variants: {
      default: 'text-secondary-token-800',
      primary: 'text-primary-token font-medium',
      secondary: 'text-secondary-token',
      success: 'text-success-token',
      warning: 'text-warning-token',
      error: 'text-error-token',
      info: 'text-info-token'
    },
    modifiers: {
      'text-center': 'text-center',
      'text-right': 'text-right',
      'text-wrap': 'whitespace-normal',
      'py-8': 'py-token-lg'
    }
  },
  
  'table-footer': {
    base: 'bg-secondary-token-50 p-token border-t border-secondary-token',
    variants: {
      default: '',
      accent: 'bg-primary-token-50 border-t border-primary-token'
    }
  },
  
  pagination: {
    base: 'flex items-center justify-between',
    variants: {
      default: '',
      compact: 'text-token-xs'
    }
  },
  
  'pagination-button': {
    base: 'p-token-sm rounded-token bg-surface border border-secondary-token text-secondary-token-700',
    variants: {
      default: 'hover:bg-secondary-token-50',
      active: 'bg-primary-token-50 text-primary-token-700 border-primary-token'
    },
    states: {
      disabled: 'opacity-50 cursor-not-allowed'
    }
  },

  // Adăugare clase pentru overlay
  overlay: {
    base: 'absolute inset-0 flex items-center justify-center z-token',
    variants: {
      default: 'bg-surface bg-opacity-token',
      loading: 'bg-surface bg-opacity-token pointer-events-none',
      dark: 'bg-secondary-token-900 bg-opacity-token-75',
      blur: 'backdrop-blur-token bg-surface bg-opacity-token-30'
    }
  }
};

export default tableConfig; 