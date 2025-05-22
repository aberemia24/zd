EXEMPLE CONCRETE, FLUXURI DE DATE ȘI PATTERN-URI UI

1. Exemple Concrete de Utilizare pentru Componente Majore
1.1 TransactionForm
Exemplu Utilizare:
tsx// În TransactionsPage.tsx
import { TransactionForm } from '../components/features';
import { BUTTONS } from '@shared-constants';

// Exemplu simplu
<TransactionForm />

// Exemplu cu callbacks
<TransactionForm
  onSave={(formData) => console.log('Tranzacție salvată:', formData)}
  onCancel={() => console.log('Formular anulat')}
  submitButtonText={BUTTONS.SAVE}
/>
Structura Datelor:
tsx// Tipul datelor din formular
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
};
1.2 LunarGrid (TanStack Table Implementation)
Exemplu Utilizare:
tsx// În LunarGridPage.tsx
import { LunarGridTanStack } from '../components/features/LunarGrid';
import { useMonthlyTransactions } from 'services/hooks';

const MyLunarGrid = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // Utilizare hook specializat pentru date
  const { data: transactions, isLoading } = useMonthlyTransactions({ year, month });
  
  // Categorii (din store sau hook)
  const categories = useCategoryStore(state => state.categories);
  
  // Gestiune expandare/colapsare categorii
  const toggleCategory = useCallback((categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  }, []);
  
  // Handler click celulă
  const handleCellClick = useCallback((category: string, day: number) => {
    console.log(`Click pe ${category}, ziua ${day}`);
  }, []);
  
  // Handler dublu-click pentru editare
  const handleCellDoubleClick = useCallback((category: string, day: number) => {
    console.log(`Editare pentru ${category}, ziua ${day}`);
    // Aici se poate deschide un modal pentru editare/adăugare tranzacție
  }, []);
  
  if (isLoading) return <Loader size="lg" />;
  
  return (
    <div className={getEnhancedComponentClasses('container', 'default', 'lg')}>
      <div className={getEnhancedComponentClasses('card', 'elevated', 'lg', undefined, ['fadeIn'])}>
        <div className={getEnhancedComponentClasses('card-header', 'default')}>
          <h2 className={getEnhancedComponentClasses('heading', 'md', undefined, undefined, ['gradient-text'])}>
            {`${getMonthName(month)} ${year}`}
          </h2>
          <div className={getEnhancedComponentClasses('button-group', 'default')}>
            <button 
              onClick={() => setMonth(prev => Math.max(1, prev - 1))}
              className={getEnhancedComponentClasses('button', 'secondary', 'sm')}
            >
              Luna anterioară
            </button>
            <button 
              onClick={() => setMonth(prev => Math.min(12, prev + 1))}
              className={getEnhancedComponentClasses('button', 'secondary', 'sm')}
            >
              Luna următoare
            </button>
          </div>
        </div>

        <div className={getEnhancedComponentClasses('card-body', 'default')}>
          <LunarGridTanStack 
            transactions={transactions || []}
            categories={categories}
            expandedCategories={expandedCategories}
            year={year}
            month={month}
            onCellClick={handleCellClick}
            onCellDoubleClick={handleCellDoubleClick}
            onCategoryToggle={toggleCategory}
          />
        </div>
      </div>
    </div>
  );
};

1.2.1 Utilizare utils/lunarGrid

Structura utilitarelor pentru LunarGrid:

```
frontend/src/utils/lunarGrid/
├── calculations.ts     # Calcule pentru sume și transformări cu memorare
├── formatters.ts       # Formatare valori monetare și date
├── dataTransformers.ts # Transformă date pentru structura de tabel
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

1.2.2 Hook-ul useLunarGridTable
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
  updateTableData
} = useLunarGridTable({
  transactions,    // Tranzacții de afișat
  categories,      // Categorii și subcategorii
  expandedCategories, // Ce categorii sunt expandate
  year,            // Anul curent
  month,           // Luna curentă (1-12)
  onCellClick,     // Handler pentru click pe celulă
  onCellDoubleClick // Handler pentru dublu-click (editare)
});
```

Structura internă folosește memorare pentru prevenirea recalculării inutile:

```typescript
// Calculăm datele fără side effects
const data = useMemo(() => 
  transformTransactionsToRowData(transactions, categories, expandedCategories),
  [transactions, categories, expandedCategories]
);

// Sincronizăm state-ul când datele se schimbă
useEffect(() => {
  setTableData(data);
}, [data]);
```

1.2.3 Optimizări pentru performanță

- **Memorare pentru calcule costisitoare**:

```typescript
// Cache pentru funcțiile de calcul din calculations.ts
const categoryAmountsCache = new Map<string, Record<number, number>>();

// Generare cheie cache
const cacheKey = generateCacheKey(
  categoryName, 
  transactions.length,
  transactions[0]?.date || ''
);

// Verificare cache
if (categoryAmountsCache.has(cacheKey)) {
  return categoryAmountsCache.get(cacheKey)!;
}

// ... calcul efectiv ...

// Salvare în cache pentru viitor
categoryAmountsCache.set(cacheKey, result);
return result;
```

- **Virtualizare pentru randare eficientă**:

```typescript
// În hook-ul useLunarGridTable
const rowVirtualizer = useVirtualizer({
  count: table.getRowModel().rows.length,
  getScrollElement: () => tableContainerRef.current,
  estimateSize: () => 35, // înălțimea estimată a rândului
  overscan: 5 // câte rânduri să renderăm în plus față de ce se vede
});

// În componenta LunarGridTanStack
return (
  <div ref={tableContainerRef} className="table-container" style={{ height: '600px', overflow: 'auto' }}>
    <table>
      <thead>...</thead>
      <tbody>
        {/* Virtualizare pentru performanță */}
        <tr style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
          <td colSpan={days.length + 2}>
            <div style={{ position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map(virtualRow => {
                const row = table.getRowModel().rows[virtualRow.index];
                return (
                  <div
                    key={row.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`
                    }}
                  >
                    <TanStackSubcategoryRows
                      row={row}
                      days={days}
                      getSumForCell={getSumForCell}
                      onCategoryToggle={onCategoryToggle}
                    />
                  </div>
                );
              })}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);
```

- **Chei unice robuste pentru performanță**:

```typescript
// Generare chei unice robuste pentru subRows
const generateUniqueSubRowKey = (category: string, subcategory: string | null, index: number) => {
  if (subcategory) {
    return `${category}-${subcategory}`;
  }
  // Pentru rânduri fără subcategorie (rânduri goale)
  return `${category}-__empty-${index}`;
};

// Utilizare în transformData
const subRows = subcategories.map((subcategory, index) => {
  const key = generateUniqueSubRowKey(category, subcategory, index);
  return {
    id: key,
    category,
    subcategory,
    // ...restul datelor
  };
});
```

1.3 TransactionTable
Exemplu Utilizare:
tsx// În TransactionsPage.tsx
import TransactionTable from '../components/features/TransactionTable';
import { useTransactionFiltersStore } from '../stores/transactionFiltersStore';

// Exemplu complet cu paginare
const TransactionsWithPagination = () => {
  const limit = useTransactionFiltersStore(s => s.limit);
  const offset = useTransactionFiltersStore(s => s.offset);
  const setOffset = useTransactionFiltersStore(s => s.setOffset);
  
  // Callback pentru schimbare pagină
  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };
  
  return (
    <TransactionTable
      limit={limit}
      offset={offset}
      onPageChange={handlePageChange}
    />
  );
};
1.4 CategoryEditor
Exemplu Utilizare:
tsx// În OptionsPage.tsx
import { CategoryEditor } from '../components/features/CategoryEditor';
import { useAuthStore } from '../stores/authStore';

const OptionsPageWithCategoryEditor = () => {
  const [showEditor, setShowEditor] = useState(false);
  const { user } = useAuthStore();
  
  return (
    <div>
      <button onClick={() => setShowEditor(true)}>
        Gestionare Categorii
      </button>

      {/* Modal pentru editarea categoriilor */}
      <CategoryEditor
        open={showEditor}
        onClose={() => setShowEditor(false)}
        userId={user?.id || ''}
        // Proprietăți opționale pentru deschidere directă în mod specific
        initialCategory="NUTRITIE"
        initialSubcategory="Restaurante"
        initialMode="edit" // 'edit' | 'delete' | 'add'
      />
    </div>
  );
};
2. Diagrame de Flux de Date Mai Detaliate
2.1 Flux Transacții (TransactionStore)
┌─────────────────┐       ┌─────────────────┐      ┌─────────────────┐
│ TransactionForm │──1───▶│transactionForm  │──2──▶│ transactionStore│
└─────────────────┘       │     Store       │      └────────┬────────┘
                          └─────────────────┘               │
                                                            │3
                                                            ▼
┌─────────────────┐       ┌─────────────────┐      ┌─────────────────┐
│TransactionTable │◀──6───│transactionStore │◀──4──│ supabaseService │
└─────────────────┘       │fetchTransactions│      └────────┬────────┘
                          └─────────────────┘               │5
                                                            ▼
                                                     ┌─────────────────┐
                                                     │  Supabase DB    │
                                                     └─────────────────┘

Flux:

1. User completează și trimite formularul TransactionForm
2. transactionFormStore.handleSubmit() validează și apelează transactionStore.saveTransaction()
3. transactionStore apelează supabaseService.createTransaction() sau updateTransaction()
4. supabaseService execută operația în Supabase
5. Supabase returnează datele actualizate
6. transactionStore invalidează cache-ul și reîncarcă datele
7. TransactionTable se re-renderează automat cu datele noi

Cache & Invalidare:

- transactionStore menține un cache intern pentru fiecare lună/an
- Invalidarea cache-ului se face după orice operație de scriere (add/edit/delete)
- Cache-ul are TTL de 15 minute pentru refresh automat
2.2 Flux Categorii Personalizate (CategoryStore)
┌─────────────────┐       ┌─────────────────┐      ┌─────────────────┐
│  CategoryEditor │──1───▶│  categoryStore  │──2──▶│ categoryService │
└─────────────────┘       │   operations    │      └────────┬────────┘
                          └─────────────────┘               │3
                                                            ▼
┌─────────────────┐       ┌─────────────────┐      ┌─────────────────┐
│    LunarGrid    │◀──6───│ Merged categories◀──5──│  Supabase DB    │
└─────────────────┘       │ (custom+default) │     └────────┬────────┘
                          └─────────────────┘               │4
                                                            ▼
                                                     ┌─────────────────┐
                                                     │CATEGORIES const │
                                                     │(shared-constants)│
                                                     └─────────────────┘

Flux:

1. User adaugă/redenumește/șterge subcategorie în CategoryEditor
2. categoryStore.renameSubcategory() / addSubcategory() / deleteSubcategory() se apelează
3. categoryService execută operația CRUD în Supabase
4. La încărcare, categoryStore.loadUserCategories() aduce categoriile personalizate
5. categoryStore.mergeWithDefaults() fuzionează cu categoriile predefinite din CATEGORIES
6. Componentele UI (LunarGrid, TransactionForm) folosesc categoriile fuzionate
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

3. Pattern-uri de Interacțiune UI
3.1 Pattern: Editare în Grid (LunarGrid)
tsx// LunarGrid.tsx implementează trei pattern-uri de editare:

// 1. Click pe celulă -> Deschide popover cu formular complet
const handleCellClick = (
  e: React.MouseEvent<HTMLTableCellElement>,
  category: string,
  subcategory: string,
  day: number,
  amount: string,
  type: string
) => {
  setPopover({
    category,
    subcategory,
    day,
    anchorRect: e.currentTarget.getBoundingClientRect(),
    initialAmount: amount,
    type: getTransactionTypeForCategory(category),
  });
};

// 2. Double-click pe celulă -> Editare rapidă cu prompt
const handleCellDoubleClick = (
  e: React.MouseEvent<HTMLTableCellElement>,
  category: string,
  subcategory: string,
  day: number,
  currentAmount: string
) => {
  const type = getTransactionTypeForCategory(category);
  const newAmount = window.prompt(
    EXCEL_GRID.PROMPTS.ENTER_AMOUNT,
    currentAmount.replace(/[^0-9.-]/g, '')
  );

  if (newAmount && !isNaN(Number(newAmount))) {
    const date = new Date(year, month - 1, day);
    transactionStore.saveTransaction({
      amount: Number(newAmount),
      category,
      subcategory,
      type,
      date: date.toISOString().slice(0, 10),
      recurring: false,
      currency: 'RON',
    }).then(() => {
      // Invalidare cache și refresh
      transactionStore._invalidateMonthCache(year, month);
    });
  }
};

// 3. Keyboard pentru editare rapidă -> Focus pe celulă și trimitere direct la input
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    // Dacă utilizatorul tastează cifre direct, le trimitem la input
    if (e.key >= '0' && e.key <= '9') {
      setAmount(prev => (prev === '0' ? e.key : prev + e.key));
      inputRef.current?.focus();
    }
    // Enter salvează, Escape anulează
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') onCancel();
  }
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
3.2 Pattern: Expandare/Colapsare Categorii (LunarGrid)
tsx// Stare de expandare salvată în localStorage pentru persistență între sesiuni
const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
  try {
    const saved = localStorage.getItem(LOCALSTORAGE_CATEGORY_EXPAND_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    return {};
  }
});

// Handler pentru expandare/colapsare categorie
const toggleCategory = (category: string) => {
  setExpandedCategories(prev => {
    const newState = { ...prev, [category]: !prev[category] };

    // Salvează în localStorage
    try {
      localStorage.setItem(LOCALSTORAGE_CATEGORY_EXPAND_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    return newState;
  });
};

// Utilizare în componenta de randare
<tr
  className="bg-secondary-100 hover:bg-secondary-200 cursor-pointer"
  onClick={() => toggleCategory(categoryKey)}
  data-testid={`category-row-${categoryKey}`}
>
  <td className="...">
    {isExpanded ?
      <ChevronDown size={16} className="mr-1" /> :
      <ChevronRight size={16} className="mr-1" />}
    {categoryKey}
  </td>
  {/* ... */}
</tr>

{/*Afișează subcategoriile doar dacă categoria este expandată */}
{isExpanded && (
  <SubcategoryRows
    categoryKey={categoryKey}
    subcategories={subcategories}
    /* ...*/
  />
)}
3.3 Pattern: Editare/Ștergere Subcategorii (SubcategoryRows & CategoryEditor)
tsx// Două stări separate pentru editare și ștergere, conform best practice
const [editingSubcat, setEditingSubcat] = useState<{cat: string, subcat: string} | null>(null);
const [deletingSubcat, setDeletingSubcat] = useState<{cat: string, subcat: string} | null>(null);
const [deleteMode, setDeleteMode] = useState<boolean>(false);

// Gestionarea UI pentru editare și șteregere
{editingSubcat?.cat === categoryKey && editingSubcat.subcat === subcategory ? (
  // Modul de editare: afișează input și butoane de confirmare/anulare
  <div className="flex gap-2 items-center">
    <input
      type="text"
      value={renameValue}
      onChange={e => setRenameValue(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') handleRename(categoryKey, subcategory, renameValue);
        if (e.key === 'Escape') setEditingSubcat(null);
      }}
      className="input-field"
      autoFocus
      data-testid={`edit-subcat-input-${subcategory}`}
    />
    <button onClick={() => handleRename(categoryKey, subcategory, renameValue)}>
      {BUTTONS.DONE}
    </button>
    <button onClick={() => setEditingSubcat(null)}>
      {BUTTONS.CANCEL}
    </button>
  </div>
) : (
  // Modul normal: afișează subcategoria și butoane de acțiune
  <>
    <span>{subcategory}</span>
    {isCustomSubcategory && <span className="custom-indicator">custom</span>}
    <div className="actions hidden group-hover:flex">
      <button onClick={() => setEditingSubcat({ cat: categoryKey, subcat: subcategory })}>
        <Edit size={16} />
      </button>
      {isCustomSubcategory && (
        <button onClick={() => handleDelete(categoryKey, subcategory)}>
          <Trash2 size={16} />
        </button>
      )}
    </div>
  </>
)}

// Confirmarea ștergerii într-un componenta separată
{deleteMode && deletingSubcat && (
  <DeleteConfirmation
    cat={deletingSubcat.cat}
    subcat={deletingSubcat.subcat}
    onConfirm={handleConfirmDelete}
    onCancel={() => {
      setDeleteMode(false);
      setDeletingSubcat(null);
    }}
  />
)}
3.4 Pattern: Comunicare între Componente pentru Categorii
tsx// Flux inovator pentru notificarea componentelor despre schimbări în categorii
// Evită bucle infinite conform pattern-ului din BEST_PRACTICES.md

// În CategoryEditor după modificări
const handleCategoryUpdate = () => {
  // Salvează timestamp în localStorage ca event
  const timestamp = Date.now();
  localStorage.setItem('budget-app-last-category-update', timestamp.toString());
};

// În LunarGrid și alte componente care folosesc categorii
useEffect(() => {
  // Helper pentru a detecta schimbări în categorii
  const checkForCategoryUpdates = () => {
    const lastUpdateStr = localStorage.getItem('budget-app-last-category-update');
    if (lastUpdateStr) {
      const lastUpdate = parseInt(lastUpdateStr, 10);
      // Dacă a fost actualizat după ultima verificare, reîncarcă categoriile
      if (lastUpdate > lastCheckRef.current) {
        loadCategories(user.id);
        lastCheckRef.current = lastUpdate;
      }
    }
  };
  
  // Verifică la intervale regulate pentru actualizări
  const intervalId = setInterval(checkForCategoryUpdates, 5000);
  
  // Event listener pentru storage changes
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'budget-app-last-category-update') {
      checkForCategoryUpdates();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  return () => {
    clearInterval(intervalId);
    window.removeEventListener('storage', handleStorageChange);
  };
}, [user?.id]);
Concluzii și Recomandări pentru Implementare
Cu aceste exemple, diagrame și pattern-uri, un dezvoltator sau un AI ar trebui să aibă o înțelegere mult mai bună a modului în care funcționează componentele și cum interacționează între ele. Câteva recomandări practice pentru implementare:

Studiază fluxurile de date înainte de cod: Înțelegerea fluxului de date ajută la identificarea dependențelor corecte.
Respectă pattern-urile stabilite: Folosește state separat pentru moduri conflictuale (editare vs. ștergere).
Citește BEST_PRACTICES.md: Documentul conține reguli specifice pentru import/export, state management și optimizări.
Testează cu date reale: Folosește mock-uri minime, testează cu date cât mai apropiate de producție.
Validează importurile: Folosește utilitarul npm run validate:constants pentru a verifica corectitudinea importurilor.
