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
- **Tooling:** ESLint, Prettier, Husky, Commitlint, npm Workspaces

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
- Documentare actualizată ✅

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
