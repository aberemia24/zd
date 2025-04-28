"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSchema = void 0;
const zod_1 = require("zod");
exports.TransactionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    amount: zod_1.z.number(),
    type: zod_1.z.string(),
    date: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
});
//# sourceMappingURL=transaction.schema.js.map