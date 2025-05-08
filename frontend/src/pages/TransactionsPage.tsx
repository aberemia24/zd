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
  
  // Sincronizare filtre + paginare cu store-ul de tranzacții
  React.useEffect(() => {
    setQueryParams({
      ...currentQueryParams,
      type: filterType,
      category: filterCategory,
      offset,
      limit
    });
    useTransactionStore.getState().fetchTransactions();
  }, [filterType, filterCategory, offset, limit]);

  // Preluăm doar eroarea pentru afișare
  const fetchError = useTransactionStore((s: TransactionState) => s.error);

  // Callback pentru schimbarea paginii
  const handlePageChange = React.useCallback((newOffset: number) => goToPage(Math.floor(newOffset / limit) + 1), [goToPage, limit]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6" data-testid="transactions-title">{TITLES.TRANZACTII}</h1>

      <TransactionForm />

      <TransactionFilters
        type={filterType}
        category={filterCategory}
        onTypeChange={t => setFilterType(t as TransactionType | '')}
        onCategoryChange={c => setFilterCategory(c as CategoryType | '')}
      />

      <TransactionTable offset={offset} limit={limit} onPageChange={handlePageChange} />

      {fetchError && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded" data-testid="fetch-error">
          {fetchError}
        </div>
      )}
    </>
  );
};

export default TransactionsPage;
