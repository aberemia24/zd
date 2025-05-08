// Schemă și tipuri partajate pentru tranzacții
import { z } from 'zod';
import { TransactionType, FrequencyType, TransactionStatus } from './enums';

// Diferențe față de structura SQL:
// - currency NU este folosit în FE (intenționat, vezi discuție cu owner)
// - description există doar în FE (nu și în SQL, dar poate fi adăugat la nevoie)
// - user_id nu e expus în FE (doar pe backend)
// - created_at/updated_at sunt opționale, folosite doar pentru UI/audit

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number(),
  type: z.nativeEnum(TransactionType), // Enum strict pentru tip tranzacție
  date: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  recurring: z.boolean().optional(),
  frequency: z.nativeEnum(FrequencyType).optional(), // Enum strict pentru frecvență
  // --- câmpuri pentru workflow planificat/actual ---
  actualAmount: z.number().optional(), // Suma efectivă cheltuită (dacă diferă de estimat)
  status: z.nativeEnum(TransactionStatus).optional(), // 'PLANNED' sau 'COMPLETED'
  // --- meta ---
  created_at: z.string().optional(), // ISO date
  updated_at: z.string().optional(), // ISO date
});

// Schema pentru CREATE (fără id, created_at, updated_at)
export const CreateTransactionSchema = TransactionSchema.omit({ id: true, created_at: true, updated_at: true });

export type TransactionValidated = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
