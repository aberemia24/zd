import { TransactionValidated } from '@shared-constants/transaction.schema';
export declare class TransactionService {
    private transactions;
    getAll(params?: {
        type?: string;
        category?: string;
        dateFrom?: string;
        dateTo?: string;
        limit?: string;
        offset?: string;
        sort?: string;
    }): {
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
    } | undefined;
    create(transaction: TransactionValidated): {
        id: string;
        amount: number;
        type: string;
        date: string;
        description?: string | undefined;
        category?: string | undefined;
    };
    update(id: string, transaction: TransactionValidated): {
        id: string;
        amount: number;
        type: string;
        date: string;
        description?: string | undefined;
        category?: string | undefined;
    } | undefined;
    delete(id: string): {
        id: string;
        amount: number;
        type: string;
        date: string;
        description?: string | undefined;
        category?: string | undefined;
    } | undefined;
}
