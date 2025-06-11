import React, { useMemo, useCallback } from "react";
import Button from "../../primitives/Button/Button";
import Badge from "../../primitives/Badge/Badge";
import Spinner from "../../primitives/Spinner/Spinner";
import {
  TransactionType,
  CategoryType,
  FrequencyType,
  TransactionStatus,
} from "@budget-app/shared-constants";
import { TABLE, BUTTONS, INFO } from "@budget-app/shared-constants";
import type { Transaction } from "../../../types/Transaction";
import { 
  cn,
  card,
  badge,
  button,
  hoverBackground,
  simpleTable,
  tableHeader,
  tableCell,
  flexLayout,
  captionProfessional,
  fontFinancial,
  loadingOverlay,
  spacingMargin
} from "../../../styles/cva-v2";
import type { TransactionValidated } from "@budget-app/shared-constants/transaction.schema";
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
          className={tableCell({ align: "center", size: "md", variant: "default" })}
          aria-live="polite"
        >
          <div
            className={flexLayout({ direction: "row", justify: "center", align: "center", gap: 2 })}
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
          className={tableCell({ align: "center", size: "md", variant: "default" })}
          aria-live="polite"
        >
          <div
            className={flexLayout({ direction: "row", justify: "center", align: "center", gap: 2 })}
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
          className={tableCell({ align: "center", size: "lg", variant: "empty" })}
        >
          <div
            className={flexLayout({ direction: "row", justify: "center", align: "center", gap: 2 })}
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
            className={loadingOverlay()}
            data-testid="table-fetching-overlay"
          >
            <div className={cn(
              "px-4 py-2 rounded-lg bg-background dark:bg-surface-dark shadow-lg border border-neutral/20 dark:border-neutral-600/30",
              flexLayout({ align: "center", gap: 2 })
            )}>
              <Spinner size="sm" />
              <span className={captionProfessional({ size: "sm", variant: "default" })}>
                Se actualizează...
              </span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table
            className={simpleTable()}
            data-testid="transaction-table"
          >
            <thead>
              <tr className="border-b border-neutral/20 dark:border-neutral-600/30">
                <th
                  className={tableHeader({ align: "left", size: "md" })}
                  data-testid="header-date"
                >
                  {TABLE.HEADERS.DATE}
                </th>
                <th
                  className={tableHeader({ align: "left", size: "md" })}
                  data-testid="header-description"
                >
                  {TABLE.HEADERS.DESCRIPTION}
                </th>
                <th
                  className={tableHeader({ align: "left", size: "md" })}
                  data-testid="header-amount"
                >
                  {TABLE.HEADERS.AMOUNT}
                </th>
                <th
                  className={tableHeader({ align: "left", size: "md" })}
                  data-testid="header-category"
                >
                  {TABLE.HEADERS.CATEGORY}
                </th>
                <th
                  className={tableHeader({ align: "left", size: "md" })}
                  data-testid="header-subcategory"
                >
                  {TABLE.HEADERS.SUBCATEGORY}
                </th>
                <th
                  className={tableHeader({ align: "left", size: "md" })}
                  data-testid="header-recurring"
                >
                  {TABLE.HEADERS.RECURRING}
                </th>
                <th
                  className={tableHeader({ align: "left", size: "md" })}
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
                        className={hoverBackground({ variant: "subtle" })}
                        data-testid={`transaction-item-${t.id || idx}`}
                      >
                        <td className={tableCell({ align: "left", size: "md", variant: "default" })}>
                          {formatDate(t.date)}
                        </td>
                        <td className={tableCell({ align: "left", size: "md", variant: "default" })}>
                          {t.description || ""}
                        </td>
                        <td
                          className={tableCell({ align: "left", size: "md", variant: "default" })}
                          style={getAmountStyles(t.amount, t.type)}
                          data-testid={`amount-${idx}`}
                        >
                          <span className={fontFinancial({ weight: "medium", size: "base" })}>
                            {formatAmount(t.amount)}
                          </span>
                        </td>
                        <td className={tableCell({ align: "left", size: "md", variant: "default" })}>
                          {t.category || ""}
                        </td>
                        <td className={tableCell({ align: "left", size: "md", variant: "default" })}>
                          {t.subcategory || ""}
                        </td>
                        <td className={tableCell({ align: "left", size: "md", variant: "default" })}>
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
                        <td className={tableCell({ align: "left", size: "md", variant: "default" })}>
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
            "border-t border-neutral/20 dark:border-neutral-600/30",
            spacingMargin({ y: 4 }),
            flexLayout({ direction: "row", justify: "between", align: "center" })
          )}
          aria-live="polite"
        >
          <span className={captionProfessional({ size: "sm", variant: "muted" })}>
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
        className={cn("h-5", spacingMargin({ y: 3 }))}
        aria-hidden="true"
      />
    </div>
  );
};

export default React.memo(TransactionTable);
