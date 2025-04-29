import { z } from 'zod';
export declare const TransactionSchema: z.ZodObject<{
    id: z.ZodString;
    amount: z.ZodNumber;
    type: z.ZodString;
    date: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: string;
    id: string;
    amount: number;
    type: string;
    description?: string | undefined;
    category?: string | undefined;
}, {
    date: string;
    id: string;
    amount: number;
    type: string;
    description?: string | undefined;
    category?: string | undefined;
}>;
export type TransactionValidated = z.infer<typeof TransactionSchema>;
