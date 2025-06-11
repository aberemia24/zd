# Refactorizare LunarGrid - Ultra Detaliat pentru AI (Baby Steps)

## ⚠️ REGULI ABSOLUTE PENTRU AI

### CE SĂ NU FACI NICIODATĂ:
1. **NU crea hooks noi** decât dacă cer explicit
2. **NU extrage mai mult decât cer** - dacă zic 3 butoane, NU extrage 4
3. **NU modifica logica** - copy/paste exact
4. **NU "optimiza" cod** - lasă-l cum e
5. **NU muta funcții** decât dacă cer explicit

### CE SĂ FACI ÎNTOTDEAUNA:
1. **Numără liniile** - dacă zic 10 linii, numără exact 10
2. **Verifică de 2 ori** - ai mutat doar ce am cerut?
3. **Păstrează imports** - adaugă ce trebuie în fișierul nou
4. **Test mic** - funcționează exact ca înainte?

---

## 🎯 TASK 1: Creează Un Singur Fișier Gol

### REQUEST 1.1: Creează structura minimă
```
Creează DOAR acest folder și fișier:

frontend/src/components/features/LunarGrid/components/

În acest folder, creează DOAR fișierul:
DeleteSubcategoryModal.tsx

Cu acest conținut EXACT:
```tsx
import React from 'react';

const DeleteSubcategoryModal = () => {
  return <div>TODO: Modal aici</div>;
};

export default DeleteSubcategoryModal;
```

NU crea alte foldere sau fișiere. DOAR acesta.
```

**✅ Verificare:** Există fișierul și proiectul compilează

---

## 🎯 TASK 2: Mută Delete Modal (Cel Mai Simplu)

### REQUEST 2.1: Găsește componenta internă
```
În LunarGridTanStack.tsx, caută acest text EXACT:
"const DeleteSubcategoryConfirmation"

Ar trebui să găsești o componentă care începe cu:
const DeleteSubcategoryConfirmation = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => {

Spune-mi la ce linie este (aproximativ) și câte linii are componenta.
NU face nimic altceva, doar raportează.
```

### REQUEST 2.2: Extrae componenta
```
Acum, în DeleteSubcategoryModal.tsx:

1. ȘTERGE tot conținutul
2. COPIAZĂ EXACT componenta DeleteSubcategoryConfirmation din LunarGridTanStack
3. REDENUMEȘTE din DeleteSubcategoryConfirmation în DeleteSubcategoryModal
4. Adaugă DOAR aceste imports (verifică care sunt folosite):
   ```tsx
   import React from 'react';
   import { Button } from "../../../primitives/Button/Button";
   import { modal, modalContent, flex } from "../../../../styles/cva/components/layout";
   import { LUNAR_GRID_ACTIONS, MESAJE, BUTTONS } from "@shared-constants";
   ```
5. La final, exportă: export default DeleteSubcategoryModal;

NU modifica logica. NU adăuga props noi. DOAR mută și redenumește.
```

### REQUEST 2.3: Înlocuiește în componenta principală
```
În LunarGridTanStack.tsx:

1. ȘTERGE toată componenta DeleteSubcategoryConfirmation
2. Adaugă import: 
   import DeleteSubcategoryModal from "./components/DeleteSubcategoryModal";
3. Găsește unde era folosită (caută "DeleteSubcategoryConfirmation")
4. Înlocuiește cu DeleteSubcategoryModal (păstrează props exact cum sunt)

DOAR atât. NU modifica props, NU modifica logica.
```

**✅ Verificare:** Ștergi o subcategorie custom și apare modal-ul

---

## 🎯 TASK 3: Creează Toolbar Component (Doar Structura)

### REQUEST 3.1: Creează fișierul
```
În frontend/src/components/features/LunarGrid/components/, creează:
LunarGridToolbar.tsx

Cu acest conținut EXACT:
```tsx
import React from 'react';
import { Button } from "../../../primitives/Button/Button";

interface LunarGridToolbarProps {
  // TODO: props aici
}

const LunarGridToolbar: React.FC<LunarGridToolbarProps> = (props) => {
  return (
    <div>
      TODO: Toolbar aici
    </div>
  );
};

export default LunarGridToolbar;
```

DOAR atât. NU adăuga altceva.
```

### REQUEST 3.2: Identifică butoanele
```
În LunarGridTanStack.tsx, caută:
- Textul "toggle-expand-all" (este un data-testid)
- Ar trebui să găsești un <div> care conține 2-3 <Button> componente

Raportează:
1. La ce linie începe acest div (aproximativ)
2. Câte butoane sunt în total
3. Ce data-testid are fiecare

NU muta nimic, doar raportează.
```

### REQUEST 3.3: Identifică exact props necesare
```
Pentru fiecare buton găsit, spune-mi:
1. Ce onClick handler are (numele funcției)
2. Ce text/label afișează
3. Ce condiții are (dacă are)

Exemplu:
- Button 1: onClick={() => table.toggleAllRowsExpanded()}, text: "Expand All"
- Button 2: onClick={handleCleanOrphans}, text: "Clean", condition: orphanCount > 0

DOAR raportează, NU modifica.
```

### REQUEST 3.4: Definește interfața
```
În LunarGridToolbar.tsx, înlocuiește interface-ul cu:

```tsx
interface LunarGridToolbarProps {
  isAllExpanded: boolean;
  onToggleExpandAll: () => void;
  onResetExpanded: () => void;
  // Adaugă props pentru butonul de orphan dacă există
}
```

Adaugă DOAR props-urile identificate. NU adăuga extra.
```

### REQUEST 3.5: Copiază EXACT JSX-ul
```
Din LunarGridTanStack.tsx, COPIAZĂ EXACT div-ul cu butoanele în LunarGridToolbar.

Înlocuiește:
- onClick handlers cu props (ex: onClick={props.onToggleExpandAll})
- Orice referință la state local cu props

Exemplu:
- ÎNAINTE: onClick={() => table.toggleAllRowsExpanded()}
- DUPĂ: onClick={props.onToggleExpandAll}

PĂSTREAZĂ tot restul identic (classes, data-testid, etc).
```

### REQUEST 3.6: Integrează în principal
```
În LunarGridTanStack.tsx:

1. Import: import LunarGridToolbar from "./components/LunarGridToolbar";
2. Găsește div-ul original cu butoanele
3. Înlocuiește CU EXACT:
   ```tsx
   <LunarGridToolbar
     isAllExpanded={table.getIsAllRowsExpanded()}
     onToggleExpandAll={() => {
       const isCurrentlyExpanded = table.getIsAllRowsExpanded();
       const newExpandedState: Record<string, boolean> = {};
       
       if (!isCurrentlyExpanded) {
         table.getRowModel().rows.forEach(row => {
           if (row.getCanExpand()) {
             newExpandedState[row.id] = true;
           }
         });
       }
       
       setExpandedRows(newExpandedState);
       table.toggleAllRowsExpanded(!isCurrentlyExpanded);
     }}
     onResetExpanded={() => {
       setExpandedRows({});
       table.resetExpanded();
     }}
   />
   ```

COPIAZĂ logica EXACT din onClick handlers originale.
```

**✅ Verificare:** Butoanele apar și funcționează identic

---

## 🎯 TASK 4: Helper Pentru Expanded Rows (Foarte Specific)

### REQUEST 4.1: Găsește hook-ul
```
În LunarGridTanStack.tsx, caută:
"usePersistentExpandedRows"

Raportează:
1. La ce linie e definit
2. Câte linii are
3. Ce face (1-2 propoziții)

NU modifica, doar raportează.
```

### REQUEST 4.2: Creează utils file
```
Creează: frontend/src/components/features/LunarGrid/utils/lunarGridHelpers.ts

Cu conținut:
```tsx
import { useState, useCallback } from 'react';

// TODO: hooks aici

export {};
```

DOAR atât.
```

### REQUEST 4.3: Mută DOAR hook-ul
```
1. TAIE (cut) funcția usePersistentExpandedRows din LunarGridTanStack
2. LIPEȘTE în lunarGridHelpers.ts
3. Adaugă "export" în față: export const usePersistentExpandedRows = ...
4. În LunarGridTanStack, adaugă import:
   import { usePersistentExpandedRows } from "./utils/lunarGridHelpers";

NU modifica funcția. DOAR mută și exportă.
```

**✅ Verificare:** Expand/collapse state se salvează în localStorage

---

## 🎯 TASK 5: Extrage Popover Style (Mini Task)

### REQUEST 5.1: Găsește calculul
```
În LunarGridTanStack.tsx, caută:
"popoverStyle"

Ar trebui să găsești un useMemo care calculează style pentru popover.
Raportează câte linii are.
```

### REQUEST 5.2: Mută în helpers
```
În lunarGridHelpers.ts:

1. Adaugă funcția:
   ```tsx
   export const calculatePopoverStyle = (
     popover: { anchorEl?: HTMLElement } | null
   ): CSSProperties => {
     if (!popover || !popover.anchorEl) return {};
     
     // COPIAZĂ logica din useMemo
   };
   ```

2. În LunarGridTanStack:
   - Înlocuiește useMemo cu: 
     const popoverStyle = calculatePopoverStyle(popover);
   - Import funcția
```

---

## 🎯 TASK 6: Cell Component (Foarte Granular)

### REQUEST 6.1: Creează wrapper component
```
Creează: components/LunarGridCell.tsx

```tsx
import React from 'react';
import { EditableCell } from "../inline-editing/EditableCell";

interface LunarGridCellProps {
  cellId: string;
  value: string;
  onSave: (value: string | number) => Promise<void>;
  onSingleClick: (e: React.MouseEvent) => void;
  className?: string;
  placeholder?: string;
}

const LunarGridCell: React.FC<LunarGridCellProps> = (props) => {
  return (
    <EditableCell
      cellId={props.cellId}
      value={props.value}
      onSave={props.onSave}
      onSingleClick={props.onSingleClick}
      validationType="amount"
      className={props.className}
      placeholder={props.placeholder}
    />
  );
};

export default LunarGridCell;
```

EXACT așa. NU adăuga logică.
```

### REQUEST 6.2: Găsește renderEditableCell
```
În LunarGridTanStack.tsx, caută "renderEditableCell".

Raportează:
1. E o funcție sau o variabilă?
2. Ce returnează?
3. Unde e folosită?
```

### REQUEST 6.3: Înlocuiește treptat
```
ÎN LOC să muți toată funcția renderEditableCell:

1. Găsește UNDE e folosită (în renderRow probabil)
2. Înlocuiește DOAR apelul:
   
   ÎNAINTE:
   {renderEditableCell(category, subcategory, day, value)}
   
   DUPĂ:
   <LunarGridCell
     cellId={`${category}-${subcategory || "null"}-${day}`}
     value={displayValue}
     onSave={async (value) => {
       await handleEditableCellSave(category, subcategory, day, value, transactionId);
     }}
     onSingleClick={(e) => {
       // COPIAZĂ EXACT ce era în onSingleClick
     }}
     className={...} // COPIAZĂ exact className-urile
     placeholder={...}
   />

3. Import component: import LunarGridCell from "./components/LunarGridCell";
```

**✅ Verificare:** Celulele încă se editează corect

---

## 🎯 TASK 7: State Consolidation (Baby Steps)

### REQUEST 7.1: Numără state-urile
```
În LunarGridTanStack.tsx, numără TOATE useState-urile.

Listează-le:
1. [popover, setPopover]
2. [modalState, setModalState]
... etc

Câte sunt în total?
```

### REQUEST 7.2: Grupează doar editing states
```
Creează: hooks/useLunarGridState.ts

ÎNCEPE DOAR cu editing states:

```tsx
import { useState } from 'react';

export const useLunarGridEditingState = () => {
  const [popover, setPopover] = useState(null);
  const [modalState, setModalState] = useState(null);
  const [highlightedCell, setHighlightedCell] = useState(null);

  return {
    popover,
    setPopover,
    modalState, 
    setModalState,
    highlightedCell,
    setHighlightedCell,
    
    // Helper pentru clear all
    clearAllEditing: () => {
      setPopover(null);
      setModalState(null);
      setHighlightedCell(null);
    }
  };
};
```

NU adăuga alte state-uri încă.
```

### REQUEST 7.3: Înlocuiește în principal
```
În LunarGridTanStack.tsx:

1. Comentează (nu șterge) cele 3 useState-uri pentru popover, modalState, highlightedCell
2. Adaugă: 
   ```tsx
   const {
     popover,
     setPopover,
     modalState,
     setModalState,
     highlightedCell,
     setHighlightedCell
   } = useLunarGridEditingState();
   ```
3. Verifică că totul funcționează

DOAR aceste 3 state-uri. NU face altele.
```

---

## ⏰ TIMP ESTIMAT CU ACEASTĂ ABORDARE

- Task 1-2: 30 min (super simple)
- Task 3-4: 45 min (toolbar + helper)
- Task 5-6: 1 oră (cell component)
- Task 7: 30 min per grup de state

**Total: 4-5 ore** dar FĂRĂ surprize

---

## 🚨 CÂND AI ȘTII CĂ SONNET SE ÎNCURCĂ

1. **Creează hooks de 400 linii** - STOP, cere să facă mai puțin
2. **"Optimizează" cod** - STOP, zi să lase cum era
3. **Mută mai mult decât ai cerut** - STOP, revert și fă mai specific
4. **Adaugă funcționalități noi** - STOP, doar mută cod existent

---

## 💡 TEMPLATE PENTRU REQUESTS PERFECTE

```
TASK: [ce vrei să facă]

LOCAȚIE: [unde exact să caute]
- Fișier: [nume]
- Linie: [aproximativ]
- Identificator: [text unic de căutat]

CE SĂ FACĂ:
1. [pas 1 super specific]
2. [pas 2 super specific]

CE SĂ NU FACĂ:
- NU [antipattern 1]
- NU [antipattern 2]

VERIFICARE:
- [cum știi că a mers]
```