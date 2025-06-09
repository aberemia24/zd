import React, { useCallback, useMemo, memo, useEffect, useRef } from 'react';
import { flexRender, Row } from "@tanstack/react-table";
import toast from 'react-hot-toast';
import { Maximize2, Minimize2 } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';

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
import Button from "../../primitives/Button/Button";
import { TransactionPopover } from './modals';

// Hooks specializate
import {
  useLunarGridTable,
  TransformedTableDataRow,
} from "./hooks/useLunarGridTable";
import { useKeyboardNavigationSimplified, type CellPosition } from "./hooks/useKeyboardNavigationSimplified";

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

interface LunarGridRowProps {
  row: Row<TransformedTableDataRow>;
  categories: CategoryStoreItem[];
  _expandedRows: Record<string, boolean>;
  subcategoryAction: (category: string, subcategory: string) => void;
  editingSubcategoryName: string | null;
  _highlightedCell: CellPosition | null;
  addingSubcategory: string | null;
  newSubcategoryName: string;
  table: any;
  transactionMap: any;
  onExpandToggle: (rowId: string, isExpanded: boolean) => void;
  onSubcategoryEdit: (category: string, newName: string) => void;
  _onSubcategoryDelete: (category: string, subcategory: string) => void;
  onEditingValueChange: (newName: string | null) => void;
  onClearSubcategoryAction: () => void;
  onStartEditingSubcategory: (category: string) => void;
  onStartDeletingSubcategory: (category: string, subcategory: string) => void;
  onCellSave: (category: string, subcategory: string | undefined, day: number, value: string | number, transactionId: string | null) => Promise<void>;
  onSingleClickModal: (category: string, subcategory: string | undefined, day: number, value: string | number, transactionId: string | null, element: HTMLElement) => void;
  onCellClick: (position: CellPosition) => void;
  isPositionFocused: (position: CellPosition) => boolean;
  isPositionSelected: (position: CellPosition) => boolean;
  onAddSubcategory: (category: string) => void;
  onCancelAddingSubcategory: () => void;
  onSetAddingSubcategory: (category: string | null) => void;
  onSetNewSubcategoryName: (name: string) => void;
  year: number;
  month: number;
  validTransactions: any[];
  transactionOps: any;
}

// Componenta principală - utilizăm memo pentru a preveni re-renderizări inutile
const LunarGridTanStack: React.FC<LunarGridTanStackProps> = memo(
  ({ year, month, onYearChange, onMonthChange, isFullscreen, onToggleFullscreen, monthOptions }) => {
    // REMOVED: useStateManager feature flag and associated logic as it's not currently used.
    
    // Import userId from auth store pentru hooks monthly
    const { user } = useAuthStore();

    // State pentru subcategorii și modal - HYBRID: will come from StateManager when enabled
    const { categories } = useCategoryStore();

    // Hook consolidat pentru toate LunarGrid state-urile
    const {
      // Editing states
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
    } = useLunarGridState();

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

    // Reintroduce handleSingleClickModal with actual modal logic
    const handleSingleClickModal = useCallback(
      (category: string, subcategory: string | undefined, day: number, value: string | number, transactionId: string | null, element: HTMLElement) => {
        setHighlightedCell({
          category,
          subcategory,
          day,
          categoryIndex: 0, // Temporary value, will be calculated properly later
          rowIndex: 0, // Temporary value, will be calculated properly later  
          colIndex: day - 1,
        });
      },
      [setHighlightedCell],
    );

    // Reintroduce handleAddSubcategory with actual logic
    const handleAddSubcategory = useCallback(
      (category: string) => {
        setAddingSubcategory(category);
        setNewSubcategoryName("");
      },
      [setAddingSubcategory, setNewSubcategoryName],
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

    // Handle focus change from keyboard navigation and update highlightedCell
    const handleKeyboardFocusChange = useCallback((position: CellPosition | null) => {
      setHighlightedCell(position);
      console.log(`📍[LunarGridTanStack] Keyboard focus changed to:`, position);
    }, [setHighlightedCell]);

    // Keyboard navigation hook cu delete support (simplified)
    const keyboardNav = useKeyboardNavigationSimplified({
      totalDays: days.length,
      totalRows: navigationRows.length,
      rows: navigationRows,
      isActive: true, // Acum este mereu activ, popover-ul se ocupă de focus trapping
      onFocusChange: handleKeyboardFocusChange, // Pass the new focus handler
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
      onEditMode: (position: CellPosition) => {
        // TODO: Implementează edit mode direct pentru pozițiile focalizate
        // Trigger inline edit mode pentru poziția selectată
        const cellId = `${position.category}-${position.subcategory || ''}-${position.day}`;
        const cellElement = document.getElementById(cellId);
        if (cellElement) {
          const editableCellComponent = cellElement.querySelector('[data-editable-cell-input]') as HTMLElement;
          if (editableCellComponent) {
            editableCellComponent.focus();
          }
        }
      },
    });

    // Create wrapper functions with legacy interface for backward compatibility
    // REMOVED: Wrapper functions are no longer needed after unifying CellPosition types.
    const navHandleCellClick = keyboardNav.handleCellClick;
    const isPositionFocused = useCallback((position: CellPosition) => {
      const result = highlightedCell !== null &&
        highlightedCell.category === position.category &&
        highlightedCell.subcategory === position.subcategory &&
        highlightedCell.day === position.day;
      return result;
    }, [highlightedCell]);

    const isPositionSelected = useCallback((position: CellPosition) => {
      // For simplicity, selected = focused
      const result = isPositionFocused(position);
      console.log(`✨[LunarGridTanStack] isPositionSelected (Prop): comparing highlighted:`, highlightedCell, `with position:`, position, `-> Result:`, result);
      return result;
    }, [isPositionFocused, highlightedCell]);

    // Blocare scroll când modalul este deschis - UX Enhancement (doar scroll, nu operațiuni)
    useEffect(() => {
      const scrollableContainer = scrollableContainerRef.current;
      if (!scrollableContainer) {return;}

      if (highlightedCell) {
        // Salvează poziția actuală de scroll pentru tabel
        const currentScrollTop = scrollableContainer.scrollTop;
        const currentScrollLeft = scrollableContainer.scrollLeft;
        
        // Blochează scrollul tabelului
        scrollableContainer.style.overflow = 'hidden';
        scrollableContainer.style.position = 'relative';
        
        // Cleanup - restabilește scrollul când modalul se închide
        return () => {
          if (scrollableContainer) {
            // Restabilește scrollul tabelului
            scrollableContainer.style.overflow = 'auto';
            scrollableContainer.style.position = '';
            scrollableContainer.scrollTop = currentScrollTop;
            scrollableContainer.scrollLeft = currentScrollLeft;
          }
        };
      }
    }, [highlightedCell]);

    // Gestionarea poziției popover-ului
    // const popoverStyle = calculatePopoverStyle(highlightedCell); // Temporarily disabled

    // Simplified render pentru row folosind LunarGridRow component  
    const renderRow = useCallback(
      (row: Row<TransformedTableDataRow>) => {
        return (
          <LunarGridRow
            key={row.id}
            row={row}
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
            isPositionFocused={isPositionFocused}
            isPositionSelected={isPositionSelected}
            onAddSubcategory={handleAddSubcategory}
            onCancelAddingSubcategory={cancelAddingSubcategory}
            onSetAddingSubcategory={setAddingSubcategory}
            onSetNewSubcategoryName={setNewSubcategoryName}
            year={year}
            month={month}
            validTransactions={validTransactions}
            transactionOps={transactionOps}
          />
        );
      },
      [categories, expandedRows, subcategoryAction, editingSubcategoryName, highlightedCell, addingSubcategory, newSubcategoryName, table, transactionMap, setExpandedRows, subcategoryOps, handleEditableCellSave, handleSingleClickModal, navHandleCellClick, handleAddSubcategory, cancelAddingSubcategory, setAddingSubcategory, setNewSubcategoryName, isPositionFocused, isPositionSelected, year, month, validTransactions, transactionOps],
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
            e.preventDefault();
            e.stopPropagation();
          }}
          onWheel={(e) => {
            e.stopPropagation();
          }}
          tabIndex={0}
          style={{
            scrollBehavior: 'smooth'
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
        {/* (Removed LunarGridModalManager JSX) */}
      </>
    );
  },
);

// Add display name for debugging
LunarGridTanStack.displayName = 'LunarGridTanStack';

export default LunarGridTanStack;
