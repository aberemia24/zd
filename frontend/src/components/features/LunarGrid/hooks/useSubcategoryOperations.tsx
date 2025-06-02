import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TransactionType, MESAJE } from '@shared-constants';
import { useCategoryStore } from '../../../../stores/categoryStore';

interface CategoryStoreItem {
  name: string;
  type: TransactionType;
  subcategories: Array<{ name: string; isCustom?: boolean; [key: string]: unknown }>;
  isCustom?: boolean;
  [key: string]: unknown;
}

interface UseSubcategoryOperationsProps {
  year: number;
  month: number;
  userId: string | undefined;
  newSubcategoryName: string;
  setNewSubcategoryName: (name: string) => void;
  setAddingSubcategory: (category: string | null) => void;
  clearSubcategoryAction: () => void;
}

interface UseSubcategoryOperationsReturn {
  handleAddSubcategory: (categoryName: string) => Promise<void>;
  handleRenameSubcategory: (
    categoryName: string,
    oldSubcategoryName: string,
    newSubcategoryName: string
  ) => Promise<void>;
  handleDeleteSubcategory: (
    categoryName: string,
    subcategoryName: string
  ) => Promise<void>;
}

/**
 * Hook pentru gestionarea operațiilor pe subcategorii în LunarGrid
 * Separă business logic-ul de subcategorii de componentele UI
 * Gestionează CategoryStore operations și validări business
 */
export const useSubcategoryOperations = ({
  year,
  month,
  userId,
  newSubcategoryName,
  setNewSubcategoryName,
  setAddingSubcategory,
  clearSubcategoryAction,
}: UseSubcategoryOperationsProps): UseSubcategoryOperationsReturn => {

  // Store și query client hooks
  const { categories, saveCategories } = useCategoryStore();
  const queryClient = useQueryClient();

  // Handler pentru adăugarea unei subcategorii noi
  const handleAddSubcategory = useCallback(
    async (categoryName: string) => {
      if (!userId || !newSubcategoryName.trim()) {
        return;
      }

      try {
        // Găsește categoria în store TOATE categoriile disponibile, nu doar custom ones
        let category = categories.find(cat => cat.name === categoryName) as CategoryStoreItem;
        
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

        await saveCategories(userId, updatedCategories);
        
        // 🔄 FORCE INVALIDATION: Invalidează cache-ul React Query pentru a forța re-fetch
        queryClient.invalidateQueries({
          queryKey: ["transactions", year, month, userId],
        });
        
        // Reset state-ul
        setAddingSubcategory(null);
        setNewSubcategoryName("");
        
        toast.success(MESAJE.CATEGORII.SUCCES_ADAUGARE_SUBCATEGORIE);
      } catch (error) {
        toast.error(MESAJE.CATEGORII.EROARE_ADAUGARE_SUBCATEGORIE);
      }
    },
    [userId, newSubcategoryName, categories, saveCategories, queryClient, year, month, setAddingSubcategory, setNewSubcategoryName],
  );

  // Handler pentru rename subcategorie custom
  const handleRenameSubcategory = useCallback(
    async (categoryName: string, oldSubcategoryName: string, newSubcategoryNameParam: string) => {
      if (!userId || !newSubcategoryNameParam.trim()) {
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
        if (category.subcategories.some(sub => sub.name === newSubcategoryNameParam.trim() && sub.name !== oldSubcategoryName)) {
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
                  ? { ...sub, name: newSubcategoryNameParam.trim() }
                  : sub
              )
            };
          }
          return cat;
        });

        // Salvează în CategoryStore
        await saveCategories(userId, updatedCategories);
        
        // Reset state
        clearSubcategoryAction();
        
        toast.success(MESAJE.CATEGORII.SUCCES_REDENUMIRE_SUBCATEGORIE);
      } catch (error) {
        toast.error(MESAJE.CATEGORII.EROARE_REDENUMIRE);
      }
    },
    [userId, categories, saveCategories, clearSubcategoryAction],
  );

  // Handler pentru ștergerea unei subcategorii custom
  const handleDeleteSubcategory = useCallback(
    async (categoryName: string, subcategoryName: string) => {
      if (!userId) {
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
        await saveCategories(userId, updatedCategories);
        
        // 🔄 FORCE INVALIDATION: Invalidează cache-ul React Query pentru a forța re-fetch
        queryClient.invalidateQueries({
          queryKey: ["transactions", year, month, userId],
        });
        
        // Reset state
        clearSubcategoryAction();
        
        toast.success(MESAJE.CATEGORII.SUCCES_STERGERE_SUBCATEGORIE);
      } catch (error) {
        toast.error(MESAJE.CATEGORII.EROARE_STERGERE_SUBCATEGORIE);
      }
    },
    [userId, categories, saveCategories, queryClient, year, month, clearSubcategoryAction],
  );

  return {
    handleAddSubcategory,
    handleRenameSubcategory,
    handleDeleteSubcategory,
  };
}; 