import { useState, useCallback, useEffect } from "react";
import { useCategoryStore } from "../../../stores/categoryStore";
import { CustomCategory, CustomSubcategory } from "../../../types/Category";
import { MESAJE } from "@shared-constants/messages";

/**
 * Tipul acțiunii pentru subcategorii (edit/delete)
 */
export type SubcatActionType = "edit" | "delete";

/**
 * Interfața pentru acțiunea pe subcategorie
 */
export interface SubcatAction {
  type: SubcatActionType;
  cat: string;
  subcat: string;
}

/**
 * Hook pentru gestionarea stării componentei CategoryEditor
 * Separă logica de stare de componenta de prezentare
 */
export function useCategoryEditorState(initialData: {
  open: boolean;
  userId: string;
  initialCategory?: string;
  initialSubcategory?: string;
  initialMode?: "edit" | "delete" | "add";
}) {
  const {
    open,
    userId,
    initialCategory,
    initialSubcategory,
    initialMode = "add",
  } = initialData;
  const {
    categories,
    saveCategories,
    renameSubcategory,
    deleteSubcategory: _deleteSubcategory,
    getSubcategoryCount,
  } = useCategoryStore();

  // State pentru selecția categoriei și acțiunile pe subcategorii
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory || null,
  );
  const [subcatAction, setSubcatAction] = useState<SubcatAction | null>(
    initialCategory &&
      initialSubcategory &&
      (initialMode === "edit" || initialMode === "delete")
      ? {
          type: initialMode as SubcatActionType,
          cat: initialCategory,
          subcat: initialSubcategory,
        }
      : null,
  );
  const [renameValue, setRenameValue] = useState<string>(
    initialSubcategory || "",
  );
  const [newSubcat, setNewSubcat] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Focus pe input în modul add
  useEffect(() => {
    if (open && initialMode === "add") {
      setTimeout(() => {
        const addInput = document.querySelector(
          '[data-testid="category-editor-add-subcat-input"]',
        );
        if (addInput instanceof HTMLInputElement) addInput.focus();
      }, 100);
    }
  }, [open, initialMode]);

  // Handler pentru adăugarea unei subcategorii noi
  const handleAdd = useCallback(
    async (cat: CustomCategory): Promise<void> => {
      setError(null);

      if (!newSubcat.trim()) return setError(MESAJE.CATEGORII.NUME_GOL);
      
      // 🔧 VALIDATION: Check custom subcategories limit (max 5 per category)
      const customSubcategoriesCount = cat.subcategories.filter(sub => sub.isCustom).length;
      if (customSubcategoriesCount >= 5) {
        return setError(`Maxim 5 subcategorii custom permise per categorie. Categoria "${cat.name}" are deja ${customSubcategoriesCount} subcategorii custom.`);
      }
      
      if (
        cat.subcategories.some(
          (sc: CustomSubcategory) =>
            sc.name.toLowerCase() === newSubcat.trim().toLowerCase(),
        )
      ) {
        return setError(MESAJE.CATEGORII.SUBCATEGORIE_EXISTENTA);
      }

      const updated = categories.map((c: CustomCategory) =>
        c.name === cat.name
          ? {
              ...c,
              subcategories: [
                ...c.subcategories,
                { name: newSubcat.trim(), isCustom: true },
              ],
            }
          : c,
      );

      await saveCategories(userId, updated);
      setNewSubcat("");
      setError(null);
    },
    [categories, newSubcat, saveCategories, userId],
  );

  // Handler pentru redenumirea unei subcategorii
  const handleRename = useCallback(
    async (cat: string, oldName: string, newName: string): Promise<void> => {
      setError(null);

      if (!newName.trim()) return setError(MESAJE.CATEGORII.NUME_GOL);
      if (
        categories
          .find((c: CustomCategory) => c.name === cat)
          ?.subcategories.some(
            (sc: CustomSubcategory) =>
              sc.name.toLowerCase() === newName.trim().toLowerCase(),
          )
      ) {
        return setError(MESAJE.CATEGORII.SUBCATEGORIE_EXISTENTA);
      }

      await renameSubcategory(userId, cat, oldName, newName.trim());
      setSubcatAction(null);
      setError(null);
    },
    [categories, renameSubcategory, userId],
  );

  // Validare pentru ștergerea unei subcategorii
  const isValidDeleteRequest = useCallback(
    (cat: string, subcat: string): boolean => {
      // Verificăm dacă categoria și subcategoria există
      if (!cat || !subcat) {
        setError(MESAJE.CATEGORII.EROARE_STERGERE);
        return false;
      }

      // Găsim categoria în lista de categorii
      const category = categories.find((c: CustomCategory) => c.name === cat);
      if (!category) {
        setError(MESAJE.CATEGORII.EROARE_STERGERE);
        return false;
      }

      // Verificăm dacă subcategoria există în cadrul categoriei
      const subcategory = category.subcategories.find(
        (sc: CustomSubcategory) => sc.name === subcat,
      );
      if (!subcategory) {
        setError(MESAJE.CATEGORII.EROARE_STERGERE);
        return false;
      }

      // Verificăm dacă subcategoria este personalizată (doar cele custom pot fi șterse)
      if (!subcategory.isCustom) {
        setError(MESAJE.CATEGORII.NU_SE_POT_STERGE_PREDEFINITE);
        return false;
      }

      return true;
    },
    [categories, setError],
  );

  // Handler pentru ștergerea unei subcategorii
  const handleDelete = useCallback(
    async (cat: string, subcat: string): Promise<void> => {
      setError(null);

      if (!cat) {
        setError(MESAJE.CATEGORII.EROARE_STERGERE);
        return;
      }

      if (!isValidDeleteRequest(cat, subcat)) return;

      try {
        await _deleteSubcategory(userId, cat, subcat, "delete");
        setSubcatAction(null);
      } catch (error) {
        console.error("Eroare la ștergerea subcategoriei:", error);
        setError(MESAJE.CATEGORII.EROARE_STERGERE);
      }
    },
    [_deleteSubcategory, isValidDeleteRequest, userId],
  );

  return {
    // State
    selectedCategory,
    subcatAction,
    renameValue,
    newSubcat,
    error,
    categories,
    getSubcategoryCount,

    // State setters
    setSelectedCategory,
    setSubcatAction,
    setRenameValue,
    setNewSubcat,
    setError,

    // Handlers
    handleAdd,
    handleRename,
    handleDelete,
    isValidDeleteRequest,
  };
}
