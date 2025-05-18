import React from 'react';
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

/**
 * Pagină dedicată pentru afișarea grid-ului lunar
 * Permite navigarea între luni și vizualizarea tranzacțiilor pe zile/categorii
 * Cu debounce implementat pentru a evita prea multe cereri API la navigare rapidă
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
  
  // Nu mai avem nevoie de efectul pentru fetch inițial
  // React Query se ocupă automat de aceasta în useTransactions
  // Următorul comentariu este doar pentru documentare
  /* 
   * React Query gestionează automat starea pentru:
   * - Fetch inițial (la montare)
   * - Refetch la schimbarea dependențelor (year, month)
   * - Cache și invalidare cache
   * - Loading states & error handling
   */
  
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

  return (
    <>
      <div className="flex justify-between items-center mb-token">
        <h1 className="text-2xl font-bold text-primary-700" data-testid="lunar-grid-title">
          {TITLES.GRID_LUNAR}
        </h1>
        
        <div className="flex items-center space-x-token-sm">
          {/* Toggle pentru implementare */}
          <div 
            className="flex items-center bg-secondary-100 rounded-lg p-1 shadow-sm" 
            data-testid="implementation-toggle"
          >
            <button 
              className={`px-3 py-1 text-sm rounded-md transition-all ${useTanStack ? 'bg-primary-500 text-white' : 'text-primary-600'}`}
              onClick={toggleImplementation}
              data-testid="tanstack-toggle-btn"
            >
              {EXCEL_GRID.TABLE_CONTROLS.VIRTUAL_TABLE}
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md transition-all ${!useTanStack ? 'bg-primary-500 text-white' : 'text-primary-600'}`}
              onClick={toggleImplementation}
              data-testid="legacy-toggle-btn"
            >
              {EXCEL_GRID.TABLE_CONTROLS.LEGACY_TABLE}
            </button>
          </div>

          {/* Link to Options for managing categories */}
          <div>
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
      
      {/* Afișăm o versiune diferită în funcție de preferința utilizatorului */}
      {loading ? (
        <div className="text-center py-token-xl text-secondary-600" data-testid="loading-indicator">{EXCEL_GRID.LOADING}</div>
      ) : useTanStack ? (
        <div data-testid="tanstack-implementation">
          <LunarGridTanStack year={year} month={month} />
          <div className="mt-token text-xs text-secondary-500 text-right">
            {EXCEL_GRID.TABLE_CONTROLS.VERSION}: TanStack (optimizat pentru performanță)
          </div>
        </div>
      ) : (
        <div data-testid="legacy-implementation">
          <LunarGrid year={year} month={month} />
          <div className="mt-token text-xs text-secondary-500 text-right">
            {EXCEL_GRID.TABLE_CONTROLS.VERSION}: Clasic
          </div>
        </div>
      )}
    </>
  );
};

export default LunarGridPage;
