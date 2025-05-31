import React, { useCallback, useState, useMemo, CSSProperties, memo, useEffect } from 'react';
import { flexRender, Row } from "@tanstack/react-table";
import {
  useLunarGridTable,
  TransformedTableDataRow,
} from "./hooks/useLunarGridTable";

// 🎯 Step 1.6: Import toast pentru UX feedback
import toast from 'react-hot-toast';

// Importuri din stores
import { useCategoryStore } from "../../../stores/categoryStore";
import { useAuthStore } from "../../../stores/authStore";

// React Query și hooks pentru tranzacții
import {
  useCreateTransactionMonthly,
  useUpdateTransactionMonthly,
  useDeleteTransactionMonthly,
  type CreateTransactionHookPayload,
  type UpdateTransactionHookPayload
} from '../../../services/hooks/transactionMutations';

// 🎯 PHASE 1: Import useMonthlyTransactions pentru a avea acces direct la validTransactions
import { useMonthlyTransactions } from '../../../services/hooks/useMonthlyTransactions';

// Importăm tipuri și constante din shared-constants (sursa de adevăr)
import { TransactionType, FrequencyType, LUNAR_GRID_MESSAGES, MESAJE, FLAGS, PLACEHOLDERS, UI, BUTTONS, TITLES, LABELS, EXCEL_GRID } from "@shared-constants";
import { LUNAR_GRID_ACTIONS } from "@shared-constants/ui";
import { LUNAR_GRID } from "@shared-constants";

// Import componentele UI
import Button from "../../primitives/Button/Button";
import Badge from "../../primitives/Badge/Badge";
import CellTransactionPopover from "./CellTransactionPopover";
import { EditableCell } from "./inline-editing/EditableCell";

// Import pentru Plus icon pentru butonul de adăugare subcategorie
import { Plus, Edit, Trash2, ChevronRight } from "lucide-react";

// 🎯 Step 3.3: Import singleton formatters pentru performanță
import { formatCurrency, getBalanceStyleClass } from "../../../utils/lunarGrid";

// Import CVA styling system cu professional enhancements pentru LGI-TASK-08
import { cn } from "../../../styles/cva/shared/utils";
import {
  // 🎨 Professional Grid Components 
  gridContainer,
  gridTable,
  gridHeader,
  gridHeaderCell,
  gridCategoryRow,
  gridSubcategoryRow,
  gridTotalRow,
  gridCell,
  gridExpandIcon,
  gridCellActions,
  gridActionButton,
  gridBadge,
  gridInput,
  gridMessage,
  // 🚨 CVA EXTENSIONS - AUDIT FIX PHASE 1 - New CVA components
  gridInteractive,
  gridValueState,
  gridTransactionCell,
  gridSubcategoryState,
} from "../../../styles/cva/grid";
import {
  // Data Table Components (păstrez din vechiul sistem pentru compatibilitate)
  dataTable,
  tableHeader,
  tableCell,
  tableRow,
} from "../../../styles/cva/data";
import {
  flex,
  modal,
  modalContent,
  container as gridContainerLayout,
} from "../../../styles/cva/components/layout";

// Interfață pentru categoria din store
interface CategoryStoreItem {
  name: string;
  type: TransactionType;
  subcategories: Array<{ name: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

// Interfață pentru starea popover-ului de tranzacții
interface PopoverState {
  isOpen: boolean;
  category: string;
  subcategory: string | undefined;
  day: number;
  amount: string;
  type: TransactionType;
  element: HTMLElement | null;
  anchorEl?: HTMLElement;
}

// Hook pentru persistent expanded state
const usePersistentExpandedRows = (year: number, month: number) => {
  const storageKey = `lunarGrid-expanded-${year}-${month}`;
  
  // Încarcă starea din localStorage la mount
  const [expandedRows, setExpandedRowsState] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Eroare la încărcarea stării expanded din localStorage:', error);
      return {};
    }
  });

  // Salvează starea în localStorage de fiecare dată când se schimbă
  const setExpandedRows = useCallback((newState: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => {
    setExpandedRowsState(prev => {
      const finalState = typeof newState === 'function' ? newState(prev) : newState;
      
      try {
        localStorage.setItem(storageKey, JSON.stringify(finalState));
      } catch (error) {
        console.warn('Eroare la salvarea stării expanded în localStorage:', error);
      }
      
      return finalState;
    });
  }, [storageKey]);

  return [expandedRows, setExpandedRows] as const;
};

export interface LunarGridTanStackProps {
  year: number;
  month: number;
}

// Componenta principală - utilizăm memo pentru a preveni re-renderizări inutile
const LunarGridTanStack: React.FC<LunarGridTanStackProps> = memo(
  ({ year, month }) => {
    // State pentru popover (păstrat doar pentru modal advanced)
    const [popover, setPopover] = useState<PopoverState | null>(null);

    // State persistent pentru expanded rows (salvat în localStorage)
    const [expandedRows, setExpandedRows] = usePersistentExpandedRows(year, month);

    // Import userId from auth store pentru hooks monthly
    const { user } = useAuthStore();

    // Hook pentru CategoryStore pentru adăugarea subcategoriilor
    const { categories, saveCategories } = useCategoryStore();

    // State pentru input temporar la adăugarea subcategoriei
    const [addingSubcategory, setAddingSubcategory] = useState<string | null>(null);
    const [newSubcategoryName, setNewSubcategoryName] = useState<string>("");

    // 🎯 LGI-TASK-02: State pentru inline edit/delete subcategory actions
    const [subcategoryAction, setSubcategoryAction] = useState<{
      type: 'edit' | 'delete';
      category: string;
      subcategory: string;
    } | null>(null);
    const [editingSubcategoryName, setEditingSubcategoryName] = useState<string>("");

    // 🎯 PHASE 1: Hook pentru tranzacțiile reale cu datele corecte pentru Financial Projections
    // 🚀 FIX: Dezactivez refetchOnWindowFocus pentru a evita refresh automat la focus
    const { transactions: validTransactions } = useMonthlyTransactions(year, month, user?.id, {
      includeAdjacentDays: true,
      // Opțiuni pentru a preveni refresh automat la focus
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Nu refetch automat la mount dacă datele sunt fresh
      staleTime: 5 * 60 * 1000, // 5 minute cache pentru a evita refresh-uri inutile
    });

    // 🚨 VERIFICARE TEMPORARĂ: Detectează tranzacții fără subcategorie (nu ar trebui să existe)
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

    // FAZA 1: Hooks pentru mutații de tranzacții cu cache optimization  
    const createTransactionMutation = useCreateTransactionMonthly(year, month, user?.id);
    const updateTransactionMutation = useUpdateTransactionMonthly(year, month, user?.id);
    const deleteTransactionMutation = useDeleteTransactionMonthly(year, month, user?.id);

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

        const date = new Date(year, month - 1, day);
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
          console.warn("No currentTarget available for popover anchor");
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
      [determineTransactionType],
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
          type: transactionTypeFromPopover,
          date,
          recurring: formData.recurring,
          frequency: formData.recurring ? formData.frequency : undefined,
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
      [popover, year, month, createTransactionMutation],
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

          await saveCategories(user.id, [
            ...categories,
            {
              ...category,
              subcategories: [
                ...category.subcategories,
                { name: newSubcategoryName.trim(), isCustom: true }
              ]
            }
          ]);
          
          // Reset state-ul
          setAddingSubcategory(null);
          setNewSubcategoryName("");
          
          toast.success(MESAJE.CATEGORII.SUCCES_ADAUGARE_SUBCATEGORIE);
        } catch (error) {
          console.error("Eroare la adăugarea subcategoriei:", error);
          toast.error(MESAJE.CATEGORII.EROARE_ADAUGARE_SUBCATEGORIE);
        }
      },
      [user?.id, newSubcategoryName, categories, saveCategories],
    );

    // Handler pentru anularea adăugării subcategoriei
    const handleCancelAddSubcategory = useCallback(() => {
      setAddingSubcategory(null);
      setNewSubcategoryName("");
    }, []);

    // 🎯 LGI-TASK-02: Handler pentru rename subcategorie custom
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
          setSubcategoryAction(null);
          setEditingSubcategoryName("");
          
          toast.success(MESAJE.CATEGORII.SUCCES_REDENUMIRE_SUBCATEGORIE);
        } catch (error) {
          console.error("Eroare la redenumirea subcategoriei:", error);
          toast.error(MESAJE.CATEGORII.EROARE_REDENUMIRE);
        }
      },
      [user?.id, categories, saveCategories],
    );

    // 🎯 LGI-TASK-02: Handler pentru delete subcategorie custom
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

          // Verifică dacă subcategoria este custom
          const subcategory = category.subcategories.find(sub => sub.name === subcategoryName);
          if (!subcategory?.isCustom) {
            toast.error(MESAJE.CATEGORII.DOAR_CUSTOM_STERGERE);
            return;
          }

          // Găsește toate tranzacțiile asociate cu această subcategorie
          const associatedTransactions = validTransactions.filter(t => 
            t.category === categoryName && t.subcategory === subcategoryName
          );

          // 🗑️ HARD DELETE: Șterge toate tranzacțiile asociate din baza de date
          if (associatedTransactions.length > 0) {
            console.log(`🗑️ Ștergând ${associatedTransactions.length} tranzacții asociate cu subcategoria "${subcategoryName}"`);
            
            for (const transaction of associatedTransactions) {
              await deleteTransactionMutation.mutateAsync(transaction.id);
              console.log(`✅ Șters: ${transaction.id} (${transaction.amount} RON)`);
            }
          }

          // Creează categoria actualizată fără subcategoria ștearsă
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
          
          // Reset state
          setSubcategoryAction(null);
          
          const transactionCount = associatedTransactions?.length || 0;
          const transactionText = transactionCount === 0 
            ? LUNAR_GRID_ACTIONS.NO_TRANSACTIONS
            : transactionCount === 1 
              ? "1 tranzacție"
              : `${transactionCount} tranzacții`;

          if (associatedTransactions.length > 0) {
            toast.success(`Subcategoria și ${associatedTransactions.length} tranzacții asociate au fost șterse definitiv`);
          } else {
            toast.success(MESAJE.CATEGORII.SUCCES_STERGERE_SUBCATEGORIE);
          }
        } catch (error) {
          console.error("Eroare la ștergerea subcategoriei:", error);
          toast.error(MESAJE.CATEGORII.EROARE_STERGERE_SUBCATEGORIE);
        }
      },
      [user?.id, categories, saveCategories, validTransactions, deleteTransactionMutation],
    );

    // Interogare tabel optimizată (fără handleri de click/double-click)
    const { table, isLoading, error, days, dailyBalances, tableContainerRef, transactionMap } =
      useLunarGridTable(year, month, expandedRows, handleCellClick);

    // 🚨 FILTRARE TEMPORARĂ: Exclude tranzacții fără subcategorie din procesare
    const cleanTransactions = useMemo(() => {
      return validTransactions.filter(t => 
        t.category && t.subcategory && t.subcategory.trim() !== ""
      );
    }, [validTransactions]);

    // Render pentru celula editabilă folosind EditableCell component
    const renderEditableCell = useCallback(
      (
        category: string,
        subcategory: string | undefined,
        day: number,
        currentValue: string | number,
      ) => {
        const cellId = `${category}-${subcategory || "null"}-${day}`;
        
        // 🔍 Step 1.1: Identifică transactionId pentru diferențierea CREATE vs UPDATE
        const transactionKey = `${category}-${subcategory || ''}-${day}`;
        const transactionId = transactionMap.get(transactionKey) || null;

        // Parseaza valoarea existentă corect pentru display
        let displayValue = "";
        if (currentValue && currentValue !== "-" && currentValue !== "—") {
          if (typeof currentValue === "string") {
            // Elimină formatarea pentru editing
            displayValue = currentValue
              .replace(/[^\d,.-]/g, "")
              .replace(/\./g, "")
              .replace(",", ".");
          } else {
            displayValue = String(currentValue);
          }
        }

        return (
          <EditableCell
            cellId={cellId}
            value={displayValue}
            onSave={async (value) => {
              try {
                // 🎯 Step 1.1: Transmite transactionId la handleEditableCellSave
                await handleEditableCellSave(category, subcategory, day, value, transactionId);
              } catch (error) {
                console.error("Eroare la salvarea celulei:", error);
                throw error; // Re-throw pentru EditableCell să gestioneze eroarea
              }
            }}
            validationType="amount"
            className={cn(
              gridTransactionCell({
                state: transactionId ? "existing" : "new"
              })
            )}
            data-testid={`editable-cell-${cellId}`}
            placeholder={transactionId ? PLACEHOLDERS.EDIT_TRANSACTION : PLACEHOLDERS.ADD_TRANSACTION}
          />
        );
      },
      [handleEditableCellSave, transactionMap],
    );

    // Helper pentru stiluri de valori - REFACTORIZAT cu CVA
    const getBalanceStyle = useCallback((value: number): string => {
      if (!value) return gridValueState({ state: "empty" });
      return gridValueState({ 
        state: value > 0 ? "positive" : "negative",
        weight: "semibold"
      });
    }, []);

    // Gestionarea poziției popover-ului
    const popoverStyle = useMemo((): CSSProperties => {
      if (!popover || !popover.anchorEl) return {};

      // Verifică dacă elementul este încă în DOM
      try {
        const rect = popover.anchorEl.getBoundingClientRect();
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollX = window.scrollX || document.documentElement.scrollLeft;

        return {
          position: "absolute",
          top: `${rect.top + scrollY}px`,
          left: `${rect.left + scrollX}px`,
        };
      } catch (error) {
        console.warn(
          "Could not get bounding rect for popover anchor element:",
          error,
        );
        return {};
      }
    }, [popover]);

    // Funcție helper pentru randarea recursivă a rândurilor
    const renderRow = useCallback(
      (
        row: Row<TransformedTableDataRow>,
        level: number = 0,
      ): React.ReactNode => {
        const { original } = row;
        const isCategory = original.isCategory;
        const isSubcategory = !isCategory && original.subcategory;

        // Verifică câte subcategorii CUSTOM are categoria (nu toate subcategoriile)
        const categoryData = categories.find(cat => cat.name === original.category);
        const customSubcategoriesCount = categoryData?.subcategories?.filter(sub => sub.isCustom)?.length || 0;
        const canAddSubcategory = isCategory && row.getIsExpanded() && customSubcategoriesCount < 5;

        // DEBUG: Verifică logica pentru subcategoriile custom
        if (isCategory && row.getIsExpanded()) {
          console.log('DEBUG Category:', original.category, {
            totalSubcategories: row.subRows?.length || 0,
            customSubcategoriesCount,
            canAdd: canAddSubcategory,
            categoryData: categoryData ? {
              name: categoryData.name,
              subcategories: categoryData.subcategories?.map(sub => ({ name: sub.name, isCustom: sub.isCustom }))
            } : 'Not found in store'
          });
        }

        return (
          <React.Fragment key={row.id}>
            {/* 🎨 Professional Row Styling cu enhanced visual hierarchy */}
            <tr
              className={cn(
                isCategory 
                  ? gridCategoryRow({ 
                      variant: "professional",
                      state: row.getIsExpanded() ? "selected" : undefined
                    })
                  : gridSubcategoryRow({ 
                      variant: (() => {
                        const categoryData = categories.find(cat => cat.name === original.category);
                        const subcategoryData = categoryData?.subcategories?.find(sub => sub.name === original.subcategory);
                        return subcategoryData?.isCustom ? "custom" : "professional";
                      })()
                    }),
                "interactive animate-fade-in-up",
                row.getIsExpanded() && "border-b border-gray-200/60"
              )}
            >
              {row.getVisibleCells().map((cell, cellIdx) => {
                const isFirstCell = cellIdx === 0;
                const isDayCell = cell.column.id.startsWith("day-");
                const isTotalCell = cell.column.id === "total";

                // 🎨 Determine professional cell type și state
                const cellType = isCategory && isFirstCell ? "category" :
                               !isCategory && isFirstCell ? "subcategory" :
                               isDayCell ? "value" :
                               isTotalCell ? "total" :
                               "value";

                // 🎨 Professional cell state detection cu enhanced color psychology
                const cellValue = cell.getValue() as string | number;
                const cellState = isDayCell && cellValue && cellValue !== "-" && cellValue !== "—" 
                  ? (typeof cellValue === 'number' && cellValue > 0) || 
                    (typeof cellValue === 'string' && parseFloat(cellValue.replace(/[^\d,.-]/g, '').replace(',', '.')) > 0)
                    ? "positive" 
                    : "negative"
                  : undefined;

                // 🎨 Phase 4: Enhanced styling classes pentru visual hierarchy
                const valueClasses = isDayCell && cellValue && cellValue !== "-" && cellValue !== "—" 
                  ? (typeof cellValue === 'number' && cellValue > 0) || 
                    (typeof cellValue === 'string' && parseFloat(cellValue.replace(/[^\d,.-]/g, '').replace(',', '.')) > 0)
                    ? "value-positive font-financial" 
                    : "value-negative font-financial"
                  : "";

                return (
                  <td
                    key={cell.id}
                    className={cn(
                      gridCell({
                        type: cellType,
                        state: cellState,
                        size: "default"
                      }),
                      "text-professional",
                      isFirstCell && level > 0 && "pl-8",
                      isDayCell && "hover-scale focus-ring",
                      isTotalCell && "font-semibold tabular-nums",
                      valueClasses
                    )}
                    title={
                      isCategory && isDayCell
                        ? UI.LUNAR_GRID_TOOLTIPS.CALCULATED_SUM
                        : undefined
                    }
                  >
                    {isFirstCell && isCategory ? (
                      // 🎨 Professional Category Cell cu enhanced interactions
                      <div 
                        className={cn(
                          gridCellActions({ variant: "always", position: "left" }),
                          "cursor-pointer interactive rounded-md p-2",
                          "hover:bg-gray-50/80 active:scale-98"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          row.toggleExpanded();
                          setExpandedRows(prev => ({
                            ...prev,
                            [row.id]: !row.getIsExpanded()
                          }));
                        }}
                        title={row.getIsExpanded() ? LUNAR_GRID.COLLAPSE_CATEGORY_TITLE : LUNAR_GRID.EXPAND_CATEGORY_TITLE}
                        data-testid={`toggle-category-${original.category}`}
                      >
                        <div className={flex({ align: "center", gap: "sm" })}>
                          <div className={cn(
                            gridExpandIcon({
                              variant: "professional",
                              state: row.getIsExpanded() ? "expanded" : "collapsed"
                            })
                          )}>
                            <ChevronRight size={16} />
                          </div>
                          <span className="text-gray-800 font-medium">
                            {flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode}
                          </span>
                        </div>
                      </div>
                    ) : isFirstCell && isSubcategory ? (
                      // 🎨 Professional Subcategory Cell cu enhanced badge și actions
                      <div className={flex({ justify: "between", gap: "sm", width: "full" })}>
                        <div className={flex({ align: "center", gap: "md" })}>
                          {/* 🎨 Editing Mode cu professional styling */}
                          {subcategoryAction?.type === 'edit' && 
                           subcategoryAction.category === original.category && 
                           subcategoryAction.subcategory === original.subcategory ? (
                            <div className={flex({ align: "center", gap: "sm" })}>
                              <input
                                type="text"
                                value={editingSubcategoryName}
                                onChange={(e) => setEditingSubcategoryName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === LUNAR_GRID_ACTIONS.ENTER_KEY && editingSubcategoryName.trim()) {
                                    handleRenameSubcategory(original.category, original.subcategory!, e.currentTarget.value);
                                  } else if (e.key === LUNAR_GRID_ACTIONS.ESCAPE_KEY) {
                                    setEditingSubcategoryName("");
                                  }
                                }}
                                className={cn(
                                  gridInput({ variant: "professional", state: "editing" }),
                                  "flex-1 animate-scale-in focus-ring-primary"
                                )}
                                autoFocus
                                data-testid={`edit-subcategory-input-${original.subcategory}`}
                              />
                              <Button
                                size="xs"
                                variant="primary"
                                onClick={() => handleRenameSubcategory(original.category, original.subcategory!, editingSubcategoryName)}
                                disabled={!editingSubcategoryName.trim()}
                                data-testid={`save-edit-subcategory-${original.subcategory}`}
                                className="hover-scale"
                              >
                                ✓
                              </Button>
                              <Button
                                size="xs"
                                variant="secondary"
                                onClick={() => {
                                  setSubcategoryAction(null);
                                  setEditingSubcategoryName("");
                                }}
                                data-testid={`cancel-edit-subcategory-${original.subcategory}`}
                                className="hover-scale"
                              >
                                ✕
                              </Button>
                            </div>
                          ) : (
                            // 🎨 Normal Mode cu professional text și badge
                            <div className={flex({ align: "center", gap: "md" })}>
                              <span className="text-professional-body contrast-high">
                                {flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode}
                              </span>
                              {(() => {
                                const categoryData = categories.find(cat => cat.name === original.category);
                                const subcategoryData = categoryData?.subcategories?.find(sub => sub.name === original.subcategory);
                                return subcategoryData?.isCustom ? (
                                  <div className={cn(
                                    gridBadge({ variant: "custom", size: "sm" }),
                                    "animate-bounce-subtle text-professional-caption"
                                  )}>
                                    {FLAGS.CUSTOM}
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          )}
                        </div>
                        
                        {/* 🎨 Professional Action Buttons cu enhanced hover effects */}
                        {subcategoryAction?.type !== 'edit' && (() => {
                          const categoryData = categories.find(cat => cat.name === original.category);
                          const subcategoryData = categoryData?.subcategories?.find(sub => sub.name === original.subcategory);
                          return subcategoryData?.isCustom ? (
                            <div className={cn(
                              gridCellActions({ variant: "professional" }),
                              "animate-fade-in-up"
                            )}>
                              <button
                                className={cn(
                                  gridActionButton({ variant: "primary", size: "sm" }),
                                  "hover-lift"
                                )}
                                onClick={() => {
                                  setSubcategoryAction({
                                    type: 'edit',
                                    category: original.category,
                                    subcategory: original.subcategory!
                                  });
                                  setEditingSubcategoryName(original.subcategory!);
                                }}
                                data-testid={`edit-subcategory-btn-${original.subcategory}`}
                                title={UI.SUBCATEGORY_ACTIONS.RENAME_TITLE}
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                className={cn(
                                  gridActionButton({ variant: "danger", size: "sm" }),
                                  "hover-lift"
                                )}
                                onClick={() => {
                                  setSubcategoryAction({
                                    type: 'delete',
                                    category: original.category,
                                    subcategory: original.subcategory!
                                  });
                                }}
                                data-testid={`delete-subcategory-btn-${original.subcategory}`}
                                title={UI.SUBCATEGORY_ACTIONS.DELETE_CUSTOM_TITLE}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    ) : isDayCell && isSubcategory ? (
                      // 🎨 Professional Editable Cell
                      <div className="interactive focus-ring">
                        {renderEditableCell(
                          original.category,
                          original.subcategory,
                          parseInt(cell.column.id.split("-")[1]),
                          cell.getValue() as string | number,
                        )}
                      </div>
                    ) : (
                      // 🎨 Default Professional Cell
                      <span className="text-professional">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        ) as React.ReactNode}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* 🎨 Professional Expanded Rows */}
            {row.getIsExpanded() &&
              row.subRows &&
              row.subRows.length > 0 &&
              row.subRows.map((subRow) => renderRow(subRow, level + 1))}

            {/* 🎨 Professional Add Subcategory Row */}
            {canAddSubcategory && (
              <tr className={cn(
                gridSubcategoryRow({ variant: "professional" }),
                gridSubcategoryState({ variant: "adding" })
              )}>
                <td 
                  className={cn(
                    gridCell({ type: "subcategory" }),
                    gridSubcategoryState({ cell: "backdrop" })
                  )}
                >
                  {addingSubcategory === original.category ? (
                    // 🎨 Professional Input Mode
                    <div className={flex({ align: "center", gap: "md" })}>
                      <input
                        type="text"
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        placeholder={PLACEHOLDERS.SUBCATEGORY_NAME}
                        className={cn(
                          gridInput({ variant: "professional", state: "editing" }),
                          "flex-1 focus-ring-primary"
                        )}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === LUNAR_GRID_ACTIONS.ENTER_KEY) {
                            handleAddSubcategory(original.category);
                          } else if (e.key === LUNAR_GRID_ACTIONS.ESCAPE_KEY) {
                            handleCancelAddSubcategory();
                          }
                        }}
                        data-testid={`new-subcategory-input-${original.category}`}
                      />
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAddSubcategory(original.category)}
                        disabled={!newSubcategoryName.trim()}
                        data-testid={`save-subcategory-${original.category}`}
                        className="hover-scale"
                      >
                        ✓
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleCancelAddSubcategory}
                        data-testid={`cancel-subcategory-${original.category}`}
                        className="hover-scale"
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    // 🎨 Professional Add Button
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setAddingSubcategory(original.category)}
                      className={cn(
                        gridInteractive({ variant: "addButton", size: "auto" }),
                        flex({ align: "center", gap: "sm" })
                      )}
                      data-testid={`add-subcategory-${original.category}`}
                    >
                      <Plus size={14} className="text-professional-primary" />
                      <span className="text-professional-body font-medium">{BUTTONS.ADD_SUBCATEGORY}</span>
                    </Button>
                  )}
                </td>
                {/* 🎨 Professional Empty Cells */}
                {table.getFlatHeaders().slice(1).map((header) => (
                  <td 
                    key={`add-subcategory-${header.id}`} 
                    className={cn(gridCell({ type: "value", state: "readonly" }))}
                  >
                    {/* Empty cell cu subtle styling */}
                  </td>
                ))}
              </tr>
            )}
          </React.Fragment>
        );
      },
      [renderEditableCell, categories, addingSubcategory, newSubcategoryName, handleAddSubcategory, handleCancelAddSubcategory, table, subcategoryAction, editingSubcategoryName, handleRenameSubcategory],
    );

    // Handler pentru ștergerea tranzacțiilor fără subcategorie (DEBUGGING ONLY)
    const handleCleanOrphanTransactions = useCallback(async () => {
      if (!user?.id) return;
      
      const orphanTransactions = validTransactions.filter(t => 
        t.category && (!t.subcategory || t.subcategory.trim() === "")
      );
      
      if (orphanTransactions.length === 0) {
        toast.success("Nu există tranzacții orfane de curățat!");
        return;
      }
      
      const confirmed = window.confirm(
        `Sigur vrei să ștergi ${orphanTransactions.length} tranzacții fără subcategorie?\n\n` +
        `Acestea sunt:\n${orphanTransactions.map(t => 
          `- ${t.category}: ${t.amount} RON (${t.date})`
        ).join('\n')}`
      );
      
      if (!confirmed) return;
      
      try {
        console.log("🗑️ Ștergând tranzacții orfane:", orphanTransactions.map(t => t.id));
        
        // Șterge fiecare tranzacție folosind hook-ul de delete
        for (const transaction of orphanTransactions) {
          await deleteTransactionMutation.mutateAsync(transaction.id);
          console.log(`✅ Șters: ${transaction.id} (${transaction.category}: ${transaction.amount} RON)`);
        }
        
        toast.success(`${orphanTransactions.length} tranzacții orfane șterse cu succes!`);
      } catch (error) {
        console.error("Eroare la ștergerea tranzacțiilor orfane:", error);
        toast.error(MESAJE.CATEGORII.EROARE_STERGERE_ORFANE);
      }
    }, [validTransactions, user?.id, deleteTransactionMutation]);

    // 🎯 LGI-TASK-02: Confirmation dialog pentru delete subcategory
    const DeleteSubcategoryConfirmation = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => {
      if (!subcategoryAction || subcategoryAction.type !== 'delete') return null;

      // Calculează numărul de tranzacții asociate cu această subcategorie
      const transactionsCount = validTransactions.filter(t => 
        t.category === subcategoryAction.category && 
        t.subcategory === subcategoryAction.subcategory
      ).length;

      const transactionText = transactionsCount === 0 
        ? LUNAR_GRID_ACTIONS.NO_TRANSACTIONS
        : transactionsCount === 1 
          ? "1 tranzacție"
          : `${transactionsCount} tranzacții`;

      const message = `Sigur doriți să ștergeți subcategoria "${subcategoryAction.subcategory}" din categoria "${subcategoryAction.category}" (${transactionText})? Această acțiune nu poate fi anulată${transactionsCount > 0 ? ' și toate tranzacțiile asociate vor fi șterse definitiv din baza de date' : ''}.`;

      return (
        <div className={modal({ variant: "confirmation", animation: "fade" })} data-testid="delete-subcategory-confirmation">
          <div className={modalContent()}>
            <h3 className={modalContent({ content: "header" })}>
              {MESAJE.CATEGORII.CONFIRMARE_STERGERE_TITLE}
            </h3>
            <p className={modalContent({ content: "text" })}>{message}</p>
            <div className={flex({ justify: "end", gap: "md" })}>
              <Button
                variant="secondary"
                size="sm"
                onClick={onCancel}
                dataTestId="cancel-delete-subcategory"
              >
                {BUTTONS.CANCEL}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={onConfirm}
                dataTestId="confirm-delete-subcategory"
              >
                {BUTTONS.DELETE}
              </Button>
            </div>
          </div>
        </div>
      );
    };

    // Renderizare (layout principal)
    return (
      <>
        <div className={cn(flex({ direction: "row", justify: "start", gap: "md" }), "mb-4")}>
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
              // Dacă se colapsează, lăsăm newExpandedState gol (toate false)
              
              setExpandedRows(newExpandedState);
              table.toggleAllRowsExpanded(!isCurrentlyExpanded);
            }}
            dataTestId="toggle-expand-all"
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
            dataTestId="reset-expanded"
          >
            {LUNAR_GRID.RESET_EXPANSION}
          </Button>
          
          {/* 🚨 BUTON TEMPORAR DEBUGGING: Curățare tranzacții orfane */}
          {validTransactions.some(t => t.category && (!t.subcategory || t.subcategory.trim() === "")) && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleCleanOrphanTransactions}
              dataTestId="clean-orphan-transactions"
              title={UI.SUBCATEGORY_ACTIONS.DELETE_ORPHAN_TITLE}
            >
              🗑️ Curăță tranzacții orfane ({validTransactions.filter(t => t.category && (!t.subcategory || t.subcategory.trim() === "")).length})
            </Button>
          )}
        </div>

        <div 
          ref={tableContainerRef}
          className={cn(
            gridContainer({ 
              variant: "professional", 
              size: "default",
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
          
          {/* 🎨 Professional Grid Table */}
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
                          {dailyBalance !== 0 ? formatCurrency(dailyBalance) : "—"}
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
                          {monthTotal !== 0 ? formatCurrency(monthTotal) : "—"}
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

        {/* 🎯 LGI-TASK-02: Confirmation dialog pentru delete subcategory */}
        <DeleteSubcategoryConfirmation
          onConfirm={() => {
            if (subcategoryAction?.type === 'delete') {
              handleDeleteSubcategory(subcategoryAction.category, subcategoryAction.subcategory);
            }
          }}
          onCancel={() => setSubcategoryAction(null)}
        />
      </>
    );
  },
);

// Adăugăm displayName pentru debugging mai ușor
LunarGridTanStack.displayName = "LunarGridTanStack";

export default LunarGridTanStack;
