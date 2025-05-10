import React from 'react';
import { EXCEL_GRID, UI } from '@shared-constants/ui';
import LunarGrid from '../components/features/LunarGrid';
import { TITLES } from '@shared-constants';
import { CATEGORIES } from '@shared-constants/categories';
import { useTransactionStore } from '../stores/transactionStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useAuthStore } from '../stores/authStore';

/**
 * Pagină dedicată pentru afișarea grid-ului lunar
 * Permite navigarea între luni și vizualizarea tranzacțiilor pe zile/categorii
 */
const LunarGridPage: React.FC = () => {
  // State pentru anul și luna curentă
  const [year, setYear] = React.useState(() => new Date().getFullYear());
  const [month, setMonth] = React.useState(() => new Date().getMonth() + 1);
  
  // Extragem funcțiile și state-ul necesar din stores
  const fetchTransactions = useTransactionStore(state => state.fetchTransactions);
  const loading = useTransactionStore(state => state.loading);
  const { user } = useAuthStore();
  
  // Funcționalitate pentru categorii personalizate
  const loadCategories = useCategoryStore(state => state.loadUserCategories);
  const mergeWithDefaults = useCategoryStore(state => state.mergeWithDefaults);
  
  // Inițializăm store-ul de categorii la prima încărcare
  // Acest efect respectă regulile globale prin:
  // 1. Operare o singură dată la montare ([] ca dependențe)
  // 2. Folosirea useRef pentru a preveni efecte multiple
  const categoriesLoadedRef = React.useRef(false);
  
  // Efect pentru încărcarea categoriilor personalizate și fuzionarea cu cele predefinite
  React.useEffect(() => {
    // Guard pentru a preveni încărcări multiple
    if (categoriesLoadedRef.current) return;
    
    // Doar pentru utilizatorii autentificați
    if (!user) return;
    
    const initializeCategories = async () => {
      try {
        console.log('LunarGridPage: Inițializare categorii personalizate');
        
        // 1. Mai întâi încărcăm categoriile personalizate din DB
        await loadCategories(user.id);
        
        // 2. Apoi fuzionăm cu cele predefinite din CATEGORIES (shared-constants)
        // Conversia e necesară pentru că CATEGORIES are un format ușor diferit de CustomCategory[]
        const defaultCategories = Object.entries(CATEGORIES).map(([name, subcats]) => ({
          name,
          subcategories: Object.values(subcats).flat().map(subcatName => ({
            name: subcatName,
            isCustom: false
          })),
          isCustom: false
        }));
        
        // 3. Fuziune - prioritate pentru cele personalizate
        mergeWithDefaults(defaultCategories);
        
        // Marcăm ca încărcat pentru a preveni operații duplicate
        categoriesLoadedRef.current = true;
        
        console.log('LunarGridPage: Categorii inițializate cu succes');
      } catch (error) {
        console.error('Eroare la inițializarea categoriilor:', error);
      }
    };
    
    initializeCategories();
  }, [user, loadCategories, mergeWithDefaults]); // Dependențe minimale necesare
  
  // Referimță pentru a ține minte ultima combinație an/lună procesată
  // Acest pattern previne buclele infinite prin evitarea re-executării efectului în situații identice
  const lastProcessedRef = React.useRef<{year: number, month: number} | null>(null);
  
  // Încărcăm tranzacțiile pentru luna/anul selectat
  // Folosim un guard pentru a preveni buclele infinite (conform memoriei d7b6eb4b-0702-4b0a-b074-3915547a2544)
  React.useEffect(() => {
    // Guard pentru a preveni fetch duplicat pentru aceeași lună
    if (lastProcessedRef.current?.year === year && lastProcessedRef.current?.month === month) {
      return; // Skip dacă luna/anul nu s-au schimbat
    }
    
    // Actualizăm referința
    lastProcessedRef.current = { year, month };
    
    // Important: Folosim getState() pentru a accesa starea curentă fără subscribe
    // Aceasta evită bucle infinite cauzate de dependțe ciclice cu re-render
    const store = useTransactionStore.getState();
    
    // 1. Setăm parametrii și fetch în setTimeout pentru a preveni actualizări în cascadă
    setTimeout(() => {
      store.setQueryParams({
        ...store.currentQueryParams,
        year,
        month,
        includeAdjacentDays: true
      });
      setTimeout(() => {
        store.fetchTransactions(true);
      }, 0);
    }, 0);
    
    // Actualizăm URL-ul cu parametrul month=YYYY-MM și păstrăm hash
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('month', `${year}-${month.toString().padStart(2, '0')}`);
    const hash = window.location.hash;
    const newUrl = `${window.location.pathname}?${urlParams}${hash}`;
    window.history.replaceState({}, '', newUrl);
    
    console.log(`LunarGridPage: Set query params for ${year}-${month}`);
    
  }, [year, month]);
  
  // La prima montare, facem fetch pentru tranzacții dacă e nevoie
  React.useEffect(() => {
    const hasTransactions = useTransactionStore.getState().transactions.length > 0;
    if (!hasTransactions) {
      console.log('LunarGridPage: Initial fetch - no transactions found');
      fetchTransactions();
    }
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
      <div className="flex justify-between items-center mb-token">
        <h1 className="text-2xl font-bold text-primary-700" data-testid="lunar-grid-title">
          {TITLES.GRID_LUNAR}
        </h1>
        
        {/* Link to Options for managing categories */}
        <div className="mb-token">
          <a
            href="#options"
            className="text-sm text-accent-600 hover:text-accent-700 underline"
            data-testid="manage-categories-link"
            onClick={e => {
              e.preventDefault();
              const newUrl = `${window.location.pathname}#options`;
              window.history.replaceState({}, '', newUrl);
              window.dispatchEvent(new HashChangeEvent('hashchange'));
            }}
          >
            {UI.MANAGE_CATEGORIES}
          </a>
        </div>
        
        <div className="flex items-center gap-token">
          <button 
            onClick={goToPreviousMonth}
            className="btn-icon bg-secondary-200 text-secondary-700 hover:bg-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            data-testid="prev-month-btn"
          >
            &larr;
          </button>
          
          <span className="text-lg font-medium text-primary-700" data-testid="current-month">
            {getMonthName(month)} {year}
          </span>
          
          <button 
            onClick={goToNextMonth}
            className="btn-icon bg-secondary-200 text-secondary-700 hover:bg-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            data-testid="next-month-btn"
          >
            &rarr;
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-token-xl text-secondary-600" data-testid="loading-indicator">{EXCEL_GRID.LOADING}</div>
      ) : (
        <LunarGrid year={year} month={month} />
      )}
    </>
  );
};

export default LunarGridPage;
