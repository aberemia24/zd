import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { useMemo, useRef } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Import DOAR tipuri și constante existente
import { TransactionValidated } from '@shared-constants/transaction.schema';
import { EXCEL_GRID } from '@shared-constants';
import type { LunarGridRowData, DayColumnDef } from '../types';

/**
 * Hook pentru gestionarea datelor și stării pentru LunarGrid bazat pe TanStack Table
 * Abstractizează logica de procesare a datelor și construcția tabelului
 * 
 * @param transactions - Tranzacțiile pentru perioada selectată
 * @param categories - Categoriile și subcategoriile disponibile
 * @param expandedCategories - Stare pentru categoriile expandate/colapsate
 * @param year - Anul selectat 
 * @param month - Luna selectată (1-12)
 * @param onCellClick - Callback pentru click pe celulă (editare tranzacție)
 * @param onCellDoubleClick - Callback pentru dublu-click pe celulă (editare rapidă)
 */
export function useLunarGridTable(
  transactions: TransactionValidated[],
  categories: { name: string; subcategories: { name: string }[] }[],
  expandedCategories: Record<string, boolean>,
  year: number,
  month: number,
  // Callbacks pentru funcții care trebuie implementate în componenta principală
  onCellClick?: (e: React.MouseEvent, category: string, subcategory: string, day: number, amount: string, type: string) => void,
  onCellDoubleClick?: (e: React.MouseEvent, category: string, subcategory: string, day: number, amount: string) => void
) {
  // Referință pentru container (necesar pentru virtualizare)
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  // Generarea coloanelor folosind DOAR constante existente
  const columns = useMemo(() => {
    // Calcul zile în lună - metodă standard JavaScript
    const days = new Date(year, month, 0).getDate();
    
    // Coloana pentru categorie - header din constante
    const categoryColumn = {
      id: 'category',
      header: EXCEL_GRID.HEADERS.LUNA, // Folosim EXACT constanta definită
      accessorFn: (row: LunarGridRowData) => row.isCategory ? row.category : row.subcategory,
      cell: ({ row, getValue }: any) => {
        // Implementare celule
        const value = getValue() as string;
        const isCategory = row.original.isCategory;
        
        return (
          <div className="flex items-center">
            {isCategory ? (
              <>
                {expandedCategories[row.original.category] ? (
                  <ChevronDown 
                    size={16} 
                    className="mr-1"
                    data-testid={`expand-btn-${row.original.category}`}
                  />
                ) : (
                  <ChevronRight 
                    size={16} 
                    className="mr-1"
                    data-testid={`expand-btn-${row.original.category}`}
                  />
                )}
                <span className="font-semibold">{value}</span>
              </>
            ) : (
              <div className="flex items-center space-x-2 pl-8">
                <div className="w-4 h-0 border-t border-secondary-400 mr-2" />
                <span>{value}</span>
              </div>
            )}
          </div>
        );
      },
      size: 200,
    };
    
    // Coloane pentru zilele lunii
    const dayColumns: DayColumnDef[] = Array.from({ length: days }, (_, i) => {
      const day = i + 1;
      return {
        id: `day-${day}`,
        day,
        header: String(day),
        accessorFn: (row: LunarGridRowData) => row.dailyAmounts[day] || 0,
        cell: ({ getValue, row }: any) => {
          const value = getValue() as number;
          const colorClass = value > 0 
            ? 'text-success-600 font-medium' 
            : value < 0 
              ? 'text-error-600 font-medium' 
              : 'text-secondary-400';
              
          return (
            <div
              className={`text-right ${colorClass}`}
              data-testid={`cell-${row.original.category}-${row.original.subcategory || 'category'}-${day}`}
              onClick={(e) => {
                // Doar pentru subcategorii sau categorii non-SOLD
                if (!row.original.isCategory || (row.original.isCategory && row.original.category !== EXCEL_GRID.HEADERS.SOLD)) {
                  const amount = value !== 0 ? Math.abs(value).toString() : '';
                  // Folosim callback-ul pasat prin props, NU referințe directe la funcții
                  onCellClick?.(
                    e,
                    row.original.category,
                    row.original.subcategory || '',
                    day,
                    amount,
                    ''
                  );
                }
              }}
              onDoubleClick={(e) => {
                // Doar pentru subcategorii sau categorii non-SOLD
                if (!row.original.isCategory || (row.original.isCategory && row.original.category !== EXCEL_GRID.HEADERS.SOLD)) {
                  const amount = value !== 0 ? Math.abs(value).toString() : '';
                  // Folosim callback-ul pasat prin props, NU referințe directe la funcții
                  onCellDoubleClick?.(
                    e,
                    row.original.category,
                    row.original.subcategory || '',
                    day,
                    amount
                  );
                }
              }}
            >
              {value !== 0 
               ? value.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
               : '—'}
            </div>
          );
        },
        size: 80,
      };
    });
    
    return [categoryColumn, ...dayColumns];
  }, [year, month, expandedCategories, onCellClick, onCellDoubleClick]);
  
  // Transformarea datelor pentru tabel
  const data = useMemo(() => {
    // Array pentru stocarea rândurilor procesate
    const rows: LunarGridRowData[] = [];
    
    // Proces de grupare și calcul sume pe categorii și subcategorii
    categories.forEach(category => {
      // Tranzacțiile pentru această categorie
      const categoryTransactions = transactions.filter(
        t => t.category === category.name
      );
      
      // Calculul sumelor zilnice pentru întreaga categorie
      const dailyAmounts: Record<number, number> = {};
      categoryTransactions.forEach(t => {
        const day = new Date(t.date).getDate();
        dailyAmounts[day] = (dailyAmounts[day] || 0) + t.amount;
      });
      
      // Adăugare rând categorie
      rows.push({
        id: `category-${category.name}`,
        category: category.name,
        isCategory: true,
        isExpanded: expandedCategories[category.name],
        dailyAmounts,
        transactions: categoryTransactions
      });
      
      // Adăugare rânduri subcategorii dacă categoria este expandată
      if (expandedCategories[category.name]) {
        category.subcategories.forEach(subcategory => {
          // Tranzacțiile pentru această subcategorie
          const subcategoryTransactions = categoryTransactions.filter(
            t => t.subcategory === subcategory.name
          );
          
          // Calculul sumelor zilnice pentru subcategorie
          const subcatDailyAmounts: Record<number, number> = {};
          subcategoryTransactions.forEach(t => {
            const day = new Date(t.date).getDate();
            subcatDailyAmounts[day] = (subcatDailyAmounts[day] || 0) + t.amount;
          });
          
          // Adăugare rând subcategorie
          rows.push({
            id: `subcategory-${category.name}-${subcategory.name}`,
            category: category.name,
            subcategory: subcategory.name,
            isCategory: false,
            dailyAmounts: subcatDailyAmounts,
            transactions: subcategoryTransactions
          });
        });
      }
    });
    
    // Calculul soldului zilnic
    const dailyBalances: Record<number, number> = {};
    const days = new Date(year, month, 0).getDate();
    
    // Procesăm toate tranzacțiile pentru a calcula soldurile zilnice
    transactions.forEach(t => {
      const day = new Date(t.date).getDate();
      dailyBalances[day] = (dailyBalances[day] || 0) + t.amount;
    });
    
    // Adăugare rând SOLD
    const soldRow: LunarGridRowData = {
      id: 'balance-row',
      category: EXCEL_GRID.HEADERS.SOLD,
      isCategory: true,
      dailyAmounts: dailyBalances,
      transactions: []
    };
    
    // Adăugăm rândul de sold la final
    rows.push(soldRow);
    
    return rows;
  }, [transactions, categories, expandedCategories, year, month]);
  
  // Inițializare tabel TanStack
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  
  // Calculul zilelor din lună pentru utilizare externă
  const days = useMemo(
    () => Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1),
    [year, month]
  );
  
  // Funcție utilitar pentru obținerea sumei unei celule specifice
  const getSumForCell = (category: string, subcategory: string, day: number): number => {
    const row = data.find(r => 
      r.category === category && 
      (subcategory ? r.subcategory === subcategory : r.isCategory)
    );
    
    return row ? row.dailyAmounts[day] || 0 : 0;
  };
  
  // Calculul soldurilor zilnice pentru afișare
  const dailyBalances = useMemo(() => {
    const balances: Record<number, number> = {};
    const balanceRow = data.find(r => r.category === EXCEL_GRID.HEADERS.SOLD);
    
    if (balanceRow) {
      Object.assign(balances, balanceRow.dailyAmounts);
    }
    
    return balances;
  }, [data]);
  
  // Returnăm toate datele și funcțiile necesare pentru componenta principală
  return {
    table,
    data,
    columns,
    days,
    tableContainerRef,
    dailyBalances,
    getSumForCell
  };
}
