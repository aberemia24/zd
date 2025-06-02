import React, { memo, useEffect } from 'react';
import {
  useLunarGridTable,
} from "./hooks/useLunarGridTable";

// Importuri din stores
import { useCategoryStore } from "../../../stores/categoryStore";
import { useAuthStore } from "../../../stores/authStore";

// 🎯 PHASE 1: Import useMonthlyTransactions pentru a avea acces direct la validTransactions
import { useMonthlyTransactions } from '../../../services/hooks/useMonthlyTransactions';

// Importăm tipuri și constante din shared-constants (sursa de adevăr)
import { LUNAR_GRID_MESSAGES, LUNAR_GRID } from "@shared-constants";

// Import componentele UI
import CellTransactionPopover from "./CellTransactionPopover";

// 🔧 TASK-01: Import LunarGridToolbar component pentru Phase 1 refactoring
import LunarGridToolbar from "./components/LunarGridToolbar";

// 🔧 TASK-02: Import DeleteSubcategoryModal component pentru Phase 1 refactoring  
import DeleteSubcategoryModal from "./components/DeleteSubcategoryModal";

// 🎯 Step 3.3: Import singleton formatters pentru performanță
import { formatMonthYear } from "../../../utils/lunarGrid";

// Import CVA styling system cu professional enhancements pentru LGI-TASK-08
import { cn } from "../../../styles/cva/shared/utils";
import {
  // 🎨 Professional Grid Components 
  gridContainer,
  gridTable,
  gridMessage,
} from "../../../styles/cva/grid";
import {
  flex,
} from "../../../styles/cva/components/layout";

// LGI TASK 5: Modal component import
import { QuickAddModal } from "./modals/QuickAddModal";

// 🔧 PHASE 6: Import usePersistentExpandedRows hook pentru expanded state management
import { usePersistentExpandedRows } from "./hooks/usePersistentExpandedRows";

// 🔧 TASK-04: Import componente extrase pentru Phase 2 refactoring
import LunarGridModals from './components/LunarGridModals';
import LunarGridTableRow from './components/LunarGridTableRow';

// 🔧 PHASE 3: Import useLunarGridSubcategories hook pentru Phase 3 refactoring
import { useLunarGridSubcategories } from "./hooks/useLunarGridSubcategories";

// 🔧 PHASE 4: Import useLunarGridTransactionHandlers hook pentru extragerea transaction handlers
import { useLunarGridTransactionHandlers } from "./hooks/useLunarGridTransactionHandlers";

// 🔧 PHASE 5: Import LunarGridHeader component pentru header extraction
import LunarGridHeader from "./components/LunarGridHeader";

// 🔧 PHASE 7: Import useLunarGridModalState hook pentru modal state management
import { useLunarGridModalState } from "./hooks/useLunarGridModalState";

// 🔧 PHASE 9: Import useLunarGridRendering hook pentru extragerea renderEditableCell
import { useLunarGridRendering } from "./hooks/useLunarGridRendering";

// 🔧 PHASE 10: Import useLunarGridToolbarHandlers hook pentru extragerea toolbar handlers
import { useLunarGridToolbarHandlers } from "./hooks/useLunarGridToolbarHandlers";

// Import LunarGridCell component pentru renderEditableCell
import LunarGridCell from "./components/LunarGridCell";

export interface LunarGridTanStackProps {
  year: number;
  month: number;
}

// Componenta principală - utilizăm memo pentru a preveni re-renderizări inutile
const LunarGridTanStack: React.FC<LunarGridTanStackProps> = memo(
  ({ year, month }) => {
    // 🔧 PHASE 7: Înlocuim toate state-urile de modal cu hook-ul dedicat
    const {
      // Modal state
      modalState,
      setModalState,
      popover,
      setPopover,
      highlightedCell,
      setHighlightedCell,
      
      // Computed
      popoverStyle,
      
      // Handlers
      handleCloseModal,
      handleDeleteFromModal,
    } = useLunarGridModalState();

    // State persistent pentru expanded rows (salvat în localStorage)
    const [expandedRows, setExpandedRows] = usePersistentExpandedRows(year, month);

    // Import userId from auth store pentru hooks monthly
    const { user } = useAuthStore();

    // Hook pentru CategoryStore pentru adăugarea subcategoriilor
    const { categories } = useCategoryStore();

    // 🎯 PHASE 1: Hook pentru tranzacțiile reale cu datele corecte pentru Financial Projections
    const { transactions: validTransactions } = useMonthlyTransactions(year, month, user?.id, {
      includeAdjacentDays: true,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 5 * 60 * 1000,
    });

    // 🔧 PHASE 4: Înlocuim toți transaction handlers cu hook-ul dedicat
    const {
      // Mutation pentru delete
      deleteTransactionMutation,
      // Event handlers pentru celulele de grid
      handleCellClick: handleCellClickFromHook,
      handleSavePopover: handleSavePopoverFromHook,
      handleSingleClickModal: handleSingleClickModalFromHook,
      handleEditableCellSave,
    } = useLunarGridTransactionHandlers(year, month, validTransactions);

    // 🔧 PHASE 18: Wrapper handlers direct în component (eliminare useLunarGridFinalCleanup)
    const handleCellClick = (
      e: React.MouseEvent,
      category: string,
      subcategory: string | undefined,
      day: number,
      amount: string,
    ) => {
      handleCellClickFromHook(e, category, subcategory, day, amount, setPopover);
    };

    const handleSavePopover = async (formData: {
      amount: string;
      recurring: boolean;
      frequency?: any;
    }) => {
      await handleSavePopoverFromHook(popover, setPopover, formData);
    };

    const handleSingleClickModal = (
      category: string,
      subcategory: string | undefined,
      day: number,
      currentValue: string | number,
      transactionId: string | null,
      anchorElement?: HTMLElement,
    ) => {
      handleSingleClickModalFromHook(
        category,
        subcategory,
        day,
        currentValue,
        transactionId,
        anchorElement,
        setModalState,
        setHighlightedCell
      );
    };

    // 🔧 PHASE 2: Hook pentru managementul stării tabelului și coloanelor
    const { table, isLoading, error, dailyBalances, tableContainerRef, transactionMap } =
      useLunarGridTable(
        year,
        month,
        expandedRows,
        handleCellClick
      );

    // 🔧 PHASE 18: Effects direct în component (eliminare useLunarGridEffectsAndNavigation)
    // Verificare temporară: Detectează tranzacții fără subcategorie (nu ar trebui să existe)
    useEffect(() => {
      if (validTransactions && validTransactions.length > 0) {
        const transactionsWithoutSubcategory = validTransactions.filter(t => 
          t.category && (!t.subcategory || t.subcategory.trim() === "")
        );
        
        if (transactionsWithoutSubcategory.length > 0) {
          console.error("🚨 TRANZACȚII FĂRĂ SUBCATEGORIE DETECTATE (Date murdare):", 
            transactionsWithoutSubcategory.map(t => ({
              id: t.id,
              amount: t.amount,
              date: t.date,
              category: t.category,
              subcategory: t.subcategory,
              description: t.description
            }))
          );
          console.warn("⚠️ Aceste tranzacții ar trebui șterse sau migrate către subcategorii!");
        }
      }
    }, [validTransactions]);

    // 🔧 PHASE 3: Înlocuim managementul subcategoriilor cu hook-ul dedicat
    const {
      // State
      addingSubcategory,
      setAddingSubcategory,
      
      // Handlers
      handleAddSubcategory,
      handleCancelAddSubcategory,
      handleRenameSubcategory,
    } = useLunarGridSubcategories(year, month, validTransactions);

    // 🔧 PHASE 10: Înlocuim toolbar handlers cu hook-ul dedicat
    const {
      handleToggleExpandAll,
      handleResetExpanded,
      handleCleanOrphans,
      orphanTransactionsCount,
      getIsAllRowsExpanded,
    } = useLunarGridToolbarHandlers({
      table,
      setExpandedRows,
      validTransactions,
    });

    // 🔧 PHASE 18: Funcția renderEditableCell direct în component (eliminare useLunarGridRendering)
    const renderEditableCell = (
      category: string,
      subcategory: string | undefined,
      day: number,
      currentValue: string | number,
    ) => {
      const cellId = `${category}-${subcategory || "null"}-${day}`;
      
      // Identifică transactionId pentru diferențierea CREATE vs UPDATE
      const transactionKey = `${category}-${subcategory || ''}-${day}`;
      const transactionId = transactionMap.get(transactionKey) || null;

      // Verifică dacă celula este highlighted (în editare în modal)
      const isHighlighted = highlightedCell && 
        highlightedCell.category === category &&
        highlightedCell.subcategory === subcategory &&
        highlightedCell.day === day;

      return (
        <LunarGridCell
          category={category}
          subcategory={subcategory}
          day={day}
          currentValue={currentValue}
          transactionId={transactionId}
          isHighlighted={isHighlighted || undefined}
          isFocused={false}
          isSelected={false}
          onSave={async (value) => {
            try {
              await handleEditableCellSave(category, subcategory, day, value, transactionId);
            } catch (error) {
              console.error("Eroare la salvarea celulei:", error);
              throw error;
            }
          }}
          onSingleClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetElement = e.currentTarget as HTMLElement;
            const processedValue = typeof currentValue === "string" 
              ? currentValue.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".") 
              : String(currentValue);
            handleSingleClickModal(category, subcategory, day, processedValue, transactionId, targetElement);
          }}
        />
      );
    };

    // Renderizare (layout principal)
    return (
      <>
        {/* 🔧 TASK-01: LunarGridToolbar component extraction - Phase 1 Safe Extraction */}
        <LunarGridToolbar
          onToggleExpandAll={handleToggleExpandAll}
          onResetExpanded={handleResetExpanded}
          orphanTransactionsCount={orphanTransactionsCount}
          onCleanOrphans={handleCleanOrphans}
          getIsAllRowsExpanded={getIsAllRowsExpanded}
        />

        {/* 🎯 HEADER PRINCIPAL GLOBAL: Luna și anul în română - COMPLET FIX deasupra tabelului */}
        {!isLoading && !error && table.getRowModel().rows.length > 0 && (
          <div className="w-full py-4 mb-4 text-center border-b-2 border-gray-200 bg-white">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {formatMonthYear(month, year)}
            </h2>
          </div>
        )}

        <div 
          ref={tableContainerRef}
          className={cn(
            gridContainer({ 
              variant: "professional", 
              size: "fullscreen",
              state: isLoading ? "loading" : undefined 
            }),
            "relative",
            "transition-all duration-200 hover-lift",
            "focus-ring"
          )}
          data-testid="lunar-grid-container"
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
          {/* 🎨 Professional Loading State */}
          {isLoading && (
            <div className={cn(
              gridMessage({ variant: "professional" }),
              flex({ align: "center", justify: "center" }),
              "p-8 animate-fade-in-up"
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
              gridMessage({ variant: "error" }),
              flex({ align: "center", justify: "center" }),
              "p-8 animate-slide-down"
            )} 
            data-testid="error-indicator">
              {LUNAR_GRID_MESSAGES.EROARE_INCARCARE}
            </div>
          )}
          
          {/* 🎨 Professional Empty State */}
          {!isLoading && !error && table.getRowModel().rows.length === 0 && (
            <div className={cn(
              gridMessage({ variant: "info" }),
              flex({ align: "center", justify: "center" }),
              "p-8 animate-scale-in"
            )} 
            data-testid="no-data-indicator">
              {LUNAR_GRID.NO_DATA}
            </div>
          )}
          
          {/* 🎨 Professional Grid Table - FĂRĂ header luna/anul în interior */}
          {!isLoading && !error && table.getRowModel().rows.length > 0 && (
            <table 
              className={cn(gridTable({ variant: "professional", density: "default" }))}
              data-testid="lunar-grid-table"
            >
              {/* 🔧 PHASE 5: Header extrast în componenta dedicată */}
              <LunarGridHeader 
                table={table} 
                dailyBalances={dailyBalances} 
              />
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <LunarGridTableRow
                    key={row.id}
                    row={row}
                    categories={categories}
                    table={table}
                    renderEditableCell={renderEditableCell}
                    setExpandedRows={setExpandedRows}
                    addingSubcategory={addingSubcategory}
                    newSubcategoryName={''}
                    handleAddSubcategory={handleAddSubcategory}
                    handleCancelAddSubcategory={handleCancelAddSubcategory}
                    setAddingSubcategory={setAddingSubcategory}
                    subcategoryAction={null}
                    editingSubcategoryName={''}
                    setEditingSubcategoryName={() => {}}
                    setSubcategoryAction={() => {}}
                    handleRenameSubcategory={handleRenameSubcategory}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Popover pentru editare tranzacție */}
        {popover && (
          <div 
            className={cn(
              "fixed z-50 shadow-lg rounded-lg",
              "animate-fadeIn transition-all duration-150"
            )}
            style={popoverStyle}
            data-testid="transaction-popover"
          >
            <CellTransactionPopover
              initialAmount={popover.amount || ""}
              day={popover.day}
              month={month}
              year={year}
              category={popover.category}
              subcategory={popover.subcategory || ""}
              type={popover.type}
              onSave={handleSavePopover}
              onCancel={() => setPopover(null)}
            />
          </div>
        )}

        {/* 🎯 LGI-TASK-02: DeleteSubcategoryModal component extraction - Phase 1 Safe Extraction */}
        <DeleteSubcategoryModal
          isOpen={false}
          subcategoryName={''}
          categoryName={''}
          transactionsCount={0}
          onConfirm={() => {}}
          onCancel={() => {}}
        />

        {/* 🔧 TASK-04: LunarGridModals container pentru Phase 2 complex UI extractions */}
        <LunarGridModals
          year={year}
          month={month}
          popover={popover}
          setPopover={setPopover}
          popoverStyle={popoverStyle}
          handleSavePopover={handleSavePopover}
        />

        {/* LGI TASK 5: QuickAddModal pentru single click */}
        {modalState && (
          <QuickAddModal
            cellContext={{
              category: modalState.category,
              subcategory: modalState.subcategory,
              day: modalState.day,
              month: modalState.month,
              year: modalState.year,
            }}
            prefillAmount={modalState.existingValue ? String(modalState.existingValue) : ""}
            mode={modalState.mode}
            position={modalState.position}
            onSave={async (data) => {
              await handleEditableCellSave(
                modalState.category,
                modalState.subcategory,
                modalState.day,
                data.amount,
                modalState.transactionId || null,
              );
              handleCloseModal();
            }}
            onCancel={handleCloseModal}
            onDelete={async () => {
              if (modalState.transactionId) {
                await deleteTransactionMutation.mutateAsync(modalState.transactionId);
                handleCloseModal();
              }
            }}
          />
        )}
      </>
    );
  },
);

// Adăugăm displayName pentru debugging mai ușor
LunarGridTanStack.displayName = "LunarGridTanStack";

export default LunarGridTanStack;
