/**
 * Componente de date cu stiluri rafinate
 * Folosește sistemul de design tokens și respectă arhitectura aplicației
 */

export const dataComponents = {
  'table-container': {
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
};
