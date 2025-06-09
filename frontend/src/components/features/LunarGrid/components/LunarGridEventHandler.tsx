import React, { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FrequencyType, TransactionType, LUNAR_GRID_ACTIONS } from "@budget-app/shared-constants";
import { calculatePopoverStyle } from "../../../../utils/lunarGrid/lunarGridHelpers";
import type { LunarGridStateResult } from './LunarGridStateManager';
import type { CellPosition } from "../hooks/useKeyboardNavigationSimplified";

// Interfaces for handler props and result
interface PopoverFormData {
  amount: string;
  recurring: boolean;
  frequency?: FrequencyType;
}

interface ModalFormData {
  amount: string;
  description: string;
  recurring: boolean;
  frequency?: FrequencyType;
}

// Consolidated handlers result interface
export interface LunarGridHandlers {
  // Core editing handlers
  handleEditableCellSave: (
    category: string,
    subcategory: string | undefined,
    day: number,
    value: string | number,
    transactionId: string | null,
  ) => Promise<void>;
  
  handleCellClick: (
    e: React.MouseEvent,
    category: string,
    subcategory: string | undefined,
    day: number,
    amount: string,
  ) => void;
  
  handleSingleClickModal: (
    category: string,
    subcategory: string | undefined,
    day: number,
    currentValue: string | number,
    transactionId: string | null,
    anchorElement?: HTMLElement,
  ) => void;
  
  // Modal and popover handlers
  handleSavePopover: (formData: PopoverFormData) => Promise<void>;
  handleSaveModal: (data: ModalFormData) => Promise<void>;
  handleDeleteFromModal: () => Promise<void>;
  handleCloseModal: () => void;
  
  // Subcategory management handlers
  handleDeleteSubcategory: (categoryName: string, subcategoryName: string) => Promise<void>;
  handleAddSubcategory: (categoryName: string) => Promise<void>;
  
  // Navigation and interaction handlers
  navHandleCellClick: (position: CellPosition, modifiers: { ctrlKey: boolean; shiftKey: boolean; metaKey: boolean }) => void;
  
  // Row expansion handlers
  handleExpandToggle: (rowId: string, isExpanded: boolean) => void;
  handleToggleExpandAll: () => void;
  handleResetExpanded: () => void;
  
  // Subcategory editing handlers
  handleSubcategoryEdit: (category: string, newName: string) => void;
  handleSubcategoryDelete: (category: string, subcategory: string) => void;
  handleEditingValueChange: (newName: string | null) => void;
  handleSetAddingSubcategory: (category: string | null) => void;
  handleSetNewSubcategoryName: (name: string) => void;
  
  // Calculated values for UI
  popoverStyle: React.CSSProperties;
  
  // Helper functions for container events
  onContainerSubmit: (e: React.FormEvent) => void;
  onContainerClick: (e: React.MouseEvent) => void;
  onContainerWheel: (e: React.WheelEvent) => void;
}

// Props for the EventHandler component
interface LunarGridEventHandlerProps {
  stateManager: LunarGridStateResult;
  year: number;
  month: number;
  children: (handlers: LunarGridHandlers) => React.ReactNode;
}

/**
 * LunarGridEventHandler - Centralized event handling for LunarGrid
 * 
 * Responsibilities:
 * - All event handler functions (12 main handlers)
 * - Modal/popover event management  
 * - Cell interaction logic coordination
 * - Event handler distribution via render prop pattern
 * 
 * Uses render prop pattern to distribute handlers to consuming components
 */
const LunarGridEventHandler: React.FC<LunarGridEventHandlerProps> = ({
  stateManager,
  year,
  month,
  children,
}) => {
  // Always call hooks in the same order - extract all state values first
  const {
    popover,
    setPopover,
    modalState,
    setModalState,
    highlightedCell,
    setHighlightedCell,
    transactionOps,
    subcategoryOps,
    navHandleCellClick,
    scrollableContainerRef,
  } = stateManager;

  // Helper function for determining transaction type
  const determineTransactionType = useCallback(
    (category: string): TransactionType => {
      const categories = stateManager.categories;
      const foundCategory = categories.find((c: any) => c.name === category);
      return (foundCategory?.type || TransactionType.EXPENSE) as TransactionType;
    },
    [stateManager.categories],
  );

  // Core editing handlers
  const handleEditableCellSave = useCallback(
    async (
      category: string,
      subcategory: string | undefined,
      day: number,
      value: string | number,
      transactionId: string | null,
    ): Promise<void> => {
      await transactionOps.handleEditableCellSave(category, subcategory, day, value, transactionId);
      // Highlight remains to show active cell
    },
    [transactionOps],
  );

  // Cell click handler (Shift+Click for advanced modal)
  const handleCellClick = useCallback(
    (
      e: React.MouseEvent,
      category: string,
      subcategory: string | undefined,
      day: number,
      amount: string,
    ) => {
      e.stopPropagation();

      // Only open modal for Shift+Click (advanced editing)
      if (!e.shiftKey) return;

      // Verify currentTarget is valid
      const anchorEl = e.currentTarget as HTMLElement;
      if (!anchorEl) return;

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
    [determineTransactionType, setPopover],
  );

  // Single click modal handler (primary interaction)
  const handleSingleClickModal = useCallback(
    (
      category: string,
      subcategory: string | undefined,
      day: number,
      currentValue: string | number,
      transactionId: string | null,
      anchorElement?: HTMLElement,
    ) => {
      // Determine mode: edit if transaction exists, add otherwise
      const mode: 'add' | 'edit' = transactionId ? 'edit' : 'add';

      // Position calculation with validation
      const position = anchorElement && anchorElement.isConnected ? {
        top: anchorElement.getBoundingClientRect().top + window.scrollY,
        left: anchorElement.getBoundingClientRect().left + window.scrollX,
      } : undefined; // Undefined for centered modal with overlay



      // Set modal state
      setModalState({
        isOpen: true,
        mode,
        category,
        subcategory,
        day,
        year,
        month,
        existingValue: currentValue,
        position,
        transactionId,
      });

      // Set highlighted cell
      setHighlightedCell({
        category,
        subcategory,
        day,
      });
    },
    [setModalState, setHighlightedCell, year, month],
  );

  // Modal and popover handlers
  const handleSavePopover = useCallback(
    async (formData: PopoverFormData) => {
      try {
        await transactionOps.handleSavePopover(popover, formData);
        setPopover(null);
      } catch (error) {
        // Error handling is in the hook
        setPopover(null);
      }
    },
    [transactionOps, popover, setPopover],
  );

  const handleSaveModal = useCallback(
    async (data: ModalFormData) => {
      try {
        await transactionOps.handleSaveModal(modalState, data);
        setModalState(null);
        setHighlightedCell(null);
      } catch (error) {
        // Error handling is in the hook
      }
    },
    [transactionOps, modalState, setModalState, setHighlightedCell],
  );

  const handleDeleteFromModal = useCallback(
    async () => {
      try {
        await transactionOps.handleDeleteFromModal(modalState);
        setModalState(null);
        setHighlightedCell(null);
      } catch (error) {
        // Error handling is in the hook
      }
    },
    [transactionOps, modalState, setModalState, setHighlightedCell],
  );

  const handleCloseModal = useCallback(() => {
    setModalState(null);
    setHighlightedCell(null);
  }, [setModalState, setHighlightedCell]);

  // Subcategory management handlers
  const handleDeleteSubcategory = useCallback(
    async (categoryName: string, subcategoryName: string) => {
      await subcategoryOps.handleDeleteSubcategory(categoryName, subcategoryName);
    },
    [subcategoryOps],
  );

  const handleAddSubcategory = useCallback(
    async (categoryName: string) => {
      await subcategoryOps.handleAddSubcategory(categoryName);
    },
    [subcategoryOps],
  );

  // Row expansion handlers
  const handleExpandToggle = useCallback(
    (rowId: string, isExpanded: boolean) => {
      stateManager.setExpandedRows(prev => ({
        ...prev,
        [rowId]: isExpanded
      }));
      
      // Reset addingSubcategory state când categoria se collapses
      if (!isExpanded && stateManager.addingSubcategory === rowId) {
        stateManager.setAddingSubcategory(null);
        stateManager.setNewSubcategoryName("");
      }
    },
    [stateManager],
  );

  const handleToggleExpandAll = useCallback(() => {
    const isCurrentlyExpanded = stateManager.table.getIsAllRowsExpanded();
    const newExpandedState: Record<string, boolean> = {};
    
    if (!isCurrentlyExpanded) {
      stateManager.table.getRowModel().rows.forEach(row => {
        if (row.getCanExpand()) {
          newExpandedState[row.id] = true;
        }
      });
    }
    
    stateManager.setExpandedRows(newExpandedState);
    stateManager.table.toggleAllRowsExpanded(!isCurrentlyExpanded);
  }, [stateManager]);

  const handleResetExpanded = useCallback(() => {
    stateManager.setExpandedRows({});
    stateManager.table.resetExpanded();
  }, [stateManager]);

  // Subcategory editing handlers
  const handleSubcategoryEdit = useCallback(
    (category: string, newName: string) => {
      subcategoryOps.handleRenameSubcategory(category, newName);
    },
    [subcategoryOps],
  );

  const handleSubcategoryDelete = useCallback(
    (category: string, subcategory: string) => {
      stateManager.startDeletingSubcategory(category, subcategory);
    },
    [stateManager],
  );

  const handleEditingValueChange = useCallback(
    (newName: string | null) => {
      stateManager.setEditingSubcategoryName(newName || "");
    },
    [stateManager],
  );

  const handleSetAddingSubcategory = useCallback(
    (category: string | null) => {
      stateManager.setAddingSubcategory(category);
    },
    [stateManager],
  );

  const handleSetNewSubcategoryName = useCallback(
    (name: string) => {
      stateManager.setNewSubcategoryName(name);
    },
    [stateManager],
  );

  // Container event handlers
  const onContainerSubmit = useCallback((e: React.FormEvent) => {
    // Prevent form submission causing page refresh
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onContainerClick = useCallback((e: React.MouseEvent) => {
    // Prevent unwanted clicks causing navigation
    e.stopPropagation();
  }, []);

  const onContainerWheel = useCallback((e: React.WheelEvent) => {
    // Capture mouse wheel for natural table scrolling
    e.stopPropagation();
    // Allow natural browser scrolling in container
  }, []);

  // Scroll lock effect for modal (always run, conditional logic inside)
  useEffect(() => {
    const scrollableContainer = scrollableContainerRef.current;
    if (!scrollableContainer) return;

    if (modalState?.isOpen) {
      // Save current scroll positions
      const currentScrollTop = scrollableContainer.scrollTop;
      const currentScrollLeft = scrollableContainer.scrollLeft;
      const currentPageScrollY = window.scrollY;
      const currentPageScrollX = window.scrollX;
      
      // Block table scrolling
      scrollableContainer.style.overflow = 'hidden';
      scrollableContainer.style.position = 'relative';
      
      // Block page scrolling with professional styling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${currentPageScrollY}px`;
      document.body.style.left = `-${currentPageScrollX}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // Cleanup function
      return () => {
        if (scrollableContainer) {
          // Restore table scrolling
          scrollableContainer.style.overflow = 'auto';
          scrollableContainer.style.position = '';
          scrollableContainer.scrollTop = currentScrollTop;
          scrollableContainer.scrollLeft = currentScrollLeft;
        }
        
        // Restore page scrolling
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';
        document.body.style.height = '';
        
        // Restore page scroll position
        window.scrollTo(currentPageScrollX, currentPageScrollY);
      };
    }
  }, [modalState?.isOpen, scrollableContainerRef]);

  // Calculate popover style (always calculate, conditional usage)
  const popoverStyle = calculatePopoverStyle(popover);

  // Consolidated handlers result object
  const handlers: LunarGridHandlers = {
    // Core editing handlers
    handleEditableCellSave,
    handleCellClick,
    handleSingleClickModal,
    
    // Modal and popover handlers
    handleSavePopover,
    handleSaveModal,
    handleDeleteFromModal,
    handleCloseModal,
    
    // Subcategory management handlers
    handleDeleteSubcategory,
    handleAddSubcategory,
    
    // Navigation handler
    navHandleCellClick,
    
    // Row expansion handlers
    handleExpandToggle,
    handleToggleExpandAll,
    handleResetExpanded,
    
    // Subcategory editing handlers
    handleSubcategoryEdit,
    handleSubcategoryDelete,
    handleEditingValueChange,
    handleSetAddingSubcategory,
    handleSetNewSubcategoryName,
    
    // Calculated values
    popoverStyle: popoverStyle || {},
    
    // Container event handlers
    onContainerSubmit,
    onContainerClick,
    onContainerWheel,
  };

  // Return handlers via render prop pattern
  return <>{children(handlers)}</>;
};

LunarGridEventHandler.displayName = 'LunarGridEventHandler';

export default LunarGridEventHandler;
export type { LunarGridEventHandlerProps, PopoverFormData, ModalFormData }; 