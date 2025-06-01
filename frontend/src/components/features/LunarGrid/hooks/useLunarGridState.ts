import { useState, useCallback } from 'react';
import { TransactionType, FrequencyType } from '@shared-constants'; // Asigură-te că acestea sunt tipurile corecte

// Definiții de tip pentru stările interne (similare cu cele din LunarGridTanStack)
export interface PopoverState {
  isOpen: boolean;
  category: string;
  subcategory: string | undefined;
  day: number;
  amount: string;
  type: TransactionType;
  element: HTMLElement | null;
  anchorEl?: HTMLElement;
}

export interface ModalState {
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

export interface HighlightedCellState {
  category: string;
  subcategory: string | undefined;
  day: number;
}

export interface SubcategoryEditState {
  mode: 'add' | 'edit' | 'delete' | null;
  category: string | null;
  subcategory: string | null; // Numele subcategoriei actuale pentru edit/delete
  newName: string; // Numele nou pentru add/edit
}

interface UseLunarGridStateReturn {
  // Starea pentru editarea celulelor (popover/modal)
  popoverState: PopoverState | null;
  setPopoverState: React.Dispatch<React.SetStateAction<PopoverState | null>>;
  modalState: ModalState | null;
  setModalState: React.Dispatch<React.SetStateAction<ModalState | null>>;
  highlightedCellState: HighlightedCellState | null;
  setHighlightedCellState: React.Dispatch<React.SetStateAction<HighlightedCellState | null>>;

  // Starea pentru acțiuni asupra subcategoriilor
  subcategoryActionState: SubcategoryEditState;
  setSubcategoryActionState: React.Dispatch<React.SetStateAction<SubcategoryEditState>>;
  
  // TODO: Adaugă expandedRowsState și setExpandedRowsState în Partea 2
}

export const useLunarGridState = (initialYear?: number, initialMonth?: number): UseLunarGridStateReturn => {
  // Starea pentru popover (editare avansată)
  const [popoverState, setPopoverState] = useState<PopoverState | null>(null);

  // Starea pentru modal (adaugare/editare rapidă)
  const [modalState, setModalState] = useState<ModalState | null>(null);

  // Starea pentru celula evidențiată
  const [highlightedCellState, setHighlightedCellState] = useState<HighlightedCellState | null>(null);

  // Starea pentru acțiunile asupra subcategoriilor (add, edit, delete)
  const [subcategoryActionState, setSubcategoryActionState] = useState<SubcategoryEditState>({
    mode: null,
    category: null,
    subcategory: null,
    newName: "",
  });

  // TODO: Adaugă logica pentru expandedRows în Partea 2
  // const [expandedRows, setExpandedRows] = usePersistentExpandedRows(initialYear, initialMonth);

  return {
    popoverState,
    setPopoverState,
    modalState,
    setModalState,
    highlightedCellState,
    setHighlightedCellState,
    subcategoryActionState,
    setSubcategoryActionState,
  };
}; 