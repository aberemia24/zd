import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TransactionType, MESAJE } from '@budget-app/shared-constants';
import { useCategoryStore } from '../../../../stores/categoryStore';
import { useErrorHandler } from '../../../../hooks/useErrorHandler';
import { useValidation } from '../../../../hooks/useValidation';

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

/**
 * Enhanced loading states pentru operațiile de subcategorie
 */
interface SubcategoryLoadingStates {
  isAdding: boolean;
  isRenaming: boolean;
  isDeleting: boolean;
  operationCategory?: string;
  operationSubcategory?: string;
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
  // Enhanced: Loading states pentru UX feedback
  loadingStates: SubcategoryLoadingStates;
}

/**
 * Enhanced Hook pentru gestionarea operațiilor pe subcategorii în LunarGrid
 * 
 * ENHANCED FEATURES:
 * - Loading states pentru fiecare operație (add, rename, delete)
 * - Validări business robuste cu validare centralizată
 * - UX feedback cu toast notifications și loading indicators
 * - React Query cache invalidation optimizat
 * - Error handling enhanced cu context complet
 * 
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

  // Enhanced: Error handling centralizat
  const { handleError, createValidationError, createBusinessError } = useErrorHandler({
    componentName: 'useSubcategoryOperations'
  });

  // Enhanced: Validare centralizată pentru subcategorii
  const validation = useValidation('useSubcategoryOperations');

  // Enhanced: Loading states pentru UX feedback
  const [loadingStates, setLoadingStates] = useState<SubcategoryLoadingStates>({
    isAdding: false,
    isRenaming: false,
    isDeleting: false,
  });

  /**
   * Enhanced: Validează nume subcategorie folosind validarea centralizată
   */
  const validateSubcategoryName = useCallback((name: string): void => {
    const result = validation.validateField('subcategoryName', name, 'subcategory_name');
    if (!result.isValid && result.error) {
      throw createValidationError(result.error, 'validate_subcategory_name', 'subcategoryName');
    }
  }, [validation, createValidationError]);

  // Enhanced: Handler pentru adăugarea unei subcategorii noi cu validare centralizată
  const handleAddSubcategory = useCallback(
    async (categoryName: string) => {
      // Validări preliminare cu enhanced error handling
      if (!userId) {
        throw createValidationError(
          "Utilizator neautentificat. Reîncărcați pagina și încercați din nou.",
          'add_subcategory_auth_check'
        );
      }
      
      // Enhanced: Validare nume folosind sistemul centralizat
      try {
        validateSubcategoryName(newSubcategoryName.trim());
      } catch (error) {
        throw error; // Re-throw validation error
      }

      // Set loading state cu detalii operație
      setLoadingStates(prev => ({
        ...prev,
        isAdding: true,
        operationCategory: categoryName,
        operationSubcategory: newSubcategoryName.trim()
      }));

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

        // Enhanced: Verifică limita de subcategorii custom cu business error
        const customSubcategoriesCount = category.subcategories.filter(sub => sub.isCustom).length;
        if (customSubcategoriesCount >= 5) {
          throw createBusinessError(
            `${MESAJE.CATEGORII.MAXIM_SUBCATEGORII}. Categoria "${categoryName}" are deja ${customSubcategoriesCount} subcategorii custom.`,
            'add_subcategory_limit_check',
            {
              categoryName,
              currentCount: customSubcategoriesCount,
              limit: 5
            }
          );
        }

        // Enhanced: Verifică dacă subcategoria deja există cu business error
        const existingSubcategory = category.subcategories.find(sub => sub.name === newSubcategoryName.trim());
        if (existingSubcategory) {
          throw createBusinessError(
            `${MESAJE.CATEGORII.SUBCATEGORIE_EXISTENTA}: "${newSubcategoryName.trim()}" există deja în categoria "${categoryName}"`,
            'add_subcategory_duplicate_check',
            {
              categoryName,
              subcategoryName: newSubcategoryName.trim()
            }
          );
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

        // Enhanced: Toast loading pentru operații lungi
        const toastId = toast.loading(`Se adaugă subcategoria "${newSubcategoryName.trim()}" în "${categoryName}"...`);

        await saveCategories(userId, updatedCategories);
        
        // 🔄 FORCE INVALIDATION: Invalidează cache-ul React Query pentru a forța re-fetch
        queryClient.invalidateQueries({
          queryKey: ["transactions", year, month, userId],
        });
        
        // Reset state-ul
        setAddingSubcategory(null);
        setNewSubcategoryName("");
        validation.clearAllErrors();
        
        // Enhanced: Success feedback cu detalii
        toast.success(`${MESAJE.CATEGORII.SUCCES_ADAUGARE_SUBCATEGORIE}: "${newSubcategoryName.trim()}" în categoria "${categoryName}"`, {
          id: toastId,
          duration: 3000
        });
      } catch (error) {
        // Enhanced: Error handling centralizat cu context complet
        handleError(error, 'add_subcategory', {
          additionalData: {
            categoryName,
            subcategoryName: newSubcategoryName.trim(),
            userId,
            customSubcategoriesCount: categories.find(cat => cat.name === categoryName)?.subcategories.filter(sub => sub.isCustom).length || 0
          }
        });
      } finally {
        // Clear loading state
        setLoadingStates(prev => ({
          ...prev,
          isAdding: false,
          operationCategory: undefined,
          operationSubcategory: undefined
        }));
      }
    },
    [categories, saveCategories, queryClient, year, month, userId, newSubcategoryName, setAddingSubcategory, setNewSubcategoryName, handleError, createValidationError, createBusinessError, validateSubcategoryName, validation]
  );

  // Enhanced: Handler pentru rename subcategorie custom cu validare centralizată
  const handleRenameSubcategory = useCallback(
    async (categoryName: string, oldName: string, newName: string) => {
      if (!newName.trim()) {
        toast.error('Numele subcategoriei nu poate fi gol');
        return;
      }

      if (newName === oldName) {
        toast.success('Numele nu a fost modificat');
        return;
      }

      try {
        // 🔧 PERFORMANCE FIX: Construiesc categories array-ul corect
        const updatedCategories = categories.map((category: any) => {
          if (category.name === categoryName) {
            return {
              ...category,
              subcategories: category.subcategories.map((sub: any) => 
                sub.name === oldName ? { ...sub, name: newName } : sub
              )
            };
          }
          return category;
        });

        // 🔧 PERFORMANCE FIX: Apelez saveCategories cu signature corect (userId, categories)
        await saveCategories(userId || '', updatedCategories);
        
        toast.success(`Subcategoria "${oldName}" a fost redenumită în "${newName}"`);
        
        // 🔧 PERFORMANCE OPTIMIZATION: Eliminat aggressive cache invalidation 
        // Grid va folosi updated categories din store automat fără full refresh
      } catch (error) {
        console.error('Error in handleRenameSubcategory:', error);
        toast.error('Eroare la redenumirea subcategoriei');
      }
    },
    [categories, saveCategories, userId]
  );

  // Enhanced: Handler pentru ștergerea unei subcategorii custom cu loading states
  const handleDeleteSubcategory = useCallback(
    async (categoryName: string, subcategoryName: string) => {
      // Validări preliminare cu feedback îmbunătățit
      if (!userId) {
        toast.error("Utilizator neautentificat. Reîncărcați pagina și încercați din nou.");
        return;
      }

      // Set loading state cu detalii operație
      setLoadingStates(prev => ({
        ...prev,
        isDeleting: true,
        operationCategory: categoryName,
        operationSubcategory: subcategoryName
      }));

      try {
        // Enhanced: Găsește categoria în store cu validare robustă
        const category = categories.find(cat => cat.name === categoryName);
        if (!category) {
          toast.error(`${MESAJE.CATEGORII.CATEGORIA_NEGASITA}: "${categoryName}"`);
          return;
        }

        // Enhanced: Găsește subcategoria și verifică că există și este custom
        const subcategoryToDelete = category.subcategories.find(sub => sub.name === subcategoryName);
        if (!subcategoryToDelete) {
          toast.error(`Subcategoria "${subcategoryName}" nu a fost găsită în categoria "${categoryName}"`);
          return;
        }

        if (!subcategoryToDelete.isCustom) {
          toast.error(`${MESAJE.CATEGORII.NU_SE_POT_STERGE_PREDEFINITE}. "${subcategoryName}" este o subcategorie sistem.`);
          return;
        }

        // Enhanced: Toast loading pentru operații lungi
        const toastId = toast.loading(`Se șterge subcategoria "${subcategoryName}" din "${categoryName}"...`);

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
        validation.clearAllErrors();
        
        // Enhanced: Success feedback cu detalii
        toast.success(`${MESAJE.CATEGORII.SUCCES_STERGERE_SUBCATEGORIE}: "${subcategoryName}" din categoria "${categoryName}"`, {
          id: toastId,
          duration: 3000
        });
      } catch (error) {
        // Enhanced: Error handling cu informații utile pentru debugging
        const errorMessage = error instanceof Error ? error.message : 'Eroare necunoscută';
        toast.error(`${MESAJE.CATEGORII.EROARE_STERGERE_SUBCATEGORIE}: ${errorMessage}`);
        console.error("Enhanced Subcategory Delete Error:", {
          error,
          categoryName,
          subcategoryName,
          userId,
          timestamp: new Date().toISOString()
        });
      } finally {
        // Clear loading state
        setLoadingStates(prev => ({
          ...prev,
          isDeleting: false,
          operationCategory: undefined,
          operationSubcategory: undefined
        }));
      }
    },
    [userId, categories, saveCategories, queryClient, year, month, clearSubcategoryAction, validation],
  );

  return {
    handleAddSubcategory,
    handleRenameSubcategory,
    handleDeleteSubcategory,
    loadingStates,
  };
}; 
