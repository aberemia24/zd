EXEMPLE CONCRETE, FLUXURI DE DATE ȘI PATTERN-URI UI
1. Exemple Concrete de Utilizare pentru Componente Majore
1.1 TransactionForm
Exemplu Utilizare:
tsx// În TransactionsPage.tsx
import TransactionForm from '../components/features/TransactionForm';

// Exemplu simplu
<TransactionForm />

// Exemplu cu callbacks
<TransactionForm 
  onSave={(formData) => console.log('Tranzacție salvată:', formData)}
  onCancel={() => console.log('Formular anulat')}
/>
Structura Datelor:
tsx// Tipul datelor din formular
type TransactionFormData = {
  type: string;          // Din TransactionType enum
  amount: string;        // Sumă ca string (pentru input controlat)
  category: string;      // Categorie selectată
  subcategory: string;   // Subcategorie selectată
  date: string;          // Format: 'YYYY-MM-DD'
  recurring: boolean;    // Dacă este recurentă
  frequency: string;     // Din FrequencyType enum, doar dacă recurring=true
};

// La submitere, se convertește în:
type TransactionFormWithNumberAmount = Omit<Transaction, 'amount'> & {
  amount: number;        // Amount ca număr pentru calcule
};
1.2 LunarGrid
Exemplu Utilizare:
tsx// În LunarGridPage.tsx
import LunarGrid from '../components/features/LunarGrid';

// Exemplu basic
<LunarGrid 
  year={2025}
  month={5}
/>
Exemplu Interacțiune cu Stores:
tsx// În LunarGridPage.tsx
import { useTransactionStore } from '../stores/transactionStore';
import { useCategoryStore } from '../stores/categoryStore';

const LunarGridWithStores = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  
  // Încărcarea categoriilor personalizate la montare
  const { loadCategories, mergeWithDefaults } = useCategoryStore();
  const { user } = useAuthStore();
  
  useEffect(() => {
    if (user?.id) {
      // 1. Încarcă categoriile personalizate și
      // 2. Fuzionează cu cele predefinite din CATEGORIES
      loadCategories(user.id).then(() => {
        const defaultCategories = convertCategoriesFormat(CATEGORIES);
        mergeWithDefaults(defaultCategories);
      });
    }
  }, [user?.id]);
  
  // Componenta va prelua automat tranzacțiile din store
  return (
    <div>
      <div className="controls">
        <button onClick={() => changeMonth(-1)}>Luna anterioară</button>
        <span>{`${getMonthName(month)} ${year}`}</span>
        <button onClick={() => changeMonth(1)}>Luna următoare</button>
      </div>
      
      <LunarGrid year={year} month={month} />
    </div>
  );
};
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
2.3 Flux Editare Tranzacție în LunarGrid
┌─────────────────┐      ┌─────────────────┐     ┌─────────────────┐
│  LunarGrid Cell │─1───▶│CellTransaction  │─2──▶│   handleSave    │
│ (click/dblclick)│      │    Popover      │     │   (LunarGrid)   │
└─────────────────┘      └─────────────────┘     └────────┬────────┘
                                                          │3
                                                          ▼
┌─────────────────┐      ┌─────────────────┐     ┌─────────────────┐
│Re-render LunarGrid◀─6──│transactionStore │◀─4──│ supabaseService │
└─────────────────┘      │invalidateMonth  │     └────────┬────────┘
                         │fetchTransactions│               │5
                         └─────────────────┘               ▼
                                                    ┌─────────────────┐
                                                    │  Supabase DB    │
                                                    └─────────────────┘

Flux:
1. User face click pe celulă -> deschide CellTransactionPopover, sau
   User face double-click -> editare rapidă cu prompt
2. După editare, handler-ul corespunzător este apelat cu datele noi
3. handleSave creează un obiect Transaction și apelează transactionStore.saveTransaction()
4. Tranzacția este salvată prin supabaseService
5. Datele sunt actualizate în Supabase
6. transactionStore invalidează cache-ul pentru luna curentă și reîncarcă datele
7. LunarGrid se re-renderează automat cu datele actualizate

Optimizări:
- Invalidarea parțială a cache-ului (doar luna afectată)
- Utilizarea localStorage pentru persistența stării de expandare categorii
- Debounce pentru operații rapide consecutive
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

{/* Afișează subcategoriile doar dacă categoria este expandată */}
{isExpanded && (
  <SubcategoryRows
    categoryKey={categoryKey}
    subcategories={subcategories}
    /* ... */
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