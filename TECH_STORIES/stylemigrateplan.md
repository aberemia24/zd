# 🟢 PLAN GENERAL DE MIGRARE & REFACTORIZARE STILURI (TOATE COMPONENTELE)

## 0. Scop și Principii
- Asigurarea consistenței vizuale și tehnice în toată aplicația (frontend)
- Eliminarea completă a claselor Tailwind hardcodate din JSX
- Folosirea exclusivă a sistemului de design tokens, componentMap și getEnhancedComponentClasses
- Respectarea strictă a regulilor din BEST_PRACTICES.md, styling_rules.mdc și TECH_STORIES/completed/stilurirafinate.md
- Toate textele UI și mesajele din shared-constants
- Toate elementele interactive cu data-testid predictibil

## 1. Pași incrementali (per feature/folder)
1. **Audit per folder:**
   - Identifică toate componentele cu stiluri hardcodate sau inconsistente
   - Marchează componentele ce necesită refactor
2. **Refactorizare incrementală:**
   - Începe cu primitive (Button, Input, Alert, Badge, Card, etc.)
   - Continuă cu features (TransactionTable, TransactionForm, TransactionFilters, LunarGrid, CategoryEditor, etc.)
   - Refactorizează paginile (TransactionsPage, OptionsPage, LunarGridPage, etc.)
3. **Checklist per componentă:**
   - [ ] Eliminare completă clase Tailwind din JSX
   - [ ] Folosire getEnhancedComponentClasses și tokens pentru orice stil
   - [ ] Props pentru efecte vizuale (withShadow, withGradient, etc.)
   - [ ] Toate textele UI din shared-constants/ui
   - [ ] Toate mesajele din shared-constants/messages
   - [ ] data-testid predictibil pe orice element interactiv
   - [ ] Tipuri explicite pentru toate props-urile
   - [ ] Memoizare și optimizare performanță (useCallback/useMemo/React.memo)
   - [ ] Testare vizuală și automată (unde există)
4. **Validare și tracking progres:**
   - Marchează fiecare componentă/folder ca [x] în checklist după refactor
   - Adaugă notă în DEV_LOG.md la fiecare pas major
   - Rulează testele și verifică manual UI-ul

## 2. Prioritizare
- 1️⃣ Primitive (prerechizit pentru features)
- 2️⃣ Features (cele mai folosite în UI)
- 3️⃣ Pagini și layout-uri
- 4️⃣ Componente auxiliare (modals, dropdowns, loaders, etc.)

## 3. Reguli de validare
- Nu există className="..." cu Tailwind direct în JSX
- Nu există texte hardcodate în JSX (doar din constants)
- Toate efectele vizuale și spacing-ul doar din tokens/componentMap
- Toate props-urile au tip explicit
- Toate elementele interactive au data-testid
- Toate componentele folosesc barrel exports

## 4. Tracking progres (exemplu)
- [ ] primitives/Button
- [ ] primitives/Input
- [ ] primitives/Alert
- [ ] primitives/Badge
- [ ] primitives/Card
- [ ] features/TransactionTable
- [ ] features/TransactionForm
- [ ] features/TransactionFilters
- [ ] features/LunarGrid
- [ ] features/CategoryEditor
- [ ] pages/TransactionsPage
- [ ] pages/OptionsPage
- [ ] pages/LunarGridPage
- [ ] ...

---

#