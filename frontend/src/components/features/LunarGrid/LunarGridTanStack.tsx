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
import LunarGridTable from "./components/LunarGridTable";
import LunarGridModalManager from "./components/LunarGridModalManager";
import Button from "../../primitives/Button/Button";

// Hooks specializate
import {
  useLunarGridTable,
  TransformedTableDataRow,
} from "./hooks/useLunarGridTable";
import { useKeyboardNavigationSimplified, type CellPosition as SimpleCellPosition } from "./hooks/useKeyboardNavigationSimplified";

// Type conversion utilities for CellPosition compatibility
type LegacyCellPosition = {
  category: string;
  subcategory?: string;
  day: number;
  rowIndex: number;
  colIndex: number;
};

const convertToSimple = (legacy: LegacyCellPosition): SimpleCellPosition => ({
  categoryIndex: legacy.rowIndex,
  day: legacy.day,
});

const convertToLegacy = (simple: SimpleCellPosition, rows: Array<{category: string; subcategory?: string}>): LegacyCellPosition => {
  const row = rows[simple.categoryIndex];
  return {
    category: row.category,
    subcategory: row.subcategory,
    day: simple.day,
    rowIndex: simple.categoryIndex,
    colIndex: simple.day - 1,
  };
};
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
    // Optimizat pentru optimistic updates - cache redus pentru a detecta schimbările
    const { transactions: validTransactions } = useMonthlyTransactions(year, month, user?.id, {
      includeAdjacentDays: true,
      refetchOnMount: false, // Nu refetch automat la mount dacă datele sunt fresh
      staleTime: 0, // 🔥 FIX: Cache zero pentru a permite detecția optimistic updates
      refetchOnWindowFocus: false, // Evită refresh la focus
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

    // Note: Real handlers should come from LunarGridEventHandler component
    // Current implementation uses placeholders until full EventHandler integration
    const handleSingleClickModal = useCallback(
      (category: string, subcategory: string | undefined, day: number, value: string | number, transactionId: string | null, element: HTMLElement) => {
        // PLACEHOLDER: Real implementation in LunarGridEventHandler
        console.log('Single click modal (placeholder):', { category, subcategory, day, value, transactionId });
      },
      []
    );

    const handleAddSubcategory = useCallback(
      (category: string) => {
        // PLACEHOLDER: Real implementation in LunarGridEventHandler  
        console.log('Add subcategory (placeholder):', category);
      },
      []
    );

    // Interogare tabel optimizată (fără handleri de click/double-click)
    const { table, isLoading, error, days, dailyBalances, tableContainerRef, transactionMap } =
      useLunarGridTable(year, month, expandedRows);

    // Prepare data pentru keyboard navigation
    const navigationRows = useMemo(() => {
      return table.getRowModel().rows.map(row => ({
        category: row.original.category,
        subcategory: row.original.subcategory,
        isExpanded: row.getIsExpanded(),
      }));
    }, [table]);

    // Keyboard navigation hook cu delete support (simplified)
    const keyboardNav = useKeyboardNavigationSimplified({
      totalDays: days.length,
      totalRows: navigationRows.length,
      rows: navigationRows,
      isActive: !modalState?.isOpen && !popover?.isOpen, // Dezactivează navigation când modal/popover e deschis
      onDeleteRequest: async (positions: SimpleCellPosition[]) => {
        if (!user?.id || positions.length === 0) {return;}

        try {
          // Convert simple positions to legacy format for existing logic
          const legacyPositions = positions.map(pos => convertToLegacy(pos, navigationRows));
          
          // Găsește tranzacțiile care există pentru pozițiile selectate
          const transactionsToDelete: string[] = [];
          
          for (const pos of legacyPositions) {
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
      onEditMode: (position: SimpleCellPosition) => {
        // Convert simple position to legacy for existing logic
        const legacyPosition = convertToLegacy(position, navigationRows);
        
        // Trigger inline edit mode pentru poziția selectată
        // Găsește celula și trigger edit mode similar cu double click
        const categoryRow = table.getRowModel().rows.find(row => 
          row.original.category === legacyPosition.category && 
          (!legacyPosition.subcategory || row.original.subcategory === legacyPosition.subcategory)
        );
        if (categoryRow) {
          // TODO: Implementează edit mode direct pentru pozițiile focalizate
        }
      },
    });

    // Create wrapper functions with legacy interface for backward compatibility
    const navHandleCellClick = useCallback(
      (position: LegacyCellPosition, modifiers?: { ctrlKey?: boolean; shiftKey?: boolean; metaKey?: boolean }) => {
        const simplePosition = convertToSimple(position);
        keyboardNav.handleCellClick(simplePosition, modifiers);
      },
      [keyboardNav.handleCellClick]
    );

    const isPositionFocused = useCallback(
      (position: LegacyCellPosition) => {
        const simplePosition = convertToSimple(position);
        return keyboardNav.isPositionFocused(simplePosition);
      },
      [keyboardNav.isPositionFocused]
    );

    const isPositionSelected = useCallback(
      (position: LegacyCellPosition) => {
        const simplePosition = convertToSimple(position);
        return keyboardNav.isPositionSelected(simplePosition);
      },
      [keyboardNav.isPositionSelected]
    );

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
            isPositionFocused={(position) => Boolean(isPositionFocused(position))}
            isPositionSelected={(position) => Boolean(isPositionSelected(position))}
            onAddSubcategory={handleAddSubcategory}
            onCancelAddingSubcategory={cancelAddingSubcategory}
            onSetAddingSubcategory={setAddingSubcategory}
            onSetNewSubcategoryName={setNewSubcategoryName}
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
              <>
                {/* Tabelul cu header integrat - NU mai avem header separat */}
                <LunarGridTable
                  table={table}
                  dailyBalances={dailyBalances}
                  renderRow={renderRow}
                  highlightedCell={highlightedCell}
                  isPositionSelected={(position) => Boolean(isPositionSelected(position))}
                  isPositionFocused={(position) => Boolean(isPositionFocused(position))}
                  onCellClick={navHandleCellClick}
                  // Header props - transmise către LunarGridTable pentru integrare
                  year={year}
                  month={month}
                  onYearChange={onYearChange}
                  onMonthChange={onMonthChange}
                  monthOptions={monthOptions}
                  isAllRowsExpanded={table.getIsAllRowsExpanded()}
                  onToggleExpandAll={() => {
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
                  onResetExpanded={() => {
                    setExpandedRows({});
                    table.resetExpanded();
                  }}
                  isFullscreen={isFullscreen || tableIsFullscreen}
                  onToggleFullscreen={onToggleFullscreen || toggleFullscreen}
                />
              </>
            )}
          </div>
        </div>
        
        {/* Modal Manager - toate modal-urile și popover-urile consolidate */}
        <LunarGridModalManager
          popover={popover}
          popoverStyle={popoverStyle || {}}
          onSavePopover={(formData) => transactionOps.handleSavePopover(popover, formData)}
          onCancelPopover={() => setPopover(null)}
          modalState={modalState}
          onSaveModal={(data) => transactionOps.handleSaveModal(modalState, data)}
          onCancelModal={() => setModalState(null)}
          onDeleteFromModal={() => transactionOps.handleDeleteFromModal(modalState)}
          subcategoryAction={subcategoryAction}
          validTransactions={validTransactions}
          onConfirmSubcategoryAction={() => {
            if (subcategoryAction && subcategoryAction.type === 'delete') {
              subcategoryOps.handleDeleteSubcategory(subcategoryAction.category, subcategoryAction.subcategory);
            }
          }}
          onCancelSubcategoryAction={clearSubcategoryAction}
          year={year}
          month={month}
        />
      </>
    );
  },
);

// Add display name for debugging
LunarGridTanStack.displayName = 'LunarGridTanStack';

export default LunarGridTanStack;
