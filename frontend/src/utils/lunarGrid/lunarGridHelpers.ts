import { CSSProperties } from 'react';
import { TransactionType } from '@shared-constants';
import { gridValueState } from "../../styles/cva/grid/grid";

/**
 * Helper pentru determinarea stilurilor de valori în grid folosind CVA system.
 * Funcție pură care mapează valori numerice la clase CSS bazate pe state.
 * 
 * @param value - Valoarea numerică pentru care se determină stilul
 * @returns String cu clasele CSS pentru styling conform stării valorii
 */
export const getBalanceStyle = (value: number): string => {
  if (!value) return gridValueState({ state: "empty" });
  return gridValueState({ 
    state: value > 0 ? "positive" : "negative",
    weight: "semibold"
  });
};

/**
 * Calculează poziția pentru popover bazat pe element anchor.
 * Helper pentru poziționarea overlay-urilor relative la elementele grid.
 * 
 * @param anchorEl - Elementul anchor pentru poziționare
 * @returns CSSProperties object cu poziția calculată
 */
export const calculatePopoverPosition = (anchorEl: HTMLElement | null): CSSProperties => {
  if (!anchorEl) return {};

  try {
    const rect = anchorEl.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    return {
      position: "absolute",
      top: `${rect.top + scrollY}px`,
      left: `${rect.left + scrollX}px`,
    };
  } catch (error) {
    console.warn("Could not get bounding rect for popover anchor element:", error);
    return {};
  }
};

/**
 * Interface pentru item de categorie din store (matches existing types).
 */
export interface CategoryStoreItem {
  name: string;
  type?: TransactionType;
  subcategories: Array<{ name: string; isCustom?: boolean; [key: string]: unknown }>;
  [key: string]: unknown;
}

/**
 * Găsește o categorie din store după nume.
 * Helper pure function pentru căutarea categoriilor.
 * 
 * @param categories - Array-ul de categorii din store
 * @param categoryName - Numele categoriei de căutat
 * @returns Categoria găsită sau undefined
 */
export const findCategoryByName = (
  categories: CategoryStoreItem[], 
  categoryName: string
): CategoryStoreItem | undefined => {
  return categories.find(cat => cat.name === categoryName);
};

/**
 * Găsește o subcategorie într-o categorie.
 * Helper pure function pentru căutarea subcategoriilor.
 * 
 * @param category - Categoria în care să caute
 * @param subcategoryName - Numele subcategoriei de căutat
 * @returns Subcategoria găsită sau undefined
 */
export const findSubcategoryInCategory = (
  category: CategoryStoreItem, 
  subcategoryName: string
): { name: string; isCustom?: boolean; [key: string]: unknown } | undefined => {
  return category.subcategories.find(sub => sub.name === subcategoryName);
};

/**
 * Calculează numărul de subcategorii custom dintr-o categorie.
 * Helper pure function pentru validarea limitelor de subcategorii.
 * 
 * @param category - Categoria pentru care să numere subcategoriile custom
 * @returns Numărul de subcategorii custom
 */
export const countCustomSubcategories = (category: CategoryStoreItem): number => {
  return category.subcategories.filter(sub => sub.isCustom).length;
};

/**
 * Verifică dacă o categorie poate avea subcategorii noi adăugate.
 * Helper pure function pentru validarea limitelor (max 5 subcategorii custom).
 * 
 * @param category - Categoria de verificat
 * @param maxCustomSubcategories - Limita maximă (default: 5)
 * @returns true dacă se pot adăuga subcategorii, false altfel
 */
export const canAddSubcategory = (
  category: CategoryStoreItem, 
  maxCustomSubcategories: number = 5
): boolean => {
  const customCount = countCustomSubcategories(category);
  return customCount < maxCustomSubcategories;
};

/**
 * Determină varianta de styling pentru o subcategorie.
 * Helper pure function pentru determinarea variantei CVA pentru subcategorii.
 * 
 * @param isCustom - Flag care indică dacă subcategoria este custom
 * @returns Varianta de styling ("custom" | "professional")
 */
export const getSubcategoryVariant = (isCustom?: boolean): "custom" | "professional" => {
  return isCustom ? "custom" : "professional";
};

/**
 * Calculează valoarea numerică din valoarea de celulă.
 * Helper pure function pentru extragerea valorilor numerice din stringuri formatate.
 * 
 * @param cellValue - Valoarea din celulă (string sau number)
 * @returns Valoarea numerică sau 0 dacă nu poate fi parsată
 */
export const extractNumericValue = (cellValue: string | number): number => {
  if (typeof cellValue === 'number') return cellValue;
  if (typeof cellValue !== 'string' || cellValue === "-" || cellValue === "—") return 0;
  
  const cleanValue = cellValue.replace(/[^\d,.-]/g, '').replace(',', '.');
  const numericValue = parseFloat(cleanValue);
  return isNaN(numericValue) ? 0 : numericValue;
};

/**
 * Determină starea pentru styling unei celule de valoare.
 * Helper pure function pentru determinarea stării (positive/negative/empty) a unei celule.
 * 
 * @param cellValue - Valoarea din celulă
 * @returns Starea pentru styling ("positive" | "negative" | undefined)
 */
export const getCellValueState = (cellValue: string | number): "positive" | "negative" | undefined => {
  const numericValue = extractNumericValue(cellValue);
  if (numericValue === 0) return undefined;
  return numericValue > 0 ? "positive" : "negative";
}; 