import React from 'react';
import Button from '../../primitives/Button';
import Badge from '../../primitives/Badge/Badge';
import Spinner from '../../primitives/Spinner';
import { TransactionType, CategoryType, FrequencyType } from '../../../shared-constants/enums';
import { TABLE, BUTTONS, INFO } from '@shared-constants';
import type { Transaction } from '../../../types/Transaction';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import classNames from 'classnames';

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
  // Debug: log la fiecare render
  // eslint-disable-next-line no-console
  console.log('[TransactionTable] Render', {
    key: (rest as any).key,
    transactionsCount: transactions?.length,
    total,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isFiltered,
    rest
  });
  // Referință către container pentru implementarea intersection observer
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Implementăm Intersection Observer pentru detecția scroll-ului
  React.useEffect(() => {
    console.log('[TransactionTable] Mounted');
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
      console.log('[TransactionTable] Unmounted');
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  
  // Generam efectele pentru componente
  const tableEffects = [
    'responsive',        // Tabel responsive pe dispozitive mobile
    'shadow-hover',      // Umbră la hover peste întregul tabel
    'rounded-corners',   // Colțuri rotunjite pentru aspect modern
    'fade-in'            // Apariție graduală la încărcare
  ];
  
  // Efecte pentru rânduri
  const rowEffects = [
    'hover-highlight',   // Evidențiere la hover
    'smooth-transition'  // Tranziție lină între stări
  ];
  
  // Efecte pentru antetul tabelului
  const headerEffects = [
    'sticky-header',     // Header fix la scroll
    'gradient-bg-subtle' // Gradient subtil pentru antet
  ];

  // Format pentru sumă cu semn și culoare pentru tipul tranzacției
  const getAmountStyles = (amount: number | string | undefined, type?: string): React.CSSProperties => {
    if (amount === undefined || amount === null) return {};
    
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Fără număr valid, returnăm stil normal
    if (isNaN(numericAmount)) return {};
    
    // Dacă e EXPENSE (cheltuială), roșu, dacă e INCOME (venit), verde
    if (type === TransactionType.EXPENSE) {
      return { color: 'var(--color-error-600)' };
    } else if (type === TransactionType.INCOME) {
      return { color: 'var(--color-success-600)' };
    }
    
    return {};
  };
  
  // Formatter pentru valori monetare
  const formatAmount = (amount: number | string | undefined): string => {
    if (amount === undefined || amount === null) return '';
    
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numericAmount)) return String(amount);
    
    // Adaugă simbolul RON și formatare cu 2 zecimale
    return numericAmount.toFixed(2) + ' RON';
  };

  // Determinăm mesajul pentru cazul când nu există tranzacții
  const getEmptyMessage = (): string => {
    if (isFiltered) {
      // Dacă filtrele sunt active, afișăm mesajul pentru "nu există tranzacții pentru filtrele selectate"
      return TABLE.NO_TRANSACTIONS || INFO.NO_TRANSACTIONS;
    }
    // Altfel, afișăm mesajul standard pentru tabel gol
    return TABLE.EMPTY;
  };

  return (
    <div className={getEnhancedComponentClasses('spacing', 'section')} style={{ position: 'relative' }}>
      {/* Container pentru tabelul responsiv cu stiluri rafinate */}
      <div className={getEnhancedComponentClasses('table-container', undefined, undefined, undefined, tableEffects)} style={{ position: 'relative' }}>
        {/* Overlay de loading peste tabel când se face fetch, dar avem date vechi */}
        {isFetching && !isLoading && (
          <div
            className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10"
            data-testid="transaction-table-loading-overlay"
            style={{ pointerEvents: 'none' }}
            aria-label={TABLE.LOADING}
          >
            <Spinner variant="primary" sizeVariant="md" withFadeIn />
          </div>
        )}
        <table 
          className={getEnhancedComponentClasses('table', 'striped')} 
          data-testid="transaction-table"
        >
          <thead>
            <tr className={getEnhancedComponentClasses('table-row', undefined, undefined, undefined, headerEffects)}>
              <th className={getEnhancedComponentClasses('table-header')}>{TABLE.HEADERS.TYPE}</th>
              <th className={getEnhancedComponentClasses('table-header')}>{TABLE.HEADERS.AMOUNT}</th>
              <th className={getEnhancedComponentClasses('table-header')}>{TABLE.HEADERS.CATEGORY}</th>
              <th className={getEnhancedComponentClasses('table-header')}>{TABLE.HEADERS.SUBCATEGORY}</th>
              <th className={getEnhancedComponentClasses('table-header')}>{TABLE.HEADERS.DATE}</th>
              <th className={getEnhancedComponentClasses('table-header')}>{TABLE.HEADERS.RECURRING}</th>
              <th className={getEnhancedComponentClasses('table-header')}>{TABLE.HEADERS.FREQUENCY}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr data-testid="transaction-table-loading">
                <td colSpan={7} className={getEnhancedComponentClasses('table-cell', undefined, undefined, undefined, ['text-center'])}>
                  <div className={classNames(
                    getEnhancedComponentClasses('flex-group', 'center', 'md'),
                    getEnhancedComponentClasses('spacing', 'small')
                  )}>
                    <Spinner variant="primary" sizeVariant="sm" withFadeIn />
                    <span>{TABLE.LOADING}</span>
                  </div>
                </td>
              </tr>
            ) : (!isFetching && transactions && transactions.length === 0 ? (
              <tr data-testid="transaction-table-empty">
                <td colSpan={7} className={getEnhancedComponentClasses('table-cell', undefined, undefined, undefined, ['text-center', 'py-8'])}>
                  <div className={getEnhancedComponentClasses('flex-group', 'center', 'md', undefined, ['flex-col', 'p-4'])}>
                    <span className={getEnhancedComponentClasses('text', 'secondary', 'lg')}>
                      {getEmptyMessage()}
                    </span>
                    {isFiltered && (
                      <Badge 
                        variant="secondary" 
                        className={getEnhancedComponentClasses('spacing', 'small', undefined, undefined, ['mt-2'])}
                        withShadow
                      >
                        Încercați să ajustați filtrele
                      </Badge>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((t, idx) => (
                <tr 
                  key={`${t.id}-${idx}`} 
                  className={getEnhancedComponentClasses('table-row', undefined, undefined, undefined, rowEffects)}
                  data-testid={`transaction-item-${t.id || idx}`}
                >
                  <td className={getEnhancedComponentClasses('table-cell')}>
                    <Badge 
                      variant={t.type === TransactionType.EXPENSE ? 'error' : t.type === TransactionType.INCOME ? 'success' : 'secondary'}
                      pill
                      withShadow
                    >
                      {t.type || ''}
                    </Badge>
                  </td>
                  <td 
                    className={getEnhancedComponentClasses('table-cell')} 
                    style={getAmountStyles(t.amount, t.type)}
                  >
                    <span className={getEnhancedComponentClasses('text', 'accent')}>{formatAmount(t.amount)}</span>
                  </td>
                  <td className={getEnhancedComponentClasses('table-cell')}>{t.category || ''}</td>
                  <td className={getEnhancedComponentClasses('table-cell')}>{t.subcategory || ''}</td>
                  <td className={getEnhancedComponentClasses('table-cell')}>{t.date || ''}</td>
                  <td className={getEnhancedComponentClasses('table-cell')}>
                    {t.recurring === true ? 
                      <Badge variant="primary" pill withPulse>{TABLE.BOOL.YES}</Badge> : 
                      <Badge variant="secondary" pill>{TABLE.BOOL.NO}</Badge>
                    }
                  </td>
                  <td className={getEnhancedComponentClasses('table-cell')}>
                    {t.recurring === true && t.frequency ? 
                      <Badge variant="info" pill>{t.frequency}</Badge> : ''
                    }
                  </td>
                </tr>
              ))
            ))}
            {/* Fără date, dar în curs de încărcare - arăta indicator de loading pentru următoarea pagină */}
            {isFetchingNextPage && (
              <tr data-testid="transaction-table-loading-more">
                <td colSpan={7} className={getEnhancedComponentClasses('table-cell', undefined, undefined, undefined, ['text-center'])}>
                  <div className={classNames(
                    getEnhancedComponentClasses('flex-group', 'center', 'md'),
                    getEnhancedComponentClasses('spacing', 'small')
                  )}>
                    <Spinner variant="primary" sizeVariant="sm" withFadeIn />
                    <span>{TABLE.LOADING_MORE}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Informații despre numărul total de tranzacții */}
      {!isLoading && transactions && transactions.length > 0 && (
        <div className={getEnhancedComponentClasses('flex-group', 'between', 'md', undefined, ['mt-4', 'text-sm', 'text-secondary-700'])}>
          <span>
            {TABLE.SHOWING_INFO.replace('{shown}', String(transactions.length)).replace('{total}', String(total))}
          </span>
          {hasNextPage && (
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => fetchNextPage?.()}
              disabled={isFetchingNextPage}
              withTranslate
              data-testid="load-more-btn"
            >
              {isFetchingNextPage ? TABLE.LOADING_MORE : BUTTONS.NEXT_PAGE}
            </Button>
          )}
        </div>
      )}
      
      {/* Element invizibil pentru intersection observer */}
      <div ref={bottomRef} style={{ height: '10px', margin: '10px 0' }} />
    </div>
  );
};

export default TransactionTable;
