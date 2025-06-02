import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Importuri din stores
import { useCategoryStore } from "../../../../stores/categoryStore";
import { useAuthStore } from "../../../../stores/authStore";

// React Query hooks
import {
  useDeleteTransactionMonthly,
} from '../../../../services/hooks/transactionMutations';

// Constante
import { TransactionType, MESAJE, LUNAR_GRID_ACTIONS } from "@shared-constants";

// Types pentru subcategory action
export interface SubcategoryAction {
  type: 'edit' | 'delete';
  category: string;
  subcategory: string;
}

// Hook pentru management subcategorii în LunarGrid
export const useLunarGridSubcategories = (year: number, month: number, validTransactions: any[]) => {
  // State management
  const [addingSubcategory, setAddingSubcategory] = useState<string | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>("");
  const [subcategoryAction, setSubcategoryAction] = useState<SubcategoryAction | null>(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState<string>("");

  // Dependencies
  const { user } = useAuthStore();
  const { categories, saveCategories } = useCategoryStore();
  const queryClient = useQueryClient();
  const deleteTransactionMutation = useDeleteTransactionMonthly(year, month, user?.id);

  // Handler pentru adăugarea unei subcategorii noi
  const handleAddSubcategory = useCallback(
    async (categoryName: string) => {
      if (!user?.id || !newSubcategoryName.trim()) {
        return;
      }

      try {
        console.log('🔍 [ADD-SUBCATEGORY-DEBUG] Starting subcategory addition:', {
          categoryName,
          newSubcategoryName: newSubcategoryName.trim(),
          currentCategories: categories?.map(cat => ({
            name: cat.name,
            subcategories: cat.subcategories?.map(sub => ({
              name: sub.name,
              isCustom: sub.isCustom
            })) || []
          })) || []
        });

        // Găsește categoria în store TOATE categoriile disponibile, nu doar custom ones
        let category = categories.find(cat => cat.name === categoryName);
        
        // Dacă categoria nu există în store, o creăm (poate fi o categorie default)
        if (!category) {
          console.log(`🔍 [ADD-SUBCATEGORY-DEBUG] Category "${categoryName}" not found in store, creating new one`);
          category = {
            name: categoryName,
            type: TransactionType.EXPENSE, // Default type
            subcategories: [],
            isCustom: true
          };
        } else {
          console.log(`🔍 [ADD-SUBCATEGORY-DEBUG] Found existing category "${categoryName}":`, {
            subcategoriesCount: category.subcategories?.length || 0,
            subcategories: category.subcategories?.map(sub => ({
              name: sub.name,
              isCustom: sub.isCustom
            })) || []
          });
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

        console.log('🔍 [ADD-SUBCATEGORY-DEBUG] About to save categories:', {
          totalCategories: updatedCategories.length,
          updatedCategory: {
            name: updatedCategory.name,
            subcategoriesCount: updatedCategory.subcategories?.length || 0,
            subcategories: updatedCategory.subcategories?.map(sub => ({
              name: sub.name,
              isCustom: sub.isCustom
            })) || []
          }
        });

        await saveCategories(user.id, updatedCategories);
        
        console.log('🔍 [ADD-SUBCATEGORY-DEBUG] Categories saved successfully, invalidating React Query cache');
        
        // 🔄 FORCE INVALIDATION: Invalidează cache-ul React Query pentru a forța re-fetch
        queryClient.invalidateQueries({
          queryKey: ["transactions", year, month, user.id],
        });
        
        // Reset state-ul
        setAddingSubcategory(null);
        setNewSubcategoryName("");
        
        toast.success(MESAJE.CATEGORII.SUCCES_ADAUGARE_SUBCATEGORIE);
      } catch (error) {
        console.error("Eroare la adăugarea subcategoriei:", error);
        toast.error(MESAJE.CATEGORII.EROARE_ADAUGARE_SUBCATEGORIE);
      }
    },
    [user?.id, newSubcategoryName, categories, saveCategories, queryClient, year, month],
  );

  // Handler pentru anularea adăugării subcategoriei
  const handleCancelAddSubcategory = useCallback(() => {
    setAddingSubcategory(null);
    setNewSubcategoryName("");
  }, []);

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

  // Handler pentru delete subcategorie custom
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

  return {
    // State
    addingSubcategory,
    setAddingSubcategory,
    newSubcategoryName,
    setNewSubcategoryName,
    subcategoryAction,
    setSubcategoryAction,
    editingSubcategoryName,
    setEditingSubcategoryName,
    
    // Handlers
    handleAddSubcategory,
    handleCancelAddSubcategory,
    handleRenameSubcategory,
    handleDeleteSubcategory,
  };
}; 