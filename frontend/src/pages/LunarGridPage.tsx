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
import { 
  container,
  pageHeader,
  fullscreenIndicator,
  fullscreenBackdrop,
  titleSection,
  pageTitle,
  transitionLoader,
  spinner,
  controlsSection,
  formSelect,
  formInput,
  loadingContainer,
  loadingText,
  contentWrapper,
  responsiveLabel,
  layoutButton
} from "../styles/cva/components/layout";
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

  // 🎯 LGI-TASK-07: Dynamic layout styles bazat pe mode (doar 2 moduri) - REFACTORED cu CVA
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

  // 🎯 LGI-TASK-07: Layout mode button label cu shared-constants
  const getLayoutModeLabel = (mode: LayoutMode): string => {
    switch (mode) {
      case 'full-width':
        return UI.LUNAR_GRID_PAGE.LAYOUT_MODES.FULL_WIDTH;
      case 'fullscreen':
        return UI.LUNAR_GRID_PAGE.LAYOUT_MODES.FULLSCREEN;
      default:
        return UI.LUNAR_GRID_PAGE.LAYOUT_MODES.FULL_WIDTH;
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

  // 🎯 LGI-TASK-07: Fullscreen backdrop cu CVA professional styling
  const renderFullscreenBackdrop = () => {
    if (layoutMode === 'fullscreen') {
      return (
        <div 
          className={fullscreenBackdrop()}
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

  // 🚨 AUDIT FIX - Formatare nume lună cu shared-constants
  const getMonthName = (month: number) => {
    const monthNames = [
      UI.LUNAR_GRID_PAGE.MONTHS.IANUARIE,
      UI.LUNAR_GRID_PAGE.MONTHS.FEBRUARIE,
      UI.LUNAR_GRID_PAGE.MONTHS.MARTIE,
      UI.LUNAR_GRID_PAGE.MONTHS.APRILIE,
      UI.LUNAR_GRID_PAGE.MONTHS.MAI,
      UI.LUNAR_GRID_PAGE.MONTHS.IUNIE,
      UI.LUNAR_GRID_PAGE.MONTHS.IULIE,
      UI.LUNAR_GRID_PAGE.MONTHS.AUGUST,
      UI.LUNAR_GRID_PAGE.MONTHS.SEPTEMBRIE,
      UI.LUNAR_GRID_PAGE.MONTHS.OCTOMBRIE,
      UI.LUNAR_GRID_PAGE.MONTHS.NOIEMBRIE,
      UI.LUNAR_GRID_PAGE.MONTHS.DECEMBRIE,
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
      {/* 🎯 LGI-TASK-07: Fullscreen backdrop cu CVA professional styling */}
      {renderFullscreenBackdrop()}
      
      <div className={getLayoutStyles(layoutMode)} data-testid="lunar-grid-container">
        {/* 🎯 LGI-TASK-07: Fullscreen mode indicator cu CVA */}
        {layoutMode === 'fullscreen' && (
          <div className={fullscreenIndicator({ variant: "pro" })}>
            {UI.LUNAR_GRID_PAGE.FULLSCREEN_EXIT_HINT}
          </div>
        )}

        <div className={cn(
          pageHeader({ 
            layout: layoutMode === 'fullscreen' ? "fullscreen" : "default",
            padding: layoutMode === 'full-width' ? "default" : "none"
          })
        )}>
          <div className={titleSection({ variant: "professional" })}>
            <h1 className={pageTitle({ variant: "professional" })}>
              {TITLES.GRID_LUNAR}
            </h1>
            {/* Indicator pentru React 18 Transitions cu CVA */}
            {isPending && (
              <div 
                className={transitionLoader({ variant: "professional" })}
                data-testid="transition-loading-indicator"
              >
                <div className={spinner({ size: "sm", color: "professional" })} />
                {UI.LUNAR_GRID_PAGE.NAVIGATION_LOADING}
              </div>
            )}
          </div>

          <div className={controlsSection({ variant: "professional" })}>
            {/* 🎯 LGI-TASK-07: Progressive Enhancement Button cu CVA */}
            <button
              onClick={handleLayoutModeToggle}
              className={cn(
                button({ variant: "outline", size: "sm" }),
                layoutButton({ 
                  state: layoutMode === 'fullscreen' ? "active" : "default" 
                })
              )}
              title={UI.LUNAR_GRID_PAGE.LAYOUT_TOGGLE_TOOLTIP.replace(
                '{nextMode}', 
                layoutMode === 'full-width' ? UI.LUNAR_GRID_PAGE.LAYOUT_MODES.FULLSCREEN : UI.LUNAR_GRID_PAGE.LAYOUT_MODES.FULL_WIDTH
              )}
              data-testid="layout-mode-toggle"
            >
              {getLayoutModeIcon(layoutMode)}
              <span className={responsiveLabel({ variant: "professional" })}>{getLayoutModeLabel(layoutMode)}</span>
            </button>

            <select
              value={month}
              onChange={handleMonthChange}
              className={formSelect({ variant: "professional" })}
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
              className={formInput({ variant: "professional", width: "md" })}
              data-testid="year-input"
            />
          </div>
        </div>

        {/* Arată Loading state când încărcăm date cu CVA */}
        {loading ? (
          <div className={cn(
            loadingContainer({ 
              layout: layoutMode === 'fullscreen' ? "fullscreen" : "default",
              spacing: layoutMode === 'full-width' ? "default" : "none"
            })
          )}>
            <div className={spinner({ size: "lg", color: "professional" })} />
            <p className={loadingText({ variant: "professional" })}>
              {UI.LUNAR_GRID_PAGE.LOADING_MESSAGE_TEMPLATE
                .replace('{month}', getMonthName(month))
                .replace('{year}', year.toString())}
            </p>
          </div>
        ) : (
          <div className={cn(
            contentWrapper({ 
              padding: layoutMode === 'full-width' ? "default" : "none"
            })
          )}>
            <LunarGridTanStack year={year} month={month} />
          </div>
        )}
      </div>
    </>
  );
};

export default LunarGridPage;
