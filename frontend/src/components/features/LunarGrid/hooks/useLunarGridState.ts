import { useState, useCallback } from 'react';
import { usePersistentExpandedRows } from '../../../../utils/lunarGrid/lunarGridHelpers';
import { TransactionType } from "@shared-constants";

// Interfațe pentru state management
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

interface ModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  category: string;
  subcategory: string | undefined;
  day: number;
  year: number;
  month: number;
  existingValue?: string | number;
  transactionId?: string | null;
  anchorEl?: HTMLElement;
  position?: { top: number; left: number };
}

interface HighlightedCell {
  category: string;
  subcategory: string | undefined;
  day: number;
}

interface SubcategoryAction {
  type: 'edit' | 'delete';
  category: string;
  subcategory: string;
}

/**
 * Hook custom pentru gestionarea state-urilor de editing în LunarGrid
 * Consolidează toate state-urile legate de UI interactions
 */
export const useLunarGridEditingState = () => {
  // Core editing states
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [highlightedCell, setHighlightedCell] = useState<HighlightedCell | null>(null);

  // Subcategory management states
  const [addingSubcategory, setAddingSubcategory] = useState<string | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>("");
  const [subcategoryAction, setSubcategoryAction] = useState<SubcategoryAction | null>(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState<string>("");

  // Helper pentru clear all editing states
  const clearAllEditingStates = useCallback(() => {
    setPopover(null);
    setModalState(null);
    setHighlightedCell(null);
    setAddingSubcategory(null);
    setNewSubcategoryName("");
    setSubcategoryAction(null);
    setEditingSubcategoryName("");
  }, []);

  // Helper pentru clear doar modal states
  const clearModalStates = useCallback(() => {
    setModalState(null);
    setHighlightedCell(null);
  }, []);

  // Helper pentru clear doar popover state
  const clearPopoverState = useCallback(() => {
    setPopover(null);
  }, []);

  // Helper pentru clear doar subcategory editing states
  const clearSubcategoryStates = useCallback(() => {
    setAddingSubcategory(null);
    setNewSubcategoryName("");
    setSubcategoryAction(null);
    setEditingSubcategoryName("");
  }, []);

  return {
    // Core editing states
    popover,
    setPopover,
    modalState,
    setModalState,
    highlightedCell,
    setHighlightedCell,

    // Subcategory management states
    addingSubcategory,
    setAddingSubcategory,
    newSubcategoryName,
    setNewSubcategoryName,
    subcategoryAction,
    setSubcategoryAction,
    editingSubcategoryName,
    setEditingSubcategoryName,

    // Helper functions
    clearAllEditingStates,
    clearModalStates,
    clearPopoverState,
    clearSubcategoryStates,
  };
};

/**
 * Hook specializat pentru gestionarea state-ului de adăugare subcategorie
 * Extrage și izolează logica specifică pentru add subcategory operations
 */
export const useLunarGridSubcategoryState = () => {
  // Subcategory management states
  const [addingSubcategory, setAddingSubcategory] = useState<string | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>("");
  const [subcategoryAction, setSubcategoryAction] = useState<SubcategoryAction | null>(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState<string>("");

  // Helper functions pentru subcategory management
  const startAddingSubcategory = (category: string) => {
    setAddingSubcategory(category);
    setNewSubcategoryName("");
  };

  const cancelAddingSubcategory = () => {
    setAddingSubcategory(null);
    setNewSubcategoryName("");
  };

  const startEditingSubcategory = (category: string, subcategory: string) => {
    setSubcategoryAction({
      type: 'edit',
      category,
      subcategory
    });
    setEditingSubcategoryName(subcategory);
  };

  const startDeletingSubcategory = (category: string, subcategory: string) => {
    setSubcategoryAction({
      type: 'delete',
      category,
      subcategory
    });
  };

  const clearSubcategoryAction = () => {
    setSubcategoryAction(null);
    setEditingSubcategoryName("");
  };

  return {
    // States
    addingSubcategory,
    setAddingSubcategory,
    newSubcategoryName,
    setNewSubcategoryName,
    subcategoryAction,
    setSubcategoryAction,
    editingSubcategoryName,
    setEditingSubcategoryName,
    
    // Helper functions
    startAddingSubcategory,
    cancelAddingSubcategory,
    startEditingSubcategory,
    startDeletingSubcategory,
    clearSubcategoryAction,
  };
};

// 🎯 TASK 13: Master Hook pentru toate LunarGrid state-urile
export const useLunarGridState = (year: number, month: number) => {
  // Editing states (folosesc null pentru compatibilitate cu LunarGridTanStack)
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [highlightedCell, setHighlightedCell] = useState<HighlightedCell | null>(null);

  // Subcategory states
  const subcategory = useLunarGridSubcategoryState();

  // Expanded rows state
  const [expandedRows, setExpandedRows] = usePersistentExpandedRows(year, month);

  // Helper functions pentru editing
  const clearAllEditing = () => {
    setPopover(null);
    setModalState(null);
    setHighlightedCell(null);
  };

  return {
    // Editing
    popover,
    setPopover,
    modalState,
    setModalState,
    highlightedCell,
    setHighlightedCell,
    clearAllEditing,

    // Subcategory (toate din subcategory hook)
    ...subcategory,

    // Expanded
    expandedRows,
    setExpandedRows,

    // Global clear
    clearAllState: () => {
      clearAllEditing();
      subcategory.cancelAddingSubcategory();
      subcategory.clearSubcategoryAction();
    }
  };
}; 