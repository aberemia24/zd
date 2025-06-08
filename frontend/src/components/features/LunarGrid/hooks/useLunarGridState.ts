import { useState, useCallback } from "react";
import type { CellPosition } from "./useKeyboardNavigationSimplified";

export const useLunarGridState = () => {
    // State pentru celula evidențiată
    const [highlightedCell, setHighlightedCell] = useState<CellPosition | null>(null);

    // State pentru subcategorii
    const [addingSubcategory, setAddingSubcategory] = useState<string | null>(null);
    const [newSubcategoryName, setNewSubcategoryName] = useState("");
    const [subcategoryAction, setSubcategoryAction] = useState<{
        type: 'edit' | 'delete';
        category: string;
        subcategory: string;
    } | null>(null);
    const [editingSubcategoryName, setEditingSubcategoryName] = useState("");

    // State pentru rândurile extinse
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const cancelAddingSubcategory = useCallback(() => {
        setAddingSubcategory(null);
        setNewSubcategoryName("");
    }, []);

    const startEditingSubcategory = useCallback((category: string, subcategory: string) => {
        setSubcategoryAction({ type: 'edit', category, subcategory });
        setEditingSubcategoryName(subcategory);
    }, []);

    const startDeletingSubcategory = useCallback((category: string, subcategory: string) => {
        setSubcategoryAction({ type: 'delete', category, subcategory });
    }, []);

    const clearSubcategoryAction = useCallback(() => {
        setSubcategoryAction(null);
        setEditingSubcategoryName("");
    }, []);

    return {
        highlightedCell,
        setHighlightedCell,
        addingSubcategory,
        setAddingSubcategory,
        newSubcategoryName,
        setNewSubcategoryName,
        subcategoryAction,
        setSubcategoryAction,
        editingSubcategoryName,
        setEditingSubcategoryName,
        cancelAddingSubcategory,
        startEditingSubcategory,
        startDeletingSubcategory,
        clearSubcategoryAction,
        expandedRows,
        setExpandedRows,
    };
}; 