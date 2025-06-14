import React, { useCallback, useMemo, memo, useEffect } from 'react';
import { flexRender, Row } from "@tanstack/react-table";
import toast from 'react-hot-toast';
import { Maximize2, Minimize2 } from 'lucide-react';

// Constants și shared (@budget-app/shared-constants)
import { 
  TransactionType, 
  FrequencyType, 
  LUNAR_GRID_MESSAGES, 
  UI, 
  LUNAR_GRID 
} from "@budget-app/shared-constants";
import { LUNAR_GRID_ACTIONS } from "@budget-app/shared-constants/ui";

// Componente UI și features
import LunarGridRow from "./components/LunarGridRow";
import LunarGridModals from "./components/LunarGridModals";
import DeleteSubcategoryModal from "./components/DeleteSubcategoryModal";
import Button from "../../primitives/Button/Button";

// Hooks specializate
import {
  useLunarGridTable,
  TransformedTableDataRow,
} from "./hooks/useLunarGridTable";
import { useKeyboardNavigation, type CellPosition } from "./hooks/useKeyboardNavigation";
import { useLunarGridState } from "./hooks/useLunarGridState";
import { useTransactionOperations } from "./hooks/useTransactionOperations";
import { useSubcategoryOperations } from "./hooks/useSubcategoryOperations";
import { useTableResize } from "./hooks/useTableResize";
import { useMonthlyTransactions } from '../../../services/hooks/useMonthlyTransactions';
import {
  useDeleteTransactionMonthly
} from '../../../services/hooks/transactionMutations';

// Store-uri
import { useCategoryStore } from "../../../stores/categoryStore";
import { useAuthStore } from "../../../stores/authStore";

// Utilitare și styling - MIGRATED TO UNIFIED CVA SYSTEM
import { formatCurrencyForGrid, formatMonthYear } from "../../../utils/lunarGrid";
import { calculatePopoverStyle } from "../../../utils/lunarGrid/lunarGridHelpers";
// CVA styling imports - MIGRATED TO CVA-V2
import { 
  cn,
  gridContainer,
  gridCell,
  gridHeader,
  gridRow,
  button,
  textProfessional,
  fontFinancial,
  focusRing,
  flex
} from "../../../styles/cva-v2";

// Interfețe TypeScript
interface CategoryStoreItem {
  name: string;
  type: TransactionType;
  subcategories: Array<{ name: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

export interface LunarGridTanStackProps {
  year: number;
  month: number;
  // New props pentru controale mutate în header
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  monthOptions?: Array<{ value: string; label: string }>;
}

// Componenta principală - utilizăm memo pentru a preveni re-renderizări inutile
const LunarGridTanStack: React.FC<LunarGridTanStackProps> = memo(
  ({ year, month, onYearChange, onMonthChange, isFullscreen, onToggleFullscreen, monthOptions }) => {
    // Import userId from auth store pentru hooks monthly
    const { user } = useAuthStore();

    // State pentru subcategorii și modal
    const { categories } = useCategoryStore();

    // Hook consolidat pentru toate LunarGrid state-urile
    const {
      // Editing states
      popover,
      setPopover,
      modalState,
      setModalState,
      highlightedCell,
      setHighlightedCell,
      // Subcategory states (din useLunarGridSubcategoryState)
      addingSubcategory,
      setAddingSubcategory,
      newSubcategoryName,
      setNewSubcategoryName,
      subcategoryAction,
      editingSubcategoryName,
      setEditingSubcategoryName,
      cancelAddingSubcategory,
      startEditingSubcategory,
      startDeletingSubcategory,
      clearSubcategoryAction,
      
      // Expanded rows state
      expandedRows,
      setExpandedRows,
    } = useLunarGridState(year, month);

    // Hook pentru tranzacțiile reale cu datele corecte pentru Financial Projections
    // Dezactivez refetchOnWindowFocus pentru a evita refresh automat la focus
    const { transactions: validTransactions } = useMonthlyTransactions(year, month, user?.id, {
      includeAdjacentDays: true,
      refetchOnMount: false, // Nu refetch automat la mount dacă datele sunt fresh
      staleTime: 5 * 60 * 1000, // 5 minute cache pentru a evita refresh-uri inutile
    });

    // Hooks pentru operații specializate
    const transactionOps = useTransactionOperations({ year, month, userId: user?.id });
    const subcategoryOps = useSubcategoryOperations({
      year,
      month,
      userId: user?.id,
      newSubcategoryName,
      setNewSubcategoryName,
      setAddingSubcategory,
      clearSubcategoryAction,
    });

    // Hook pentru bulk delete operations (păstrat pentru keyboard navigation)
    const deleteTransactionMutation = useDeleteTransactionMonthly(year, month, user?.id);

    // Hook pentru redimensionare tabel și mod fullscreen
    const { isFullscreen: tableIsFullscreen, toggleFullscreen } = useTableResize();

    // Ref pentru container-ul interior care face scrollul efectiv (nu tableContainerRef care e exterior)
    const scrollableContainerRef = React.useRef<HTMLDivElement>(null);

    // Funcție pentru determinarea tipului de tranzacție
    const determineTransactionType = useCallback(
      (category: string): TransactionType => {
        const categories = useCategoryStore.getState().categories as CategoryStoreItem[];
        const foundCategory = categories.find((c) => c.name === category);
        return (foundCategory?.type || TransactionType.EXPENSE) as TransactionType;
      },
      [],
    );

    // Handler pentru salvarea din EditableCell (folosit direct de fiecare celulă)
    const handleEditableCellSave = useCallback(
      async (
        category: string,
        subcategory: string | undefined,
        day: number,
        value: string | number,
        transactionId: string | null,
      ): Promise<void> => {
        await transactionOps.handleEditableCellSave(category, subcategory, day, value, transactionId);
        
        // NU resetez highlight aici - se face doar la închiderea modalului
        // Highlight-ul trebuie să rămână pentru a arăta celula activă
      },
      [transactionOps],
    );

    // Handler pentru click pe celulă (doar pentru modal advanced - Shift+Click)
    const handleCellClick = useCallback(
      (
        e: React.MouseEvent,
        category: string,
        subcategory: string | undefined,
        day: number,
        amount: string,
      ) => {
        e.stopPropagation();

        // Doar deschide modal-ul dacă se ține Shift (pentru advanced editing)
        if (!e.shiftKey) {return;}

        // Verifică dacă currentTarget este valid
        const anchorEl = e.currentTarget as HTMLElement;
        if (!anchorEl) {
          return;
        }

        setPopover({
          category,
          subcategory,
          day,
          type: determineTransactionType(category),
          amount,
          isOpen: true,
          element: null,
          anchorEl,
        });
      },
      [determineTransactionType, setPopover],
    );

    // Handler pentru salvarea tranzacției din popover
    const handleSavePopover = useCallback(
      async (formData: {
        amount: string;
        recurring: boolean;
        frequency?: FrequencyType;
      }) => {
        try {
          await transactionOps.handleSavePopover(popover, formData);
          // UI cleanup după salvare
          setPopover(null);
        } catch (error) {
          // Error handling is already in the hook
          setPopover(null);
        }
      },
      [transactionOps, popover, setPopover],
    );

    // Handler pentru single click modal
    const handleSingleClickModal = useCallback(
      (
        category: string,
        subcategory: string | undefined,
        day: number,
        currentValue: string | number,
        transactionId: string | null,
        anchorElement?: HTMLElement,
      ) => {
        // Determină modul: edit dacă există tranzacție, add altfel
        const mode: 'add' | 'edit' = transactionId ? 'edit' : 'add';

        // SOLUȚIE 1: Improved position calculation cu validation
        const position = anchorElement && anchorElement.isConnected ? {
          top: anchorElement.getBoundingClientRect().top + window.scrollY,
          left: anchorElement.getBoundingClientRect().left + window.scrollX,
        } : undefined; // Lasă undefined pentru modal centrat cu overlay CVA

        // Log pentru debugging poziționarea
        if (process.env.NODE_ENV === 'development') {
          console.log('🎯 [MODAL-POSITION] Modal positioning data:', {
            hasAnchor: !!anchorElement,
            isConnected: anchorElement?.isConnected,
            position,
            mode,
            category,
            day
          });
        }

        // Setez contextul celulei pentru modal  
        const cellContext = {
          category,
          subcategory: subcategory || '',
          day,
          currentValue: currentValue?.toString() || '',
        };

        // Setez starea modalului
        setModalState({
          isOpen: true,
          mode,
          category,
          subcategory,
          day,
          year,
          month,
          existingValue: currentValue,
          position, // Va fi undefined pentru modal centrat = overlay CVA cu opacity
          transactionId,
        });

        // Setez celula evidențiată
        setHighlightedCell({
          category,
          subcategory,
          day,
        });
      },
      [setModalState, setHighlightedCell],
    );

    // Wrapper handlers - combină logica business din hook-uri cu UI management
    const handleSaveModal = useCallback(
      async (data: {
        amount: string;
        description: string;
        recurring: boolean;
        frequency?: FrequencyType;
      }) => {
        try {
          await transactionOps.handleSaveModal(modalState, data);
          // UI cleanup după salvare
          setModalState(null);
          setHighlightedCell(null);
        } catch (error) {
          // Error handling is already in the hook
        }
      },
      [transactionOps, modalState, setModalState, setHighlightedCell],
    );

    const handleDeleteFromModal = useCallback(
      async () => {
        try {
          await transactionOps.handleDeleteFromModal(modalState);
          // UI cleanup după delete
          setModalState(null);
          setHighlightedCell(null);
        } catch (error) {
          // Error handling is already in the hook
        }
      },
      [transactionOps, modalState, setModalState, setHighlightedCell],
    );

    // Handler pentru închiderea modal-ului
    const handleCloseModal = useCallback(() => {
      setModalState(null);
      setHighlightedCell(null);
    }, [setModalState, setHighlightedCell]);

    // Handler pentru ștergerea unei subcategorii custom
    const handleDeleteSubcategory = useCallback(
      async (categoryName: string, subcategoryName: string) => {
        await subcategoryOps.handleDeleteSubcategory(categoryName, subcategoryName);
      },
      [subcategoryOps],
    );

    // Handler pentru adăugarea unei subcategorii noi
    const handleAddSubcategory = useCallback(
      async (categoryName: string) => {
        await subcategoryOps.handleAddSubcategory(categoryName);
      },
      [subcategoryOps],
    );

    // Interogare tabel optimizată (fără handleri de click/double-click)
    const { table, isLoading, error, days, dailyBalances, tableContainerRef, transactionMap } =
      useLunarGridTable(year, month, expandedRows, handleCellClick);

    // Prepare data pentru keyboard navigation
    const navigationRows = useMemo(() => {
      return table.getRowModel().rows.map(row => ({
        category: row.original.category,
        subcategory: row.original.subcategory,
        isExpanded: row.getIsExpanded(),
      }));
    }, [table]);

    // Keyboard navigation hook cu delete support
    const {
      handleCellClick: navHandleCellClick,
      isPositionSelected,
      isPositionFocused,
    } = useKeyboardNavigation({
      totalDays: days.length,
      rows: navigationRows,
      isActive: !modalState?.isOpen && !popover?.isOpen, // Dezactivează navigation când modal/popover e deschis
      onDeleteRequest: async (positions: CellPosition[]) => {
        if (!user?.id || positions.length === 0) {return;}

        try {
          // Găsește tranzacțiile care există pentru pozițiile selectate
          const transactionsToDelete: string[] = [];
          
          for (const pos of positions) {
            // Găsește tranzacția pentru această poziție
            // Convertește day la data completă
            const targetDate = `${year}-${month.toString().padStart(2, '0')}-${pos.day.toString().padStart(2, '0')}`;
            
            const existingTransaction = validTransactions.find(t => 
              t.category === pos.category &&
              t.subcategory === pos.subcategory &&
              t.date === targetDate
            );
            
            if (existingTransaction?.id) {
              transactionsToDelete.push(existingTransaction.id);
            }
          }

          if (transactionsToDelete.length === 0) {
            toast.error(LUNAR_GRID_ACTIONS.NO_TRANSACTIONS_TO_DELETE);
            return;
          }

          // Cerere de confirmare pentru ștergere
          const confirmMessage = transactionsToDelete.length === 1
            ? LUNAR_GRID_ACTIONS.DELETE_TRANSACTION_SINGLE
            : LUNAR_GRID_ACTIONS.DELETE_TRANSACTION_MULTIPLE.replace('{count}', transactionsToDelete.length.toString());

          if (!window.confirm(confirmMessage)) {
            return;
          }

          // Șterge tranzacțiile una câte una
          const deletePromises = transactionsToDelete.map(transactionId => 
            deleteTransactionMutation.mutateAsync(transactionId)
          );

          await Promise.all(deletePromises);

          // Success feedback
          toast.success(
            transactionsToDelete.length === 1
              ? LUNAR_GRID_ACTIONS.DELETE_SUCCESS_SINGLE
              : LUNAR_GRID_ACTIONS.DELETE_SUCCESS_MULTIPLE.replace('{count}', transactionsToDelete.length.toString())
          );

        } catch (error) {
          toast.error(LUNAR_GRID_ACTIONS.DELETE_ERROR);
        }
      },
      onEditMode: (position) => {
        // Trigger inline edit mode pentru poziția selectată
        // Găsește celula și trigger edit mode similar cu double click
        const categoryRow = table.getRowModel().rows.find(row => 
          row.original.category === position.category && 
          (!position.subcategory || row.original.subcategory === position.subcategory)
        );
        if (categoryRow) {
          // TODO: Implementează edit mode direct pentru pozițiile focalizate
        }
      },
    });

    // Blocare scroll când modalul este deschis - UX Enhancement (doar scroll, nu operațiuni)
    useEffect(() => {
      const scrollableContainer = scrollableContainerRef.current;
      if (!scrollableContainer) {return;}

      if (modalState?.isOpen) {
        // Salvează poziția actuală de scroll pentru tabel
        const currentScrollTop = scrollableContainer.scrollTop;
        const currentScrollLeft = scrollableContainer.scrollLeft;
        
        // Salvează poziția actuală de scroll pentru pagină
        const currentPageScrollY = window.scrollY;
        const currentPageScrollX = window.scrollX;
        
        // Blochează scrollul tabelului
        scrollableContainer.style.overflow = 'hidden';
        scrollableContainer.style.position = 'relative';
        
        // Blochează scrollul paginii cu stil profesional
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${currentPageScrollY}px`;
        document.body.style.left = `-${currentPageScrollX}px`;
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        
        // Cleanup - restabilește scrollul când modalul se închide
        return () => {
          if (scrollableContainer) {
            // Restabilește scrollul tabelului
            scrollableContainer.style.overflow = 'auto';
            scrollableContainer.style.position = '';
            scrollableContainer.scrollTop = currentScrollTop;
            scrollableContainer.scrollLeft = currentScrollLeft;
          }
          
          // Restabilește scrollul paginii
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.left = '';
          document.body.style.width = '';
          document.body.style.height = '';
          
          // Restabilește poziția de scroll a paginii
          window.scrollTo(currentPageScrollX, currentPageScrollY);
        };
      }
    }, [modalState?.isOpen]);

    // Gestionarea poziției popover-ului
    const popoverStyle = calculatePopoverStyle(popover);

    // Simplified render pentru row folosind LunarGridRow component  
    const renderRow = useCallback(
      (row: Row<TransformedTableDataRow>, level: number = 0): React.ReactNode => {
        return (
          <LunarGridRow
            key={row.id}
            row={row}
            level={level}
            categories={categories}
            _expandedRows={expandedRows}
            subcategoryAction={subcategoryAction}
            editingSubcategoryName={editingSubcategoryName}
            _highlightedCell={highlightedCell}
            addingSubcategory={addingSubcategory}
            newSubcategoryName={newSubcategoryName}
            table={table}
            transactionMap={transactionMap}
            onExpandToggle={(rowId, isExpanded) => {
              setExpandedRows(prev => ({
                ...prev,
                [rowId]: isExpanded
              }));
              
              // 🔧 FIX: Reset addingSubcategory state când categoria se collapses
              if (!isExpanded && addingSubcategory === rowId) {
                setAddingSubcategory(null);
                setNewSubcategoryName("");
              }
            }}
            onSubcategoryEdit={subcategoryOps.handleRenameSubcategory}
            _onSubcategoryDelete={(category, subcategory) => {
              // Setează modalul pentru confirmare delete
              startDeletingSubcategory(category, subcategory);
            }}
            onEditingValueChange={setEditingSubcategoryName}
            onClearSubcategoryAction={clearSubcategoryAction}
            onStartEditingSubcategory={startEditingSubcategory}
            onStartDeletingSubcategory={startDeletingSubcategory}
            onCellSave={handleEditableCellSave}
            onSingleClickModal={handleSingleClickModal}
            onCellClick={navHandleCellClick}
            onAddSubcategory={handleAddSubcategory}
            onCancelAddingSubcategory={cancelAddingSubcategory}
            onSetAddingSubcategory={setAddingSubcategory}
            onSetNewSubcategoryName={setNewSubcategoryName}
            isPositionFocused={(position) => Boolean(isPositionFocused(position))}
            isPositionSelected={(position) => Boolean(isPositionSelected(position))}
          />
        );
      },
      [categories, expandedRows, subcategoryAction, editingSubcategoryName, highlightedCell, addingSubcategory, newSubcategoryName, table, transactionMap, setExpandedRows, subcategoryOps, handleEditableCellSave, handleSingleClickModal, navHandleCellClick, handleAddSubcategory, cancelAddingSubcategory, setAddingSubcategory, setNewSubcategoryName, isPositionFocused, isPositionSelected],
    );

    // Renderizare (layout principal)
    return (
      <>
        {/* REMOVED: LunarGridToolbar - controalele sunt mutate în header-ul tabelului */}

        {/* REMOVED: Header principal global - mutat în header-ul tabelului */}

        <div 
          ref={tableContainerRef}
          className={cn(
            gridContainer({ 
              variant: "professional",
              size: isFullscreen || tableIsFullscreen ? "fullscreen" : "default"
            }),
            "transition-all duration-200 hover-lift",
            focusRing({ variant: "default" })
          )}
          data-testid="lunar-grid-resize-container"
          onSubmit={(e) => {
            // Previne form submission care cauzează page refresh
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            // Previne click-uri nedorite care pot cauza navigație
            e.stopPropagation();
          }}
          onWheel={(e) => {
            // Capturează mouse wheel pentru scroll natural în tabel
            e.stopPropagation();
            // Permite scroll-ul natural al browser-ului în container
          }}
          tabIndex={0} // Face container-ul focusable pentru keyboard navigation
          style={{
            scrollBehavior: 'smooth' // Smooth scrolling pentru o experiență mai plăcută
          }}
        >
          {/* Container interior - FĂRĂ overflow duplicat (scroll e gestionat de outer container) */}
          <div 
            ref={scrollableContainerRef}
            className={cn(
              "relative", // REMOVED overflow-auto - scroll is handled by outer gridContainer
              // Height constraints rămân pentru space management
              isFullscreen || tableIsFullscreen ? "max-h-[calc(100vh-60px)]" : "max-h-[790px]"
            )}
            data-testid="lunar-grid-container"
          >
            {/* 🎨 Professional Loading State */}
            {isLoading && (
              <div className={cn(
                "text-center p-8 text-gray-600",
                flex({ align: "center", justify: "center" }),
                "animate-fade-in-up"
              )} 
              data-testid="loading-indicator">
                <div className="loading-pulse">
                  {LUNAR_GRID.LOADING}
                </div>
              </div>
            )}
            
            {/* 🎨 Professional Error State */}
            {error && (
              <div className={cn(
                "text-center p-8 text-red-600",
                flex({ align: "center", justify: "center" }),
                "animate-slide-down"
              )} 
              data-testid="error-indicator">
                {LUNAR_GRID_MESSAGES.EROARE_INCARCARE}
              </div>
            )}
            
            {/* 🎨 Professional Empty State */}
            {!isLoading && !error && table.getRowModel().rows.length === 0 && (
              <div className={cn(
                "text-center p-8 text-gray-500",
                flex({ align: "center", justify: "center" }),
                "animate-scale-in"
              )} 
              data-testid="no-data-indicator">
                {LUNAR_GRID.NO_DATA}
              </div>
            )}
            
            {/* 🎨 Professional Grid Table cu header integrat */}
            {!isLoading && !error && table.getRowModel().rows.length > 0 && (
              <table 
                className="w-full border-collapse table-auto"
                data-testid="lunar-grid-table"
              >
                {/* 🎨 Unified Sticky Header cu controale și zilele */}
                <thead className={cn(gridHeader({ sortable: false, sticky: true }), "border-spacing-0")}>
                  {/* Prima secțiune: Controale */}
                  <tr>
                    <th 
                      colSpan={table.getFlatHeaders().length}
                      className="bg-white border-b-0 p-4"
                    >
                      <div className="grid grid-cols-3 items-center gap-4">
                        {/* Partea stânga: Butoane control grid */}
                        <div className="flex items-center gap-3 justify-start">
                          <h2 className={cn(
                            textProfessional({ variant: "heading", contrast: "high" }),
                            "text-lg font-bold"
                          )}>
                            Grid Lunar
                          </h2>
                          
                          {/* Butoane extinde/resetează din toolbar */}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              const isCurrentlyExpanded = table.getIsAllRowsExpanded();
                              const newExpandedState: Record<string, boolean> = {};
                              
                              if (!isCurrentlyExpanded) {
                                // Expandează toate
                                table.getRowModel().rows.forEach(row => {
                                  if (row.getCanExpand()) {
                                    newExpandedState[row.id] = true;
                                  }
                                });
                              }
                              
                              setExpandedRows(newExpandedState);
                              table.toggleAllRowsExpanded(!isCurrentlyExpanded);
                            }}
                            data-testid="toggle-expand-all"
                          >
                            {table.getIsAllRowsExpanded() ? LUNAR_GRID.COLLAPSE_ALL : LUNAR_GRID.EXPAND_ALL}
                          </Button>
                          
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setExpandedRows({});
                              table.resetExpanded();
                            }}
                            data-testid="reset-expanded"
                          >
                            {LUNAR_GRID.RESET_EXPANSION}
                          </Button>
                        </div>

                        {/* Partea centrală: Luna și anul cu mărimea originală */}
                        <div className="flex justify-center">
                          <h2 className="text-3xl font-bold text-gray-900 tracking-tight select-none cursor-default">
                            {formatMonthYear(month, year)}
                          </h2>
                        </div>

                        {/* Partea dreaptă: Controale navigare + Fullscreen */}
                        <div className="flex items-center gap-3 justify-end">
                          {/* Select pentru lună */}
                          {monthOptions && onMonthChange && (
                            <select
                              value={month.toString()}
                              onChange={(e) => onMonthChange(parseInt(e.target.value, 10))}
                              className={cn(
                                "px-3 py-2 border border-gray-300 rounded-md",
                                "bg-white text-sm font-medium",
                                "focus:outline-none focus:ring-2 focus:ring-primary-500"
                              )}
                              data-testid="month-selector"
                            >
                              {monthOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                          
                          {/* Input pentru an */}
                          {onYearChange && (
                            <input
                              type="number"
                              value={year.toString()}
                              onChange={(e) => {
                                const newYear = parseInt(e.target.value, 10);
                                if (!isNaN(newYear) && newYear > 1900 && newYear < 2100) {
                                  onYearChange(newYear);
                                }
                              }}
                              min="1900"
                              max="2100"
                              className={cn(
                                "w-20 px-2 py-2 border border-gray-300 rounded-md",
                                "bg-white text-sm font-medium text-center",
                                "focus:outline-none focus:ring-2 focus:ring-primary-500"
                              )}
                              data-testid="lunargrid-year-input"
                            />
                          )}
                          
                          {/* Buton fullscreen */}
                          <div
                            onClick={onToggleFullscreen || toggleFullscreen}
                            className={cn(
                              "cursor-pointer select-none",
                              "p-2 rounded-lg",
                              "hover:bg-primary-50 active:bg-primary-100",
                              "transition-all duration-150",
                              "flex items-center justify-center",
                              (isFullscreen || tableIsFullscreen) ? "bg-primary-100 text-primary-700" : "text-primary-600 hover:text-primary-800"
                            )}
                            title="Toggle fullscreen"
                            data-testid="layout-mode-toggle"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                (onToggleFullscreen || toggleFullscreen)();
                              }
                            }}
                          >
                            {(isFullscreen || tableIsFullscreen) ? (
                              <Minimize2 size={24} strokeWidth={2} />
                            ) : (
                              <Maximize2 size={24} strokeWidth={2} />
                            )}
                          </div>
                        </div>
                      </div>
                    </th>
                  </tr>
                  
                  {/* A doua secțiune: Headers cu zilele - în același thead */}
                  <tr className="bg-white border-t-0">
                    {table.getFlatHeaders().map((header, index) => {
                      const isFirstColumn = index === 0;
                      const isNumericColumn = header.id.startsWith("day-") || header.id === "total";
                      const isPinned = header.column.getIsPinned();
                      
                      return (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          className={cn(
                            gridCell({ 
                              type: "header",
                              size: "md",
                              frozen: isPinned ? "column" : false
                            }),
                            textProfessional({ variant: "heading", contrast: "enhanced" }),
                            isFirstColumn && "min-w-[200px]",
                            isNumericColumn && "w-20",
                            "select-none cursor-default"
                          )}
                          style={{ 
                            width: header.getSize(),
                            ...(isPinned && {
                              position: 'sticky',
                              left: 0,
                              zIndex: 10
                            })
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext()) as React.ReactNode}
                        </th>
                      );
                    })}
                  </tr>
                  
                  {/* 🎨 Professional Balance Row cu enhanced styling */}
                  <tr className={cn(gridRow({ type: "total" }), "bg-white border-t-0")}>
                    {table.getFlatHeaders().map((header, index) => {
                      const isFirstColumn = index === 0;
                      const isPinned = header.column.getIsPinned();
                      
                      if (isFirstColumn) {
                        return (
                          <th
                            key={`balance-${header.id}`}
                            className={cn(
                              gridCell({ 
                                type: "balance",
                                frozen: "both"
                              }),
                              textProfessional({ variant: "heading", contrast: "enhanced" }),
                              "select-none cursor-default"
                            )}
                            style={{
                              position: 'sticky',
                              left: 0,
                              top: 0,
                              zIndex: 30
                            }}
                          >
                            {UI.LUNAR_GRID_TOOLTIPS.DAILY_BALANCES}
                          </th>
                        );
                      }
                      
                      if (header.id.startsWith("day-")) {
                        const dayNumber = parseInt(header.id.split("-")[1], 10);
                        const dailyBalance = dailyBalances[dayNumber] || 0;
                        
                        return (
                          <th
                            key={`balance-${header.id}`}
                            className={cn(
                              gridCell({ 
                                type: "balance",
                                alignment: "center", // Center alignment pentru daily balance
                                state: dailyBalance > 0 ? "positive" : dailyBalance < 0 ? "negative" : "default" 
                              }),
                              "contrast-high",
                              dailyBalance > 0 ? "value-positive" : dailyBalance < 0 ? "value-negative" : "value-neutral",
                              "select-none cursor-default"
                            )}
                          >
                            {dailyBalance !== 0 ? formatCurrencyForGrid(dailyBalance) : "—"}
                          </th>
                        );
                      }
                      
                      if (header.id === "total") {
                        const monthTotal = Object.values(dailyBalances).reduce((sum, val) => sum + val, 0);
                        return (
                          <th
                            key={`balance-${header.id}`}
                            className={cn(
                              gridCell({ 
                                type: "balance",
                                alignment: "center", // Center alignment pentru month total 
                                state: monthTotal > 0 ? "positive" : monthTotal < 0 ? "negative" : "default" 
                              }),
                              "contrast-high",
                              monthTotal > 0 ? "value-positive" : monthTotal < 0 ? "value-negative" : "value-neutral",
                              "select-none cursor-default"
                            )}
                          >
                            {monthTotal !== 0 ? formatCurrencyForGrid(monthTotal) : "—"}
                          </th>
                        );
                      }
                      
                      return (
                        <th
                          key={`balance-${header.id}`}
                          className={cn(gridCell({ 
                            type: "balance",
                            alignment: "center" // Center alignment pentru empty balance cells
                          }))}
                        >
                          —
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => renderRow(row))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        {/* Toate modal-urile și popover-urile consolidate */}
        <LunarGridModals
          popover={popover}
          popoverStyle={popoverStyle}
          year={year}
          month={month}
          onSavePopover={handleSavePopover}
          onCancelPopover={() => setPopover(null)}
          modalState={modalState}
          onSaveModal={handleSaveModal}
          onCancelModal={handleCloseModal}
          onDeleteFromModal={handleDeleteFromModal}
        />

        {/* DeleteSubcategoryModal pentru delete subcategory */}
        <DeleteSubcategoryModal
          subcategoryAction={subcategoryAction}
          validTransactions={validTransactions}
          onConfirm={() => {
            if (subcategoryAction && subcategoryAction.type === 'delete') {
              handleDeleteSubcategory(subcategoryAction.category, subcategoryAction.subcategory);
            }
          }}
          onCancel={clearSubcategoryAction}
        />
      </>
    );
  },
);

// Add display name for debugging
LunarGridTanStack.displayName = 'LunarGridTanStack';

export default LunarGridTanStack;
