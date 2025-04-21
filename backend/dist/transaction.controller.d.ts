import { TransactionService } from './transaction.service';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    getAll(): TransactionValidated[];
    getOne(id: string): any;
    create(body: any): TransactionValidated;
    update(id: string, body: any): TransactionValidated;
    delete(id: string): TransactionValidated;
}
