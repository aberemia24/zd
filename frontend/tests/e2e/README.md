# Organizarea Testelor E2E

## 📁 Structura Directoarelor

### `tests/` - Teste Principale
Testele organizate în subdirectoare logice:

#### `tests/features/` - Teste Feature-uri
- **Scope**: Testele pentru feature-uri individuale ale aplicației
- **Exemple**: 
  - `transaction-form.spec.ts` - Testarea formularului de tranzacții cu date dinamice
  - `category-editor.spec.ts` - Testarea editorului de categorii
  - `user-profile.spec.ts` - Testarea profilului utilizatorului

#### `tests/integration/` - Teste de Integrare  
- **Scope**: Testele care validează integrarea între multiple componente
- **Exemple**:
  - `lunargrid-integration.spec.ts` - Workflow complet LunarGrid cu date dinamice
  - `transaction-flow.spec.ts` - Flux complet de la adăugare la vizualizare
  - `auth-transaction-integration.spec.ts` - Integrarea autentificare + tranzacții

#### `tests/validation/` - Teste de Validare
- **Scope**: Testele pentru validarea generatoarelor și utilitarelor de test
- **Exemple**:
  - `data-generator.spec.ts` - Validarea generatorului de date de test
  - `form-generator.spec.ts` - Validarea generatorului pentru TransactionForm
  - `dynamic-variety.spec.ts` - Validarea varietății datelor generate

### `debug/` - Teste Temporare de Debug
- **Scope**: Teste temporare pentru debugging, explorare și investigații
- **Caracteristici**: 
  - Nu fac parte din suite-ul principal de teste
  - Se ștearg după rezolvarea problemelor
  - Folosite pentru explorare și experimentare
- **Exemple actuale**:
  - `explore-app.spec.ts` - Explorarea aplicației pentru debugging
  - `test-simple-generator.spec.ts` - Test simplu pentru debugging generator
  - `test-primary-account.spec.ts` - Debug pentru autentificare

### `config/` - Configurații și Generatoare
- **Scope**: Configurații, generatoare de date și utilitare
- **Fișiere**:
  - `test-data-generator.ts` - Generatorul principal de date dinamice
  - `test-constants.ts` - Constante pentru teste
  - `playwright.config.ts` - Configurația Playwright

### `support/` - Helpers și Page Objects
- **Scope**: Helpers, page objects și utilitare de suport
- **Structura**:
  - `pages/` - Page Object Models (AuthPage, LunarGridPage, etc.)
  - `AccountManager.ts` - Management conturi de test

## 🚀 Rularea Testelor

### Teste Feature-uri
```bash
npx playwright test tests/features/ --project=chromium
```

### Teste Integrare  
```bash
npx playwright test tests/integration/ --project=chromium
```

### Teste Validare
```bash
npx playwright test tests/validation/ --project=chromium
```

### Toate testele principale
```bash
npx playwright test tests/ --project=chromium
```

### Teste de debug (temporare)
```bash
npx playwright test debug/ --project=chromium
```

## 🎯 Principii de Organizare

1. **Separarea clară**: Teste reale vs. debug temporar
2. **Logica funcțională**: Feature-uri → Integrare → Validare  
3. **Scalabilitate**: Structură care crește ușor cu noi teste
4. **Claritate**: Numit descriptiv și organizat logic
5. **Mentenabilitate**: Ușor de găsit și modificat

## 🔧 Convenții de Naming

- **Feature tests**: `nume-feature.spec.ts`
- **Integration tests**: `nume-integrare.spec.ts` 
- **Validation tests**: `nume-validator.spec.ts`
- **Debug tests**: `test-nume-debug.spec.ts` (temporar)

## 📊 Exemple de Organizare

```
tests/
├── features/
│   ├── transaction-form.spec.ts          ✅ Test feature individual
│   ├── category-management.spec.ts       ✅ Test feature individual
│   └── user-preferences.spec.ts          ✅ Test feature individual
├── integration/
│   ├── lunargrid-integration.spec.ts     ✅ Test workflow complet
│   ├── transaction-lifecycle.spec.ts     ✅ Test flow end-to-end
│   └── auth-data-flow.spec.ts            ✅ Test integrare complexă
└── validation/
    ├── data-generator.spec.ts            ✅ Test infrastructure
    ├── form-generator.spec.ts            ✅ Test utilities
    └── test-stability.spec.ts            ✅ Test consistență
``` 