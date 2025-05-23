import React from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import { TransactionType, TransactionStatus, FrequencyType } from '@shared-constants/enums';
import { TransactionValidated, CreateTransaction } from '@shared-constants/transaction.schema';
import { EXCEL_GRID, LABELS, PLACEHOLDERS } from '@shared-constants/ui';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SubcategoryRows } from './SubcategoryRows';
import { useQueryClient } from '@tanstack/react-query';
// Import hook-uri specializate
import { useMonthlyTransactions } from '../../../services/hooks/useMonthlyTransactions';
import { useCreateTransaction } from '../../../services/hooks/transactionMutations';
import { cn } from '../../../styles/new/shared/utils';
import Button from '../../primitives/Button/Button';
import Badge from '../../primitives/Badge/Badge';

// Helper pentru a genera array [1, 2, ..., n]
const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 0);
  return Array.from({ length: date.getDate() }, (_, i) => i + 1);
};

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
  EDIT_SUBCATEGORY: 'Edită subcategoria',
  DELETE_SUBCATEGORY: 'Șterge subcategoria',
  EXPAND_ALL: 'Extinde toate categoriile',
  COLLAPSE_ALL: 'Colapsează toate categoriile',
};

export const LunarGrid: React.FC<LunarGridProps> = ({ year, month }) => {
  // React Query client - extras la nivel de componentă pentru a respecta Rules of Hooks
  const queryClient = useQueryClient();
  
  // Hook pentru crearea tranzacțiilor
  const createTransactionMutation = useCreateTransaction();

  

  // State pentru subcategoria în curs de editare (pentru editare direct din grid)
  const [editingSubcategory, setEditingSubcategory] = React.useState<{ category: string; subcategory: string; mode: 'edit' | 'delete' | 'add' } | null>(null);

  // Acces la store-ul de categorii pentru a verifica dacă o subcategorie este personalizată
  const categories = useCategoryStore(state => state.categories);
  const loadCategories = useCategoryStore(state => state.loadUserCategories);
  const mergeWithDefaults = useCategoryStore(state => state.mergeWithDefaults);
  const deleteSubcategory = useCategoryStore(state => state.deleteSubcategory);

  // UI copy pentru CategoryEditor (fallback dacă nu există în shared-constants/ui)
  const UI = {
    MANAGE_CATEGORIES: 'Gestionare categorii',
    EDIT_SUBCATEGORY: 'Edită subcategoria',
    DELETE_SUBCATEGORY: 'Șterge subcategoria',
    EXPAND_ALL: 'Extinde toate categoriile',
    COLLAPSE_ALL: 'Colapsează toate categoriile',
  };

  const days = getDaysInMonth(year, month);
  const { transactions, isLoading } = useMonthlyTransactions(year, month, useAuthStore(state => state.user)?.id, { includeAdjacentDays: true });

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

  const expandAll = React.useCallback(() => {
    const newState: Record<string, boolean> = {};
    categories.forEach(c => { newState[c.name] = true; });
    setExpandedCategories(newState);
    try { localStorage.setItem(LOCALSTORAGE_CATEGORY_EXPAND_KEY, JSON.stringify(newState)); } catch { };
  }, [categories]);

  const collapseAll = React.useCallback(() => {
    const newState: Record<string, boolean> = {};
    categories.forEach(c => { newState[c.name] = false; });
    setExpandedCategories(newState);
    try { localStorage.setItem(LOCALSTORAGE_CATEGORY_EXPAND_KEY, JSON.stringify(newState)); } catch { };
  }, [categories]);

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

    categories.forEach(category => {
      result[category.name] = getCategoryTotalAllDays(transactions, category.name);
    });

    return result;
  }, [transactions, categories]);

  // Referință pentru a ține evidența ultimei tranzacții adăugate
  const lastAddedTransactionRef = React.useRef<{ timestamp: number; processed: boolean } | null>(null);

  // Ref și callback pentru refresh subtil după adăugare tranzacție
  const markTransactionAdded = React.useCallback(() => {
    console.log(' Marking transaction added for subtle refresh...');
    lastAddedTransactionRef.current = { timestamp: Date.now(), processed: false };
    setTimeout(() => {
      if (lastAddedTransactionRef.current) {
        lastAddedTransactionRef.current.processed = true;
      }
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['transactions', year, month] });
        queryClient.fetchQuery({ queryKey: ['transactions', year, month] });
      }, 100);
    }, 100);
  }, [year, month, queryClient]);

  // Calculează soldurile zilnice pentru întreaga lună
  const dailyBalances = React.useMemo(() => {
    return days.reduce<Record<number, number>>((acc, day) => {
      acc[day] = calculateDailyBalance(transactions, day);
      return acc;
    }, {});
  }, [days, transactions]);

  // Stil CSS condiționat pentru solduri (pozitiv/negativ)
  const getBalanceStyle = (amount: number): string => {
    if (amount === 0) return 'text-secondary-400';
    return amount > 0 ? 'text-success-600 font-medium' : 'text-error-600 font-medium';
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

      // Save & invalidate pentru a reafișa grid cu noua tranzacție - folosim queryClient extras la nivel de componentă
      queryClient.invalidateQueries({ queryKey: ['transactions', year, month] });
      setPopover(null);
    },
    [month, year, queryClient]
  );

  // Handler pentru salvare tranzacție
  const handleSavePopover = async (data: { amount: string; description: string; recurring: boolean; frequency?: FrequencyType }) => {
    if (!popover) return;

    // Debug
    console.log('Saving transaction with data:', data);

    try {
      // Construim tranzacția cu date implicite din contextul celulei
      const { category, subcategory, day, type } = popover;
      const { amount, description, recurring, frequency } = data;
      const date = new Date(year, month - 1, day);

      // Creăm obiectul tranzacție complet conform tipului așteptat
      const transactionData: CreateTransaction = {
        amount: Number(amount),
        category,
        subcategory,
        type: type as TransactionType,
        date: date.toISOString().slice(0, 10),
        recurring,
        frequency, // Nu mai este necesar cast-ul, deoarece tipurile sunt acum compatibile
        description: description || '', // Folosim descrierea din formular sau string gol
        // NOTĂ: user_id este adăugat de supabaseService.createTransaction, nu trebuie trimis de noi
        // NOTĂ: currency NU este folosit în FE (conform transaction.schema.ts)
      };

      console.log('Sending transaction data:', transactionData);

      // Folosim hook-ul specializat pentru a crea tranzacția
      createTransactionMutation.mutate(transactionData, {
        onSuccess: () => {
          console.log('Tranzacție creată cu succes!');
          // Invocăm callback-ul pentru refresh subtil
          markTransactionAdded();
        },
        onError: (error) => {
          console.error('Eroare la crearea tranzacției:', error);
        }
      });
      
      // Query-ul va fi invalidat automat de către mutate via queryClient în hook
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
    setEditingSubcategory({ category, subcategory, mode });
  };

  const { user } = useAuthStore();
  const handleDeleteSubcategoryDirect = React.useCallback((category: string, subcategory: string) => {
    if (!user) return;
    deleteSubcategory(user.id, category, subcategory, 'delete');
  }, [deleteSubcategory, user]);

  // Verifică dacă o subcategorie este personalizată (permite editare/ștergere)
  const isCustomSubcategory = (category: string, subcategory: string): boolean => {
    const foundCategory = categories.find(cat => cat.name === category);
    if (!foundCategory) return false;

    const foundSubcategory = foundCategory.subcategories.find(subcat => subcat.name === subcategory);
    return foundSubcategory?.isCustom || false;
  };

  // State pentru inline adăugare subcategorie
  const [addingCategory, setAddingCategory] = React.useState<string | null>(null);
  const { categories: categoryList, saveCategories: saveCats } = useCategoryStore();

  return (
    <React.Fragment>
      <div className={getClasses('flex-group', 'end', 'md')}>
        <Button 
          onClick={expandAll} 
          variant="secondary"
          size="sm"
          withShadow
          data-testid="expand-all-btn"
        >
          {UI.EXPAND_ALL}
        </Button>
        <Button 
          onClick={collapseAll} 
          variant="secondary"
          size="sm"
          withShadow
          data-testid="collapse-all-btn"
        >
          {UI.COLLAPSE_ALL}
        </Button>
      </div>
      <div className={`${getClasses('card-section', 'secondary')} overflow-x-auto rounded-lg`}>
        <table className={getClasses('table', 'striped')} data-testid="lunar-grid-table">
          <thead>
            <tr className={getClasses('table-row', 'secondary')}>
              <th className={`${getClasses('table-header')} sticky left-0 z-20 text-left`} style={{ minWidth: 180 }}>
                {EXCEL_GRID.HEADERS.LUNA}
              </th>
              {days.map(day => (
                <th key={day} className={`${getClasses('table-cell')} text-right`}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map(category => {
              const categoryKey = category.name;
              const subcategories = category.subcategories.map(s => s.name);
              const isExpanded = !!expandedCategories[categoryKey];
              const categoryTotalsByDay = categoryTotals[categoryKey] || {};

              return (
                <React.Fragment key={categoryKey}>
                  {/* Rând principal categorie (expandabil/colapsabil) */}
                  <tr
                    className="bg-secondary-100 hover:bg-secondary-200 cursor-pointer"
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

                  {/* Randuri cu subcategorii */}
                  {isExpanded && (
                    <SubcategoryRows
                      categoryKey={categoryKey}
                      subcategories={subcategories}
                      transactions={transactions}
                      days={days}
                      popover={popover}
                      handleCellClick={handleCellClick}
                      handleCellDoubleClick={handleCellDoubleClick}
                      handleSavePopover={handleSavePopover}
                      handleClosePopover={handleClosePopover}
                      handleEditSubcategory={(cat, sub) => { setEditingSubcategory({ category: cat, subcategory: sub, mode: 'edit' }); }}
                      handleDeleteSubcategory={handleDeleteSubcategoryDirect}
                      isCustomSubcategory={isCustomSubcategory}
                      user={user}
                      addingCategory={addingCategory}
                      onAddSubcategory={async (cat: string, newName: string) => {
                        if (!user || !newName.trim()) return;
                        const catObj = categoryList.find(c => c.name === cat);
                        if (!catObj || catObj.subcategories.some(sc => sc.name.toLowerCase() === newName.trim().toLowerCase())) return;
                        const updated = categoryList.map(c => c.name === cat ? { ...c, subcategories: [...c.subcategories, { name: newName.trim(), isCustom: true }] } : c);
                        await saveCats(user.id, updated);
                        setAddingCategory(null);
                      }}
                      onCancelAddSubcategory={() => setAddingCategory(null)}
                      onStartAddSubcategory={(cat: string) => setAddingCategory(cat)}
                    />
                  )}
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
