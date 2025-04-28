// Componenta principală a aplicației - refactorizată cu Custom Hooks și Servicii
import React from 'react';
import TransactionForm from './components/features/TransactionForm/TransactionForm';
import TransactionTable from './components/features/TransactionTable/TransactionTable';
import TransactionFilters from './components/features/TransactionFilters/TransactionFilters';
import { OPTIONS, TITLES } from '@shared-constants';

// Import tipuri
import { TransactionFormWithNumberAmount } from './types/transaction';

// Import store Zustand pentru tranzacții
import { useTransactionStore } from './stores/transactionStore';
import { useTransactionFormStore } from './stores/transactionFormStore';

// Import servicii
import { TransactionService } from './services';

/**
 * Componenta principală a aplicației, refactorizată pentru a utiliza custom hooks și servicii
 * 
 * Structura:
 * 
 * Această structură separă clar logica de business de UI, crescând testabilitatea, 
 * mentenabilitatea și facilitând extinderea ulterioară.
 */
export const App: React.FC = () => {
  // Initializăm serviciile
  const transactionService = React.useMemo(() => new TransactionService(), []);

  // Folosim store-ul Zustand pentru filtre și paginare
  const {
    currentQueryParams,
    setQueryParams
  } = useTransactionStore(state => ({
    currentQueryParams: state.currentQueryParams,
    setQueryParams: state.setQueryParams
  }));
  
  // Extragem valorile din query params pentru a le folosi în UI
  const limit: number = currentQueryParams.limit || 10;
  const offset: number = currentQueryParams.offset || 0;
  const filterType: string | undefined = currentQueryParams.type;
  const filterCategory: string | undefined = currentQueryParams.category;
  const currentPage: number = Math.floor(offset / limit) + 1;
  
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
  
  const setFilterType = React.useCallback((type: string) => {
    setQueryParams({
      ...currentQueryParams,
      type,
      offset: 0 // Reset la prima pagină când schimbăm filtrul
    });
  }, [currentQueryParams, setQueryParams]);
  
  const setFilterCategory = React.useCallback((category: string) => {
    setQueryParams({
      ...currentQueryParams,
      category,
      offset: 0 // Reset la prima pagină când schimbăm filtrul
    });
  }, [currentQueryParams, setQueryParams]);

  // Folosim store-ul Zustand pentru date tranzacții
  const transactions = useTransactionStore(s => s.transactions);
  const total = useTransactionStore(s => s.total);
  const loadingFetch = useTransactionStore(s => s.loading);
  const fetchError = useTransactionStore(s => s.error);
  const refreshTransactions = useTransactionStore(s => s.refresh);
  // TODO: adaptare queryParams și transactionService dacă este nevoie (acum store-ul le gestionează intern)

  // Înregistrăm serviciile direct în componenta de nivel superior
  // Această metodă este mult mai sigură și previne bucle infinite
  React.useEffect(() => {
    const storeApi = useTransactionFormStore.getState();
    if (typeof storeApi.setTransactionService === 'function') {
      storeApi.setTransactionService(transactionService);
    }
    if (typeof storeApi.setRefreshCallback === 'function') {
      storeApi.setRefreshCallback(refreshTransactions);
    }

    // Utilizăm un array gol de dependențe pentru a executa efectul doar la montare
  }, []); // Array gol pentru a preveni bucla infinită

  // Folosim store-ul Zustand pentru formular
  const {
    form,
    error: formError,
    success: formSuccess,
    loading: loadingSubmit,
    handleChange,
    handleSubmit,
    resetForm
  } = useTransactionFormStore(state => ({
    form: state.form,
    error: state.error,
    success: state.success,
    loading: state.loading,
    handleChange: state.handleChange,
    handleSubmit: state.handleSubmit,
    resetForm: state.resetForm
  }));
  
  // Nu mai folosim handler-ul explicit, ci ne bazăm pe serviciile înregistrate direct în store

  // Callback pentru schimbarea paginii
  const handlePageChange = React.useCallback((newOffset: number) => {
    goToPage(Math.floor(newOffset / limit) + 1);
  }, [goToPage, limit]);

  return (
    <div className="max-w-[900px] mx-auto my-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">{TITLES.TRANZACTII}</h1>

      {/* Render Transaction Form */}
      {/* TransactionForm nu mai primește props, folosește direct Zustand store */}
      <TransactionForm />

      {/* Filtrare tranzacții după tip și categorie */}
      <TransactionFilters />

      {/* Render Transaction Table */}
      <TransactionTable
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
