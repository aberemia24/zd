import React, { useCallback, useMemo, memo } from 'react';
import { flexRender, Row } from "@tanstack/react-table";
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Constants și shared (@shared-constants)
import { 
  TransactionType, 
  FrequencyType, 
  LUNAR_GRID_MESSAGES, 
  MESAJE, 
  UI, 
  LUNAR_GRID 
} from "@shared-constants";
import { LUNAR_GRID_ACTIONS } from "@shared-constants/ui";

// Componente UI și features
import LunarGridRow from "./components/LunarGridRow";
import LunarGridToolbar from "./components/LunarGridToolbar";
import LunarGridModals from "./components/LunarGridModals";
import DeleteSubcategoryModal from "./components/DeleteSubcategoryModal";

// Hooks specializate
import {
  useLunarGridTable,
  TransformedTableDataRow,
} from "./hooks/useLunarGridTable";
import { useKeyboardNavigation, type CellPosition } from "./hooks/useKeyboardNavigation";
import { useLunarGridState } from "./hooks/useLunarGridState";
import { useMonthlyTransactions } from '../../../services/hooks/useMonthlyTransactions';
import {
  useCreateTransactionMonthly,
  useUpdateTransactionMonthly,
  useDeleteTransactionMonthly
} from '../../../services/hooks/transactionMutations';

// Store-uri
import { useCategoryStore } from "../../../stores/categoryStore";
import { useAuthStore } from "../../../stores/authStore";

// Utilitare și styling
import { formatCurrencyForGrid, formatMonthYear } from "../../../utils/lunarGrid";
import { calculatePopoverStyle } from "../../../utils/lunarGrid/lunarGridHelpers";
import { cn } from "../../../styles/cva/shared/utils";
import {
  gridContainer,
  gridTable,
  gridHeader,
  gridHeaderCell,
  gridTotalRow,
  gridCell,
  gridMessage,
} from "../../../styles/cva/grid";
import {
  flex,
} from "../../../styles/cva/components/layout";

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
}

// Componenta principală - utilizăm memo pentru a preveni re-renderizări inutile
const LunarGridTanStack: React.FC<LunarGridTanStackProps> = memo(
  ({ year, month }) => {
    // Import userId from auth store pentru hooks monthly
    const { user } = useAuthStore();

    // Hook pentru CategoryStore pentru adăugarea subcategoriilor
    const { categories, saveCategories } = useCategoryStore();

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

    // Hooks pentru mutații de tranzacții cu cache optimization  
    const createTransactionMutation = useCreateTransactionMonthly(year, month, user?.id);
    const updateTransactionMutation = useUpdateTransactionMonthly(year, month, user?.id);
    const deleteTransactionMutation = useDeleteTransactionMonthly(year, month, user?.id);

    // React Query client pentru invalidation cache
    const queryClient = useQueryClient();

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
        const numValue = typeof value === "string" ? parseFloat(value) : value;

        if (isNaN(numValue)) {
          throw new Error("Valoare invalidă");
        }

        const isoDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        if (transactionId) {
          // UPDATE: Modifică tranzacția existentă
          await updateTransactionMutation.mutateAsync({
            id: transactionId,
            transactionData: {
              amount: numValue,
              date: isoDate,
              category,
              subcategory: subcategory || undefined,
              type: TransactionType.EXPENSE,
            }
          });
        } else {
          // CREATE: Creează o tranzacție nouă
          await createTransactionMutation.mutateAsync({
            amount: numValue,
            date: isoDate,
            category,
            subcategory: subcategory || undefined,
            type: TransactionType.EXPENSE,
            description: `${category}${subcategory ? ` - ${subcategory}` : ""} (${day}/${month}/${year})`,
          });
        }
      },
      [
        year,
        month,
        updateTransactionMutation,
        createTransactionMutation,
      ],
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
        if (!e.shiftKey) return;

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
        if (!popover) {
          return;
        }

        const {
          category,
          subcategory,
          day,
          type: transactionTypeFromPopover,
        } = popover;

        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const commonPayload = {
          amount: Number(formData.amount),
          category,
          subcategory: subcategory || undefined,
          type: transactionTypeFromPopover as TransactionType,
          date,
          recurring: formData.recurring,
          frequency: formData.recurring ? (formData.frequency as FrequencyType) : undefined,
        };

        createTransactionMutation.mutate(commonPayload, {
          onSuccess: () => {
            setPopover(null);
          },
          onError: () => {
            setPopover(null);
          },
        });
      },
      [popover, year, month, createTransactionMutation, setPopover],
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
        const mode = transactionId ? 'edit' : 'add';
        
        // Calculează poziția pentru modal dacă avem elementul anchor
        let position: { top: number; left: number } | undefined;
        if (anchorElement) {
          const rect = anchorElement.getBoundingClientRect();
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          const scrollX = window.scrollX || document.documentElement.scrollLeft;
          
          // Dimensiuni estimate ale modal-ului
          const modalWidth = 320; // 80 * 4 = 320px (w-80)
          const modalHeight = 384; // max-h-96 = ~384px
          
          // Verifică dacă modal-ul ar ieși din viewport
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          let top = rect.bottom + scrollY + 8; // 8px offset sub element
          let left = rect.left + scrollX;
          
          // Ajustează horizontal dacă ar ieși din viewport
          if (left + modalWidth > viewportWidth) {
            left = Math.max(16, viewportWidth - modalWidth - 16); // 16px margin
          }
          
          // Ajustează vertical dacă ar ieși din viewport
          if (top + modalHeight > viewportHeight + scrollY) {
            // Plasează modal-ul deasupra elementului
            top = rect.top + scrollY - modalHeight - 8;
            
            // Dacă tot nu încape, plasează-l în centrul viewport-ului
            if (top < scrollY + 16) {
              top = scrollY + (viewportHeight - modalHeight) / 2;
            }
          }
          
          position = { top, left };
        }
        
        setModalState({
          isOpen: true,
          mode,
          category,
          subcategory,
          day,
          year,
          month,
          existingValue: currentValue,
          transactionId,
          anchorEl: anchorElement,
          position,
        });

        // LGI TASK 5: Setează highlight-ul pentru celula în editare
        setHighlightedCell({
          category,
          subcategory,
          day,
        });
      },
      [year, month, setModalState, setHighlightedCell],
    );

    // LGI TASK 5: Handler pentru salvarea din modal
    const handleSaveModal = useCallback(
      async (data: {
        amount: string;
        description: string;
        recurring: boolean;
        frequency?: FrequencyType;
      }) => {
        if (!modalState) return;

        const { category, subcategory, day, transactionId, mode } = modalState;
        const numValue = parseFloat(data.amount);
        
        if (isNaN(numValue)) {
          throw new Error("Valoare invalidă");
        }

        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        if (mode === 'edit' && transactionId) {
          // UPDATE: Modifică tranzacția existentă
          await updateTransactionMutation.mutateAsync({
            id: transactionId,
            transactionData: {
              amount: numValue,
              date,
              category,
              subcategory: subcategory || undefined,
              type: TransactionType.EXPENSE,
              description: data.description,
            }
          });
        } else {
          // CREATE: Creează o tranzacție nouă  
          await createTransactionMutation.mutateAsync({
            amount: numValue,
            date,
            category,
            subcategory: subcategory || undefined,
            type: TransactionType.EXPENSE,
            description: data.description || `${category}${subcategory ? ` - ${subcategory}` : ""} (${day}/${month}/${year})`,
          });
        }

        // Închide modal-ul după salvare
        setModalState(null);
        setHighlightedCell(null);
      },
      [modalState, year, month, updateTransactionMutation, createTransactionMutation, setModalState, setHighlightedCell],
    );

    // Handler pentru închiderea modal-ului
    const handleCloseModal = useCallback(() => {
      setModalState(null);
      setHighlightedCell(null);
    }, [setModalState, setHighlightedCell]);

    // Handler pentru delete transaction din modal
    const handleDeleteFromModal = useCallback(
      async () => {
        if (!modalState || !modalState.transactionId) return;

        try {
          await deleteTransactionMutation.mutateAsync(modalState.transactionId);
          // Închide modal-ul după delete
          setModalState(null);
          setHighlightedCell(null);
          toast.success(LUNAR_GRID_ACTIONS.DELETE_SUCCESS_SINGLE);
        } catch (error) {
          toast.error("Eroare la ștergerea tranzacției. Încercați din nou.");
        }
      },
      [modalState, deleteTransactionMutation, setModalState, setHighlightedCell],
    );

    // Handler pentru ștergerea unei subcategorii custom
    const handleDeleteSubcategory = useCallback(
      async (categoryName: string, subcategoryName: string) => {
        if (!user?.id) {
          return;
        }

        try {
          // Găsește categoria în store
          const category = categories.find(cat => cat.name === categoryName);
          if (!category) {
            toast.error(MESAJE.CATEGORII.CATEGORIA_NEGASITA);
            return;
          }

          // Găsește subcategoria și verifică că este custom
          const subcategoryToDelete = category.subcategories.find(sub => sub.name === subcategoryName);
          if (!subcategoryToDelete) {
            toast.error("Subcategoria nu a fost găsită");
            return;
          }

          if (!subcategoryToDelete.isCustom) {
            toast.error("Nu se pot șterge subcategoriile predefinite");
            return;
          }

          // Creează categoria actualizată cu subcategoria eliminată
          const updatedCategories = categories.map(cat => {
            if (cat.name === categoryName) {
              return {
                ...cat,
                subcategories: cat.subcategories.filter(sub => sub.name !== subcategoryName)
              };
            }
            return cat;
          });

          // Salvează în CategoryStore
          await saveCategories(user.id, updatedCategories);
          
          // 🔄 FORCE INVALIDATION: Invalidează cache-ul React Query pentru a forța re-fetch
          queryClient.invalidateQueries({
            queryKey: ["transactions", year, month, user.id],
          });
          
          // Reset state
          clearSubcategoryAction();
          
          toast.success(MESAJE.CATEGORII.SUCCES_STERGERE_SUBCATEGORIE);
        } catch (error) {
          toast.error(MESAJE.CATEGORII.EROARE_STERGERE_SUBCATEGORIE);
        }
      },
      [user?.id, categories, saveCategories, queryClient, year, month, clearSubcategoryAction],
    );

    // Handler pentru adăugarea unei subcategorii noi
    const handleAddSubcategory = useCallback(
      async (categoryName: string) => {
        if (!user?.id || !newSubcategoryName.trim()) {
          return;
        }

        try {
          // Găsește categoria în store TOATE categoriile disponibile, nu doar custom ones
          let category = categories.find(cat => cat.name === categoryName);
          
          // Dacă categoria nu există în store, o creăm (poate fi o categorie default)
          if (!category) {
            category = {
              name: categoryName,
              type: TransactionType.EXPENSE, // Default type
              subcategories: [],
              isCustom: true
            };
          }

          // Verifică limita de 5 subcategorii CUSTOM (nu toate subcategoriile)
          const customSubcategoriesCount = category.subcategories.filter(sub => sub.isCustom).length;
          if (customSubcategoriesCount >= 5) {
            toast.error(MESAJE.CATEGORII.MAXIM_SUBCATEGORII);
            setNewSubcategoryName("");
            return;
          }

          // Verifică dacă subcategoria deja există
          if (category.subcategories.some(sub => sub.name === newSubcategoryName.trim())) {
            toast.error(MESAJE.CATEGORII.SUBCATEGORIE_EXISTENTA);
            return;
          }

          // Construiește categoria actualizată
          const updatedCategory = {
            ...category,
            subcategories: [
              ...category.subcategories,
              { name: newSubcategoryName.trim(), isCustom: true }
            ]
          };

          // Construiește lista completă de categorii actualizată
          const updatedCategories = categories.map(cat => 
            cat.name === categoryName ? updatedCategory : cat
          );

          // Dacă categoria era nouă, o adaugă
          if (!categories.find(cat => cat.name === categoryName)) {
            updatedCategories.push(updatedCategory);
          }

          await saveCategories(user.id, updatedCategories);
          
          // 🔄 FORCE INVALIDATION: Invalidează cache-ul React Query pentru a forța re-fetch
          queryClient.invalidateQueries({
            queryKey: ["transactions", year, month, user.id],
          });
          
          // Reset state-ul
          setAddingSubcategory(null);
          setNewSubcategoryName("");
          
          toast.success(MESAJE.CATEGORII.SUCCES_ADAUGARE_SUBCATEGORIE);
        } catch (error) {
          toast.error(MESAJE.CATEGORII.EROARE_ADAUGARE_SUBCATEGORIE);
        }
      },
      [user?.id, newSubcategoryName, categories, saveCategories, queryClient, year, month, setAddingSubcategory, setNewSubcategoryName],
    );

    // Handler pentru rename subcategorie custom
    const handleRenameSubcategory = useCallback(
      async (categoryName: string, oldSubcategoryName: string, newSubcategoryName: string) => {
        if (!user?.id || !newSubcategoryName.trim()) {
          return;
        }

        try {
          // Găsește categoria în store
          const category = categories.find(cat => cat.name === categoryName);
          if (!category) {
            toast.error(MESAJE.CATEGORII.CATEGORIA_NEGASITA);
            return;
          }

          // Verifică dacă noul nume deja există
          if (category.subcategories.some(sub => sub.name === newSubcategoryName.trim() && sub.name !== oldSubcategoryName)) {
            toast.error(MESAJE.CATEGORII.SUBCATEGORIE_EXISTENTA);
            return;
          }

          // Creează categoria actualizată cu subcategoria redenumită
          const updatedCategories = categories.map(cat => {
            if (cat.name === categoryName) {
              return {
                ...cat,
                subcategories: cat.subcategories.map(sub => 
                  sub.name === oldSubcategoryName 
                    ? { ...sub, name: newSubcategoryName.trim() }
                    : sub
                )
              };
            }
            return cat;
          });

          // Salvează în CategoryStore
          await saveCategories(user.id, updatedCategories);
          
          // Reset state
          clearSubcategoryAction();
          
          toast.success(MESAJE.CATEGORII.SUCCES_REDENUMIRE_SUBCATEGORIE);
        } catch (error) {
          toast.error(MESAJE.CATEGORII.EROARE_REDENUMIRE);
        }
      },
      [user?.id, categories, saveCategories, clearSubcategoryAction],
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
        if (!user?.id || positions.length === 0) return;

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
            expandedRows={expandedRows}
            subcategoryAction={subcategoryAction}
            editingSubcategoryName={editingSubcategoryName}
            highlightedCell={highlightedCell}
            addingSubcategory={addingSubcategory}
            newSubcategoryName={newSubcategoryName}
            table={table}
            transactionMap={transactionMap}
            onExpandToggle={(rowId, isExpanded) => {
              setExpandedRows(prev => ({
                ...prev,
                [rowId]: isExpanded
              }));
            }}
            onSubcategoryEdit={handleRenameSubcategory}
            onSubcategoryDelete={(category, subcategory) => {
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
      [categories, expandedRows, subcategoryAction, editingSubcategoryName, highlightedCell, addingSubcategory, newSubcategoryName, table, transactionMap, setExpandedRows, handleRenameSubcategory, setEditingSubcategoryName, clearSubcategoryAction, startEditingSubcategory, startDeletingSubcategory, handleEditableCellSave, handleSingleClickModal, navHandleCellClick, handleAddSubcategory, cancelAddingSubcategory, setAddingSubcategory, setNewSubcategoryName, isPositionFocused, isPositionSelected],
    );

    // Renderizare (layout principal)
    return (
      <>
        <LunarGridToolbar
          table={table}
          expandedRows={expandedRows}
          setExpandedRows={setExpandedRows}
          validTransactions={validTransactions}
          onCleanOrphanTransactions={() => {
            // TODO: Implementează curățarea tranzacțiilor orfane
            console.log("Clean orphan transactions");
          }}
        />

        {/* Header principal global: Luna și anul în română - fix deasupra tabelului */}
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
              {/* 🎨 Professional Header cu enhanced styling */}
              <thead className={cn(gridHeader({ variant: "professional" }))}>
                <tr>
                  {table.getFlatHeaders().map((header, index) => {
                    const isFirstColumn = index === 0;
                    const isNumericColumn = header.id.startsWith("day-") || header.id === "total";
                    
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className={cn(
                          gridHeaderCell({ 
                            variant: isFirstColumn ? "sticky" : isNumericColumn ? "numeric" : "professional",
                          }),
                          "text-professional-heading contrast-enhanced",
                          isFirstColumn && "min-w-[200px]",
                          isNumericColumn && "w-20"
                        )}
                        style={{ width: header.getSize() }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext()) as React.ReactNode}
                      </th>
                    );
                  })}
                </tr>
                
                {/* 🎨 Professional Balance Row cu enhanced styling */}
                <tr className={cn(gridTotalRow({ variant: "balance" }))}>
                  {table.getFlatHeaders().map((header, index) => {
                    const isFirstColumn = index === 0;
                    
                    if (isFirstColumn) {
                      return (
                        <th
                          key={`balance-${header.id}`}
                          className={cn(
                            gridCell({ type: "balance" }),
                            "text-professional-heading contrast-enhanced"
                          )}
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
                              state: dailyBalance > 0 ? "positive" : dailyBalance < 0 ? "negative" : "zero" 
                            }),
                            "text-xs font-financial contrast-high",
                            dailyBalance > 0 ? "value-positive" : dailyBalance < 0 ? "value-negative" : "value-neutral"
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
                              state: monthTotal > 0 ? "positive" : monthTotal < 0 ? "negative" : "zero" 
                            }),
                            "text-sm font-financial contrast-enhanced",
                            monthTotal > 0 ? "value-positive" : monthTotal < 0 ? "value-negative" : "value-neutral"
                          )}
                        >
                          {monthTotal !== 0 ? formatCurrencyForGrid(monthTotal) : "—"}
                        </th>
                      );
                    }
                    
                    return (
                      <th
                        key={`balance-${header.id}`}
                        className={cn(gridCell({ type: "balance" }))}
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

export default LunarGridTanStack;
