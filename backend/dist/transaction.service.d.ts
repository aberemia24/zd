import { TransactionValidated } from '../../../shared/transaction.schema';
export declare class TransactionService {
    private transactions;
    getAll(): TransactionValidated[];
    getOne(id: string): any;
    create(transaction: TransactionValidated): TransactionValidated;
    update(id: string, transaction: TransactionValidated): TransactionValidated;
    delete(id: string): TransactionValidated;
}
