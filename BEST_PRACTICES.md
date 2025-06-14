# Bune Practici și Convenții - Proiect Budget App

## Convenții Generale

- Orice modificare la constants/ui.ts, messages.ts, enums trebuie anunțată în code review și actualizată în barrel (`constants/index.ts`).
- Fiecare sursă de adevăr (constants, enums, messages) are un owner responsabil și orice modificare trebuie documentată și notificată echipei.
- Importurile pentru constants se fac doar din barrel (`constants/index.ts`), nu direct din fișiere individuale.
- Hooks custom legacy pentru tranzacții au fost eliminate, se folosește doar Zustand pentru state management tranzacții.
- Testele pentru recurență și validare form sunt obligatorii și trebuie să acopere edge cases.
- Evitați side effects în hooks precum useMemo/useCallback - acestea trebuie să contă doar calcule pure.
- Utilizați pattern-ul de memorare/cache pentru calcule intensive sau repetitive.

- Limbă: Tot proiectul este exclusiv în limba română.
- **Test Strategy**: 
  - **Pentru bug-uri**: TDD obligatoriu (test-first)
  - **Pentru features noi**: Test-Informed Development (implementare rapidă + teste imediat după)
  - **Pentru refactoring**: Tests-first pentru comportament existent
- Commit-uri: Mesaje frecvente, atomice, descriptive.
- Branching: Dezvoltare pe branch-uri de feature; `main` doar pentru cod stabil.
- PR-uri: Obligatorii pentru orice integrare.
- Documentație: Actualizare continuă a `README.md`, `BEST_PRACTICES.md`, `DEV_LOG.md`.
- Refactorizare: Incrementală, cu acoperire de teste.
- Fără Breaking Changes fără documentare și consens.

## Convenții pentru imports [ACTUALIZAT 2025-05-22]

### Organizare imports

Toate importurile trebuie să urmeze următoarea structură:

```typescript
// 1. Librării externe
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 2. Constante și shared
import { MESSAGES, TRANSACTION_TYPES } from '@budget-app/shared-constants';

// 3. Componente și hooks
import { Button } from 'components/primitives';
import { TransactionForm } from 'components/features';
import { useTransactionStore } from 'stores';

// 4. Servicii
import { transactionService } from 'services';

// 5. Utilitare și tipuri
import { formatCurrency, groupByCategory } from 'utils';
import type { Transaction, TransactionFilters } from 'types';
```

### Imports pentru constants partajate (Modernizat cu pnpm Workspaces)

- **Sursă unică de adevăr**: Pachetul `@budget-app/shared-constants` din folderul `shared-constants/`.
- **Import direct**: Se importă direct din `@budget-app/shared-constants`, la fel ca orice alt pachet din `node_modules`.
  ```typescript
  import { UI, MESAJE } from '@budget-app/shared-constants';
  ```
- **Fără Path Mapping Manual**: Nu mai este necesară nicio configurare de `alias` sau `paths` în `tsconfig.json`, `vite.config.ts`, sau `jest.config.js`. `pnpm` și TypeScript gestionează acest lucru automat.
- **Validare implicită**: Structura de workspace și verificarea tipurilor de către TypeScript asigură că importurile sunt corecte. Nu mai sunt necesare scripturi separate de validare.

### [2025-04-25] Importuri pentru constants locale: barrel & portabilitate

**Regulă:** Pentru orice cod partajat între runtime și test (mai ales constants folosite în stores/hooks/teste), folosește importuri din barrel (`index.ts`) cu cale relativă scurtă, nu import direct din fișier sau cu path mapping custom.

**Exemplu corect:**
```typescript
// În orice fișier din src/stores sau src/hooks
import { INITIAL_FORM_STATE, MESAJE } from '../constants';
```

**De ce?**
- Barrel-ul (`constants/index.ts`) re-exportă TOATE constantele relevante, deci importul e robust la schimbări de structură.
- TypeScript și Jest rezolvă corect modulele fără configurări suplimentare sau mapping custom.
- Evită probleme de rezoluție la runtime și la testare, indiferent de OS sau context.

**Atenție:**
- Actualizează barrel-ul dacă adaugi/ștergi constante!
- Nu folosi importuri absolute sau path mapping custom pentru constants (ex: `@constants/xyz`) decât dacă ai nevoie de compatibilitate cu unelte externe sau monorepo.

## Pattern hooks tranzacții: React Query + Zustand [ACTUALIZAT 2025-05-22]### Arhitectură hooks specializate- Pentru tranzacții, folosim două hooks specializate combinate cu Zustand:  - `useMonthlyTransactions` (bulk, pentru grid lunar)  - `useInfiniteTransactions` (infinite loading, pentru tabel)  - `useTransactionMutations` (mutații create/update/delete)  - `useTransactionStore` (state global UI și cache-invalidare)- Cheia de cache React Query este structurată ierarhic pentru invalidare eficientă:  ```typescript  // Cheie primară partajată în transactionMutations.ts  const TRANSACTIONS_BASE_KEY = ['transactions'] as const;    // Chei derivate pentru queries specifice  const monthlyQueryKey = queryKeys.transactions.monthly(year, month, userId);  const infiniteQueryKey = [...TRANSACTIONS_BASE_KEY, 'infinite', userId, queryParams];  ```- La operațiuni de modificare (create/update/delete), invalidăm întregul cache 'transactions':  ```typescript  // În mutații  const queryClient = useQueryClient();  queryClient.invalidateQueries({ queryKey: ['transactions'] });  ```- **Pattern validat în cod**: hooks implementate conform documentației cu:  - Separare clară între bulk loading (`useMonthlyTransactions`) și infinite loading (`useInfiniteTransactions`)  - Cache partajat prin `TRANSACTIONS_BASE_KEY` pentru invalidare eficientă  - Utilizarea `queryKeys` din `reactQueryUtils.ts` pentru consistență

### Separarea responsabilităților

- Hooks specializate au responsabilități clare și nu trebuie să conțină logică duplicată:
  - Hooks de **citire**: `useMonthlyTransactions`, `useInfiniteTransactions` - doar pentru fetch și caching
  - Hooks de **modificare**: `useTransactionMutations` - pentru create/update/delete
  - **Zustand store**: `useTransactionStore` - pentru state UI (filtre, selecții, etc.)

- Exemplu corect:
  ```typescript
  // Hook specializat pentru tranzacții lunare
  export function useMonthlyTransactions({ year, month }: MonthlyParams) {
    const queryKey = ['transactions', 'monthly', { year, month }];
    
    return useQuery({
      queryKey,
      queryFn: () => transactionService.getMonthlyTransactions(year, month),
      staleTime: 5 * 60 * 1000, // 5 minute cache
    });
  }
  
  // Hook specializat pentru mutații
  export function useTransactionMutations() {
    const queryClient = useQueryClient();
    
    return {
      create: useMutation({
        mutationFn: (data: TransactionInput) => transactionService.createTransaction(data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
      }),
      // similar pentru update și delete
    };
  }
  ```

### Pattern pentru infinite loading [ACTUALIZAT 2025-05-22]Pentru tranzacții infinite, folosim pattern-ul implementat în `useInfiniteTransactions`:```typescript// Pattern implementat cu configurări avansate și optimizăriexport function useInfiniteTransactions(queryParams: TransactionQueryParams) {  const TRANSACTIONS_BASE_KEY = ['transactions'] as const;  const queryKey = [...TRANSACTIONS_BASE_KEY, 'infinite', userId, queryParams];    return useInfiniteQuery({    queryKey,    initialPageParam: 0,    queryFn: async ({ pageParam }) => {      const pagination = {        limit: PAGE_SIZE,        offset: pageParam as number,        sort: queryParams.sort,        order: queryParams.order,      };            return await supabaseService.fetchTransactions(userId, pagination, filters);    },    getNextPageParam: (lastPage, allPages) => {      const currentOffset = allPages.length * PAGE_SIZE;            if (lastPage.data.length < PAGE_SIZE || currentOffset >= lastPage.count) {        return undefined;      }            return currentOffset;    },    // Configurări avansate pentru UX    gcTime: 5 * 60 * 1000,    staleTime: 30 * 1000,    enabled: !!userId,  });}// Pattern procesare date cu useMemo pentru compatibilitateconst processedTransactions = useMemo(() => {  const allTransactions = infiniteQuery.data?.pages.flatMap(page => page.data) || [];    return allTransactions.map(transaction => {    // Normalizare userId și id pentru compatibilitate    if (!transaction.userId && userId) {      transaction.userId = userId;    }        return transaction;  });}, [infiniteQuery.data, userId]);```

## Testing [ACTUALIZAT 2025-05-22]

### Practici React & Testing Library

#### Pattern robust pentru testare componente

- **Testare completă bazată pe comportament**: Testează interacțiunile utilizatorului și rezultatele acestora, nu implementarea internă
- **Organizare teste**:
  ```typescript
  describe('ComponentName', () => {
    // Setup comun
    beforeEach(() => {
      // Mockuri, setup inițial comun
    });
    
    describe('inițializare', () => {
      it('se renderează fără erori', () => {...});
      it('afișează valorile inițiale corect', () => {...});
    });
    
    describe('interacțiuni', () => {
      it('actualizează state la click', () => {...});
      it('gestionează submit-ul formularului', () => {...});
    });
    
    describe('cazuri de eroare', () => {
      it('afișează mesajul de eroare corect', () => {...});
    });
  });
  ```

- **User Event în loc de fireEvent**: Pentru interacțiuni apropiate de comportamentul utilizatorului
  ```typescript
  // Mai puțin preferabil
  fireEvent.click(button);
  
  // Recomandat
  await userEvent.click(button);
  ```

### Pattern useThemeEffects și componentMap [NOU 2025-05-22]### Hook-ul useThemeEffects pentru efecte vizuale uniforme- **Sursă unică pentru efecte vizuale**: Toate componentele folosesc `useThemeEffects` pentru aplicarea consistentă a efectelor- **Pattern implementat în cod**:  ```typescript  import { useThemeEffects } from 'hooks/useThemeEffects';    // În componente  const { getClasses, hasEffect, applyVariant, applyEffect } = useThemeEffects({    withShadow: true,    withGradient: isHighlighted,    withFadeIn: isVisible  });    // Aplicare efecte  <button className={getClasses('button', 'primary', 'md')}>    {hasEffect('withGradient') && <GradientOverlay />}    Buton cu efecte  </button>  ```- **Efecte disponibile validate**:  - `withShadow`: aplică `shadow-glow`  - `withGradient`: aplică `gradient-text`  - `withFadeIn`: aplică `fadeIn`  - `withSlideIn`: aplică `slideIn`  - `withPulse`: aplică `pulse-animation`  - `withGlow`: aplică `badge-glow`  - `withHoverEffect`: aplică `hover-scale`### Sistemul componentMap pentru stilizare centralizată- **Organizare pe tipuri**: Fiecare tip de componentă are propriul fișier în `styles/componentMap/`- **Structură standardizată**:  ```typescript  // În styles/componentMap/button.ts  export const buttonConfig = {    base: 'px-4 py-2 rounded font-medium transition-all duration-200',    variants: {      primary: 'bg-blue-600 text-white hover:bg-blue-700',      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'    },    sizes: {      sm: 'px-3 py-1 text-sm',      md: 'px-4 py-2 text-base',      lg: 'px-6 py-3 text-lg'    }  };  ```- **Integrare cu getEnhancedComponentClasses**: componentMap servește ca sursă pentru `getEnhancedComponentClasses`- **Extensibilitate**: Adăugarea de noi efecte sau variante se face în componentMap, nu prin clase hardcodate### Pattern UI pentru grid-uri cu subcategorii [ACTUALIZAT 2025-05-22]- **Butoane de acțiune (edit/delete) vizibile doar la hover**: Reduce aglomerarea vizuală și crește focusul pe acțiuni relevante.- **Inputuri de redenumire pre-populate**: La editarea inline a subcategoriilor, inputul trebuie să afișeze valoarea originală pentru UX predictibil.- **Separarea stărilor pentru moduri conflictuale**: Folosește state separat pentru editare și ștergere (ex: `editingSubcat`, `deletingSubcat`). Nu modifica state direct în timpul render-ului; folosește `useEffect` pentru tranziții.- **Referință anti-pattern Zustand**: Nu folosi `useEffect(fetch, [queryParams])` cu Zustand (vezi regula critică și memoria d7b6eb4b-0702-4b0a-b074-3915547a2544).- **Virtualizare pentru tabele mari**: Utilizați TanStack Virtual pentru a renderiza doar elementele vizibile în viewport (implementat în LunarGrid).- **Testare robustă**: Toate elementele funcționale din grid trebuie să aibă `data-testid` unic și predictibil pentru testare automată.

**Exemplu:**

```tsx
// Vizibilitate acțiuni doar la hover
<div className="subcategory-row" onMouseEnter={...} onMouseLeave={...}>
  <span>{subcategory.name}</span>
  {isHovered && (
    <>
      <button data-testid={`edit-btn-${subcategory.id}`}>Edit</button>
      <button data-testid={`delete-btn-${subcategory.id}`}>Delete</button>
    </>
  )}
</div>

// Input redenumire pre-populat
<input data-testid="rename-input" value={currentName} ... />
```

#### Organizare teste: Hibrid colocate + separate [ACTUALIZAT 2025-05-22]

**Structură recomandată pentru solo developer cu AI assistance:**
```
frontend/src/components/
├── primitives/Button/
│   ├── Button.tsx
│   └── Button.test.tsx         # Unit tests COLOCATE pentru acces rapid
├── features/TransactionForm/
│   ├── TransactionForm.tsx  
│   └── TransactionForm.test.tsx # Component tests COLOCATE
│   
frontend/tests/
├── integration/                # Integration tests SEPARATE
│   ├── features/
│   │   ├── lunar-grid/
│   │   └── transactions/
│   └── setup/
└── e2e/                       # E2E tests SEPARATE
```

**Strategy pentru implementări noi (adaptată la realitatea solo dev + AI):**
- **Bug fix**: TDD obligatoriu - Test care fail → Fix → Test pass
- **New feature**: Test-Informed Development - Implement rapid → Add tests imediat → Refine together  
- **Refactoring**: Tests first pentru a asigura comportament consistent

**De ce hibrid?**
- Unit tests colocate: Acces rapid în timpul development-ului
- Integration/E2E separate: Logică cross-component, nu aparțin unei componente specifice
- Solo developer friendly: Minimizează context switching

#### Testare robustă cu constants și data-testid [ACTUALIZAT 2025-05-22]

**Pattern validat în cod pentru testare modernă:**- **Obligatoriu**: Toate mesajele UI și sistemului provin din `@budget-app/shared-constants` (messages.ts, ui.ts)- **Obligatoriu**: Toate elementele interactive au `data-testid` unic și predictibil- **Pattern standard**: `{component}-{element}-{id?}` pentru data-testid (ex: `transaction-row-123`, `add-btn`, `error-msg`)- **Selecție în teste**: Doar prin `data-testid`, nu prin text, clase sau structură DOM**Exemplu pattern implementat:**```tsx// În componente<Button   data-testid="save-transaction-btn"  onClick={handleSave}>  {UI.BUTTONS.SAVE}</Button><div data-testid="transaction-form-error">  {MESSAGES.ERRORS.INVALID_AMOUNT}</div>// În testeimport { UI, MESSAGES } from '@budget-app/shared-constants';test('salvarea tranzacției funcționează corect', async () => {  render(<TransactionForm />);    // Selecție prin data-testid  const saveBtn = screen.getByTestId('save-transaction-btn');  const errorDiv = screen.queryByTestId('transaction-form-error');    // Verificare text prin constants  expect(saveBtn).toHaveTextContent(UI.BUTTONS.SAVE);  expect(errorDiv).not.toBeInTheDocument();    // Interacțiuni  await userEvent.click(saveBtn);    // Așteptare rezultat asincron  await waitFor(() => {    expect(screen.getByTestId('transaction-form-error'))      .toHaveTextContent(MESSAGES.ERRORS.INVALID_AMOUNT);  });});```**Pattern pentru formulare complexe validat:**```tsx// Verificare valori inițiale cu waitFor pentru stabilitatetest('formularul se inițializează cu valorile corecte', async () => {  render(<TransactionForm initialData={mockTransaction} />);    // Verificare individuală cu waitFor pentru câmpuri complexe  await waitFor(() => {    expect(screen.getByTestId('amount-input')).toHaveValue('100.50');  });    await waitFor(() => {    expect(screen.getByTestId('category-select')).toHaveValue('Food');  });    await waitFor(() => {    expect(screen.getByTestId('date-input')).toHaveValue('2025-05-22');  });});#### Pattern memoizare și optimizare performanță [NOU 2025-05-22]**Pattern implementat în componente pentru performanță optimă:****1. Memoizarea componentelor cu React.memo:**```tsx// Pattern validat în TransactionTable, LunarGrid, CategoryEditorconst TransactionTable = React.memo(({   transactions,   onTransactionClick,   filters }: TransactionTableProps) => {  // Implementare componentă});// Export cu displayName pentru debuggingTransactionTable.displayName = 'TransactionTable';export default TransactionTable;```**2. Memoizarea funcțiilor cu useCallback:**```tsx// Pattern pentru funcții event handlers și callbacksconst handleSaveTransaction = useCallback(async (data: TransactionInput) => {  try {    await transactionService.createTransaction(data);    queryClient.invalidateQueries({ queryKey: ['transactions'] });  } catch (error) {    console.error('Eroare salvare tranzacție:', error);  }}, [queryClient]);// Pattern pentru funcții de procesare dateconst handleFilterTransactions = useCallback((filters: TransactionFilters) => {  // Logică filtrare}, []);```**3. Memoizarea calculelor costisitoare cu useMemo:**```tsx// Pattern pentru procesare date complexeconst processedTransactions = useMemo(() => {  return transactions    .filter(tx => tx.userId === userId)    .map(tx => ({      ...tx,      formattedAmount: formatCurrency(tx.amount),      categoryLabel: getCategoryLabel(tx.category)    }))    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());}, [transactions, userId]);// Pattern pentru chei de grupconst groupedByCategory = useMemo(() => {  return processedTransactions.reduce((acc, transaction) => {    const key = `${transaction.category}|${transaction.subcategory}`;    if (!acc[key]) acc[key] = [];    acc[key].push(transaction);    return acc;  }, {} as Record<string, Transaction[]>);}, [processedTransactions]);```**Reguli de aplicare:**- **React.memo**: Pentru orice componentă care primește props complexe sau se re-renderează frecvent- **useCallback**: Pentru funcții event handlers care se trimit ca props către componente memoizate- **useMemo**: Pentru calcule costisitoare, procesări de arrays mari sau transformări complexe- **Chei unice**: Pentru liste React, combină ID-ul cu index sau alte date pentru unicitate garantată

#### Politica de mocking [ACTUALIZAT]

- Se mock-uiesc **doar** serviciile externe (API/fetch, date/time, random, browser APIs).
- **Nu** se mock-uiesc stores Zustand, hooks custom sau logică proprie.
- Pentru testare cu React Query, folosește `QueryClientProvider` cu un client de test:
  ```typescript
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  const { result } = renderHook(() => useMonthlyTransactions({ year: 2025, month: 5 }), { wrapper });
  ```

- Evită mock-uri inutile care testează implementarea în loc de comportament.
- Exemplu corect pentru testarea unui formular cu React Query și Zustand:
  ```typescript
  // Mock doar serviciul extern
  jest.mock('../services/transactionService', () => ({
    createTransaction: jest.fn().mockResolvedValue({ id: '123', amount: 100 }),
  }));
  
  // NU mock-ui useTransactionStore, folosește-l direct
  
  test('formularul de tranzacție funcționează corect', async () => {
    render(<TransactionForm />);
    
    await userEvent.type(screen.getByTestId('amount-input'), '100');
    await userEvent.selectOptions(screen.getByTestId('category-select'), 'Food');
    await userEvent.click(screen.getByTestId('submit-btn'));
    
    // Verifică că serviciul a fost apelat corect
    expect(transactionService.createTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 100, category: 'Food' })
    );
    
    // Verifică UI după operațiune
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });
  });
  ```

#### Anti-pattern critic: useEffect(fetch, [queryParams]) cu Zustand- Este **interzis** să folosești direct `useEffect(() => fetchTransactions(), [queryParams])` cu Zustand, deoarece duce la infinite loop și Maximum update depth exceeded.- Regula critică este documentată în global_rules.md secțiunea 8.2 și trebuie respectată strict.- Exemplu greșit (NU folosiți!):```tsxuseEffect(() => {  useTransactionStore.getState().fetchTransactions();}, [queryParams]);```- Exemplu corect:```tsxuseEffect(() => {  useTransactionStore.getState().fetchTransactions();}, []); // Doar la mount```- Dacă fetch-ul depinde de parametri, folosește un guard intern/caching în store pentru a preveni buclele.- Orice abatere se documentează explicit în code review și DEV_LOG.md.## React Query Best Practices [NOU 2025-05-22]### Arhitectură recomandată1. **Separare clară a responsabilităților**:   - **Query Hooks**: Pentru fetch și caching (ex: `useTransactions`, `useCategories`)   - **Mutation Hooks**: Pentru operațiuni de modificare (ex: `useTransactionMutations`)   - **Service Layer**: Pentru API calls și transformare date (ex: `transactionService.ts`)2. **Pattern pentru keys structurate**:   ```typescript   // Structură recomandată pentru query keys   const queryKey = [     'entitate',      // Nivel 1: Tipul entității (ex: 'transactions', 'categories')     'operațiune',    // Nivel 2: Tipul operațiunii (ex: 'list', 'detail', 'monthly')     paramsObject     // Nivel 3: Params ca obiect (pentru invalidare selectivă)   ];      // Exemple:   const monthlyKey = ['transactions', 'monthly', { year: 2025, month: 5 }];   const detailKey = ['transactions', 'detail', { id: '123' }];   ```3. **Optimizări importante**:   - **staleTime**: Setați o valoare adecvată pentru a reduce fetch-urile inutile   - **cacheTime**: Cât timp să păstreze datele în cache după ce nu mai sunt folosite   - **refetchOnWindowFocus**: În general, setați la `false` pentru tranzacții   - **keepPreviousData**: Setați la `true` pentru a păstra UI stabil în timpul schimbării filtrelor   ```typescript   export function useMonthlyTransactions(params: MonthlyParams) {     return useQuery({       queryKey: ['transactions', 'monthly', params],       queryFn: () => transactionService.getMonthlyTransactions(params),       staleTime: 5 * 60 * 1000,      // 5 minute       cacheTime: 30 * 60 * 1000,     // 30 minute       refetchOnWindowFocus: false,       keepPreviousData: true,     });   }   ```### Mutations și optimistic updatesPentru o experiență utilizator fluidă, folosiți optimistic updates:```typescriptexport function useAddTransaction() {  const queryClient = useQueryClient();    return useMutation({    mutationFn: (newTransaction: TransactionInput) =>       transactionService.createTransaction(newTransaction),        // Optimistic update    onMutate: async (newTransaction) => {      // 1. Anulăm orice refetch în desfășurare      await queryClient.cancelQueries({ queryKey: ['transactions'] });            // 2. Salvăm starea anterioară      const previousTransactions = queryClient.getQueryData<Transaction[]>(        ['transactions', 'list']      );            // 3. Actualizăm optimist cache-ul      if (previousTransactions) {        queryClient.setQueryData(          ['transactions', 'list'],           [...previousTransactions, { ...newTransaction, id: 'temp-id' }]        );      }            // 4. Returnăm contextul pentru onError      return { previousTransactions };    },        // În caz de eroare, revertim schimbarea    onError: (err, newTransaction, context) => {      if (context?.previousTransactions) {        queryClient.setQueryData(          ['transactions', 'list'],          context.previousTransactions        );      }    },        // După succes, invalidăm pentru a obține datele reale    onSuccess: () => {      queryClient.invalidateQueries({ queryKey: ['transactions'] });    },  });}

#### Motivare

- Aceste reguli asigură testare robustă, mentenanță ușoară, onboarding rapid și QA predictibil.
- Centralizarea mesajelor și constantelor elimină bug-uri și inconsistențe între FE/BE/teste.
- Interzicerea mock-ului pe stores/hooks asigură teste care reflectă comportamentul real al aplicației.
- Respectarea anti-patternului Zustand previne bug-uri greu de diagnosticat și regresii ascunse.

#### Referințe

- [global_rules.md] secțiunea 3, 8.2, 9
- [DEV_LOG.md] pentru schimbări și excepții
- [LESSON] Testare valori inițiale în formulare complexe

### Practici Zustand

#### Prevenirea buclelor infinite în React + Zustand

Pentru a preveni eroarea "Maximum update depth exceeded" în aplicații cu Zustand, următoarele practici sunt esențiale:

1. **Separă setarea parametrilor de fetch-ul de date**:

   ```typescript
   // INCORECT - poate crea buclă infinită
   React.useEffect(() => {
     store.setQueryParams({ month, year });
     store.fetchTransactions(); // Poate declanșa un update care re-declanșează efectul
   }, [month, year, store]);
   
   // CORECT - verifică schimbările reale înainte de a actualiza
   const paramsRef = React.useRef({ month, year });
   React.useEffect(() => {
     if (paramsRef.current.month !== month || paramsRef.current.year !== year) {
       paramsRef.current = { month, year };
       store.setQueryParams({ month, year });
       store.fetchTransactions();
     }
   }, [month, year, store]);
   ```

2. **Evită apelurile directe la store.getState() în efecte**:

   ```typescript
   // INCORECT - poate crea buclă infinită
   setTimeout(() => {
     useStore.getState().setQueryParams({...});
     useStore.getState().fetchTransactions();
   }, 300);
   
   // CORECT - folosește instanta de store din context
   setTimeout(() => {
     transactionStore.refresh(); // Metodă atomică care nu declanșează alte efecte
   }, 300);
   ```

3. **Folosește useRef pentru a evita re-render-uri inutile**:

   ```typescript
   // INCORECT - poate crea buclă infinită
   const [lastUpdate, setLastUpdate] = useState(Date.now());
   // ... în alt efect sau handler
   setLastUpdate(Date.now()); // Poate declanșa re-render care re-declanșează efecte
   
   // CORECT - useRef nu declanșează re-render
   const lastUpdateRef = useRef(Date.now());
   // ... în alt efect sau handler
   lastUpdateRef.current = Date.now(); // Nu declanșează re-render
   ```

4. **Adaugă setTimeout pentru a preveni actualizările în cascadă**:

   ```typescript
   // INCORECT - poate crea buclă infinită dacă refresh() modifică starea
   await transactionStore.saveTransaction(data);
   transactionStore.refresh(); // Poate declanșa un update imediat
   
   // CORECT - întârzie refresh-ul pentru a permite finalizarea update-ului curent
   await transactionStore.saveTransaction(data);
   setTimeout(() => {
     transactionStore.refresh();
   }, 300); // Întârziere mică pentru a preveni actualizările în cascadă
   ```

Aceste practici sunt conforme cu regula critică din memoria d7b6eb4b-0702-4b0a-b074-3915547a2544 și previn bug-urile greu de diagnosticat cauzate de buclele infinite.

#### UX rapid pentru Lunar Grid (Excel-like)

- Implementat conform DEV-5, tranzacțiile pot fi adăugate/editate direct din grid-ul lunar:
  - **Single click** pe celulă: deschide popover cu sumă + recurentă/frecvență
  - **Double click** pe celulă: prompt rapid pentru sumă (editare instantă)
  - **Tastare directă**: cifre tastate merg automat în input, fără a pierde focus (Excel-like)
  - **Keyboard shortcuts**: Enter pentru salvare, Escape pentru anulare
- Best practices obligatorii pentru acest pattern:
  - Forțează refresh cu `transactionStore.refresh()` după operare pentru actualizare instantă
  - Toate textele din `@budget-app/shared-constants/ui.ts` (zero hardcoded strings)
  - Toate date-testid-urile predictibile pentru celule/popover/butoane
  - Validare strictă pentru tipuri: `as TransactionType`, `as FrequencyType`
  - Try/catch pentru operații asincrone cu handling de erori și logging adecvat
  - Preluare automată context (zi, categorie, subcategorie) din celula editată

#### Persistență autentificare cu Zustand + persist

- Pentru orice state de autentificare, folosiți middleware-ul `persist` din Zustand, cu partialize pentru a salva doar datele relevante (ex: user, nu loading/error).
- Verificați sesiunea la pornirea aplicației cu un efect global (`App.tsx` sau entrypoint).
- Exemplu corect:

  ```ts
  export const useAuthStore = create(
    persist(
      (set) => ({ ... }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user }),
      }
    )
  );
  ```

- Nu mock-uiți store-urile Zustand la testare (vezi politica de mocking).
- Orice fetch asincron cu Zustand trebuie să respecte regula anti-pattern (NU folosiți useEffect(fetch, [queryParams]) fără guard intern/caching).
- Sursa unică pentru categorii/subcategorii: doar `shared-constants/categories.ts`, validare la nivel de service și trigger DB.

- Teste pentru inițializare, setters, acțiuni asincrone și selectors.
- Mock-uri izolate pentru servicii injectate.
- Resetarea store-ului înainte de fiecare test.
- Fără testare directă UI dependentă de Zustand.

## Frontend

### Organizare

- Componente primitive: `frontend/src/components/primitives/`
- Componente de feature: `frontend/src/components/features/`
- Constants centralizați: `frontend/src/constants/`
- Teste colocate în același folder cu componenta.

### Text UI și Mesaje

- Toate textele vizibile în UI sunt în `constants/ui.ts`.
- Toate mesajele de utilizator sunt în `constants/messages.ts`.
- Strict interzisă folosirea string-urilor hardcodate în cod sau teste.

### API Integration

#### Centralizare chei query params tranzacții

- Toate cheile de query parametri pentru tranzacții (type, category, dateFrom, dateTo, limit, offset, sort) sunt definite o singură dată în `@budget-app/shared-constants/queryParams.ts`.
- Importurile se fac EXPLICIT din `@budget-app/shared-constants/queryParams` (nu din barrel și nu local).
- Motiv: sincronizare automată între frontend și backend, fără duplicare sau risc de desincronizare la refactor.
- Exemplu corect:

  ```typescript
  import { QUERY_PARAMS } from '@budget-app/shared-constants/queryParams';
  ```

- Orice modificare la aceste chei se anunță și se documentează în `DEV_LOG.md`.

- Endpointuri, parametri, headere definite în `constants/api.ts`.
- Timeout și retry configurabile.

### Tailwind CSS

- Stilizare exclusiv prin TailwindCSS.
- Eliminare stiluri inline.
- Organizare utilitare comune în `utils.css`.

## Constants și Importuri

### Organizare și Importuri Partajate

- Sursa unică de adevăr pentru enums/constants partajate este pachetul `@budget-app/shared-constants`.
- Importurile pentru enums/constants partajate se fac DOAR din pachetul `@budget-app/shared-constants`.
- **Eliminat**: Nu se mai actualizează manual barrel-ul. Modificările sunt detectate automat.

```typescript
// Pattern corect de import
import { TransactionType, CategoryType } from '@budget-app/shared-constants';

// INCORECT (path-uri relative)
import { TransactionType } from '../../shared-constants/enums';
```

- Toate fetch/mutații folosesc rutele centralizate din `@budget-app/shared-constants/api`

### Audit și Refactorizare - Checklist [NOU 2025-05-22]

- [ ] Toate constantele/enumurile/mesajele partajate se definesc DOAR în `shared-constants/`.
- [ ] Importurile pentru constants shared se fac DOAR din pachetul `@budget-app/shared-constants`.
- [ ] **Eliminat**: Nu se mai actualizează manual barrel-ul.
- [ ] Toate rutele API sunt definite în `api.ts`.
- [ ] Toate textele UI (labels, butoane, etc.) sunt în `ui.ts` și importate ca atare.
- [ ] Testele folosesc constante din `shared-constants`, nu string-uri hardcodate.

---
### Configurare Mediu de Dezvoltare

- **Eliminat**: Nu mai este necesară configurarea de alias-uri în `tsconfig.json`, `jest.config.js`, sau `vite.config.ts` pentru `@shared-constants`. `pnpm workspaces` și referințele de proiect (`project references`) din TypeScript se ocupă de rezolvarea căilor automat.

### Sistemul CVA v2 (Class Variance Authority) [NOU 2025-05-22]

- **Confirmările destructive** (ex: ștergere subcategorie) se fac direct din grid, cu mesaj centralizat în `@budget-app/shared-constants/messages.ts`.

### Tranzacții Recurente [VALIDAT 2025-05-22]

- Alternativ, definește tipurile într-un loc central (`@budget-app/shared-constants/schema.ts`)
- Păstrează codul simplu și eficient

### Optimizare SEO și Performanță [NOU 2025-05-22]

- Toate textele și datele din UI folosesc exclusiv sursa unică de adevăr (`@budget-app/shared-constants`).

### Arhitectură hooks [VALIDAT 2025-05-22]

- **Sursă unică de adevăr**: Toate hooks-urile sunt în `src/hooks` și exportate prin `index.ts`

## Management Memorii Critice și Deprecated

### Reguli pentru Memorii

- Memorii critice trebuie marcate explicit `[CRITIC]` în titlu.
- Memorii deprecated trebuie mutate într-o secțiune separată sau arhivate.
- Orice memorie deprecated trebuie să aibă link sau referință către soluția nouă validată.
- Se menține o separare clară între memorii active și memorii arhivate.

## Backend (NestJS)

- (Se va completa pe măsură ce avansăm)

## Shared (Tipuri și Validări)

- Tipuri comune definite în `shared/`.
- Validare runtime folosind Zod.
- Sursă unică de adevăr pentru enums în `shared/enums.ts`.

### Monorepo & Shared Packages

- Build configurat pentru generarea `.d.ts` și `.js`.
- Frontend folosește re-export din `frontend/src/constants/enums.ts`.

## State Management - Zustand

- Store-uri în `frontend/src/stores/`, format: `use[DomeniuFuncțional]Store`.
- Structură clară: State, UI State, Setteri, Acțiuni, Selectors, Reset.
- Injection de servicii în store-uri pentru testabilitate.
- Folosirea selectors pentru performanță.
- Middleware Zustand pentru persist și devtools.

## Managementul Dependențelor și Build

- Instalare consistentă folosind `npm ci`.
- Sincronizare versiuni pachete critice (NestJS, Jest, TypeScript etc).
- Curățare periodică a node_modules și build clean.
- Verificare Jest config pentru detectarea corectă a testelor.

## Caching și Optimizare Performanță

- Servicii API folosind caching LRU și invalidare selectivă la operațiuni.
- Configurabil cache time și max entries.

## ⚠️ Anti-pattern: useEffect cu fetchTransactions pe queryParams

### Problemă

Un pattern greșit care duce la infinite loop în React cu Zustand este folosirea:

```tsx
useEffect(() => {
  useTransactionStore.getState().fetchTransactions();
}, [currentQueryParams]);
```

Deoarece fetchTransactions poate actualiza queryParams (sau alte state-uri relevante), acest lucru duce la re-trigger continuu al efectului și la Maximum update depth exceeded.

### Soluție corectă

- Rulează fetchTransactions doar la mount (dep list `[]`) sau folosește debounce/guard explicit pentru a evita buclele.

```tsx
useEffect(() => {
  useTransactionStore.getState().fetchTransactions();
}, []); // Doar la mount
```

- Dacă ai nevoie de fetch la schimbare de parametri, folosește un guard intern în store pentru a preveni buclele.

### Recomandare

- Nu folosi niciodată direct useEffect cu dependență pe queryParams pentru fetch-uri din store-uri Zustand fără protecție suplimentară.
- Documentează întotdeauna motivul în code review dacă ai nevoie de un pattern diferit.

### Rezolvarea problemei Duplicate Keys (2025-05-21)

- **Context**: Avertismente în consolă despre chei duplicate în liste React din cauza unor ID-uri duplicate între seturi de date.
- **Regulă** (**obligatorie**): Pentru proprietatea `key` în liste React:
  1. Generați chei unice combinând ID-ul cu alte informații (index, timestamp, context)
  2. NU folosiți doar index-ul ca și cheie (anti-pattern)
  3. NU folosiți doar ID-ul atunci când există posibilitatea de ID-uri duplicate între seturi de date

- **Exemplu corect**:

```tsx
// Rău (potențiale chei duplicate)
{transactions.map((transaction) => (
  <tr key={transaction.id}>...</tr>
))}

// Corect (cheie unică garantată)
{transactions.map((transaction, index) => (
  <tr key={`${transaction.id}-${index}`}>...</tr>
))}

// Alternativ, adăugați context la cheie
{transactions.map((transaction) => (
  <tr key={`tx-${transaction.id}-${transaction.date}`}>...</tr>
))}
```

## Debugging și Diagnosticare

- Folosirea `npx jest --listTests`, `--detectOpenHandles` pentru troubleshooting.
- Verificare corectitudine importuri relative.
- Evitare importuri circulare între module.
- Remedierea imediată a erorilor și warning-urilor.

## Documentare și Knowledge Management

### Flux de Actualizare Documentație

- Notarea lecțiilor și problemelor rezolvate în `DEV_LOG.md`.
- La final de săptămână sau task major, lecțiile sunt revizuite și promovate în `BEST_PRACTICES.md`.
- `BEST_PRACTICES.md` devine sursa oficială de reguli.
- `DEV_LOG.md` rămâne jurnal brut al progresului.

## Sincronizare Regulamente

- `BEST_PRACTICES.md` este aliniat permanent cu regulile definite în `global_rules.md`.
- Orice regulă nouă sau lecție învățată se reflectă simultan în ambele documente.
- În caz de diferență, regula documentată în `BEST_PRACTICES.md` prevalează.
- Se recomandă revizuirea periodică a sincronizării.

## Lessons Learned

- Barrel exports pot cauza importuri circulare - necesară organizare ierarhică clară.
- Mock-urile pentru clase private trebuie să vizeze doar metodele publice.
- URL constructor în Node necesită bază absolută validă pentru URL-uri relative.
- Control explicit al promisiunilor oferă teste asincrone mai stabile.
- Invalidarea selectivă a cache-ului reduce semnificativ apelurile API.
- Migrarea de la hooks custom la Zustand necesită rescriere completă a testelor.

### Pattern arhitectural: hooks + servicii + caching pentru React CRUD

- Recomandat pentru aplicații cu operațiuni CRUD frecvente:
  - Custom hooks pentru gestionare UI/state (ex: `useTransactionForm`, `useTransactionFilters`, `useTransactionData`)
  - Servicii dedicate pentru business logic și API (ex: `TransactionService`, `TransactionApiClient`)
  - Optimizare cache cu invalidare selectivă, LRU, monitorizare performanță
- Avantaje: separare clară a responsabilităților, testabilitate crescută, performanță mai bună.
- Status: pattern recomandat, nu obligatoriu (vezi și secțiunea 3 din `global_rules.md`).

### Interacțiune robustă cu Supabase jsonb și upsert (2025-05-09)

---

### Lecții și anti-patternuri – LunarGrid, stores și sincronizare (2025-05-09)

- **Nu folosi polling cu interval-uri** pentru sincronizare între stores/UI (ineficient, bug-prone).
- **Nu folosi localStorage** pentru comunicare între componente sau stores (fragil, greu de testat/debug).
- **Evită over-engineering cu event-emitteri** pentru orice schimbare de stare. Folosește Zustand/core store pattern cu acțiuni clare.
- **Preferă surse de adevăr unice** (ex: store-uri Zustand), sincronizare explicită, fără hack-uri side-channel.
- **Confirmările destructive** (ex: ștergere subcategorie) se fac direct din grid, cu mesaj centralizat în shared-constants/messages.ts.
- Orice workaround sau excepție se documentează aici și în DEV_LOG.md.

**Anti-patternuri observate:**

- Efecte care ascultă pe localStorage sau polling pentru a detecta schimbări între tab-uri sau componente.
- Folosirea de event-emitteri custom pentru propagarea modificărilor între stores sau UI.

**Pattern corect:**

- Store unic Zustand, acțiuni clare, confirmare la delete, fără side-effects ascunse.

Toate aceste reguli au fost integrate și în global_rules.md și DEV_LOG.md.

- **Context**: Implementarea salvare/actualizare de categorii personalizate în Supabase a relevat probleme cu formatarea jsonb și onConflict.
- **Lecții învățate**:
  1. **Structură jsonb corectă**:
      - Pentru câmpuri de tip jsonb, Supabase acceptă obiectul direct (nu stringificat manual)
      - Verificare în prealabil a schemei tabelului cu `MCP.list_tables()` sau SQL Editor
      - Exemplu corect:

      ```typescript
      // CORECT: Se transmite direct obiectul pentru jsonb
      const payload = {
        user_id: userId,
        category_data: {
          categories: categories,
          version: currentVersion
        }
      };
      ```

  2. **Pattern selectInsertUpdate în loc de upsert**:
     - Folosirea `upsert({ onConflict: 'field' })` necesită constrângere UNIQUE pe field
     - Când upsert eșuează cu "no unique or exclusion constraint matching ON CONFLICT specification", implementează un pattern select-then-insert/update:

     ```typescript
     // Verificare dacă există înregistrare pentru user
     const { data } = await supabase
       .from(TABLE)
       .select('id')
       .eq('user_id', userId);
     
     // Alegere între INSERT sau UPDATE în funcție de rezultat
     if (!data || data.length === 0) {
       await supabase.from(TABLE).insert([payload]);
     } else {
       await supabase.from(TABLE).update(payload).eq('user_id', userId);
     }
     ```

  3. **Gestionare robustă erori**:
     - Logging standardizat pentru diagnostic ușor (context + error specific)
     - Returnare valori sigure (array gol, null) în caz de eroare
     - try/catch în toate metodele pentru întrerupere grațioasă în caz de eșec

- **Regulă** (**recomandată**): Verifică întotdeauna schema și constrângerile Supabase pentru tabele înainte de implementare; preferă pattern-ul robust select-then-insert/update pentru date user-specifice.

### Separarea stărilor pentru moduri de operare conflictuale în React (2025-05-09)

- **Context**: Implementarea UI pentru editare/ștergere subcategorii a relevat conflicte între modurile de operare când folosesc aceeași variabilă de stare.
- **Problemă**: "Cannot update a component while rendering a different component" când același state e modificat în componente diferite.
- **Lecții învățate**:
  1. **Stare separată pentru fiecare mod de operare**:

     ```typescript
     // INCORECT: Reutilizarea aceleiași variabile pentru operațiuni diferite
     const [editingItem, setEditingItem] = useState(null);
     // folosit atât pentru editare cât și pentru ștergere
     
     // CORECT: State separat pentru fiecare operațiune
     const [editingItem, setEditingItem] = useState(null);
     const [deletingItem, setDeletingItem] = useState(null);
     ```

  2. **useEffect pentru manipularea stării în timpul render-ului**:

     ```typescript
     // INCORECT: Manipulare de state direct în timpul render-ului
     const Component = () => {
       if (condition) {
         setState(newValue); // Eroare: Cannot update during rendering
         return null;
       }
     };

     
     // CORECT: Manipulare de state în useEffect
     const Component = () => {
       React.useEffect(() => {
         if (condition) {
           setState(newValue);
         }
       }, [condition]);
     };
     ```

  3. **Reset complet al stării la tranziția între moduri**:

     ```typescript
     // La activarea modului de editare
     const handleEdit = (item) => {
       setDeletingItem(null); // Dezactivează explicit modul de ștergere
       setEditingItem(item);
     };

     
     // La activarea modului de ștergere
     const handleDelete = (item) => {
       setEditingItem(null); // Dezactivează explicit modul de editare
       setDeletingItem(item);
     };
     ```

- **Regulă** (**obligatorie**): Pentru UI cu moduri de operare multiple (ex: edit/delete), folosește state separat pentru fiecare mod și nu modifica state-uri în timpul render-ului. Orice modificare de state din componente imbricate trebuie mutată în useEffect.

### Testare valori inițiale în formulare complexe (React)

- Lecție: Asertarea simultană a tuturor valorilor inițiale poate duce la instabilitate în JSDOM/RTL.
- Recomandare:
  - Împarte verificarea în teste focalizate, fiecare testând un singur câmp sau grup mic de câmpuri.
  - Folosește `await waitFor` pentru câmpuri cu timing problematic (date, number, checkbox).
- Status: pattern recomandat pentru stabilitate, nu regulă obligatorie.

---

## Reguli mock-uri (actualizat 2025-05-06)

- Mock-uim **doar**:
  - external services (API calls, fetch, etc.)
  - time/date (ex: Date.now, timers)
  - random values (ex: Math.random)
  - browser APIs (ex: window.localStorage, navigator, clipboard, etc.)
- **Nu** mock-uim stores, hooks Zustand, logică internă sau componente proprii.
- Testele trebuie să reflecte comportamentul real al aplicației din perspectiva utilizatorului.
- Orice excepție trebuie documentată clar în PR și BEST_PRACTICES.md.

**TODO/PLAN:**

- Eliminarea treptată a mock-urilor pentru store-uri Zustand (`__mocks__/stores/`).
- Refactorizarea testelor pentru a folosi store-urile reale și doar mock-uri pentru servicii externe (Supabase, date, random, browser APIs).
- Task planificat incremental, va fi documentat în DEV_LOG.md la fiecare etapă majoră.

---

### Consistență prin token-uri și utilitare centralizate

Pentru a menține coerența vizuală și mentenabilitatea (așa cum s-a demonstrat în refactorizarea temei "earthy" din Mai 2025):

- Utilizați exclusiv clasele Tailwind bazate pe token-urile de design definite în `tailwind.config.js` (ex: `bg-primary-500`, `text-neutral-700`, `p-token`, `rounded-token`).
- Consultați și utilizați clasele utilitare custom (ex: `.btn`, `.input-field`, `.alert`, `.card-base`) definite în `frontend/src/index.css`. Acestea sunt create pentru a încapsula stiluri repetitive și a asigura aplicarea corectă a temei.
- Evitați stilurile hardcodate sau clasele Tailwind generice care nu respectă sistemul de token-uri (ex: `bg-red-500` în loc de `bg-error-500` sau o clasă utilitară `alert-error`).

**Data:** 2025-05-11

_Actualizat la: 2025-05-11_

---

## Navigare cu `react-router-dom` (v6)

Data: 2025-05-11

Migrarea la `react-router-dom` (versiunea 6) aduce o abordare modernă și declarativă pentru gestionarea rutelor în aplicațiile React.

### Principii Cheie și Configurare Inițială

1. **`<BrowserRouter>`**: Componenta rădăcină pentru activarea rutării. De obicei, se plasează în `index.tsx` pentru a împacheta întreaga aplicație:

    ```tsx
    // frontend/src/index.tsx
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import { BrowserRouter } from 'react-router-dom';
    import App from './App';
    // ... alte importuri

    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    ```

2. **`<Routes>` și `<Route>`**: Definirea rutelor se face în interiorul unui component `<Routes>`. Fiecare `<Route>` mapează o cale (`path`) la un element (`element` - componenta React de randat).

    ```tsx
    // frontend/src/App.tsx
    import { Routes, Route, Navigate } from 'react-router-dom';
    import HomePage from './pages/HomePage'; // Exemplu
    import LoginPage from './pages/LoginPage'; // Exemplu
    import DashboardPage from './pages/DashboardPage'; // Exemplu
    import { useAuthStore } from './stores/authStore'; // Exemplu de store de autentificare

    const App: React.FC = () => {
      const { user } = useAuthStore();

      return (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rută protejată */}
          <Route 
            path="/dashboard" 
            element={user ? <DashboardPage /> : <Navigate to="/login" replace />}
          />
          
          {/* Catch-all pentru rute nedefinite - ajustează la nevoie */}
          <Route path="*" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} /> 
        </Routes>
      );
    };
    ```

### Navigare

1. **`<Link>`**: Pentru navigare declarativă (similar cu tag-ul `<a>` HTML), se folosește componenta `<Link to="/cale">

    ```tsx
    import { Link } from 'react-router-dom';

    // ... în interiorul unui component
    <Link to="/dashboard">Mergi la Dashboard</Link>
    ```

2. **`useNavigate()`**: Pentru navigare programatică (de exemplu, după un submit de formular sau o acțiune asincronă).

    ```tsx
    import { useNavigate } from 'react-router-dom';

    const MyComponent = () => {
      const navigate = useNavigate();

      const handleLoginSuccess = () => {
        // ... logica de login
        navigate('/dashboard'); // Redirecționează la dashboard
      };
      // ...
    };
    ```

3. **`useLocation()`**: Pentru a accesa obiectul `location` care conține informații despre URL-ul curent (ex: `pathname`, `search`, `hash`).

    ```tsx
    import { useLocation } from 'react-router-dom';

    const ActiveTabIndicator = () => {
      const location = useLocation();
      // location.pathname va fi, de ex., '/dashboard'
      // ...
    };
    ```

### Important

- Toate hook-urile `react-router-dom` (ex: `useNavigate`, `useLocation`, `useParams`) trebuie folosite în componente care sunt descendente ale unui component `<Router>` (ex: `<BrowserRouter>`). Altfel, vor genera erori la runtime.
- Pentru rutele protejate, elementul randat condiționat ar trebui să includă `<Navigate to="/calea-de-redirect" replace />`. Props-ul `replace` asigură că pagina de login (sau altă pagină intermediară) nu este adăugată în istoricul de navigare, permițând butonului "back" să funcționeze intuitiv.

---

## Sincronizarea schema DB și modelele frontend

### Problemă și impact

Una dintre cele mai frecvente surse de erori în aplicațiile moderne este discrepanța între schema bazei de date și modelele/tipurile din frontend. Această problemă duce la:

- Erori de tipul `Column not found` în API responses
- Inconsistențe de date între frontend și backend
- Bug-uri subtile și greu de diagnosticat
- Timp pierdut în debugging și fix-uri de urgență

### Exemple concrete de erori și soluții

1. **Eroare**: `Could not find the 'userId' column of 'transactions' in the schema cache`
   - **Cauza**: Frontend trimite `userId` în payload, dar schema DB are `user_id`
   - **Soluție**:
     - Alinierea strictă a numelor de câmpuri între modelele TS și schema DB
     - Transformare explicită în serviciu

     ```typescript
     // Corect - Transformare nume de câmpuri în serviciu
     async createTransaction(data: TransactionDTO) {
       // Convertim din camelCase (TS/JS) în snake_case (DB)
       const payload = {
         user_id: data.userId,
         // ... alte câmpuri transformate similar
       };
       return this.api.post('/transactions', payload);
     }
     ```

2. **Eroare**: `Could not find the 'description' column of the provided object`
   - **Cauza**: Un câmp `description` trimis în payload deși nu există în schemă
   - **Soluție**:
     - Eliminarea tuturor câmpurilor care nu sunt în schemele DB și validare
     - Validarea payload-urilor cu Zod sau TypeScript utility types

     ```typescript
     // Validare cu TypeScript
     type DbColumnKeys = keyof DBTransaction; // Exact columns from schema
     type SafePayload = Pick<TransactionForm, DbColumnKeys>;
     
     // Remove fields not in DB schema
     const stripExtraFields = <T>(data: T, allowedKeys: string[]): Partial<T> => {
       return Object.fromEntries(
         Object.entries(data).filter(([key]) => allowedKeys.includes(key))
       ) as Partial<T>;
     };
     ```

### Best Practices

## [IMPORTANT] Focus outline și efecte de focus la taburi/NavLink

- Nu adăuga niciodată clase de focus vizual (ex: `focus:ring-*`, `focus:outline-*`) direct în stilurile de bază (`base`) ale componentelor de navigare sau taburi în `componentMap`.
- Efectele de focus (outline, ring, shadow) se aplică DOAR dinamic, ca efect (ex: `fx-no-outline`), pentru a permite controlul complet și centralizat prin sistemul de stiluri rafinate.
- Motiv: Dacă pui clasele de focus direct în `base`, acestea nu pot fi suprascrise de efecte sau variante, ceea ce duce la imposibilitatea eliminării chenarului de focus la nevoie (ex: design modern, UX, QA, accesibilitate controlată).
- Exemplu corect:

  ```ts
  // navigationComponents.ts
  tab: {
    base: 'px-4 py-2 text-sm font-medium transition-all duration-200', // fără focus:ring sau outline aici!
  }
  // În componentă:
  getEnhancedComponentClasses('tab', ..., ..., ..., ['fx-no-outline'])
  ```

- Documentează orice excepție explicit în PR și DEV_LOG.md.
 pentru sincronizare schemă-model

1. **Sursa unică de adevăr pentru scheme**
   - Generează tipurile TS din schema DB folosind tools precum [prisma-typegen](https://github.com/prisma/prisma), [supabase-js-v2](https://supabase.com/docs/reference/javascript/typescript-support) sau [openapi-typescript](https://github.com/drwpow/openapi-typescript)
   - Alternativ, definește tipurile într-un loc central (`shared-constants/schema.ts`)
   - Actualizează simultan migrarea DB și tipurile asociate

2. **Validare payload-uri**
   - Validează toate payload-urile înainte de trimitere către API
   - Folosește utilități de transformare pentru a asigura compatibilitatea (ex: `camelToSnake`, `stripExtraFields`)
   - Folosește un middleware API care probează schema DB și detectează erori la runtime

3. **Delegați transformarea în servicii**
   - Serviciile trebuie să convertească între formatul UI și formatul DB
   - Componentele UI nu ar trebui să știe detalii despre structura exactă a tabelelor
   - Izolează cunostințele despre schemă în servicii specializate

### Procedură recomandată pentru schimbări de schemă

1. Actualizează schema DB prin migrări (SQL, Prisma, etc.)
2. Actualizează tipurile/interfețele TS corespunzătoare
3. Actualizează serviciile care interacționează cu noua schemă
4. Actualizează validarea formularelor și componentelor UI
5. Testează exhaustiv cu date reale

### Riscuri și mitigații

1. **Drepturi acces**: Asigură-te că serviciile au doar permisiunile minime necesare pentru operațiunile lor
2. **Performanță**: Minimizează transformările complexe în timpul runtime-ului
3. **Securitate**: Validează întotdeauna datele de intrare pentru a preveni SQLi sau alte vulnerabilități

---

## Interogări SQL eficiente cu Supabase

### SQL Group By și coloane agregate (2025-05-21)

- **Context**: Implementarea `fetchActiveSubcategories` a relevat probleme cu operațiile de grup în Supabase.
- **Regulă** (**obligatorie**): Când utilizați `GROUP BY` în interogări SQL:
  1. Includeți TOATE coloanele neagregate din clauza SELECT în clauza GROUP BY
  2. SAU utilizați funcții agregate pentru coloanele care nu sunt în GROUP BY
  3. Pentru seturi mici/medii de date, preferați gruparea în JavaScript pentru flexibilitate

- **Exemplu corect**:

```typescript
// Corect: Toate coloanele neagregate sunt în GROUP BY
const { data } = await supabase
  .from('transactions')
  .select('category, subcategory, count(*)')
  .group('category, subcategory');

// Alternativă: Grupare client-side pentru seturi mici de date
const { data } = await supabase
  .from('transactions')
  .select('category, subcategory');

// Grupați local
const grouped = data.reduce((acc, item) => {
  const key = `${item.category}|${item.subcategory}`;
  if (!acc[key]) {
    acc[key] = { category: item.category, subcategory: item.subcategory, count: 1 };
  } else {
    acc[key].count++;
  }
  return acc;
}, {});
```

### Funcții RPC în Supabase (2025-05-21)

- **Context**: Implementarea inițială a încercat să utilizeze o funcție RPC (`exec_sql`) care nu exista.
- **Regulă** (**obligatorie**): Funcțiile RPC trebuie declarate explicit în Supabase înainte de a fi folosite.
  1. Verificați întotdeauna existența funcțiilor RPC înainte de a le folosi
  2. Preferați API-ul standard Supabase pentru operațiuni CRUD simple
  3. Documentați și testați extensiv toate funcțiile RPC personalizate

- **Exemplu corect**:

```typescript
// Verificare existență RPC înainte de utilizare
const checkRpcExists = async (functionName: string) => {
  try {
    const { data } = await supabase
      .from('pg_proc')
      .select('proname')
      .eq('proname', functionName)
      .single();
    return !!data;
  } catch (error) {
    return false;
  }
};

// Sau pur și simplu folosiți API-ul standard pentru operațiuni comune
const { data } = await supabase
  .from('transactions')
  .select('category, subcategory')
  .eq('user_id', userId);
```

## React Performance și Unicitate

### Rezolvarea problemei Duplicate Keys (2025-05-21)

- **Context**: Avertismente în consolă despre chei duplicate în liste React din cauza unor ID-uri duplicate între seturi de date.
- **Regulă** (**obligatorie**): Pentru proprietatea `key` în liste React:
  1. Generați chei unice combinând ID-ul cu alte informații (index, timestamp, context)
  2. NU folosiți doar index-ul ca și cheie (anti-pattern)
  3. NU folosiți doar ID-ul atunci când există posibilitatea de ID-uri duplicate între seturi de date

- **Exemplu corect**:

```tsx
// Rău (potențiale chei duplicate)
{transactions.map((transaction) => (
  <tr key={transaction.id}>...</tr>
))}

// Corect (cheie unică garantată)
{transactions.map((transaction, index) => (
  <tr key={`${transaction.id}-${index}`}>...</tr>
))}

// Alternativ, adăugați context la cheie
{transactions.map((transaction) => (
  <tr key={`tx-${transaction.id}-${transaction.date}`}>...</tr>
))}
```

### Optimizarea dropdown-urilor cu seturi mari de date (2025-05-21)

- **Context**: Dropdown-uri cu toate subcategoriile afișate, incluzând cele fără tranzacții asociate, cauzau experiență utilizator sub-optimală.
- **Regulă** (**recomandată**): Pentru dropdown-uri cu multe opțiuni:
  1. Filtrați opțiunile la sursa de date pentru a afișa doar cele relevante
  2. Afișați numărul de itemi asociați pentru context (ex: "Salariu (3)")
  3. Implementați stări de loading pentru feedback vizual în timpul încărcării
  4. Adăugați mesaje relevante pentru situațiile fără rezultate (empty states)

- **Exemplu corect**:

```tsx
// Hook personalizat pentru filtrarea eficientă a subcategoriilor
const { subcategories, isLoading, isEmpty } = useActiveSubcategories({
  category, 
  type,
  enabled: !!category
});

// Componenta Select cu stare de loading și mesaj pentru lipsa rezultatelor
<Select
  options={isEmpty ? [{ value: '', label: INFO.NO_SUBCATEGORIES, disabled: true }] : subcategories}
  isLoading={isLoading}
  placeholder={isLoading ? LOADER.TEXT : PLACEHOLDERS.SELECT}
/>
```

## Organizarea codului și best practices

### Hooks personalizate React Query pentru resurse partajate (2025-05-21)

- **Context**: Implementarea filtrării subcategoriilor active a necesitat un hook React Query specializat.

- **Regulă** (**recomandată**): Pentru resurse partajate între componente:
  1. Creați hooks personalizate care encapsulează logica React Query
  2. Folosiți chei query predictibile și consistente pentru cache eficient
  3. Implementați transformări de date în hook, nu în componente
  4. Returnați informații bogate (isLoading, isEmpty, isError) pentru UX complet

- **Exemplu ideal**:

```typescript
// Hook personalizat pentru subcategorii active
export function useActiveSubcategories({ category, type, enabled = true }) {
  const { user } = useAuthStore();
  const userId = user?.id;
  
  // Query cu cheie unică și dependințe clare
  const query = useQuery({
    queryKey: ['activeSubcategories', userId, category, type],
    queryFn: () => supabaseService.fetchActiveSubcategories(userId, category, type),
    enabled: enabled && !!userId,
  });
  
  // Transformare date pentru componente UI
  const formattedSubcategories = useMemo(() => {
    if (!query.data) return [];
    
    return query.data.map(item => ({
      value: item.subcategory,
      label: `${formatLabel(item.subcategory)} (${item.count})`,
      count: item.count,
      category: item.category
    }));
  }, [query.data]);
  
  // Return rich API pentru UX complet
  return {
    subcategories: formattedSubcategories,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEmpty: query.data?.length === 0,
  };
}
```

## [2025-05-22] Lecții învățate: Refactorizare și stabilizare LunarGridTanStack

- Pattern robust pentru generare chei unice la subRows: `${category}-${subcategory}` sau `${category}-__empty-<idx>` pentru subcategorii goale.
- Fallback automat pentru subcategorii lipsă sau corupte, cu warning doar în dev dacă apar duplicate.
- Eliminare completă duplicate keys: nu mai există avertismente React sau bug-uri la expand/collapse all.
- Pipeline-ul de date pentru subRows este 100% robust, combină subcategorii din definiție și fallback din tranzacții corupte.
- Toate textele și datele din UI folosesc exclusiv sursa unică de adevăr (`@budget-app/shared-constants`).
- Testarea se face doar cu data-testid predictibil, fără stringuri hardcodate.
- Eliminarea tuturor logurilor de debug înainte de production.
- Patternul de pipeline și chei unice trebuie urmat la orice refactor viitor pentru griduri ierarhice.

## Pattern URL persistence cu React Router [NOU 2025-05-25]

### Implementare cu useURLFilters

Pentru a sincroniza filtrele și parametrii de căutare cu URL-ul paginii, folosim pattern-ul implementat în `useURLFilters.ts`. Acest pattern permite:

- Partajarea ușoară a URL-urilor cu filtre specifice
- Navigare backward/forward cu păstrarea filtrelor
- Bookmarking-ul unei căutări specifice
- Refresh-ul paginii fără pierderea stării filtrelor

```typescript
// Pattern implementat în useURLFilters.ts
import { useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTransactionFiltersStore } from '../stores/transactionFiltersStore';

export const useURLFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  
  const {
    loadFromURL,
    getURLSearchParams,
    // state monitorizat pentru schimbări
  } = useTransactionFiltersStore();

  // Încărcare filtre din URL la montare
  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    loadFromURL(currentParams);
  }, [loadFromURL]);

  // Actualizare URL cu debounce când filtrele se schimbă
  const updateURL = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const newParams = getURLSearchParams();
      setSearchParams(newParams, { replace: true });
    }, 300); // Debounce 300ms
  }, [getURLSearchParams, setSearchParams]);

  // Handler pentru back/forward în browser
  useEffect(() => {
    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      loadFromURL(currentParams);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [loadFromURL]);

  return {
    getCurrentURL: useCallback(() => {
      const params = getURLSearchParams();
      const baseURL = window.location.origin + window.location.pathname;
      const queryString = params.toString();
      return queryString ? `${baseURL}?${queryString}` : baseURL;
    }, [getURLSearchParams]),
    clearFiltersAndURL: useCallback(() => {
      useTransactionFiltersStore.getState().resetFilters();
      setSearchParams(new URLSearchParams(), { replace: true });
    }, [setSearchParams])
  };
}
```

### Store cu suport URL persistence

Zustand store-ul trebuie să implementeze metodele `loadFromURL` și `getURLSearchParams` pentru a suporta sincronizarea cu URL-ul:

```typescript
// În transactionFiltersStore.ts
export const useTransactionFiltersStore = create<TransactionFiltersState>((set, get) => ({
  // State și setters...
  
  // URL persistence
  loadFromURL: (searchParams: URLSearchParams) => {
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';
    // Încarcă toți parametrii din URL
    
    set({
      filterType: type as TransactionType | '',
      filterCategory: category as CategoryType | '',
      // Setează toate valorile în store
    });
  },

  getURLSearchParams: () => {
    const { 
      filterType, 
      filterCategory,
      // Toate filtrele
    } = get();

    const params = new URLSearchParams();
    
    // Adaugă doar valorile non-empty în URL
    if (filterType) params.set('type', filterType);
    if (filterCategory) params.set('category', filterCategory);
    // Adaugă toți parametrii relevanți

    return params;
  },
}));
```

### Utilizare în componente

```typescript
// În pagina sau componenta principală
import { useURLFilters } from '../hooks/useURLFilters';

const MyFiltersComponent = () => {
  const { getCurrentURL, clearFiltersAndURL } = useURLFilters();
  
  // Filtrele sunt automat sincronizate cu URL-ul

  return (
    <div>
      <button onClick={clearFiltersAndURL}>Resetează filtrele</button>
      <a href={getCurrentURL()}>Link către aceste filtre</a>
    </div>
  );
};
```

### Best practices pentru URL persistence

- Limitați parametrii URL doar la valorile non-default pentru a păstra URL-urile curate
- Folosiți debounce pentru a evita actualizările excesive ale URL-ului în timpul modificărilor rapide
- Asigurați-vă că valorile din URL sunt sanitizate și validate înainte de a fi utilizate
- Gestionați corect evenimentele de browser back/forward pentru a menține o experiență fluidă
- Nu stocați date sensibile sau foarte mari în URL

## Pattern Export cu progres și format multiplu [NOU 2025-05-25]

### Implementare cu ExportManager și useExport

Pentru exporturi flexibile și cu feedback de progres, folosim pattern-ul implementat în `useExport.ts` și `ExportManager.ts`. Acest pattern oferă:

- Suport pentru multiple formate (CSV, Excel, PDF)
- Feedback vizual de progres în timpul exportului
- Gestionare robustă a erorilor
- Opțiuni configurabile pentru fiecare format

```typescript
// Pattern implementat în hook-ul useExport
export const useExport = (): UseExportReturn => {
  const [state, setState] = useState<ExportState>({
    isExporting: false,
    progress: 0,
    error: null
  });

  // Progress callback pentru tracking export
  const onProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress }));
  }, []);

  // Mutation pentru export
  const exportMutation = useMutation({
    mutationFn: async ({ 
      transactions, 
      format, 
      options 
    }) => {
      setState(prev => ({ ...prev, isExporting: true, error: null, progress: 0 }));
      
      try {
        await ExportManager.exportTransactions(transactions, format, {
          ...options,
          onProgress
        });
        
        setState(prev => ({ ...prev, progress: 100 }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : MESAJE.EROARE_NECUNOSCUTA;
        setState(prev => ({ ...prev, error: errorMessage }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isExporting: false }));
      }
    }
  });

  const exportData = useCallback(async (
    transactions: Transaction[], 
    format: ExportFormat, 
    options?: ExportOptions
  ) => {
    await exportMutation.mutateAsync({ transactions, format, options });
  }, [exportMutation]);

  return {
    exportData,
    state,
    resetState: useCallback(() => {
      setState({
        isExporting: false,
        progress: 0,
        error: null
      });
    }, [])
  };
};
```

### Utilizare în componente

```typescript
// În componenta care oferă export
import { useExport } from '../hooks/useExport';
import { ExportFormat } from '../utils/ExportManager';

const ExportComponent = ({ transactions }) => {
  const { exportData, state } = useExport();
  
  const handleExport = async (format: ExportFormat) => {
    try {
      await exportData(transactions, format, {
        filename: `tranzactii_${new Date().toISOString().slice(0, 10)}`,
        title: 'Raport Tranzacții',
        includeHeaders: true
      });
      
      // Succes
    } catch (error) {
      // Error handling
    }
  };

  return (
    <div>
      <div className="export-buttons">
        <button onClick={() => handleExport('csv')}>Export CSV</button>
        <button onClick={() => handleExport('excel')}>Export Excel</button>
        <button onClick={() => handleExport('pdf')}>Export PDF</button>
      </div>
      
      {state.isExporting && (
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${state.progress}%` }}
          />
          <span>{state.progress}%</span>
        </div>
      )}
      
      {state.error && (
        <div className="error">{state.error}</div>
      )}
    </div>
  );
};
```

### Best practices pentru exporturi

- Oferiți feedback vizual clar în timpul operațiunilor de export
- Gestionați erorile în mod elegant și oferiți mesaje de eroare utile
- Folosiți biblioteci specializate pentru fiecare format (xlsx pentru Excel, jsPDF pentru PDF)
- Implementați timeout-uri și retries pentru exporturi mari
- Considerați exportul asincron (server-side) pentru seturi foarte mari de date
- Validați datele înainte de export pentru a evita erorile în timpul procesării
- Oferiți opțiuni de personalizare (nume fișier, includere headere, etc.)
