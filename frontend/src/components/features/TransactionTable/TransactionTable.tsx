import React from 'react';
import Button from '../../primitives/Button';
import { TransactionType, CategoryType, FrequencyType } from '../../../shared-constants/enums';
import { TABLE, BUTTONS } from '@shared-constants';
import type { Transaction } from '../../../types/Transaction';

export type { Transaction };

export type TransactionTableProps = {
  /** Lista de tranzacții încărcate */
  transactions: Transaction[];
  /** Numărul total de tranzacții (pentru paginare) */
  total: number;
  /** Flag care indică dacă datele sunt în curs de încărcare */
  isLoading?: boolean;
  /** Offset-ul curent pentru paginare */
  offset: number;
  /** Numărul de elemente per pagină */
  limit: number;
  /** Callback pentru schimbarea paginii */
  onPageChange: (newOffset: number) => void;
};

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  total, 
  isLoading = false, 
  offset, 
  limit, 
  onPageChange 
}) => {
  // Acum toate datele vin direct ca props, nu mai avem nevoie de Zustand
  return (
    <div className="mt-token">
      <table className="w-full border-collapse rounded-token overflow-hidden shadow-token bg-secondary-50" data-testid="transaction-table">
        <thead>
          <tr className="bg-secondary-100 text-secondary-700">
            <th className="px-token-sm py-token-xs text-left font-semibold">{TABLE.HEADERS.TYPE}</th>
            <th className="px-token-sm py-token-xs text-left font-semibold">{TABLE.HEADERS.AMOUNT}</th>
            <th className="px-token-sm py-token-xs text-left font-semibold">{TABLE.HEADERS.CATEGORY}</th>
            <th className="px-token-sm py-token-xs text-left font-semibold">{TABLE.HEADERS.SUBCATEGORY}</th>
            <th className="px-token-sm py-token-xs text-left font-semibold">{TABLE.HEADERS.DATE}</th>
            <th className="px-token-sm py-token-xs text-left font-semibold">{TABLE.HEADERS.RECURRING}</th>
            <th className="px-token-sm py-token-xs text-left font-semibold">{TABLE.HEADERS.FREQUENCY}</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr data-testid="transaction-table-loading"><td colSpan={7} className="text-center py-token-lg text-secondary-500">{TABLE.LOADING}</td></tr>
          ) : (!transactions || transactions.length === 0 ? (
            <tr data-testid="transaction-table-empty"><td colSpan={7} className="text-center py-token-lg text-secondary-400">{TABLE.EMPTY}</td></tr>
          ) : (
            transactions.map((t, idx) => (
              <tr key={t.id || idx} className="border-b border-secondary-200 last:border-b-0 hover:bg-secondary-100" data-testid={`transaction-item-${t.id || idx}`}>
                <td className="px-token-sm py-token-xs">{t.type || ''}</td>
                <td className="px-token-sm py-token-xs">{t.amount !== undefined && t.amount !== null ? String(t.amount) : ''}</td>
                <td className="px-token-sm py-token-xs">{t.category || ''}</td>
                <td className="px-token-sm py-token-xs">{t.subcategory || ''}</td>
                <td className="px-token-sm py-token-xs">{t.date || ''}</td>
                <td className="px-token-sm py-token-xs">{t.recurring === true ? TABLE.BOOL.YES : TABLE.BOOL.NO}</td>
                <td className="px-token-sm py-token-xs">{t.recurring === true && t.frequency ? t.frequency : ''}</td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
      <div className="mt-token flex gap-token items-center justify-center">
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
