import { cva, type VariantProps } from "class-variance-authority";
import { TransactionType } from '@shared-constants';

/**
 * 🎨 FINANCIAL DOMAIN - Carbon Copper Design System
 * Componente specifice pentru aplicații financiare și budget management
 */

/**
 * Balance display pentru afișarea soldurilor
 */
export const balanceDisplay = cva([
  "font-mono tabular-nums font-semibold",
  "transition-all duration-200"
], {
  variants: {
    variant: {
      positive: [
        "text-emerald-600 dark:text-emerald-400",
        "hover:text-emerald-700 dark:hover:text-emerald-300"
      ],
      negative: [
        "text-red-600 dark:text-red-400",
        "hover:text-red-700 dark:hover:text-red-300"
      ],
      neutral: [
        "text-carbon-700 dark:text-carbon-300",
        "hover:text-carbon-800 dark:hover:text-carbon-200"
      ],
      primary: [
        "text-copper-600 dark:text-copper-400",
        "hover:text-copper-700 dark:hover:text-copper-300"
      ]
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl"
    },
    emphasis: {
      low: "font-normal",
      medium: "font-semibold",
      high: "font-bold text-shadow"
    }
  },
  defaultVariants: { variant: "neutral", size: "md", emphasis: "medium" }
});

/**
 * Transaction form styling pentru formulare financiare
 */
export const transactionForm = cva([
  "space-y-4 p-6 bg-carbon-50 dark:bg-carbon-900",
  "rounded-lg border border-carbon-200 dark:border-carbon-700",
  "transition-all duration-200"
], {
  variants: {
    variant: {
      default: "",
      compact: "space-y-2 p-4",
      detailed: "space-y-6 p-8"
    },
    state: {
      editing: "ring-2 ring-copper-500/20 border-copper-300 dark:border-copper-600",
      saving: "opacity-75 pointer-events-none animate-pulse",
      error: "ring-2 ring-red-500/20 border-red-300 dark:border-red-600"
    }
  },
  defaultVariants: { variant: "default", state: "editing" }
});

/**
 * Financial category badge pentru categorii de tranzacții
 */
export const categoryBadge = cva([
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
  "transition-colors duration-200"
], {
  variants: {
    type: {
      income: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      expense: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      transfer: "bg-copper-100 text-copper-700 dark:bg-copper-900/30 dark:text-copper-300",
      investment: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    },
    size: {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-xs", 
      lg: "px-3 py-1 text-sm"
    }
  },
  defaultVariants: { type: TransactionType.EXPENSE, size: "md" }
});

/**
 * Amount input styling pentru input-uri de sume financiare
 */
export const amountInput = cva([
  "font-mono tabular-nums text-right",
  "border rounded-md px-3 py-2 text-sm",
  "transition-colors duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
], {
  variants: {
    variant: {
      default: [
        "border-carbon-300 bg-carbon-50",
        "focus-visible:ring-copper-500 dark:border-carbon-600 dark:bg-carbon-900"
      ],
      positive: [
        "border-emerald-300 bg-emerald-50",
        "focus-visible:ring-emerald-500 dark:border-emerald-600 dark:bg-emerald-900/20"
      ],
      negative: [
        "border-red-300 bg-red-50",
        "focus-visible:ring-red-500 dark:border-red-600 dark:bg-red-900/20"
      ]
    },
    size: {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-3 text-base"
    }
  },
  defaultVariants: { variant: "default", size: "md" }
});

/**
 * Type exports pentru TypeScript
 */
export type BalanceDisplayProps = VariantProps<typeof balanceDisplay>;
export type TransactionFormProps = VariantProps<typeof transactionForm>;
export type CategoryBadgeProps = VariantProps<typeof categoryBadge>;
export type AmountInputProps = VariantProps<typeof amountInput>; 