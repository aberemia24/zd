import React, { useMemo, useCallback } from "react";
import Button from "../../primitives/Button/Button";
import Badge from "../../primitives/Badge/Badge";
import Spinner from "../../primitives/Spinner/Spinner";
import {
  TransactionType,
  CategoryType,
  FrequencyType,
  TransactionStatus,
} from "@shared-constants";
import { TABLE, BUTTONS, INFO } from "@shared-constants";
import type { Transaction } from "../../../types/Transaction";
import { 
  cn,
  card,
  badge,
  button
} from "../../../styles/cva-v2";
import type { TransactionValidated } from "@shared-constants/transaction.schema";
import { formatCurrencyForGrid } from "../../../utils/lunarGrid";

export type { Transaction };

export type TransactionTableProps = {
  /** Lista de tranzacții încărcate din toate paginile */
  transactions: (TransactionValidated & { userId?: string })[];
  /** Numărul total de tranzacții (pentru informații) */
  total: number;
  /** Flag care indică dacă datele inițiale sunt în curs de încărcare */
  isLoading?: boolean;
  /** Flag care indică dacă următoarea pagină este în curs de încărcare */
  isFetchingNextPage?: boolean;
  /** Flag care indică dacă mai există pagini disponibile pentru încărcare */
  hasNextPage?: boolean;
  /** Callback pentru încărcarea următoarei pagini */
  fetchNextPage?: () => void;
  /** Flag care indică dacă filtrele sunt active, pentru a afișa mesaj specific când nu există tranzacții */
  isFiltered?: boolean;
  /** Flag care indică dacă se face fetching de date noi, dar avem date vechi (pentru overlay UX) */
  isFetching?: boolean;
};

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  total,
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  fetchNextPage,
  isFiltered = false,
  isFetching = false,
  ...rest
}) => {
  // Referință către container pentru implementarea intersection observer
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Memoizăm funcția de formatare pentru a evita recalculările inutile
  const getAmountStyles = useCallback(
    (
      amount: number | string | undefined,
      type?: string,
    ): React.CSSProperties => {
      if (amount === undefined || amount === null) return {};

      const numericAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;

      // Fără număr valid, returnăm stil normal
      if (isNaN(numericAmount)) return {};

      // Dacă e EXPENSE (cheltuială), roșu, dacă e INCOME (venit), verde
      if (type === TransactionType.EXPENSE) {
        return { color: "#dc2626" }; // red-600
      } else if (type === TransactionType.INCOME) {
        return { color: "#16a34a" }; // green-600
      }

      return {};
    },
    [],
  );

  // Memoizăm formatorul pentru valori monetare cu detecție inteligentă a zecimalelor
  const formatAmount = useCallback(
    (amount: number | string | undefined): string => {
      if (amount === undefined || amount === null) return "";

      const numericAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;

      if (isNaN(numericAmount)) return String(amount);

      // Folosește formatarea inteligentă cu zecimale când este necesar și adaugă simbolul RON
      return formatCurrencyForGrid(numericAmount, 10000) + " RON";
    },
    [],
  );

  // Memoizăm formatorul pentru date
  const formatDate = useCallback((date: string | Date | undefined): string => {
    if (!date) return "";

    if (typeof date === "object" && date instanceof Date) {
      // Formatăm obiectul Date ca string
      return date.toLocaleDateString("ro-RO");
    }

    // Încercăm să creăm un obiect Date din string
    try {
      const dateObj = new Date(date as string);
      return dateObj.toLocaleDateString("ro-RO");
    } catch (e) {
      // Dacă nu putem formata, returnăm string-ul original
      return String(date);
    }
  }, []);

  // Memoizăm mesajul pentru cazul când nu există tranzacții
  const emptyMessage = useMemo(() => {
    if (isFiltered) {
      // Dacă filtrele sunt active, afișăm mesajul pentru "nu există tranzacții pentru filtrele selectate"
      return TABLE.NO_TRANSACTIONS || INFO.NO_TRANSACTIONS;
    }
    // Altfel, afișăm mesajul standard pentru tabel gol
    return TABLE.EMPTY;
  }, [isFiltered]);

  // Implementăm Intersection Observer pentru detecția scroll-ului
  React.useEffect(() => {
    // Evităm crearea observer-ului dacă nu avem fetchNextPage
    if (!fetchNextPage) return;

    // Funcția callback pentru intersection observer
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      // Dacă elementul nostru este vizibil și avem pagini disponibile, și nu suntem deja în loading
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    // Opțiuni pentru Intersection Observer
    const options = {
      root: null, // viewport
      rootMargin: "100px", // mărește aria de detectare pentru o experiență mai fluidă
      threshold: 0.1, // 10% vizibil
    };

    // Creăm un nou observer care va detecta când elementul e vizibil
    const observer = new IntersectionObserver(handleObserver, options);

    // Salvăm o referință locală pentru cleanup
    const currentBottomRef = bottomRef.current;

    // Începem să observăm elementul nostru
    if (currentBottomRef) {
      observer.observe(currentBottomRef);
    }

    // Cleanup la unmount
    return () => {
      if (currentBottomRef) {
        observer.unobserve(currentBottomRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Memoizăm rândul de loading pentru reutilizare
  const loadingRow = useMemo(
    () => (
      <tr data-testid="transaction-table-loading">
        <td
          colSpan={8}
          className={cn(
            "p-4 text-center border-b border-neutral/20 dark:border-neutral-600/30"
          )}
          aria-live="polite"
        >
          <div
            className={cn(
              "flex flex-row justify-center items-center gap-2"
            )}
          >
            <Spinner size="sm" />
            <span data-testid="table-loading-text">{TABLE.LOADING}</span>
          </div>
        </td>
      </tr>
    ),
    [],
  );

  // Memoizăm rândul de loading pentru paginarea infinită
  const loadingMoreRow = useMemo(
    () => (
      <tr data-testid="transaction-table-loading-more">
        <td
          colSpan={8}
          className={cn(
            "p-4 text-center border-b border-neutral/20 dark:border-neutral-600/30"
          )}
          aria-live="polite"
        >
          <div
            className={cn(
              "flex flex-row justify-center items-center gap-2"
            )}
          >
            <Spinner size="sm" />
            <span data-testid="table-loading-more-text">
              {TABLE.LOADING_MORE || "Se încarcă mai multe..."}
            </span>
          </div>
        </td>
      </tr>
    ),
    [],
  );

  // Memoizăm rândul pentru tabelul gol
  const emptyRow = useMemo(
    () => (
      <tr data-testid="transaction-table-empty">
        <td
          colSpan={8}
          className={cn(
            "p-8 text-center border-b border-neutral/20 dark:border-neutral-600/30",
            "text-neutral-500 dark:text-neutral-400"
          )}
        >
          <div
            className={cn(
              "flex flex-row justify-center items-center gap-2"
            )}
          >
            <span data-testid="table-empty-text">{emptyMessage}</span>
          </div>
        </td>
      </tr>
    ),
    [emptyMessage],
  );

  return (
    <div
      className={cn(
        card({ variant: "default" }),
        "w-full overflow-hidden"
      )}
      data-testid="transaction-table-container"
      {...rest}
    >
      {/* Table Container cu Overlay pentru isFetching */}
      <div className="relative">
        {/* Overlay când isFetching este true */}
        {isFetching && (
          <div
            className="absolute inset-0 bg-background/80 dark:bg-surface-dark/80 backdrop-blur-sm z-10 flex items-center justify-center"
            data-testid="table-fetching-overlay"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background dark:bg-surface-dark shadow-lg border border-neutral/20 dark:border-neutral-600/30">
              <Spinner size="sm" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Se actualizează...
              </span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table
            className={cn(
              "w-full border-collapse"
            )}
            data-testid="transaction-table"
          >
            <thead>
              <tr className="border-b border-neutral/20 dark:border-neutral-600/30">
                <th
                  className={cn(
                    "text-left p-4 font-medium text-neutral-700 dark:text-neutral-300 bg-neutral/5 dark:bg-neutral-600/10"
                  )}
                  data-testid="header-date"
                >
                  {TABLE.HEADERS.DATE}
                </th>
                <th
                  className={cn(
                    "text-left p-4 font-medium text-neutral-700 dark:text-neutral-300 bg-neutral/5 dark:bg-neutral-600/10"
                  )}
                  data-testid="header-description"
                >
                  {TABLE.HEADERS.DESCRIPTION}
                </th>
                <th
                  className={cn(
                    "text-left p-4 font-medium text-neutral-700 dark:text-neutral-300 bg-neutral/5 dark:bg-neutral-600/10"
                  )}
                  data-testid="header-amount"
                >
                  {TABLE.HEADERS.AMOUNT}
                </th>
                <th
                  className={cn(
                    "text-left p-4 font-medium text-neutral-700 dark:text-neutral-300 bg-neutral/5 dark:bg-neutral-600/10"
                  )}
                  data-testid="header-category"
                >
                  {TABLE.HEADERS.CATEGORY}
                </th>
                <th
                  className={cn(
                    "text-left p-4 font-medium text-neutral-700 dark:text-neutral-300 bg-neutral/5 dark:bg-neutral-600/10"
                  )}
                  data-testid="header-subcategory"
                >
                  {TABLE.HEADERS.SUBCATEGORY}
                </th>
                <th
                  className={cn(
                    "text-left p-4 font-medium text-neutral-700 dark:text-neutral-300 bg-neutral/5 dark:bg-neutral-600/10"
                  )}
                  data-testid="header-recurring"
                >
                  {TABLE.HEADERS.RECURRING}
                </th>
                <th
                  className={cn(
                    "text-left p-4 font-medium text-neutral-700 dark:text-neutral-300 bg-neutral/5 dark:bg-neutral-600/10"
                  )}
                  data-testid="header-frequency"
                >
                  {TABLE.HEADERS.FREQUENCY}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? loadingRow
                : !isFetching && transactions && transactions.length === 0
                  ? emptyRow
                  : transactions.map((t, idx) => (
                      <tr
                        key={`${t.id}-${idx}`}
                        className="hover:bg-gray-50 transition-colors duration-150"
                        data-testid={`transaction-item-${t.id || idx}`}
                      >
                        <td className="p-4 border-b border-neutral/20 dark:border-neutral-600/30">
                          {formatDate(t.date)}
                        </td>
                        <td className="p-4 border-b border-neutral/20 dark:border-neutral-600/30">
                          {t.description || ""}
                        </td>
                        <td
                          className="p-4 border-b border-neutral/20 dark:border-neutral-600/30"
                          style={getAmountStyles(t.amount, t.type)}
                          data-testid={`amount-${idx}`}
                        >
                          <span className="font-medium">
                            {formatAmount(t.amount)}
                          </span>
                        </td>
                        <td className="p-4 border-b border-neutral/20 dark:border-neutral-600/30">
                          {t.category || ""}
                        </td>
                        <td className="p-4 border-b border-neutral/20 dark:border-neutral-600/30">
                          {t.subcategory || ""}
                        </td>
                        <td className="p-4 border-b border-neutral/20 dark:border-neutral-600/30">
                          {t.recurring === true ? (
                            <Badge
                              variant="primary"
                            >
                              Da
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                            >
                              Nu
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 border-b border-neutral/20 dark:border-neutral-600/30">
                          {t.frequency && (
                            <Badge
                              variant="primary"
                            >
                              {t.frequency}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
              {/* Fără date, dar în curs de încărcare - arăta indicator de loading pentru următoarea pagină */}
              {isFetchingNextPage && loadingMoreRow}
            </tbody>
          </table>
        </div>
      </div>

      {/* Informații despre numărul total de tranzacții */}
      {!isLoading && transactions && transactions.length > 0 && (
        <div
          className={cn(
            "flex flex-row justify-between items-center p-4 border-t border-neutral/20 dark:border-neutral-600/30"
          )}
          aria-live="polite"
        >
          <span className="text-neutral-600 dark:text-neutral-400 text-sm">
            {TABLE.SHOWING_INFO.replace(
              "{shown}",
              String(transactions.length),
            ).replace("{total}", String(total))}
          </span>
          {hasNextPage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchNextPage?.()}
              disabled={isFetchingNextPage}
              dataTestId="load-more-btn"
              aria-label={
                isFetchingNextPage ? TABLE.LOADING_MORE : BUTTONS.NEXT_PAGE
              }
            >
              {isFetchingNextPage ? TABLE.LOADING_MORE : BUTTONS.NEXT_PAGE}
            </Button>
          )}
        </div>
      )}

      {/* Element invizibil pentru intersection observer */}
      <div
        ref={bottomRef}
        style={{ height: "20px", margin: "10px 0" }}
        aria-hidden="true"
      />
    </div>
  );
};

export default React.memo(TransactionTable);
