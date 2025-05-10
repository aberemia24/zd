import React from 'react';
import Button from '../../primitives/Button';
import { TransactionType, CategoryType, FrequencyType } from '../../../shared-constants/enums';
import { TABLE, BUTTONS } from '@shared-constants';
import { useTransactionStore } from '../../../stores/transactionStore';
import type { TransactionState } from '../../../stores/transactionStore';
import type { Transaction } from '../../../types/transaction';

export type { Transaction };

export type TransactionTableProps = {
  offset: number;
  limit: number;
  onPageChange: (newOffset: number) => void;
};

const TransactionTable: React.FC<TransactionTableProps> = ({ offset, limit, onPageChange }) => {
  console.log('🔃 TransactionTable render');
  // Debug infinite loop: log renders
  const transactions = useTransactionStore((s: TransactionState) => s.transactions);
  const loading = useTransactionStore((s: TransactionState) => s.loading);
  const total = useTransactionStore((s: TransactionState) => s.total);
  return (
    <div className="mt-6">
      <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm bg-white" data-testid="transaction-table">
        <thead>
          <tr className="bg-secondary-50 text-secondary-700">
            <th className="px-3 py-2 text-left font-semibold">{TABLE.HEADERS.TYPE}</th>
            <th className="px-3 py-2 text-left font-semibold">{TABLE.HEADERS.AMOUNT}</th>
                        <th className="px-3 py-2 text-left font-semibold">{TABLE.HEADERS.CATEGORY}</th>
            <th className="px-3 py-2 text-left font-semibold">{TABLE.HEADERS.SUBCATEGORY}</th>
            <th className="px-3 py-2 text-left font-semibold">{TABLE.HEADERS.DATE}</th>
            <th className="px-3 py-2 text-left font-semibold">{TABLE.HEADERS.RECURRING}</th>
            <th className="px-3 py-2 text-left font-semibold">{TABLE.HEADERS.FREQUENCY}</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr data-testid="transaction-table-loading"><td colSpan={7} className="text-center py-6 text-secondary-500">{TABLE.LOADING}</td></tr>
          ) : (!transactions || transactions.length === 0 ? (
            <tr data-testid="transaction-table-empty"><td colSpan={7} className="text-center py-6 text-secondary-400">{TABLE.EMPTY}</td></tr>
          ) : (
            transactions.map((t, idx) => (
              <tr key={t.id || idx} className="border-b last:border-b-0 hover:bg-secondary-100" data-testid={`transaction-item-${t.id || idx}`}>
                <td className="px-3 py-2">{t.type || ''}</td>
                <td className="px-3 py-2">{t.amount !== undefined && t.amount !== null ? String(t.amount) : ''}</td>
                                <td className="px-3 py-2">{t.category || ''}</td>
                <td className="px-3 py-2">{t.subcategory || ''}</td>
                <td className="px-3 py-2">{t.date || ''}</td>
                <td className="px-3 py-2">{t.recurring === true ? TABLE.BOOL.YES : TABLE.BOOL.NO}</td>
                <td className="px-3 py-2">{t.recurring === true && t.frequency ? t.frequency : ''}</td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex gap-2 items-center justify-center">
        <Button
          variant="secondary"
          onClick={() => onPageChange(Math.max(0, offset - limit))}
          disabled={offset === 0}
        >
          {BUTTONS.PREV_PAGE}
        </Button>
        <span className="text-sm text-secondary-600">
          {TABLE.PAGE_INFO.replace('{current}', String(Math.floor(offset / limit) + 1)).replace('{total}', String(Math.ceil(total / limit) || 1))}
        </span>
        <Button
          variant="secondary"
          onClick={() => onPageChange(offset + limit)}
          disabled={offset + limit >= total || offset >= total}
        >
          {BUTTONS.NEXT_PAGE}
        </Button>
      </div>
    </div>
  );
};

export default TransactionTable;
