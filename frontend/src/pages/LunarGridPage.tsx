import React, { useEffect, useState, useMemo, useCallback, useTransition } from "react";
import { EXCEL_GRID, UI } from "@shared-constants/ui";
import LunarGridTanStack from "../components/features/LunarGrid/LunarGridTanStack";
import { TITLES } from "@shared-constants";
import { CATEGORIES } from "@shared-constants/categories";
import { useTransactionStore } from "../stores/transactionStore";
import { useCategoryStore } from "../stores/categoryStore";
import { useAuthStore } from "../stores/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { useMonthlyTransactions, useAdjacentMonthsPreload } from "../services/hooks/useMonthlyTransactions";
import { cn } from "../styles/cva/shared/utils";
import { container } from "../styles/cva/components/layout";
import { button } from "../styles/cva/components/forms";
import { Maximize2, Minimize2 } from "lucide-react";

// 🎯 LGI-TASK-07: Layout modes type pentru Progressive Enhancement Button (doar 2 moduri)
type LayoutMode = 'full-width' | 'fullscreen';

/**
 * Pagină dedicată pentru afișarea grid-ului lunar cu TanStack Table
 * Permite navigarea între luni și vizualizarea tranzacțiilor pe zile/categorii
 * Cu debounce implementat pentru a evita prea multe cereri API la navigare rapidă
 * 🚀 ENHANCED: Multi-Mode Layout System cu Progressive Enhancement Button
 */
const LunarGridPage: React.FC = () => {
  // React 18 Transitions pentru navigare fluidă între luni
  const [isPending, startTransition] = useTransition();

  // 🎯 LGI-TASK-07: Layout mode state pentru Progressive Enhancement
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('full-width');

  // Acces la queryClient pentru a gestiona invalidarea cache-ului în mod eficient
  const queryClient = useQueryClient();

  // State pentru anul și luna curentă
  const [year, setYear] = React.useState(() => new Date().getFullYear());
  const [month, setMonth] = React.useState(() => new Date().getMonth() + 1);

  // Timer pentru debounce - evităm cereri API multiple când utilizatorul schimbă rapid luna/anul
  const debounceTimerRef = React.useRef<number | null>(null);

  // Extragem user din AuthStore
  const { user } = useAuthStore();

  // 🎯 LGI-TASK-07: Escape key handler pentru exit fullscreen mode
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && layoutMode === 'fullscreen') {
        setLayoutMode('full-width');
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [layoutMode]);

  // 🎯 LGI-TASK-07: Progressive Enhancement Button handler (doar între full-width și fullscreen)
  const handleLayoutModeToggle = useCallback(() => {
    setLayoutMode((prevMode) => {
      switch (prevMode) {
        case 'full-width':
          return 'fullscreen';
        case 'fullscreen':
          return 'full-width';
        default:
          return 'full-width';
      }
    });
  }, []);

  // 🎯 LGI-TASK-07: Dynamic layout styles bazat pe mode (doar 2 moduri)
  const getLayoutStyles = (mode: LayoutMode): string => {
    switch (mode) {
      case 'full-width':
        return "relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] pb-10 transition-all duration-300 ease-in-out";
      case 'fullscreen':
        return "fixed inset-0 z-50 bg-white p-4 overflow-auto transition-all duration-300 ease-in-out";
      default:
        return "relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] pb-10 transition-all duration-300 ease-in-out";
    }
  };

  // 🎯 LGI-TASK-07: Layout mode button label (doar 2 moduri)
  const getLayoutModeLabel = (mode: LayoutMode): string => {
    switch (mode) {
      case 'full-width':
        return 'Lățime completă';
      case 'fullscreen':
        return 'Fullscreen';
      default:
        return 'Lățime completă';
    }
  };

  // 🎯 LGI-TASK-07: Layout mode icon (doar 2 moduri)
  const getLayoutModeIcon = (mode: LayoutMode) => {
    switch (mode) {
      case 'fullscreen':
        return <Minimize2 size={16} />;
      default:
        return <Maximize2 size={16} />;
    }
  };

  // 🎯 LGI-TASK-07: Fullscreen backdrop pentru professional appearance
  const renderFullscreenBackdrop = () => {
    if (layoutMode === 'fullscreen') {
      return (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all duration-300"
          onClick={() => setLayoutMode('full-width')}
          data-testid="fullscreen-backdrop"
        />
      );
    }
    return null;
  };

  // Folosim React Query prin hook-ul useMonthlyTransactions pentru verificarea stării de loading
  const { isLoading: loading } = useMonthlyTransactions(year, month, user?.id, {
    includeAdjacentDays: true,
  });

  // Preload inteligent pentru luni adiacente (elimină loading states la navigare)
  // ✅ FIX: Memoizez opțiunile pentru a evita bucla infinită în useEffect
  const preloadOptions = useMemo(() => ({
    staleTime: 60 * 1000, // 1 minut cache pentru preloaded data
    gcTime: 10 * 60 * 1000, // 10 minute garbage collection pentru preloaded data
  }), []);
  
  useAdjacentMonthsPreload(year, month, user?.id, preloadOptions);

  // Funcționalitate pentru categorii personalizate
  const loadCategories = useCategoryStore((state) => state.loadUserCategories);
  const mergeWithDefaults = useCategoryStore(
    (state) => state.mergeWithDefaults,
  );

  /**
   * Funcție de debounce care actualizează luna/anul și invalidează cache-ul cu întârziere
   * Evită multiple cereri API când utilizatorul navighează rapid între luni
   */
  const setDateWithDebounce = React.useCallback(
    (newMonth: number, newYear: number) => {
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
        console.log(
          `Invalidating cache for ${newYear}-${newMonth} after debounce`,
        );

        // Folosim queryClient pentru a invalida doar query-ul specific pentru luna/anul selectat
        // Această abordare este mai eficientă decât invalidarea tuturor query-urilor
        queryClient.invalidateQueries({
          queryKey: ["transactions", newYear, newMonth],
          exact: true,
        });

        debounceTimerRef.current = null;
      }, 300); // 300ms întârziere - valoare optimă pentru UX + performanță
    },
    [queryClient],
  );

  // Funcții pentru navigare între luni, acum cu debounce și transitions
  const goToPreviousMonth = () => {
    startTransition(() => {
      let newMonth = month - 1;
      let newYear = year;

      if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }

      setDateWithDebounce(newMonth, newYear);
    });
  };

  const goToNextMonth = () => {
    startTransition(() => {
      let newMonth = month + 1;
      let newYear = year;

      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      }

      setDateWithDebounce(newMonth, newYear);
    });
  };

  // Formatare nume lună în română
  const getMonthName = (month: number) => {
    const monthNames = [
      "Ianuarie",
      "Februarie",
      "Martie",
      "Aprilie",
      "Mai",
      "Iunie",
      "Iulie",
      "August",
      "Septembrie",
      "Octombrie",
      "Noiembrie",
      "Decembrie",
    ];
    return monthNames[month - 1];
  };

  // Handler pentru a actualiza luna și anul - optimizat cu debounce și transitions
  // pentru a evita cereri API multiple când utilizatorul schimbă rapid luna/anul
  const handleMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      startTransition(() => {
        const newMonth = parseInt(e.target.value, 10);
        setMonth(newMonth);

        // Invalidate cache pentru a forța o nouă cerere cu noile valori
        if (debounceTimerRef.current) {
          window.clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = window.setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["transactions", "monthly"],
          });
        }, 100);
      });
    },
    [queryClient],
  );

  // Optimizare similară pentru schimbarea anului cu transitions
  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      startTransition(() => {
        const newYear = parseInt(e.target.value, 10);
        if (!isNaN(newYear) && newYear > 1900 && newYear < 2100) {
          setYear(newYear);

          if (debounceTimerRef.current) {
            window.clearTimeout(debounceTimerRef.current);
          }

          debounceTimerRef.current = window.setTimeout(() => {
            queryClient.invalidateQueries({
              queryKey: ["transactions", "monthly"],
            });
          }, 100);
        }
      });
    },
    [queryClient],
  );

  // Generăm opțiuni pentru dropdown cu luni
  const monthOptions = useMemo(() => {
    const options = [];
    for (let i = 1; i <= 12; i++) {
      options.push(
        <option key={i} value={i}>
          {getMonthName(i)}
        </option>,
      );
    }
    return options;
  }, []);

  return (
    <>
      {/* 🎯 LGI-TASK-07: Fullscreen backdrop pentru professional appearance */}
      {renderFullscreenBackdrop()}
      
      <div className={getLayoutStyles(layoutMode)} data-testid="lunar-grid-container">
        {/* 🎯 LGI-TASK-07: Fullscreen mode indicator */}
        {layoutMode === 'fullscreen' && (
          <div className="absolute top-1 right-1 z-10 text-xs text-gray-500 bg-white/90 px-2 py-1 rounded-md shadow-sm">
            Press ESC pentru a ieși din fullscreen
          </div>
        )}

        <div className={cn(
          "flex flex-col md:flex-row justify-between items-center",
          layoutMode === 'fullscreen' ? "mb-4" : "mb-6",
          layoutMode === 'full-width' ? "px-4" : ""
        )}>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {TITLES.GRID_LUNAR}
            </h1>
            {/* Indicator pentru React 18 Transitions */}
            {isPending && (
              <div 
                className="flex items-center text-sm text-blue-600"
                data-testid="transition-loading-indicator"
              >
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2" />
                Navigare...
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* 🎯 LGI-TASK-07: Progressive Enhancement Button */}
            <button
              onClick={handleLayoutModeToggle}
              className={cn(
                button({ variant: "outline", size: "sm" }),
                "flex items-center gap-2 transition-all duration-200 hover:bg-blue-50",
                layoutMode === 'fullscreen' && "ring-2 ring-blue-300 bg-blue-50"
              )}
              title={`Comută la modul următor (${layoutMode === 'full-width' ? 'fullscreen' : 'lățime completă'})`}
              data-testid="layout-mode-toggle"
            >
              {getLayoutModeIcon(layoutMode)}
              <span className="hidden sm:inline">{getLayoutModeLabel(layoutMode)}</span>
            </button>

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
          </div>
        </div>

        {/* Arată Loading state când încărcăm date */}
        {loading ? (
          <div className={cn(
            "flex justify-center items-center",
            layoutMode === 'fullscreen' ? "py-8" : "py-8",
            layoutMode === 'full-width' ? "px-4" : ""
          )}>
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
            <p className="ml-3 text-gray-700">
              Se încarcă datele pentru {getMonthName(month)} {year}...
            </p>
          </div>
        ) : (
          <div className={cn(
            layoutMode === 'full-width' ? "px-4" : ""
          )}>
            <LunarGridTanStack year={year} month={month} />
          </div>
        )}
      </div>
    </>
  );
};

export default LunarGridPage;
