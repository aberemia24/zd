import { TransactionService } from './transaction.service';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    getAll(type?: string, category?: string, dateFrom?: string, dateTo?: string, limit?: string, offset?: string, sort?: string): {
        data: {
            type: "income" | "expense" | "saving" | "transfer";
            date: string;
            id: string;
            userId: string;
            amount: number;
            currency: string;
            category: string;
            subcategory: string;
            status?: "cleared" | "pending" | "scheduled" | undefined;
            description?: string | undefined;
            recurring?: boolean | undefined;
            recurrence?: "none" | "daily" | "weekly" | "monthly" | "yearly" | undefined;
            accountId?: string | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
        }[];
        total: number;
        limit: number;
        offset: number;
    };
    getOne(id: string): {
        type: "income" | "expense" | "saving" | "transfer";
        date: string;
        id: string;
        userId: string;
        amount: number;
        currency: string;
        category: string;
        subcategory: string;
        status?: "cleared" | "pending" | "scheduled" | undefined;
        description?: string | undefined;
        recurring?: boolean | undefined;
        recurrence?: "none" | "daily" | "weekly" | "monthly" | "yearly" | undefined;
        accountId?: string | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    };
    create(body: any): Promise<{
        type: "income" | "expense" | "saving" | "transfer";
        date: string;
        id: string;
        userId: string;
        amount: number;
        currency: string;
        category: string;
        subcategory: string;
        status?: "cleared" | "pending" | "scheduled" | undefined;
        description?: string | undefined;
        recurring?: boolean | undefined;
        recurrence?: "none" | "daily" | "weekly" | "monthly" | "yearly" | undefined;
        accountId?: string | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }>;
    update(id: string, body: any): Promise<{
        type: "income" | "expense" | "saving" | "transfer";
        date: string;
        id: string;
        userId: string;
        amount: number;
        currency: string;
        category: string;
        subcategory: string;
        status?: "cleared" | "pending" | "scheduled" | undefined;
        description?: string | undefined;
        recurring?: boolean | undefined;
        recurrence?: "none" | "daily" | "weekly" | "monthly" | "yearly" | undefined;
        accountId?: string | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }>;
    delete(id: string): Promise<void>;
}
