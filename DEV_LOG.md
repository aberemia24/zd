# Dev Log - Budget App

## 2025-04-21 - Setup Inițial
- Creat structură monorepo: frontend (React + TDD), backend (NestJS + TDD), shared.
- Configurare testare automată cu Jest și Testing Library.
- Implementat model unificat `Transaction` și validare runtime cu Zod.
- Definit structura categorii/subcategorii.
- Implementat endpoint GET /transactions cu filtrare, sortare și paginare.

## 2025-04-22 - Refactorizare Frontend
- Extragere `TransactionForm` și `TransactionTable` în componente dedicate.
- Mutare teste unitare colocate cu componentele.
- Configurare reporteri Jest (`summarizing-reporter`, `jest-html-reporter`).
- Consolidare convenții și best practices inițiale.

## 2025-04-23 - Dropdown-uri Dinamice și Testare Robusta
- Finalizare flux principal tranzacții frontend.
- Refactorizare filtrare categorii/subcategorii în funcție de tip.
- Eliminare completă opțiune 'Transfer'.
- Placeholder 'Alege' condiționat corect.
- Testare exhaustivă dropdown-uri folosind helperi dedicați și sursa de adevăr importată.
- Documentare completă a lecțiilor în BEST_PRACTICES.md.

## 2025-04-24 - Eliminare Hardcodări și TailwindCSS
- Centralizare completă texte UI și mesaje în constants/ui.ts și constants/messages.ts.
- Refactorizare structură componente în primitives și features.
- Configurare TailwindCSS și Jest DOM Matchers.
- Implementare componente primitive cu stilizare Tailwind.
- Creare componentă demonstrativă Excel-like Grid pentru raportare.

## 2025-04-24 - Implementare Sursă Unică Enums
- Definire enums partajate în `shared/enums.ts`.
- Re-export frontend din `constants/enums.ts`.
- Configurare build shared și suport complet Jest/CRA.

## 2025-04-25 - Refactorizare App.tsx cu Hooks și Servicii
- Separare logică aplicație în `useTransactionForm`, `useTransactionFilters`, `useTransactionData`.
- Implementare servicii `TransactionService` și `TransactionApiClient`.
- Testare hooks și servicii cu mock-uri dedicate.
- Implementare caching LRU cu invalidare selectivă în serviciile API.
- Lecții importante: handling async controlat, barrel exports, mock-uri pentru metode publice.

## 2025-04-25 - Migrare la Zustand
- Creare store `useTransactionStore` în `frontend/src/stores/`.
- Testare TDD pentru Zustand: inițializare, setters, acțiuni asincrone, selectors.
- Evitare props drilling excesiv și utilizare selectors pentru optimizare.
- Pattern robust pentru testare store-uri cu injectare servicii mock.

---

## 2025-04-28 - Centralizare chei query params tranzacții (QUERY_PARAMS)
- Mutat toate cheile de query parametri pentru tranzacții (type, category, dateFrom, dateTo, limit, offset, sort) în `shared-constants/queryParams.ts`.
- Eliminat duplicarea din `frontend/src/constants/api.ts` și `backend/src/constants/api.ts`.
- Importurile se fac EXPLICIT din `@shared-constants/queryParams` (nu din barrel!).
- Motiv: sincronizare automată FE/BE, fără risc de desincronizare la refactor.
- Orice modificare la aceste chei trebuie anunțată și documentată.
- Path mapping actualizat în ambele `tsconfig.json` pentru rezolvare corectă.

# Lessons Learned

- Barrel exports pot cauza importuri circulare - necesară organizare ierarhică clară.
- Mock-urile pentru clase private trebuie să vizeze doar metodele publice.
- URL constructor în Node necesită o bază absolută validă pentru URL-uri relative.
- Controlul explicit al promisiunilor oferă teste asincrone mai stabile.
- Invalidarea selectivă a cache-ului reduce semnificativ apelurile API redundante.
- Migrarea de la hooks custom la Zustand necesită rescriere completă a testelor.

---

_Actualizat la: 2025-04-26_

## 2025-04-27 - Finalizare migrare Zustand pentru tranzacții și recurență
- Toate funcționalitățile de tranzacții (inclusiv recurență) folosesc exclusiv Zustand store-uri, fără hooks custom legacy.
- Testare exhaustivă pentru toate edge cases, validare și fluxuri negative/pozitive, inclusiv recurență.
- Nu mai există props drilling sau duplicare logică între hooks și store-uri.
- Toate textele UI, mesajele și enums sunt centralizate și importate doar din barrel (`constants/index.ts`).
- Convențiile și best practices au fost actualizate și respectate (vezi BEST_PRACTICES.md).
- Documentarea și refactorizările minore rămase sunt în curs.
- Orice abatere de la aceste reguli trebuie justificată și documentată explicit în code review și DEV_LOG.md.

## 2025-04-27 - Migrare enums/constants la shared-constants și audit automat importuri
- Finalizată migrarea enums/constants la sursa unică `shared-constants/`.
- Toate importurile din frontend și backend folosesc doar `@shared-constants`.
- Eliminare completă a importurilor legacy (direct din constants/enums sau shared).
- Scriptul `tools/validate-constants.js` validează automat corectitudinea importurilor și sincronizarea.
- Actualizate documentația și best practices pentru această strategie.

## 2025-04-28 - Configurare rezolvare alias și îmbunătățiri testare
- Adăugat alias `@shared-constants` în `craco.config.js` pentru Jest (moduleNameMapper).
- Actualizat `tsconfig.json` (frontend) cu `paths` către `src/shared-constants` pentru TypeScript.
- Modificat `package.json` pentru a folosi `craco test` și pretest copy-shared-constants.
- Re-exportat `enums` din `shared-constants/index.ts` și aliniat importurile (`@shared-constants`).
- Actualizat fișiere (`App.tsx`, `transactionFormStore.ts`, teste) pentru a importa din `@shared-constants`.
- Protejat apelurile DI din `App.tsx` (`setTransactionService`, `setRefreshCallback`) prin verificarea tipului.
- Extins mock-urile din `App.test.tsx` pentru noile metode ale store-ului.
