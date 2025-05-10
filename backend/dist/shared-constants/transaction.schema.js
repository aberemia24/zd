"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTransactionSchema = exports.TransactionSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("./enums");
exports.TransactionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    amount: zod_1.z.number(),
    type: zod_1.z.nativeEnum(enums_1.TransactionType),
    date: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    subcategory: zod_1.z.string().optional(),
    recurring: zod_1.z.boolean().optional(),
    frequency: zod_1.z.nativeEnum(enums_1.FrequencyType).optional(),
    actualAmount: zod_1.z.number().optional(),
    status: zod_1.z.nativeEnum(enums_1.TransactionStatus).optional(),
    created_at: zod_1.z.string().optional(),
    updated_at: zod_1.z.string().optional(),
});
exports.CreateTransactionSchema = exports.TransactionSchema.omit({ id: true, created_at: true, updated_at: true });
//# sourceMappingURL=transaction.schema.js.map