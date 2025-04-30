// Schemă și tipuri partajate pentru tranzacții
import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number(),
  type: z.string(), // Poți particulariza cu enum dacă vrei
  date: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  recurring: z.boolean().optional(),
  frequency: z.string().optional(),
});

// Schema pentru CREATE (fără id)
export const CreateTransactionSchema = TransactionSchema.omit({ id: true });

export type TransactionValidated = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
