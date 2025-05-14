// LunarGrid.tsx - Începutul refactorizării

// PAS 1: Adăugare importuri TanStack Table și definire tipuri de bază

import React, { useState, useMemo, useCallback } from 'react'; // Am adăugat useMemo, useCallback
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel, // Pentru expandare
  getGroupedRowModel, // Poate util pentru gruparea categoriilor
  ColumnDef, // Pentru definirea coloanelor
  flexRender, // Pentru randarea headerelor și celulelor
  // Row, // Dacă e nevoie de tipul Row explicit
  // Table, // Dacă e nevoie de tipul Table explicit
} from '@tanstack/react-table';

import { useTransactionStore } from '../../../stores/transactionStore';
import { useAuthStore } from '../../../stores/authStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import { TransactionType, TransactionStatus, FrequencyType, Category } from '@shared-constants/enums'; // Am adăugat Category
import { TransactionValidated } from '@shared-constants/transaction.schema';
import { EXCEL_GRID, UI as SHARED_UI_TEXTS } from '@shared-constants/ui'; // Redenumit UI pentru a evita conflictul local
import { ChevronDown, ChevronRight, Edit, Trash2 } from 'lucide-react'; // Am adăugat Edit, Trash2
// import { SubcategoryRows } from './SubcategoryRows'; // Aceasta va fi eliminată

// Definim tipurile pentru zilele afișate în grid
export interface DisplayedDay {
  date: Date; // Data completă
  dayOfMonth: number; // Numărul zilei (1-31)
  isCurrentMonth: boolean;
  isPreviousMonth: boolean;
  isNextMonth: boolean;
  label: string; // Eticheta afișată în header (ex: "28", "1")
  id: string; // Un ID unic, ex: "2024-12-25"
}

// Definim tipurile pentru rândurile din tabel
// Un rând poate fi o categorie principală (colapsată sau expandată) sau o subcategorie
export type LunarGridRowType = 'CATEGORY_COLLAPSED' | 'CATEGORY_EXPANDED_HEADER' | 'SUBCATEGORY' | 'ADD_SUBCATEGORY_BUTTON' | 'ADD_SUBCATEGORY_FORM';

export interface BaseLunarGridRow {
  id: string; // ID unic pentru rând (ex: "VENITURI", "VENITURI.Salariu")
  rowType: LunarGridRowType;
  name: string; // Numele afișat (ex: "VENITURI", "  Salariu")
  depth: number; // Pentru indentare (0 pentru categorie, 1 pentru subcategorie)
  // Datele pentru fiecare zi; cheia este id-ul zilei (YYYY-MM-DD)
  dailyData?: { [dayId: string]: { sum: number; transactions: TransactionValidated[] } };
}

export interface CategoryHeaderRow extends BaseLunarGridRow {
  rowType: 'CATEGORY_EXPANDED_HEADER';
  isExpanded: true;
  categoryName: string; // Numele original al categoriei
}

export interface CategoryCollapsedRow extends BaseLunarGridRow {
  rowType: 'CATEGORY_COLLAPSED';
  isExpanded: false;
  categoryName: string; // Numele original al categoriei
  // dailyData va conține sumele agregate pentru categorie
}

export interface SubcategoryRow extends BaseLunarGridRow {
  rowType: 'SUBCATEGORY';
  parentCategoryName: string; // Numele categoriei părinte
  isCustom: boolean;
  // dailyData va conține sumele specifice subcategoriei
}

// Tipul combinat pentru rândurile din tabel
export type LunarGridRowData = CategoryHeaderRow | CategoryCollapsedRow | SubcategoryRow;


// Funcție helper pentru a obține zilele din lună (existentă, o păstrăm)
const getDaysInMonthArray = (year: number, month: number): number[] => {
  const date = new Date(year, month, 0);
  return Array.from({ length: date.getDate() }, (_, i) => i + 1);
};

// NOU: Funcție helper pentru a genera array-ul de DisplayedDay objects
// Aceasta va include zile din luna anterioară, curentă și următoare, similar cu logica din useMonthlyTransactions
const getDisplayedDays = (year: number, month: number): DisplayedDay[] => {
  const displayedDays: DisplayedDay[] = [];
  const daysInCurrentMonth = new Date(year, month, 0).getDate();

  // Zile din luna anterioară (ultimele 6 zile)
  const prevMonthDate = new Date(year, month - 1, 0); // Ultimul zi din luna anterioară datei curente
  const prevMonthYear = prevMonthDate.getFullYear();
  const prevMonth = prevMonthDate.getMonth() + 1; // getMonth() e 0-indexed
  const daysInPrevMonth = prevMonthDate.getDate();

  for (let i = 5; i >= 0; i--) { // Ultimele 6 zile
    const day = daysInPrevMonth - i;
    if (day > 0) { // Asigură-te că nu mergem prea în urmă pentru luni scurte
      const date = new Date(prevMonthYear, prevMonth - 1, day);
      displayedDays.push({
        date,
        dayOfMonth: day,
        isCurrentMonth: false,
        isPreviousMonth: true,
        isNextMonth: false,
        label: String(day),
        id: `${prevMonthYear}-${String(prevMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      });
    }
  }

  // Zile din luna curentă
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const date = new Date(year, month - 1, day);
    displayedDays.push({
      date,
      dayOfMonth: day,
      isCurrentMonth: true,
      isPreviousMonth: false,
      isNextMonth: false,
      label: String(day),
      id: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    });
  }

  // Zile din luna următoare (primele 6 zile)
  // Trebuie să ne asigurăm că avem suficiente zile pentru a umple până la un total de ~42-43 de coloane dacă e necesar,
  // sau un număr fix (ex: 6)
  const nextMonthDate = new Date(year, month, 1); // Prima zi din luna următoare
  const nextMonthYear = nextMonthDate.getFullYear();
  const nextMonth = nextMonthDate.getMonth() + 1;

  for (let day = 1; day <= 6; day++) {
    const date = new Date(nextMonthYear, nextMonth - 1, day);
    displayedDays.push({
      date,
      dayOfMonth: day,
      isCurrentMonth: false,
      isPreviousMonth: false,
      isNextMonth: true,
      label: String(day),
      id: `${nextMonthYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    });
  }
  // De ajustat numărul de zile din lunile adiacente dacă vrem un număr fix de coloane,
  // de ex. pentru a umple un grid de 7 zile * 6 săptămâni = 42 coloane.
  // Pentru moment, luăm 6 dinainte și 6 de după.
  // Logica actuală din [useMonthlyTransactions](cci:1://file:///c:/windsurf%20repo/budget-app/frontend/src/components/features/LunarGrid/LunarGrid.tsx:16:0-98:1) filtrează tranzacțiile pentru ultimele 6 zile din luna anterioară
  // și primele 6 din luna următoare. Vom alinia `getDisplayedDays` la aceasta.

  // Refined logic for adjacent days to match useMonthlyTransactions
  const refinedDisplayedDays: DisplayedDay[] = [];
  const firstDayOfCurrentMonth = new Date(year, month - 1, 1);

  // Add 6 days from previous month
  for (let i = 6; i > 0; i--) {
    const d = new Date(firstDayOfCurrentMonth);
    d.setDate(d.getDate() - i);
    refinedDisplayedDays.push({
      date: d,
      dayOfMonth: d.getDate(),
      isCurrentMonth: false,
      isPreviousMonth: true,
      isNextMonth: false,
      label: String(d.getDate()),
      id: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    });
  }

  // Add days of current month
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const d = new Date(year, month - 1, day);
    refinedDisplayedDays.push({
      date: d,
      dayOfMonth: d.getDate(),
      isCurrentMonth: true,
      isPreviousMonth: false,
      isNextMonth: false,
      label: String(d.getDate()),
      id: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    });
  }
  
  // Add 6 days from next month
  const lastDayOfCurrentMonth = new Date(year, month -1, daysInCurrentMonth);
   for (let i = 1; i <= 6; i++) {
    const d = new Date(lastDayOfCurrentMonth);
    d.setDate(d.getDate() + i);
     refinedDisplayedDays.push({
      date: d,
      dayOfMonth: d.getDate(),
      isCurrentMonth: false,
      isPreviousMonth: false,
      isNextMonth: true,
      label: String(d.getDate()),
      id: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    });
  }
  
  return refinedDisplayedDays;
};


// ... restul hook-urilor și funcțiilor existente (getSumForCell, getCategorySumForDay etc.)

// Hook pentru încărcarea tranzacțiilor (existent, pare OK)
function useMonthlyTransactions(year: number, month: number) {
  // ... implementarea existentă ...
  // Asigură-te că `transactions` returnate sunt corect filtrate pentru `displayedDays`
  // sau că `displayedDays` se aliniază cu perioada filtrată de hook.
  // Momentan, hook-ul filtrează deja corect (+/- 6 zile), deci `getDisplayedDays` trebuie să reflecte asta.
  const transactionStore = useTransactionStore();
  const paramsRef = React.useRef({ year, month });

  React.useEffect(() => {
    if (paramsRef.current.year !== year || paramsRef.current.month !== month) {
      paramsRef.current = { year, month };
      transactionStore._invalidateMonthCache(year, month); // Consider making _invalidateMonthCache public if not already
    }
  }, [month, year, transactionStore]);

  const transactions = React.useMemo(() => {
    // Logica de filtrare existentă din useMonthlyTransactions este bună
    // Se bazează pe `transactionStore.transactions` care conține TOATE tranzacțiile încărcate (posibil din mai multe luni)
    // și le filtrează pentru luna curentă +/- zilele adiacente
    const currentMonthStart = new Date(year, month - 1, 1);
    const prevMonthLimit = new Date(currentMonthStart);
    prevMonthLimit.setDate(currentMonthStart.getDate() - 7); // Include ultimele 6 zile, deci mergem 7 zile înapoi

    const currentMonthEnd = new Date(year, month, 0);
    const nextMonthLimit = new Date(currentMonthEnd);
    nextMonthLimit.setDate(currentMonthEnd.getDate() + 7); // Include primele 6 zile, deci mergem 7 zile înainte

    return transactionStore.transactions.filter(t => {
      try {
        if (!t.date || typeof t.date !== 'string') return false;
        const d = new Date(t.date);
        if (isNaN(d.getTime())) return false;
        // Comparăm direct cu limitele, asigurându-ne că data tranzacției este în interval.
        // Timpul este setat la miezul nopții pentru a compara corect datele.
        d.setHours(0,0,0,0);
        const lowerBound = new Date(prevMonthLimit);
        lowerBound.setHours(0,0,0,0);
        const upperBound = new Date(nextMonthLimit);
        upperBound.setHours(0,0,0,0);

        return d >= lowerBound && d < upperBound;
      } catch (err) {
        console.error('Error filtering transaction in useMonthlyTransactions:', err, t);
        return false;
      }
    });
  }, [transactionStore.transactions, year, month]);

  return { transactions };
}


// ... (restul funcțiilor existente: getSumForCell, getCategorySumForDay, getCategoryTotalAllDays, calculateDailyBalance, formatCurrency)

export interface LunarGridProps {
  year: number;
  month: number;
}

const LOCALSTORAGE_CATEGORY_EXPAND_KEY = 'budget-app-category-expand';

// Am redenumit UI importat pentru a evita conflictul
// const UI = { ... }; // Definiția locală UI existentă este OK aici, o vom folosi


export const LunarGrid: React.FC<LunarGridProps> = ({ year, month }) => {
  // State-uri existente (editingSubcategory, expandedCategories, popover, addingCategory)
  // ... majoritatea vor fi păstrate ...

  const { categories: allCategoriesFromStore } = useCategoryStore(); // Renumit pentru claritate
  const daysOfMonthArray = getDaysInMonthArray(year, month); // Array de numere [1,2,...,31]
  const displayedDays = useMemo(() => getDisplayedDays(year, month), [year, month]); // Array de obiecte DisplayedDay

  const { transactions } = useMonthlyTransactions(year, month);

  // State pentru categorii expandate/colapsate (existent, OK)
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>(() => {
    // ... logica existentă ...
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_CATEGORY_EXPAND_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading expanded categories from localStorage:', error);
      return {};
    }
  });

  // Funcții expand/collapse (existente, OK)
  const expandAll = useCallback(() => {
    // ... logica existentă ...
    const newState: Record<string, boolean> = {};
    allCategoriesFromStore.forEach(c => { newState[c.name] = true; });
    setExpandedCategories(newState);
    try { localStorage.setItem(LOCALSTORAGE_CATEGORY_EXPAND_KEY, JSON.stringify(newState)); } catch {};
  }, [allCategoriesFromStore]);

  const collapseAll = useCallback(() => {
    // ... logica existentă ...
    const newState: Record<string, boolean> = {};
    allCategoriesFromStore.forEach(c => { newState[c.name] = false; });
    setExpandedCategories(newState);
    try { localStorage.setItem(LOCALSTORAGE_CATEGORY_EXPAND_KEY, JSON.stringify(newState)); } catch {};
  }, [allCategoriesFromStore]);
  
  const toggleCategory = useCallback((categoryName: string) => { // Am schimbat param din category în categoryName
    setExpandedCategories(prev => {
      const newState = { ...prev, [categoryName]: !prev[categoryName] };
      try {
        localStorage.setItem(LOCALSTORAGE_CATEGORY_EXPAND_KEY, JSON.stringify(newState));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      return newState;
    });
  }, []);


  // Calcul pentru sume totale pe categorii (existent, va fi folosit pentru CategoryCollapsedRow)
  const categoryTotals = useMemo(() => {
    const result: Record<string, Record<string, number>> = {}; // Cheia internă va fi day.id (YYYY-MM-DD)
    allCategoriesFromStore.forEach(category => {
      // getCategoryTotalAllDays trebuie adaptat să returneze un Record<string, number> unde cheia e day.id
      // și să folosească displayedDays pentru a ști ce zile să calculeze
      result[category.name] = {}; // Inițializare
      displayedDays.forEach(day => {
        const sumForDay = transactions
          .filter(t => t.category === category.name && new Date(t.date).toISOString().slice(0,10) === day.id)
          .reduce((acc, t) => {
            const amount = t.status === TransactionStatus.COMPLETED && typeof t.actualAmount === 'number'
              ? t.actualAmount
              : t.amount;
            return acc + (t.type === TransactionType.INCOME ? amount : -Math.abs(amount)); // Ajustare pentru venit/cheltuială
          }, 0);
        result[category.name][day.id] = sumForDay;
      });
    });
    return result;
  }, [transactions, allCategoriesFromStore, displayedDays]);

  // NOU: Pregătirea datelor pentru TanStack Table (`data` prop)
  const tableData = useMemo((): LunarGridRowData[] => {
    const rows: LunarGridRowData[] = [];
    allCategoriesFromStore.forEach(category => {
      const isExpanded = !!expandedCategories[category.name];
      if (isExpanded) {
        // Rândul de header pentru categoria expandată
        rows.push({
          id: category.name,
          rowType: 'CATEGORY_EXPANDED_HEADER',
          name: category.name,
          depth: 0,
          isExpanded: true,
          categoryName: category.name,
        });
        // Rânduri pentru fiecare subcategorie
        category.subcategories.forEach(subcat => {
          const subcategoryDailyData: { [dayId: string]: { sum: number; transactions: TransactionValidated[] } } = {};
          displayedDays.forEach(day => {
            const dayTransactions = transactions.filter(
              t => t.category === category.name && t.subcategory === subcat.name && new Date(t.date).toISOString().slice(0,10) === day.id
            );
            const sum = dayTransactions.reduce((acc, t) => {
               const amount = t.status === TransactionStatus.COMPLETED && typeof t.actualAmount === 'number' ? t.actualAmount : t.amount;
               // Aici suma trebuie să fie specifică tipului tranzacției, ex. pozitivă pentru venituri, negativă pentru cheltuieli
               // Pentru afișare, nu e neapărat nevoie să fie negativă, dar pentru calcule de sold da.
               // Momentan, pentru celulă, păstrăm suma absolută sau cum era calculată înainte.
               // Funcția [getSumForCell](cci:1://file:///c:/windsurf%20repo/budget-app/frontend/src/components/features/LunarGrid/LunarGrid.tsx:100:0-110:1) existentă ar trebui să facă asta corect.
               return acc + (t.type === TransactionType.INCOME ? amount : -Math.abs(amount));
            },0);
            subcategoryDailyData[day.id] = { sum, transactions: dayTransactions };
          });
          rows.push({
            id: `${category.name}.${subcat.name}`,
            rowType: 'SUBCATEGORY',
            name: subcat.name, // Va trebui indentată la randare
            depth: 1,
            parentCategoryName: category.name,
            isCustom: !!subcat.isCustom,
            dailyData: subcategoryDailyData,
          });
        });
      } else {
        // Rândul pentru categoria colapsată
        rows.push({
          id: category.name,
          rowType: 'CATEGORY_COLLAPSED',
          name: category.name,
          depth: 0,
          isExpanded: false,
          categoryName: category.name,
          dailyData: Object.fromEntries(
             displayedDays.map(day => [
              day.id,
              { sum: categoryTotals[category.name]?.[day.id] || 0, transactions: [] } // Tranzacțiile nu sunt necesare aici
            ])
          )
        });
      }
    });
    return rows;
  }, [allCategoriesFromStore, expandedCategories, transactions, displayedDays, categoryTotals]);

  // NOU: Definirea coloanelor pentru TanStack Table (`columns` prop)
  const tableColumns = useMemo((): ColumnDef<LunarGridRowData>[] => {
    const nameColumn: ColumnDef<LunarGridRowData> = {
      id: 'name',
      header: () => <div className="text-left">{SHARED_UI_TEXTS.EXCEL_GRID.HEADERS.LUNA}</div>, // Folosim SHARED_UI_TEXTS
      accessorKey: 'name', // Sau folosim accessorFn dacă e mai complex
      // width: 250, // Tanstack Table v8 nu mai are width direct, se face prin CSS sau getComputedSize
      meta: { // Custom meta data pentru stilizare sticky
        isSticky: true,
      },
      cell: ({ row }) => {
        const original = row.original;
        const indent = original.depth > 0 ? `pl-${original.depth * 4}` : ''; // Tailwind class for indentation
        
        if (original.rowType === 'CATEGORY_EXPANDED_HEADER' || original.rowType === 'CATEGORY_COLLAPSED') {
          return (
            <div 
              className={`flex items-center cursor-pointer ${indent}`}
              onClick={() => toggleCategory(original.categoryName)}
              data-testid={`category-toggle-${original.categoryName}`}
            >
              {original.isExpanded ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
              <span className="font-semibold">{original.name}</span>
            </div>
          );
        }
        // Pentru SUBCATEGORY
        return <div className={`flex items-center ${indent}`} data-testid={`subcategory-name-${original.id}`}>{original.name}</div>;
        // Aici vom adăuga ulterior butoane edit/delete pentru subcategorii
      },
    };

    const dayColumns: ColumnDef<LunarGridRowData>[] = displayedDays.map(day => ({
      id: day.id, // ex: "2024-12-25"
      header: () => <div className={`text-right ${!day.isCurrentMonth ? 'text-secondary-400' : ''}`}>{day.label}</div>,
      accessorFn: (row) => row.dailyData?.[day.id]?.sum,
      cell: ({ getValue, row }) => {
        const sum = getValue() as number | undefined ?? 0;
        // TODO: Adaugă handlerii de click/double-click
        // TODO: Adaugă popover logic // const { category, subcategory } = parseRowId(row.original.id); // Va fi nevoie de o funcție parseRowId return ( <div className={text-right ${getBalanceStyle(sum)}} // getBalanceStyle e funcția existentă data-testid={cell-${row.original.id}-${day.id}} // onClick={(e) => handleCellClick(e, category, subcategory, day.dayOfMonth, String(sum), '')} // Va trebui adaptat // onDoubleClick={(e) => handleCellDoubleClick(e, category, subcategory, day.dayOfMonth, String(sum))} // Va trebui adaptat > {sum !== 0 ? formatCurrency(sum) : '—'} {/* formatCurrency e funcția existentă */} ); }, }));

return [nameColumn, ...dayColumns];

}, [displayedDays, toggleCategory /*, alte dependințe pentru handleri */]);

// Calcul solduri zilnice (existent, dar adaptat pentru displayedDays) const dailyBalances = React.useMemo(() => { const balances: Record<string, number> = {}; // Cheia e day.id displayedDays.forEach(day => { // calculateDailyBalance trebuie adaptat să ia day.id sau data completă balances[day.id] = transactions .filter(t => new Date(t.date).toISOString().slice(0,10) === day.id) .reduce((acc, t) => { const amount = t.status === TransactionStatus.COMPLETED && typeof t.actualAmount === 'number' ? t.actualAmount : t.amount; return acc + (t.type === TransactionType.INCOME ? amount : -Math.abs(amount)); }, 0); }); return balances; }, [displayedDays, transactions]);

// NOU: Inițializare instanță tabel const table = useReactTable({ data: tableData, columns: tableColumns, getCoreRowModel: getCoreRowModel(), // getExpandedRowModel: getExpandedRowModel(), // Vom avea nevoie dacă folosim funcționalitatea nativă de expandare a TanStack Table // getGroupedRowModel: getGroupedRowModel(), // Similar // Alte opțiuni, ex: enableStickyHeader: true (nu e direct, se face prin CSS) });

// Stil CSS condiționat pentru solduri (existent, OK) const getBalanceStyle = (amount: number): string => { if (amount === 0) return 'text-secondary-400'; return amount > 0 ? 'text-success-600 font-medium' : 'text-error-600 font-medium'; };

// Formatare valută (existent, OK) const formatCurrency = (amount: number): string => { if (amount === 0) return 'RON 0.00'; return RON ${Math.abs(amount).toLocaleString('ro-RO', {       minimumFractionDigits: 2,       maximumFractionDigits: 2     })}; };

// ... restul handlerilor (handleCellClick, handleSavePopover etc.) vor fi adaptați ulterior // ... și state-urile (popover, editingSubcategory etc.)

return ( <React.Fragment> {SHARED_UI_TEXTS.EXPAND_ALL} {/* Folosim SHARED_UI_TEXTS /} {SHARED_UI_TEXTS.COLLAPSE_ALL} {/ Folosim SHARED_UI_TEXTS /} {/ NOU: Randare tabel TanStack /} {/ Sticky header /} {table.getHeaderGroups().map(headerGroup => ( {headerGroup.headers.map(header => ( <th key={header.id} className={px-4 py-2 ${(header.column.columnDef.meta as any)?.isSticky ? 'sticky left-0 z-20 bg-secondary-100' : ''}} style={{ minWidth: (header.column.columnDef.meta as any)?.isSticky ? 180 : 'auto' }} // Exemplu de min-width data-testid={header-${header.id}} > {header.isPlaceholder ? null : flexRender( header.column.columnDef.header, header.getContext() )} ))} ))} {table.getRowModel().rows.map(row => ( <tr key={row.id} className="group hover:bg-secondary-100 border-t border-secondary-200" data-testid={row-${row.original.id}} > {row.getVisibleCells().map(cell => ( <td key={cell.id} className={px-4 py-2 ${(cell.column.columnDef.meta as any)?.isSticky ? 'sticky left-0 z-10 group-hover:bg-secondary-100 bg-secondary-50' : ''}} // Asigură-te că background-ul se potrivește data-testid={cell-render-${cell.id}} > {flexRender(cell.column.columnDef.cell, cell.getContext())} ))} ))} {/ Sticky footer /} {/ Momentan, TanStack Table nu are o metodă directă getFooterGroups ca v7. Va trebui să construim manual rândul de footer pe baza dailyBalances. Sau, dacă adăugăm un footer la ColumnDef, putem itera table.getFooterGroups() dacă e disponibil. Pentru simplitate acum, îl construim manual. /} {SHARED_UI_TEXTS.EXCEL_GRID.HEADERS.SOLD} {displayedDays.map(day => ( <td key={footer-sold-${day.id}} className={px-4 py-2 text-right ${getBalanceStyle(dailyBalances[day.id] || 0)}} data-testid={sold-day-footer-${day.id}} > {formatCurrency(dailyBalances[day.id] || 0)} ))} {/ Aici vom adăuga logica pentru popover, care va fi poziționat absolut /} {/ {popover && <CellTransactionPopover ... />} */} </React.Fragment> ); };

export default LunarGrid;