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

// CVA styling imports
import { cn, card, dashboard, headingProfessional, flexLayout, spaceY } from "../styles/cva-v2";
import { Container } from "../components/primitives";

import { PAGINATION } from "@shared-constants";
import { TITLES } from "@shared-constants";
import type { Transaction } from "../types/Transaction";

// Interfață pentru tranzacții cu proprietăți opționale pentru transformare
interface RawTransactionWithOptionalId extends Omit<Transaction, 'id'> {
  id?: string;
  _id?: string;
}

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

    console.log('[DEBUG-TRANSACTIONS-PAGE] rawTransactions changed:', rawTransactions.length);

    return rawTransactions.map((transaction) => {
      const processedTransaction = { ...transaction };

      // Asigurăm că toate tranzacțiile au userId
      if (!processedTransaction.userId && user?.id) {
        processedTransaction.userId = user.id;
      }

      // Asigurăm că _id este transferat la id dacă e necesar
      const rawTransaction = processedTransaction as RawTransactionWithOptionalId;
      if (!rawTransaction.id && rawTransaction._id) {
        (processedTransaction as Transaction & { id: string }).id = rawTransaction._id;
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
    <Container maxWidth="7xl" padding="lg">
      <div className={cn(dashboard({ layout: "default" }), "space-y-6")}>
        {/* Titlu pagină cu efect de gradient subtil */}
        <h1
          className={headingProfessional({ level: "h1" })}
          data-testid="transactions-title"
        >
          {TITLES.TRANZACTII}
        </h1>

        {/* Afișăm alerte pentru erori de fetch */}
        {fetchError && (
          <Alert
            variant="error"
            className="mb-4"
          >
            <strong>Eroare la încărcarea tranzacțiilor:</strong> {fetchError.message}
          </Alert>
        )}

        {/* Card pentru formular cu styling elegant */}
        <div className={cn(card({ variant: "default" }), "mb-6")}>
          <TransactionForm />
        </div>

        {/* Card pentru filtre cu styling consistent */}
        <div className={cn(card({ variant: "default" }), "mb-6")}>
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
            onSubcategoryChange={handleSubcategoryChange}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onAmountMinChange={setAmountMin}
            onAmountMaxChange={setAmountMax}
            onSearchTextChange={setSearchText}
          />
        </div>

        {/* Card pentru export cu styling și layout consistent */}
        <div className={cn(card({ variant: "default" }), "mb-6")}>
          <ExportButton
            transactions={(transactions as Transaction[]) || []}
            disabled={isLoading || !transactions?.length}
          />
        </div>

        {/* Tabelul cu tranzacții */}
        <div
          className={cn(flexLayout({ direction: "col" }), spaceY({ spacing: 4 }))}
          data-testid="transactions-page-table-container"
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
    </Container>
  );
};

export default TransactionsPage;
