// Componenta principală a aplicației - refactorizată cu Custom Hooks și Servicii
import React from 'react';
import TransactionForm from './components/features/TransactionForm/TransactionForm';
import TransactionTable from './components/features/TransactionTable/TransactionTable';
import TransactionFilters from './components/features/TransactionFilters/TransactionFilters';
import { OPTIONS, TITLES } from './constants/ui';

// Import custom hooks
import { useTransactionForm, useTransactionFilters, useTransactionData, TransactionFormWithNumberAmount } from './hooks';

// Import servicii
import { TransactionService } from './services';

/**
 * Componenta principală a aplicației, refactorizată pentru a utiliza custom hooks și servicii
 * 
 * Structura:
 * - useTransactionForm: gestionează starea și validarea formularului
 * - useTransactionFilters: gestionează filtrele, paginarea și sortarea
 * - useTransactionData: gestionează datele despre tranzacții și comunică cu API-ul
 * 
 * Această structură separă clar logica de business de UI, crescând testabilitatea, 
 * mentenabilitatea și facilitând extinderea ulterioară.
 */
export const App: React.FC = () => {
  // Initializăm serviciile
  const transactionService = React.useMemo(() => new TransactionService(), []);

  // Folosim hook-ul pentru filtre și paginare
  const {
    filterType,
    filterCategory,
    limit,
    offset,
    currentPage,
    setFilterType,
    setFilterCategory,
    nextPage,
    prevPage,
    goToPage,
    queryParams
  } = useTransactionFilters();

  // Folosim hook-ul pentru date
  const {
    transactions,
    total,
    loading: loadingFetch,
    error: fetchError,
    refresh: refreshTransactions
  } = useTransactionData({
    queryParams,
    transactionService
  });

  // Callback pentru trimiterea formularului
  const handleFormSubmit = React.useCallback(async (formData: TransactionFormWithNumberAmount) => {
    try {
      // Salvăm tranzacția folosind serviciul
      await transactionService.saveTransaction(formData);
      // Forțăm reîncărcarea listei de tranzacții
      refreshTransactions();
      return true;
    } catch (error) {
      console.error('Eroare la salvarea tranzacției:', error);
      return false;
    }
  }, [transactionService, refreshTransactions]);

  // Folosim hook-ul pentru formular
  const {
    form,
    error: formError,
    success: formSuccess,
    loading: loadingSubmit,
    handleChange,
    handleSubmit,
    resetForm
  } = useTransactionForm({
    onSubmit: handleFormSubmit
  });

  // Callback pentru schimbarea paginii
  const handlePageChange = React.useCallback((newOffset: number) => {
    goToPage(Math.floor(newOffset / limit) + 1);
  }, [goToPage, limit]);

  return (
    <div className="max-w-[900px] mx-auto my-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">{TITLES.TRANZACTII}</h1>

      {/* Render Transaction Form */}
      <TransactionForm
        form={form}
        formError={formError}
        formSuccess={formSuccess}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loadingSubmit}
      />

      {/* Filtrare tranzacții după tip și categorie */}
      <TransactionFilters
        type={filterType}
        category={filterCategory}
        onTypeChange={setFilterType}
        onCategoryChange={setFilterCategory}
        types={OPTIONS.TYPE}
        categories={OPTIONS.CATEGORY}
      />

      {/* Render Transaction Table */}
      <TransactionTable
        transactions={transactions}
        loading={loadingFetch}
        total={total}
        offset={offset}
        limit={limit}
        onPageChange={handlePageChange}
      />

      {/* Afișare erori de la API */}
      {fetchError && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {fetchError}
        </div>
      )}
    </div>
  );
};

export default App;
