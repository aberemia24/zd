import React from 'react';
import Button from '../../primitives/Button';
import { TransactionType, CategoryType, FrequencyType } from '../../../shared-constants/enums';
import { TABLE, BUTTONS } from '@shared-constants';
import type { Transaction } from '../../../types/Transaction';

export type { Transaction };

export type TransactionTableProps = {
  /** Lista de tranzacții încărcate din toate paginile */
  transactions: Transaction[];
  /** Numărul total de tranzacții (pentru informații) */
  total: number;
  /** Flag care indică dacă datele inițiale sunt în curs de încărcare */
  isLoading?: boolean;
  /** Flag care indică dacă următoarea pagină este în curs de încărcare */
  isFetchingNextPage?: boolean;
  /** Flag care indică dacă mai există pagini disponibile pentru încărcare */
  hasNextPage?: boolean;
  /** Callback pentru încărcarea următoarei pagini */
  fetchNextPage?: () => void;
};

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  total, 
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  fetchNextPage
}) => {
  // Referință către container pentru implementarea intersection observer
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Implementăm Intersection Observer pentru detecția scroll-ului
  React.useEffect(() => {
    // Evităm crearea observer-ului dacă nu avem fetchNextPage
    if (!fetchNextPage) return;
    
    // Funcția callback pentru intersection observer
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      // Dacă elementul nostru este vizibil și avem pagini disponibile, și nu suntem deja în loading
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    // Creăm un nou observer care va detecta când elementul e vizibil
    const observer = new IntersectionObserver(handleObserver, {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1 // 10% vizibil
    });

    // Începem să observăm elementul nostru
    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    // Cleanup la unmount
    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  
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
          {/* Afișăm loading indicator pentru paginile următoare */}
          {isFetchingNextPage && (
            <tr data-testid="transaction-table-next-page-loading">
              <td colSpan={7} className="text-center py-token text-secondary-500">
                {TABLE.LOADING_MORE}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Status și informații */}
      <div className="mt-token flex justify-center text-sm text-secondary-600">
        {!isLoading && transactions && transactions.length > 0 && (
          <span data-testid="transaction-table-info">
            {TABLE.SHOWING_INFO
              .replace('{shown}', String(transactions.length))
              .replace('{total}', String(total))}
          </span>
        )}
      </div>

      {/* Element invizibil pentru intersection observer */}
      <div ref={bottomRef} className="h-token opacity-0" data-testid="transaction-table-bottom-sentinel" />
    </div>
  );
};

export default TransactionTable;
