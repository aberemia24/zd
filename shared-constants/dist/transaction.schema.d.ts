import { z } from 'zod';
export declare const TransactionSchema: any;
export declare const CreateTransactionSchema: any;
export type TransactionValidated = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
//# sourceMappingURL=transaction.schema.d.ts.map