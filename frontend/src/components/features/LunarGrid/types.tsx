import { TransactionType } from "@budget-app/shared-constants/enums";
import { TransactionValidated } from "@budget-app/shared-constants/transaction.schema";
import { ColumnDef, Row, Table, Column } from "@tanstack/react-table";
import { ReactNode } from "react";

/**
 * Rezultatul returnat de hook-ul useLunarGridTable
 */
import { TransformedTableDataRow } from "./tableTypes";

/**
 * Definirea tipurilor pentru LunarGrid cu TanStack Table
 * Aceste tipuri sunt folosite în hook-ul useLunarGridTable și componente
 */

/**
 * Structura de bază pentru datele de rând în TanStack Table
 * Folosită pentru a reprezenta atât rândurile de categorie, cât și cele de subcategorie
 */
export interface LunarGridRowData {
  /** ID unic pentru rând */
  id: string;

  /** Numele categoriei */
  category: string;

  /** Numele subcategoriei (doar pentru rândurile de subcategorie) */
  subcategory?: string;

  /** Dacă rândul reprezintă o categorie (true) sau o subcategorie (false) */
  isCategory: boolean;

  /** Dacă categoria este expandată (se aplică doar rândurilor de categorie) */
  isExpanded?: boolean;

  /** Sumele zilnice pentru acest rând, mapate după zi {1: suma, 2: suma, ...} */
  dailyAmounts: Record<number, number>;

  /** Lista de tranzacții asociate acestui rând */
  transactions: TransactionValidated[];

  /** Totalul sumelor zilnice (calculat automat) */
  total?: number;
}

/**
 * Extensie a definiției de coloană TanStack Table cu informații specifice zilei
 */
export type DayColumnDef = ColumnDef<LunarGridRowData> & {
  /** Ziua lunii asociată acestei coloane */
  day: number;

  /** Dacă coloana reprezintă o zi din weekend */
  isWeekend?: boolean;

  /** Data completă (opțional) */
  date?: Date;
};

/**
 * Configurație pentru rândurile de categorie
 */
export interface CategoryRow {
  /** Cheia unică a categoriei */
  categoryKey: string;

  /** Dacă categoria este expandată */
  isExpanded: boolean;

  /** Lista de subcategorii */
  subcategories: Array<{
    name: string;
    isCustom: boolean;
  }>;

  /** Sumele zilnice pentru această categorie */
  dailySums: Record<number, number>;

  /** Totalul sumelor zilnice */
  total?: number;
}

/**
 * Configurație pentru rândurile de subcategorie
 */
export interface SubcategoryRow {
  /** Cheia unică a subcategoriei */
  subcategoryKey: string;

  /** Cheia categoriei părinte */
  categoryKey: string;

  /** Dacă subcategoria este personalizată */
  isCustom: boolean;

  /** Sumele zilnice pentru această subcategorie */
  dailySums: Record<number, number>;

  /** Totalul sumelor zilnice */
  total?: number;
}



/**
 * Starea pentru editarea ștergerii subcategoriilor
 */
export interface SubcategoryEditState {
  /** Numele categoriei */
  category: string;

  /** Numele subcategoriei */
  subcategory: string;

  /** Modul de editare: 'edit' sau 'delete' */
  mode: "edit" | "delete";
}

// Props pentru hook-ul useLunarGridTable
export interface UseLunarGridTableOptions {
  year: number;
  month: number;
  transactions: TransactionValidated[];
  expandedCategories: Record<string, boolean>;
  formatCurrencyForGrid: (amount: number) => string;
  getBalanceStyle: (amount: number) => string;
  getTransactionTypeForCategory: (category: string) => TransactionType;
  onToggleCategory: (category: string) => void;
  onCellClick: (
    e: React.MouseEvent<HTMLTableCellElement>,
    category: string,
    subcategory: string,
    day: number,
    amount: string,
    type: string,
  ) => void;
  onCellDoubleClick?: (
    e: React.MouseEvent<HTMLTableCellElement>,
    category: string,
    subcategory: string,
    day: number,
    currentAmount: string,
  ) => void;
} // Importăm tipul din hook

export interface UseLunarGridTableResult {
  /** Instanța de tabel TanStack */
  table: Table<TransformedTableDataRow>; // Tipare mai specifică pentru tabel

  /** Coloanele tabelului, acum bazate pe TransformedTableDataRow */
  columns: ColumnDef<TransformedTableDataRow>[];

  /** Zilele lunii */
  days: number[];

  /** Referință către container-ul de tabel */
  tableContainerRef: React.RefObject<HTMLDivElement>;

  /** Soldurile zilnice */
  dailyBalances: Record<number, number>;

  /** Starea de încărcare a datelor (din React Query) */
  isLoading: boolean;

  /** Obiectul eroare în cazul unui eșec la fetch (din React Query) */
  error: Error | null;

  // getSumForCell a fost eliminat din hook
  // updateTableData a fost eliminat din hook (reactivitate prin store)
  // data nu mai este returnat explicit, este în table.options.data
}

/**
 * Props pentru funcția de randare personalizată a celulelor
 */
export type CellRendererProps = {
  /** Valoarea celulei */
  value: string | number | null | undefined;

  /** Rândul curent */
  row: Row<LunarGridRowData>;

  /** Coloana curentă */
  column: Column<LunarGridRowData, unknown>;

  /** Funcție pentru actualizarea valorii */
  updateData: (rowIndex: number, columnId: string, value: string | number) => void;

  /** Proprietăți suplimentare pentru renderer-ul de celulă */
  cellProps?: Record<string, unknown>;
};

/**
 * Configurație pentru coloanele tabelului
 */
export interface ColumnConfig {
  /** ID-ul coloanei */
  id: string;

  /** Header-ul coloanei */
  header: string | ((info: { column: Column<LunarGridRowData, unknown> }) => ReactNode);

  /** Accesorul datelor */
  accessorKey?: string;

  /** Dacă este o coloană de zi */
  isDayColumn?: boolean;

  /** Ziua (pentru coloanele de zi) */
  day?: number;

  /** Dacă este o zi din weekend */
  isWeekend?: boolean;

  /** Funcție de randare personalizată */
  cell?: (props: CellRendererProps) => ReactNode;
}

// Props pentru componenta TanStackSubcategoryRows
export interface TanStackSubcategoryRowsProps {
  categoryKey: string;
  subcategories: Array<{
    name: string;
    isCustom: boolean;
  }>;
  days: number[];
  transactions: TransactionValidated[];
  formatCurrencyForGrid: (amount: number) => string;
  getBalanceStyle: (amount: number) => string;
  getSumForCell: (category: string, subcategory: string, day: number) => number;
  handleCellClick: (
    e: React.MouseEvent<HTMLTableCellElement>,
    category: string,
    subcategory: string,
    day: number,
    amount: string,
    type: string,
  ) => void;
  handleCellDoubleClick?: (
    e: React.MouseEvent<HTMLTableCellElement>,
    category: string,
    subcategory: string,
    day: number,
    currentAmount: string,
  ) => void;
  handleEditSubcategory?: (
    category: string,
    subcategory: string,
    mode?: "edit" | "delete",
  ) => void;
  handleDeleteSubcategory?: (category: string, subcategory: string) => void;
  isCustomSubcategory: (category: string, subcategory: string) => boolean;
  getTransactionTypeForCategory: (category: string) => TransactionType;

  /** Opțiuni suplimentare pentru configurarea afișării */
  options?: {
    /** Dacă se afișează coloana cu acțiuni */
    showActions?: boolean;

    /** Dacă se permit modificări */
    isEditable?: boolean;

    /** Stiluri personalizate */
    styles?: {
      /** Stil pentru celulele cu sume pozitive */
      positiveAmount?: string;

      /** Stil pentru celulele cu sume negative */
      negativeAmount?: string;

      /** Stil pentru celulele cu sume zero */
      zeroAmount?: string;
    };
  };
}
