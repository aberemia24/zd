import { TransactionService } from './transaction.service';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    getAll(type?: string, category?: string, dateFrom?: string, dateTo?: string, limit?: string, offset?: string, sort?: string): {
        data: {
            id: string;
            amount: number;
            type: string;
            date: string;
            description?: string | undefined;
            category?: string | undefined;
        }[];
        total: number;
        limit: number;
        offset: number;
    };
    getOne(id: string): {
        id: string;
        amount: number;
        type: string;
        date: string;
        description?: string | undefined;
        category?: string | undefined;
    };
    create(body: any): Promise<{
        id: string;
        amount: number;
        type: string;
        date: string;
        description?: string | undefined;
        category?: string | undefined;
    }>;
    update(id: string, body: any): Promise<{
        id: string;
        amount: number;
        type: string;
        date: string;
        description?: string | undefined;
        category?: string | undefined;
    }>;
    delete(id: string): Promise<void>;
}
