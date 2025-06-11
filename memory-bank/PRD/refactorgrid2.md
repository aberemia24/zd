# Refactorizare LunarGrid Part 2 - Continuare Ultra Detaliată

## 🎯 TASK 8: Modals Container (Pas cu Pas)

### REQUEST 8.1: Creează fișierul pentru modals
```
În components/, creează: LunarGridModals.tsx

Cu conținut:
```tsx
import React, { CSSProperties } from 'react';
import CellTransactionPopover from "../CellTransactionPopover";
import { QuickAddModal } from "../modals/QuickAddModal";

interface LunarGridModalsProps {
  // TODO: props
}

const LunarGridModals: React.FC<LunarGridModalsProps> = (props) => {
  return null;
};

export default LunarGridModals;
```

DOAR atât.
```

### REQUEST 8.2: Găsește popover render
```
În LunarGridTanStack.tsx, caută în return statement:
"{popover && ("

Raportează:
1. La ce linie începe
2. Câte linii are secțiunea până la closing )}
3. Ce componente folosește
```

### REQUEST 8.3: Găsește modal render
```
În LunarGridTanStack.tsx, caută în return statement:
"{modalState && ("

Raportează:
1. La ce linie începe
2. Ce props primește QuickAddModal
3. Ce handlers sunt pasați
```

### REQUEST 8.4: Definește interfața completă
```
În LunarGridModals.tsx, înlocuiește interfața cu:

```tsx
interface LunarGridModalsProps {
  // Popover props
  popover: PopoverState | null;
  popoverStyle: CSSProperties;
  year: number;
  month: number;
  onSavePopover: (data: {
    amount: string;
    recurring: boolean;
    frequency?: FrequencyType;
  }) => void;
  onCancelPopover: () => void;
  
  // Modal props
  modalState: ModalState | null;
  onSaveModal: (data: {
    amount: string;
    description: string;
    recurring: boolean;
    frequency?: FrequencyType;
  }) => void;
  onCancelModal: () => void;
  onDeleteFromModal?: () => void;
}
```

Adaugă și imports pentru types:
```tsx
import type { PopoverState, ModalState } from "../LunarGridTanStack";
import { FrequencyType } from "@shared-constants";
```
```

### REQUEST 8.5: Copiază popover section
```
Din LunarGridTanStack, COPIAZĂ secțiunea popover (de la {popover && până la closing)

În LunarGridModals, în return statement pune:
```tsx
return (
  <>
    {props.popover && (
      // LIPEȘTE AICI secțiunea popover
      // Înlocuiește toate referințele cu props.X
    )}
  </>
);
```

Înlocuiri necesare:
- popover → props.popover
- popoverStyle → props.popoverStyle
- handleSavePopover → props.onSavePopover
- etc.
```

### REQUEST 8.6: Adaugă modal section
```
După secțiunea popover în LunarGridModals, adaugă:

```tsx
{props.modalState && (
  <QuickAddModal
    cellContext={{
      category: props.modalState.category,
      subcategory: props.modalState.subcategory,
      day: props.modalState.day,
      month: props.month,
      year: props.year,
    }}
    prefillAmount={props.modalState.existingValue ? String(props.modalState.existingValue) : ""}
    mode={props.modalState.mode}
    position={props.modalState.position}
    onSave={props.onSaveModal}
    onCancel={props.onCancelModal}
    onDelete={props.modalState.mode === 'edit' ? props.onDeleteFromModal : undefined}
  />
)}
```

EXACT așa, nu modifica.
```

### REQUEST 8.7: Integrează în principal
```
În LunarGridTanStack.tsx:

1. Import: import LunarGridModals from "./components/LunarGridModals";
2. ȘTERGE ambele secțiuni (popover și modalState) din return
3. Înlocuiește cu:
   ```tsx
   <LunarGridModals
     popover={popover}
     popoverStyle={popoverStyle}
     year={year}
     month={month}
     onSavePopover={handleSavePopover}
     onCancelPopover={() => setPopover(null)}
     modalState={modalState}
     onSaveModal={handleSaveModal}
     onCancelModal={handleCloseModal}
     onDeleteFromModal={handleDeleteFromModal}
   />
   ```

Adaugă ÎNAINTE de </> (closing fragment).
```

**✅ Verificare:** Click pe celule arată modal/popover

---

## 🎯 TASK 9: Subcategory Add State (Primul Pas)

### REQUEST 9.1: Extinde hook-ul de state
```
În hooks/useLunarGridState.ts, DUPĂ useLunarGridEditingState, adaugă:

```tsx
export const useLunarGridSubcategoryState = () => {
  const [addingSubcategory, setAddingSubcategory] = useState<string | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>("");
  
  return {
    addingSubcategory,
    setAddingSubcategory,
    newSubcategoryName,
    setNewSubcategoryName,
    
    // Helpers
    startAddingSubcategory: (category: string) => {
      setAddingSubcategory(category);
      setNewSubcategoryName("");
    },
    cancelAddingSubcategory: () => {
      setAddingSubcategory(null);
      setNewSubcategoryName("");
    }
  };
};
```

DOAR aceste 2 state-uri pentru început.
```

### REQUEST 9.2: Înlocuiește în principal
```
În LunarGridTanStack.tsx:

1. Găsește și COMENTEAZĂ (nu șterge):
   - const [addingSubcategory, setAddingSubcategory] = ...
   - const [newSubcategoryName, setNewSubcategoryName] = ...

2. După useLunarGridEditingState, adaugă:
   ```tsx
   const {
     addingSubcategory,
     setAddingSubcategory,
     newSubcategoryName,
     setNewSubcategoryName,
     startAddingSubcategory,
     cancelAddingSubcategory
   } = useLunarGridSubcategoryState();
   ```

3. Înlocuiește în handleCancelAddSubcategory:
   - În loc de setAddingSubcategory(null) și setNewSubcategoryName("")
   - Folosește: cancelAddingSubcategory()

NU modifica altceva.
```

---

## 🎯 TASK 10: Extract Subcategory Add Row (Super Specific)

### REQUEST 10.1: Găsește Add Subcategory Row
```
În LunarGridTanStack.tsx, în funcția renderRow, caută:
"canAddSubcategory &&"

Raportează:
1. Ce condiție completă are
2. Câte linii are <tr> pentru add subcategory
3. Ce se întâmplă când addingSubcategory === category
```

### REQUEST 10.2: Creează component pentru Add Row
```
Creează: components/LunarGridAddSubcategoryRow.tsx

```tsx
import React from 'react';
import { Button } from "../../../primitives/Button/Button";
import { Plus } from "lucide-react";
import { cn } from "../../../../styles/cva/shared/utils";
import {
  gridSubcategoryRow,
  gridSubcategoryState,
  gridCell,
  gridInput,
  gridInteractive
} from "../../../../styles/cva/grid";
import { flex } from "../../../../styles/cva/components/layout";
import { BUTTONS, PLACEHOLDERS, LUNAR_GRID_ACTIONS } from "@shared-constants";

interface AddSubcategoryRowProps {
  category: string;
  isAdding: boolean;
  inputValue: string;
  totalColumns: number;
  onInputChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onStartAdd: () => void;
}

const LunarGridAddSubcategoryRow: React.FC<AddSubcategoryRowProps> = ({
  category,
  isAdding,
  inputValue,
  totalColumns,
  onInputChange,
  onSave,
  onCancel,
  onStartAdd
}) => {
  return (
    <tr className={cn(
      gridSubcategoryRow({ variant: "professional" }),
      gridSubcategoryState({ variant: "adding" })
    )}>
      <td className={cn(
        gridCell({ type: "subcategory" }),
        gridSubcategoryState({ cell: "backdrop" })
      )}>
        {isAdding ? (
          <div className={flex({ align: "center", gap: "md" })}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={PLACEHOLDERS.SUBCATEGORY_NAME}
              className={cn(
                gridInput({ variant: "professional", state: "editing" }),
                "flex-1 focus-ring-primary"
              )}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === LUNAR_GRID_ACTIONS.ENTER_KEY) {
                  onSave();
                } else if (e.key === LUNAR_GRID_ACTIONS.ESCAPE_KEY) {
                  onCancel();
                }
              }}
              data-testid={`new-subcategory-input-${category}`}
            />
            <Button
              size="sm"
              variant="primary"
              onClick={onSave}
              disabled={!inputValue.trim()}
              data-testid={`save-subcategory-${category}`}
              className="hover-scale"
            >
              ✓
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={onCancel}
              data-testid={`cancel-subcategory-${category}`}
              className="hover-scale"
            >
              ✕
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={onStartAdd}
            className={cn(
              gridInteractive({ variant: "addButton", size: "auto" }),
              flex({ align: "center", gap: "sm" })
            )}
            data-testid={`add-subcategory-${category}`}
          >
            <Plus size={14} className="text-professional-primary" />
            <span className="text-professional-body font-medium">{BUTTONS.ADD_SUBCATEGORY}</span>
          </Button>
        )}
      </td>
      {/* Empty cells */}
      {Array.from({ length: totalColumns - 1 }).map((_, idx) => (
        <td 
          key={`empty-${idx}`}
          className={cn(gridCell({ type: "value", state: "readonly" }))}
        />
      ))}
    </tr>
  );
};

export default LunarGridAddSubcategoryRow;
```

EXACT acest cod.
```

### REQUEST 10.3: Înlocuiește în renderRow
```
În renderRow, găsește secțiunea {canAddSubcategory && (<tr>...

ÎNLOCUIEȘTE TOATĂ secțiunea <tr> cu:

```tsx
{canAddSubcategory && (
  <LunarGridAddSubcategoryRow
    category={original.category}
    isAdding={addingSubcategory === original.category}
    inputValue={newSubcategoryName}
    totalColumns={table.getFlatHeaders().length}
    onInputChange={setNewSubcategoryName}
    onSave={() => handleAddSubcategory(original.category)}
    onCancel={cancelAddingSubcategory}
    onStartAdd={() => startAddingSubcategory(original.category)}
  />
)}
```

Import component: import LunarGridAddSubcategoryRow from "./components/LunarGridAddSubcategoryRow";
```

**✅ Verificare:** Butonul Add Subcategory apare și funcționează

---

## 🎯 TASK 11: Subcategory Edit/Delete State

### REQUEST 11.1: Adaugă la hook
```
În useLunarGridSubcategoryState, DUPĂ cele 2 state-uri existente, adaugă:

```tsx
const [subcategoryAction, setSubcategoryAction] = useState<{
  type: 'edit' | 'delete';
  category: string;
  subcategory: string;
} | null>(null);
const [editingSubcategoryName, setEditingSubcategoryName] = useState<string>("");
```

În return, adaugă:
```tsx
subcategoryAction,
setSubcategoryAction,
editingSubcategoryName,
setEditingSubcategoryName,

// More helpers
startEditingSubcategory: (category: string, subcategory: string) => {
  setSubcategoryAction({ type: 'edit', category, subcategory });
  setEditingSubcategoryName(subcategory);
},
startDeletingSubcategory: (category: string, subcategory: string) => {
  setSubcategoryAction({ type: 'delete', category, subcategory });
},
clearSubcategoryAction: () => {
  setSubcategoryAction(null);
  setEditingSubcategoryName("");
}
```
```

### REQUEST 11.2: Înlocuiește în principal
```
În LunarGridTanStack.tsx:

1. COMENTEAZĂ:
   - const [subcategoryAction, setSubcategoryAction] = ...
   - const [editingSubcategoryName, setEditingSubcategoryName] = ...

2. Extinde destructuring pentru useLunarGridSubcategoryState:
   ```tsx
   const {
     // existing...
     subcategoryAction,
     setSubcategoryAction,
     editingSubcategoryName,
     setEditingSubcategoryName,
     startEditingSubcategory,
     clearSubcategoryAction
   } = useLunarGridSubcategoryState();
   ```

3. În DeleteSubcategoryModal onCancel, înlocuiește:
   - setSubcategoryAction(null) → clearSubcategoryAction()
```

---

## 🎯 TASK 12: Extract Subcategory Row Component

### REQUEST 12.1: Identifică subcategory row logic
```
În renderRow din LunarGridTanStack, găsește partea unde se randează subcategory rows.
Caută "isSubcategory ?" 

Raportează:
1. Cum arată structura pentru edit mode
2. Cum arată pentru normal mode
3. Ce butoane are (Edit/Delete)
```

### REQUEST 12.2: Creează Subcategory Row Component
```
Creează: components/LunarGridSubcategoryRow.tsx

```tsx
import React from 'react';
import { Button } from "../../../primitives/Button/Button";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "../../../../styles/cva/shared/utils";
import {
  gridCell,
  gridInput,
  gridBadge,
  gridCellActions,
  gridActionButton
} from "../../../../styles/cva/grid";
import { flex } from "../../../../styles/cva/components/layout";
import { FLAGS, UI, LUNAR_GRID_ACTIONS } from "@shared-constants";

interface SubcategoryRowCellProps {
  category: string;
  subcategory: string;
  isCustom: boolean;
  isEditing: boolean;
  editingValue: string;
  onEditingValueChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onStartDelete: () => void;
}

const LunarGridSubcategoryRowCell: React.FC<SubcategoryRowCellProps> = ({
  category,
  subcategory,
  isCustom,
  isEditing,
  editingValue,
  onEditingValueChange,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onStartDelete
}) => {
  return (
    <div className={flex({ justify: "between", gap: "sm", width: "full" })}>
      <div className={flex({ align: "center", gap: "md" })}>
        {isEditing ? (
          <div className={flex({ align: "center", gap: "sm" })}>
            <input
              type="text"
              value={editingValue}
              onChange={(e) => onEditingValueChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === LUNAR_GRID_ACTIONS.ENTER_KEY && editingValue.trim()) {
                  onSaveEdit();
                } else if (e.key === LUNAR_GRID_ACTIONS.ESCAPE_KEY) {
                  onCancelEdit();
                }
              }}
              className={cn(
                gridInput({ variant: "professional", state: "editing" }),
                "flex-1 animate-scale-in focus-ring-primary"
              )}
              autoFocus
              data-testid={`edit-subcategory-input-${subcategory}`}
            />
            <Button
              size="xs"
              variant="primary"
              onClick={onSaveEdit}
              disabled={!editingValue.trim()}
              data-testid={`save-edit-subcategory-${subcategory}`}
              className="hover-scale"
            >
              ✓
            </Button>
            <Button
              size="xs"
              variant="secondary"
              onClick={onCancelEdit}
              data-testid={`cancel-edit-subcategory-${subcategory}`}
              className="hover-scale"
            >
              ✕
            </Button>
          </div>
        ) : (
          <div className={flex({ align: "center", gap: "md" })}>
            <span className="text-professional-body contrast-high">
              {subcategory}
            </span>
            {isCustom && (
              <div className={cn(
                gridBadge({ variant: "custom", size: "sm" }),
                "animate-bounce-subtle text-professional-caption"
              )}>
                {FLAGS.CUSTOM}
              </div>
            )}
          </div>
        )}
      </div>
      
      {!isEditing && isCustom && (
        <div className={cn(
          gridCellActions({ variant: "professional" }),
          "animate-fade-in-up"
        )}>
          <button
            className={cn(
              gridActionButton({ variant: "primary", size: "sm" }),
              "hover-lift"
            )}
            onClick={onStartEdit}
            data-testid={`edit-subcategory-btn-${subcategory}`}
            title={UI.SUBCATEGORY_ACTIONS.RENAME_TITLE}
          >
            <Edit size={12} />
          </button>
          <button
            className={cn(
              gridActionButton({ variant: "danger", size: "sm" }),
              "hover-lift"
            )}
            onClick={onStartDelete}
            data-testid={`delete-subcategory-btn-${subcategory}`}
            title={UI.SUBCATEGORY_ACTIONS.DELETE_CUSTOM_TITLE}
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LunarGridSubcategoryRowCell;
```
```

### REQUEST 12.3: Folosește în renderRow
```
În renderRow, găsește unde se randează subcategory cell (primul TD pentru isSubcategory).

Înlocuiește DOAR conținutul din <div className={flex({ justify: "between"... până la </div> cu:

```tsx
<LunarGridSubcategoryRowCell
  category={original.category}
  subcategory={original.subcategory!}
  isCustom={(() => {
    const categoryData = categories.find(cat => cat.name === original.category);
    const subcategoryData = categoryData?.subcategories?.find(sub => sub.name === original.subcategory);
    return subcategoryData?.isCustom || false;
  })()}
  isEditing={
    subcategoryAction?.type === 'edit' && 
    subcategoryAction.category === original.category && 
    subcategoryAction.subcategory === original.subcategory
  }
  editingValue={editingSubcategoryName}
  onEditingValueChange={setEditingSubcategoryName}
  onSaveEdit={() => handleRenameSubcategory(original.category, original.subcategory!, editingSubcategoryName)}
  onCancelEdit={clearSubcategoryAction}
  onStartEdit={() => startEditingSubcategory(original.category, original.subcategory!)}
  onStartDelete={() => {
    setSubcategoryAction({
      type: 'delete',
      category: original.category,
      subcategory: original.subcategory!
    });
  }}
/>
```

Import: import LunarGridSubcategoryRowCell from "./components/LunarGridSubcategoryRowCell";
```

**✅ Verificare:** Edit/Delete butoane apar și funcționează

---

## 🎯 TASK 13: Consolidează restul state-urilor

### REQUEST 13.1: Creează main state hook
```
În hooks/useLunarGridState.ts, la FINAL, adaugă:

```tsx
export const useLunarGridState = (year: number, month: number) => {
  const editing = useLunarGridEditingState();
  const subcategory = useLunarGridSubcategoryState();
  const [expandedRows, setExpandedRows] = usePersistentExpandedRows(year, month);
  
  return {
    ...editing,
    ...subcategory,
    expandedRows,
    setExpandedRows,
    
    // Global clear
    clearAllState: () => {
      editing.clearAllEditing();
      subcategory.cancelAddingSubcategory();
      subcategory.clearSubcategoryAction();
    }
  };
};
```

Import: import { usePersistentExpandedRows } from "../utils/lunarGridHelpers";
```

### REQUEST 13.2: Înlocuiește în principal
```
În LunarGridTanStack.tsx:

1. COMENTEAZĂ toate state-urile individuale
2. Înlocuiește cu un singur:
   ```tsx
   const {
     // Editing
     popover,
     setPopover,
     modalState,
     setModalState,
     highlightedCell,
     setHighlightedCell,
     clearAllEditing,
     
     // Subcategory
     addingSubcategory,
     setAddingSubcategory,
     newSubcategoryName,
     setNewSubcategoryName,
     subcategoryAction,
     setSubcategoryAction,
     editingSubcategoryName,
     setEditingSubcategoryName,
     startAddingSubcategory,
     cancelAddingSubcategory,
     startEditingSubcategory,
     clearSubcategoryAction,
     
     // Expanded
     expandedRows,
     setExpandedRows
   } = useLunarGridState(year, month);
   ```

3. ȘTERGE vechile hooks calls
```

**✅ Verificare:** Totul funcționează ca înainte

---

## 🎯 TASK 14: Curățare Finală

### REQUEST 14.1: Șterge cod comentat
```
În LunarGridTanStack.tsx:

1. Găsește toate liniile comentate cu // const [
2. ȘTERGE-le definitiv
3. Verifică că nu ai erori TypeScript
```

### REQUEST 14.2: Organizează imports
```
Reorganizează imports în această ordine:

```tsx
// React & Libraries
import React, { useCallback, useState, useMemo, memo, useEffect, useRef } from 'react';
import { flexRender, Row } from "@tanstack/react-table";
import toast from 'react-hot-toast';
import { ChevronRight } from "lucide-react";

// Hooks
import { useLunarGridTable } from "./hooks/useLunarGridTable";
import { useLunarGridState } from "./hooks/useLunarGridState";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useMonthlyTransactions } from '../../../services/hooks/useMonthlyTransactions';
import { useCreateTransactionMonthly, useUpdateTransactionMonthly, useDeleteTransactionMonthly } from '../../../services/hooks/transactionMutations';

// Components
import LunarGridToolbar from "./components/LunarGridToolbar";
import LunarGridModals from "./components/LunarGridModals";
import LunarGridCell from "./components/LunarGridCell";
import LunarGridAddSubcategoryRow from "./components/LunarGridAddSubcategoryRow";
import LunarGridSubcategoryRowCell from "./components/LunarGridSubcategoryRowCell";
import DeleteSubcategoryModal from "./components/DeleteSubcategoryModal";
import Button from "../../primitives/Button/Button";
import Badge from "../../primitives/Badge/Badge";

// Stores
import { useCategoryStore } from "../../../stores/categoryStore";
import { useAuthStore } from "../../../stores/authStore";

// Styles
import { cn } from "../../../styles/cva/shared/utils";
import { gridContainer, gridTable, ... } from "../../../styles/cva/grid";

// Types & Constants
import type { TransactionType, FrequencyType } from "@shared-constants";
import { LUNAR_GRID_MESSAGES, MESAJE, ... } from "@shared-constants";
```

DOAR reorganizează, nu șterge.
```

### REQUEST 14.3: Verifică numărul de linii
```
Raportează:
1. Câte linii are acum LunarGridTanStack.tsx
2. Câte linii are renderRow
3. Care sunt cele mai mari funcții rămase

Target: sub 600 linii total
```

---

## 🎯 TASK 15: Extract renderRow (Dacă e nevoie)

### REQUEST 15.1: Analizează renderRow
```
Dacă renderRow are peste 150 linii, raportează:
1. Ce părți distincte are
2. Ce se repetă
3. Ce ar putea fi extras

NU face nimic, doar analizează.
```

### REQUEST 15.2: Creează Row Renderer Helper
```
DOAR dacă e necesar:

Creează: utils/renderRowHelpers.ts

Mută DOAR părțile care se pot extrage ușor:
- Expand icon render
- Cell style calculations
- Empty cells render

NU muta logica principală.
```

---

## ✅ FINAL CHECKLIST

```
După toate task-urile, verifică:

[ ] LunarGridTanStack.tsx < 600 linii
[ ] Toate funcționalitățile merg:
    [ ] Expand/Collapse categorii
    [ ] Add subcategory
    [ ] Edit subcategory  
    [ ] Delete subcategory
    [ ] Edit cell values
    [ ] Single click modal
    [ ] Double click inline edit
    [ ] Keyboard navigation
    [ ] Delete with keyboard
[ ] No TypeScript errors
[ ] No console errors
[ ] Performance OK
```

---

## 🎉 REZULTAT FINAL

Structura ta ar trebui să fie:
```
LunarGridTanStack.tsx (~500-600 linii)
├── components/
│   ├── LunarGridToolbar.tsx (~50 linii)
│   ├── LunarGridModals.tsx (~80 linii)
│   ├── LunarGridCell.tsx (~30 linii)
│   ├── LunarGridAddSubcategoryRow.tsx (~100 linii)
│   ├── LunarGridSubcategoryRowCell.tsx (~120 linii)
│   └── DeleteSubcategoryModal.tsx (~50 linii)
├── hooks/
│   └── useLunarGridState.ts (~100 linii)
└── utils/
    └── lunarGridHelpers.ts (~50 linii)
```

**Total salvat: ~1100 linii** mutat în fișiere organizate!