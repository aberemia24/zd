"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema Zod pentru validarea tranzacțiilor la runtime.
 * Inspirată din modelul Transaction (industry standard).
 */
exports.TransactionSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    userId: zod_1.z.string().min(1),
    type: zod_1.z.enum(['income', 'expense', 'saving', 'transfer']),
    amount: zod_1.z.number().finite(),
    currency: zod_1.z.string().min(1),
    date: zod_1.z.string().min(1), // ISO 8601
    category: zod_1.z.string().min(1),
    subcategory: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    recurring: zod_1.z.boolean().optional(),
    recurrence: zod_1.z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']).optional(),
    status: zod_1.z.enum(['cleared', 'pending', 'scheduled']).optional(),
    accountId: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional(),
});
