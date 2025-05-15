import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  createColumnHelper,
  Table,
} from '@tanstack/react-table';
import { TransactionValidated } from '@shared-constants/transaction.schema';
import { TransactionType } from '@shared-constants/enums';
import { EXCEL_GRID } from '@shared-constants/ui';
import { CategoryRow, UseLunarGridTableOptions, UseLunarGridTableResult } from '../types';

/**
 * Hook custom pentru managementul tabelului lunar cu TanStack Table
 */
export function useLunarGridTable({
  year,
  month,
  transactions,
  expandedCategories,
  formatCurrency,
  getBalanceStyle,
  getTransactionTypeForCategory,
  onToggleCategory,
  onCellClick,
  onCellDoubleClick,
}: UseLunarGridTableOptions): UseLunarGridTableResult {
  // Generăm zilele din lună
  const days = useMemo(() => {
    const date = new Date(year, month, 0);
    return Array.from({ length: date.getDate() }, (_, i) => i + 1);
  }, [year, month]);

  // Helper pentru calcularea sumei pentru o celulă (categorie, subcategorie, zi)
  const getSumForCell = useMemo(() => {
    return (category: string, subcategory: string, day: number): number => {
      return transactions.reduce((sum, transaction) => {
        const transactionDate = new Date(transaction.date);
        const transactionDay = transactionDate.getDate();
        const transactionMonth = transactionDate.getMonth() + 1;
        const transactionYear = transactionDate.getFullYear();

        if (
          transactionYear === year &&
          transactionMonth === month &&
          transactionDay === day &&
          transaction.category === category &&
          transaction.subcategory === subcategory
        ) {
          return sum + transaction.amount;
        }
        return sum;
      }, 0);
    };
  }, [transactions, year, month]);

  // Helper pentru calcularea soldului zilnic
  const calculateDailyBalance = useMemo(() => {
    return (day: number): number => {
      return transactions.reduce((balance, transaction) => {
        const transactionDate = new Date(transaction.date);
        const transactionDay = transactionDate.getDate();
        const transactionMonth = transactionDate.getMonth() + 1;
        const transactionYear = transactionDate.getFullYear();

        if (
          transactionYear === year &&
          transactionMonth === month &&
          transactionDay === day
        ) {
          return balance + transaction.amount;
        }
        return balance;
      }, 0);
    };
  }, [transactions, year, month]);

  // Calculează soldurile zilnice
  const dailyBalances = useMemo(() => {
    const balances: Record<number, number> = {};
    days.forEach(day => {
      balances[day] = calculateDailyBalance(day);
    });
    return balances;
  }, [days, calculateDailyBalance]);

  // Pregătim datele pentru tabel - categorii și solduri
  const tableData = useMemo(() => {
    // Vom construi datele pentru tabel în format categorie + subcategorii
    const data: CategoryRow[] = [];
    
    // Folosim Set pentru a aduna categoriile unice din tranzacții
    const uniqueCategories = new Set<string>();
    transactions.forEach(t => uniqueCategories.add(t.category));
    
    // Pentru fiecare categorie, calculăm sumele zilnice
    Array.from(uniqueCategories).sort().forEach(categoryKey => {
      const categoryRow: CategoryRow = {
        categoryKey,
        isExpanded: !!expandedCategories[categoryKey],
        subcategories: [],
        dailySums: {},
      };
      
      // Calculăm sumele pentru fiecare zi
      days.forEach(day => {
        let totalForDay = 0;
        
        // Subcategorii unice pentru această categorie
        const subcats = new Set<string>();
        
        // Pentru fiecare tranzacție din această categorie, adunăm sumele și colectăm subcategoriile
        transactions.forEach(t => {
          if (t.category === categoryKey) {
            subcats.add(t.subcategory);
            
            const transactionDate = new Date(t.date);
            const tDay = transactionDate.getDate();
            const tMonth = transactionDate.getMonth() + 1;
            const tYear = transactionDate.getFullYear();
            
            if (tYear === year && tMonth === month && tDay === day) {
              totalForDay += t.amount;
            }
          }
        });
        
        categoryRow.dailySums[day] = totalForDay;
      });
      
      // Adăugăm subcategoriile sortate
      categoryRow.subcategories = Array.from(new Set(
        transactions
          .filter(t => t.category === categoryKey)
          .map(t => t.subcategory)
      ))
        .sort()
        .map(subName => ({
          name: subName,
          isCustom: false, // Aici ar trebui adăugată logica pentru a determina dacă este customizată
        }));
      
      data.push(categoryRow);
    });
    
    return data;
  }, [transactions, days, expandedCategories, year, month]);

  // Generăm coloanele folosind columnHelper
  const columnHelper = createColumnHelper<CategoryRow>();
  
  const columns = useMemo(() => {
    const cols: ColumnDef<CategoryRow>[] = [
      // Coloană pentru numele categoriei (statică în stânga)
      columnHelper.accessor('categoryKey', {
        id: 'categoryKey',
        header: () => EXCEL_GRID.HEADERS.CATEGORY,
        cell: ({ row, getValue }) => {
          const categoryKey = getValue();
          const isExpanded = row.original.isExpanded;
          
          // Returnăm doar textul pentru celulă, styling-ul real va fi în componenta principală
          return categoryKey;
        },
      }),
      
      // Coloane dinamice pentru fiecare zi a lunii
      ...days.map(day => 
        columnHelper.accessor(
          row => row.dailySums[day] || 0, 
          {
            id: `day-${day}`,
            header: () => day.toString(),
            cell: info => {
              const value = info.getValue();
              const categoryKey = info.row.original.categoryKey;
              
              // Returnăm doar valoarea, styling-ul real va fi în componenta principală
              return value !== 0 ? formatCurrency(value) : '—';
            },
          }
        )
      ),
    ];
    
    return cols;
  }, [columnHelper, days, getBalanceStyle, formatCurrency, onToggleCategory]);

  // Creăm instanța tabelului
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row: CategoryRow) => {
      // Dacă rândul este expandat, returnăm subcategoriile ca rânduri
      if (row.isExpanded) {
        return row.subcategories.map(subcat => {
          const subCatData = {
            subcategoryKey: subcat.name,
            categoryKey: row.categoryKey,
            isCustom: subcat.isCustom,
            dailySums: {} as Record<number, number>,
          };
          
          // Calculează sumele pentru subcategorie pe fiecare zi
          days.forEach(day => {
            subCatData.dailySums[day] = getSumForCell(row.categoryKey, subcat.name, day);
          });
          
          return subCatData;
        });
      }
      return [];
    },
  }) as Table<CategoryRow>;

  return {
    table,
    days,
    dailyBalances,
    getSumForCell,
  };
}
