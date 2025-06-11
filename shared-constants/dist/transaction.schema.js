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
    type: z.nativeEnum(TransactionType),
    date: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    recurring: z.boolean().optional(),
    frequency: z.nativeEnum(FrequencyType).optional(),
    // --- câmpuri pentru workflow planificat/actual ---
    actualAmount: z.number().optional(),
    status: z.nativeEnum(TransactionStatus).optional(),
    // --- meta ---
    created_at: z.string().optional(),
    updated_at: z.string().optional(), // ISO date
});
// Schema pentru CREATE (fără id, created_at, updated_at)
export const CreateTransactionSchema = TransactionSchema.omit({ id: true, created_at: true, updated_at: true });
