e2e/
├── 🟢 smoke/           → Teste rapide critice (NEW în Faza 4)
│   ├── critical-auth.smoke.spec.ts     → Login + navigare (8.5s)
│   └── lunar-grid.smoke.spec.ts        → Basic LunarGrid functionality
│
├── 🧪 tests/           → TESTELE PRINCIPALE (organizate logic)
│   ├── features/       → Teste feature-uri individuale
│   │   ├── category-editor.spec.ts     → 703 linii, foarte detaliat
│   │   └── transaction-form.spec.ts    → 361 linii, cu verificare Supabase
│   ├── integration/    → Teste workflow-uri complete  
│   │   └── lunargrid-integration.spec.ts → 134 linii, workflow complet
│   └── validation/     → Teste pentru infrastructure/generatoare
│       ├── data-generator.spec.ts      → Validează generatorul de date
│       ├── form-generator.spec.ts      → Validează generator TransactionForm
│       └── dynamic-variety.spec.ts     → Testează varietatea datelor
│
├── 🔧 debug/           → TESTE TEMPORARE DE DEBUG (se ștearg)
│   ├── explore-app.spec.ts             → 182 linii, explorare aplicație
│   ├── test-primary-account.spec.ts    → Debug login
│   └── test-simple-generator.spec.ts   → Test basic generator
│
├── 🛠️ support/         → Helpers și Page Objects
│   ├── pages/          → AuthPage, CategoryEditorPage, LunarGridPage  
│   ├── AccountManager.ts → Management conturi test
│   └── supabase-helper.ts → Helper pentru verificări DB (stub)
│
├── 📋 config/          → Configurații și generatoare
│   ├── test-constants.ts → Constante, URL-uri, selectori
│   └── test-data-generator.ts → 457 linii, generator dinamic date
│
├── 🗂️ deprecated/      → Fișiere vechi (nu se folosesc)
├── 📁 setup/           → GOOOOL (nu e folosit)
├── 📁 scripts/         → GOOOOL (nu e folosit)  
├── 🎭 types/           → TypeScript definitions pentru teste
└── 📝 README.md        → Documentație organizare (111 linii)