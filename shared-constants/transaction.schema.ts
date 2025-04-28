// Schemă și tipuri partajate pentru tranzacții
import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number(),
  type: z.string(), // Poți particulariza cu enum dacă vrei
  date: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
});

export type TransactionValidated = z.infer<typeof TransactionSchema>;
