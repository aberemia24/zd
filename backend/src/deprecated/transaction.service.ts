import { Injectable } from '@nestjs/common';
import { TransactionValidated, CreateTransaction } from '@shared-constants/transaction.schema';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class TransactionService {
  private transactions: TransactionValidated[] = [];

  getAll(params?: {
    type?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: string;
    offset?: string;
    sort?: string;
  }) {
    let result = [...this.transactions];
    if (params) {
      const { type, category, dateFrom, dateTo, limit, offset, sort } = params;
      if (type) {
        result = result.filter(t => t.type === type);
      }
      if (category) {
        result = result.filter(t => t.category === category);
      }
      if (dateFrom) {
        result = result.filter(t => t.date >= dateFrom);
      }
      if (dateTo) {
        result = result.filter(t => t.date <= dateTo);
      }
      if (sort) {
        const allowedFields = ['amount', 'date', 'id', 'category', 'type'];
        const field = sort.replace(/^-/, '');
        const desc = sort.startsWith('-');
        if (allowedFields.includes(field)) {
          result = result.sort((a, b) => {
            const aValue = a[field as keyof typeof a];
            const bValue = b[field as keyof typeof b];
            if (aValue === undefined && bValue === undefined) return 0;
            if (aValue === undefined) return desc ? 1 : -1;
            if (bValue === undefined) return desc ? -1 : 1;
            if (aValue < bValue) return desc ? 1 : -1;
            if (aValue > bValue) return desc ? -1 : 1;
            return 0;
          });
        }
      }
      const total = result.length;
      const lim = limit ? parseInt(limit, 10) : 20;
      const off = offset ? parseInt(offset, 10) : 0;
      const data = result.slice(off, off + lim);
      return {
        data,
        total,
        limit: lim,
        offset: off,
      };
    }
    return {
      data: result,
      total: result.length,
      limit: result.length,
      offset: 0,
    };
  }

  getOne(id: string) {
    return this.transactions.find(t => t.id === id);
  }

  create(transaction: CreateTransaction): TransactionValidated {
    const newTransaction: TransactionValidated = {
      ...transaction,
      id: uuidv4(),
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  update(id: string, transaction: TransactionValidated) {
    const idx = this.transactions.findIndex(t => t.id === id);
    if (idx === -1) return undefined;
    this.transactions[idx] = transaction;
    return transaction;
  }

  delete(id: string) {
    const idx = this.transactions.findIndex(t => t.id === id);
    if (idx === -1) return undefined;
    const [removed] = this.transactions.splice(idx, 1);
    return removed;
  }
}
