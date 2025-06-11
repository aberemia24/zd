---
description: Mandatory research process before any implementation to prevent duplicates and ensure codebase integration
globs: src/**/*.tsx, src/**/*.ts, components/**/*.tsx, hooks/**/*.ts, stores/**/*.ts
alwaysApply: true
---

# 🔍 Research Thoroughness - REGULA OBLIGATORIE

## 🚨 **BEFORE ANY IMPLEMENTATION - MANDATORY RESEARCH**

**INTERZIS** să implementezi orice fără research aprofundat. Aceasta e regula #1.

### **📋 PROCESUL OBLIGATORIU DE RESEARCH**

#### **1. EXISTING FUNCTIONALITY SEARCH**
```bash
# OBLIGATORIU - căutați funcționalitate similară
codebase_search("functionality I want to implement")
grep_search("similar patterns or keywords")
file_search("component names or hook names")
```

#### **2. PATTERN VERIFICATION CHECKLIST**
- [ ] **Components**: Există în `components/features` sau `components/primitives`?
- [ ] **Hooks**: Există în `hooks/` care fac ceva similar?
- [ ] **Stores**: Există state management pentru acest domeniu?
- [ ] **Utils**: Există utilitare care implementează logica necesară?
- [ ] **Constants**: Există în `@budget-app/shared-constants`?
- [ ] **Types**: Există tipuri definite pentru acest domeniu?

#### **3. INTEGRATION ANALYSIS**
```typescript
// ✅ ÎNTREBĂRI OBLIGATORII:
// 1. Poate fi reutilizată funcționalitatea existentă DIRECT?
// 2. Poate fi EXTINSĂ funcționalitatea existentă pentru noul use case?
// 3. Poate fi GENERALIZATĂ funcționalitatea existentă?
// 4. Poate fi MIGRATĂ către un pattern mai reusable?
```

### **🎯 ACTIONS BASED ON RESEARCH**

#### **SCENARIO A: FUNCTIONALITY EXISTS**
```typescript
// ✅ DO: Reuse, extend, or migrate
import { existingHook } from "./existing/path";
import { ExistingComponent } from "../../existing";

// Extend existing hook
const useEnhancedExisting = (additionalOptions) => {
  const existing = existingHook();
  // Add new functionality on top
  return { ...existing, newFeature };
};
```

#### **SCENARIO B: SIMILAR PATTERNS EXIST**
```typescript
// ✅ DO: Follow established patterns
// Găsit pattern în LunarGrid pentru celule editabile
// Urmez același pattern pentru noua funcționalitate
```

#### **SCENARIO C: NOTHING EXISTS**
```typescript
// ✅ DO: Implement NEW but check for consistency
// Verify CVA system usage
// Verify shared constants usage  
// Verify store patterns
// Verify hook patterns
```

### **❌ ANTI-PATTERNS DETECTED BY RESEARCH**

#### **RED FLAGS:**
- [ ] "Am implementat rapid fără să verific ce există"
- [ ] "Am făcut o copie și am modificat puțin"
- [ ] "Am refăcut ceva care deja funcționează"
- [ ] "Nu știu ce hookuri/componente sunt disponibile"
- [ ] "Nu am verificat shared-constants"

#### **DUPLICATE DETECTION:**
```typescript
// ❌ ANTI-PATTERN: Duplicate implementations
const MyCustomModal = () => { /* reimplementation */ };
const MyCustomButton = () => { /* variant exists in CVA */ };
const MyCustomValidation = () => { /* useValidation exists */ };

// ✅ PATTERN: Research-based reuse
import { Modal } from "../primitives/Modal";
import { Button } from "../primitives/Button"; 
import { useValidation } from "../hooks/useValidation";
```

### **🔧 RESEARCH TOOLS TO USE**

#### **MANDATORY TOOLS:**
```bash
# 1. Semantic search for functionality
codebase_search("user authentication")
codebase_search("form validation") 
codebase_search("data fetching")

# 2. Exact search for patterns
grep_search("useAuth|useValidation|useFetch")
grep_search("Modal|Button|Input")

# 3. File discovery
file_search("auth") 
file_search("validation")
file_search("modal")

# 4. Directory exploration
list_dir("src/components/primitives")
list_dir("src/hooks")
list_dir("src/stores")
```

#### **DISCOVERY QUESTIONS:**
- Ce componente primitive sunt disponibile?
- Ce hooks de business logic există?
- Ce store-uri gestionează state-ul relevant?
- Ce constante sunt în shared-constants pentru acest domeniu?
- Ce pattern-uri de styling sunt în CVA?

### **📊 RESEARCH SUCCESS METRICS**

#### **✅ GOOD RESEARCH INDICATORS:**
- Am găsit 3+ componente/hooks relevante
- Am identificat pattern-uri existente de urmat
- Am găsit constante relevante în shared-constants
- Am înțeles arhitectura existentă
- Am un plan clar: reuse/extend/implement

#### **❌ INSUFFICIENT RESEARCH:**
- "Nu am găsit nimic relevant" (nu ai căutat destul)
- "Am implementat rapid" (fără research)
- "Nu știu ce patterns există" (research incomplet)

### **🎯 EXAMPLE: GOOD RESEARCH PROCESS**

```typescript
// TASK: Implement user profile editing

// 1. RESEARCH PHASE
// codebase_search("user profile")
// grep_search("profile|user.*edit") 
// Found: UserProfileForm.tsx, useUserProfile.ts, USER_PROFILE constants

// 2. ANALYSIS PHASE  
// UserProfileForm exists but no editing capability
// useUserProfile has get operations but no update
// USER_PROFILE has display constants but no edit messages

// 3. INTEGRATION DECISION
// EXTEND UserProfileForm with edit mode
// ENHANCE useUserProfile with update operations  
// ADD edit messages to shared-constants

// 4. IMPLEMENTATION
const EnhancedUserProfile = () => {
  const { profile, updateProfile } = useUserProfile(); // EXTENDED
  const { UI } = USER_PROFILE; // REUSED CONSTANTS
  // Implementation follows existing patterns
};
```

### **💡 RESEARCH RULES SUMMARY**

1. **ALWAYS** research before implementing
2. **NEVER** assume functionality doesn't exist
3. **PREFER** extending existing over reimplementing
4. **FOLLOW** established patterns and architectures
5. **DOCUMENT** what you found and why you chose the approach

**MOTTO**: "Research first, implement smart, maintain consistency"

---

**⚠️ ENFORCEMENT**: Any PR with duplicate functionality that could have been discovered through proper research will be rejected. Research is not optional. 