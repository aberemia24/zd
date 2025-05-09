import React from 'react';
import { useTransactionStore } from '../../../stores/transactionStore';
import { useAuthStore } from '../../../stores/authStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import { CATEGORIES } from '@shared-constants/categories';
import { TransactionType, TransactionStatus, FrequencyType } from '@shared-constants/enums';
import { TransactionValidated } from '@shared-constants/transaction.schema';
import { EXCEL_GRID } from '@shared-constants/ui';
import { ChevronDown, ChevronRight, Edit, Trash2 } from 'lucide-react';
import CellTransactionPopover from './CellTransactionPopover';
import { CategoryEditor } from '../CategoryEditor';

// Helper pentru a genera array [1, 2, ..., n]
const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 0);
  return Array.from({ length: date.getDate() }, (_, i) => i + 1);
};

// Hook pentru încărcarea tranzacțiilor pentru o lună/an specific, cu caching și refresh agresiv
function useMonthlyTransactions(year: number, month: number) {
  const transactionStore = useTransactionStore();
  const storeTransactions = transactionStore.transactions;
  
  // IMPORTANT: Folosim un ref pentru a stoca parametrii anteriori și a preveni bucle infinite
  const paramsRef = React.useRef({ year, month });
  
  // Funcție de refresh expusă pentru componentele care folosesc hook-ul
  const forceRefresh = React.useCallback(() => {
    console.log('🔄 Forcing aggressive data refresh...');
    // IMPORTANT: Pentru a preveni buclele infinite, folosim direct refresh() din store
    // fără a modifica alte state-uri care ar putea declanșa efecte
    transactionStore.refresh(); 
  }, [transactionStore]);
  
  // IMPORTANT: Un singur effect pentru setarea parametrilor și fetch
  // Acest model respectă regula critică din memoria d7b6eb4b-0702-4b0a-b074-3915547a2544
  React.useEffect(() => {
    // Verificăm dacă parametrii s-au schimbat cu adevărat pentru a preveni bucle
    if (paramsRef.current.year !== year || paramsRef.current.month !== month) {
      console.log(`Parameters changed: ${paramsRef.current.year}-${paramsRef.current.month} -> ${year}-${month}`);
      
      // Actualizăm referinta pentru a ști ce parametri am folosit ultima dată
      paramsRef.current = { year, month };
      
      // Setăm parametrii și facem fetch într-un singur effect
      console.log(`Setting query params and fetching for ${year}-${month}`);
      transactionStore.setQueryParams({
        month,
        year,
        includeAdjacentDays: true, // Include zile din lunile adiacente pentru o experiență mai bună
      });
      
      // Fetch-ul se face doar la prima montare și la schimbarea anului/lunii
      transactionStore.fetchTransactions();
    }
  }, [month, year, transactionStore]); // Dependențe minimale

  // Filtrează tranzacțiile pentru luna curentă + zile adiacente
  const transactions = React.useMemo(() => {
    // Date pentru luna curentă
    const currentMonthStart = new Date(year, month - 1, 1);
    const currentMonthEnd = new Date(year, month, 0);
    
    // Ultimele 6 zile din luna anterioară
    const prevMonthYear = month === 1 ? year - 1 : year;
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevMonthLastDay = new Date(prevMonthYear, prevMonth, 0).getDate();
    const prevMonthLastDays = prevMonthLastDay - 5; // Ultimele 6 zile
    
    // Primele 6 zile din luna următoare
    const nextMonthYear = month === 12 ? year + 1 : year;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextMonthFirstDays = 6; // Primele 6 zile
    
    console.log(`Filtering transactions for ${year}-${month} + adjacent days`);
    console.log(`Total transactions before filtering: ${storeTransactions.length}`);
    
    const filteredTransactions = storeTransactions.filter(t => {
      try {
        // Asigurăm-ne că data este validă și în formatul așteptat
        // Format ISO: YYYY-MM-DD
        if (!t.date || typeof t.date !== 'string') return false;
        
        const d = new Date(t.date);
        if (isNaN(d.getTime())) {
          console.warn(`Invalid date found in transaction: ${t.id}, date: ${t.date}`);
          return false;
        }
        
        const transactionDay = d.getDate();
        const transactionMonth = d.getMonth() + 1;
        const transactionYear = d.getFullYear();
        
        // 1. Tranzacții din luna curentă
        if (transactionYear === year && transactionMonth === month) {
          return true;
        }
        
        // 2. Ultimele zile din luna anterioară
        if (transactionYear === prevMonthYear && 
            transactionMonth === prevMonth && 
            transactionDay >= prevMonthLastDays) {
          return true;
        }
        
        // 3. Primele zile din luna următoare
        if (transactionYear === nextMonthYear && 
            transactionMonth === nextMonth && 
            transactionDay <= nextMonthFirstDays) {
          return true;
        }
        
        return false;
      } catch (err) {
        console.error('Error filtering transaction:', err, t);
        return false;
      }
    });
    
    console.log(`Filtered transactions: ${filteredTransactions.length}`);
    return filteredTransactions;
  }, [storeTransactions, year, month]); // Eliminăm refreshTrigger care nu mai există
  
  return { transactions, forceRefresh };
}

// Agregare sumă pentru o zi, categorie, subcategorie
function getSumForCell(transactions: TransactionValidated[], category: string, subcategory: string, day: number) {
  return transactions
    .filter(t => t.category === category && t.subcategory === subcategory && new Date(t.date).getDate() === day)
    .reduce((acc, t) => {
      if (t.status === TransactionStatus.COMPLETED && typeof t.actualAmount === 'number') {
        return acc + t.actualAmount;
      }
      return acc + t.amount;
    }, 0);
}

// Calculează suma totală pentru o categorie întreagă în ziua respectivă
function getCategorySumForDay(transactions: TransactionValidated[], category: string, day: number): number {
  return transactions
    .filter(t => t.category === category && new Date(t.date).getDate() === day)
    .reduce((acc, t) => {
      const amount = t.status === TransactionStatus.COMPLETED && typeof t.actualAmount === 'number'
        ? t.actualAmount
        : t.amount;
      return acc + amount;
    }, 0);
}

// Calcul suma totală pentru o categorie, pe toate zilele - folosit pentru colapsare
function getCategoryTotalAllDays(transactions: TransactionValidated[], category: string): Record<number, number> {
  const result: Record<number, number> = {};
  
  transactions.forEach(t => {
    if (t.category === category) {
      const day = new Date(t.date).getDate();
      const amount = t.status === TransactionStatus.COMPLETED && typeof t.actualAmount === 'number'
        ? t.actualAmount
        : t.amount;
      result[day] = (result[day] || 0) + amount;
    }
  });
  
  return result;
}

// Calculează soldul zilnic - suma tuturor tranzacțiilor pentru o zi
function calculateDailyBalance(transactions: TransactionValidated[], day: number): number {
  return transactions
    .filter(t => new Date(t.date).getDate() === day)
    .reduce((acc, t) => {
      const amount = t.status === TransactionStatus.COMPLETED && typeof t.actualAmount === 'number'
        ? t.actualAmount
        : t.amount;

      // Pentru venituri adăugăm suma, pentru cheltuieli și economii scădem suma
      if (t.type === TransactionType.INCOME) {
        return acc + amount;
      } else {
        return acc - Math.abs(amount); // Asigurăm că scădem întotdeauna o valoare pozitivă
      }
    }, 0);
}

// Formatare valută pentru afișare (RON 0.00)
function formatCurrency(amount: number): string {
  if (amount === 0) return 'RON 0.00';
  
  return `RON ${Math.abs(amount).toLocaleString('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

// --- Componenta principală ---
export interface LunarGridProps {
  year: number;
  month: number;
}

// Constante pentru localStorage
const LOCALSTORAGE_CATEGORY_EXPAND_KEY = 'budget-app-category-expand';

// UI copy pentru CategoryEditor, fallback dacă nu există în shared-constants/ui
const UI = {
  MANAGE_CATEGORIES: 'Gestionare categorii',
};

export const LunarGrid: React.FC<LunarGridProps> = ({ year, month }) => {
  // State pentru modalul CategoryEditor si autentificare
  const [showCategoryEditor, setShowCategoryEditor] = React.useState(false);
  const { user } = useAuthStore();
  
  // State pentru subcategoria în curs de editare (pentru editare direct din grid)
  const [editingSubcategory, setEditingSubcategory] = React.useState<{category: string; subcategory: string; mode: 'edit' | 'delete'} | null>(null);
  
  // Acces la store-ul de categorii pentru a verifica dacă o subcategorie este personalizată
  const categories = useCategoryStore(state => state.categories);
  
  // UI copy pentru CategoryEditor (fallback dacă nu există în shared-constants/ui)
  const UI = {
    MANAGE_CATEGORIES: 'Gestionare categorii',
    EDIT_SUBCATEGORY: 'Edită subcategoria',
    DELETE_SUBCATEGORY: 'Șterge subcategoria',
  };

  const days = getDaysInMonth(year, month);
  const { transactions, forceRefresh } = useMonthlyTransactions(year, month);
  
  // Stare pentru categorii expandate/colapsate - persistentă în localStorage
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>(() => {
    try {
      // Încearcă să încerce starea din localStorage
      const saved = localStorage.getItem(LOCALSTORAGE_CATEGORY_EXPAND_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading expanded categories from localStorage:', error);
      return {};
    }
  });
  
  // Handler pentru expandare/colapsare categorie
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newState = { ...prev, [category]: !prev[category] };
      
      // Salvează în localStorage pentru persistență între sesiuni
      try {
        localStorage.setItem(LOCALSTORAGE_CATEGORY_EXPAND_KEY, JSON.stringify(newState));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      return newState;
    });
  };
  
  // Calcul pentru sume totale pe categorii (folosit la afișarea categoriilor colapsate)
  const categoryTotals = React.useMemo(() => {
    const result: Record<string, Record<number, number>> = {};
    
    Object.keys(CATEGORIES).forEach(category => {
      result[category] = getCategoryTotalAllDays(transactions, category);
    });
    
    return result;
  }, [transactions]);
  
  // Referință pentru a ține evidența ultimei tranzacții adăugate
  const lastAddedTransactionRef = React.useRef<{ timestamp: number; processed: boolean } | null>(null);

  // Efectul pentru a sincroniza starea când se adaugă tranzacții noi
  React.useEffect(() => {
    // Dacă nu am adăugat recent o tranzacție, nu facem nimic
    if (!lastAddedTransactionRef.current) return;

    // Invalidăm cache-ul și cerem date noi automat, dar fără să reîmprospătăm UI-ul brusc
    const timeElapsed = Date.now() - lastAddedTransactionRef.current.timestamp;
    if (timeElapsed < 2000) { // Dacă a trecut mai puțin de 2 secunde, facem refresh subtil
      // IMPORTANT: Folosim direct refresh() din store pentru a evita bucla infinită (d7b6eb4b)
      // UN setTimeout previne "Maximum update depth exceeded"
      setTimeout(() => {
        console.log('🔄 Force refreshing data directly from store after popover save...');
        useTransactionStore.getState().refresh();
      }, 300); // delay mic pentru a permite commit în backend
      useTransactionStore.getState()._invalidateMonthCache(year, month);
      // Cerem date noi, dar nu forțăm refresh complet (loading state = false)
      useTransactionStore.getState().fetchTransactions(true);
    }
    
    // Resetăm starea
    lastAddedTransactionRef.current = null;
  }, [year, month, transactions]);

  // Funcție ajutătoare pentru a marca adăugarea unei tranzacții noi (trigger refresh automat)
  const markTransactionAdded = React.useCallback(() => {
    console.log('🔄 Marking transaction added for subtle refresh...');
    // Inițializăm referința cu valori noi
    lastAddedTransactionRef.current = {
      timestamp: Date.now(),
      processed: false,
    };
    
    // Invalidare cache și refresh subtil după o scurtă întârziere
    // Folosim direct transactionStore pentru a evita bucla infinită
    setTimeout(() => {
      // Verificăm dacă referința există înainte de a o accesa (rezolvă avertismentul TS)
      if (lastAddedTransactionRef.current) {
        // Marcăm ca procesată pentru a evita refresh-uri multiple
        lastAddedTransactionRef.current.processed = true;
      }
      // Folosim direct forceRefresh care acum e sigur
      forceRefresh();
    }, 500);
  }, [forceRefresh]);

  // Calculează soldurile zilnice pentru întreaga lună
  const dailyBalances = React.useMemo(() => {
    return days.reduce<Record<number, number>>((acc, day) => {
      acc[day] = calculateDailyBalance(transactions, day);
      return acc;
    }, {});
  }, [days, transactions]);

  // Stil CSS condiționat pentru solduri (pozitiv/negativ)
  const getBalanceStyle = (amount: number): string => {
    if (amount === 0) return 'text-gray-500';
    return amount > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium';
  };

  // Popover state: ce celulă e activă și unde plasăm popoverul
  const [popover, setPopover] = React.useState<null | {
    category: string;
    subcategory: string;
    day: number;
    anchorRect: DOMRect | null;
    initialAmount: string;
    type: string;
  }>(null);

  // Helper pentru a determina tipul tranzacției în funcție de categorie
  const getTransactionTypeForCategory = (category: string): TransactionType => {
    // Mapăm categoriile la tipurile corespunzătoare conform business logic și regulilor
    if (category === 'VENITURI') return TransactionType.INCOME;
    if (category === 'ECONOMII') return TransactionType.SAVING;
    // Toate celelalte categorii (NUTRITIE, LOCUINTA, etc.) sunt de tip EXPENSE
    return TransactionType.EXPENSE;
  };

  // Handler pentru single click pe celulă: deschide popover
  const handleCellClick = (
    e: React.MouseEvent<HTMLTableCellElement>,
    category: string,
    subcategory: string,
    day: number,
    amount: string,
    type: string
  ) => {
    // Prevent double popover
    if (popover && popover.category === category && popover.subcategory === subcategory && popover.day === day) return;
    
    // Determinăm tipul corect de tranzacție bazat pe categorie
    const correctType = getTransactionTypeForCategory(category);
    
    setPopover({
      category,
      subcategory,
      day,
      anchorRect: e.currentTarget.getBoundingClientRect(),
      initialAmount: amount,
      type: correctType, // Folosim tipul corect determinat automat
    });
  };
  // Accesăm store-ul o singură dată pentru întreaga componentă
  const transactionStore = useTransactionStore();

  // Handler pentru double click: editare inline direct
  const handleCellDoubleClick = React.useCallback(
    (
      e: React.MouseEvent<HTMLTableCellElement>,
      category: string,
      subcategory: string,
      day: number,
      currentAmount: string
    ) => {
      e.preventDefault(); // Previne propagarea click-ului

      // Determinare automată tip tranzacție în funcție de categorie
      const type = getTransactionTypeForCategory(category);
      
      // Prompt pentru valoare nouă
      const newAmount = window.prompt(
        EXCEL_GRID.PROMPTS.ENTER_AMOUNT, // Folosește textul definit în constantă
        currentAmount.replace(/[^0-9.-]/g, '') // Curăță formatul pentru editare
      );

      if (!newAmount) return; // Anulează dacă nu s-a introdus nimic

      // Verifică dacă valoarea este un număr valid
      if (isNaN(Number(newAmount))) {
        // Nu avem ERRORS definit în EXCEL_GRID, folosim un mesaj simplu
        alert('Suma introdusă nu este validă!');
        return;
      }

      // Calculează data pentru ziua din calendar
      const date = new Date(year, month - 1, day);

      // Salvează tranzacția și triggerează refresh automat
      transactionStore.saveTransaction({
        amount: Number(newAmount),
        category,
        subcategory,
        type,
        date: date.toISOString().slice(0, 10),
        recurring: false, // Implicit: nu e recurentă la editare rapidă
        frequency: undefined,
        currency: 'RON', // Default currency
        // NOTĂ: user_id este adăugat de supabaseService.createTransaction, nu trebuie trimis de noi
      }).then(() => {
        console.log(`Tranzacție salvată cu success: ${category} / ${subcategory} / ${day} = ${newAmount} RON`);
        // IMPORTANT: Folosim direct refresh() din store, nu forceRefresh (anti-pattern d7b6eb4b)
        // previne bucla infinită "Maximum update depth exceeded"
        setTimeout(() => {
          console.log('🔄 Force refreshing data directly from store...');
          transactionStore.refresh();
        }, 300); // delay mic pentru a permite commit în backend
      }).catch(error => {
        console.error('Eroare la salvare tranzacție:', error);
      });
    },
    [month, year, transactionStore]
  );
  // Handler pentru salvare tranzacție
  const handleSavePopover = async (data: { amount: string; recurring: boolean; frequency: string }) => {
    if (!popover) return;
    
    // Debug
    console.log('Saving transaction with data:', data);
    
    try {
      // Construim tranzacția cu date implicite din contextul celulei
      const { category, subcategory, day, type } = popover;
      const { amount, recurring, frequency } = data;
      const date = new Date(year, month - 1, day);
      
      // Creăm obiectul tranzacție complet conform tipului așteptat
      const transactionData = {
        amount: Number(amount),
        category,
        subcategory,
        type: type as TransactionType,
        date: date.toISOString().slice(0, 10),
        recurring,
        frequency: (frequency ? frequency : undefined) as FrequencyType | undefined,
        currency: 'RON', // default, conform shared-constants
        // NOTĂ: user_id este adăugat de supabaseService.createTransaction, nu trebuie trimis de noi
        // conform arhitecturii din memoria 49dcd68b-c9f7-4142-92ef-aca6ff06fe52 (separare responsabilități)
      };
      
      console.log('Sending transaction data:', transactionData);
      
      // Save & refresh
      await transactionStore.saveTransaction(transactionData);
      
      // IMPORTANT: Folosim direct refresh() din store pentru a evita bucla infinită (d7b6eb4b)
      setTimeout(() => {
        console.log('🔄 Force refreshing data directly from store...');
        // Apel direct la store pentru a evita bucla infinită
        transactionStore.refresh();
      }, 300); // delay mic pentru a permite commit în backend
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setPopover(null);
    }
  };
  // Handler pentru închidere popover
  const handleClosePopover = () => setPopover(null);
  
  // Handler pentru editare subcategorie direct din grid
  const handleEditSubcategory = (category: string, subcategory: string, mode: 'edit' | 'delete' = 'edit') => {
    if (!user) return;
    setEditingSubcategory({ category, subcategory, mode });
    setShowCategoryEditor(true);
  };
  
  // Handler pentru resetarea editării subcategoriei în momentul închiderii modalului
  const handleCloseCategoryEditor = () => {
    setShowCategoryEditor(false);
    setEditingSubcategory(null);
  };
  
  // Verifică dacă o subcategorie este personalizată (permite editare/ștergere)
  const isCustomSubcategory = (category: string, subcategory: string): boolean => {
    const foundCategory = categories.find(cat => cat.name === category);
    if (!foundCategory) return false;
    
    const foundSubcategory = foundCategory.subcategories.find(subcat => subcat.name === subcategory);
    return foundSubcategory?.isCustom || false;
  };

  return (
    <React.Fragment>
      {/* Buton gestionare categorii - vizibil doar dacă există user autentificat */}
      {user && (
        <div className="mb-4 flex justify-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow"
            onClick={() => setShowCategoryEditor(true)}
            data-testid="manage-categories-btn"
          >
            {UI.MANAGE_CATEGORIES}
          </button>
        </div>
      )}
      
      {/* Modal CategoryEditor - pentru management general sau editare specifică subcategorie */}
      {user && showCategoryEditor && (
        <CategoryEditor
          open={showCategoryEditor}
          onClose={handleCloseCategoryEditor}
          userId={user?.id || ''}
          initialCategory={editingSubcategory?.category}
          initialSubcategory={editingSubcategory?.subcategory}
        />
      )}
      
      {/* Tabel principal LunarGrid */}
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm align-middle border-separate border-spacing-0" data-testid="lunar-grid-table">
          <thead>
            <tr className="bg-gray-50">
              <th className="sticky left-0 z-20 bg-gray-50 px-4 py-2 text-left" style={{ minWidth: 180 }}>
                {EXCEL_GRID.HEADERS.LUNA}
              </th>
            {days.map(day => (
              <th key={day} className="px-4 py-2 text-right">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(CATEGORIES).map(([categoryKey, subcats]) => {
            const isExpanded = !!expandedCategories[categoryKey];
            const categoryTotalsByDay = categoryTotals[categoryKey];
            
            return (
              <React.Fragment key={categoryKey}>
                {/* Rând principal categorie (expandabil/colapsabil) */}
                <tr 
                  className="bg-teal-100 hover:bg-teal-200 cursor-pointer" 
                  onClick={() => toggleCategory(categoryKey)}
                  data-testid={`category-row-${categoryKey}`}
                >
                  <td 
                    className="sticky left-0 bg-teal-100 hover:bg-teal-200 z-10 font-semibold px-4 py-2 flex items-center"
                    data-testid={`category-header-${categoryKey}`}
                  >
                    {isExpanded ? 
                      <ChevronDown size={16} className="mr-1" data-testid={`category-expanded-${categoryKey}`} /> : 
                      <ChevronRight size={16} className="mr-1" data-testid={`category-collapsed-${categoryKey}`} />}
                    {categoryKey}
                  </td>
                  
                  {/* Totaluri per categorie pe zile, afișate când categoria e colapsata */}
                  {days.map(day => {
                    const categorySum = categoryTotalsByDay[day] || 0;
                    return (
                      <td 
                        key={day} 
                        className={`px-4 py-2 text-right ${getBalanceStyle(categorySum)}`}
                        data-testid={`category-total-${categoryKey}-${day}`}
                      >
                        {categorySum !== 0 ? formatCurrency(categorySum) : '—'}
                      </td>
                    );
                  })}
                </tr>
                
                {/* Randuri cu subcategorii - vizibile doar când categoria e expandata */}
                {isExpanded && Object.entries(subcats).map(([subcatGroup, subcatList]: [string, string[]]) => (
                  subcatList.map((subcat: string) => (
                    <tr 
                      key={`${categoryKey}-${subcat}`}
                      className="hover:bg-gray-100 border-t border-gray-200"
                      data-testid={`subcategory-row-${categoryKey}-${subcat}`}
                    > 
                      <td 
                        className="sticky left-0 bg-white z-10 px-4 py-2 pl-8 flex items-center justify-between"
                        data-testid={`subcat-${subcat}`}
                      >
                        <div className="flex items-center">
                          <div className="w-4 h-0 border-t border-gray-400 mr-2"></div>
                          {/* Indicațor pentru subcategorii personalizate */}
                          <span data-testid={`subcat-label-${subcat}`}>
                            {subcat} {isCustomSubcategory(categoryKey, subcat) && <span className="text-blue-600 text-sm ml-1">➡️</span>}
                          </span>
                        </div>
                        
                        {/* Butoane acțiune pentru subcategorii personalizate, vizibile doar pentru autentificare */}
                        {user && isCustomSubcategory(categoryKey, subcat) && (
                          <div className="flex gap-2 ml-auto">
                            <button 
                              className="p-1 text-gray-500 hover:text-blue-600 focus:outline-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSubcategory(categoryKey, subcat, 'edit');
                              }}
                              title={UI.EDIT_SUBCATEGORY}
                              data-testid={`edit-subcat-${categoryKey}-${subcat}`}
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              className="p-1 text-gray-500 hover:text-red-600 focus:outline-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSubcategory(categoryKey, subcat, 'delete');
                              }}
                              title={UI.DELETE_SUBCATEGORY}
                              data-testid={`delete-subcat-${categoryKey}-${subcat}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                      {days.map(day => {
                        const sum = getSumForCell(transactions, categoryKey, subcat, day);
                        return (
                          <td 
                            key={day} 
                            className={`px-4 py-2 text-right ${sum !== 0 ? getBalanceStyle(sum) : ''}`}
                            data-testid={`cell-${categoryKey}-${subcat}-${day}`}
                            tabIndex={0}
                            onClick={e => handleCellClick(e, categoryKey, subcat, day, sum !== 0 ? String(sum) : '', /*determinat automat*/ getTransactionTypeForCategory(categoryKey))}
                            onDoubleClick={e => handleCellDoubleClick(e, categoryKey, subcat, day, sum !== 0 ? String(sum) : '')}
                          >
                            {sum !== 0 ? formatCurrency(sum) : '—'}
                            {/* Popover doar dacă e celula activă */}
                            {popover && popover.category === categoryKey && popover.subcategory === subcat && popover.day === day && (
                              <div
                                style={{
                                  position: 'absolute',
                                  left: popover.anchorRect ? popover.anchorRect.left - (document.querySelector('.overflow-x-auto')?.getBoundingClientRect().left || 0) : 0,
                                  top: popover.anchorRect ? popover.anchorRect.top - (document.querySelector('.overflow-x-auto')?.getBoundingClientRect().top || 0) + 40 : 0,
                                  zIndex: 100,
                                }}
                                data-testid={`popover-cell-${categoryKey}-${subcat}-${day}`}
                              >
                                <CellTransactionPopover
                                  initialAmount={popover.initialAmount}
                                  day={popover.day}
                                  month={month}
                                  year={year}
                                  category={popover.category}
                                  subcategory={popover.subcategory}
                                  type={popover.type}
                                  onSave={handleSavePopover}
                                  onCancel={handleClosePopover}
                                />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ))}
              </React.Fragment>
            );
          })}
          
          {/* Rândul SOLD la finalul tabelului - conform DEV-4 */}
          <tr className="bg-gray-100 font-bold border-t-2">
            <td 
              className="sticky left-0 bg-gray-100 z-10 px-4 py-2" 
              data-testid="sold-label"
            >
              {EXCEL_GRID.HEADERS.SOLD}
            </td>
            {days.map(day => {
              const balance = dailyBalances[day];
              return (
                <td 
                  key={day} 
                  className={`px-4 py-2 text-right ${getBalanceStyle(balance)}`} 
                  data-testid={`sold-day-${day}`}
                >
                  {formatCurrency(balance)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
    </React.Fragment>
  );
};

export default LunarGrid;
