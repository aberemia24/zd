import React from 'react';
import { useTransactionStore } from '../../../stores/transactionStore';
import { CATEGORIES } from '@shared-constants/categories';
import { getCategoriesForTransactionType } from '@shared-constants/category-mapping';
import { TransactionType, TransactionStatus } from '@shared-constants/enums';
import { TransactionValidated } from '@shared-constants/transaction.schema';

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

// --- Componenta principală ---
export interface LunarGridProps {
  year: number;
  month: number;
}

export const LunarGrid: React.FC<LunarGridProps> = ({ year, month }) => {
  const days = getDaysInMonth(year, month);
  const transactions = useMonthlyTransactions(year, month);

  // TODO: Poți adăuga expand/collapse pe categorii principale dacă vrei
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-max table-auto border-collapse" data-testid="lunar-grid-table">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white z-10" data-testid="header-categorie">Categorie</th>
            <th className="sticky left-0 bg-white z-10" data-testid="header-subcategorie">Subcategorie</th>
            {days.map(day => (
              <th key={day} data-testid={`header-day-${day}`}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(CATEGORIES).map(([categoryKey, subcats]) => (
            Object.entries(subcats).map(([subcatGroup, subcatList]: [string, string[]]) => (
              subcatList.map((subcat: string) => (
                <tr key={`${categoryKey}-${subcat}`}> 
                  <td className="sticky left-0 bg-white z-10" data-testid={`cat-${categoryKey}`}>{categoryKey}</td>
                  <td className="sticky left-0 bg-white z-10" data-testid={`subcat-${subcat}`}>{subcat}</td>
                  {days.map(day => {
                    const sum = getSumForCell(transactions, categoryKey, subcat, day);
                    return (
                      <td key={day} data-testid={`cell-${categoryKey}-${subcat}-${day}`}>{sum !== 0 ? sum : ''}</td>
                    );
                  })}
                </tr>
              ))
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LunarGrid;
