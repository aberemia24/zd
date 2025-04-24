import React from 'react';
import { TransactionType, CategoryType, FrequencyType } from '../../constants/enums';
import { TABLE, BUTTONS } from '../../constants/ui';

export type Transaction = {
  _id?: string;
  id?: string;
  userId?: string;
  type: TransactionType | string;
  amount: string | number;
  currency: string;
  category: CategoryType | string;
  subcategory: string;
  date: string;
  recurring?: boolean;
  frequency?: string;
};

export type TransactionTableProps = {
  transactions: Transaction[];
  loading: boolean;
  total: number;
  offset: number;
  limit: number;
  onPageChange: (newOffset: number) => void;
};

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, loading, total, offset, limit, onPageChange }) => {
  return (
    <div style={{ marginTop: 24 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>{TABLE.HEADERS.TYPE}</th>
            <th>{TABLE.HEADERS.AMOUNT}</th>
            <th>{TABLE.HEADERS.CURRENCY}</th>
            <th>{TABLE.HEADERS.CATEGORY}</th>
            <th>{TABLE.HEADERS.SUBCATEGORY}</th>
            <th>{TABLE.HEADERS.DATE}</th>
            <th>{TABLE.HEADERS.RECURRING}</th>
            <th>{TABLE.HEADERS.FREQUENCY}</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={8}>{TABLE.LOADING}</td></tr>
          ) : (transactions.length === 0 ? (
            <tr><td colSpan={8}>{TABLE.EMPTY}</td></tr>
          ) : (
            transactions.map((t, idx) => (
              <tr key={t._id || idx}>
                <td>{t.type || ''}</td>
                <td>{t.amount !== undefined && t.amount !== null ? String(t.amount) : ''}</td>
                <td>{t.currency || ''}</td>
                <td>{t.category || ''}</td>
                <td>{t.subcategory || ''}</td>
                <td>{t.date || ''}</td>
                <td>{t.recurring === true ? TABLE.BOOL.YES : TABLE.BOOL.NO}</td>
                <td>{t.recurring === true && t.frequency ? t.frequency : ''}</td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => onPageChange(Math.max(0, offset - limit))} disabled={offset === 0}>{BUTTONS.PREV_PAGE}</button>
        <span>{TABLE.PAGE_INFO.replace('{current}', String(Math.floor(offset / limit) + 1)).replace('{total}', String(Math.ceil(total / limit) || 1))}</span>
        <button onClick={() => onPageChange(offset + limit)} disabled={offset + limit >= total || offset >= total}>{BUTTONS.NEXT_PAGE}</button>
      </div>
    </div>
  );
};

export default TransactionTable;
