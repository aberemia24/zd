# LunarGrid Architecture: Component & File Inventory (Audit V3)

This document serves as the initial file and component inventory for the LunarGrid architecture audit, corresponding to Task 1.1.

## 1. Root Directory (`frontend/src/components/features/LunarGrid/`)

-   **`LunarGridTanStack.tsx`**: The main orchestrator component. (23KB)
-   **`CellTransactionPopover.tsx`**: A popover component related to cell transactions. (5.7KB)
-   **`types.tsx`**: Root-level type definitions for LunarGrid. (8.1KB)
-   **`index.ts`**: Main entry point for the LunarGrid feature.
-   **`README.md`**: Existing documentation.

## 2. Components (`components/`)

-   **`LunarGridContainer.tsx`**: A container component.
-   **`LunarGridTable.tsx`**: The main table structure.
-   **`LunarGridHeader.tsx`**: The header component for the grid.
-   **`LunarGridToolbar.tsx`**: Toolbar with actions for the grid.
-   **`LunarGridRow.tsx`**: Component for rendering a single row.
-   **`LunarGridCell.tsx`**: Component for rendering a single cell.
-   **`LunarGridRenderer.tsx`**: A component likely responsible for rendering logic.
-   **`LunarGridEventHandler.tsx`**: Handles grid-wide events.
-   **`LunarGridStateManager.tsx`**: Manages state for the grid.
-   **`LunarGridModalManager.tsx`**: Manages modals within the grid.
-   **`LunarGridModals.tsx`**: A component that likely contains modal definitions.
-   **Subcategory Components**:
    -   `LunarGridSubcategoryRowCell.tsx`
    -   `LunarGridAddSubcategoryRow.tsx`
    -   `DeleteSubcategoryModal.tsx`

## 3. Hooks (`hooks/`)

-   **`useLunarGridState.ts`**: Hook for managing the grid's state.
-   **`useLunarGridTable.tsx`**: A large hook likely containing core table logic. (19KB)
-   **`useTransactionOperations.tsx`**: Hook for handling transaction-related actions (add, update, delete).
-   **`useSubcategoryOperations.tsx`**: Hook for handling subcategory-related actions.
-   **`useTableResize.tsx`**: Hook to manage column resizing.
-   **`useKeyboardNavigationSimplified.tsx`**: Hook for keyboard navigation within the grid.
-   **`index.ts`**: Entry point for hooks.

## 4. Inline Editing (`inline-editing/`)

-   **`EditableCell.tsx`**: The core component for inline editing functionality. (24KB)
-   **`useInlineCellEdit.tsx`**: Hook to manage the state and logic of inline cell editing.
-   **`LunarGridInlineIntegration.tsx`**: Component to integrate inline editing into the grid.
-   **Navigation Hooks**:
    -   `useGridNavigation.tsx`
    -   `useGridNavigation_Simplified.tsx`
    -   `useGridNavigation_Original.tsx` (Indicates refactoring history and potential dead code)
-   **Documentation & Tests**:
    -   `KEYBOARD_SHORTCUTS.md`, `EditableCell.props.md`, etc.
    -   `*.test.tsx` files for `EditableCell`, `useInlineCellEdit`, and `useGridNavigation`.

## 5. Modals (`modals/`)

-   **`QuickAddModalSimplified.tsx`**: A simplified modal for quick additions.
-   **`TransactionPopover.tsx`**: A popover for transactions.
-   **`types.ts`**: Type definitions specific to modals.
-   **`index.ts`**: Entry point for modals. 