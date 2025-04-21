import { Injectable } from '@nestjs/common';
import { TransactionValidated } from '../../shared/transaction.schema';

@Injectable()
export class TransactionService {
  private transactions: TransactionValidated[] = [];

  getAll() {
    return this.transactions;
  }

  getOne(id: string) {
    return this.transactions.find(t => t.id === id);
  }

  create(transaction: TransactionValidated) {
    this.transactions.push(transaction);
    return transaction;
  }

  update(id: string, transaction: TransactionValidated) {
    const idx = this.transactions.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Transaction not found');
    this.transactions[idx] = transaction;
    return transaction;
  }

  delete(id: string) {
    const idx = this.transactions.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Transaction not found');
    const [removed] = this.transactions.splice(idx, 1);
    return removed;
  }
}
