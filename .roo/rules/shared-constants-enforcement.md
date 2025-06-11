---
description: Shared constants mandatory usage - single source of truth for all text, messages, routes, and configuration
globs: src/**/*.tsx, src/**/*.ts, backend/**/*.ts, shared-constants/**/*.ts
alwaysApply: true
---

# 📝 Shared Constants Enforcement - ZERO HARDCODED STRINGS

## 🚨 **@budget-app/shared-constants E SURSA UNICĂ DE ADEVĂR**

**INTERZIS** hardcoded strings, routes, messages în cod. Totul prin `@budget-app/shared-constants`.

### **📋 SHARED CONSTANTS OBLIGATORIU**

#### **1. EXISTING CONSTANTS VERIFICATION**
```bash
# OBLIGATORIU - verifică ce constants există
grep_search("export.*const\|export.*enum" "shared-constants/**/*.ts")
list_dir("shared-constants")
```

#### **2. SHARED CONSTANTS STRUCTURE**
```typescript
// 📁 shared-constants/
// ├── ui.ts           - UI text & labels  
// ├── messages.ts     - System messages & errors
// ├── api.ts          - API routes & endpoints
// ├── defaults.ts     - Default values & config
// └── enums.ts        - Enums & types
```

#### **3. MANDATORY IMPORT PATTERN**
```typescript
// ✅ CORRECT IMPORTS
import { UI } from '@budget-app/shared-constants';
import { MESSAGES } from '@budget-app/shared-constants';
import { API } from '@budget-app/shared-constants';
import { DEFAULTS } from '@budget-app/shared-constants';
import { TransactionType } from '@budget-app/shared-constants';
```

### **🔧 SHARED CONSTANTS RULES**

#### **RULE 1: UI TEXT → shared-constants/ui.ts**
```typescript
// ❌ ANTI-PATTERN: Hardcoded UI text
const button = <Button>Save Transaction</Button>;
const label = <Label>Amount (RON)</Label>;
const placeholder = "Enter description...";

// ✅ PATTERN: Use UI constants
import { UI } from '@budget-app/shared-constants';

const button = <Button>{UI.BUTTONS.SAVE_TRANSACTION}</Button>;
const label = <Label>{UI.FORMS.AMOUNT_LABEL}</Label>;
const placeholder = UI.PLACEHOLDERS.TRANSACTION_DESCRIPTION;
```

#### **RULE 2: SYSTEM MESSAGES → shared-constants/messages.ts**
```typescript
// ❌ ANTI-PATTERN: Hardcoded messages
const error = "Failed to save transaction";
const success = "Transaction saved successfully";
const validation = "Amount must be greater than 0";

// ✅ PATTERN: Use MESSAGES constants  
import { MESSAGES } from '@budget-app/shared-constants';

const error = MESSAGES.ERRORS.TRANSACTION_SAVE_FAILED;
const success = MESSAGES.SUCCESS.TRANSACTION_SAVED;
const validation = MESSAGES.VALIDATION.AMOUNT_POSITIVE;
```

#### **RULE 3: API ROUTES → shared-constants/api.ts**
```typescript
// ❌ ANTI-PATTERN: Hardcoded routes
const endpoint = "/api/transactions";
const userEndpoint = "/api/users/profile";

// ✅ PATTERN: Use API constants
import { API } from '@budget-app/shared-constants';

const endpoint = API.ROUTES.TRANSACTIONS;
const userEndpoint = API.ROUTES.USER_PROFILE;
```

#### **RULE 4: DEFAULT VALUES → shared-constants/defaults.ts**
```typescript
// ❌ ANTI-PATTERN: Hardcoded defaults
const pageSize = 20;
const currency = "RON";
const dateFormat = "dd/MM/yyyy";

// ✅ PATTERN: Use DEFAULTS constants
import { DEFAULTS } from '@budget-app/shared-constants';

const pageSize = DEFAULTS.PAGINATION.PAGE_SIZE;
const currency = DEFAULTS.CURRENCY.DEFAULT;
const dateFormat = DEFAULTS.DATE.FORMAT;
```

### **📊 SHARED CONSTANTS CATEGORIES**

#### **UI.ts STRUCTURE:**
```typescript
export const UI = {
  BUTTONS: {
    SAVE: "Salvează",
    CANCEL: "Anulează", 
    DELETE: "Șterge",
    EDIT: "Editează",
    SAVE_TRANSACTION: "Salvează Tranzacție",
  },
  FORMS: {
    AMOUNT_LABEL: "Sumă (RON)",
    DESCRIPTION_LABEL: "Descriere",
    CATEGORY_LABEL: "Categorie",
  },
  PLACEHOLDERS: {
    TRANSACTION_DESCRIPTION: "Introdu descrierea...",
    SEARCH_TRANSACTIONS: "Caută tranzacții...",
  },
  NAVIGATION: {
    DASHBOARD: "Dashboard",
    TRANSACTIONS: "Tranzacții", 
    BUDGET: "Buget",
  }
};
```

#### **MESSAGES.ts STRUCTURE:**
```typescript
export const MESSAGES = {
  SUCCESS: {
    TRANSACTION_SAVED: "Tranzacția a fost salvată cu succes",
    USER_UPDATED: "Profilul a fost actualizat",
  },
  ERRORS: {
    TRANSACTION_SAVE_FAILED: "Eroare la salvarea tranzacției",
    NETWORK_ERROR: "Eroare de rețea. Încearcă din nou.",
    VALIDATION_FAILED: "Validarea a eșuat",
  },
  VALIDATION: {
    AMOUNT_REQUIRED: "Suma este obligatorie",
    AMOUNT_POSITIVE: "Suma trebuie să fie pozitivă",
    DESCRIPTION_REQUIRED: "Descrierea este obligatorie",
  }
};
```

#### **API.ts STRUCTURE:**
```typescript
export const API = {
  ROUTES: {
    TRANSACTIONS: "/api/transactions",
    CATEGORIES: "/api/categories", 
    USERS: "/api/users",
    USER_PROFILE: "/api/users/profile",
  },
  ENDPOINTS: {
    TRANSACTION_BY_ID: (id: string) => `/api/transactions/${id}`,
    USER_TRANSACTIONS: (userId: string) => `/api/users/${userId}/transactions`,
  }
};
```

### **🔍 SHARED CONSTANTS WORKFLOW**

#### **STEP 1: CHECK EXISTING CONSTANTS**
```bash
# Before adding new text, check what exists
grep_search("SAVE\|CANCEL\|DELETE" "shared-constants/ui.ts")
grep_search("SUCCESS\|ERROR\|VALIDATION" "shared-constants/messages.ts")
grep_search("ROUTES\|ENDPOINTS" "shared-constants/api.ts")
```

#### **STEP 2: ADD IF NOT EXISTS**
```typescript
// Found existing? Use it!
import { UI } from '@budget-app/shared-constants';
const text = UI.BUTTONS.SAVE;

// Not found? Add to shared-constants first!
// In shared-constants/ui.ts
export const UI = {
  BUTTONS: {
    // ... existing
    NEW_BUTTON: "New Text", // ADD HERE FIRST
  }
};

// Then use it
import { UI } from '@budget-app/shared-constants';
const text = UI.BUTTONS.NEW_BUTTON;
```

#### **STEP 3: BUILD & SYNC**
```bash
# After adding to shared-constants
pnpm run build  # Triggers sync to frontend/backend
```

### **❌ SHARED CONSTANTS ANTI-PATTERNS**

#### **ANTI-PATTERN 1: Hardcoded Strings**
```typescript
// ❌ DON'T: Any hardcoded text
const title = "Transaction Dashboard";
const error = "Something went wrong";
const route = "/api/transactions"; 

// ✅ DO: Always use constants
import { UI, MESSAGES, API } from '@budget-app/shared-constants';
const title = UI.NAVIGATION.DASHBOARD;
const error = MESSAGES.ERRORS.GENERIC_ERROR;
const route = API.ROUTES.TRANSACTIONS;
```

#### **ANTI-PATTERN 2: Duplicate Constants**
```typescript
// ❌ DON'T: Define same text in multiple places
// In ComponentA.tsx
const SAVE_TEXT = "Salvează";
// In ComponentB.tsx  
const SAVE_BUTTON = "Salvează";

// ✅ DO: Single source in shared-constants
import { UI } from '@budget-app/shared-constants';
// Both use: UI.BUTTONS.SAVE
```

#### **ANTI-PATTERN 3: Component-Specific Constants**
```typescript
// ❌ DON'T: Component-level constants for reusable text
const TRANSACTION_FORM_CONSTANTS = {
  SAVE: "Salvează",
  CANCEL: "Anulează" 
};

// ✅ DO: Use shared constants
import { UI } from '@budget-app/shared-constants';
// UI.BUTTONS.SAVE, UI.BUTTONS.CANCEL
```

### **🎯 SHARED CONSTANTS QUALITY CHECKLIST**

#### **BEFORE ADDING TEXT:**
- [ ] Am verificat UI constants pentru text similar?
- [ ] Am verificat MESSAGES pentru mesaje similare?
- [ ] Am verificat API pentru rute similare?
- [ ] E textul reutilizabil (folosit în 2+ locuri)?
- [ ] Am categorisit corect (UI/MESSAGES/API/DEFAULTS)?

#### **WHEN ADDING NEW CONSTANTS:**
- [ ] Nume descriptive și consistente?
- [ ] Categoria corectă (BUTTONS/FORMS/NAVIGATION etc)?
- [ ] Traducerea corectă în română?
- [ ] Nu dublează constants existente?
- [ ] Urmează naming convention (SCREAMING_SNAKE_CASE)?

### **📈 SHARED CONSTANTS BENEFITS**

#### **CONSISTENCY:**
- Toate textele urmează același standard
- Traduceri centralizate
- Brand voice consistent

#### **MAINTAINABILITY:**
- Single source of truth pentru text changes
- Update o constantă → update whole app
- Easy localization în viitor

#### **QUALITY:**
- No typos în UI text
- Consistent messaging
- Better code review

### **🛠️ SHARED CONSTANTS DEBUGGING**

#### **COMMON ISSUES:**
```typescript
// Issue: Constants not found
// Check: Build after adding new constants?
pnpm run build // ✅

// Issue: Import error
// Check: Correct import path?
import { UI } from '@budget-app/shared-constants'; // ✅
import { UI } from '../constants/ui'; // ❌

// Issue: Constant undefined
// Check: Export in shared-constants?
export const UI = { BUTTONS: { SAVE: "..." } }; // ✅

// Issue: Old cached values
// Check: Restart dev server after build?
```

### **🔄 SHARED CONSTANTS SYNC PROCESS**

#### **AUTOMATIC SYNC:**
```bash
# pnpm workspaces handle automatic linking
pnpm install  # Creates symlinks

# Build compiles shared-constants  
pnpm run build  # Generates .d.ts files
```

#### **MANUAL VERIFICATION:**
```bash
# Check if constants are available
grep_search("export.*UI\|export.*MESSAGES" "node_modules/@budget-app/shared-constants")
```

### **💡 SHARED CONSTANTS SUMMARY**

1. **NEVER** use hardcoded strings, messages, routes
2. **ALWAYS** check existing constants first  
3. **ADD** to shared-constants when missing
4. **BUILD** after adding new constants
5. **IMPORT** from `@budget-app/shared-constants` package

**MOTTO**: "Single source of truth, zero hardcoded strings"

---

**⚠️ ENFORCEMENT**: Any hardcoded string that should be a constant will be refactored. Shared constants compliance is mandatory for maintainability and consistency. 