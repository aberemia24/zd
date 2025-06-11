# 🎭 E2E Tests - Playwright Testing Suite

## 📁 Structura Organizată

```
tests/e2e/
├── 🟢 smoke/           → Teste rapide critice (< 10s)
│   ├── critical-auth.smoke.spec.ts     → Login + navigare (@smoke)
│   └── lunar-grid.smoke.spec.ts        → Basic LunarGrid functionality (@smoke)
│
├── 📋 suites/          → SUITE-URI PRINCIPALE ORGANIZATE
│   ├── features/       → Teste feature-uri individuale (@features)
│   │   ├── category-editor.spec.ts     → Editor categorii (703 linii)
│   │   └── transaction-form.spec.ts    → Formular tranzacții cu verificare Supabase
│   ├── integration/    → Teste workflow-uri complete (@integration)  
│   │   └── lunargrid-integration.spec.ts → Workflow complet LunarGrid
│   └── validation/     → Teste infrastructure/generatoare (@validation)
│       ├── data-generator.spec.ts      → Validează generatorul de date
│       ├── form-generator.spec.ts      → Validează generator TransactionForm
│       └── dynamic-variety.spec.ts     → Testează varietatea datelor
│
├── 🔧 debug/           → TESTE TEMPORARE DE DEBUG (@debug)
│   ├── explore-app.spec.ts             → Explorare aplicație
│   ├── test-primary-account.spec.ts    → Debug login
│   └── test-simple-generator.spec.ts   → Test basic generator
│
├── 🛠️ support/         → Helpers și Page Objects
│   ├── pages/          → AuthPage, CategoryEditorPage, LunarGridPage  
│   ├── AccountManager.ts → Management conturi test
│   └── supabase-helper.ts → Helper pentru verificări DB
│
├── 📋 config/          → Configurații și generatoare
│   ├── test-constants.ts → Constante, URL-uri, selectori (155 linii)
│   └── test-data-generator.ts → Generator dinamic date (457 linii)
│
└── 🎭 types/           → TypeScript definitions pentru teste
```

## 🏷️ **TAGURI PENTRU RULARE SELECTIVĂ**

### Rulare pe tipuri de teste:

```bash
# 🟢 Smoke tests - Rapide și critice (< 10s)
pnpm exec playwright test --grep "@smoke"

# 📋 Feature tests - Funcționalități individuale  
pnpm exec playwright test --grep "@features"

# 🔄 Integration tests - Workflow-uri complete
pnpm exec playwright test --grep "@integration"

# ✅ Validation tests - Infrastructure testing
pnpm exec playwright test --grep "@validation"

# 🔧 Debug tests - Temporare (pentru dezvoltare)
pnpm exec playwright test --grep "@debug"
```

### Rulare pe foldere:

```bash
# Toate smoke tests
pnpm exec playwright test smoke/

# Toate suite-urile principale
pnpm exec playwright test suites/

# Doar features
pnpm exec playwright test suites/features/

# Doar integration
pnpm exec playwright test suites/integration/

# Debug temporar
pnpm exec playwright test debug/
```

### Combinații utile:

```bash
# Quick check - doar smoke
pnpm exec playwright test --grep "@smoke" --reporter=line

# Full features testing
pnpm exec playwright test --grep "@features|@integration"

# Tot except debug
pnpm exec playwright test --grep "^(?!.*@debug).*$"

# Rulare paralelă pentru CI
pnpm exec playwright test --workers=4 --grep "@smoke|@features"
```

## 📊 **TIPURI DE TESTE EXPLICITE**

| Tip | Folder | Tag | Scopul | Durata |
|-----|--------|-----|--------|--------|
| **Smoke** | `smoke/` | `@smoke` | Critical paths rapide | < 10s |
| **Features** | `suites/features/` | `@features` | Funcționalități individuale | 30s-2min |
| **Integration** | `suites/integration/` | `@integration` | Workflow-uri complete | 1-3min |
| **Validation** | `suites/validation/` | `@validation` | Infrastructure testing | < 30s |
| **Debug** | `debug/` | `@debug` | Temporary debugging | Variabil |

## 🎯 **WORKFLOW RECOMANDAT**

### Pentru dezvoltare zilnică:
1. **Smoke tests** după fiecare commit
2. **Feature tests** pentru funcționalități modificate  
3. **Integration tests** înainte de PR

### Pentru CI/CD:
1. **Quick pipeline**: `@smoke` tests (< 1min)
2. **Full pipeline**: toate testele except `@debug`

## 📝 **EXEMPLE DE UTILIZARE**

```bash
# Quick smoke check înainte de commit
pnpm test:e2e:smoke

# Test doar CategoryEditor
pnpm exec playwright test category-editor

# Test cu debugging vizual
pnpm exec playwright test --headed --grep "@smoke"

# Generează raport HTML
pnpm exec playwright test --reporter=html
```

## 🛠️ **CONFIGURARE TAGURI**

Tagurile sunt setate în fiecare test cu:
```typescript
test('nume test', { tag: '@smoke' }, async ({ page }) => {
  // test code
});
```

Tagurile disponibile:
- `@smoke` - Critical paths
- `@features` - Individual features  
- `@integration` - Complete workflows
- `@validation` - Infrastructure
- `@debug` - Temporary debugging 