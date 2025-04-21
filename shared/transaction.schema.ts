import { z } from 'zod';
import type { TransactionType, RecurrenceType } from './index';

/**
 * Schema Zod pentru validarea tranzacțiilor la runtime.
 * Inspirată din modelul Transaction (industry standard).
 */
export const TransactionSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  type: z.enum(['income', 'expense', 'saving', 'transfer']),
  amount: z.number().finite(),
  currency: z.string().min(1),
  date: z.string().min(1), // ISO 8601
  category: z.string().min(1),
  subcategory: z.string().min(1),
  description: z.string().optional(),
  recurring: z.boolean().optional(),
  recurrence: z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']).optional(),
  status: z.enum(['cleared', 'pending', 'scheduled']).optional(),
  accountId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TransactionValidated = z.infer<typeof TransactionSchema>;
