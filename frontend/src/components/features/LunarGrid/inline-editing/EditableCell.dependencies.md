# EditableCell.tsx - Critical Dependencies Documentation

**Data backup:** 7 Iunie 2025
**Original fișier:** EditableCell.tsx (957 linii)
**Backup fișier:** EditableCell.backup.tsx

## Critical Imports (PRESERVE ALL)

### 1. React Core Dependencies
```typescript
import React, { useMemo, useCallback, useRef, useEffect, useState } from "react";
```
- **Critice pentru:** Hooks, component lifecycle, memoization, ref management
- **Observație:** Componenta folosește intens useMemo pentru optimizare

### 2. Styling System (CVA-v2)
```typescript
import { cn } from "../../../../styles/cva-v2";
import { cva } from "class-variance-authority";
```
- **Critice pentru:** Component variants, conditional classes, styling system
- **Observație:** Folosește CVA-v2 pattern cu cellVariants și inputVariants

### 3. Internal Hooks
```typescript
import { useInlineCellEdit } from "./useInlineCellEdit";
```
- **Critice pentru:** Editing logic, state management, validation, keyboard handling
- **Observație:** Hook-ul principal pentru toată logica de inline editing

### 4. Shared Constants
```typescript
import { EXCEL_GRID } from "@budget-app/shared-constants";
```
- **Critice pentru:** Text constants, validation messages, UI strings
- **Observație:** Single source of truth pentru constante

### 5. Icons (NOT CURRENTLY IMPORTED)
**NOTĂ:** MoreHorizontal nu este importat în versiunea curentă
- **Pentru Hybrid Pattern:** Va fi necesar pentru hover actions [⋯] button
- **Import viitor:** `import { MoreHorizontal } from "lucide-react"`

### 6. Validation System (NOT CURRENTLY IMPORTED)
**NOTĂ:** useValidation nu este importat în versiunea curentă
- **Pentru Hybrid Pattern:** Ar putea fi necesar pentru validation centralizată
- **Observație:** Validation pare să fie gestionată în useInlineCellEdit

## File Structure Dependencies

### Related Files (să nu fie afectate)
- `useInlineCellEdit.tsx` - Hook-ul principal pentru editing logic
- `EditableCell.test.tsx` - 390 linii de teste
- `useInlineCellEdit.test.tsx` - 332 linii de teste pentru hook
- `LunarGridInlineIntegration.tsx` - Integration layer

### Parent Components (să nu fie întrerupte)
- `LunarGridCell.tsx` - Parent direct
- `LunarGridRow.tsx` - Row management  
- `LunarGridTanStack.tsx` - Grid orchestrator

## Critical Features Dependencies

### 1. Click Detection (TASK 11)
- **State:** `clickTimer` pentru single vs double click detection
- **Logic:** Timer-based approach pentru diferențierea clickurilor

### 2. Controlled vs Uncontrolled Mode
- **Pattern:** Suportă både controlled props și internal state
- **Dependency:** `isControlled` flag pentru mode detection

### 3. Optimizations (QuickAddModal Pattern)
- **useMemo:** Pentru `cellState`, `displayValue`, `cellClasses`
- **Performance:** 60% reducere re-renders conform documentației

### 4. Development Validation
- **NODE_ENV checks:** Pentru prop validation în development
- **Console warnings:** Pentru incorrect usage

## Import Safety Rules

1. **NU modifica:** Importurile React core
2. **NU modifica:** CVA styling imports 
3. **NU modifica:** useInlineCellEdit import
4. **VERIFICĂ:** EXCEL_GRID availability după modificări
5. **ADAUGĂ doar:** MoreHorizontal când implementezi hover actions
6. **TESTEAZĂ:** Toate importurile după refactoring

## Backup Recovery

Dacă ceva merge greșit în timpul refactoring-ului:
```bash
cp "frontend/src/components/features/LunarGrid/inline-editing/EditableCell.backup.tsx" "frontend/src/components/features/LunarGrid/inline-editing/EditableCell.tsx"
``` 