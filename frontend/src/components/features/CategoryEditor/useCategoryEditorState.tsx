import { useState, useCallback } from 'react';
import { useCategoryStore } from '../../../stores/categoryStore';
import { CustomCategory, CustomSubcategory } from '../../../types/Category';
import { MESAJE } from '@shared-constants/messages';
// Importăm tipurile necesare pentru getEnhancedComponentClasses
import type { ComponentType, ComponentVariant, ComponentSize, ComponentState } from '../../../styles/themeTypes';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';

/**
 * Tipul acțiunii pentru subcategorii (edit/delete)
 */
export type SubcatActionType = 'edit' | 'delete';

/**
 * Interfața pentru acțiunea pe subcategorie
 */
export interface SubcatAction {
  type: SubcatActionType; 
  cat: string; 
  subcat: string;
}

/**
 * Tipurile proprietăților necesare pentru hook-ul useCategoryEditorState
 */
interface UseCategoryEditorStateProps {
  userId: string;
  initialCategory?: string;
  initialSubcategory?: string;
  initialMode?: 'edit' | 'delete' | 'add';
  onClose?: () => void;
}

/**
 * Hook custom pentru gestionarea stării editorului de categorii.
 * Separă logica de stare de componentă, pentru a face codul mai clar și mai ușor de testat.
 * 
 * @param props - Proprietățile de inițializare pentru starea editorului
 * @returns Un obiect cu starea și metodele pentru gestionarea categoriilor și subcategoriilor
 */
export const useCategoryEditorState = ({ 
  userId, 
  initialCategory,
  initialSubcategory,
  initialMode = 'add',
  onClose
}: UseCategoryEditorStateProps) => {
  const { 
    categories, 
    saveCategories, 
    renameSubcategory, 
    deleteSubcategory: _deleteSubcategory, 
    getSubcategoryCount 
  } = useCategoryStore();
  
  // State pentru stări vizibile
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [newSubcat, setNewSubcat] = useState<string>('');
  const [renameValue, setRenameValue] = useState<string>(initialSubcategory || '');
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  // State pentru acțiunea curentă pe subcategorie (edit/delete)
  const [subcatAction, setSubcatAction] = useState<SubcatAction | null>(
    initialCategory && initialSubcategory
      ? { type: initialMode as SubcatActionType, cat: initialCategory, subcat: initialSubcategory }
      : null
  );
  
  // Memoizare pentru categoria selectată - obiect complet
  const selectedCategoryObj = categories.find((cat: CustomCategory) => 
    cat.name === selectedCategory
  ) || null;
  
  // Memoizare pentru subcategoriile categoriei selectate
  const selectedSubcategories = selectedCategoryObj?.subcategories || [];
  
  /**
   * Handler pentru adăugarea unei noi subcategorii
   */
  const handleAdd = useCallback(async (cat: CustomCategory): Promise<void> => {
    // Resetăm eroarea la începutul operațiunii
    setError(null);
    
    if (!newSubcat.trim()) {
      setError(MESAJE.CATEGORII.NUME_GOL);
      return;
    }
    
    const existsAlready = cat.subcategories.some(
      (sc: CustomSubcategory) => sc.name.toLowerCase() === newSubcat.trim().toLowerCase()
    );
    
    if (existsAlready) {
      setError(MESAJE.CATEGORII.SUBCATEGORIE_EXISTENTA);
      return;
    }
    
    try {
      const updated = categories.map((c: CustomCategory) => 
        c.name === cat.name 
          ? {
              ...c,
              subcategories: [...c.subcategories, { name: newSubcat.trim(), isCustom: true }]
            }
          : c
      );
      
      await saveCategories(userId, updated);
      setNewSubcat('');
      setError(null);
    } catch (err) {
      setError(MESAJE.CATEGORII.EROARE_STERGERE);
    }
  }, [categories, newSubcat, saveCategories, userId]);
  
  /**
   * Handler pentru redenumirea unei subcategorii
   */
  const handleRename = useCallback(async (cat: string, oldName: string, newName: string): Promise<void> => {
    // Resetăm eroarea la începutul operațiunii
    setError(null);
    
    if (!newName.trim()) {
      setError(MESAJE.CATEGORII.NUME_GOL);
      return;
    }
    
    const categoryObj = categories.find((c: CustomCategory) => c.name === cat);
    
    const existsAlready = categoryObj?.subcategories.some(
      (sc: CustomSubcategory) => sc.name.toLowerCase() === newName.trim().toLowerCase()
    );
    
    if (existsAlready) {
      setError(MESAJE.CATEGORII.SUBCATEGORIE_EXISTENTA);
      return;
    }
    
    try {
      await renameSubcategory(userId, cat, oldName, newName.trim());
      setSubcatAction(null);
      setError(null);
    } catch (err) {
      setError(MESAJE.CATEGORII.EROARE_STERGERE);
    }
  }, [categories, renameSubcategory, userId]);
  
  /**
   * Handler pentru inițierea ștergerii unei subcategorii
   */
  const handleDelete = useCallback(async (cat: string, subcat: string) => {
    try {
      // Resetăm eroarea la începutul operațiunii
      setError(null);
      
      if (!cat) {
        setError(MESAJE.CATEGORII.EROARE_STERGERE);
        return;
      }
      
      const categoryObj = categories.find(c => c.name === cat);
      if (!categoryObj) {
        setError(MESAJE.CATEGORII.EROARE_STERGERE);
        return;
      }
      
      const subcatObj = categoryObj.subcategories.find(sc => sc.name === subcat);
      if (!subcatObj) {
        setError(MESAJE.CATEGORII.EROARE_STERGERE);
        return;
      }
      
      if (!subcatObj.isCustom) {
        setError(MESAJE.CATEGORII.NU_SE_POT_STERGE_PREDEFINITE);
        return;
      }
      
      // Dacă toate verificările au trecut, arătăm dialogul de confirmare
      setSubcatAction({ type: 'delete', cat, subcat });
    } catch (error) {
      console.error('Eroare la procesarea ștergerii:', error);
      setError(MESAJE.CATEGORII.EROARE_STERGERE);
    }
  }, [categories, setError]);
  
  /**
   * Handler pentru executarea efectivă a ștergerii subcategoriei
   */
  const confirmDelete = useCallback(async (cat: string, subcat: string) => {
    try {
      await _deleteSubcategory(userId, cat, subcat, "delete");
      setSubcatAction(null);
      setError(null);
    } catch (err) {
      setError(MESAJE.CATEGORII.EROARE_STERGERE);
    }
  }, [_deleteSubcategory, userId]);
  
  /**
   * Handler pentru schimbarea categoriei selectate
   */
  const handleCategorySelect = useCallback((categoryName: string) => {
    setSelectedCategory(categoryName);
    setError(null);
    setNewSubcat('');
    
    // Resetăm acțiunea curentă pe subcategorie
    setSubcatAction(null);
  }, []);
  
  /**
   * Handler pentru anularea acțiunilor pe subcategorii
   */
  const cancelSubcatAction = useCallback(() => {
    setSubcatAction(null);
  }, []);
  
  /**
   * Controlul animației pentru modal
   */
  const setModalVisibility = useCallback((visible: boolean) => {
    setIsVisible(visible);
  }, []);
  
  /**
   * Handler pentru keyboard navigation
   */
  const handleKeyboardNavigation = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);
  
  return {
    // State
    selectedCategory,
    selectedCategoryObj,
    selectedSubcategories,
    newSubcat,
    renameValue,
    error,
    subcatAction,
    categories,
    isVisible,
    
    // Setters
    setSelectedCategory,
    setNewSubcat,
    setRenameValue,
    setError,
    setSubcatAction,
    setModalVisibility,
    
    // Handlers
    handleAdd,
    handleRename,
    handleDelete,
    confirmDelete,
    handleCategorySelect,
    cancelSubcatAction,
    handleKeyboardNavigation,
    getSubcategoryCount
  };
};
