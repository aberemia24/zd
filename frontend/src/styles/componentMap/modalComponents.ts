/**
 * Stil rafinate pentru componente modale
 * Această componentă definește stilurile pentru diferite tipuri de modale în aplicație
 * 
 * Responsabil: echipa FE
 * Creat: 2025-05-20
 */

import type { ComponentStyleConfig } from './index';

/**
 * Definirea stilurilor pentru componente modale
 */
export const modalComponents: Record<string, ComponentStyleConfig> = {
  'modal-overlay': {
    base: 'fixed inset-0 bg-secondary-900/50 flex items-center justify-center z-50',
    variants: {
      fixed: 'fixed',
      absolute: 'absolute'
    }
  },
  
  'modal-container': {
    base: 'bg-white shadow-xl rounded-lg overflow-hidden',
    variants: {
      default: 'w-full max-w-md',
      wide: 'w-full max-w-3xl',
      fullWidth: 'w-full max-w-5xl',
      small: 'w-full max-w-sm'
    },
    sizes: {
      auto: '',
      sm: 'max-h-[70vh]',
      md: 'max-h-[80vh]',
      lg: 'max-h-[90vh]',
      xl: 'max-h-screen'
    }
  },
  
  'modal-header': {
    base: 'p-4 border-b border-secondary-200 flex items-center justify-between',
    variants: {
      default: '',
      compact: 'p-2',
      withBg: 'bg-secondary-50'
    }
  },
  
  'modal-title': {
    base: 'text-lg font-semibold text-secondary-900',
    variants: {
      default: '',
      center: 'text-center w-full',
      large: 'text-xl'
    }
  },
  
  'modal-close-button': {
    base: 'p-2 rounded-full text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors',
    variants: {
      default: '',
      primary: 'text-primary-500 hover:bg-primary-50 hover:text-primary-700',
      contrast: 'bg-white'
    }
  },
  
  'modal-body': {
    base: 'p-4 overflow-y-auto',
    variants: {
      default: '',
      compact: 'p-2',
      spacious: 'p-6',
      noPadding: 'p-0'
    },
    sizes: {
      auto: '',
      sm: 'max-h-[300px]',
      md: 'max-h-[400px]',
      lg: 'max-h-[500px]',
      xl: 'max-h-[600px]'
    }
  },
  
  'modal-footer': {
    base: 'p-4 border-t border-secondary-200 flex items-center justify-end space-x-2',
    variants: {
      default: '',
      compact: 'p-2',
      spaceBetween: 'justify-between',
      center: 'justify-center',
      withBg: 'bg-secondary-50'
    }
  }
};

export default modalComponents;
