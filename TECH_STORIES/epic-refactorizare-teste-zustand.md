# Epic: Refactorizare Teste Zustand – Eliminare Mock-uri Store

**Status general:** IN PROGRESS  
**Owner:** Echipa testare / QA  
**Start:** 2025-05-07

---

## Checklist taskuri concrete

- [x] **Task 1:** Cleanup și actualizare test-utils + jest-mocks [DONE 2025-05-07]
    - Actualizare `frontend/src/test-utils.ts` cu funcții de reset store real
    - Actualizare `frontend/src/jest-mocks.ts` – eliminare mock-uri store, păstrare doar mock-uri servicii externe
- [x] **Task 2:** Refactorizare `transactionFormStore.test.ts` pentru store real [DONE 2025-05-07]
- [x] **Task 3:** Refactorizare `transactionFiltersStore.test.ts` pentru store real [DONE 2025-05-07]
- [x] **Task 4:** Refactorizare `authStore.test.ts` pentru store real și mock doar servicii externe [DONE 2025-05-07]
- [x] **Task 5:** Refactorizare `TransactionFilters.test.tsx` pentru store real [DONE 2025-05-07]
    - Confirmat separarea corectă între teste unitare și de integrare pentru TransactionFilters.
    - Testele de integrare au fost restaurate și rulează cu succes (8/8 passed).
    - Structura respectă regulile globale și best practices (mock doar pentru servicii externe, store real folosit doar în integrare).
    - Nu există dubluri între fișierele de test, setup/reset corect implementat.
    - Status: validat manual și automat, task complet finalizat.
- [x] **Task 6:** Verificare și refactorizare componente primitive (doar dacă e cazul) [DONE 2025-05-07]
    - Toate testele pentru primitive respectă regulile globale, nu folosesc store-uri, nu necesită refactorizare suplimentară.
- [x] **Task 7:** Refactorizare `TransactionForm.test.tsx` pentru store real ([DONE 2025-05-07])
    - Testele folosesc store-ul real Zustand, mock doar pentru servicii externe, granularizare pe câmpuri și scenarii complete, totul conform regulilor globale. Validat manual și automat.
- [x] **Task 8:** Refactorizare `TransactionTable.test.tsx` pentru store real ([DONE 2025-05-07])
    - Testele folosesc store real Zustand, mock doar pentru servicii externe, acoperire edge-case-uri, validare manuală și automată, totul conform regulilor globale și best practices.
- [x] **Task 9:** Refactorizare `App.test.tsx` pentru integrare store-uri reale ([DONE 2025-05-07])
    - Testele folosesc store-uri reale, mock doar pentru servicii externe, acoperire fluxuri de integrare, validare manuală și automată, respectă regulile globale și best practices.
- [x] **Task 10:** Eliminare efectivă a mock-urilor din `__mocks__/stores/` ([DONE 2025-05-07])
    - Mock-urile pentru store-uri au fost eliminate complet. Testele folosesc doar store-uri reale, fără workaround-uri sau excepții.
    - `frontend/src/__mocks__/stores/transactionFormStore.ts`
    - `frontend/src/__mocks__/stores/transactionStore.ts`
    - `frontend/src/__mocks__/stores/authStore.ts`
- [x] **Task 11:** Cleanup final, actualizare `DEV_LOG.md` și `BEST_PRACTICES.md` cu lecții învățate ([DONE 2025-05-07])
    - Documentația și logul au fost actualizate cu lecțiile învățate, nu există workaround-uri sau excepții rămase. Codul și testele respectă toate regulile globale.

---

## Notițe & reguli
- Fiecare task poate fi marcat `[IN PROGRESS]`, `[BLOCKED]`, `[DONE]`.
- Adaugă lecții învățate și workaround-uri la finalul fiecărui task.
- Updatează progresul incremental după fiecare PR/commit major.
- Respectă regula: mock doar pentru servicii externe, nu stores Zustand.

---

**Ultima actualizare:** 2025-05-07 12:19


## Sfaturi concrete de implementare pe task

### Task 1: Cleanup și actualizare test-utils + jest-mocks
- Creează funcții helper dedicate precum `resetAllStores()` și `setupTestUser()`
- Păstrează funcționalitatea bună pentru mockarea serviciilor externe (Supabase, date, random, browser APIs)

### Task 2-4: Refactorizare teste store
- Folosește `act()` pentru toate modificările de state
- Izolează testele cu `beforeEach` și `afterEach` pentru resetare completă

### Task 5-9: Refactorizare teste componente
- Nu modifica ID-urile de test (`data-testid`) pentru a evita ruperi masive
- Folosește `waitFor()` pentru operațiuni asincrone
- Verifică direct state-ul store-ului după interacțiuni utilizator

### Task 10: Eliminare mock-uri
- Fă acest pas doar după ce toate celelalte teste funcționează
- Verifică dacă există importuri rămase în alte fișiere (cleanup total)

### Task 11: Cleanup final
- Asigură-te că toate lecțiile învățate sunt documentate în `DEV_LOG.md` și `BEST_PRACTICES.md`

---

## Modele de cod pentru implementare

### 1. Reset store-uri în beforeEach
```typescript
beforeEach(() => {
  jest.clearAllMocks(); // Pentru mock-uri de servicii externe
  
  // Resetează toate store-urile folosind act()
  act(() => {
    // Reset direct pentru store-uri cu metode dedicate
    useTransactionStore.getState().reset();
    useTransactionFormStore.getState().resetForm();
    useTransactionFiltersStore.getState().resetFilters();
    
    // Pentru store-uri fără metode de reset dedicate
    useAuthStore.setState({
      user: null,
      loading: false, 
      error: null,
      errorType: undefined
    });
  });
});
```

### 2. Verificare efecte laterale ale interacțiunilor
```typescript
// Interacțiune utilizator
fireEvent.click(screen.getByTestId('add-button'));

// Verifică starea store-ului direct
await waitFor(() => {
  const state = useTransactionStore.getState();
  expect(state.transactions.length).toBe(1);
  expect(state.loading).toBe(false);
});
```

---

Planul tău este foarte bine structurat și cu aceste sfaturi suplimentare va duce la o implementare de succes!
