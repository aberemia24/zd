import React, { useMemo } from 'react';
import TransactionForm from '../components/features/TransactionForm/TransactionForm';
import TransactionTable from '../components/features/TransactionTable/TransactionTable';
import TransactionFilters from '../components/features/TransactionFilters/TransactionFilters';
import { useTransactionFiltersStore } from '../stores/transactionFiltersStore';
import { useAuthStore } from '../stores/authStore';
import { useFilteredTransactions } from '../services/hooks/useFilteredTransactions';
// Următoarele importuri au fost eliminate deoarece mutațiile sunt gestionate în componente specializate
// și nu direct în TransactionsPage
// import { useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '../services/hooks/transactionMutations';
// import { useQueryClient } from '@tanstack/react-query';
import { TITLES, TransactionType, CategoryType } from '@shared-constants';
import { PAGINATION } from '@shared-constants';
import Alert from '../components/primitives/Alert/Alert';
import { getEnhancedComponentClasses } from '../styles/themeUtils';

/**
 * Pagină dedicată pentru gestionarea tranzacțiilor
 * Conține formularul de adăugare, filtrele și tabelul de tranzacții
 * Refactorizat pentru React Query (TanStack Query) cu optimizări de performanță
 */
const TransactionsPage: React.FC = () => {
  // State pentru filtre - pentru paginare folosim useInfiniteQuery cu pageParam
  const [filters, setFilters] = React.useState({
    limit: PAGINATION.DEFAULT_LIMIT,
    type: '',
    category: '',
    subcategory: ''
  });
  
  // Extragem valorile din filters pentru a le folosi în UI
  const { type: filterType, category: filterCategory, subcategory: filterSubcategory } = filters;
  
  // Hook-ul useTransactionFiltersStore pentru UI/interfață folositor
  const setFilterType = useTransactionFiltersStore(s => s.setFilterType);
  const setFilterCategory = useTransactionFiltersStore(s => s.setFilterCategory);
  
  // Extragem user din AuthStore pentru a-l folosi în query
  const { user } = useAuthStore();
  
  // Adaug state pentru filtrele avansate
  const [dateFrom, setDateFrom] = React.useState<string>('');
  const [dateTo, setDateTo] = React.useState<string>('');  
  const [amountMin, setAmountMin] = React.useState<string>('');
  const [amountMax, setAmountMax] = React.useState<string>('');
  const [searchText, setSearchText] = React.useState<string>('');
  
  // Memoizăm parametrii de query pentru a preveni recalculări inutile
  const queryParams = useMemo(() => ({
    limit: PAGINATION.DEFAULT_LIMIT,
    type: filterType as TransactionType || undefined,
    category: filterCategory as string || undefined,
    subcategory: filterSubcategory || undefined,
    // Adăugăm noile filtre avansate
    startDate: dateFrom || undefined,
    endDate: dateTo || undefined,
    // Convertim string la număr pentru filtrele de sumă
    ...(amountMin ? { minAmount: parseFloat(amountMin) } : {}),
    ...(amountMax ? { maxAmount: parseFloat(amountMax) } : {}),
    // Adăugăm filtrul de căutare text
    ...(searchText ? { search: searchText } : {}),
    // Nu includem month/year pentru a avea toate tranzacțiile
    sort: 'date',
    order: 'desc' as const
  }), [filterType, filterCategory, filterSubcategory, dateFrom, dateTo, amountMin, amountMax, searchText]);

  // Folosim noul hook useFilteredTransactions cu optimizări de performance
  const { 
    data: transactions,
    error: fetchError, 
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    totalCount,
    isFiltered
  } = useFilteredTransactions(queryParams);
  
  // Logging pentru debugging - doar în development
  if (process.env.NODE_ENV === 'development') {
    console.log('TransactionsPage - user:', user);
    console.log('TransactionsPage - transactions:', transactions);
    console.log('TransactionsPage - totalCount:', totalCount);
    console.log('TransactionsPage - isFiltered:', isFiltered);
  }
  
  // Notă: Mutațiile de creare/actualizare/ștergere sunt gestionate în componentele specializate
  // (TransactionForm) și nu direct în această pagină.
  
  // Nu mai avem nevoie de filtrare locală deoarece filtrele sunt aplicate în query
  // Numărul total de tranzacții vine direct din query
  const totalTransactions = totalCount;
  
  // Callback pentru schimbarea filtrelor - declanșează refetch via React Query
  const handleFilterChange = React.useCallback((
    newType?: string, 
    newCategory?: string, 
    newSubcategory?: string
  ) => {
    setFilters(prev => ({
      ...prev,
      type: newType !== undefined ? newType : prev.type,
      category: newCategory !== undefined ? newCategory : prev.category,
      subcategory: newSubcategory !== undefined ? newSubcategory : prev.subcategory
    }));
    
    // Pentru a menține sincronizarea cu filterStore pentru UI consistency
    if (newType !== undefined) setFilterType(newType as TransactionType | '');
    if (newCategory !== undefined) setFilterCategory(newCategory as CategoryType | '');
  }, [setFilterType, setFilterCategory]);
  
  // Handler pentru schimbarea subcategoriei
  const handleSubcategoryChange = React.useCallback((newSubcategory: string) => {
    setFilters(prev => ({
      ...prev,
      subcategory: newSubcategory
    }));
  }, []);
  
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
    <div className={getEnhancedComponentClasses('container', 'primary', 'lg', undefined, ['fade-in', 'page-wrapper'])}>
      {/* Titlu pagină cu efect de gradient subtil */}
      <h1 
        className={getEnhancedComponentClasses('form-label', 'primary', 'xl', undefined, ['gradient-text-subtle', 'mb-token'])}
        data-testid="transactions-title"
      >
        {TITLES.TRANZACTII}
      </h1>

      {/* Secțiune formular cu shadow și border rafinate */}
      <div className={getEnhancedComponentClasses('card', 'default', 'lg', undefined, ['shadow-md', 'mb-token'])}>
        <div className={getEnhancedComponentClasses('card-header', undefined, undefined, undefined, ['gradient-bg-subtle'])}>
          <h2 className={getEnhancedComponentClasses('form-label', 'secondary', 'md')}>Adaugă tranzacție nouă</h2>
        </div>
        <div className={getEnhancedComponentClasses('card-body')}>
          <TransactionForm />
        </div>
      </div>

      {/* Secțiune filtre */}
      <div className={getEnhancedComponentClasses('flex', undefined, undefined, undefined, ['mb-token'])}>
        <TransactionFilters
          type={filterType}
          category={filterCategory}
          subcategory={filterSubcategory}
          onTypeChange={t => handleFilterChange(t as TransactionType | '', undefined, '')}
          onCategoryChange={c => handleFilterChange(undefined, c as CategoryType | '', '')}
          onSubcategoryChange={handleSubcategoryChange}
          // Noile props pentru filtrele avansate
          dateFrom={dateFrom}
          dateTo={dateTo}
          amountMin={amountMin}
          amountMax={amountMax}
          searchText={searchText}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onAmountMinChange={setAmountMin}
          onAmountMaxChange={setAmountMax}
          onSearchTextChange={setSearchText}
        />
      </div>

      {/* Secțiune tabel cu efect de fade-in */}
      <div className={getEnhancedComponentClasses('flex', undefined, 'lg', undefined, ['flex-col', 'fade-in'])}>
        <TransactionTable
          transactions={transactions}
          total={totalTransactions}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>

      {/* Alertă de eroare cu efecte moderne */}
      {fetchError && (
        <Alert
          type="error"
          message={fetchError.message || 'Eroare la încărcarea tranzacțiilor'}
          data-testid="fetch-error"
          withIcon
          withFadeIn
          withAccentBorder
          withShadow
          className={getEnhancedComponentClasses('spacing', 'section')}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
