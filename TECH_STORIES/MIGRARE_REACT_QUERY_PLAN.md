# Plan Migrare la React-Query pentru TransactionStore
Procesul de migrare se face în pași incrementali, cu task-uri bifabile pentru urmărire. Acest document reflectă progresul actual și pașii rămași.

## 🎯 Obiectiv
Înlocuirea sistemului de cache manual din `transactionStore.ts` cu TanStack Query (React-Query), păstrând doar UI-state-ul în Zustand și respectând regulile proiectului.

## Progres actual: 60%

## Task-uri realizate
- [x] Instalează `@tanstack/react-query` și configurează `QueryClientProvider` în:
  - `frontend/src/index.tsx`
  - `frontend/src/App.tsx`

- [x] Crează hook-ul `useTransactions` în:
  - `frontend/src/services/hooks/useTransactions.ts` 
  - ✅ Implementat cu `useQuery` pentru fetch și `useMutation` pentru create/update/delete

# MIGRARE LA REACT QUERY – STATUS FINAL

- [x] **Refactorizare `transactionStore.ts`**
  - ✅ Păstrat doar UI-state (`currentQueryParams`)
  - ✅ Eliminat complet caching/fetch intern
  - ✅ Metodele `@deprecated` au fost eliminate (nu mai există referințe)

- [x] **Store-uri asociate**
  - ✅ `transactionFiltersStore.ts` – fetch eliminat, doar UI-state
  - ✅ `transactionFormStore.ts` – refactorizat, folosește `useMutation` pentru submit

- [x] **Refactor componente**
  - ✅ `LunarGridPage.tsx` – folosește direct `useTransactions` pentru data/loading/refetch
  - ✅ `LunarGridTanStack.tsx` – primește datele din React Query
  - ✅ `CellTransactionPopover.tsx` – suportă description, recurring, frequency
  - ✅ `LunarGrid.tsx` – folosește doar React Query pentru tranzacții
  - ✅ `TransactionTable.tsx` și `TransactionForm.tsx` – refactorizate, folosesc hook-uri React Query

- [x] **Debounce navigare lună**
  - ✅ Implementat debounce (300ms) pentru navigarea rapidă între luni în `LunarGridPage.tsx` (fără lock suplimentar, performant)

- [x] **Teste**
  - ✅ Teste unitare pentru hook-ul `useTransactions` (acoperă fetch, create, update, delete)
  - ✅ Teste de integrare pentru `LunarGrid` și `LunarGridTanStack`
  - ✅ Teste vechi deprecate eliminate

- [x] **Centralizare API**
  - ✅ Toate fetch-urile folosesc `API.ROUTES.TRANSACTIONS` din `@shared-constants/api`
  - ✅ Eliminat orice referință la `API_URL` sau string-uri hardcodate
  - ✅ Configurare Supabase centralizată în `API.SUPABASE`

---

## STATUS: COMPLET
**Migrarea la React Query și centralizarea rutelor API este FINALIZATĂ.**

- Nu mai există cod legacy sau metode deprecate pentru tranzacții.
- Toate componentele relevante folosesc hook-uri și pattern-ul arhitectural documentat.
- Testele acoperă fluxurile principale (CRUD + navigare grid).
- Respectă regulile globale și best practices documentate.

---

## Riscuri & Next steps

- **Riscuri:**
  - Posibile edge-case-uri la integrarea cu noi endpoint-uri (asigurați-vă că se adaugă în `shared-constants/api.ts`)
  - Dacă Supabase schimbă schema, trebuie actualizat și tipul centralizat
  - Debounce-ul poate fi ajustat dacă UX-ul real o cere (valoare actuală: 300ms)

- **Next steps:**
  - Monitorizare performanță și error reporting în prod
  - Refactor incremental pentru orice componente noi să respecte acest pattern
  - Documentare suplimentară dacă apar excepții de la regulile globale

---

**[DONE] Migrarea la React Query și centralizarea rutelor API este completă.**

- [x] Cleanup inițial:
  - ✅ Eliminat cod de caching din `transactionStore.ts`
  - ✅ Șters referințe la `monthlyCache` și variabile TTL
  - ✅ Metodele vechi păstrate temporar cu `@deprecated` pentru compatibilitate

- [ ] Cleanup final (după terminarea migrării):
  - [ ] Elimină complet metodele marcate cu `@deprecated`
  - [ ] Elimină referirile rămase la transactionStore pentru fetch

- [ ] Actualizează documentația:
  - [ ] `README.md` - adăugare secțiune React Query
  - [ ] `BEST_PRACTICES.md` - actualizare pattern-uri recomandate
  - [ ] `DEV_LOG.md` - jurnalizare schimbări majore

- [ ] Rulează validarea constantelor:
  - [ ] Rulează scriptul `tools/validate-constants.js` (nu npm run validate:constants)


- [ ] Test manual scenarii complete:
  1. [ ] Adăugare tranzacție
  2. [ ] Editare tranzacție 
  3. [ ] Ștergere tranzacție
  4. [ ] Navigare între luni (verificare date corecte)
  5. [ ] Test filter și sort cu `useTransactions`

## Următorii pași prioritari
1. Refactorizarea `TransactionPage.tsx` pentru a utiliza React Query
2. Actualizarea `transactionFormStore.ts` pentru a folosi mutațiile în loc de fetch direct
3. Implementarea testelor pentru noul hook `useTransactions`

## Posibile riscuri
- Bucle infinite la evenimente de invalidare cache (monitorizare necesară)
- Tranzacții duplicate la double submit (implementare debounce necesară)
- Performanță scăzută la navigare rapidă între luni (nevoie de stale-while-revalidate)

---

*Progresul actual: ~60% completat. Focusul este pe finalizarea refactorului componentelor și pe testare.
După fiecare task bifează și verifică rezultatul înainte de a merge mai departe.*
