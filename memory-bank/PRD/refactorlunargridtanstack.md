# Ghid Complet Refactorizare LunarGrid - Plan + Requests + Reguli

## 📋 Overview & Obiective
**Componentă curentă:** `LunarGridTanStack.tsx` - 1716 linii  
**Obiectiv:** Spargere în 8-10 componente mai mici, fiecare cu o responsabilitate clară  
**Abordare:** Baby steps - fiecare pas funcționează independent și nu rupe nimic
**Tool:** Claude Sonnet 4.0 cu thinking mode

---

## ⚠️ REGULI DE BAZĂ - CITEȘTE ÎNAINTE DE ORICE!

### 🔴 Red Flags să eviți:
1. **NU muta business logic și UI împreună** - întâi extrage UI, apoi logica
2. **NU crea dependențe circulare** - props flow doar în jos
3. **NU muta prea mult dintr-o dată** - baby steps
4. **NU uita de TypeScript** - definește interfețe clare pentru fiecare componentă
5. **NU șterge console.log-urile** - le vei avea nevoie pentru debugging

### ✅ Best Practices:
1. **Un singur request per chat** cu AI
2. **Testează după FIECARE pas** - nu merge mai departe până nu funcționează
3. **Commit după fiecare pas reușit** - poți reveni ușor
4. **Fii foarte specific** în requests - copy/paste exact
5. **Verifică imports** - cel mai comun fail

### 🎯 Success Metrics:
- **Componenta principală:** < 400 linii
- **Fiecare componentă child:** < 200 linii  
- **Zero funcționalitate pierdută**
- **Performance identică sau mai bună**

---

## 📁 FAZA 1: Pregătire și Structură (30 min)

### Step 1.1: Structura de foldere țintă
```
components/features/LunarGrid/
├── LunarGridTanStack.tsx (va deveni < 400 linii)
├── components/
│   ├── LunarGridToolbar.tsx
│   ├── LunarGridCell.tsx  
│   ├── LunarGridModals.tsx
│   ├── LunarGridSubcategoryRow.tsx
│   └── DeleteSubcategoryModal.tsx
├── hooks/
│   └── useLunarGridState.ts
└── utils/
    └── lunarGridHelpers.ts
```

### 🤖 REQUEST 1: Creează Structura
```
Creează următoarea structură de foldere în frontend/src/components/features/LunarGrid/:

components/
├── LunarGridToolbar.tsx
├── LunarGridCell.tsx  
├── LunarGridModals.tsx
├── LunarGridSubcategoryRow.tsx
└── DeleteSubcategoryModal.tsx

utils/
└── lunarGridHelpers.ts

Creează fișiere goale cu un export default placeholder pentru fiecare.
```

**✅ Verificare:** Toate fișierele există și proiectul compilează

---

## 🎨 FAZA 2: Toolbar Component (45 min)
**Risc: Zero - componentă complet izolată**

### Ce va conține:
- Butoanele: Expand All, Collapse All, Reset
- Butonul temporar de curățare tranzacții orfane

### 🤖 REQUEST 2: Extrage Toolbar
```
În LunarGridTanStack.tsx, găsește secțiunea cu butoanele (în jurul liniei 1250-1300):
- Caută div-ul care conține Button components cu "toggle-expand-all", "reset-expanded"
- Include și butonul temporar de "clean-orphan-transactions" dacă există

Extrage această secțiune într-o componentă nouă: components/LunarGridToolbar.tsx

Componenta trebuie să:
1. Primească următoarele props:
   - isAllExpanded: boolean
   - onToggleExpandAll: () => void
   - onResetExpanded: () => void  
   - orphanTransactionsCount?: number
   - onCleanOrphans?: () => void

2. Să returneze exact același JSX dar folosind props-urile

3. În LunarGridTanStack, înlocuiește secțiunea cu <LunarGridToolbar {...props} />

NU modifica logica, doar mută JSX-ul.
```

**✅ Verificare:** Butoanele apar și funcționează identic

---

## 🗑️ FAZA 3: Delete Confirmation Modal (30 min)
**Risc: Zero - componentă deja izolată intern**

### 🤖 REQUEST 3: Extrage Delete Modal
```
În LunarGridTanStack.tsx, găsește componenta internă DeleteSubcategoryConfirmation (aproximativ linia 1000).

1. Mută TOATĂ componenta în: components/DeleteSubcategoryModal.tsx
2. Adaugă aceste imports în noul fișier:
   - import { Button } from "../../../primitives/Button/Button"
   - import { modal, modalContent, flex } from "../../../../styles/cva/components/layout"
   - Orice alte imports necesare din shared-constants

3. Exportă ca: export default DeleteSubcategoryModal

4. În LunarGridTanStack:
   - Import: import DeleteSubcategoryModal from "./components/DeleteSubcategoryModal"
   - Înlocuiește <DeleteSubcategoryConfirmation cu <DeleteSubcategoryModal
   - Păstrează exact aceleași props
```

**✅ Verificare:** Modal-ul de delete apare când ștergi o subcategorie

---

## 🛠️ FAZA 4: Helper Functions (30 min)
**Risc: Zero - funcții pure**

### 🤖 REQUEST 4: Extrage Helpers
```
În LunarGridTanStack.tsx, identifică și mută în utils/lunarGridHelpers.ts următoarele:

1. Funcția handleCleanOrphanTransactions (dacă există)
2. Funcția getBalanceStyle (dacă e definită local)
3. Hook-ul usePersistentExpandedRows

Pentru fiecare funcție:
- Export ca named export
- Păstrează EXACT aceeași signature
- În LunarGridTanStack, importează din noul loc

NU modifica logica funcțiilor, doar le mută.
```

**✅ Verificare:** Funcționalitățile merg identic

---

## 📱 FAZA 5: Transaction Modals Container (1 oră)
**Risc: Mediu - atenție la props**

### 🤖 REQUEST 5: Extrage Modals Container
```
În LunarGridTanStack.tsx, în return statement, găsește:
1. Secțiunea cu popover (condiția: popover && ...)
2. Secțiunea cu QuickAddModal (condiția: modalState && ...)

Creează components/LunarGridModals.tsx care:

1. Primește props:
   interface LunarGridModalsProps {
     // Popover
     popover: PopoverState | null;
     popoverStyle: CSSProperties;
     onSavePopover: (data: any) => void;
     onCancelPopover: () => void;
     
     // Modal
     modalState: ModalState | null;
     onSaveModal: (data: any) => void;
     onCancelModal: () => void;
     onDeleteFromModal?: () => void;
     
     // Context
     year: number;
     month: number;
   }

2. Returnează un Fragment cu ambele secțiuni de render

3. În LunarGridTanStack, înlocuiește cu: <LunarGridModals {...modalProps} />

IMPORTANT: NU muta handler functions, doar JSX render.
```

**✅ Verificare:** Modals și popover apar corect la click

---

## 📝 FAZA 6: Subcategory Management (1.5 ore)
**Risc: Mare - multă logică, fă în 2 părți**

### 🤖 REQUEST 6: Subcategory Add UI
```
ATENȚIE: Acest pas e mai complex. Fă-l în 2 părți.

PARTEA 1 - Identifică codul pentru subcategory add:
În LunarGridTanStack.tsx, găsește:
1. State: addingSubcategory și newSubcategoryName
2. Handler: handleAddSubcategory
3. Handler: handleCancelAddSubcategory  
4. În renderRow function, găsește secțiunea unde se randează row pentru add subcategory

PARTEA 2 - Creează un component wrapper:
În components/LunarGridSubcategoryRow.tsx, creează o componentă care:
1. Gestionează DOAR UI pentru add subcategory
2. Primește ca props:
   - isAdding: boolean
   - categoryName: string
   - onAdd: (name: string) => void
   - onCancel: () => void
3. Returnează row-ul pentru add subcategory

NU muta logica de save în store, doar UI.
```

### 🤖 REQUEST 7: Subcategory Edit/Delete UI
```
În renderRow function din LunarGridTanStack.tsx, găsește logica pentru:
1. Render subcategory cu edit mode
2. Butoanele de Edit/Delete pentru subcategorii custom

Extinde LunarGridSubcategoryRow.tsx să gestioneze și edit/delete UI:

1. Adaugă props pentru edit/delete:
   - editingSubcategory?: { category: string; subcategory: string; value: string }
   - onEdit: (category: string, subcategory: string) => void
   - onDelete: (category: string, subcategory: string) => void
   - onSaveEdit: (category: string, oldName: string, newName: string) => void

2. Consolidează toată logica de UI pentru subcategorii

PĂSTREAZĂ handler-ele în componenta principală pentru moment.
```

**✅ Verificare:** Add/Edit/Delete subcategorii funcționează

---

## 📊 FAZA 7: Cell Rendering (2 ore)
**Risc: Foarte Mare - core functionality**

### 🤖 REQUEST 8: Extrage Cell Component
```
În LunarGridTanStack.tsx, găsește funcția renderEditableCell (aproximativ linia 400-500).

1. Creează components/LunarGridCell.tsx
2. Transformă funcția într-o componentă React:
   
   export interface LunarGridCellProps {
     category: string;
     subcategory: string | undefined;
     day: number;
     currentValue: string | number;
     transactionId: string | null;
     isHighlighted?: boolean;
     isFocused?: boolean;
     isSelected?: boolean;
     onSave: (value: string | number) => Promise<void>;
     onSingleClick: (e: React.MouseEvent) => void;
   }

3. În LunarGridTanStack, înlocuiește apelurile la renderEditableCell cu <LunarGridCell />

TESTEAZĂ că editarea încă funcționează!
```

**✅ Verificare:** Click și edit pe celule funcționează perfect

---

## 🎯 FAZA 8: State Consolidation (2 ore)
**Risc: Mare - fă doar după ce totul merge**

### 🤖 REQUEST 9: Consolidează State - Part 1
```
Creează hooks/useLunarGridState.ts care consolidează state-urile pentru editing:

1. Combină aceste state-uri:
   - popover + modalState + highlightedCell → editing state
   - addingSubcategory + newSubcategoryName + subcategoryAction + editingSubcategoryName → subcategory state

2. Creează hook:
   export function useLunarGridState() {
     const [editing, setEditing] = useState<{
       mode: 'popover' | 'modal' | null;
       data?: any;
       highlighted?: CellPosition;
     }>({ mode: null });

     const [subcategory, setSubcategory] = useState<{
       action: 'add' | 'edit' | 'delete' | null;
       target?: string;
       value: string;
     }>({ action: null, value: '' });

     return {
       editing,
       subcategory,
       // helper methods
       startEdit: (mode: 'popover' | 'modal', data: any) => {},
       clearEdit: () => {},
       // etc
     };
   }

3. În LunarGridTanStack, înlocuiește gradually cu noul hook
```

### 🤖 REQUEST 10: Consolidează State - Part 2
```
Continuă consolidarea în useLunarGridState.ts:

1. Adaugă gestionarea pentru expandedRows (folosind usePersistentExpandedRows)
2. Unifica toate setările de state într-un singur loc
3. Expune metode clare pentru fiecare acțiune:
   - startEditingCell(mode, cellData)
   - startAddingSubcategory(category)
   - startEditingSubcategory(category, subcategory)
   - clearAllActions()

4. În LunarGridTanStack, înlocuiește toate useState-urile cu hook-ul consolidat

TESTEAZĂ fiecare funcționalitate după înlocuire!
```

**✅ Verificare:** Toate funcționalitățile merg cu noul state management

---

## 🧹 FAZA 9: Final Cleanup (1 oră)

### 🤖 REQUEST 11: Polish Final
```
În LunarGridTanStack.tsx:

1. Verifică că ai sub 500 de linii
2. Grupează imports-urile logic:
   // React & Libraries
   // Hooks  
   // Components
   // Types
   // Utils
   // Constants

3. Adaugă comentarii pentru secțiunile principale:
   // Data Fetching
   // State Management
   // Event Handlers
   // Render

4. Elimină orice cod mort sau comentat

5. Verifică că totul funcționează:
   - Expand/Collapse
   - Add/Edit/Delete subcategory
   - Edit cells
   - Modals
   - Keyboard navigation
```

---

## 📊 Rezultat Final Așteptat

```typescript
// LunarGridTanStack.tsx - sub 400 linii!
const LunarGridTanStack = ({ year, month }) => {
  // 1. Data fetching (50 linii)
  const { transactions, isLoading } = useMonthlyTransactions(year, month);
  
  // 2. State management consolidat (20 linii)
  const gridState = useLunarGridState();
  
  // 3. Table setup (30 linii)
  const { table, columns } = useLunarGridTable(...);
  
  // 4. Event handlers (100 linii)
  const handleSave = () => {...}
  // etc
  
  // 5. Render orchestration (150 linii)
  return (
    <>
      <LunarGridToolbar {...toolbarProps} />
      <div className="grid-container">
        {/* Table render simplu */}
      </div>
      <LunarGridModals {...modalProps} />
    </>
  );
};
```

---

## ⏱️ Timeline Estimat
- **Faza 1-4**: 2 ore (setup + componente simple)
- **Faza 5-7**: 4 ore (componente complexe)
- **Faza 8**: 2 ore (state consolidation)
- **Faza 9**: 1 oră (cleanup)

**Total: ~9 ore** dar poți face în 2-3 zile

---

## 🚨 Troubleshooting

### Dacă Sonnet se încurcă:
```
"STOP. Ai modificat prea multe. 
Vreau DOAR ce am cerut în request, nimic extra.
Revert changes și fă doar [specific task]."
```

### Dacă ceva nu merge:
1. Check imports
2. Check props passing
3. Check TypeScript errors
4. Git diff să vezi ce s-a schimbat

### Emergency rollback:
```bash
git stash  # salvează work in progress
git checkout HEAD~1  # back to last commit
```

---

## 🎯 Definition of Done

- [ ] Sub 500 linii în componenta principală
- [ ] Toate funcționalitățile merg
- [ ] No TypeScript errors
- [ ] Performance unchanged sau better
- [ ] Poți găsi și modifica orice feature în < 1 minut