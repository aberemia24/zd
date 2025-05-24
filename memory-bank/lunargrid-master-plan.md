# LunarGrid Master Plan - Planificare Financiară Avansată

## Viziunea Aplicației

### Schimbarea paradigmei
🔄 **DE LA**: Tracking financiar retrospectiv (ce s-a întâmplat)  
🔄 **LA**: Planificare financiară predictivă (ce se va întâmpla)

### Obiectivul principal
**Să știi în fiecare zi câți bani vei avea** - nu doar câți ai cheltuit, ci câți vei avea în viitor pe baza planificării tale.

### Workflow-ul utilizatorului țintă
1. **Introducerea veniturilor**: toate veniturile cunoscute (salarii, chirii, venituri ocazionale)
2. **Estimarea cheltuielilor**: toate cheltuielile planificate pentru luna/anul respectiv
3. **Planificarea economiilor**: ce economii doresc să facă din banii rămași
4. **Vizualizarea soldurilor**: în fiecare zi să vadă soldurile prezente și viitoare

---

## Analiza Situației Curente

### ✅ Ce funcționează deja
- Tabelul cu categorii colapsabile și subcategorii
- Afișarea tranzacțiilor corespunzătoare subcategoriilor și datelor
- Total pe categorii/zi
- Butoane expand/collapse pentru toate categoriile
- Schimbarea lunii
- Header cu zilele lunii
- Sincronizare cu alte componente (modificările se reflectă peste tot)

### ❌ Probleme critice identificate
- **Calculul soldului este incorect**: adună toate sumele indiferent de tip (venit/cheltuială)
- Lipsa diferențierii între venituri (+) și cheltuieli (-)
- Nu se propagă modificările către zilele următoare
- Lipsa tratării corecte a economiilor

### 🔧 Limitări actuale UX
- Nu poți expanda/collapsa categorii individual
- Coloana subcategoriilor nu e sticky (se pierde la scroll orizontal)
- Nu poți adăuga/șterge/edita subcategorii direct din tabel
- Nu poți adăuga tranzacții rapid prin click pe celule
- Lipsa modurilor de afișare (normal/wide/fullscreen)

---

## Planul de Implementare Detaliat

### FAZA 1: Fundamentele Corecte (CRITICĂ) - 5-7 zile

#### 1.1 Calculul corect al soldului zilnic
**Problema**: Algoritm incorect de calcul care nu diferențiază tipurile de tranzacții
**Soluția**: 
```typescript
// Logica corectă de calcul
const calculateDailyBalance = (previousBalance: number, dayTransactions: Transaction[]) => {
  return dayTransactions.reduce((balance, transaction) => {
    switch (transaction.type) {
      case 'INCOME': return balance + transaction.amount;
      case 'EXPENSE': return balance - transaction.amount;
      case 'SAVINGS': return balance - transaction.amount; // Economiile scad disponibilul
      default: return balance;
    }
  }, previousBalance);
};

// Propagarea modificărilor
const recalculateFromDate = (startDate: Date, transactions: Transaction[]) => {
  // Recalculează toate zilele de la startDate înainte
  // Actualizează soldurile cumulative
};
```

**Fișiere afectate**:
- `frontend/src/hooks/useLunarGridCalculations.ts` (nou)
- `frontend/src/components/features/LunarGrid/LunarGridTanStack.tsx`

#### 1.2 Navegarea avansată în tabel
**Problema**: Funcționalitate limitată de navigare și vizualizare
**Soluția**:
- Expand/collapse individual pentru categorii folosind TanStack row expansion API
- Sticky columns folosind TanStack built-in functionality
- Moduri de afișare prin CSS classes și state management

**Implementare**:
```typescript
// Hook pentru managementul stării de afișare
const useDisplayMode = () => {
  const [mode, setMode] = useState<'normal' | 'wide' | 'fullscreen'>('normal');
  // Logica pentru toggle între moduri
};

// Configurare TanStack pentru sticky columns
const columnDef = {
  id: 'subcategory',
  header: 'Subcategorie',
  sticky: 'left', // TanStack built-in
  // ...
};
```

### FAZA 2: UX Îmbunătățit (IMPORTANTĂ) - 7-10 zile

#### 2.1 Managementul subcategoriilor în tabel
**Funcționalități noi**:
- Buton "+" sub ultima subcategorie pentru adăugare rapidă
- Limitare la 5 subcategorii cu validare vizuală
- Ștergere cu confirmarea și verificare dependențe
- Redenumire inline cu validare

**Implementare**:
```typescript
// Component pentru managementul subcategoriilor
const SubcategoryManager = ({ categoryId, subcategories, onAdd, onDelete, onRename }) => {
  const canAddMore = subcategories.length < 5;
  
  return (
    <div className="subcategory-list">
      {subcategories.map(sub => (
        <SubcategoryRow key={sub.id} subcategory={sub} onDelete={onDelete} onRename={onRename} />
      ))}
      {canAddMore && <AddSubcategoryButton onClick={onAdd} />}
      {!canAddMore && <MaxLimitMessage />}
    </div>
  );
};
```

#### 2.2 Interacțiunea cu celulele
**Single Click Modal**:
```typescript
const TransactionModal = ({ cellData, onSave, onClose }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  
  const isValid = amount && !isNaN(Number(amount));
  
  return (
    <Modal>
      <form onSubmit={handleSubmit}>
        <input value={amount} onChange={setAmount} placeholder="Sumă" />
        <input value={description} onChange={setDescription} placeholder="Descriere" />
        <checkbox checked={isRecurring} onChange={setIsRecurring} label="Recurent" />
        <button disabled={!isValid} type="submit">Salvează</button>
      </form>
    </Modal>
  );
};
```

**Double Click Inline Edit**:
```typescript
const InlineCellEditor = ({ value, onSave, onCancel }) => {
  const [editValue, setEditValue] = useState(value);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSave(editValue);
    if (e.key === 'Escape') onCancel();
  };
  
  return (
    <input 
      value={editValue} 
      onChange={setEditValue}
      onKeyDown={handleKeyDown}
      onBlur={() => onSave(editValue)}
      autoFocus
    />
  );
};
```

#### 2.3 Îmbunătățiri design
**Header complet cu context temporal**:
```typescript
const DayHeader = ({ date, isToday, isPast }) => {
  const dayName = date.toLocaleDateString('ro', { weekday: 'short' });
  const dayNumber = date.getDate();
  const monthName = date.toLocaleDateString('ro', { month: 'short' });
  
  return (
    <div className={cn(
      'day-header',
      isToday && 'current-day',
      isPast && 'past-day'
    )}>
      <div className="day-number">{dayNumber}</div>
      <div className="day-context">{dayName}</div>
      <div className="month-context">{monthName}</div>
    </div>
  );
};
```

### FAZA 3: Features Avansate (AVANSATĂ) - 10-15 zile

#### 3.1 Recurența și planificarea automată
**Logica pentru propagarea tranzacțiilor recurente**:
```typescript
const generateRecurringTransactions = (
  baseTransaction: Transaction,
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly',
  endDate: Date
) => {
  const transactions = [];
  let currentDate = new Date(baseTransaction.date);
  
  while (currentDate <= endDate) {
    transactions.push({
      ...baseTransaction,
      id: generateId(),
      date: new Date(currentDate),
      isRecurring: true,
      parentId: baseTransaction.id
    });
    
    // Calculare următoarea dată pe baza frecvenței
    currentDate = addPeriod(currentDate, frequency);
  }
  
  return transactions;
};
```

#### 3.2 Navigarea cu tastatura (Excel-like)
**Implementare sistem de selecție celule**:
```typescript
const useCellNavigation = () => {
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [isEditing, setIsEditing] = useState(false);
  
  const handleKeyDown = (e) => {
    if (isEditing) return;
    
    switch (e.key) {
      case 'ArrowUp': setSelectedCell(prev => ({ ...prev, row: prev.row - 1 })); break;
      case 'ArrowDown': setSelectedCell(prev => ({ ...prev, row: prev.row + 1 })); break;
      case 'ArrowLeft': setSelectedCell(prev => ({ ...prev, col: prev.col - 1 })); break;
      case 'ArrowRight': setSelectedCell(prev => ({ ...prev, col: prev.col + 1 })); break;
      case 'Enter': setIsEditing(true); break;
      case 'Escape': setIsEditing(false); break;
    }
  };
  
  return { selectedCell, isEditing, handleKeyDown };
};
```

#### 3.3 Multi-selecție și operațiuni bulk
**Implementare selecție range**:
```typescript
const useRangeSelection = () => {
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [selectedCells, setSelectedCells] = useState(new Set());
  
  const handleCellClick = (cellPosition, isShiftClick) => {
    if (isShiftClick && selectionStart) {
      // Calculează range-ul dintre start și current
      const range = calculateCellRange(selectionStart, cellPosition);
      setSelectedCells(new Set(range));
    } else {
      setSelectionStart(cellPosition);
      setSelectedCells(new Set([cellPosition]));
    }
  };
  
  return { selectedCells, handleCellClick };
};
```

### FAZA 4: Integrarea cu Modulele Existente (INTEGRARE) - 3-5 zile

#### 4.1 Sincronizarea cu tracking-ul zilnic
**Bidirectional sync între LunarGrid și modulul de tracking**:
```typescript
const useLunarGridSync = () => {
  const { transactions: dailyTransactions } = useDailyTracking();
  const { updateLunarGrid } = useLunarGridData();
  
  // Sync din tracking către grid
  useEffect(() => {
    dailyTransactions.forEach(transaction => {
      updateLunarGrid(transaction);
    });
  }, [dailyTransactions]);
  
  // Sync din grid către tracking
  const handleGridTransactionChange = (transaction) => {
    updateDailyTracking(transaction);
    updateLunarGrid(transaction);
  };
  
  return { handleGridTransactionChange };
};
```

#### 4.2 Comparații estimat vs real
**Logica pentru tracking diferențelor**:
```typescript
const useEstimateTracking = () => {
  const calculateVariance = (estimated: number, actual: number) => {
    const variance = actual - estimated;
    const percentageVariance = (variance / estimated) * 100;
    
    return {
      absolute: variance,
      percentage: percentageVariance,
      status: variance > 0 ? 'over' : variance < 0 ? 'under' : 'exact'
    };
  };
  
  return { calculateVariance };
};
```

### FAZA 5: Optimizări și Mobile (POLISARE) - 3-5 zile

#### 5.1 Virtualization pentru performanță
```typescript
// Integrare cu TanStack Virtual
const VirtualizedLunarGrid = () => {
  const rowVirtualizer = useVirtualizer({
    count: categories.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });
  
  return (
    <div ref={parentRef} className="virtualized-container">
      {rowVirtualizer.getVirtualItems().map(virtualRow => (
        <div key={virtualRow.index} data-index={virtualRow.index}>
          <CategoryRow category={categories[virtualRow.index]} />
        </div>
      ))}
    </div>
  );
};
```



---

## Arhitectura Tehnică

### Structura de fișiere propusă
```
frontend/src/components/features/LunarGrid/
├── LunarGridTanStack.tsx (componenta principală)
├── hooks/
│   ├── useLunarGridCalculations.ts
│   ├── useLunarGridLogic.ts
│   ├── useCellNavigation.ts
│   ├── useRangeSelection.ts
│   
│ 
├── modals/
│   ├── TransactionModal.tsx
│   ├── RecurringSetupModal.tsx
│   └── BulkEditModal.tsx
├── components/
│   ├── DayHeader.tsx
│   ├── CategoryRow.tsx
│   ├── SubcategoryManager.tsx
│   ├── InlineCellEditor.tsx
│   └── ContextMenu.tsx
├── context/
│   ├── LunarGridContext.tsx
│   └── SelectionContext.tsx
└── utils/
    ├── calculations.ts
    ├── dateUtils.ts
    └── validations.ts
```

### Hook-uri specializate noi
- `useLunarGridCalculations.ts`: Logica de calcul pentru solduri
- `useLunarGridLogic.ts`: State management general
- `useCellNavigation.ts`: Navigarea cu tastatura
- `useRangeSelection.ts`: Multi-selecția celulelor
- `useRecurringTransactions.ts`: Managementul tranzacțiilor recurente

### Integrarea cu React Query
```typescript
// Queries specifice pentru LunarGrid
const lunarGridQueries = {
  monthlyData: (year: number, month: number) => ['lunar-grid', 'monthly', year, month],
  calculations: (transactions: Transaction[]) => ['lunar-grid', 'calculations', transactions],
  recurringTransactions: () => ['lunar-grid', 'recurring'],
};

// Mutations pentru operațiuni
const useLunarGridMutations = () => {
  const queryClient = useQueryClient();
  
  const addTransaction = useMutation({
    mutationFn: async (transaction: Transaction) => {
      // API call
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lunarGridQueries.monthlyData });
    }
  });
  
  return { addTransaction };
};
```

---

## Rafinări Suplimentare și Detalii de Implementare

### Definirea Constantelor și Enumerărilor

Fișierul `shared-constants/lunarGrid.ts` va conține toate definițiile centralizate:

```typescript
// Tipuri de tranzacții
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE', 
  SAVINGS = 'SAVINGS',
  INVESTMENT = 'INVESTMENT'
}

// Frecvențe pentru recurență
export enum FrequencyType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

// Moduri de afișare grid
export enum DisplayMode {
  NORMAL = 'NORMAL',
  WIDE = 'WIDE',
  FULLSCREEN = 'FULLSCREEN'
}

// Mesaje și texte UI
export const LUNAR_GRID_MESSAGES = {
  ERRORS: {
    INVALID_AMOUNT: 'Suma introdusă nu este validă',
    MAX_SUBCATEGORIES: 'Ai atins limita maximă de 5 subcategorii',
    RECURRING_LIMIT: 'Perioada selectată ar genera prea multe tranzacții'
  },
  TOOLTIPS: {
    BALANCE: 'Sold disponibil la sfârșitul zilei',
    SAVINGS: 'Economii acumulate',
    RECURRING: 'Tranzacție recurentă'
  },
  CONFIRMATIONS: {
    DELETE_SUBCATEGORY: 'Ești sigur că vrei să ștergi această subcategorie?',
    MAKE_RECURRING: 'Această tranzacție va fi repetată conform frecvenței selectate'
  }
}

// Limitări și configurări
export const LUNAR_GRID_CONFIG = {
  MAX_SUBCATEGORIES_PER_CATEGORY: 5,
  DEFAULT_RECURRING_MONTHS: 12,
  MAX_RECURRING_INSTANCES: 100,
  DEBOUNCE_DELAY_MS: 300,
  MODAL_ANIMATION_MS: 150
}

// Formatare numere și date
export const LUNAR_GRID_FORMATS = {
  CURRENCY: {
    LOCALE: 'ro-RO',
    CURRENCY: 'RON',
    DECIMALS: 2
  },
  DATE: {
    SHORT: 'dd MMM',
    WEEKDAY: 'EEE', 
    MONTH_YEAR: 'MMMM yyyy'
  }
}
```

### Prototipuri Vizuale pentru Componente

#### Header Zilnic Îmbunătățit
```typescript
const DayHeader = ({ date, isToday, isPast }) => (
  <div className={cn(
    'day-header',
    isToday && 'current-day',
    isPast && 'past-day'
  )}>
    <div className="day-number">{date.getDate()}</div>
    <div className="day-context">{date.toLocaleDateString('ro', { weekday: 'short' })}</div>
    <div className="month-name">{date.toLocaleDateString('ro', { month: 'short' })}</div>
    {isToday && <div className="today-indicator" />}
    {isPast && <div className="past-indicator" />}
  </div>
);
```

#### Celulă de Tranzacție cu Indicatori Vizuali
```typescript
const TransactionCell = ({ amount, type, isRecurring, description }) => (
  <div className={cn(
    'transaction-cell',
    type === TransactionType.INCOME && 'income-cell',
    type === TransactionType.EXPENSE && 'expense-cell',
    type === TransactionType.SAVINGS && 'savings-cell'
  )}>
    <span className="amount">{formatAmount(amount)}</span>
    {isRecurring && <RecurringIndicator />}
    {description && (
      <Tooltip content={description}>
        <InfoIcon className="description-indicator" />
      </Tooltip>
    )}
  </div>
);
```

#### Celulă de Sold cu Breakdown
```typescript
const BalanceBreakdown = ({ date }) => {
  const { availableImmediately, savings, total } = getBalanceBreakdown(date);
  
  return (
    <div className="balance-breakdown">
      <div className="available">
        <span className="label">Disponibil:</span>
        <span className="value positive">{formatAmount(availableImmediately)}</span>
      </div>
      <div className="savings">
        <span className="label">Economii:</span>
        <span className="value neutral">{formatAmount(savings)}</span>
      </div>
      <div className="total">
        <span className="label">Total:</span>
        <span className="value primary">{formatAmount(total)}</span>
      </div>
    </div>
  );
};
```

### Strategia Detaliată pentru Economii

#### Concepte de Bază pentru Economii
- **Economiile sunt bani alocați** pentru scopuri viitoare (vacanțe, fond de urgență, etc.)
- **Nu sunt bani "pierduți"** ci sunt încă proprietatea utilizatorului
- **Nu sunt disponibili imediat** pentru cheltuieli curente
- **Se calculează separat** în soldurile zilnice

#### Implementare Logică Economii
```typescript
const useSavingsLogic = () => {
  // Calculează totalul economiilor până la o dată
  const calculateTotalSavingsUntil = (date: Date) => {
    return transactions
      .filter(t => 
        t.type === TransactionType.SAVINGS && 
        new Date(t.date) <= date
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };
  
  // Calculează disponibilul zilnic (excluding savings)
  const calculateAvailableBalance = (date: Date) => {
    const incomeUntilDate = calculateIncomeUntil(date);
    const expensesUntilDate = calculateExpensesUntil(date);
    const savingsUntilDate = calculateTotalSavingsUntil(date);
    
    return incomeUntilDate - expensesUntilDate - savingsUntilDate;
  };
  
  // Breakdown complet pentru o zi
  const getCompleteBreakdown = (date: Date) => ({
    totalIncome: calculateIncomeUntil(date),
    totalExpenses: calculateExpensesUntil(date),
    totalSavings: calculateTotalSavingsUntil(date),
    availableImmediately: calculateAvailableBalance(date),
    grandTotal: calculateIncomeUntil(date) - calculateExpensesUntil(date)
  });
  
  return {
    calculateTotalSavingsUntil,
    calculateAvailableBalance,
    getCompleteBreakdown
  };
};
```

#### Afișarea Economiilor în Grid
- **Rând separat de economii**: La sfârșitul grid-ului, un rând special care arată totalul economiilor pe zi
- **Culoare distinctă**: Economiile vor avea o culoare neutră (albastru/gri) pentru a le diferenția
- **Tooltip explicativ**: "Acestea sunt economii planificate, nu sunt disponibile pentru cheltuieli curente"

### Obiective și Metrici de Performanță

#### Ținte de Performanță
```typescript
const PERFORMANCE_TARGETS = {
  INITIAL_LOAD: 300, // milisecunde pentru încărcarea inițială
  CELL_INTERACTION: 50, // milisecunde pentru click pe celulă
  FILTER_APPLY: 100, // milisecunde pentru aplicarea filtrelor
  MONTH_CHANGE: 200, // milisecunde pentru schimbarea lunii
  RECURRING_GENERATION: 500, // milisecunde pentru generarea tranzacțiilor recurente
  CALCULATION_REFRESH: 150 // milisecunde pentru recalcularea soldurilor
};
```

#### Strategii de Optimizare Implementate
1. **Memoizare inteligentă**: Calculele de solduri vor fi memorizate și recalculate doar când se schimbă datele relevante
2. **Debouncing**: Modificările frecvente (ca editarea inline) vor fi decelerate pentru a reduce încărcarea
3. **Lazy loading**: Datele pentru lunile viitoare vor fi încărcate doar când sunt necesare
4. **Virtualizare adaptivă**: Pentru grid-uri mari (>50 rânduri) se va activa virtualizarea automată
5. **Batching updates**: Mai multe modificări vor fi grupate într-o singură actualizare pentru a evita re-renderizările excesive

#### Măsurarea și Monitorizarea
```typescript
const usePerformanceMonitoring = () => {
  // Măsurare timpi de execuție pentru funcții critice
  const measureExecutionTime = (label, fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    // Log doar în development pentru debugging
    if (process.env.NODE_ENV === 'development') {
      console.debug(`${label}: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  };
  
  // Alertă pentru performanțe sub țintă
  const checkPerformanceThreshold = (operation, timeMs, targetMs) => {
    if (timeMs > targetMs * 1.5) {
      console.warn(`Performance alert: ${operation} took ${timeMs}ms (target: ${targetMs}ms)`);
    }
  };
  
  return { measureExecutionTime, checkPerformanceThreshold };
};
```

### Avantajele Acestor Rafinări

#### Pentru Dezvoltatori
- **Consistență**: Toate definițiile sunt centralizate și unitare
- **Mentenabilitate**: Schimbările se fac într-un singur loc
- **Debuggabilitate**: Performanța poate fi monitorizată și optimizată

#### Pentru Utilizatori
- **Claritate vizuală**: Informațiile sunt prezentate clar și consistent
- **Diferențiere logică**: Economiile sunt separate de banii disponibili
- **Experiență fluidă**: Aplicația funcționează rapid și fără întârzieri
- **Feedback vizual**: Indicatorii și culorile ajută la înțelegerea rapidă a datelor

---

## Timeline și Prioritizare

### Roadmap recomandat
1. **Săptămâna 1-2**: Calculul corect al soldului și navigarea de bază
2. **Săptămâna 3-4**: Managementul subcategoriilor și interacțiunea cu celulele
3. **Săptămâna 5-7**: Features avansate de navigare și operațiuni bulk
4. **Săptămâna 8**: Integrarea cu modulele existente
5. **Săptămâna 9**: Optimizări și mobile support

### Criteriile de succes
- ✅ Calculele soldurilor sunt 100% corecte în toate scenariile
- ✅ Utilizatorul poate naviga fluid prin tabel cu mouse și tastatură
- ✅ Adăugarea/editarea tranzacțiilor este rapidă și intuitivă
- ✅ Tranzacțiile recurente se propagă corect
- ✅ Aplicația rămâne performantă cu volume mari de date
- ✅ Designul inspiră încredere și profesionalism

---

## Riscuri și Mitigări

### Riscuri tehnice identificate
1. **Complexitatea calculelor**: Logica de solduri cumulative poate deveni complexă
   - *Mitigare*: Teste extensive și validări matematice
2. **Performanța**: Multe celule și calcule în timp real
   - *Mitigare*: Virtualization și optimizări
3. **Sincronizarea**: Integrarea cu modulele existente
   - *Mitigare*: Design API-ului cu backwards compatibility

### Riscuri UX identificate
1. **Learning curve**: Features noi complex de învățat
   - *Mitigare*: Onboarding progresiv și tooltips utile
2. **Mobile experience**: Grid-ul poate fi dificil pe mobile
   - *Mitigare*: Design responsive și gesturi intuitive

---

## Considerații Speciale

### Performanța și Scalabilitatea
- **Virtualization**: Pentru lunile cu multe subcategorii (>50)
- **Debounced updates**: Pentru a nu suprasolicita API-ul
- **Memoizare**: Pentru calculele complexe de solduri
- **Lazy loading**: Pentru datele din lunile viitoare

### UX și Accesibilitate
- **Keyboard navigation**: Suport complet pentru utilizatorii care preferă tastatura
- **Screen readers**: Atribute ARIA pentru accesibilitate
- **Mobile-first**: Design responsive cu gesturi touch intuitive
- **Error handling**: Feedback clar pentru utilizatori la erori

### Integrarea cu Ecosistemul Existent
- **Shared constants**: Toate constantele în shared-constants/lunarGrid.ts
- **React Query**: Consistency cu pattern-urile existente
- **Design system**: Utilizarea componentelor primitive existente
- **State management**: Integrare cu Zustand stores existente

---

*Acest master plan servește ca ghid complet pentru transformarea LunarGrid într-un instrument profesional de planificare financiară predictivă.* 