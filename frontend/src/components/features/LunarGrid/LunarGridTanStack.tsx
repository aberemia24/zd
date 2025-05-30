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
import { TransactionType, FrequencyType, LUNAR_GRID_MESSAGES, MESAJE, FLAGS } from "@shared-constants";
import { LUNAR_GRID } from "@shared-constants";

// Import componentele UI
import Button from "../../primitives/Button/Button";
import Badge from "../../primitives/Badge/Badge";
import CellTransactionPopover from "./CellTransactionPopover";
import { EditableCell } from "./inline-editing/EditableCell";

// Import pentru Plus icon pentru butonul de adăugare subcategorie
import { Plus, Edit, Trash2 } from "lucide-react";

// 🎯 Step 3.3: Import singleton formatters pentru performanță
import { formatCurrency, getBalanceStyleClass } from "../../../utils/lunarGrid";

// Import CVA styling system
import { cn } from "../../../styles/cva/shared/utils";
import {
  dataTable,
  tableHeader,
  tableCell,
  tableRow,
} from "../../../styles/cva/data";
import {
  flex as flexContainer,
  container as gridContainer,
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
            toast.error("Maxim 5 subcategorii custom permise per categorie");
            return;
          }

          // Verifică dacă subcategoria deja există
          if (category.subcategories.some(sub => sub.name === newSubcategoryName.trim())) {
            toast.error("Subcategoria deja există");
            return;
          }

          // Creează categoria actualizată cu noua subcategorie
          const updatedCategories = [...categories];
          const categoryIndex = updatedCategories.findIndex(cat => cat.name === categoryName);
          
          if (categoryIndex >= 0) {
            // Actualizează categoria existentă
            updatedCategories[categoryIndex] = {
              ...category,
              subcategories: [
                ...category.subcategories,
                { name: newSubcategoryName.trim(), isCustom: true }
              ]
            };
          } else {
            // Adaugă categoria nouă
            updatedCategories.push({
              ...category,
              subcategories: [
                ...category.subcategories,
                { name: newSubcategoryName.trim(), isCustom: true }
              ]
            });
          }

          // Salvează în CategoryStore
          await saveCategories(user.id, updatedCategories);
          
          // Reset state-ul
          setAddingSubcategory(null);
          setNewSubcategoryName("");
          
          toast.success("Subcategoria a fost adăugată cu succes");
        } catch (error) {
          console.error("Eroare la adăugarea subcategoriei:", error);
          toast.error("Eroare la adăugarea subcategoriei");
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
            toast.error("Categoria nu a fost găsită");
            return;
          }

          // Verifică dacă noul nume deja există
          if (category.subcategories.some(sub => sub.name === newSubcategoryName.trim() && sub.name !== oldSubcategoryName)) {
            toast.error("Subcategoria cu acest nume deja există");
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
          
          toast.success("Subcategoria a fost redenumită cu succes");
        } catch (error) {
          console.error("Eroare la redenumirea subcategoriei:", error);
          toast.error("Eroare la redenumirea subcategoriei");
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
            toast.error("Categoria nu a fost găsită");
            return;
          }

          // Verifică dacă subcategoria este custom
          const subcategory = category.subcategories.find(sub => sub.name === subcategoryName);
          if (!subcategory?.isCustom) {
            toast.error("Doar subcategoriile custom pot fi șterse");
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
          
          if (associatedTransactions.length > 0) {
            toast.success(`Subcategoria și ${associatedTransactions.length} tranzacții asociate au fost șterse definitiv`);
          } else {
            toast.success("Subcategoria a fost ștearsă cu succes");
          }
        } catch (error) {
          console.error("Eroare la ștergerea subcategoriei:", error);
          toast.error("Eroare la ștergerea subcategoriei");
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
              "w-full h-full min-h-[40px]",
              // 🎯 Visual feedback: diferențiere CREATE vs UPDATE
              transactionId 
                ? "ring-1 ring-blue-200 bg-blue-50/30" // Existing transaction (UPDATE)
                : "ring-1 ring-green-200 bg-green-50/30" // New transaction (CREATE)
            )}
            data-testid={`editable-cell-${cellId}`}
            placeholder={transactionId ? "Editează..." : "Adaugă..."}
          />
        );
      },
      [handleEditableCellSave, transactionMap],
    );

    // Helper pentru stiluri de valori
    const getBalanceStyle = useCallback((value: number): string => {
      if (!value) return "text-gray-400";
      return value > 0
        ? "text-emerald-600 font-medium"
        : "text-red-600 font-medium";
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
            <tr
              className={cn(
                tableRow({
                  editability: isCategory ? "readonly" : "editable",
                }),
                row.getIsExpanded() ? "border-b border-gray-200" : "",
              )}
            >
              {row.getVisibleCells().map((cell, cellIdx) => {
                const isFirstCell = cellIdx === 0;
                const isDayCell = cell.column.id.startsWith("day-");

                // Determine cell editability
                const cellEditability = isCategory
                  ? "category"
                  : isDayCell && isSubcategory
                    ? "editable"
                    : "readonly";

                return (
                  <td
                    key={cell.id}
                    className={cn(
                      tableCell({
                        variant: isDayCell ? "numeric" : "default",
                        editability: cellEditability,
                      }),
                      isFirstCell && level > 0 ? "pl-8" : "",
                      isFirstCell ? "sticky left-0 bg-white z-5" : "",
                    )}
                    title={
                      isCategory && isDayCell
                        ? "Suma calculată automată din subcategorii"
                        : undefined
                    }
                  >
                    {isFirstCell && isCategory ? (
                      // Celula de categorie clickable pentru expand/collapse (folosește iconițele existente din hook)
                      <div 
                        className="flex items-center cursor-pointer hover:bg-gray-50 rounded px-1 py-1 transition-colors duration-150"
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
                        {flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode}
                      </div>
                    ) : isFirstCell && isSubcategory ? (
                      // Celula pentru subcategorie cu badge și hover actions
                      <div className="flex items-center justify-between gap-2 group">
                        <div className="flex items-center gap-2">
                          {/* Verifică dacă e în modul de editare */}
                          {subcategoryAction?.type === 'edit' && 
                           subcategoryAction.category === original.category && 
                           subcategoryAction.subcategory === original.subcategory ? (
                            // Modul editare - input inline
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={editingSubcategoryName}
                                onChange={(e) => setEditingSubcategoryName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && editingSubcategoryName.trim()) {
                                    handleRenameSubcategory(original.category, original.subcategory!, editingSubcategoryName);
                                  } else if (e.key === "Escape") {
                                    setSubcategoryAction(null);
                                    setEditingSubcategoryName("");
                                  }
                                }}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                                data-testid={`edit-subcategory-input-${original.subcategory}`}
                              />
                              <Button
                                size="xs"
                                variant="primary"
                                onClick={() => handleRenameSubcategory(original.category, original.subcategory!, editingSubcategoryName)}
                                disabled={!editingSubcategoryName.trim()}
                                data-testid={`save-edit-subcategory-${original.subcategory}`}
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
                              >
                                ✕
                              </Button>
                            </div>
                          ) : (
                            // Modul normal - text cu badge
                            <>
                              {flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode}
                              {(() => {
                                const categoryData = categories.find(cat => cat.name === original.category);
                                const subcategoryData = categoryData?.subcategories?.find(sub => sub.name === original.subcategory);
                                return subcategoryData?.isCustom ? (
                                  <Badge
                                    variant="success"
                                    size="xs"
                                    dataTestId={`custom-flag-${original.subcategory}`}
                                  >
                                    {FLAGS.CUSTOM}
                                  </Badge>
                                ) : null;
                              })()}
                            </>
                          )}
                        </div>
                        
                        {/* Butoane hover pentru subcategorii custom - doar dacă nu e în modul editare */}
                        {subcategoryAction?.type !== 'edit' && (() => {
                          const categoryData = categories.find(cat => cat.name === original.category);
                          const subcategoryData = categoryData?.subcategories?.find(sub => sub.name === original.subcategory);
                          return subcategoryData?.isCustom ? (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1">
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => {
                                  setSubcategoryAction({
                                    type: 'edit',
                                    category: original.category,
                                    subcategory: original.subcategory!
                                  });
                                  setEditingSubcategoryName(original.subcategory!);
                                }}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                data-testid={`edit-subcategory-btn-${original.subcategory}`}
                                title="Redenumește subcategoria"
                              >
                                <Edit size={12} />
                              </Button>
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => {
                                  setSubcategoryAction({
                                    type: 'delete',
                                    category: original.category,
                                    subcategory: original.subcategory!
                                  });
                                }}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                data-testid={`delete-subcategory-btn-${original.subcategory}`}
                                title="Șterge subcategoria custom"
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    ) : isDayCell && isSubcategory ? (
                      renderEditableCell(
                        original.category,
                        original.subcategory,
                        parseInt(cell.column.id.split("-")[1]),
                        cell.getValue() as string | number,
                      )
                    ) : (
                      flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      ) as React.ReactNode
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Rânduri expandate */}
            {row.getIsExpanded() &&
              row.subRows &&
              row.subRows.length > 0 &&
              row.subRows.map((subRow) => renderRow(subRow, level + 1))}

            {/* Rând pentru adăugarea subcategoriei - doar dacă categoria poate primi subcategorii noi */}
            {canAddSubcategory && (
              <tr className="bg-gray-50/50 border-t border-gray-100">
                <td 
                  className={cn(
                    "sticky left-0 bg-gray-50/50 z-5 pl-8 py-2",
                    "border-r border-gray-200"
                  )}
                >
                  {addingSubcategory === original.category ? (
                    // Modul de editare - input pentru numele subcategoriei
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        placeholder="Nume subcategorie..."
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddSubcategory(original.category);
                          } else if (e.key === "Escape") {
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
                      >
                        ✓
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleCancelAddSubcategory}
                        data-testid={`cancel-subcategory-${original.category}`}
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    // Modul normal - buton pentru adăugarea subcategoriei
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setAddingSubcategory(original.category)}
                      className="flex items-center gap-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      data-testid={`add-subcategory-${original.category}`}
                    >
                      <Plus size={14} />
                      <span className="text-sm">Adaugă subcategorie</span>
                    </Button>
                  )}
                </td>
                {/* Celule goale pentru restul coloanelor */}
                {table.getFlatHeaders().slice(1).map((header) => (
                  <td key={`add-subcategory-${header.id}`} className="py-2">
                    {/* Celulă goală */}
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
        toast.error("Eroare la ștergerea tranzacțiilor orfane");
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
        ? "fără tranzacții"
        : transactionsCount === 1 
          ? "1 tranzacție"
          : `${transactionsCount} tranzacții`;

      const message = `Sigur doriți să ștergeți subcategoria "${subcategoryAction.subcategory}" din categoria "${subcategoryAction.category}" (${transactionText})? Această acțiune nu poate fi anulată${transactionsCount > 0 ? ' și toate tranzacțiile asociate vor fi șterse definitiv din baza de date' : ''}.`;

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="delete-subcategory-confirmation">
          <div className="bg-white rounded-lg shadow-xl max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Confirmare ștergere subcategorie
            </h3>
            <p className="text-sm text-gray-700 mb-4">{message}</p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={onCancel}
                dataTestId="cancel-delete-subcategory"
              >
                Anulează
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={onConfirm}
                dataTestId="confirm-delete-subcategory"
              >
                Șterge
              </Button>
            </div>
          </div>
        </div>
      );
    };

    // Renderizare (layout principal)
    return (
      <>
        <div className={cn(flexContainer({ direction: "row", justify: "start", gap: "md" }), "mb-4")}>
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
              title="Șterge tranzacțiile fără subcategorie (date murdare din trecut)"
            >
              🗑️ Curăță tranzacții orfane ({validTransactions.filter(t => t.category && (!t.subcategory || t.subcategory.trim() === "")).length})
            </Button>
          )}
        </div>

        <div 
          ref={tableContainerRef}
          className={cn(
            "w-full",
            "relative overflow-auto border border-gray-200",
            "max-h-[70vh] min-h-[400px]", // Înălțime fixă pentru scroll vertical
            isLoading ? "opacity-60" : "",
            "transition-all duration-150"
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
          {isLoading && (
            <div className="flex items-center justify-center p-4 text-gray-600" data-testid="loading-indicator">
              {LUNAR_GRID.LOADING}
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center p-4 text-red-600 bg-red-50 rounded-md" data-testid="error-indicator">
              {LUNAR_GRID_MESSAGES.EROARE_INCARCARE}
            </div>
          )}
          
          {!isLoading && !error && table.getRowModel().rows.length === 0 && (
            <div className="flex items-center justify-center p-4 text-gray-600" data-testid="no-data-indicator">
              {LUNAR_GRID.NO_DATA}
            </div>
          )}
          
          {!isLoading && !error && table.getRowModel().rows.length > 0 && (
            <table 
              className={cn(dataTable({ variant: "striped" }), "w-full")}
              data-testid="lunar-grid-table"
            >
              <thead className="bg-gray-50 sticky top-0 z-20">
                <tr>
                  {table.getFlatHeaders().map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        tableHeader(),
                        header.id === "category" 
                          ? "sticky left-0 z-30 text-center bg-gray-50" 
                          : "text-center"
                      )}
                      style={{ width: header.getSize() }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext()) as React.ReactNode}
                    </th>
                  ))}
                </tr>
                {/* Rând separat pentru balanțele zilnice */}
                <tr className="bg-blue-50 border-b-2 border-blue-200">
                  {table.getFlatHeaders().map((header) => {
                    if (header.id === "category") {
                      return (
                        <th
                          key={`balance-${header.id}`}
                          className={cn(
                            "sticky left-0 z-30 px-4 py-2 text-center font-medium text-gray-700 bg-blue-50"
                          )}
                        >
                          Balanțe zilnice
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
                            "px-2 py-2 text-center text-sm font-medium",
                            getBalanceStyleClass(dailyBalance)
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
                            "px-2 py-2 text-center text-sm font-bold",
                            getBalanceStyleClass(monthTotal)
                          )}
                        >
                          {monthTotal !== 0 ? formatCurrency(monthTotal) : "—"}
                        </th>
                      );
                    }
                    
                    return (
                      <th
                        key={`balance-${header.id}`}
                        className="px-2 py-2"
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
