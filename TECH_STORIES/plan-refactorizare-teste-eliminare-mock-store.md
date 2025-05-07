# Plan de Refactorizare pentru Teste – Eliminarea Mock-urilor de Store

## Principiul de bază
Vom păstra regula din BEST_PRACTICES: mock doar pentru servicii externe (Supabase, fetch, time, random, API-uri browser), fără mock-uri pentru store-urile Zustand.

---

## Fișiere afectate și prioritizare

### Prioritatea 1: Fișiere de Utilitate și Mock-uri Comune
- **frontend/src/test-utils.ts** – Adăugare funcții pentru resetarea store-urilor reale
- **frontend/src/jest-mocks.ts** – Eliminare funcții de configurare mock store, păstrare doar mock-uri pentru servicii externe

### Prioritatea 2: Teste pentru Store-uri
- **frontend/src/stores/transactionFormStore.test.ts** – Înlocuire mock-uri cu manipulare directă store
- **frontend/src/stores/transactionFiltersStore.test.ts** – Înlocuire asserțiuni pentru valorile directe din store (nu mock)
- **frontend/src/stores/authStore.test.ts** – Înlocuire mock-uri servicii cu jest.spyOn și verificare stare reală

### Prioritatea 3: Teste Componente Simple
- **frontend/src/components/features/TransactionFilters/TransactionFilters.test.tsx** – Înlocuire referințe la mock store
- **frontend/src/components/primitives/*** – Verificare dacă există vreo componentă primitivă care folosește mock stores

### Prioritatea 4: Teste Componente Complexe
- **frontend/src/components/features/TransactionForm/TransactionForm.test.tsx** – Utilizare directă store real
- **frontend/src/components/features/TransactionTable/TransactionTable.test.tsx** – Utilizare directă store real
- **frontend/src/App.test.tsx** – Cel mai complex, integrarea tuturor store-urilor reale

### Prioritatea 5: Curățare Finală
- **frontend/src/__mocks__/stores/transactionFormStore.ts** – Eliminare completă
- **frontend/src/__mocks__/stores/transactionStore.ts** – Eliminare completă
- **frontend/src/__mocks__/stores/authStore.ts** – Eliminare completă

---

## Sfaturi pentru Implementare

### 1. Pattern resetare store la începutul testelor
```typescript
beforeEach(() => {
  // Resetarea tuturor store-urilor folosite în teste
  act(() => {
    useTransactionStore.getState().reset();
    useTransactionFormStore.getState().resetForm();
    useAuthStore.getState().reset?.() || useAuthStore.setState({ user: null, loading: false, error: null });
    useTransactionFiltersStore.getState().resetFilters();
  });
});
```

### 2. Pattern pentru configurarea stării inițiale
```typescript
it('testează un comportament specific', async () => {
  // ARRANGE - Configurare stare inițială directă în store
  act(() => {
    useTransactionStore.getState().setTransactions([mockTransaction]);
    useTransactionFormStore.getState().setField('amount', '100');
  });
  
  // ACT - Randare componentă
  render(<ComponentaTestată />);
  
  // ASSERT - Verificare UI și reacții
  expect(screen.getByText('100')).toBeInTheDocument();
});
```

### 3. Pattern pentru mock servicii externe (păstrează-l)
```typescript
jest.mock('../services/supabaseService', () => ({
  supabaseService: {
    fetchTransactions: jest.fn().mockResolvedValue({ data: [], count: 0 }),
    createTransaction: jest.fn().mockResolvedValue({ id: 'mock-id' }),
  }
}));

// Plus spion pentru verificare apel
const fetchSpy = jest.spyOn(supabaseService, 'fetchTransactions');
```

### 4. Pattern pentru verificarea efectelor laterale
```typescript
it('actualizează store-ul când se face submit', async () => {
  // Setup componentă
  render(<TransactionForm />);
  
  // Acțiune utilizator
  fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '200' } });
  fireEvent.submit(screen.getByTestId('transaction-form'));
  
  // Așteptăm procesarea asincronă
  await waitFor(() => {
    // Verificăm starea store-ului direct
    expect(useTransactionFormStore.getState().form.amount).toBe('');  // resetat după submit
    expect(supabaseService.createTransaction).toHaveBeenCalled();
  });
});
```

### 5. Izolarea testelor prin resetare explicită
```typescript
afterEach(() => {
  // Resetare după fiecare test pentru a preveni "contaminarea" între teste
  act(() => {
    useTransactionStore.getState().reset();
    useTransactionFormStore.getState().resetForm();
  });
});
```

---

## Sfaturi suplimentare
- **Actualizare graduală** – Începe cu un singur fișier, asigură-te că testele sunt stabile, apoi continuă.
- **Verifică ID-uri test** – Fii atent la data-testid și asigură-te că selectezi elementele corecte.
- **Tranzacțiile asincrone** – Folosește await act() și waitFor() pentru a gestiona operațiile asincrone cu store-urile reale.
- **Refolosește mock-uri servicii externe** – Continuă să folosești mock-uri bune pentru Supabase, date și alte servicii externe.
- **Actualizează DEV_LOG.md** – Adaugă o intrare despre această schimbare și lecțiile învățate.

---

Această abordare va rezulta într-un set de teste mai robust, mai ușor de întreținut și mai aproape de comportamentul real al aplicației.
