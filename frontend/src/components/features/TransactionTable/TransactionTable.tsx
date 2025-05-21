import React from 'react';
import Button from '../../primitives/Button';
import Badge from '../../primitives/Badge/Badge';
import Spinner from '../../primitives/Spinner';
import { TransactionType, CategoryType, FrequencyType } from '../../../shared-constants/enums';
import { TABLE, BUTTONS } from '@shared-constants';
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

  return (
    <div className={getEnhancedComponentClasses('spacing', 'section')}>
      {/* Container pentru tabelul responsiv cu stiluri rafinate */}
      <div className={getEnhancedComponentClasses('table-container', undefined, undefined, undefined, tableEffects)}>
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
            ) : (!transactions || transactions.length === 0 ? (
              <tr data-testid="transaction-table-empty">
                <td colSpan={7} className={getEnhancedComponentClasses('table-cell', undefined, undefined, undefined, ['text-center'])}>
                  {TABLE.EMPTY}
                </td>
              </tr>
            ) : (
              transactions.map((t, idx) => (
                <tr 
                  key={t.id || idx} 
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
            {/* Afișăm loading indicator pentru paginile următoare */}
            {isFetchingNextPage && (
              <tr data-testid="transaction-table-next-page-loading">
                <td colSpan={7} className={getEnhancedComponentClasses('table-cell', undefined, undefined, undefined, ['text-center'])}>
                  <div className={classNames(
                    getEnhancedComponentClasses('flex-group', 'center', 'md'),
                    getEnhancedComponentClasses('spacing', 'small')
                  )}>
                    <Spinner variant="primary" sizeVariant="xs" withPulse />
                    <span>{TABLE.LOADING_MORE}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Status și informații cu stiluri rafinate */}
      <div className={classNames(
        getEnhancedComponentClasses('flex-group', 'between', 'md'),
        getEnhancedComponentClasses('spacing', 'section')
      )}>
        {/* Informații despre numărul de tranzacții afișate */}
        <div>
          {!isLoading && transactions && transactions.length > 0 && (
            <Badge 
              variant="info" 
              withGradient
              data-testid="transaction-table-info"
            >
              {TABLE.SHOWING_INFO
                .replace('{shown}', String(transactions.length))
                .replace('{total}', String(total))}
            </Badge>
          )}
        </div>
        
        {/* Buton pentru încărcarea manuală a mai multor tranzacții */}
        {hasNextPage && !isFetchingNextPage && (
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => fetchNextPage?.()} 
            disabled={isFetchingNextPage || !hasNextPage}
            withShadow
            withTranslate
          >
            {BUTTONS.NEXT_PAGE}
          </Button>
        )}
      </div>

      {/* Element invizibil pentru intersection observer */}
      <div ref={bottomRef} className={getEnhancedComponentClasses('spacing', 'small')} data-testid="transaction-table-bottom-sentinel" />
    </div>
  );
};

export default TransactionTable;
