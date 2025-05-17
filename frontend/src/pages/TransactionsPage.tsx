import React from 'react';
import TransactionForm from '../components/features/TransactionForm/TransactionForm';
import TransactionTable from '../components/features/TransactionTable/TransactionTable';
import TransactionFilters from '../components/features/TransactionFilters/TransactionFilters';
import { useTransactionFiltersStore } from '../stores/transactionFiltersStore';
import { useTransactions } from '../services/hooks/useTransactions';
import { useQueryClient } from '@tanstack/react-query';
import { TITLES, TransactionType, CategoryType } from '@shared-constants';
import { PAGINATION } from '@shared-constants';

/**
 * Pagină dedicată pentru gestionarea tranzacțiilor
 * Conține formularul de adăugare, filtrele și tabelul de tranzacții
 * Refactorizat pentru React Query (TanStack Query)
 */
const TransactionsPage: React.FC = () => {
  // Folosim React Query pentru state management și fetch
  const queryClient = useQueryClient();
  
  // State pentru filtre - pentru paginare folosim useInfiniteQuery cu pageParam
  const [filters, setFilters] = React.useState({
    limit: PAGINATION.DEFAULT_LIMIT,
    type: '',
    category: ''
  });
  
  // Extragem valorile din filters pentru a le folosi în UI
  const { limit, type: filterType, category: filterCategory } = filters;
  
  // Hook-ul useTransactionFiltersStore pentru UI/interfață folositor
  const setFilterType = useTransactionFiltersStore(s => s.setFilterType);
  const setFilterCategory = useTransactionFiltersStore(s => s.setFilterCategory);
  
  // Folosim hook-ul useTransactions cu paginare infinită - React Query se ocupă de caching
  const { 
    data, 
    error: fetchError, 
    isPending: isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useTransactions({
    limit,
    type: filterType as TransactionType || undefined,
    category: filterCategory as string || undefined,
    // Nu includem month/year pentru a asigura că nu avem conflicte cu LunarGrid
    month: undefined,
    year: undefined,
  });
  
  // Extragem și combinam toate tranzacțiile din toate paginile pentru afișare
  const transactions = React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.data);
  }, [data]);
  
  // Calculam numărul total de tranzacții din rezultatele paginii
  const totalTransactions = React.useMemo(() => {
    if (!data?.pages || data.pages.length === 0) return 0;
    // Folosim count din prima pagină care conține totalul
    return data.pages[0].count;
  }, [data]);
  
  // Callback pentru schimbarea filtrelor - declanșează refetch via React Query
  const handleFilterChange = React.useCallback((newType?: string, newCategory?: string) => {
    setFilters(prev => ({
      ...prev,
      type: newType !== undefined ? newType : prev.type,
      category: newCategory !== undefined ? newCategory : prev.category
    }));
    
    // Pentru a menține sincronizarea cu filterStore pentru UI consistency
    if (newType !== undefined) setFilterType(newType as TransactionType | '');
    if (newCategory !== undefined) setFilterCategory(newCategory as CategoryType | '');
  }, [setFilterType, setFilterCategory]);
  
  // Sync cu filterStore la montare - doar pentru UI consistency
  React.useEffect(() => {
    const storeType = useTransactionFiltersStore.getState().filterType;
    const storeCategory = useTransactionFiltersStore.getState().filterCategory;
    
    // Actualizăm state-ul local cu valorile din store doar la montare
    setFilters(prev => ({
      ...prev,
      type: storeType || '',
      category: storeCategory || ''
    }));
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold text-primary-700 mb-token" data-testid="transactions-title">{TITLES.TRANZACTII}</h1>

      <TransactionForm />

      <TransactionFilters
        type={filterType}
        category={filterCategory}
        onTypeChange={t => handleFilterChange(t as TransactionType | '', undefined)}
        onCategoryChange={c => handleFilterChange(undefined, c as CategoryType | '')}
      />

      {/* Aici folosim TransactionTable care acum suportă paginare infinită */}
      <TransactionTable
        transactions={transactions}
        total={totalTransactions}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />

      {fetchError && (
        <div className="mt-token p-token-sm bg-error-100 text-error-700 rounded-token" data-testid="fetch-error">
          {fetchError.message || 'Eroare la încărcarea tranzacțiilor'}
        </div>
      )}
    </>
  );
};

export default TransactionsPage;
