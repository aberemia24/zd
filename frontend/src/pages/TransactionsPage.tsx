import React, { useMemo, useCallback, useEffect } from "react";
import TransactionForm from "../components/features/TransactionForm/TransactionForm";
import TransactionTable from "../components/features/TransactionTable/TransactionTable";
import TransactionFilters from "../components/features/TransactionFilters/TransactionFilters";
import { ExportButton } from "../components/features/ExportButton/ExportButton";
import Alert from "../components/primitives/Alert/Alert";
import { useQueryClient } from "@tanstack/react-query";
import { TransactionType, CategoryType } from "@shared-constants";
import { useFilteredTransactions } from "../services/hooks/useFilteredTransactions";
import { useTransactionFiltersStore } from "../stores/transactionFiltersStore";
import { useAuthStore } from "../stores/authStore";
import { cn } from "../styles/cva/shared/utils";
import {
  card,
  container as pageContainer,
} from "../styles/cva/components/layout";
import { PAGINATION } from "@shared-constants";
import { TITLES } from "@shared-constants";
import type { Transaction } from "../types/Transaction";

/**
 * Pagină dedicată pentru gestionarea tranzacțiilor
 * Conține formularul de adăugare, filtrele și tabelul de tranzacții
 * Refactorizat pentru React Query (TanStack Query) cu optimizări de performanță și persistență URL
 */
const TransactionsPage: React.FC = () => {
  // Destructurarea store-ului pentru filtre cu logica completă de state management
  const {
    filterType,
    filterCategory,
    filterSubcategory,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    searchText,
    setFilterType,
    setFilterCategory,
    setFilterSubcategory,
    setDateFrom,
    setDateTo,
    setAmountMin,
    setAmountMax,
    setSearchText,
    resetFilters,
  } = useTransactionFiltersStore();

  // Extragem user din AuthStore pentru a-l folosi în query
  const { user } = useAuthStore();

  // Adăugăm queryClient pentru a invalida query-urile după adăugarea unei tranzacții
  const queryClient = useQueryClient();

  // Memoizăm parametrii de query pentru a preveni recalculări inutile
  const queryParams = useMemo(
    () => ({
      limit: PAGINATION.DEFAULT_LIMIT,
      type: (filterType as TransactionType) || undefined,
      category: (filterCategory as string) || undefined,
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
      sort: "date",
      order: "desc" as const,
    }),
    [
      filterType,
      filterCategory,
      filterSubcategory,
      dateFrom,
      dateTo,
      amountMin,
      amountMax,
      searchText,
    ],
  );

  // Folosim noul hook useFilteredTransactions cu optimizări de performance
  const {
    data: rawTransactions,
    error: fetchError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    totalCount,
    isFiltered,
    isFetching,
    refetch,
  } = useFilteredTransactions(queryParams);

  // Procesăm tranzacțiile pentru a asigura compatibilitatea cu tipul Transaction
  // Adăugăm userId acolo unde lipsește pentru a satisface interfața Transaction
  const transactions = useMemo(() => {
    if (!rawTransactions) return [];

    return rawTransactions.map((transaction) => {
      const processedTransaction = { ...transaction };

      // Asigurăm că toate tranzacțiile au userId
      if (!processedTransaction.userId && user?.id) {
        processedTransaction.userId = user.id;
      }

      // Asigurăm că _id este transferat la id dacă e necesar
      if (
        !(processedTransaction as any).id &&
        (processedTransaction as any)._id
      ) {
        (processedTransaction as any).id = (processedTransaction as any)._id;
      }

      // Ne asigurăm că date este mereu string
      if (
        processedTransaction.date &&
        typeof processedTransaction.date !== "string"
      ) {
        processedTransaction.date = String(processedTransaction.date);
      }

      return processedTransaction;
    });
  }, [rawTransactions, user?.id]);

  // Handler pentru evenimentul transaction:created
  const handleTransactionCreated = useCallback(() => {
    // Invalidăm cache-ul pentru a reîncărca datele
    queryClient.invalidateQueries({ queryKey: ["transactions"] });

    // Reîncărcăm datele direct
    refetch();
  }, [queryClient, refetch]);

  // Adăugăm listener pentru evenimentul transaction:created
  useEffect(() => {
    window.addEventListener("transaction:created", handleTransactionCreated);

    return () => {
      window.removeEventListener(
        "transaction:created",
        handleTransactionCreated,
      );
    };
  }, [handleTransactionCreated]);

  // Nu mai avem nevoie de filtrare locală deoarece filtrele sunt aplicate în query
  // Numărul total de tranzacții vine direct din query
  const totalTransactions = totalCount;

  // Handlers for filter changes (now using store directly)
  const handleFilterChange = useCallback(
    (newType?: string, newCategory?: string, newSubcategory?: string) => {
      if (newType !== undefined) setFilterType(newType as TransactionType | "");
      if (newCategory !== undefined)
        setFilterCategory(newCategory as CategoryType | "");
      if (newSubcategory !== undefined) setFilterSubcategory(newSubcategory);
    },
    [setFilterType, setFilterCategory, setFilterSubcategory],
  );

  // Handler pentru schimbarea subcategoriei
  const handleSubcategoryChange = useCallback(
    (newSubcategory: string) => {
      setFilterSubcategory(newSubcategory);
    },
    [setFilterSubcategory],
  );

  return (
    <div className={cn(pageContainer({ size: "lg" }), "space-y-6")}>
      {/* Titlu pagină cu efect de gradient subtil */}
      <h1
        className="text-3xl font-bold text-gray-900 mb-6"
        data-testid="transactions-title"
      >
        {TITLES.TRANZACTII}
      </h1>

      {/* Afișăm alerte pentru erori de fetch */}
      {fetchError && (
        <Alert
          type="error"
          title="Eroare la încărcarea tranzacțiilor"
          message={fetchError.message}
          size="md"
        />
      )}

      {/* Formularul pentru adăugarea tranzacțiilor */}
      <div
        className={cn(card({ variant: "elevated", size: "md" }))}
        data-testid="transaction-form-container"
      >
        <TransactionForm />
      </div>

      {/* Filtrele pentru tranzacții cu state-ul din Zustand store */}
      <div
        className={cn(card({ variant: "default", size: "md" }))}
        data-testid="transaction-filters-container"
      >
        <TransactionFilters
          type={filterType}
          category={filterCategory}
          subcategory={filterSubcategory}
          dateFrom={dateFrom}
          dateTo={dateTo}
          amountMin={amountMin}
          amountMax={amountMax}
          searchText={searchText}
          onTypeChange={(type) => setFilterType(type as TransactionType | "")}
          onCategoryChange={(category) =>
            setFilterCategory(category as CategoryType | "")
          }
          onSubcategoryChange={setFilterSubcategory}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onAmountMinChange={setAmountMin}
          onAmountMaxChange={setAmountMax}
          onSearchTextChange={setSearchText}
        />
      </div>

      {/* Export Button */}
      <div
        className={cn(card({ variant: "default", size: "md" }))}
        data-testid="export-button-container"
      >
        <ExportButton
          transactions={(transactions as Transaction[]) || []}
          disabled={isLoading || !transactions?.length}
        />
      </div>

      {/* Tabelul cu tranzacții */}
      <div
        className="flex flex-col space-y-4"
        data-testid="transaction-table-container"
      >
        <TransactionTable
          transactions={transactions || []}
          total={totalTransactions || 0}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isFiltered={isFiltered}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;
