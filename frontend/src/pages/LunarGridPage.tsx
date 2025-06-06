import React, { useEffect, useState, useMemo, useCallback, useTransition } from "react";
import { EXCEL_GRID, UI, TITLES, CATEGORIES } from "@budget-app/shared-constants";
import LunarGridTanStack from "../components/features/LunarGrid/LunarGridTanStack";
import { useTransactionStore } from "../stores/transactionStore";
import { useCategoryStore } from "../stores/categoryStore";
import { useAuthStore } from "../stores/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { useMonthlyTransactions, useAdjacentMonthsPreload } from "../services/hooks/useMonthlyTransactions";

// CVA styling imports
import { cn, dashboard, modal, headingProfessional, captionProfessional } from "../styles/cva-v2";

import { Maximize2, Minimize2 } from "lucide-react";
import Badge from "../components/primitives/Badge/Badge";
import Spinner from "../components/primitives/Spinner/Spinner";
import { Container } from "../components/primitives";

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



  // 🎯 LGI-TASK-07: Fullscreen backdrop cu CVA professional styling
  const renderFullscreenBackdrop = () => {
    if (layoutMode === 'fullscreen') {
      return (
        <div 
          className={modal({ variant: "default" })}
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

  // Generăm opțiuni pentru dropdown cu luni
  const monthOptions = useMemo(() => {
    const options = [];
    for (let i = 1; i <= 12; i++) {
      options.push({
        value: i.toString(),
        label: getMonthName(i)
      });
    }
    return options;
  }, []);

  return (
    <>
      {/* 🎯 LGI-TASK-07: Fullscreen backdrop cu CVA professional styling */}
      {renderFullscreenBackdrop()}
      
      <Container maxWidth="7xl" padding="lg">
        <div className={getLayoutStyles(layoutMode)} data-testid="lunar-grid-page-container">
          {/* 🎯 LGI-TASK-07: Fullscreen mode indicator - CVA Badge primitive */}
          {layoutMode === 'fullscreen' && (
            <Badge 
              variant="secondary" 
              className="absolute top-1 right-1 z-10"
            >
              {UI.LUNAR_GRID_PAGE.FULLSCREEN_EXIT_HINT}
            </Badge>
          )}

          {/* 🚨 REMOVED: Page header - controalele sunt mutate în header-ul tabelului */}

          {/* Arată Loading state când încărcăm date - CVA Spinner + flexbox manual - COMPACT */}
          {loading ? (
            <div className={cn(
              "flex justify-center items-center gap-4",
              "py-6",
              layoutMode === 'full-width' ? "px-4" : ""
            )}>
              <Spinner size="md" />
              <p className={captionProfessional({ size: "sm" })}>
                {`Încărcăm datele pentru ${getMonthName(month)} ${year}...`}
              </p>
            </div>
          ) : (
            <div className={layoutMode === 'full-width' ? "px-4" : ""}>
              <LunarGridTanStack 
                year={year} 
                month={month}
                onYearChange={(newYear) => {
                  startTransition(() => {
                    setDateWithDebounce(month, newYear);
                  });
                }}
                onMonthChange={(newMonth) => {
                  startTransition(() => {
                    setDateWithDebounce(newMonth, year);
                  });
                }}
                isFullscreen={layoutMode === 'fullscreen'}
                onToggleFullscreen={handleLayoutModeToggle}
                monthOptions={monthOptions}
              />
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default LunarGridPage;
