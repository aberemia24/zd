import React from 'react';

export type Transaction = {
  _id?: string;
  id?: string;
  userId?: string;
  type: string;
  amount: string | number;
  currency: string;
  category: string;
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
            <th>Tip</th>
            <th>Sumă</th>
            <th>Monedă</th>
            <th>Categorie</th>
            <th>Subcategorie</th>
            <th>Dată</th>
            <th>Recurent</th>
            <th>Frecvență</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={8}>Se încarcă...</td></tr>
          ) : (transactions.length === 0 ? (
            <tr><td colSpan={8}>Nicio tranzacție</td></tr>
          ) : (
            transactions.map((t, idx) => (
              <tr key={t._id || idx}>
                <td>{t.type || ''}</td>
                <td>{t.amount !== undefined && t.amount !== null ? String(t.amount) : ''}</td>
                <td>{t.currency || ''}</td>
                <td>{t.category || ''}</td>
                <td>{t.subcategory || ''}</td>
                <td>{t.date || ''}</td>
                <td>{t.recurring === true ? 'Da' : 'Nu'}</td>
                <td>{t.recurring === true && t.frequency ? t.frequency : ''}</td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => onPageChange(Math.max(0, offset - limit))} disabled={offset === 0}>Înapoi</button>
        <span>Pagina {Math.floor(offset / limit) + 1} din {Math.ceil(total / limit) || 1}</span>
        <button onClick={() => onPageChange(offset + limit)} disabled={offset + limit >= total || offset >= total}>Înainte</button>
      </div>
    </div>
  );
};

export default TransactionTable;
