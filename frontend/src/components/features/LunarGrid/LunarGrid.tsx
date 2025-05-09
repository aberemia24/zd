import React from 'react';
import { useTransactionStore } from '../../../stores/transactionStore';
import { useAuthStore } from '../../../stores/authStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import { CATEGORIES } from '@shared-constants/categories';
import { TransactionType, TransactionStatus, FrequencyType } from '@shared-constants/enums';
import { TransactionValidated } from '@shared-constants/transaction.schema';
import { EXCEL_GRID, UI as UI_CONSTANTS } from '@shared-constants/ui';
import { ChevronDown, ChevronRight, Edit, Trash2, Plus, Check, X } from 'lucide-react';
import CellTransactionPopover from './CellTransactionPopover';

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

// Folosim constantele din shared-constants/ui.ts conform regulilor globale

export const LunarGrid: React.FC<LunarGridProps> = ({ year, month }) => {
  // State pentru adăugare subcategorie inline
  const [addingSubcategory, setAddingSubcategory] = React.useState<{category: string, value: string} | null>(null);
  const { user } = useAuthStore();
  
  // Nu mai avem nevoie de state pentru editare subcategorii în grid
  // Această funcționalitate a fost mutată în pagina de Opțiuni
  
  // Acces la store-ul de categorii pentru a verifica dacă o subcategorie este personalizată
  // Folosim destructurare pentru a respecta pattern-ul recomandat în memoria 49dcd68b
  // Acces la store-ul de categorii - folosim hook-ul direct pentru a asigura re-render la schimbări
  // Acesta este un pattern sigur deoarece nu combinăm fetch cu setState în același effect
  const { categories } = useCategoryStore(state => ({
    categories: state.categories
  }));
  
  // Important: Vom adăuga un listener pentru evenimentul custom 'category-added' mai jos,
  // după ce declarăm variabila forceRefresh

  const days = getDaysInMonth(year, month);
  const { transactions, forceRefresh } = useMonthlyTransactions(year, month);
  
  // IMPORTANT: Folosim un state local pentru a forța actualizarea UI-ului după adăugarea unei subcategorii
  // Acesta nu creează bucle infinite deoarece nu combinăm operații de fetch cu setState
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  
  // SOLUȚIE DEFINITIVĂ PENTRU A ELIMINA BUCLA INFINITĂ
  // În loc să folosim evenimente personalizate care pot cauza bucle infinite,
  // vom verifica direct snapshot-uri ale categoriilor folosind localStorage
  
  // 1. Definim o cheie pentru localStorage pentru a stoca timestamp-ul ultimei modificări
  const LAST_CATEGORY_UPDATE_KEY = 'budget-app-last-category-update';
  
  // 2. Ref pentru ultima dată când am verificat categoriile 
  // pentru a evita operații duplicate sau inutile
  const lastCategoryCheckRef = React.useRef<number>(0);
  
  // 3. Ref pentru timeout-ul de poll - pentru a putea face cleanup corect
  const categoryPollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // 4. Use state pentru a forța re-render-ul când se detectează schimbări
  const [refreshCounter, setRefreshCounter] = React.useState<number>(0);
  
  // 5. Implementarea unui polling sigur pentru a verifica modificările
  // Fără a folosi evenimente care pot cauza bucle
  React.useEffect(() => {
    console.log('[LunarGrid] Inițializarea mecanismului sigur de detectare a schimbărilor de categorii');
    
    // Verificare pentru modificări la categorii din localStorage
    const checkForCategoryChanges = () => {
      try {
        const lastUpdateString = localStorage.getItem(LAST_CATEGORY_UPDATE_KEY);
        const lastUpdate = lastUpdateString ? parseInt(lastUpdateString, 10) : 0;
        
        // Dacă timestamp-ul s-a schimbat, înseamnă că altcineva a modificat categoriile
        if (lastUpdate > lastCategoryCheckRef.current) {
          console.log('[LunarGrid] Detectată actualizare de categorii la', new Date(lastUpdate).toISOString());
          lastCategoryCheckRef.current = lastUpdate;
          
          // Forțăm re-render-ul fără a declanșa efecte
          // IMPORTANT: Folosim un setTimeout pentru a preveni bucle de actualizare
          // conform recomandărilor din memoria e0d0698c
          setTimeout(() => {
            setRefreshCounter(prev => prev + 1);
          }, 0);
        }
      } catch (error) {
        console.error('[LunarGrid] Eroare la verificarea modificărilor de categorii', error);
      }
      
      // Programăm următoarea verificare (polling la fiecare 2 secunde)
      categoryPollTimeoutRef.current = setTimeout(checkForCategoryChanges, 2000);
    };
    
    // Inițiem prima verificare
    checkForCategoryChanges();
    
    // Cleanup la demontare
    return () => {
      if (categoryPollTimeoutRef.current) {
        clearTimeout(categoryPollTimeoutRef.current);
      }
    };
  }, []); // Fără dependențe - rulează doar la montare/demontare
  
  // Debug
  React.useEffect(() => {
    if (refreshTrigger > 0) {
      console.log(`[LunarGrid] Refresh categorii: ${refreshTrigger}`);
      console.log('[LunarGrid] Categorii curente:', categories.map(c => c.name));
      categories.forEach(cat => {
        console.log(`[LunarGrid] Subcategorii pentru ${cat.name}:`, cat.subcategories.map(sc => sc.name));
      });
    }
  }, [refreshTrigger, categories]);
  
  // Stare pentru categorii expandate/colapsate - persistentă în localStorage
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>(() => {
    try {
      // Încearcă să încarce starea din localStorage
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
  // IMPORTANT: Eliminăm complet dependența circulară folosind useCategoryStore.getState()
  // conform recomandărilor din memoria d7b6eb4b
  const categoryTotals = React.useMemo(() => {
    const result: Record<string, Record<number, number>> = {};
    
    // Extragem toate numele de categorii din constante și store
    // Această abordare asigură că include toate categoriile posibile
    const categoryNames = new Set<string>();
    
    // Adăugăm mai întâi categoriile din constante
    Object.keys(CATEGORIES).forEach(cat => categoryNames.add(cat));
    
    // Apoi adăugăm toate categoriile din store
    // Folosim getState() pentru a accesa valorile curente fără a crea dependențe
    const storeCategories = useCategoryStore.getState().categories;
    storeCategories.forEach(cat => categoryNames.add(cat.name));
    
    // Calculăm totaluri pentru fiecare categorie
    Array.from(categoryNames).forEach(category => {
      result[category] = getCategoryTotalAllDays(transactions, category);
    });
    
    return result;
  }, [transactions, refreshCounter]); // Dependm doar de tranzacții și contorul de refresh de la localStorage
  
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
    // Această funcționalitate a fost mutată în pagina de opțiuni
    // Vom deschide pagina de opțiuni în viitor pentru această acțiune
    alert('Această funcționalitate este disponibilă în pagina de Opțiuni');
  };
  
  // Handler pentru a începe adăugarea unei subcategorii direct în grid
  const handleStartAddSubcategory = (category: string) => {
    setAddingSubcategory({ category, value: '' });
  };
  
  // Handler pentru a salva subcategoria adăugată direct în grid
  const handleSaveNewSubcategory = async () => {
    if (!addingSubcategory || !addingSubcategory.value.trim() || !user) {
      setAddingSubcategory(null);
      return;
    }
    
    const { category, value } = addingSubcategory;
    const trimmedValue = value.trim();
    
    // Verificăm dacă subcategoria există deja
    const categoryObj = categories.find(c => c.name === category);
    if (categoryObj?.subcategories.some(sc => sc.name.toLowerCase() === trimmedValue.toLowerCase())) {
      alert('Există deja o subcategorie cu acest nume');
      return;
    }
    
    try {
      console.log('[LunarGrid] Adăugare subcategorie nouă:', category, trimmedValue);
      
      // Folosim API-ul direct al store-ului pentru a obține categoriile curente
      // Aceasta este o tehnică sigură care respectă memoria critică d7b6eb4b
      const currentCategories = useCategoryStore.getState().categories;
      
      // Adăugăm subcategoria nouă
      const updatedCategories = [...currentCategories];
      const categoryIndex = updatedCategories.findIndex(c => c.name === category);
      
      if (categoryIndex !== -1) {
        // Creăm un nou obiect pentru a evita mutații directe
        updatedCategories[categoryIndex] = {
          ...updatedCategories[categoryIndex],
          subcategories: [
            ...updatedCategories[categoryIndex].subcategories,
            { name: trimmedValue, isCustom: true }
          ]
        };
        
        // IMPORTANT: Conform memoriei critice d7b6eb4b, folosim direct store-ul fără hook
        // pentru a evita bucle infinite de actualizare
        const store = useCategoryStore.getState();
        await store.saveCategories(user.id, updatedCategories);

        // În loc să folosim loadUserCategories, care poate crea bucle,
        // actualizăm direct UI-ul și forțăm un refresh doar al datelor tranzacției
        setAddingSubcategory(null);
        
        
        // Forțăm doar un refresh al grid-ului fără a reîncărca categoriile
        // Aceasta este o soluție sigură conform e0d0698c-ac6d-444f-8811-b1a3936df71b
        window.dispatchEvent(new CustomEvent('category-added'));
        
        console.log('[LunarGrid] Subcategorie adăugată cu succes');
      } else {
        throw new Error('Categoria nu a fost găsită');
      }
    } catch (error) {
      console.error('Eroare la salvarea subcategoriei:', error);
      alert('A apărut o eroare la salvarea subcategoriei. Încercați din nou.');
    }
  };
  
  // Handler pentru a anula adăugarea subcategoriei
  const handleCancelAddSubcategory = () => {
    setAddingSubcategory(null);
  };

  // Verifică dacă o subcategorie este personalizată (permite editare/ștergere)
  // Folosim direct store-ul pentru a avea mereu valorile actualizate
  const isCustomSubcategory = (category: string, subcategory: string): boolean => {
    // Accesăm direct categoriile din store pentru a evita probleme de sincronizare
    const currentCategories = useCategoryStore.getState().categories;
    const foundCategory = currentCategories.find(cat => cat.name === category);
    if (!foundCategory) return false;
    
    const foundSubcategory = foundCategory.subcategories.find(sc => sc.name === subcategory);
    return foundSubcategory?.isCustom || false;
  };

  // Helper pentru a obține numărul de tranzacții pentru o subcategorie
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getSubcategoryCount = (category: string, subcategory: string): number => {
    return useCategoryStore.getState().getSubcategoryCount(category, subcategory);
  };

  return (
    <React.Fragment>
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
            {/* Folosim categoriile din store pentru a putea vedea modificările imediat */}
            {categories.map(category => {
              const categoryKey = category.name;
              const isExpanded = !!expandedCategories[categoryKey];
              // Adăugăm verificare de siguranță pentru a evita accesarea proprietăților undefined
              const categoryTotalsByDay = categoryTotals[categoryKey] || {};
              
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
                      // Accesăm proprietatea day cu verificare de siguranță
                      const categorySum = (categoryTotalsByDay && categoryTotalsByDay[day]) || 0;
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
                  
                  {/* Renderăm subcategoriile dacă categoria este expandată */}
                  {isExpanded && (
                    <>
                      {/* Folosim subcategoriile din store pentru a vedea modificările imediat */}
                      {category.subcategories.map(subcat => (
                        <tr 
                          key={`${categoryKey}-${subcat.name}`}
                          className="hover:bg-gray-100 border-t border-gray-200"
                          data-testid={`subcategory-row-${categoryKey}-${subcat.name}`}
                        > 
                          <td 
                            className="sticky left-0 bg-white z-10 px-4 py-2 pl-8 flex items-center justify-between"
                            data-testid={`subcat-${subcat.name}`}
                          >
                            <div className="flex items-center">
                              <div className="w-4 h-0 border-t border-gray-400 mr-2"></div>
                              {/* Indicațor pentru subcategorii personalizate */}
                              <span data-testid={`subcat-label-${subcat.name}`}>
                                {subcat.name} {subcat.isCustom && <span className="text-blue-600 text-sm ml-1">➡️</span>}
                              </span>
                            </div>
                            
                            {/* Butoane acțiune pentru subcategorii personalizate, vizibile doar pentru autentificare */}
                            {user && subcat.isCustom && (
                              <div className="flex gap-2 ml-auto">
                                <button 
                                  className="p-1 text-gray-500 hover:text-blue-600 focus:outline-none"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditSubcategory(categoryKey, subcat.name, 'edit');
                                  }}
                                  title={UI_CONSTANTS.EDIT_SUBCATEGORY}
                                  data-testid={`edit-subcat-${categoryKey}-${subcat.name}`}
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  className="p-1 text-gray-500 hover:text-red-600 focus:outline-none"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditSubcategory(categoryKey, subcat.name, 'delete');
                                  }}
                                  title={UI_CONSTANTS.DELETE_SUBCATEGORY}
                                  data-testid={`delete-subcat-${categoryKey}-${subcat.name}`}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </td>
                          {days.map(day => {
                            const sum = getSumForCell(transactions, categoryKey, subcat.name, day);
                            return (
                              <td 
                                key={day} 
                                className={`px-4 py-2 text-right ${sum !== 0 ? getBalanceStyle(sum) : ''}`}
                                data-testid={`cell-${categoryKey}-${subcat.name}-${day}`}
                                tabIndex={0}
                                onClick={e => handleCellClick(e, categoryKey, subcat.name, day, sum !== 0 ? String(sum) : '', getTransactionTypeForCategory(categoryKey))}
                                onDoubleClick={e => handleCellDoubleClick(e, categoryKey, subcat.name, day, sum !== 0 ? String(sum) : '')}
                              >
                                {sum !== 0 ? formatCurrency(sum) : '—'}
                                {/* Popover doar dacă e celula activă */}
                                {popover && popover.category === categoryKey && popover.subcategory === subcat.name && popover.day === day && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      left: popover.anchorRect ? popover.anchorRect.left - (document.querySelector('.overflow-x-auto')?.getBoundingClientRect().left || 0) : 0,
                                      top: popover.anchorRect ? popover.anchorRect.top - (document.querySelector('.overflow-x-auto')?.getBoundingClientRect().top || 0) + 40 : 0,
                                      zIndex: 100,
                                    }}
                                    data-testid={`popover-cell-${categoryKey}-${subcat.name}-${day}`}
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
                      ))}
                      {/* Input inline pentru adăugare subcategorie direct în grid */}
                      {user && (
                        <tr>
                          <td className="sticky left-0 bg-white z-10 px-4 py-2 border-t border-dashed border-gray-300">
                            {addingSubcategory && addingSubcategory.category === categoryKey ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={addingSubcategory.value}
                                  onChange={(e) => setAddingSubcategory({...addingSubcategory, value: e.target.value})}
                                  placeholder="Nume subcategorie"
                                  className="border border-blue-300 px-2 py-1 text-sm rounded flex-1"
                                  autoFocus
                                  onKeyDown={(e) => e.key === 'Enter' && handleSaveNewSubcategory()}
                                  data-testid={`new-subcat-input-${categoryKey}`}
                                />
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSaveNewSubcategory();
                                  }}
                                  className="p-1 text-green-600 hover:text-green-800"
                                  title="Salvează"
                                  data-testid={`save-new-subcat-${categoryKey}`}
                                >
                                  <Check size={16} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleCancelAddSubcategory();
                                  }}
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="Anulează"
                                  data-testid={`cancel-new-subcat-${categoryKey}`}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleStartAddSubcategory(categoryKey);
                                }}
                                className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm"
                                data-testid={`add-subcat-${categoryKey}-btn`}
                              >
                                <Plus size={14} /> {EXCEL_GRID.ACTIONS.ADD_SUBCATEGORY || 'Adaugă subcategorie'}
                              </button>
                            )}
                          </td>
                          {days.map(day => (
                            <td key={day} className="px-4 py-2 text-center text-gray-400 border-t border-dashed border-gray-300">—</td>
                          ))}
                        </tr>
                      )}
                    </>
                  )}
                </React.Fragment>
              );
            })}
            
            {/* Rândul SOLD la finalul tabelului */}
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
