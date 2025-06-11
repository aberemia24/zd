# 📦 Import Standards - Budget App

## 🎯 Filosofia: Consistent, Maintainable, Simple

**STANDARDIZED APPROACH:** Folosim barrel imports din `@shared-constants` pentru consistency și maintainability.

---

## ✅ CORRECT Import Patterns

### 1️⃣ **Barrel Import (PREFERRED)**
```tsx
// ✅ DO: Use barrel import pentru majoritatea constantelor
import { 
  TransactionType, 
  MESAJE, 
  BUTTONS, 
  UI, 
  CATEGORIES 
} from "@shared-constants";
```

### 2️⃣ **Mixed Import (ACCEPTABLE)**
```tsx
// ✅ ACCEPTABLE: Când unele constante nu sunt în barrel
import { TransactionType, MESAJE, BUTTONS } from "@shared-constants";
import { EXPORT_UI } from "@shared-constants/ui";
```

---

## ❌ INCORRECT Import Patterns

### 1️⃣ **Relative Imports (DEPRECATED)**
```tsx
// ❌ DON'T: Relative imports sunt deprecated
import { TransactionType } from "../../../shared-constants/enums";
import { CATEGORIES } from '../../../../../shared-constants';
```

### 2️⃣ **Excessive Specific Imports (INCONSISTENT)**
```tsx
// ❌ DON'T: Prea multe specific imports când barrel e disponibil
import { UI } from "@shared-constants/ui";
import { MESAJE } from "@shared-constants/messages";
import { TransactionType } from "@shared-constants/enums";
import { CATEGORIES } from "@shared-constants/categories";

// ✅ DO: Consolidate în barrel import
import { UI, MESAJE, TransactionType, CATEGORIES } from "@shared-constants";
```

---

## 📋 Available Exports în Barrel

### **@shared-constants** (Main Barrel)
```typescript
// Enums
TransactionType, CategoryType, FrequencyType, AccountType, BalanceImpactType

// Messages
MESAJE, LUNAR_GRID_MESSAGES, EXPORT_MESSAGES, URL_PERSISTENCE

// UI Constants
LABELS, TITLES, PLACEHOLDERS, BUTTONS, TABLE, LOADER, EXCEL_GRID, 
OPTIONS, UI, FLAGS, INFO, LUNAR_GRID, TEST_CONSTANTS,
ACCOUNT_MANAGEMENT, BALANCE_DISPLAY, BALANCE_MODALS, BALANCE_LABELS,
LOADING_MESSAGES, EMPTY_STATE_MESSAGES, DESIGN_TOKENS, LUNAR_GRID_ACTIONS

// Schemas & Types
TransactionValidated, CreateTransaction, UpdateTransaction

// Categories & Mappings
CATEGORIES, getCategoriesForTransactionType

// Validation
VALIDATION, VALIDATION_MESSAGES, VALIDATION_HELPERS

// API & Defaults
API, PAGINATION, DEFAULTS
```

### **Specific Imports (When Not in Barrel)**
```typescript
// Pentru constante care nu sunt în barrel
import { EXPORT_UI } from "@shared-constants/ui";
import { SPECIFIC_CONSTANT } from "@shared-constants/specific-file";
```

---

## 🔧 Migration Guide

### **Step 1: Identify Current Pattern**
```bash
# Caută relative imports
grep -r "from ['\"]\.\..*shared-constants" src/

# Caută specific imports
grep -r "from ['\"]@shared-constants/" src/
```

### **Step 2: Consolidate Imports**
```tsx
// BEFORE (Multiple specific imports)
import { UI } from "@shared-constants/ui";
import { MESAJE } from "@shared-constants/messages";
import { TransactionType } from "@shared-constants/enums";

// AFTER (Consolidated barrel import)
import { UI, MESAJE, TransactionType } from "@shared-constants";
```

### **Step 3: Handle Exceptions**
```tsx
// Pentru constante care nu sunt în barrel
import { BUTTONS, MESAJE } from "@shared-constants";
import { EXPORT_UI } from "@shared-constants/ui"; // Not in barrel
```

---

## 🚦 Special Cases

### **E2E Tests**
```tsx
// E2E tests pot folosi relative imports temporar
// până când path mapping e configurat pentru Playwright
import { CATEGORIES } from '../../../../../shared-constants';
```

### **Backend Re-exports**
```tsx
// Backend poate re-exporta pentru consistency
// backend/src/constants/enums.ts
export { TransactionType, FrequencyType } from '@shared-constants';
```

---

## 🎯 Best Practices

### ✅ DO
- **Use barrel imports** pentru majoritatea constantelor
- **Group related imports** în aceeași declarație
- **Alphabetize imports** în grupuri pentru readability
- **Use specific imports** doar când constanta nu e în barrel

### ❌ DON'T
- **Nu folosi relative imports** în production code
- **Nu duplica imports** din același modul
- **Nu mixa patterns** fără motiv valid
- **Nu ignora TypeScript errors** pentru imports

---

## 🔧 Implementation Status

- ✅ **TransactionTable.tsx** - Fixed relative imports
- ✅ **OptionsPage.tsx** - Already using barrel imports
- ✅ **LunarGridPage.tsx** - Consolidated imports
- ✅ **CategoryEditor.tsx** - Consolidated imports
- ✅ **TransactionFilters.tsx** - Consolidated imports
- 🔄 **E2E Tests** - Pending path mapping configuration
- 🔄 **Complex components** - Pending careful refactoring

---

## 🎨 Carbon Copper Context

**Import Consistency în Brand Context:**
- **Maintainable codebase** - easier onboarding pentru developers
- **Consistent patterns** - reduces cognitive load
- **Professional standards** - reflects quality of fintech application
- **Scalable architecture** - supports future growth

**Developer Experience:**
```tsx
// Professional import pattern pentru fintech app
import { 
  TransactionType, 
  MESAJE, 
  BUTTONS, 
  CATEGORIES,
  VALIDATION 
} from "@shared-constants";

// Clean, readable, maintainable
``` 