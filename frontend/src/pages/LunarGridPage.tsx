import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { EXCEL_GRID, UI } from '@shared-constants/ui';
import LunarGrid from '../components/features/LunarGrid';
import LunarGridTanStack from '../components/features/LunarGrid/LunarGridTanStack';
import { TITLES } from '@shared-constants';
import { CATEGORIES } from '@shared-constants/categories';
import { useTransactionStore } from '../stores/transactionStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useAuthStore } from '../stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { useMonthlyTransactions } from '../services/hooks/useMonthlyTransactions';
import { cn } from '../styles/new/shared/utils';
import { container } from '../styles/new/components/layout';
import { button } from '../styles/new/components/forms';

/**
 * Pagină dedicată pentru afișarea grid-ului lunar
 * Permite navigarea între luni și vizualizarea tranzacțiilor pe zile/categorii
 * Cu debounce implementat pentru a evita prea multe cereri API la navigare rapidă
 * Migrated la CVA styling system pentru consistență
 */
const LunarGridPage: React.FC = () => {
  // Acces la queryClient pentru a gestiona invalidarea cache-ului în mod eficient
  const queryClient = useQueryClient();
  
  // State pentru anul și luna curentă
  const [year, setYear] = React.useState(() => new Date().getFullYear());
  const [month, setMonth] = React.useState(() => new Date().getMonth() + 1);
  
  // Timer pentru debounce - evităm cereri API multiple când utilizatorul schimbă rapid luna/anul
  const debounceTimerRef = React.useRef<number | null>(null);
  
  // State pentru a alege între implementarea clasică și cea TanStack
  const [useTanStack, setUseTanStack] = React.useState(() => {
    // Încercaăm să citim preferința din localStorage, default la true pentru versiunea nouă
    const savedPreference = localStorage.getItem('lunarGrid-useTanStack');
    return savedPreference !== null ? savedPreference === 'true' : true;
  });
  
  // Extragem user din AuthStore
  const { user } = useAuthStore();
  
  // Folosim React Query prin hook-ul useMonthlyTransactions pentru verificarea stării de loading
  // Aceasta înlocuiește vechile referințe la useTransactionStore.loading și fetchTransactions
  const { isLoading: loading } = useMonthlyTransactions(
    year, 
    month, 
    user?.id,
    { includeAdjacentDays: true }
  );
  
  // Funcționalitate pentru categorii personalizate
  const loadCategories = useCategoryStore(state => state.loadUserCategories);
  const mergeWithDefaults = useCategoryStore(state => state.mergeWithDefaults);
  
  // Actualizăm URL-ul când se schimbă luna/anul
  // Nu mai avem nevoie de logica de fetch, este gestionată de React Query
  React.useEffect(() => {
    // Actualizăm URL-ul cu parametrul month=YYYY-MM și păstrăm hash
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('month', `${year}-${month.toString().padStart(2, '0')}`);
    const hash = window.location.hash;
    const newUrl = `${window.location.pathname}?${urlParams}${hash}`;
    window.history.replaceState({}, '', newUrl);
    
    console.log(`LunarGridPage: URL updated for ${year}-${month}`);
  }, [year, month]);
  
  /**
   * Funcție de debounce care actualizează luna/anul și invalidează cache-ul cu întârziere
   * Evită multiple cereri API când utilizatorul navighează rapid între luni
   */
  const setDateWithDebounce = React.useCallback((newMonth: number, newYear: number) => {
    // Actualizăm imediat UI pentru a oferi feedback utilizatorului
    setMonth(newMonth);
    setYear(newYear);
    
    // Anulăm orice timer de debounce în curs
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
    }
    
    // Setăm un nou timer pentru invalidarea cache-ului după 300ms 
    // de la ultima acțiune a utilizatorului
    debounceTimerRef.current = window.setTimeout(() => {
      console.log(`Invalidating cache for ${newYear}-${newMonth} after debounce`);
      
      // Folosim queryClient pentru a invalida doar query-ul specific pentru luna/anul selectat
      // Această abordare este mai eficientă decât invalidarea tuturor query-urilor
      queryClient.invalidateQueries({ 
        queryKey: ['transactions', newYear, newMonth],
        exact: true 
      });
      
      debounceTimerRef.current = null;
    }, 300); // 300ms întârziere - valoare optimă pentru UX + performanță
  }, [queryClient]);
  
  // Funcții pentru navigare între luni, acum cu debounce
  const goToPreviousMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    
    setDateWithDebounce(newMonth, newYear);
  };
  
  const goToNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    
    setDateWithDebounce(newMonth, newYear);
  };
  
  // Formatare nume lună în română
  const getMonthName = (month: number) => {
    const monthNames = [
      'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ];
    return monthNames[month - 1];
  };
  
  // Salvăm preferința utilizatorului în localStorage pentru a o reține între sesiuni
  React.useEffect(() => {
    localStorage.setItem('lunarGrid-useTanStack', useTanStack.toString());
  }, [useTanStack]);

  // Toggle între implementarea clasică și implementarea TanStack
  const toggleImplementation = () => {
    setUseTanStack(prev => !prev);
  };

  // Handler pentru a actualiza luna și anul - optimizat cu debounce
  // pentru a evita cereri API multiple când utilizatorul schimbă rapid luna/anul
  const handleMonthChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    setMonth(newMonth);
    
    // Invalidate cache pentru a forța o nouă cerere cu noile valori
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = window.setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['transactions', 'monthly'] });
    }, 100);
  }, [queryClient]);
  
  // Optimizare similară pentru schimbarea anului
  const handleYearChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value, 10);
    if (!isNaN(newYear) && newYear > 1900 && newYear < 2100) {
      setYear(newYear);
      
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = window.setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['transactions', 'monthly'] });
      }, 100);
    }
  }, [queryClient]);
  
  // Generăm opțiuni pentru dropdown cu luni
  const monthOptions = useMemo(() => {
    const options = [];
    for (let i = 1; i <= 12; i++) {
      options.push(
        <option key={i} value={i}>
          {getMonthName(i)}
        </option>
      );
    }
    return options;
  }, []);

  return (
    <div className={cn(container({ size: 'xl' }), 'pb-10')}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {TITLES.GRID_LUNAR}
        </h1>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <select 
            value={month}
            onChange={handleMonthChange}
            className="form-select rounded-md border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
            data-testid="month-selector"
          >
            {monthOptions}
          </select>
          
          <input
            type="number"
            value={year}
            onChange={handleYearChange}
            min="1900"
            max="2100"
            className="form-input w-24 rounded-md border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
            data-testid="year-input"
          />
          
          <button 
            onClick={toggleImplementation}
            className={cn(
              button({ variant: 'secondary', size: 'sm' }),
              'whitespace-nowrap'
            )}
            data-testid="toggle-implementation"
          >
            {useTanStack ? 'Utilizează tabel clasic' : 'Utilizează TanStack Table'}
          </button>
        </div>
      </div>
      
      {/* Arată Loading state când încărcăm date */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
          <p className="ml-3 text-gray-700">Se încarcă datele pentru {getMonthName(month)} {year}...</p>
        </div>
      ) : (
        <>
          {useTanStack ? (
            // Versiunea nouă cu TanStack Table
            <LunarGridTanStack year={year} month={month} />
          ) : (
            // Versiunea clasică legacy
            <LunarGrid year={year} month={month} />
          )}
        </>
      )}
    </div>
  );
};

export default LunarGridPage;
