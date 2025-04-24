import { z } from 'zod';
/**
 * Schema Zod pentru validarea tranzacțiilor la runtime.
 * Inspirată din modelul Transaction (industry standard).
 */
export declare const TransactionSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    type: z.ZodEnum<["income", "expense", "saving", "transfer"]>;
    amount: z.ZodNumber;
    currency: z.ZodString;
    date: z.ZodString;
    category: z.ZodString;
    subcategory: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    recurring: z.ZodOptional<z.ZodBoolean>;
    recurrence: z.ZodOptional<z.ZodEnum<["none", "daily", "weekly", "monthly", "yearly"]>>;
    status: z.ZodOptional<z.ZodEnum<["cleared", "pending", "scheduled"]>>;
    accountId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    currency: string;
    type: "income" | "expense" | "saving" | "transfer";
    id: string;
    date: string;
    userId: string;
    amount: number;
    category: string;
    subcategory: string;
    description?: string | undefined;
    status?: "pending" | "cleared" | "scheduled" | undefined;
    recurring?: boolean | undefined;
    recurrence?: "none" | "daily" | "weekly" | "monthly" | "yearly" | undefined;
    accountId?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}, {
    currency: string;
    type: "income" | "expense" | "saving" | "transfer";
    id: string;
    date: string;
    userId: string;
    amount: number;
    category: string;
    subcategory: string;
    description?: string | undefined;
    status?: "pending" | "cleared" | "scheduled" | undefined;
    recurring?: boolean | undefined;
    recurrence?: "none" | "daily" | "weekly" | "monthly" | "yearly" | undefined;
    accountId?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}>;
export type TransactionValidated = z.infer<typeof TransactionSchema>;
