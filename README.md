# Budget App Monorepo

## 📚 Scop

Aplicație de bugetare modulară, modernă și extensibilă pentru web, Android și iOS. Inspirată dintr-un Excel complex, cu reguli stricte de calitate și scalabilitate.

---

## 📁 Structură Directoare

- `frontend/` - React + Zustand + TailwindCSS + Testing Library
- `backend/` - NestJS + MongoDB + Firebase Auth
- `shared-constants/` - Sursa unică pentru enums/constants partajate (TypeScript, Zod, barrel index.ts)

---

## 🧑‍💻 Stack Tehnologic

- **Frontend:** React, Zustand, Testing Library, Jest, TailwindCSS, i18next
- **Backend:** NestJS, MongoDB, Firebase Auth, Jest
- **Shared:** TypeScript, Zod
  - **Chei query params tranzacții:** Toate cheile de query parametri pentru tranzacții (type, category, dateFrom, dateTo, limit, offset, sort) sunt definite o singură dată în `shared-constants/queryParams.ts` și se importă EXPLICIT din `@shared-constants/queryParams`.
- **Tooling:** ESLint, Prettier, Husky, Commitlint, npm Workspaces

---

## 🧩 Convenții și Filozofie

- **TDD:** Dezvoltare prin testare pentru toate componentele și serviciile.
- **Fără Hardcodări:** Toate textele UI și mesajele centralizate în `constants/`.
- **State Management:** Zustand, selectors pentru performanță.
- **Caching API:** Servicii cu caching LRU și invalidare selectivă.
- **Structură Modulară:** `primitives/`, `features/`, `stores/`, `constants/`.
- **Documentare Continuă:** Toate convențiile și lecțiile în [BEST_PRACTICES.md](./BEST_PRACTICES.md) și [DEV_LOG.md](./DEV_LOG.md).

---

## 🚀 Workflow de Dezvoltare

1. Dezvoltare TDD.
2. Documentare continuă a deciziilor și lecțiilor.
3. Integrare prin Pull Request-uri cu review și teste trecute.

Detalii complete: vezi [BEST_PRACTICES.md](./BEST_PRACTICES.md).

---

## 🛠️ Setup Rapid

```bash
# Instalare dependențe
npm install

# Start frontend
cd frontend
npm start

# Start backend
cd backend
npm run start:dev
```

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

- Autentificare Firebase Auth.
- Date sensibile în `.env`.
- Validare input cu NestJS și Zod.

---

## 🧠 Alte Documente Importante

- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Reguli oficiale de codare și arhitectură.
- [DEV_LOG.md](./DEV_LOG.md) - Istoric decizii și lecții învățate.

---

## 🔥 Status Actual

- Eliminare completă hardcodări ✅
- Implementare caching optimizat ✅
- Refactorizare modulară frontend ✅
- Migrare Zustand pentru state management ✅
- Documentare actualizată ✅

---

_Actualizat la: 2025-04-26_

---

## 🛡️ Audit automat importuri enums/constants

Toate importurile pentru enums/constants partajate trebuie să folosească doar `@shared-constants`.

Verifică automat corectitudinea cu:

```sh
npm run validate:constants
```

Dacă există importuri greșite, scriptul va afișa eroarea și va opri execuția. Exemplu:
```
❌ Wrong/legacy imports found:
  frontend/src/test/mockData.ts → from '../constants/enums'
```
