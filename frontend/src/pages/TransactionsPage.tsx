import React, { useMemo, useCallback, useEffect } from "react";
import TransactionForm from "../components/features/TransactionForm/TransactionForm";
import TransactionTable from "../components/features/TransactionTable/TransactionTable";
import TransactionFilters from "../components/features/TransactionFilters/TransactionFilters";
import { ExportButton } from "../components/features/ExportButton/ExportButton";
import Alert from "../components/primitives/Alert/Alert";
import { LineChart } from "../components/primitives/Charts";
import { useTransactionChartData } from "../hooks/useTransactionChartData";
import { useQueryClient } from "@tanstack/react-query";
import { TransactionType, CategoryType } from "@budget-app/shared-constants";
import { useFilteredTransactions } from "../services/hooks/useFilteredTransactions";
import { useTransactionFiltersStore } from "../stores/transactionFiltersStore";
import { useAuthStore } from "../stores/authStore";

// CVA styling imports
import { cn, card, dashboard, headingProfessional, flexLayout, spaceY } from "../styles/cva-v2";
import { Container } from "../components/primitives";

import { PAGINATION } from "@budget-app/shared-constants";
import { TITLES } from "@budget-app/shared-constants";
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

  // =============================================================================
  // CHART DATA PROCESSING
  // =============================================================================

  const chartData = useTransactionChartData(transactions as Transaction[]);

  // Line chart data pentru trend-uri temporale
  const lineChartData = useMemo(() => {
    if (chartData.timeSeriesData.length === 0) return [];
    
    // Luăm ultimele 30 de zile și grupăm pe săptămâni pentru clarity
    const sortedData = [...chartData.timeSeriesData].sort((a, b) => a.timestamp - b.timestamp);
    const recentData = sortedData.slice(-30); // Ultimele 30 de puncte
    
    return recentData.map(point => ({
      ...point,
      // Formatăm data pentru display
      displayDate: new Date(point.date).toLocaleDateString('ro-RO', { 
        month: 'short', 
        day: 'numeric' 
      })
    }));
  }, [chartData.timeSeriesData]);



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

        {/* Layout 50/50: TransactionForm + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Stânga: Transaction Form */}
          <div className={cn(card({ variant: "default" }))}>
            <TransactionForm />
          </div>

          {/* Dreapta: Analytics Dashboard cu 2 charts */}
          <div className={cn(card({ variant: "default" }), "p-6")}>
            <div className="space-y-6">
              {/* Header cu statistici generale */}
              <div className="text-center border-b border-carbon-200 dark:border-carbon-700 pb-4">
                <h3 className="text-lg font-semibold text-carbon-900 dark:text-carbon-100 mb-2">
                  📊 Analiza Financiară
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-red-600 dark:text-red-400">
                    <div className="font-medium">Cheltuieli</div>
                    <div className="text-lg font-bold">{chartData.totalExpenses.toFixed(0)} RON</div>
                  </div>
                  <div className="text-green-600 dark:text-green-400">
                    <div className="font-medium">Venituri</div>
                    <div className="text-lg font-bold">{chartData.totalIncome.toFixed(0)} RON</div>
                  </div>
                </div>
              </div>
              
              {/* Trend Temporal (Line) */}
              <div className="space-y-4 pt-2">
                <h4 className="font-medium text-carbon-800 dark:text-carbon-200 text-center">
                  📈 Trend Financiar (Ultimele 30 zile)
                </h4>
                {lineChartData.length > 0 ? (
                  <div className="h-48">
                    <LineChart
                      data={lineChartData as any}
                      xAxisKey="date"
                      yAxisKeys={["expenses", "income"]}
                      colors={{
                        expenses: "#ef4444",  // red-500
                        income: "#10b981"     // green-500
                      }}
                      height={190}
                      showArea={false}
                      strokeWidth={3}
                      dotSize={4}
                      showLegend={true}
                      showGridLines={true}
                    />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-carbon-500 dark:text-carbon-400">
                    <div className="text-center">
                      <div className="text-2xl mb-1">📈</div>
                      <p className="text-sm">Fără date de trend</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card pentru filtre cu export integrat */}
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
            exportButton={
              <ExportButton
                transactions={(transactions as Transaction[]) || []}
                disabled={isLoading || !transactions?.length}
              />
            }
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
