// Componenta principală a aplicației - refactorizată cu Custom Hooks și Servicii
import React from 'react';
import TransactionForm from './components/features/TransactionForm/TransactionForm';
import TransactionTable from './components/features/TransactionTable/TransactionTable';
import TransactionFilters from './components/features/TransactionFilters/TransactionFilters';
import { useTransactionFiltersStore } from './stores/transactionFiltersStore';
import { TITLES, TransactionType, CategoryType } from '@shared-constants';

// Import store Zustand pentru tranzacții
import { useTransactionStore } from './stores/transactionStore';
import type { TransactionState } from './stores/transactionStore';

/**
 * Componenta principală a aplicației, refactorizată pentru a utiliza custom hooks și servicii
 * 
 * Structura:
 * 
 * Această structură separă clar logica de business de UI, crescând testabilitatea, 
 * mentenabilitatea și facilitând extinderea ulterioară.
 */
export const App: React.FC = () => {
  console.log('🛜 App render');

  // Folosim store-ul Zustand pentru filtre și paginare și date
  // transactionService și DI până acum inutile datorită noului flow

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
  const nextPage = React.useCallback(() => {
    setQueryParams({
      ...currentQueryParams,
      offset: offset + limit
    });
  }, [currentQueryParams, offset, limit, setQueryParams]);
  
  const prevPage = React.useCallback(() => {
    if (offset - limit >= 0) {
      setQueryParams({
        ...currentQueryParams,
        offset: offset - limit
      });
    }
  }, [currentQueryParams, offset, limit, setQueryParams]);
  
  const goToPage = React.useCallback((page: number) => {
    setQueryParams({
      ...currentQueryParams,
      offset: (page - 1) * limit
    });
  }, [currentQueryParams, limit, setQueryParams]);
  
  

  // Fetch transactions once on mount
  React.useEffect(() => {
    useTransactionStore.getState().fetchTransactions();
  }, []);

  // Preluăm doar eroarea pentru afișare
  const fetchError = useTransactionStore((s: TransactionState) => s.error);

  // Callback pentru schimbarea paginii
  const handlePageChange = React.useCallback((newOffset: number) => goToPage(Math.floor(newOffset / limit) + 1), [goToPage, limit]);

  return (
    <div className="max-w-[900px] mx-auto my-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">{TITLES.TRANZACTII}</h1>

      <TransactionForm />

      <TransactionFilters
        type={filterType}
        category={filterCategory}
        onTypeChange={t => setFilterType(t as TransactionType | '')}
        onCategoryChange={c => setFilterCategory(c as CategoryType | '')}
      />

      <TransactionTable offset={offset} limit={limit} onPageChange={handlePageChange} />

      {fetchError && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {fetchError}
        </div>
      )}
    </div>
  );
};

export default App;
