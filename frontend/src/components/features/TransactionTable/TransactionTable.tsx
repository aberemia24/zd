import React, { useMemo, useCallback } from 'react';
import Button from '../../primitives/Button/Button';
import Badge from '../../primitives/Badge/Badge';
import Spinner from '../../primitives/Spinner/Spinner';
import { TransactionType, CategoryType, FrequencyType } from '../../../shared-constants/enums';
import { TABLE, BUTTONS, INFO } from '@shared-constants';
import type { Transaction } from '../../../types/Transaction';
import { cn } from '../../../styles/cva/shared/utils';
import { 
  dataTable, 
  tableHeader, 
  tableCell, 
  flex as flexContainer,
  container as pageContainer
} from '../../../styles/cva';
import type { TransactionValidated } from '@shared-constants/transaction.schema';

export type { Transaction };

export type TransactionTableProps = {
  /** Lista de tranzacții încărcate din toate paginile */
  transactions: (TransactionValidated & { userId?: string })[];
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
  /** Flag care indică dacă filtrele sunt active, pentru a afișa mesaj specific când nu există tranzacții */
  isFiltered?: boolean;
  /** Flag care indică dacă se face fetching de date noi, dar avem date vechi (pentru overlay UX) */
  isFetching?: boolean;
};

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  total, 
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  fetchNextPage,
  isFiltered = false,
  isFetching = false,
  ...rest
}) => {
  // Referință către container pentru implementarea intersection observer
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Memoizăm funcția de formatare pentru a evita recalculările inutile
  const getAmountStyles = useCallback((amount: number | string | undefined, type?: string): React.CSSProperties => {
    if (amount === undefined || amount === null) return {};
    
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Fără număr valid, returnăm stil normal
    if (isNaN(numericAmount)) return {};
    
    // Dacă e EXPENSE (cheltuială), roșu, dacă e INCOME (venit), verde
    if (type === TransactionType.EXPENSE) {
      return { color: '#dc2626' }; // red-600
    } else if (type === TransactionType.INCOME) {
      return { color: '#16a34a' }; // green-600
    }
    
    return {};
  }, []);
  
  // Memoizăm formatorul pentru valori monetare
  const formatAmount = useCallback((amount: number | string | undefined): string => {
    if (amount === undefined || amount === null) return '';
    
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numericAmount)) return String(amount);
    
    // Adaugă simbolul RON și formatare cu 2 zecimale
    return numericAmount.toFixed(2) + ' RON';
  }, []);

  // Memoizăm formatorul pentru date
  const formatDate = useCallback((date: string | Date | undefined): string => {
    if (!date) return '';
    
    if (typeof date === 'object' && date instanceof Date) {
      // Formatăm obiectul Date ca string
      return date.toLocaleDateString('ro-RO');
    }
    
    // Încercăm să creăm un obiect Date din string
    try {
      const dateObj = new Date(date as string);
      return dateObj.toLocaleDateString('ro-RO');
    } catch (e) {
      // Dacă nu putem formata, returnăm string-ul original
      return String(date);
    }
  }, []);

  // Memoizăm mesajul pentru cazul când nu există tranzacții
  const emptyMessage = useMemo(() => {
    if (isFiltered) {
      // Dacă filtrele sunt active, afișăm mesajul pentru "nu există tranzacții pentru filtrele selectate"
      return TABLE.NO_TRANSACTIONS || INFO.NO_TRANSACTIONS;
    }
    // Altfel, afișăm mesajul standard pentru tabel gol
    return TABLE.EMPTY;
  }, [isFiltered]);

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

    // Opțiuni pentru Intersection Observer
    const options = {
      root: null, // viewport
      rootMargin: '100px', // mărește aria de detectare pentru o experiență mai fluidă
      threshold: 0.1 // 10% vizibil
    };

    // Creăm un nou observer care va detecta când elementul e vizibil
    const observer = new IntersectionObserver(handleObserver, options);

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

  // Memoizăm rândul de loading pentru reutilizare
  const loadingRow = useMemo(() => (
    <tr data-testid="transaction-table-loading">
      <td colSpan={8} className={cn(tableCell({ variant: 'default' }))} aria-live="polite">
        <div className={cn(flexContainer({ direction: 'row', justify: 'center', align: 'center', gap: 'sm' }))}>
          <Spinner size="sm" />
          <span>{TABLE.LOADING}</span>
        </div>
      </td>
    </tr>
  ), []);

  // Memoizăm rândul de loading pentru paginarea infinită
  const loadingMoreRow = useMemo(() => (
    <tr data-testid="transaction-table-loading-more">
      <td colSpan={8} className={cn(tableCell({ variant: 'default' }))} aria-live="polite">
        <div className={cn(flexContainer({ direction: 'row', justify: 'center', align: 'center', gap: 'sm' }))}>
          <Spinner size="sm" />
          <span>{TABLE.LOADING_MORE}</span>
        </div>
      </td>
    </tr>
  ), []);

  // Memoizăm rândul gol pentru reutilizare
  const emptyRow = useMemo(() => (
    <tr data-testid="transaction-table-empty">
      <td colSpan={8} className={cn(tableCell({ variant: 'default' }))} aria-live="polite">
        <div className={cn(flexContainer({ direction: 'col', justify: 'center', align: 'center', gap: 'md' }), 'p-4')}>
          <span className="text-gray-600 text-lg">
            {emptyMessage}
          </span>
          {isFiltered && (
            <Badge variant="secondary" size="sm">
              Încercați să ajustați filtrele
            </Badge>
          )}
        </div>
      </td>
    </tr>
  ), [emptyMessage, isFiltered]);

  return (
    <div className="space-y-4 relative">
      {/* Container pentru tabelul responsiv cu stiluri rafinate */}
      <div 
        className="relative overflow-x-auto"
        role="region" 
        aria-label={TABLE.HEADERS.TYPE + " " + TABLE.HEADERS.AMOUNT}
      >
        {/* Overlay de loading peste tabel când se face fetch, dar avem date vechi */}
        {isFetching && !isLoading && (
          <div
            className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10"
            data-testid="transaction-table-loading-overlay"
            aria-live="polite"
            aria-label={TABLE.LOADING}
            style={{ pointerEvents: 'none' }}
          >
            <Spinner size="md" />
          </div>
        )}
                        <table           className={cn(dataTable({ variant: 'striped' }))}          data-testid="transaction-table"        >          <thead>            <tr className="bg-gray-50">              <th className={cn(tableHeader())} scope="col">{TABLE.HEADERS.TYPE}</th>              <th className={cn(tableHeader())} scope="col">{TABLE.HEADERS.AMOUNT}</th>              <th className={cn(tableHeader())} scope="col">{TABLE.HEADERS.CATEGORY}</th>              <th className={cn(tableHeader())} scope="col">{TABLE.HEADERS.SUBCATEGORY}</th>              <th className={cn(tableHeader())} scope="col">{TABLE.HEADERS.DESCRIPTION}</th>              <th className={cn(tableHeader())} scope="col">{TABLE.HEADERS.DATE}</th>              <th className={cn(tableHeader())} scope="col">{TABLE.HEADERS.RECURRING}</th>              <th className={cn(tableHeader())} scope="col">{TABLE.HEADERS.FREQUENCY}</th>            </tr>          </thead>
          <tbody>
            {isLoading ? (
              loadingRow
            ) : (!isFetching && transactions && transactions.length === 0 ? (
              emptyRow
            ) : (
              transactions.map((t, idx) => (
                <tr 
                  key={`${t.id}-${idx}`} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                  data-testid={`transaction-item-${t.id || idx}`}
                >
                  <td className={cn(tableCell({ variant: 'default' }))}>
                    <Badge 
                      variant={t.type === TransactionType.EXPENSE ? 'error' : t.type === TransactionType.INCOME ? 'success' : 'secondary'}
                      size="sm"
                    >
                      {t.type || ''}
                    </Badge>
                  </td>
                  <td 
                    className={cn(tableCell({ variant: 'numeric' }))} 
                    style={getAmountStyles(t.amount, t.type)}
                  >
                    <span className="font-medium">{formatAmount(t.amount)}</span>
                  </td>
                  <td className={cn(tableCell({ variant: 'default' }))}>{t.category || ''}</td>
                  <td className={cn(tableCell({ variant: 'default' }))}>{t.subcategory || ''}</td>
                  <td className={cn(tableCell({ variant: 'default' }))}>{t.description || ''}</td>
                  <td className={cn(tableCell({ variant: 'default' }))}>{formatDate(t.date)}</td>
                  <td className={cn(tableCell({ variant: 'default' }))}>
                    {t.recurring === true ? 
                      <Badge variant="primary" size="sm">{TABLE.BOOL.YES}</Badge> : 
                      <Badge variant="secondary" size="sm">{TABLE.BOOL.NO}</Badge>
                    }
                  </td>
                  <td className={cn(tableCell({ variant: 'default' }))}>
                    {t.recurring === true && t.frequency ? 
                      <Badge variant="primary" size="sm">{t.frequency}</Badge> : ''
                    }
                  </td>
                </tr>
              ))
            ))}
            {/* Fără date, dar în curs de încărcare - arăta indicator de loading pentru următoarea pagină */}
            {isFetchingNextPage && loadingMoreRow}
          </tbody>
        </table>
      </div>
      
      {/* Informații despre numărul total de tranzacții */}
      {!isLoading && transactions && transactions.length > 0 && (
        <div 
          className={cn(flexContainer({ direction: 'row', justify: 'between', align: 'center' }), 'mt-4')}
          aria-live="polite"
        >
          <span className="text-gray-600 text-sm">
            {TABLE.SHOWING_INFO.replace('{shown}', String(transactions.length)).replace('{total}', String(total))}
          </span>
          {hasNextPage && (
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => fetchNextPage?.()}
              disabled={isFetchingNextPage}
              dataTestId="load-more-btn"
              aria-label={isFetchingNextPage ? TABLE.LOADING_MORE : BUTTONS.NEXT_PAGE}
            >
              {isFetchingNextPage ? TABLE.LOADING_MORE : BUTTONS.NEXT_PAGE}
            </Button>
          )}
        </div>
      )}
      
      {/* Element invizibil pentru intersection observer */}
      <div ref={bottomRef} style={{ height: '20px', margin: '10px 0' }} aria-hidden="true" />
    </div>
  );
};

export default React.memo(TransactionTable);
