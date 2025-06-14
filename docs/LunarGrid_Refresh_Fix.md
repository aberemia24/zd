# LunarGrid – Refresh/Flicker Fix Guide

> Ultima actualizare: 2025-06-14

## 🔍 Problema

1. După salvarea unei tranzacții (create/update/delete) grila LunarGrid intra în **„Se încarcă…”** și toate categoriile expandate se colapsau.
2. Valoarea editată apărea abia după refresh de pagină.
3. Comportamentul revenea periodic după refactorizări ⟶ regresie frecventă.

### Cauză principală

- **Invalidare globală** a query-ului React-Query `transactions.monthly(...)` imediat după fiecare mutație:

  ```ts
  queryClient.invalidateQueries({ queryKey: ["transactions", year, month] });
  ```

  – declanșa refetch → hook-urile setează `isFetching=true` → GridTable afișa overlay.

- Lipsă **optimistic update complet** pentru array-ul monthly ⇒ valoarea nouă nu era în cache până la refetch.

## 🛠️ Fix implementat (2025-06-14)

1. **Eliminare invalidare globală** în `handleSaveTransaction` ( `frontend/src/components/features/LunarGrid/hooks/useTransactionOperations.tsx` ).
2. **Patch local de cache** după mutație:
   ```ts
   const monthlyKey = queryKeys.transactions.monthly(year, month, userId);
   queryClient.setQueryData(monthlyKey, (prev: any) => {
     if (!prev) return prev;
     // update
   });
   ```
   – Pentru `update` → modifică obiectul existent
   – Pentru `create` → adaugă tranzacția optimistă la începutul array-ului
3. **Stabilizare query** în `useMonthlyTransactions` (apel din `LunarGridStateManager`)
   ```ts
   staleTime: 5 * 60 * 1000,
   refetchOnWindowFocus: false,
   refetchOnMount: false,
   ```
   – Evită refetch automat & overlay, dar păstrează datele proaspete manual când e nevoie.
4. **Confirmare UX**: după Save
   - Valoarea se actualizează imediat în Grid, grafice și liste.
   - Niciun flicker, categoriile rămân expandate.

## ✅ Cum verifici dacă fixul e încă valid

1. `pf dev` → editează o celulă.
2. Observă: gridul NU intră în "Se încarcă…".
3. Valoarea nouă apare instant.
4. Console: nu există `invalidateQueries` legat de key `transactions.monthly`.

## 🧩 Best-Practices pentru a preveni regresia

| Recomandare                                                | Detalii                                                                    |
| ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1. **Evitați `invalidateQueries` globale**                 | Folosiți optimistic update sau `queryClient.setQueryData` targetat.        |
| 2. **Setați `staleTime` rezonabil**                        | Pentru scenariu single-user 5-10 min este suficient; evită refetch inutil. |
| 3. **Nu activați `refetchOnWindowFocus`** pe griduri mari  | Previne overlay-uri neașteptate când utilizatorul revine în tab.           |
| 4. **Mențineți `includeAdjacentDays` doar dacă e necesar** | Reduce datele încărcate și timpii de re-randare.                           |
| 5. **Documentați orice mutație nouă**                      | Asigurați‐vă că actualizează explicit cache-ul local fără a forța refetch. |

## 🚑 Procedură rapidă de debug

1. Editați o tranzacție – dacă overlay apare, căutați `invalidateQueries`/`refetch` în mutații.
2. Verificați `Network` tab: dacă vedeți apel `GET /rpc/fetch_transactions` imediat după mutație → se face refetch.
3. Soluție: scoateți `invalidateQueries` și adăugați `queryClient.setQueryData`.

## 🧪 Teste pentru prevenirea regresiei

Am implementat teste automate pentru a detecta revenirea problemei:

### 1. Test unit pe hook (`useTransactionOperations.test.tsx`)

- **Locație**: `frontend/src/components/features/LunarGrid/hooks/__tests__/useTransactionOperations.test.tsx`
- **Verifică**: Cache-ul monthly se patch-uiește local după `handleSaveTransaction`
- **Rulare**: `cd frontend && pnpm run test:lunargrid-refresh`

### 2. Test integrare RTL (`LunarGridIntegrationRefresh.test.tsx`)

- **Locație**: `frontend/src/components/features/LunarGrid/hooks/__tests__/LunarGridIntegrationRefresh.test.tsx`
- **Verifică**: UI se actualizează instant fără refetch/flicker
- **Rulare**: `cd frontend && pnpm run test:lunargrid-refresh`

### Script dedicat

```bash
# Rulează doar testele de refresh (evită alte failure-uri din frontend)
pnpm run test:lunargrid-refresh
```

### Când să rulezi testele

- Înainte de orice modificare în:
  - `useTransactionOperations.tsx`
  - `transactionMutations.tsx`
  - `useMonthlyTransactions.tsx`
  - `LunarGridStateManager.tsx`
- În pipeline CI/CD pe PR-uri care afectează LunarGrid
- Periodic pentru a detecta regresii introduse indirect

### Interpretarea rezultatelor

- ✅ **Teste trec**: Optimistic update funcționează, nu există refresh
- ❌ **Teste pică**: Regresie detectată → verifică `invalidateQueries` în mutații

---

> **Motto**: _"Optimistic update first, refetch only when necessary."_
