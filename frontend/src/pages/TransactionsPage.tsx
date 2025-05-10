import React from 'react';
import TransactionForm from '../components/features/TransactionForm/TransactionForm';
import TransactionTable from '../components/features/TransactionTable/TransactionTable';
import TransactionFilters from '../components/features/TransactionFilters/TransactionFilters';
import { useTransactionFiltersStore } from '../stores/transactionFiltersStore';
import { useTransactionStore } from '../stores/transactionStore';
import type { TransactionState } from '../stores/transactionStore';
import { TITLES, TransactionType, CategoryType } from '@shared-constants';

/**
 * Pagină dedicată pentru gestionarea tranzacțiilor
 * Conține formularul de adăugare, filtrele și tabelul de tranzacții
 */
const TransactionsPage: React.FC = () => {
  // Folosim store-ul Zustand pentru filtre și paginare și date
  const currentQueryParams = useTransactionStore((state: TransactionState) => state.currentQueryParams);
  const setQueryParams = useTransactionStore((state: TransactionState) => state.setQueryParams);

  // Extragem valorile din query params pentru a le folosi în UI
  const limit: number = currentQueryParams.limit || 10;
  const offset: number = currentQueryParams.offset || 0;
  const currentPage: number = Math.floor(offset / limit) + 1;

  // Folosim store-ul dedicat pentru filtre Zustand
  const filterType = useTransactionFiltersStore(s => s.filterType) || '';
  const filterCategory = useTransactionFiltersStore(s => s.filterCategory) || '';
  const setFilterType = useTransactionFiltersStore(s => s.setFilterType);
  const setFilterCategory = useTransactionFiltersStore(s => s.setFilterCategory);
  
  // Funcții pentru navigare
  const goToPage = React.useCallback((page: number) => {
    setQueryParams({
      ...currentQueryParams,
      offset: (page - 1) * limit
    });
  }, [currentQueryParams, limit, setQueryParams]);
  
  // Referimță pentru a ține minte ultimele filtre aplicate și a preveni fetchTransactions inutil
  const lastFiltersRef = React.useRef({ type: '', category: '', offset: 0, limit: 10 });
  
  // Sincronizare filtre + paginare cu store-ul de tranzacții
  // IMPORTANT: Prevenim anti-pattern-ul cu useEffect + queryParams menționat în memoria critică d7b6eb4b-0702-4b0a-b074-3915547a2544
  React.useEffect(() => {
    const hasFilterChanged = 
      lastFiltersRef.current.type !== filterType ||
      lastFiltersRef.current.category !== filterCategory ||
      lastFiltersRef.current.offset !== offset ||
      lastFiltersRef.current.limit !== limit;
    
    // Actualizăm parametrii doar dacă s-au schimbat pentru a preveni bucla infinită
    if (hasFilterChanged) {
      console.log(`Filters changed, fetching transactions with: type=${filterType}, category=${filterCategory}, offset=${offset}, limit=${limit}`);
      
      // Actualizăm referimța cu noile valori
      lastFiltersRef.current = { type: filterType, category: filterCategory, offset, limit };
      
      // 1. Mai întâi setăm parametrii
      const store = useTransactionStore.getState();
      store.setQueryParams({
        ...store.currentQueryParams,
        type: filterType,
        category: filterCategory,
        offset,
        limit,
        // Resetăm parametrii de lună/an pentru a preveni conflicte cu pagina LunarGrid
        month: undefined,
        year: undefined,
        includeAdjacentDays: undefined
      });
      
      // 2. Apoi facem fetch explicit (evităm bucla infinită)
      store.fetchTransactions(true);
    }
  }, [filterType, filterCategory, offset, limit]);
  
  // Fetch inițial la montarea componentei, doar dacă nu există tranzacții în store
  React.useEffect(() => {
    const store = useTransactionStore.getState();
    // Notifcăm că suntem la pagina de tranzacții prin resetarea parametrilor specifici paginii de grid
    if (store.currentQueryParams.month || store.currentQueryParams.year) {
      console.log('Resetting LunarGrid specific params');
      store.setQueryParams({
        ...store.currentQueryParams,
        month: undefined,
        year: undefined,
        includeAdjacentDays: undefined
      });
      store.fetchTransactions(true);
    } else if (store.transactions.length === 0 && !store.loading) {
      console.log('Initial fetch for TransactionsPage - no transactions found');
      store.fetchTransactions();
    }
  }, []);

  // Preluăm doar eroarea pentru afișare
  const fetchError = useTransactionStore((s: TransactionState) => s.error);

  // Callback pentru schimbarea paginii
  const handlePageChange = React.useCallback((newOffset: number) => goToPage(Math.floor(newOffset / limit) + 1), [goToPage, limit]);

  return (
    <>
      <h1 className="text-2xl font-bold text-primary-700 mb-token" data-testid="transactions-title">{TITLES.TRANZACTII}</h1>

      <TransactionForm />

      <TransactionFilters
        type={filterType}
        category={filterCategory}
        onTypeChange={t => setFilterType(t as TransactionType | '')}
        onCategoryChange={c => setFilterCategory(c as CategoryType | '')}
      />

      <TransactionTable offset={offset} limit={limit} onPageChange={handlePageChange} />

      {fetchError && (
        <div className="mt-token p-token-sm bg-error-100 text-error-700 rounded-token" data-testid="fetch-error">
          {fetchError}
        </div>
      )}
    </>
  );
};

export default TransactionsPage;
