// Stiluri specifice pentru componente, bazate pe tokens
import theme from './theme';

// Exemplu: tema pentru LunarGrid (folosește tokens semantic)
export const lunarGridTheme = {
  container: 'rounded-lg shadow-sm border border-gray-200 overflow-hidden',
  header: {
    base: 'sticky top-0 z-20 bg-white shadow-sm',
    cell: 'px-4 py-3 text-sm font-medium text-gray-600 border-b border-gray-200',
  },
  categoryRow: {
    base: 'cursor-pointer transition-colors',
    expanded: 'bg-primary-50 hover:bg-primary-100',
    collapsed: 'bg-white hover:bg-gray-50',
    text: 'text-primary-800 font-medium',
  },
  subcategoryRow: {
    base: 'hover:bg-gray-50 border-t border-gray-100',
    text: 'text-gray-700',
    indent: 'pl-8',
  },
  amountCell: {
    base: 'text-right tabular-nums',
    positive: 'text-success-600 font-medium',
    negative: 'text-error-600 font-medium',
    zero: 'text-gray-400',
  },
  balanceRow: {
    base: 'bg-gray-100 border-t-2 border-gray-300 font-bold',
    text: 'text-gray-800',
  },
};

export const transactionFormTheme = {
  container: 'grid grid-cols-1 md:grid-cols-auto gap-4',
  field: {
    wrapper: 'space-y-1',
    label: 'text-sm font-medium text-gray-700',
    input: 'w-full',
    error: 'text-xs text-error-600 mt-1',
  },
  actions: {
    container: 'flex gap-3 col-span-full',
    button: {
      primary: 'bg-primary-500 text-white hover:bg-primary-600',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    },
  },
};

export const componentThemes = {
  lunarGrid: lunarGridTheme,
  transactionForm: transactionFormTheme,
  // Extensibil cu:
  // transactionTable: {...},
  // dashboard: {...},
  // navigation: {...},
};
