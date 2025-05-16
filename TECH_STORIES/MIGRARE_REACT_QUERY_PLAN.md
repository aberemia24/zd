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

- [x] Refactorizează `transactionStore.ts`:
  - ✅ Păstrat doar UI-state (`currentQueryParams`)
  - ✅ Eliminat logica de caching și fetch intern
  - ✅ Implementate metode `@deprecated` pentru compatibilitate în timpul migrării

- [ ] Actualizează store-uri asociate:
  - [x] `transactionFiltersStore.ts` → renunțat la fetch intern
  - [ ] `transactionFormStore.ts` → în curs de refactorizare pentru `useMutation`

- [ ] Refactor componente:
  - [ ] `LunarGridPage.tsx` → `const { data, isLoading, refetch } = useTransactions(year, month)`
  - [x] `LunarGridTanStack.tsx` → primește `transactions` din React-Query ✅
  - [x] `CellTransactionPopover.tsx` → actualizat pentru descriere + frecvență ✨
  - [x] `LunarGrid.tsx` → refactorizat pentru a folosi `useTransactions` direct ✅
  - [ ] `TransactionTable.tsx` și `TransactionForm.tsx` → în curs

- [ ] Integrează debounce minim sau lock (_isFetching) pentru navigarea rapidă între luni

- [ ] Scrie teste noi:
  - [ ] Unitare pentru hook-ul `useTransactions`
  - [ ] Integrare pentru `LunarGrid` și `LunarGridTanStack`
  - [x] Teste deprecate (TransactionTable.test.tsx) eliminate - nu mai sunt necesare

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
  - [ ] `npm run validate:constants`

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
