EXEMPLE CONCRETE, FLUXURI DE DATE ȘI PATTERN-URI UI

1. Exemple Concrete de Utilizare pentru Componente Majore
1.1 TransactionForm
Exemplu Utilizare:
```tsx
// În TransactionsPage.tsx
import { TransactionForm } from '../components/features';
import { UI } from '@shared-constants';

// Exemplu simplu
<TransactionForm />

// Exemplu cu callbacks și efecte vizuale
<TransactionForm
  onSave={(formData) => console.log('Tranzacție salvată:', formData)}
  onCancel={() => console.log('Formular anulat')}
  submitButtonText={UI.BUTTONS.SAVE}
  withShadow={true}
  withFadeIn={true}
/>
```

Structura Datelor:
```tsx
// Tipul datelor din formular
type TransactionFormData = {
  type: TransactionType;  // Din TransactionType enum (@shared-constants/enums)
  amount: string;        // Sumă ca string (pentru input controlat)
  category: string;      // Categorie selectată
  subcategory: string;   // Subcategorie selectată
  date: string;          // Format: 'YYYY-MM-DD'
  recurring: boolean;    // Dacă este recurentă
  frequency?: FrequencyType; // Din FrequencyType enum, doar dacă recurring=true
};

// La submitere, se convertește în:
type TransactionCreatePayload = {
  type: TransactionType;
  amount: number;        // Amount convertit la număr pentru backend
  category: string;
  subcategory: string;
  date: string;
  recurring: boolean;
  frequency?: FrequencyType;
  userId: string;        // Adăugat din authStore [NOU]
};
```

### [NOU 2025-05-22] Hook-ul specializat useTransactionFormState

Componenta TransactionForm utilizează acum un hook specializat pentru gestionarea stării formularului:

```tsx
// În componenta TransactionForm
import { useTransactionFormState } from 'hooks/useTransactionFormState';
import { useTransactionMutations } from 'services/hooks/useTransactionMutations';
import { useThemeEffects } from 'hooks/useThemeEffects';

const TransactionForm = ({
  initialData,
  onSave,
  onCancel,
  withShadow = false,
  withFadeIn = false,
}) => {
  // Hook pentru efecte vizuale
  const { getClasses } = useThemeEffects({ withShadow, withFadeIn });
  
  // Hook pentru stare formular
  const {
    formState,
    errors,
    handleChange,
    handleCheckboxChange,
    validateForm,
    resetForm
  } = useTransactionFormState(initialData);
  
  // Hook pentru mutații React Query
  const { create, update } = useTransactionMutations();
  
  // Handler de submit cu optimistic update
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const payload = preparePayloadFromForm(formState);
    
    try {
      if (initialData?.id) {
        await update.mutateAsync(payload);
      } else {
        await create.mutateAsync(payload);
      }
      
      resetForm();
      onSave?.(payload);
    } catch (error) {
      // Gestionare eroare
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className={getClasses('form', 'primary', 'lg')}
      data-testid="transaction-form"
    >
      {/* Inputs cu gestionare erori */}
      <Input
        label={UI.LABELS.AMOUNT}
        value={formState.amount}
        onChange={(e) => handleChange('amount', e.target.value)}
        error={errors.amount}
        data-testid="amount-input"
        withGlowFocus={true}
      />
      
      {/* Restul componentelor formularului cu props withEffect pentru efecte vizuale */}
    </form>
  );
};
```

### [NOU 2025-05-22] Integrare cu hooks specializate

Implementarea modernă separă logica în hooks specializate:

1. **useTransactionFormState**: Gestionează starea formularului, validarea și transformarea datelor
2. **useTransactionMutations**: Gestionează operațiunile CRUD cu optimistic updates
3. **useThemeEffects**: Aplică efecte vizuale consistente în toate componentele

Această separare facilitează testarea și mentenabilitatea, conform pattern-urilor din BEST_PRACTICES.md.
1.2 LunarGrid (TanStack Table Implementation)
Exemplu Utilizare:
```tsx
// În LunarGridPage.tsx
import { LunarGridTanStack } from '../components/features/LunarGrid';
import { useMonthlyTransactions } from 'services/hooks';
import { useLunarGridStore } from 'stores/lunarGridStore'; // [NOU 2025-05-22]

const MyLunarGrid = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  
  // [NOU 2025-05-22] Utilizare store dedicat pentru LunarGrid
  const { 
    expandedCategories, 
    toggleCategory,
    expandAll,
    collapseAll,
    selectedCell,
    selectCell,
    startEditing,
    stopEditing
  } = useLunarGridStore();
  
  // Utilizare hook specializat pentru date cu React Query
  const { data: transactions, isLoading } = useMonthlyTransactions({ year, month });
  
  // Categorii (din store sau hook)
  const categories = useCategoryStore(state => state.categories);
  
  // Handler click celulă
  const handleCellClick = useCallback((category: string, day: number, event: React.MouseEvent) => {
    selectCell({ category, day });
    
    // Verificăm dacă este click + SHIFT pentru multi-select sau click simplu
    if (event.shiftKey && selectedCell) {
      // Logica pentru multi-select
    } else {
      // Logica pentru click simplu
    }
  }, [selectCell, selectedCell]);
  
  // Handler dublu-click pentru editare
  const handleCellDoubleClick = useCallback((category: string, day: number) => {
    selectCell({ category, day });
    startEditing();
  }, [selectCell, startEditing]);
  
  if (isLoading) return <Loader size="lg" withFadeIn={true} />;
  
  return (
    <div className={getEnhancedComponentClasses('container', 'default', 'lg')}>
      <div className={getEnhancedComponentClasses('card', 'elevated', 'lg', undefined, ['withFadeIn'])}>
        <div className={getEnhancedComponentClasses('card-header', 'default')}>
          <h2 className={getEnhancedComponentClasses('heading', 'md', undefined, undefined, ['withGradient'])}>
            {`${getMonthName(month)} ${year}`}
          </h2>
          <div className={getEnhancedComponentClasses('button-group', 'default')}>
            <Button 
              onClick={() => setMonth(prev => Math.max(1, prev - 1))}
              variant="secondary"
              size="sm"
              withHoverEffect={true}
              data-testid="prev-month-btn"
            >
              Luna anterioară
            </Button>
            <Button 
              onClick={() => setMonth(prev => Math.min(12, prev + 1))}
              variant="secondary"
              size="sm"
              withHoverEffect={true}
              data-testid="next-month-btn"
            >
              Luna următoare
            </Button>
          </div>
        </div>

        <div className={getEnhancedComponentClasses('card-body', 'default')}>
          <div className={getEnhancedComponentClasses('toolbar', 'default')}>
            <Button 
              onClick={expandAll} 
              variant="outline" 
              size="sm" 
              data-testid="expand-all-btn"
            >
              Expandează tot
            </Button>
            <Button 
              onClick={collapseAll} 
              variant="outline" 
              size="sm"
              data-testid="collapse-all-btn"
            >
              Restrânge tot
            </Button>
          </div>
          
          <LunarGridTanStack 
            transactions={transactions || []}
            categories={categories}
            expandedCategories={expandedCategories}
            year={year}
            month={month}
            onCellClick={handleCellClick}
            onCellDoubleClick={handleCellDoubleClick}
            onCategoryToggle={toggleCategory}
            selectedCell={selectedCell}
            isEditing={useLunarGridStore(state => state.editMode)}
            withVirtualization={true} // [NOU 2025-05-22] - Activează virtualizarea
            withShadow={true} // [NOU 2025-05-22] - Efect vizual
            withHoverEffect={true} // [NOU 2025-05-22] - Efect vizual
          />
        </div>
      </div>
    </div>
  );
};
```

1.2.1 Utilizare utils/lunarGrid

Structura utilitarelor pentru LunarGrid:

```
frontend/src/utils/lunarGrid/
├── calculations.ts     # Calcule pentru sume și transformări cu memorare
├── formatters.ts       # Formatare valori monetare și date
├── dataTransformers.ts # Transformă date pentru structura de tabel
├── keyboardNavigation.ts # [NOU 2025-05-22] Utilitare pentru navigarea cu tastatura
└── index.ts           # Export barrel al tuturor funcțiilor
```

Exemplu utilizare utilitare pentru date:

```typescript
import { 
  calculateAmountsForCategory, 
  calculateDailyBalance,
  formatCurrency, 
  transformTransactionsToRowData,
  getBalanceStyleClass
} from '../../utils/lunarGrid';

// Calculează sumele zilnice pentru o categorie
const dailyAmounts = calculateAmountsForCategory(
  'Cheltuieli', 
  transactions
);

// Formatează o sumă pentru afișare 
const formattedAmount = formatCurrency(1234.56); // "1.234,56 RON"

// Obține clase CSS pentru stilizare sume pozitive/negative
const amountClass = getBalanceStyleClass(-500); // returnează clasele pentru sume negative

// Transformă datele pentru tabel
const rowData = transformTransactionsToRowData(
  transactions,
  categories,
  expandedCategories
);
```

### [NOU 2025-05-22] Utilizare memoizare și invalidare cache

```typescript
// În utils/lunarGrid/calculations.ts
// Cache pentru funcțiile de calcul costisitoare
const balanceCache = new Map<string, Record<number, number>>();

export function calculateDailyBalance(
  transactions: Transaction[],
  year: number,
  month: number
): Record<number, number> {
  // Generare cheie unică pentru cache
  const cacheKey = `balance-${year}-${month}-${transactions.length}-${transactions[0]?.id || 'empty'}`;
  
  // Verifică dacă rezultatul este deja în cache
  if (balanceCache.has(cacheKey)) {
    return balanceCache.get(cacheKey)!;
  }
  
  // Calculare efectivă a soldurilor zilnice
  const daysInMonth = getDaysInMonth(year, month);
  const result: Record<number, number> = {};
  
  // Logica de calcul a soldului zilnic
  for (let day = 1; day <= daysInMonth; day++) {
    // ... logica de calcul ...
    result[day] = calculatedBalance;
  }
  
  // Salvare în cache pentru utilizări viitoare
  balanceCache.set(cacheKey, result);
  return result;
}

// Funcție pentru invalidarea cache-ului când datele se schimbă
export function resetCalculationsCache(): void {
  balanceCache.clear();
}
```

1.2.2 Hook-ul useLunarGridTable [ACTUALIZAT 2025-05-22]
Hook-ul central pentru gestiunea stării și logicii tabelului:

```typescript
const { 
  // Instanța tabelului TanStack
  table,
  // Array zilele lunii: [1, 2, ..., 31]
  days,
  // Virtualizare pentru performanță
  rowVirtualizer,
  // Solduri zilnice calculate
  dailyBalances,
  // Utilitare pentru obținerea sumelor în celule
  getSumForCell,
  // Actualizare date externe
  updateTableData,
  // [NOU] Suport pentru keyboard navigation
  handleKeyDown,
  // [NOU] Suport pentru editare celule
  startCellEdit,
  endCellEdit,
  isCellEditing
} = useLunarGridTable({
  transactions,    // Tranzacții de afișat
  categories,      // Categorii și subcategorii
  expandedCategories, // Ce categorii sunt expandate
  year,            // Anul curent
  month,           // Luna curentă (1-12)
  onCellClick,     // Handler pentru click pe celulă
  onCellDoubleClick, // Handler pentru dublu-click (editare)
  selectedCell,    // Celula selectată curent
  withVirtualization, // Activează virtualizarea pentru performanță
});
```

Implementarea internă cu memoizare și virtualizare:

```typescript
// Structura internă a hook-ului useLunarGridTable
const useLunarGridTable = (props) => {
  // Referințe pentru containerul tabelului și virtualizare
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  // State intern pentru gestionarea datelor tabelului
  const [tableData, setTableData] = useState<RowData[]>([]);
  
  // Calculăm datele fără side effects folosind memoizare
  const data = useMemo(() => 
    transformTransactionsToRowData(
      props.transactions, 
      props.categories, 
      props.expandedCategories
    ),
    [props.transactions, props.categories, props.expandedCategories]
  );
  
  // Zilele lunii - memoizate pentru a preveni recalcularea
  const days = useMemo(() => {
    const daysInMonth = getDaysInMonth(props.year, props.month);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [props.year, props.month]);
  
  // Solduri zilnice - memoizate cu cache intern
  const dailyBalances = useMemo(() => 
    calculateDailyBalance(props.transactions, props.year, props.month),
    [props.transactions, props.year, props.month]
  );
  
  // Definirea coloanelor TanStack
  const columns = useMemo(() => [
    // Coloana fixă pentru categorie
    {
      id: 'category',
      header: 'Categorie',
      cell: (info) => (
        <CategoryCell 
          info={info} 
          onToggle={props.onCategoryToggle} 
        />
      ),
      size: 200
    },
    // Coloane dinamice pentru zilele lunii
    ...days.map(day => ({
      id: `day-${day}`,
      header: day.toString(),
      cell: (info) => (
        <DayCell 
          info={info} 
          day={day} 
          onCellClick={(e) => props.onCellClick(info.row.original.category, day, e)}
          onCellDoubleClick={() => props.onCellDoubleClick(info.row.original.category, day)}
          isSelected={
            props.selectedCell?.category === info.row.original.category && 
            props.selectedCell?.day === day
          }
          isEditing={props.isCellEditing}
        />
      ),
      size: 80
    }))
  ], [days, props.onCategoryToggle, props.onCellClick, props.onCellDoubleClick, props.selectedCell, props.isCellEditing]);
  
  // Definirea tabelului TanStack
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  
  // Virtualizare pentru randare eficientă
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 35, // înălțimea estimată a rândului
    overscan: 5 // câte rânduri să renderăm în plus față de ce se vede
  });
  
  // Sincronizăm state-ul când datele se schimbă
  useEffect(() => {
    setTableData(data);
  }, [data]);
  
  // [NOU] Handler pentru tastatura (navigare, editare)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!props.selectedCell) return;
    
    const { category, day } = props.selectedCell;
    
    // Logica de navigare cu săgeți
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
        e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      // ... implementare navigare cu tastatura ...
    }
    
    // Editare la apăsarea Enter sau F2
    if (e.key === 'Enter' || e.key === 'F2') {
      props.onCellDoubleClick(category, day);
    }
    
    // Escape pentru anulare editare
    if (e.key === 'Escape') {
      endCellEdit();
    }
  }, [props.selectedCell, props.onCellDoubleClick, endCellEdit]);
  
  return {
    table,
    days,
    rowVirtualizer,
    dailyBalances,
    getSumForCell: useCallback((category, day) => {
      // ... implementare obținere sumă pentru celulă ...
    }, [props.transactions, props.year, props.month]),
    updateTableData: useCallback(() => {
      setTableData(transformTransactionsToRowData(
        props.transactions, 
        props.categories, 
        props.expandedCategories
      ));
    }, [props.transactions, props.categories, props.expandedCategories]),
    handleKeyDown,
    startCellEdit: useCallback(() => {
      // ... implementare începere editare celulă ...
    }, []),
    endCellEdit: useCallback(() => {
      // ... implementare încheiere editare celulă ...
    }, []),
    isCellEditing: useRef(false).current
  };
};
```

1.3 TransactionTable
Exemplu Utilizare:
```tsx
// În TransactionsPage.tsx
import { TransactionTable } from '../components/features/TransactionTable';
import { useInfiniteTransactions } from 'services/hooks/useInfiniteTransactions';
import { useTransactionFiltersStore } from 'stores/transactionFiltersStore';

// Exemplu complet cu paginare infinită [ACTUALIZAT 2025-05-22]
const TransactionsWithInfiniteLoading = () => {
  const filters = useTransactionFiltersStore(s => s.filters);
  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage 
  } = useInfiniteTransactions(filters);
  
  // Referință pentru observarea ultimului element (infinite scroll)
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  
  // Configurarea observerului pentru infinite scroll
  useEffect(() => {
    if (isLoading) return;
    
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    
    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }
    
    return () => observerRef.current?.disconnect();
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);
  
  // Obținerea listei de tranzacții din paginile încărcate
  const transactions = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);
  
  return (
    <div className={getEnhancedComponentClasses('container', 'fluid')}>
      <TransactionTable
        transactions={transactions}
        isLoading={isLoading}
        lastItemRef={lastElementRef}
        withShadow={true}
        withFadeIn={true}
      />
      
      {isFetchingNextPage && (
        <div className={getEnhancedComponentClasses('loader-container', 'centered')}>
          <Loader size="md" withPulse={true} data-testid="loading-more" />
        </div>
      )}
    </div>
  );
};

### [NOU 2025-05-22] Pattern Optimizări TransactionTable

```tsx
// În componenta TransactionTable.tsx
const TransactionTable = ({
  transactions,
  isLoading,
  lastItemRef,
  withShadow = false,
  withFadeIn = false
}) => {
  // Hook pentru efecte vizuale
  const { getClasses } = useThemeEffects({ withShadow, withFadeIn });
  
  // Memoizare pentru sortare
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [transactions]);
  
  // Render optimizat pentru rânduri - evită re-render-uri inutile
  const renderRow = useCallback(({ transaction, index }) => {
    const isLast = index === sortedTransactions.length - 1;
    
    return (
      <tr 
        key={transaction.id}
        ref={isLast ? lastItemRef : undefined}
        className={getClasses('table-row', undefined, undefined, undefined, 
          [index % 2 === 0 ? 'withEvenRowBackground' : 'withOddRowBackground']
        )}
        data-testid={`transaction-row-${transaction.id}`}
      >
        <td>{formatDate(transaction.date)}</td>
        <td>{transaction.category}</td>
        <td>{transaction.subcategory}</td>
        <td className={getClasses(
          'amount',
          transaction.type === TransactionType.EXPENSE ? 'negative' : 'positive'
        )}>
          {formatCurrency(transaction.amount, transaction.currency)}
        </td>
        <td>
          <div className={getClasses('actions', 'horizontal')}>
            <Button
              variant="icon"
              size="sm"
              onClick={() => handleEdit(transaction)}
              data-testid={`edit-transaction-${transaction.id}`}
              withHoverEffect={true}
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="icon"
              size="sm"
              onClick={() => handleDelete(transaction)}
              data-testid={`delete-transaction-${transaction.id}`}
              withHoverEffect={true}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </td>
      </tr>
    );
  }, [sortedTransactions, lastItemRef, getClasses, handleEdit, handleDelete]);
  
  // Render eficient al listei - pentru evitarea re-renderurilor inutile
  const tableBody = useMemo(() => {
    return sortedTransactions.map((transaction, index) => 
      renderRow({ transaction, index })
    );
  }, [sortedTransactions, renderRow]);
  
  if (isLoading && !transactions.length) {
    return <Loader size="lg" withFadeIn={true} data-testid="loading-transactions" />;
  }
  
  return (
    <div className={getClasses('table-container', 'default')}>
      <table className={getClasses('table', 'full-width')}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Categorie</th>
            <th>Subcategorie</th>
            <th>Sumă</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </table>
      
      {!isLoading && transactions.length === 0 && (
        <div className={getClasses('empty-state', 'centered')}>
          <p>{MESAJE.NO_TRANSACTIONS}</p>
        </div>
      )}
    </div>
  );
};

// Optimizare cu React.memo
export default React.memo(TransactionTable);
```

1.4 React Query Hooks Specializate [NOU 2025-05-22]

Implementarea modernă utilizează hooks specializate React Query pentru operațiuni de date:

```tsx
// În services/hooks/useInfiniteTransactions.ts
export function useInfiniteTransactions(queryParams: TransactionQueryParams) {
  const { user } = useAuthStore();
  const userId = user?.id;
  const queryClient = useQueryClient();
  
  return useInfiniteQuery({
    queryKey: queryKeys.transactions.infinite(queryParams, userId),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const pagination = {
        limit: PAGE_SIZE,
        offset: pageParam as number,
        sort: queryParams.sort,
        order: queryParams.order,
      };
      
      return await supabaseService.fetchTransactions(userId, pagination, queryParams);
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentOffset = allPages.length * PAGE_SIZE;
      
      if (lastPage.data.length < PAGE_SIZE || currentOffset >= lastPage.count) {
        return undefined;
      }
      
      return currentOffset;
    },
    staleTime: 30 * 1000, // 30 secunde
    keepPreviousData: true, // Păstrează datele vechi în timpul refetch pentru UX fluid
    enabled: !!userId,
  });
}

// În services/hooks/useMonthlyTransactions.ts
export function useMonthlyTransactions({ year, month }: MonthlyParams) {
  const { user } = useAuthStore();
  const userId = user?.id;
  
  return useQuery({
    queryKey: queryKeys.transactions.monthly(year, month, userId),
    queryFn: () => transactionService.getMonthlyTransactions(year, month, userId),
    staleTime: 5 * 60 * 1000, // 5 minute cache
    gcTime: 30 * 60 * 1000, // 30 minute garbage collection
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: !!userId,
  });
}

// În services/hooks/useTransactionMutations.ts
export function useTransactionMutations() {
  const queryClient = useQueryClient();
  
  return {
    create: useMutation({
      mutationFn: (data: TransactionInput) => transactionService.createTransaction(data),
      onMutate: async (newTransaction) => {
        // Anulare queries în desfășurare
        await queryClient.cancelQueries({ queryKey: queryKeys.transactions.all });
        
        // Salvare stare anterioară pentru rollback
        const previousData = queryClient.getQueryData(
          queryKeys.transactions.monthly(newTransaction.year, newTransaction.month)
        );
        
        // Optimistic update
        if (previousData) {
          queryClient.setQueryData(
            queryKeys.transactions.monthly(newTransaction.year, newTransaction.month),
            (old: any) => {
              return {
                ...old,
                data: [...old.data, { ...newTransaction, id: `temp-${Date.now()}` }]
              };
            }
          );
        }
        
        return { previousData };
      },
      onError: (err, newTransaction, context) => {
        // Rollback în caz de eroare
        if (context?.previousData) {
          queryClient.setQueryData(
            queryKeys.transactions.monthly(newTransaction.year, newTransaction.month),
            context.previousData
          );
        }
      },
      onSuccess: () => {
        // Invalidare pentru reîncărcare date
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      },
    }),
    
    update: useMutation({
      mutationFn: (data: TransactionUpdateInput) => transactionService.updateTransaction(data),
      // Logică similară optimistic update pentru update
    }),
    
    delete: useMutation({
      mutationFn: (id: string) => transactionService.deleteTransaction(id),
      // Logică similară optimistic update pentru delete
    }),
  };
}

// În services/hooks/useActiveSubcategories.ts [NOU 2025-05-22]
export function useActiveSubcategories(category: string, type: TransactionType) {
  const { user } = useAuthStore();
  const userId = user?.id;
  
  const query = useQuery({
    queryKey: queryKeys.subcategories.active(category, type, userId),
    queryFn: () => categoryService.getActiveSubcategories(userId, category, type),
    staleTime: 10 * 60 * 1000, // 10 minute cache
    enabled: !!userId && !!category && !!type,
  });
  
  // Formatare date pentru componenta Select
  const formattedOptions = useMemo(() => {
    if (!query.data) return [];
    
    return query.data.map(subcategory => ({
      label: `${subcategory.name} (${subcategory.count})`,
      value: subcategory.name,
      count: subcategory.count
    }));
  }, [query.data]);
  
  return {
    ...query,
    options: formattedOptions,
  };
}
```

1.5 CategoryEditor [ACTUALIZAT 2025-05-22]
Exemplu Utilizare:
```tsx
// În OptionsPage.tsx
import { CategoryEditor } from '../components/features/CategoryEditor';
import { useAuthStore } from '../stores/authStore';

const OptionsPageWithCategoryEditor = () => {
  const [showEditor, setShowEditor] = useState(false);
  const { user } = useAuthStore();
  
  return (
    <div className={getEnhancedComponentClasses('container', 'default')}>
      <Button 
        onClick={() => setShowEditor(true)}
        variant="primary"
        size="md"
        withShadow={true}
        data-testid="manage-categories-btn"
      >
        Gestionare Categorii
      </Button>

      {/* Modal pentru editarea categoriilor */}
      <CategoryEditor
        open={showEditor}
        onClose={() => setShowEditor(false)}
        userId={user?.id || ''}
        // Proprietăți opționale pentru deschidere directă în mod specific
        initialCategory="NUTRITIE"
        initialSubcategory="Restaurante"
        initialMode="edit" // 'edit' | 'delete' | 'add'
        // Efecte vizuale
        withFadeIn={true}
        withSlideIn={true}
      />
    </div>
  );
};
```

### [NOU 2025-05-22] Hook-ul useCategoryEditorState

```tsx
// În hooks/useCategoryEditorState.ts
export function useCategoryEditorState({
  userId,
  initialCategory,
  initialSubcategory,
  initialMode
}) {
  // State pentru categorii și subcategorii
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State pentru acțiuni
  const [editingSubcat, setEditingSubcat] = useState<{cat: string, subcat: string} | null>(
    initialMode === 'edit' && initialCategory && initialSubcategory 
      ? { cat: initialCategory, subcat: initialSubcategory }
      : null
  );
  const [deletingSubcat, setDeletingSubcat] = useState<{cat: string, subcat: string} | null>(
    initialMode === 'delete' && initialCategory && initialSubcategory 
      ? { cat: initialCategory, subcat: initialSubcategory }
      : null
  );
  const [addingSubcat, setAddingSubcat] = useState<string | null>(
    initialMode === 'add' && initialCategory ? initialCategory : null
  );
  
  // State pentru values
  const [renameValue, setRenameValue] = useState(initialSubcategory || '');
  const [newSubcatValue, setNewSubcatValue] = useState('');
  
  // Logica de încărcare categorii
  useEffect(() => {
    if (!userId) return;
    
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const userCategories = await categoryService.getUserCategories(userId);
        setCategories(userCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, [userId]);
  
  // Funcții de validare memoizate
  const validateRename = useCallback((newName: string) => {
    if (!editingSubcat) return true;
    
    // Logica de validare nume
    if (newName.trim().length < 2) {
      return false;
    }
    
    // Verificare nume duplicate
    const category = categories.find(c => c.name === editingSubcat.cat);
    if (!category) return true;
    
    return !category.subcategories.some(s => 
      s.toLowerCase() === newName.toLowerCase() && 
      s !== editingSubcat.subcat
    );
  }, [editingSubcat, categories]);
  
  // Funcții de acțiune
  const handleRename = useCallback(async (categoryName: string, subcatName: string, newName: string) => {
    if (!validateRename(newName)) return;
    
    setIsLoading(true);
    try {
      await categoryService.handleSubcategoryRename(userId, categoryName, subcatName, newName);
      
      // Actualizare state local
      setCategories(prev => 
        prev.map(cat => {
          if (cat.name !== categoryName) return cat;
          
          return {
            ...cat,
            subcategories: cat.subcategories.map(s => 
              s === subcatName ? newName : s
            )
          };
        })
      );
      
      setEditingSubcat(null);
      setRenameValue('');
    } catch (error) {
      console.error('Error renaming subcategory:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, validateRename]);
  
  // Funcții similare pentru add, delete, etc.
  
  return {
    categories,
    isLoading,
    editingSubcat,
    setEditingSubcat,
    deletingSubcat,
    setDeletingSubcat,
    addingSubcat,
    setAddingSubcat,
    renameValue,
    setRenameValue,
    newSubcatValue,
    setNewSubcatValue,
    validateRename,
    handleRename,
    // Funcțiile pentru add, delete, etc.
  };
}
```

1.6 Componente Primitive Moderne cu useThemeEffects [NOU 2025-05-22]

Toate componentele primitive folosesc acum hook-ul useThemeEffects pentru gestionarea consistentă a efectelor vizuale:

```tsx
// În components/primitives/Button/Button.tsx
import { useThemeEffects } from 'hooks/useThemeEffects';
import { UI } from '@shared-constants';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  withShadow?: boolean;
  withGradient?: boolean;
  withHoverEffect?: boolean;
  withFadeIn?: boolean;
  children: React.ReactNode;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  withShadow = false,
  withGradient = false,
  withHoverEffect = false,
  withFadeIn = false,
  disabled = false,
  children,
  className,
  ...props
}: ButtonProps) => {
  // Hook pentru efecte vizuale
  const { getClasses } = useThemeEffects({
    withShadow,
    withGradient,
    withHoverEffect,
    withFadeIn
  });
  
  // Utilizare getClasses pentru aplicarea consistentă a stilurilor
  const classes = getClasses(
    'button',              // Componentă
    variant,               // Variantă 
    size,                  // Dimensiune
    isLoading ? 'loading' : disabled ? 'disabled' : undefined  // Stare
  );
  
  return (
    <button 
      className={classes}
      disabled={disabled || isLoading}
      data-testid={props['data-testid'] || `btn-${variant}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <span className="mr-2">{UI.BUTTONS.LOADING}</span>
          <Spinner size="sm" />
        </span>
      ) : children}
    </button>
  );
};

// Optimizare cu React.memo
export default React.memo(Button);
```

Exemplu utilizare Input cu efecte vizuale:

```tsx
// În components/primitives/Input/Input.tsx
import { useThemeEffects } from 'hooks/useThemeEffects';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  withGlowFocus?: boolean;
  withFadeIn?: boolean;
  withFloatingLabel?: boolean;
}

const Input = ({
  label,
  error,
  withGlowFocus = false,
  withFadeIn = false,
  withFloatingLabel = false,
  className,
  ...props
}: InputProps) => {
  const { getClasses, hasEffect } = useThemeEffects({
    withGlowFocus,
    withFadeIn,
    withFloatingLabel
  });
  
  const containerClasses = getClasses('input-container', undefined, undefined, error ? 'error' : undefined);
  const inputClasses = getClasses('input', props.disabled ? 'disabled' : 'default');
  const labelClasses = getClasses('input-label', withFloatingLabel ? 'floating' : 'default');
  const errorClasses = getClasses('input-error', 'default');
  
  return (
    <div className={containerClasses}>
      {label && (
        <label 
          htmlFor={props.id} 
          className={labelClasses}
          data-testid={`${props.id || props.name}-label`}
        >
          {label}
        </label>
      )}
      
      <input
        className={inputClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id || props.name}-error` : undefined}
        data-testid={props['data-testid'] || props.id || props.name}
        {...props}
      />
      
      {hasEffect('withGlowFocus') && (
        <div className={getClasses('input-focus-indicator', 'default')} />
      )}
      
      {error && (
        <div 
          className={errorClasses}
          id={`${props.id || props.name}-error`}
          data-testid={`${props.id || props.name}-error`}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default React.memo(Input);
```

### Pattern aplicare efecte vizuale în componentMap

Componentele primitive utilizează un pattern comun pentru definirea efectelor vizuale în componentMap:

```tsx
// În styles/componentMap/input.ts
export const inputConfig = {
  // Clase de bază
  base: 'w-full px-3 py-2 border rounded focus:outline-none transition-all duration-200',
  
  // Variante
  variants: {
    default: 'border-neutral-300 focus:border-primary-500 bg-white',
    disabled: 'border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed',
    // ...alte variante
  },
  
  // State (error, focus, etc)
  states: {
    error: 'border-error-500',
    // ...alte state
  },
  
  // Efecte vizuale
  effects: {
    // Efect de glow la focus
    withGlowFocus: {
      container: 'relative',
      indicator: 'absolute inset-0 pointer-events-none rounded ring-2 ring-primary-300 ring-opacity-50 transition-opacity opacity-0 focus-within:opacity-100',
    },
    
    // Efect de fade in la afișare
    withFadeIn: 'animate-fadeIn',
    
    // Efect de label flotant
    withFloatingLabel: {
      container: 'pt-6 relative',
      label: 'absolute top-0 left-2 text-xs text-neutral-600 transition-all',
    }
  },
  
  // Configurare pentru subcomponente
  subcomponents: {
    'input-container': 'mb-4',
    'input-label': 'block text-sm font-medium text-neutral-700 mb-1',
    'input-error': 'mt-1 text-sm text-error-600',
  }
};
```

### Aplicarea uniformă a efectelor în componente de feature

```tsx
// Exemplu utilizare într-o componentă de feature
const MyFeatureComponent = () => {
  return (
    <div className={getEnhancedComponentClasses('container', 'default')}>
      <h2 className={getEnhancedComponentClasses('heading', 'lg', undefined, undefined, ['withGradient'])}>
        Titlu secțiune
      </h2>
      
      <div className={getEnhancedComponentClasses('card', 'elevated', 'lg', undefined, ['withShadow', 'withFadeIn'])}>
        <form>
          <Input
            label="Nume"
            withGlowFocus={true}
            withFloatingLabel={true}
            data-testid="name-input"
          />
          
          <Input
            label="Email"
            withGlowFocus={true}
            withFloatingLabel={true}
            data-testid="email-input"
          />
          
          <div className={getEnhancedComponentClasses('button-group', 'end')}>
            <Button variant="outline" withHoverEffect={true} data-testid="cancel-btn">
              {UI.BUTTONS.CANCEL}
            </Button>
            <Button variant="primary" withShadow={true} withGradient={true} data-testid="submit-btn">
              {UI.BUTTONS.SUBMIT}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

Concluzii și Recomandări pentru Implementare
Cu aceste exemple, diagrame și pattern-uri, un dezvoltator sau un AI ar trebui să aibă o înțelegere mult mai bună a modului în care funcționează componentele și cum interacționează între ele. Câteva recomandări practice pentru implementare:

Studiază fluxurile de date înainte de cod: Înțelegerea fluxului de date ajută la identificarea dependențelor corecte.
Respectă pattern-urile stabilite: Folosește state separat pentru moduri conflictuale (editare vs. ștergere).
Citește BEST_PRACTICES.md: Documentul conține reguli specifice pentru import/export, state management și optimizări.
Testează cu date reale: Folosește mock-uri minime, testează cu date cât mai apropiate de producție.
Validează importurile: Folosește utilitarul npm run validate:constants pentru a verifica corectitudinea importurilor.

2.3 Flux Editare Tranzacție în LunarGridTanStack (Nou)
┌──────────────────┌      ┌──────────────────┌      ┌──────────────────┌
│ Celulă TanStack   │┐1────→│ onCellClick/     │┐2────→│ useLunarGridTable │
│ (getVirtualItems) │      │ onCellDoubleClick│      │  Event Handlers  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
                                                           ⌄3
                                                           ↓
┌──────────────────┌      ┌──────────────────┌      ┌──────────────────┌
│ TanStack Rerender │┐7────└─────────────│ Cache Reset +    │┐6────└─────────────│ transactionStore │
│ + Virtualizare    │      │ updateTableData │      │ saveTransaction │
└──────────────────┘      └──────────────────┘      └──────────────────┘
                                                           ⌄4
                                                           ↓
                                                   ┌──────────────────┌
                                                   │ supabaseService │
                                                   └──────────────────┘
                                                           ⌄5
                                                           ↓
                                                   ┌──────────────────┌
                                                   │   Supabase DB    │
                                                   └──────────────────┘

Flux Optimizat:

1. Utilizatorul interacționează cu o celulă din grid-ul virtualizat TanStack
   - Click simpu -> onCellClick(category, day)
   - Dublu-click -> onCellDoubleClick(category, day)

2. Aceste handler-uri sunt transmise în useLunarGridTable și apelate cu datele celulei

3. În handler-ul corespunzător (definit în LunarGridPage.tsx), se poate afișa un modal,
   se poate executa logica de business sau se poate salva o tranzacție direct

4. transactionStore.saveTransaction() este apelat cu datele noi/modificate
   și comunică cu supabaseService pentru persistenta datelor

5. Datele sunt salvate în Supabase DB

6. După salvare, cache-ul de calcule este resetat prin resetCalculationsCache()
   și funcția updateTableData() este apelată pentru actualizarea datelor

7. React re-renderează componentele afectate folosind TanStack Table și virtualizare
   pentru a optimiza performanța chiar și cu seturi mari de date

Optimizări noi:

- Memorare și cache pentru calculele intensive (calculateAmountsForCategory, etc.)
- Virtualizare tabel pentru randare eficientă a mii de rânduri
- Separarea clară a logicii de business în hook-ul useLunarGridTable
- Schema ReactMemo pentru optimizarea re-render-ului componentelor

2.4 Flux React Query și Hooks Specializate [NOU 2025-05-22]

┌─────────────────┐       ┌─────────────────┐      ┌─────────────────┐
│ TransactionTable │──1───▶│useInfiniteQuery │──2──▶│ QueryClient     │
└─────────────────┘       │(React Query Hook)│      │ Cache           │
        ▲                 └─────────────────┘      └────────┬────────┘
        │                          │                         │
        │                          │                         │3
        │                          │                         ▼
        │                          │                 ┌─────────────────┐
        │6                         │4                │ queryKeys.ts    │
        │                          │                 │ structură unică │
        │                          │                 └────────┬────────┘
        │                          ▼                          │
        │                 ┌─────────────────┐                 │
        │                 │ supabaseService │◀────────────────┘5
        └─────────────────│  (API layer)    │
                          └────────┬────────┘
                                   │7
                                   ▼
                          ┌─────────────────┐
                          │  Supabase DB    │
                          └─────────────────┘

**Flux Optimizat React Query:**

1. **Inițializare și Solicitare Date**:
   - Componenta TransactionTable folosește hook-ul useInfiniteTransactions
   - Acest hook este un wrapper peste useInfiniteQuery din React Query

2. **Verificare Cache**:
   - React Query verifică dacă datele pentru query key există deja în cache
   - Dacă există și sunt proaspete (în limita staleTime), sunt returnate direct
   - Dacă nu există sau sunt expirate, continuă cu solicitarea la server

3. **Generare QueryKey Structurat**:
   - Folosește structura standardizată din queryKeys.ts:
   ```tsx
   queryKeys.transactions.infinite(filters, userId)
   // Rezultă în ['transactions', 'infinite', { filters, userId }]
   ```

4. **Execuție Query Function**:
   - Dacă datele nu sunt în cache, queryFn este executată
   - Aceasta apelează supabaseService.fetchTransactions cu parametri specificați

5. **Construirea Interogării Supabase**:
   - supabaseService primește parametrii și construiește query-ul Supabase 
   - Se aplică filtrare, sortare și paginare conform parametrilor

6. **Actualizare UI și Cache**:
   - Datele primite sunt plasate în cache-ul React Query
   - UI-ul se actualizează automat datorită pattern-ului declarativ

7. **Invalidare și Revalidare**:
   - Când apar mutații (create/update/delete), cache-ul este invalidat
   - queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all }) invalidează toate tranzacțiile
   - Următoarea solicitare va reîncărca datele de la server

**Optimizări cheie:**

1. **Structură QueryKey standardizată**:
   ```tsx
   // În queryKeys.ts
   export const queryKeys = {
     transactions: {
       all: ['transactions'] as const, // Key de bază pentru toate tranzacțiile
       monthly: (year, month, userId) => [...queryKeys.transactions.all, 'monthly', { year, month, userId }] as const,
       infinite: (params, userId) => [...queryKeys.transactions.all, 'infinite', { params, userId }] as const,
       detail: (id) => [...queryKeys.transactions.all, 'detail', id] as const,
     },
     categories: {
       // ...
     },
     subcategories: {
       // ...
     }
   };
   ```

2. **Configurări optimizate pentru hook-uri**:
   ```tsx
   // keepPreviousData: true - Menține datele vechi în timpul reîncărcării
   // staleTime: 5 * 60 * 1000 - Păstrează datele în cache pentru 5 minute
   // refetchOnWindowFocus: false - Nu reîncarcă automat la focalizarea ferestrei
   // enabled: !!userId - Condiționează rularea query-ului
   ```

3. **Optimistic Updates**:
   ```tsx
   // Salvează starea anterioară pentru rollback
   const previousData = queryClient.getQueryData(...);
   
   // Actualizare optimistă 
   queryClient.setQueryData(..., (old) => {
     // Actualizează datele local înainte de răspunsul de la server
   });
   
   // Rollback în caz de eroare
   if (error) {
     queryClient.setQueryData(..., previousData);
   }
   ```

4. **Paginare Infinită Eficientă**:
   ```tsx
   // getNextPageParam definește logica pentru paginare
   getNextPageParam: (lastPage, allPages) => {
     const currentOffset = allPages.length * PAGE_SIZE;
     
     // Verificare dacă mai sunt date disponibile
     if (lastPage.data.length < PAGE_SIZE) {
       return undefined; // Nu mai sunt pagini
     }
     
     return currentOffset; // Următorul offset pentru paginare
   }
   ```

Integrarea React Query optimizează dramatic gestionarea state-ului server, eliminând necesitatea gestionării manuale a stărilor de loading, error, și cache, permițând dezvoltatorilor să se concentreze pe experiența utilizatorului.
