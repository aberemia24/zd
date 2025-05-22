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
- TDD: Obligatoriu pentru toate funcționalitățile noi.
- Commit-uri: Mesaje frecvente, atomice, descriptive.
- Branching: Dezvoltare pe branch-uri de feature; `main` doar pentru cod stabil.
- PR-uri: Obligatorii pentru orice integrare.
- Documentație: Actualizare continuă a `README.md`, `BEST_PRACTICES.md`, `DEV_LOG.md`.
- Refactorizare: Incrementală, cu acoperire de teste.
- Fără Breaking Changes fără documentare și consens.

## Pattern hooks tranzacții: React Query + Zustand [ACTUALIZAT 2025-05-22]

### Arhitectură hooks specializate

- Pentru tranzacții, folosim două hooks specializate combinate cu Zustand:
  - `useMonthlyTransactions` (bulk, pentru grid lunar)
  - `useInfiniteTransactions` (infinite loading, pentru tabel)
  - `useTransactionStore` (state global UI și cache-invalidare)

- Cheia de cache React Query este structurată ierarhic pentru invalidare eficientă:
  ```typescript
  // Cheie primară partajată
  const baseQueryKey = ['transactions'];
  
  // Chei derivate pentru queries specifice
  const monthlyQueryKey = [...baseQueryKey, 'monthly', { year, month }];
  const infiniteQueryKey = [...baseQueryKey, 'infinite', { filters }];
  ```

- La operațiuni de modificare (create/update/delete), invalidăm întregul cache 'transactions':
  ```typescript
  // În mutații
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ['transactions'] });
  ```

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

### Pattern pentru infinite loading [NOU]

Pentru tranzacții infinite, folosim pattern-ul recomandat de React Query:

```typescript
export function useInfiniteTransactions(filters: TransactionFilters) {
  return useInfiniteQuery({
    queryKey: ['transactions', 'infinite', filters],
    queryFn: ({ pageParam = 0 }) => 
      transactionService.getTransactions({ ...filters, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, allPages) => 
      lastPage.length === 20 ? allPages.length * 20 : undefined,
  });
}

// Utilizare în componente
const { 
  data, 
  fetchNextPage, 
  hasNextPage, 
  isFetchingNextPage 
} = useInfiniteTransactions(filters);

// Întreaga listă de tranzacții (toate paginile)
const transactions = useMemo(() => 
  data?.pages.flatMap(page => page) || [], 
  [data]
);
```

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

#### Testare robustă cu constants și data-testid

- Orice mesaj de eroare, loading sau feedback din UI și din teste trebuie să provină din constants (`@shared-constants/messages`), nu stringuri hardcodate.
- Toate elementele funcționale (butoane, inputuri, itemi listă, feedback) au `data-testid` unic, stabil și predictibil (vezi regula globală 3.1 și exemplul de mai jos).
- Testele verifică mesaje/indicatori folosind valorile din constants și selectează elementele prin `data-testid`, nu prin text hardcodat.
- Exemplu corect:

```tsx
import { MESAJE } from '@shared-constants/messages';
expect(screen.getByTestId('error-msg')).toHaveTextContent(MESAJE.EROARE_INCARCARE_TRANZACTII);
expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
```

- Pentru formulare complexe, verifică valorile inițiale pe câmpuri individuale cu `waitFor` (vezi lessons learned).

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

## Zustand Best Practices [ACTUALIZAT 2025-05-22]

### Structură recomandată pentru store-uri Zustand

Fiecare store Zustand trebuie să urmeze o structură clară:

```typescript
interface TransactionState {
  // 1. STATE RAW
  transactions: Transaction[];
  filters: TransactionFilters;
  selectedTransaction: Transaction | null;
  
  // 2. STATE DERIVAT (opțional)
  groupedTransactions: Record<string, Transaction[]>;
  
  // 3. METADATE
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  
  // 4. ACȚIUNI
  // 4.1 Setter simpli
  setFilters: (filters: TransactionFilters) => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  
  // 4.2 Acțiuni complexe
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // 5. UTILITAR
  reset: () => void;
}
```

### Pattern pentru acțiuni asincrone

Pentru acțiunile asincrone în Zustand, folosiți următorul pattern:

```typescript
fetchTransactions: async () => {
  // 1. Setăm starea de loading
  set({ isLoading: true, error: null });
  
  try {
    // 2. Facem operațiunea asincronă
    const data = await transactionService.getTransactions();
    
    // 3. Actualizăm starea cu datele noi
    set({ 
      transactions: data,
      lastUpdated: new Date(),
      isLoading: false 
    });
    
    // 4. Opțional, calculăm state derivat
    get().updateGroupedTransactions();
  } catch (error) {
    // 5. Gestionăm erorile
    set({ 
      error: error as Error, 
      isLoading: false 
    });
    
    // 6. Opțional, logging sau notificare
    console.error('Error fetching transactions:', error);
  }
}
```

### Prevenirea buclelor infinite [IMPORTANT]

Regula critică: Nu folosiți niciodată pattern-ul:

```typescript
// ANTI-PATTERN: Poate crea buclă infinită
useEffect(() => {
  useTransactionStore.getState().fetchTransactions();
}, [queryParams]);
```

În schimb, folosiți uno dintre aceste două pattern-uri sigure:

```typescript
// PATTERN 1: Executare doar la mount
useEffect(() => {
  transactionStore.fetchTransactions();
}, []); // Dependențe goale = doar la mount

// PATTERN 2: Folosirea unui efect cu verificare explicită
const paramsRef = useRef(queryParams);
useEffect(() => {
  if (JSON.stringify(paramsRef.current) !== JSON.stringify(queryParams)) {
    paramsRef.current = queryParams;
    transactionStore.fetchTransactions();
  }
}, [queryParams, transactionStore]);
```

### Selectors optimizați

Pentru a preveni re-render-uri inutile, folosiți selectors optimizați:

```typescript
// Store cu selectors
const useTransactionStore = create<TransactionState>((set, get) => ({
  // ...state și acțiuni
  
  // Selector optimizat pentru tranzacții după categorie
  getTransactionsByCategory: (category: string) => {
    return get().transactions.filter(t => t.category === category);
  }
}));

// Utilizare în componente
const foodTransactions = useTransactionStore(state => 
  state.getTransactionsByCategory('Food')
);
```

## React Query Best Practices [NOU 2025-05-22]

### Arhitectură recomandată

1. **Separare clară a responsabilităților**:
   - **Query Hooks**: Pentru fetch și caching (ex: `useTransactions`, `useCategories`)
   - **Mutation Hooks**: Pentru operațiuni de modificare (ex: `useTransactionMutations`)
   - **Service Layer**: Pentru API calls și transformare date (ex: `transactionService.ts`)

2. **Pattern pentru keys structurate**:
   ```typescript
   // Structură recomandată pentru query keys
   const queryKey = [
     'entitate',      // Nivel 1: Tipul entității (ex: 'transactions', 'categories')
     'operațiune',    // Nivel 2: Tipul operațiunii (ex: 'list', 'detail', 'monthly')
     paramsObject     // Nivel 3: Params ca obiect (pentru invalidare selectivă)
   ];
   
   // Exemple:
   const monthlyKey = ['transactions', 'monthly', { year: 2025, month: 5 }];
   const detailKey = ['transactions', 'detail', { id: '123' }];
   ```

3. **Optimizări importante**:
   - **staleTime**: Setați o valoare adecvată pentru a reduce fetch-urile inutile
   - **cacheTime**: Cât timp să păstreze datele în cache după ce nu mai sunt folosite
   - **refetchOnWindowFocus**: În general, setați la `false` pentru tranzacții
   - **keepPreviousData**: Setați la `true` pentru a păstra UI stabil în timpul schimbării filtrelor

   ```typescript
   export function useMonthlyTransactions(params: MonthlyParams) {
     return useQuery({
       queryKey: ['transactions', 'monthly', params],
       queryFn: () => transactionService.getMonthlyTransactions(params),
       staleTime: 5 * 60 * 1000,      // 5 minute
       cacheTime: 30 * 60 * 1000,     // 30 minute
       refetchOnWindowFocus: false,
       keepPreviousData: true,
     });
   }
   ```

### Mutations și optimistic updates

Pentru o experiență utilizator fluidă, folosiți optimistic updates:

```typescript
export function useAddTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newTransaction: TransactionInput) => 
      transactionService.createTransaction(newTransaction),
    
    // Optimistic update
    onMutate: async (newTransaction) => {
      // 1. Anulăm orice refetch în desfășurare
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      
      // 2. Salvăm starea anterioară
      const previousTransactions = queryClient.getQueryData<Transaction[]>(
        ['transactions', 'list']
      );
      
      // 3. Actualizăm optimist cache-ul
      if (previousTransactions) {
        queryClient.setQueryData(
          ['transactions', 'list'], 
          [...previousTransactions, { ...newTransaction, id: 'temp-id' }]
        );
      }
      
      // 4. Returnăm contextul pentru onError
      return { previousTransactions };
    },
    
    // În caz de eroare, revertim schimbarea
    onError: (err, newTransaction, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ['transactions', 'list'],
          context.previousTransactions
        );
      }
    },
    
    // După succes, invalidăm pentru a obține datele reale
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
```

## Caching și Optimizare Performanță [ACTUALIZAT 2025-05-22]

### Strategii de caching pentru operațiuni frecvente

- **Cache LRU pentru lookup-uri**:
  ```typescript
  // Cache pentru categorii
  const categoriesCache = new Map<string, Category[]>();
  const MAX_CACHE_SIZE = 10;
  
  export async function getCategories(): Promise<Category[]> {
    const cacheKey = 'all-categories';
    
    // Verificăm cache-ul
    if (categoriesCache.has(cacheKey)) {
      return categoriesCache.get(cacheKey)!;
    }
    
    // Fetch dacă nu e în cache
    const data = await supabaseService.getCategories();
    
    // Limităm mărimea cache-ului (LRU simplificat)
    if (categoriesCache.size >= MAX_CACHE_SIZE) {
      const firstKey = categoriesCache.keys().next().value;
      categoriesCache.delete(firstKey);
    }
    
    // Adăugăm în cache
    categoriesCache.set(cacheKey, data);
    
    return data;
  }
  ```

- **Invalidare selectivă cache**:
  ```typescript
  // Invalidare specifică
  export function invalidateCategory(categoryId: string): void {
    // Invalidăm doar cache-ul pentru o anumită categorie
    categoriesCache.delete(`category-${categoryId}`);
    
    // Dar și cache-ul pentru toate categoriile
    categoriesCache.delete('all-categories');
  }
  ```

### Memoizare în componente

Pentru calcule costisitoare în componente, folosiți memoizare eficientă:

```typescript
// Calcul costisitor memoizat cu dependențe clare
const totalsByCategory = useMemo(() => {
  return transactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);
}, [transactions]);

// Componente memoizate pentru a evita re-render-uri inutile
const MemoizedTransactionItem = React.memo(TransactionItem);
```

## Convenții pentru imports [ACTUALIZAT 2025-05-22]

### Organizare imports

Toate importurile trebuie să urmeze următoarea structură:

```typescript
// 1. Librării externe
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 2. Constante și shared
import { MESSAGES, TRANSACTION_TYPES } from '@shared-constants';

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

### Imports pentru constants partajate

- Sursă unică de adevăr: `shared-constants/`
- Import **doar** prin path mapping `@shared-constants`
- **Interzis**: importuri din barrel-uri locale sau direct din frontend/src/constants
- Validare automată periodică cu `npm run validate:constants`

## Sisteme de stiluri rafinate (2025-05-19) [ACTUALIZAT]

Toate componentele trebuie să folosească API-ul centralizat de stiluri:

```typescript
// getEnhancedComponentClasses e singura metodă de aplicare a stilurilor
import { getEnhancedComponentClasses } from '../styles/themeUtils';

function MyComponent({ variant = 'primary', size = 'md', isActive }) {
  // Generare clase CSS din sistemul de tokens
  const classes = getEnhancedComponentClasses({
    base: 'component-base',  // Clasa de bază
    variants: {
      [variant]: true,       // Variantă (primary, secondary, etc.)
      [size]: true,          // Mărime (sm, md, lg, etc.)
      active: isActive       // Stare (active, disabled, etc.)
    },
    effects: ['shadow-md', 'gradient-bg-subtle'] // Efecte vizuale
  });
  
  return <div className={classes}>Content</div>;
}
```

### Componente primitive vs. props pentru efecte

Abordarea recomandată (în ordine de prioritate):

```typescript
// 1. Folosiți componentele primitive cu props pentru efecte
<Button variant="primary" size="lg" withShadow withGradient>Submit</Button>

// 2. Folosiți getEnhancedComponentClasses pentru HTML direct
<div className={getEnhancedComponentClasses(
  'card',
  'primary',
  'md',
  isActive ? 'active' : undefined,
  ['shadow-md', 'gradient-bg-subtle']
)}>
  Content
</div>
```

## Checklist PR și Code Review [NOU 2025-05-22]

Folosiți această checklist pentru PR-uri și code review:

1. **Constante și Mesaje**
   - [ ] Toate textele UI și mesajele sunt în `@shared-constants`
   - [ ] Nu există string-uri hardcodate

2. **Testare**
   - [ ] Teste unitare pentru logica de business
   - [ ] Teste de componente pentru UI
   - [ ] Toate componentele au `data-testid`
   - [ ] Mock-uri doar pentru servicii externe

3. **Performanță**
   - [ ] Folosește `useMemo` și `useCallback` pentru funcții/calcule intensive
   - [ ] Componente React.memo pentru listele lungi
   - [ ] React Query configurat cu opțiuni de caching adecvate

4. **Stilizare**
   - [ ] Folosește exclusiv `getEnhancedComponentClasses` sau componente primitive
   - [ ] Nu există clase Tailwind hardcodate
   - [ ] Props pentru efecte vizuale (`withShadow`, `withGradient`, etc.)

5. **Tipuri și Type Safety**
   - [ ] Toate props-urile au tipuri explicite
   - [ ] Fără `any` sau `unknown` fără justificare clară
   - [ ] Cast explicit pentru enum-uri (`as TransactionType`)

## [Alte secțiuni existente sunt încă valide și actualizate] 