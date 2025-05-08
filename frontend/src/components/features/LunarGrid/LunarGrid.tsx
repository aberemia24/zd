import React from 'react';
import { useTransactionStore } from '../../../stores/transactionStore';
import { CATEGORIES } from '@shared-constants/categories';
import { getCategoriesForTransactionType } from '@shared-constants/category-mapping';
import { TransactionType, TransactionStatus } from '@shared-constants/enums';
import { TransactionValidated } from '@shared-constants/transaction.schema';
import { EXCEL_GRID } from '@shared-constants/ui';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Helper pentru a genera array [1, 2, ..., n]
const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 0);
  return Array.from({ length: date.getDate() }, (_, i) => i + 1);
};

// Selector performant: tranzacțiile din luna/anu curent
function useMonthlyTransactions(year: number, month: number): TransactionValidated[] {
  const transactions = useTransactionStore(s => s.transactions);
  return React.useMemo(
    () => transactions.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    }),
    [transactions, year, month]
  );
}

// Agregare sumă pentru o zi, categorie, subcategorie
function getSumForCell(transactions: TransactionValidated[], category: string, subcategory: string, day: number) {
  return transactions
    .filter(t => t.category === category && t.subcategory === subcategory && new Date(t.date).getDate() === day)
    .reduce((acc, t) => {
      if (t.status === TransactionStatus.COMPLETED && typeof t.actualAmount === 'number') {
        return acc + t.actualAmount;
      }
      return acc + t.amount;
    }, 0);
}

// Calculează suma totală pentru o categorie întreagă în ziua respectivă
function getCategorySumForDay(transactions: TransactionValidated[], category: string, day: number): number {
  return transactions
    .filter(t => t.category === category && new Date(t.date).getDate() === day)
    .reduce((acc, t) => {
      const amount = t.status === TransactionStatus.COMPLETED && typeof t.actualAmount === 'number'
        ? t.actualAmount
        : t.amount;
      return acc + amount;
    }, 0);
}

// Calcul suma totală pentru o categorie, pe toate zilele - folosit pentru colapsare
function getCategoryTotalAllDays(transactions: TransactionValidated[], category: string): Record<number, number> {
  const result: Record<number, number> = {};
  
  transactions.forEach(t => {
    if (t.category === category) {
      const day = new Date(t.date).getDate();
      const amount = t.status === TransactionStatus.COMPLETED && typeof t.actualAmount === 'number'
        ? t.actualAmount
        : t.amount;
      result[day] = (result[day] || 0) + amount;
    }
  });
  
  return result;
}

// Calculează soldul zilnic - suma tuturor tranzacțiilor pentru o zi
function calculateDailyBalance(transactions: TransactionValidated[], day: number): number {
  return transactions
    .filter(t => new Date(t.date).getDate() === day)
    .reduce((acc, t) => {
      const amount = t.status === TransactionStatus.COMPLETED && typeof t.actualAmount === 'number'
        ? t.actualAmount
        : t.amount;

      // Pentru venituri adăugăm suma, pentru cheltuieli și economii scădem suma
      if (t.type === TransactionType.INCOME) {
        return acc + amount;
      } else {
        return acc - Math.abs(amount); // Asigurăm că scădem întotdeauna o valoare pozitivă
      }
    }, 0);
}

// Formatare valută pentru afișare (RON 0.00)
function formatCurrency(amount: number): string {
  if (amount === 0) return 'RON 0.00';
  
  return `RON ${Math.abs(amount).toLocaleString('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

// --- Componenta principală ---
export interface LunarGridProps {
  year: number;
  month: number;
}

// Constante pentru localStorage
const LOCALSTORAGE_CATEGORY_EXPAND_KEY = 'budget-app-category-expand';

export const LunarGrid: React.FC<LunarGridProps> = ({ year, month }) => {
  const days = getDaysInMonth(year, month);
  const transactions = useMonthlyTransactions(year, month);
  
  // Stare pentru categorii expandate/colapsate - persistentă în localStorage
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>(() => {
    try {
      // Încearcă să încerce starea din localStorage
      const saved = localStorage.getItem(LOCALSTORAGE_CATEGORY_EXPAND_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading expanded categories from localStorage:', error);
      return {};
    }
  });
  
  // Handler pentru expandare/colapsare categorie
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newState = { ...prev, [category]: !prev[category] };
      
      // Salvează în localStorage pentru persistență între sesiuni
      try {
        localStorage.setItem(LOCALSTORAGE_CATEGORY_EXPAND_KEY, JSON.stringify(newState));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      return newState;
    });
  };
  
  // Calcul pentru sume totale pe categorii (folosit la afișarea categoriilor colapsate)
  const categoryTotals = React.useMemo(() => {
    const result: Record<string, Record<number, number>> = {};
    
    Object.keys(CATEGORIES).forEach(category => {
      result[category] = getCategoryTotalAllDays(transactions, category);
    });
    
    return result;
  }, [transactions]);
  
  // Calculează soldurile zilnice pentru întreaga lună
  const dailyBalances = React.useMemo(() => {
    return days.reduce<Record<number, number>>((acc, day) => {
      acc[day] = calculateDailyBalance(transactions, day);
      return acc;
    }, {});
  }, [days, transactions]);

  // Stil CSS condiționat pentru solduri (pozitiv/negativ)
  const getBalanceStyle = (amount: number): string => {
    if (amount === 0) return 'text-gray-500';
    return amount > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium';
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-max table-auto border-collapse" data-testid="lunar-grid-table">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white z-10 px-4 py-2 w-64" data-testid="header-categorie">
              Categorie / Subcategorie
            </th>
            {days.map(day => (
              <th key={day} className="px-4 py-2 text-center" data-testid={`header-day-${day}`}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(CATEGORIES).map(([categoryKey, subcats]) => {
            const isExpanded = !!expandedCategories[categoryKey];
            const categoryTotalsByDay = categoryTotals[categoryKey];
            
            return (
              <React.Fragment key={categoryKey}>
                {/* Rând principal categorie (expandabil/colapsabil) */}
                <tr 
                  className="bg-teal-100 hover:bg-teal-200 cursor-pointer" 
                  onClick={() => toggleCategory(categoryKey)}
                  data-testid={`category-row-${categoryKey}`}
                >
                  <td 
                    className="sticky left-0 bg-teal-100 hover:bg-teal-200 z-10 font-semibold px-4 py-2 flex items-center"
                    data-testid={`category-header-${categoryKey}`}
                  >
                    {isExpanded ? 
                      <ChevronDown size={16} className="mr-1" data-testid={`category-expanded-${categoryKey}`} /> : 
                      <ChevronRight size={16} className="mr-1" data-testid={`category-collapsed-${categoryKey}`} />}
                    {categoryKey}
                  </td>
                  
                  {/* Totaluri per categorie pe zile, afișate când categoria e colapsata */}
                  {days.map(day => {
                    const categorySum = categoryTotalsByDay[day] || 0;
                    return (
                      <td 
                        key={day} 
                        className={`px-4 py-2 text-right ${getBalanceStyle(categorySum)}`}
                        data-testid={`category-total-${categoryKey}-${day}`}
                      >
                        {categorySum !== 0 ? formatCurrency(categorySum) : '—'}
                      </td>
                    );
                  })}
                </tr>
                
                {/* Randuri cu subcategorii - vizibile doar când categoria e expandata */}
                {isExpanded && Object.entries(subcats).map(([subcatGroup, subcatList]: [string, string[]]) => (
                  subcatList.map((subcat: string) => (
                    <tr 
                      key={`${categoryKey}-${subcat}`}
                      className="hover:bg-gray-100 border-t border-gray-200"
                      data-testid={`subcategory-row-${categoryKey}-${subcat}`}
                    > 
                      <td 
                        className="sticky left-0 bg-white z-10 px-4 py-2 pl-8 flex items-center"
                        data-testid={`subcat-${subcat}`}
                      >
                        <div className="w-4 h-0 border-t border-gray-400 mr-2"></div>
                        {subcat}
                      </td>
                      {days.map(day => {
                        const sum = getSumForCell(transactions, categoryKey, subcat, day);
                        return (
                          <td 
                            key={day} 
                            className={`px-4 py-2 text-right ${sum !== 0 ? getBalanceStyle(sum) : ''}`}
                            data-testid={`cell-${categoryKey}-${subcat}-${day}`}
                          >
                            {sum !== 0 ? formatCurrency(sum) : '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ))}
              </React.Fragment>
            );
          })}
          
          {/* Rândul SOLD la finalul tabelului - conform DEV-4 */}
          <tr className="bg-gray-100 font-bold border-t-2">
            <td 
              className="sticky left-0 bg-gray-100 z-10 px-4 py-2" 
              data-testid="sold-label"
            >
              {EXCEL_GRID.HEADERS.SOLD}
            </td>
            {days.map(day => {
              const balance = dailyBalances[day];
              return (
                <td 
                  key={day} 
                  className={`px-4 py-2 text-right ${getBalanceStyle(balance)}`} 
                  data-testid={`sold-day-${day}`}
                >
                  {formatCurrency(balance)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LunarGrid;
