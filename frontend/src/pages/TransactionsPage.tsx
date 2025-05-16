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
  
  // State pentru paginare și filtre
  const [filters, setFilters] = React.useState({
    limit: PAGINATION.DEFAULT_LIMIT,
    offset: PAGINATION.DEFAULT_OFFSET, 
    type: '',
    category: ''
  });
  
  // Extragem valorile din filters pentru a le folosi în UI
  const { limit, offset, type: filterType, category: filterCategory } = filters;
  const currentPage: number = Math.floor(offset / limit) + 1;
  
  // Hook-ul useTransactionFiltersStore pentru UI/interfață folositor
  const setFilterType = useTransactionFiltersStore(s => s.setFilterType);
  const setFilterCategory = useTransactionFiltersStore(s => s.setFilterCategory);
  
  // Folosim hook-ul useTransactions pentru a prelua datele - React Query se ocupă de caching
  const { 
    data, 
    error: fetchError, 
    isPending: isLoading 
  } = useTransactions({
    limit,
    offset,
    type: filterType as TransactionType || undefined,
    category: filterCategory as string || undefined,
    // Nu includem month/year pentru a asigura că nu avem conflicte cu LunarGrid
    month: undefined,
    year: undefined,
  });
  
  // Funcții pentru navigare - actualizează direct state-ul local care declanșează refetch
  const goToPage = React.useCallback((page: number) => {
    setFilters(prev => ({
      ...prev,
      offset: (page - 1) * limit
    }));
  }, [limit]);
  
  // Callback pentru schimbarea filtrelor - declanșează refetch via React Query
  const handleFilterChange = React.useCallback((newType?: string, newCategory?: string) => {
    setFilters(prev => ({
      ...prev,
      // Resetăm offset la schimbarea filtrelor pentru a începe de la prima pagină
      offset: 0,
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

  // Callback pentru schimbarea paginii - utilizat de componenta TransactionTable
  const handlePageChange = React.useCallback(
    (newOffset: number) => goToPage(Math.floor(newOffset / limit) + 1), 
    [goToPage, limit]
  );

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

      {/* Pasăm direct datele din React Query către tabel */}
      <TransactionTable 
        transactions={data?.data || []} 
        total={data?.count || 0}
        isLoading={isLoading}
        offset={offset} 
        limit={limit} 
        onPageChange={handlePageChange} 
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
