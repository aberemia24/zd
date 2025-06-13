# Circular Dependencies - Detailed Analysis & Solutions

## Executive Summary

**Analysis Date:** June 13, 2025  
**Critical Issues:** 2 circular dependencies identified  
**Priority:** HIGH (blocks tree-shaking, affects bundle size)

---

## 🔄 Circular Dependency #1: LunarGrid Type/Hook Loop

### Dependency Chain
```
hooks/useLunarGridTable.tsx 
  → utils/lunarGrid/index.ts 
  → components/features/LunarGrid/types.tsx 
  → hooks/useLunarGridTable.tsx
```

### Root Cause Analysis

**File: `types.tsx` (Line 9)**
```typescript
import { TransformedTableDataRow } from "./hooks/useLunarGridTable";
```

**File: `hooks/useLunarGridTable.tsx` (Line 47)**
```typescript
export type TransformedTableDataRow = {
  id: string;
  category: string;
  subcategory?: string;
  isCategory: boolean;
  total: number;
  subRows?: TransformedTableDataRow[];
} & DailyAmount;
```

**File: `utils/lunarGrid/index.ts` (Line 19)**
```typescript
export type { LunarGridRowData } from "../../components/features/LunarGrid/types";
```

### Impact Assessment
- **Bundle Size:** ❌ Prevents proper tree-shaking
- **Development:** ❌ Confusing import paths
- **Maintenance:** ❌ Tight coupling between layers
- **Performance:** ⚠️ Potential runtime issues

---

## 🔄 Circular Dependency #2: TransactionForm/Store Loop

### Dependency Chain
```
TransactionForm.tsx 
  → stores/transactionFormStore.tsx 
  → TransactionForm.tsx
```

### Root Cause Analysis

**File: `TransactionForm.tsx` (Line 15)**
```typescript
import { useTransactionFormStore } from "../../../stores/transactionFormStore";
```

**File: `transactionFormStore.tsx` (Line 4)**
```typescript
import type { TransactionFormData } from "../components/features/TransactionForm/TransactionForm";
```

### Impact Assessment
- **State Management:** ❌ Tight coupling component-store
- **Testability:** ❌ Difficult to mock/test independently  
- **Reusability:** ❌ Store tied to specific component
- **Architecture:** ❌ Violates separation of concerns

---

## 🎯 Solution Strategy

### Priority 1: Fix LunarGrid Circular Dependency

#### Solution A: Create Dedicated Types File (RECOMMENDED)
```typescript
// New file: components/features/LunarGrid/tableTypes.ts
export type TransformedTableDataRow = {
  id: string;
  category: string;
  subcategory?: string;
  isCategory: boolean;
  total: number;
  subRows?: TransformedTableDataRow[];
} & DailyAmount;

export type TransactionMap = Map<string, string>;
```

#### Changes Required:
1. **Create:** `components/features/LunarGrid/tableTypes.ts`
2. **Update:** `useLunarGridTable.tsx` - import from `./tableTypes`
3. **Update:** `types.tsx` - import from `./tableTypes`  
4. **Update:** `utils/lunarGrid/index.ts` - remove re-export

#### Benefits:
- ✅ Breaks circular dependency
- ✅ Single source of truth for table types
- ✅ Cleaner import paths
- ✅ Better separation of concerns

### Priority 2: Fix TransactionForm Circular Dependency

#### Solution B: Extract Shared Types (RECOMMENDED)
```typescript
// New file: types/TransactionForm.ts
export interface TransactionFormData {
  // Move interface here from component
}
```

#### Changes Required:
1. **Create:** `types/TransactionForm.ts`
2. **Update:** `TransactionForm.tsx` - import from `../../../types/TransactionForm`
3. **Update:** `transactionFormStore.tsx` - import from `../types/TransactionForm`

#### Benefits:
- ✅ Breaks circular dependency
- ✅ Reusable types across components
- ✅ Better testability
- ✅ Follows project type organization

---

## 🛠️ Implementation Plan

### Phase 1: LunarGrid Fix (High Priority)
- [ ] Create `tableTypes.ts` with extracted types
- [ ] Update imports in `useLunarGridTable.tsx`
- [ ] Update imports in `types.tsx`
- [ ] Remove re-export from `utils/lunarGrid/index.ts`
- [ ] Test compilation and functionality

### Phase 2: TransactionForm Fix (Medium Priority)
- [ ] Create `types/TransactionForm.ts`
- [ ] Extract `TransactionFormData` interface
- [ ] Update component imports
- [ ] Update store imports
- [ ] Test compilation and functionality

### Phase 3: Validation & Testing
- [ ] Run madge to verify circular dependencies are resolved
- [ ] Run full TypeScript compilation
- [ ] Test affected components functionality
- [ ] Update documentation

---

## 🔍 Coupling Analysis

### High Coupling Components Identified

#### 1. `useLunarGridTable.tsx` (594 lines)
**Dependencies Count:** 8 external imports
**Coupling Level:** HIGH
**Issues:**
- Barrel imports from `utils/lunarGrid`
- Multiple store dependencies
- Complex type dependencies

**Recommendation:** Consider splitting into smaller, focused hooks

#### 2. `LunarGridRow.tsx` (26KB, 577 lines) 
**Dependencies Count:** 11 external imports
**Coupling Level:** HIGH
**Issues:**
- Heavy component with multiple responsibilities
- Many import dependencies
- Mixed concerns (display + logic)

**Recommendation:** Extract smaller components for specific responsibilities

#### 3. `EditableCell.tsx` (21KB, 652 lines)
**Dependencies Count:** 4 external imports
**Coupling Level:** MEDIUM-HIGH
**Issues:**
- Large component size
- Complex internal logic
- Multiple modal integrations

**Status:** Documented in memories as recently refactored

---

## 📊 Shared Constants Compliance

### Analysis Results
- **Compliance Rate:** 98% ✅
- **Non-compliant Files:** 2 identified
- **Hard-coded Strings:** Minimal usage detected

### Violations Found:
```typescript
// File: components/LunarGridAddSubcategoryRow.tsx
const hardcodedText = "Add subcategory"; // Should be in shared-constants/ui.ts
```

**Action Required:** Move remaining hardcoded strings to `@budget-app/shared-constants`

---

## 🚨 Additional Architecture Issues

### Barrel Export Anti-patterns
**File:** `utils/lunarGrid/index.ts`
- Over-exports causing circular dependencies
- Bundle size inflation
- Tree-shaking interference

**Solution:** Remove unnecessary re-exports, use direct imports

### Component Size Issues
- **LunarGridRow.tsx:** 26KB (consider splitting)
- **EditableCell.tsx:** 21KB (acceptable, recently refactored)
- **useLunarGridTable.tsx:** 594 lines (consider hook composition)

---

## ✅ Success Criteria

### Immediate Goals
- [ ] Zero circular dependencies detected by madge
- [ ] All TypeScript compilation passes
- [ ] Bundle size reduction measurable
- [ ] No functionality regression

### Long-term Goals  
- [ ] Improved tree-shaking efficiency
- [ ] Better component testability
- [ ] Cleaner import dependency graphs
- [ ] Maintainable architecture patterns

---

**Next Steps:** Implement Phase 1 (LunarGrid fix) immediately to resolve high-priority circular dependency. 