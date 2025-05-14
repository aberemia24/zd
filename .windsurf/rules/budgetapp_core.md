---
trigger: always_on
---

---
id: budgetapp_core
title: Reguli Globale BudgetApp – CORE
scope: ["**/*"]                # întregul repo
severity: error
tags: [budgetapp, global]
---

### 1.1 Constants & enums partajate
- Sursă unică: `shared-constants/`.
- Nu modificați copiile din `frontend/src/shared-constants/`; acestea sunt *generate* și **suprascrise** de scriptul de sincronizare (`npm run sync:shared-constants`) care rulează automat la fiecare build/compilare.
- Import DOAR prin `@shared-constants`; fără barrel local / path relativ.
- Actualizați `shared-constants/index.ts` după fiecare schimbare.
- Valori implicite (paginare, monedă etc.) se află în `shared-constants/defaults.ts`.
- Rulează `npm run validate:constants` înainte de commit; pipeline blochează erorile.
- Exemplu:  
  ```ts
  import { TransactionType } from '@shared-constants';
  ```

### 1.2 Texte & mesaje
- UI copy și mesajele de sistem sunt parte din **sursa unică de adevăr**: `shared-constants/ui.ts` și `shared-constants/messages.ts`.
- Import în FE/BE exclusiv prin aliasul `@shared-constants` (ex.: `import { UI } from '@shared-constants/ui'`).
- Este interzisă folosirea oricăror string‑uri hardcodate în componente sau servicii.
- Copia din `frontend/src/shared-constants/` este generată la build împreună cu restul constantelor.

### 1.3 API
- Toate rutele/time‑out‑urile în `shared-constants/api.ts`; import:
  ```ts
  import { API } from '@shared-constants/api';
  fetch(API.ROUTES.TRANSACTIONS);
  ```
- `API_URL` este **deprecated** și interzis.

## 2. Structură & nomenclatură
- Componente: `components/primitives/` vs `components/features/`.
- Store‑uri Zustand pe domenii în `src/stores/`; secțiuni: state, UI‑state, setters, actions, utils.
- Servicii injectate pentru testabilitate.
- Naming: SCREAMING_SNAKE_CASE (constants/UI), PascalCase (enum‑uri), `use[Domeniu]Store` (store‑uri).

## 3. Testare & TDD
- Teste unitare scrise înainte de cod.
- Fișiere `.test.ts(x)` colocate.
- Mokați serviciile; folosiți `await act(async () => …)` pentru async.
- Selectors: testați memoizarea + edge‑cases.

## 4. Migrare hooks → Zustand
- Hooks custom rămân până la paritate funcțională.
- Pentru fiecare mutare:  
  1. Adaugă store cu API echivalent.  
  2. Scrie teste.  
  3. Înlocuiește hook‑ul în UI.  
  4. Șterge vechiul cod și documentează în `DEV_LOG.md`.

## 7. CI/CD & calitate
- Hooks pre‑commit: lint, validate:constants, unit tests.
- Pipeline respinge: lint errors, <90 % coverage, importuri interzise.
- Build copiază automat `shared-constants` spre FE și exportă UI copy dacă flag `--export-ui`.

## 8. Ownership & documentare
- Fiecare fișier din `shared-constants` are owner (echipă sau persoană) listat în antet.
- Orice schimbare: menționată în PR, notată în `DEV_LOG.md`.
- Best practices / workaround‑uri noi: `BEST_PRACTICES.md`.
- Comentarii și docs doar în română.

## 9. Deprecated & memorii
- Memoriile critice marcate `[CRITIC]`.
- Cod/notes deprecated: mută în `deprecated/` cu data, regula actuală și motivul.

## 10. Checklist rapid (de lipit lângă keyboard)
- [ ] Constants noi în `shared-constants/`; barrel up‑to‑date.
- [ ] Importuri doar prin alias.
- [ ] Fără string‑uri hardcodate.
- [ ] Rulat `npm run validate:constants` + tests OK.
- [ ] PR include update la docs & owner reviewer.
- [ ] Nicio referință la `API_URL`.

### [NOU] Reguli mock-uri testare
- Mock-uim **doar** external services (API/fetch), time/date, random values și browser APIs (window/localStorage etc.).
- **Nu** mock-uim stores, hooks Zustand sau logică internă proprie.
- Orice excepție trebuie justificată și documentată clar în PR și BEST_PRACTICES.md.

_Abaterile trebuie justificate și documentate în PR + DEV_LOG.md._
