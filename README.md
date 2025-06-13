# Budget App Monorepo

## 📚 Scop

Aplicație de bugetare modulară, modernă și extensibilă pentru web, Android și iOS. Inspirată dintr-un Excel complex, cu reguli stricte de calitate și scalabilitate.

---

## 📁 Structură Directoare

- `frontend/` - React + React Query + Zustand + TailwindCSS + Testing Library
- `backend/` - NestJS + Supabase
- `shared-constants/` - Sursa unică pentru enums/constants partajate (TypeScript, Zod, barrel index.ts)

---

## 🧑‍💻 Stack Tehnologic

- **Frontend:** React, React Query, Zustand, Testing Library, Jest, TailwindCSS, i18next
- **Backend:** NestJS, Supabase
- **Shared:** TypeScript, Zod
  - **Chei query params tranzacții:** Toate cheile de query parametri pentru tranzacții (type, category, dateFrom, dateTo, limit, offset, sort) sunt definite o singură dată în `shared-constants/queryParams.ts` și se importă EXPLICIT din `@shared-constants/queryParams`.
- **Tooling:** ESLint, Prettier, Husky, Commitlint, pnpm Workspaces
- **Arhitectură:** **ESM (ES Modules) complet** - toate pachetele folosesc native ESM

## 🔧 Arhitectură ESM

**Proiectul folosește ESM (ES Modules) complet** - toate pachetele sunt configurate cu `"type": "module"`:

- **Root:** `package.json` cu `"type": "module"`
- **Frontend:** ESM + Vite (native ESM support)
- **Backend:** ESM + NestJS cu ts-node/esm loader
- **Shared-constants:** ESM + barrel exports
- **Scripts:** 21 script-uri `/scripts/` convertite la ESM cu import/export

### Configurație ESM

```json
// package.json (toate pachetele)
{
  "type": "module"
}

// TypeScript configs
{
  "compilerOptions": {
    "module": "ES2022",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "verbatimModuleSyntax": true
  }
}
```

### Comenzi ESM

```bash
# Backend cu ESM
node --no-warnings --loader ts-node/esm src/main.ts

# Scripts ESM (toate convertite)
node scripts/validate-transaction-types.js
node scripts/validate-console-cleanup.js
```

**Beneficii:**

- Consistență completă în tot monorepo-ul
- Standard JavaScript modern
- Interoperabilitate îmbunătățită între pachete
- Tree shaking și analiză statică
- Arhitectură future-proof

---

## 🧩 Convenții și Filozofie

- **TDD:** Dezvoltare prin testare pentru toate componentele și serviciile.
- **Fără Hardcodări:** Toate textele UI și mesajele centralizate în `constants/`.
- **State Management:** Zustand pentru UI state, React Query pentru server state.
- **Caching API:** React Query pentru cache și invalidare selectivă.
- **Structură Modulară:** `primitives/`, `features/`, `stores/`, `constants/`.
- **Documentare Continuă:** Toate convențiile și lecțiile în [BEST_PRACTICES.md](./BEST_PRACTICES.md) și [DEV_LOG.md](./DEV_LOG.md).

### Checklist future-proof pentru constants shared

- [ ] Orice constantă/enum/mesaj nou se adaugă DOAR în `shared-constants/`.
- [ ] Toate importurile pentru constants shared se fac DOAR prin path mapping `@shared-constants`.
- [ ] Barrel-ul `shared-constants/index.ts` se actualizează la orice modificare.
- [ ] Nu există nicio valoare duplicată local în FE sau BE pentru constants partajate.
- [ ] Orice modificare se anunță clar în code review și se documentează în `DEV_LOG.md`.
- [ ] Se rulează periodic scriptul de audit pentru importuri (`node tools/validate-constants.js`).
- [ ] Orice excepție/abatere se aprobă și se justifică explicit.

---

## 🚀 Workflow de Dezvoltare

1. Dezvoltare TDD.
2. Documentare continuă a deciziilor și lecțiilor.
3. Integrare prin Pull Request-uri cu review și teste trecute.

Detalii complete: vezi [BEST_PRACTICES.md](./BEST_PRACTICES.md).

---

## 🛠️ Setup Rapid

```bash
# Instalare dependințe
pnpm install

# Build toate pachetele (shared-constants sync automatic)
pnpm run build
```

### Start Frontend

```bash
pnpm --filter frontend dev
```

### Start Backend

```bash
pnpm --filter backend dev
```

### Commands Cross-Package

```bash
# Test toate pachetele
pnpm run test

# Build toate pachetele
pnpm run build

# Lint toate pachetele
pnpm run lint

# Run command specific în frontend
pnpm --filter frontend build

# Run command specific în backend
pnpm --filter backend start:prod
```

> **💡 Notă**: PowerShell folosește `;` ca separator de comenzi, în timp ce Bash/Zsh folosesc `&&`.

Configurează `.env`-urile după modelele existente.

---

## 📋 API Principal

### GET /transactions

Parametri disponibili:

- `type` (string, opțional)
- `category` (string, opțional)
- `dateFrom`, `dateTo` (string, format YYYY-MM-DD)
- `limit`, `offset` (paginare)
- `sort` (câmp sortare, cu `-` pentru descrescător)

Structură răspuns:

```json
{
  "data": [],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

---

## 🔒 Securitate

- Autentificare Supabase Auth.
- Date sensibile în `.env`.
- Validare input cu NestJS și Zod.

---

## 🧠 Alte Documente Importante

- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Reguli oficiale de codare și arhitectură.
- [DEV_LOG.md](./DEV_LOG.md) - Istoric decizii și lecții învățate.
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Ghid de stilizare și design tokens.

---

## React Query (Implementat și stabil)

Aplicația folosește [React Query (TanStack Query)](https://tanstack.com/query/latest) pentru fetch și management state server-side (CRUD tranzacții, sincronizare, cache, optimistic updates).

### Pattern adoptat

- **Custom hooks** pentru fetch și mutații (`useMonthlyTransactions`, `useInfiniteTransactions`, etc.)
- **Servicii dedicate** pentru business logic și apeluri API (ex: `TransactionService`)
- **Centralizare rute și config API** în `@shared-constants/api`
- **UI state** separat de server state (store-uri Zustand doar pentru filtre, UI, fără fetch)

### Exemplu de usage

```tsx
import { useMonthlyTransactions } from 'src/services/hooks/useMonthlyTransactions';
import { API } from '@shared-constants/api';

const { data, isLoading, refetch } = useMonthlyTransactions({ year, month });

// Pentru mutații:
const { mutate: addTransaction } = useTransactionMutations().create;
addTransaction({ ... });
```

### Best practices

- Folosește DOAR rutele din `API.ROUTES.*` pentru orice fetch/mutație.
- Nu folosi string-uri hardcodate pentru endpoint-uri sau mesaje.
- Nu apela direct store-uri pentru fetch de date – folosește hooks React Query.
- Pentru orice nou API, adaugă ruta în `shared-constants/api.ts` și importă prin alias.
- Rulează periodic `node tools/validate-constants.js` pentru audit.

---

## 🔥 Status Actual

- Eliminare completă hardcodări ✅
- Implementare caching optimizat cu React Query ✅
- Refactorizare modulară frontend ✅
- Migrare Zustand pentru UI state management ✅
- Implementare LunarGrid cu TanStack Table ✅
- Eliminare string-uri hardcodate ✅
- Sistem de design tokens implementat ✅
- **Migrare completă la ESM (ES Modules)** ✅
- Documentare actualizată ✅

---

## 🐞 Jurnal de Debugging

### Sesiunea 2024-06-11: Debugging `UniversalTransactionPopover` în LunarGrid

Această sesiune a avut ca scop rezolvarea unei serii de bug-uri complexe apărute după implementarea componentei consolidate `UniversalTransactionPopover`.

**1. Problema Inițială: Câmpuri Dezactivate și Re-render Infinit**

- **Simptom:** Câmpurile din popover erau nefuncționale, iar consola arăta o buclă infinită de re-render-uri.
- **Cauza:** Props-uri instabile pasate de la `EditableCell`. Calculele (ex: extragerea zilei/lunii/anului din dată) și funcțiile de callback erau re-create la fiecare render.
- **Soluția:** Stabilizarea props-urilor în `EditableCell` folosind `useMemo` pentru valori calculate și `useCallback` pentru funcții.

**2. Problema 2: Încălcarea "Rules of Hooks"**

- **Simptom:** Eroare critică în consolă: "Rendered more hooks than during the previous render".
- **Cauza:** Hook-urile `useCallback` pentru `onSave` și `onCancel` erau definite în interiorul unui JSX redat condițional, încălcând regula fundamentală a hook-urilor.
- **Soluția:** Mutarea definițiilor `useCallback` la nivelul superior al componentei `EditableCell`, asigurând o ordine constantă a apelurilor.

**3. Problema 3: Pierderea Focusului la Tastare**

- **Simptom:** La tastarea în câmpul "Descriere", input-ul pierdea focusul după fiecare caracter.
- **Cauza:** O problemă de arhitectură subtilă. Componenta `FormContent` era definită _în interiorul_ funcției de render a `UniversalTransactionPopover`. Orice schimbare de stare în popover ducea la re-crearea `FormContent`, distrugând astfel elementul DOM care avea focusul.
- **Soluția:** Extragerea `FormContent` într-o componentă de sine stătătoare, stabilă, definită în afara `UniversalTransactionPopover`.

**4. Problema 4: Evenimente de Tastatură Propagate (Bubbling)**

- **Simptom:** Tastarea în inputurile din popover declanșa modul de editare inline în celula părinte.
- **Cauza:** Evenimentele `keydown` se propagau de la popover în sus către `EditableCell`, care are un listener ce interpretează orice tastă ca o intenție de editare.
- **Soluția:** Adăugarea `onKeyDown={(e) => e.stopPropagation()}` pe container-ul principal al `FormContent` pentru a opri propagarea evenimentelor.

**5. Problema Finală (Nerezolvată): Date Inconsistente (`existingTransaction`)**

- **Simptom:** Popover-ul se deschide mereu în modul "Adaugă", chiar și pentru celule cu valori existente. Butonul "Șterge" nu apare sau este dezactivat.
- **Cauza Rădăcină:** Prop-ul `existingTransaction` este `undefined`. Problema provine din instabilitatea listei `validTransactions` și a logicii de `find` în componentele părinte (`LunarGridRow`, `LunarGridTanStack`).
- **Soluție Aplicată (dar eșuată):** S-a încercat stabilizarea datelor la sursă (`LunarGridTanStack`) și pasarea întregii liste de tranzacții până la `EditableCell`, unde logica `find` ar trebui să funcționeze într-un mediu controlat.
- **Stadiu Actual:** Soluția nu a funcționat. `existingTransaction` este în continuare `undefined`, indicând o problemă persistentă în fluxul de date. **Necesită investigație suplimentară.**

**Lecții Învățate:**

- **Stabilitatea Props-urilor este crucială:** Obiectele și funcțiile instabile pasate ca props pot declanșa cascade de re-render-uri greu de depanat.
- **Arhitectura Componentelor contează:** Definirea unei componente în interiorul alteia este un anti-pattern care duce la probleme de stare și focus.
- **Izolarea Problemelor:** Debugging-ul eficient necesită izolarea problemei strat cu strat, de la componenta de UI până la sursa de date.
- **Fluxul de Date:** Asigurarea unui flux de date corect și stabil de la componenta părinte la cea copil este fundamentală pentru funcționalitatea corectă a aplicațiilor React complexe.

---

_Actualizat la: 2025-05-22_

---

## 🛡️ Audit automat importuri enums/constants

Toate importurile pentru enums/constants partajate trebuie să folosească doar `@shared-constants`.

Verifică automat corectitudinea cu:

```bash
pnpm run validate:constants
```

Dacă există importuri greșite, scriptul va afișa eroarea și va opri execuția. Exemplu:

```
❌ Wrong/legacy imports found:
  frontend/src/test/mockData.ts → from '../constants/enums'
```

## 🤖 Multi-AI Development

This project supports **simultaneous development by multiple AI agents** without conflicts using Docker isolation.

### Quick Setup

```bash
# Complete multi-AI setup (Docker + branches + containers)
./scripts/quick-multi-ai-setup.sh

# For Cursor AI (ports 3000/3001)
./scripts/start-cursor.sh

# For Windsurf AI (ports 4000/4001)
./scripts/start-windsurf.sh

# Check system status
./scripts/ai-status.sh

# Merge AI work intelligently
./scripts/merge-branches.sh
```

### Documentation

- **[Windsurf AI Guide](WINDSURF_AI_GUIDE.md)** - Complete workflow guide for Windsurf AI
- **[Multi-AI Setup](MULTI_AI_SETUP.md)** - Technical setup and troubleshooting

### Features

- 🐳 **Docker isolation** - Separate containers per AI
- 🌿 **Auto-branch switching** - Dedicated git branches
- 🔄 **Smart merging** - Intelligent conflict resolution
- 📊 **Status dashboard** - Monitor both AI progress
- 🚀 **Hot reload** - Live development in containers

---

## 🚀 Quick Start

```bash
# Instalare dependințe
pnpm install

# Build toate pachetele (shared-constants sync automatic)
pnpm run build
```

### Start Frontend

```bash
pnpm --filter frontend dev
```

### Start Backend

```bash
pnpm --filter backend dev
```

### Commands Cross-Package

```bash
# Test toate pachetele
pnpm run test

# Build toate pachetele
pnpm run build

# Lint toate pachetele
pnpm run lint

# Run command specific în frontend
pnpm --filter frontend build

# Run command specific în backend
pnpm --filter backend start:prod
```

> **💡 Notă**: PowerShell folosește `;` ca separator de comenzi, în timp ce Bash/Zsh folosesc `&&`.

Configurează `.env`-urile după modelele existente.

---

## 📋 API Principal

### GET /transactions

Parametri disponibili:

- `type` (string, opțional)
- `category` (string, opțional)
- `dateFrom`, `dateTo` (string, format YYYY-MM-DD)
- `limit`, `offset` (paginare)
- `sort` (câmp sortare, cu `-` pentru descrescător)

Structură răspuns:

```json
{
  "data": [],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

---

## 🔒 Securitate

- Autentificare Supabase Auth.
- Date sensibile în `.env`.
- Validare input cu NestJS și Zod.

---

## 🧠 Alte Documente Importante

- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Reguli oficiale de codare și arhitectură.
- [DEV_LOG.md](./DEV_LOG.md) - Istoric decizii și lecții învățate.
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Ghid de stilizare și design tokens.

---

## React Query (Implementat și stabil)

Aplicația folosește [React Query (TanStack Query)](https://tanstack.com/query/latest) pentru fetch și management state server-side (CRUD tranzacții, sincronizare, cache, optimistic updates).

### Pattern adoptat

- **Custom hooks** pentru fetch și mutații (`useMonthlyTransactions`, `useInfiniteTransactions`, etc.)
- **Servicii dedicate** pentru business logic și apeluri API (ex: `TransactionService`)
- **Centralizare rute și config API** în `@shared-constants/api`
- **UI state** separat de server state (store-uri Zustand doar pentru filtre, UI, fără fetch)

### Exemplu de usage

```tsx
import { useMonthlyTransactions } from 'src/services/hooks/useMonthlyTransactions';
import { API } from '@shared-constants/api';

const { data, isLoading, refetch } = useMonthlyTransactions({ year, month });

// Pentru mutații:
const { mutate: addTransaction } = useTransactionMutations().create;
addTransaction({ ... });
```

### Best practices

- Folosește DOAR rutele din `API.ROUTES.*` pentru orice fetch/mutație.
- Nu folosi string-uri hardcodate pentru endpoint-uri sau mesaje.
- Nu apela direct store-uri pentru fetch de date – folosește hooks React Query.
- Pentru orice nou API, adaugă ruta în `shared-constants/api.ts` și importă prin alias.
- Rulează periodic `node tools/validate-constants.js` pentru audit.

---

## 🔥 Status Actual

- Eliminare completă hardcodări ✅
- Implementare caching optimizat cu React Query ✅
- Refactorizare modulară frontend ✅
- Migrare Zustand pentru UI state management ✅
- Implementare LunarGrid cu TanStack Table ✅
- Eliminare string-uri hardcodate ✅
- Sistem de design tokens implementat ✅
- **Migrare completă la ESM (ES Modules)** ✅
- Documentare actualizată ✅

---

## 🐞 Jurnal de Debugging

### Sesiunea 2024-06-11: Debugging `UniversalTransactionPopover` în LunarGrid

Această sesiune a avut ca scop rezolvarea unei serii de bug-uri complexe apărute după implementarea componentei consolidate `UniversalTransactionPopover`.

**1. Problema Inițială: Câmpuri Dezactivate și Re-render Infinit**

- **Simptom:** Câmpurile din popover erau nefuncționale, iar consola arăta o buclă infinită de re-render-uri.
- **Cauza:** Props-uri instabile pasate de la `EditableCell`. Calculele (ex: extragerea zilei/lunii/anului din dată) și funcțiile de callback erau re-create la fiecare render.
- **Soluția:** Stabilizarea props-urilor în `EditableCell` folosind `useMemo` pentru valori calculate și `useCallback` pentru funcții.

**2. Problema 2: Încălcarea "Rules of Hooks"**

- **Simptom:** Eroare critică în consolă: "Rendered more hooks than during the previous render".
- **Cauza:** Hook-urile `useCallback` pentru `onSave` și `onCancel` erau definite în interiorul unui JSX redat condițional, încălcând regula fundamentală a hook-urilor.
- **Soluția:** Mutarea definițiilor `useCallback` la nivelul superior al componentei `EditableCell`, asigurând o ordine constantă a apelurilor.

**3. Problema 3: Pierderea Focusului la Tastare**

- **Simptom:** La tastarea în câmpul "Descriere", input-ul pierdea focusul după fiecare caracter.
- **Cauza:** O problemă de arhitectură subtilă. Componenta `FormContent` era definită _în interiorul_ funcției de render a `UniversalTransactionPopover`. Orice schimbare de stare în popover ducea la re-crearea `FormContent`, distrugând astfel elementul DOM care avea focusul.
- **Soluția:** Extragerea `FormContent` într-o componentă de sine stătătoare, stabilă, definită în afara `UniversalTransactionPopover`.

**4. Problema 4: Evenimente de Tastatură Propagate (Bubbling)**

- **Simptom:** Tastarea în inputurile din popover declanșa modul de editare inline în celula părinte.
- **Cauza:** Evenimentele `keydown` se propagau de la popover în sus către `EditableCell`, care are un listener ce interpretează orice tastă ca o intenție de editare.
- **Soluția:** Adăugarea `onKeyDown={(e) => e.stopPropagation()}` pe container-ul principal al `FormContent` pentru a opri propagarea evenimentelor.

**5. Problema Finală (Nerezolvată): Date Inconsistente (`existingTransaction`)**

- **Simptom:** Popover-ul se deschide mereu în modul "Adaugă", chiar și pentru celule cu valori existente. Butonul "Șterge" nu apare sau este dezactivat.
- **Cauza Rădăcină:** Prop-ul `existingTransaction` este `undefined`. Problema provine din instabilitatea listei `validTransactions` și a logicii de `find` în componentele părinte (`LunarGridRow`, `LunarGridTanStack`).
- **Soluție Aplicată (dar eșuată):** S-a încercat stabilizarea datelor la sursă (`LunarGridTanStack`) și pasarea întregii liste de tranzacții până la `EditableCell`, unde logica `find` ar trebui să funcționeze într-un mediu controlat.
- **Stadiu Actual:** Soluția nu a funcționat. `existingTransaction` este în continuare `undefined`, indicând o problemă persistentă în fluxul de date. **Necesită investigație suplimentară.**

**Lecții Învățate:**

- **Stabilitatea Props-urilor este crucială:** Obiectele și funcțiile instabile pasate ca props pot declanșa cascade de re-render-uri greu de depanat.
- **Arhitectura Componentelor contează:** Definirea unei componente în interiorul alteia este un anti-pattern care duce la probleme de stare și focus.
- **Izolarea Problemelor:** Debugging-ul eficient necesită izolarea problemei strat cu strat, de la componenta de UI până la sursa de date.
- **Fluxul de Date:** Asigurarea unui flux de date corect și stabil de la componenta părinte la cea copil este fundamentală pentru funcționalitatea corectă a aplicațiilor React complexe.

---

_Actualizat la: 2025-05-22_

---

## 🛡️ Audit automat importuri enums/constants

Toate importurile pentru enums/constants partajate trebuie să folosească doar `@shared-constants`.

Verifică automat corectitudinea cu:

```bash
pnpm run validate:constants
```

Dacă există importuri greșite, scriptul va afișa eroarea și va opri execuția. Exemplu:

```
❌ Wrong/legacy imports found:
  frontend/src/test/mockData.ts → from '../constants/enums'
```
