import React from 'react';
import { EXCEL_GRID } from '@shared-constants/ui';
import LunarGrid from '../components/features/LunarGrid';
import { TITLES } from '@shared-constants';
import { useTransactionStore } from '../stores/transactionStore';

/**
 * Pagină dedicată pentru afișarea grid-ului lunar
 * Permite navigarea între luni și vizualizarea tranzacțiilor pe zile/categorii
 */
const LunarGridPage: React.FC = () => {
  // State pentru anul și luna curentă
  const [year, setYear] = React.useState(() => new Date().getFullYear());
  const [month, setMonth] = React.useState(() => new Date().getMonth() + 1);
  
  // Asigurăm că avem tranzacțiile încărcate
  const fetchTransactions = useTransactionStore(state => state.fetchTransactions);
  const loading = useTransactionStore(state => state.loading);
  
  // Încărcăm tranzacțiile la montarea componentei
  // Folosim un guard pentru a preveni buclele infinite (conform memoriei d7b6eb4b-0702-4b0a-b074-3915547a2544)
  React.useEffect(() => {
    // Fetch doar la montare, nu la fiecare schimbare de parametri
    fetchTransactions();
  }, [fetchTransactions]);
  
  // Funcții pentru navigare între luni
  const goToPreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };
  
  // Formatare nume lună în română
  const getMonthName = (month: number) => {
    const monthNames = [
      'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ];
    return monthNames[month - 1];
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" data-testid="lunar-grid-title">
          {TITLES.GRID_LUNAR}
        </h1>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={goToPreviousMonth}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            data-testid="prev-month-btn"
          >
            &larr;
          </button>
          
          <span className="text-lg font-medium" data-testid="current-month">
            {getMonthName(month)} {year}
          </span>
          
          <button 
            onClick={goToNextMonth}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            data-testid="next-month-btn"
          >
            &rarr;
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8" data-testid="loading-indicator">{EXCEL_GRID.LOADING}</div>
      ) : (
        <LunarGrid year={year} month={month} />
      )}
    </>
  );
};

export default LunarGridPage;
