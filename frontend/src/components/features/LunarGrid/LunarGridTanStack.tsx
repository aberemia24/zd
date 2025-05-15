import React, { useState, useEffect, useMemo } from 'react';
import { useTransactionStore } from '../../../stores/transactionStore';
import { useAuthStore } from '../../../stores/authStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import { TransactionType, TransactionStatus, FrequencyType } from '@shared-constants/enums';
import { TransactionValidated } from '@shared-constants/transaction.schema';
import { EXCEL_GRID } from '@shared-constants/ui';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useLunarGridTable } from './hooks/useLunarGridTable';
import { flexRender } from '@tanstack/react-table';

// Refolosim tipul de props de la LunarGrid pentru consistență API
export interface LunarGridProps {
  year: number;
  month: number;
}

// Constante pentru localStorage - aceleași ca în implementarea anterioară pentru consistență
const LOCALSTORAGE_CATEGORY_EXPAND_KEY = 'budget-app-category-expand';

// UI copy pentru CategoryEditor, identice cu cele din versiunea anterioară
const UI = {
  MANAGE_CATEGORIES: 'Gestionare categorii',
  EDIT_SUBCATEGORY: 'Edită subcategoria',
  DELETE_SUBCATEGORY: 'Șterge subcategoria',
  EXPAND_ALL: 'Extinde toate categoriile',
  COLLAPSE_ALL: 'Colapsează toate categoriile',
};

/**
 * LunarGridTanStack - Implementare a grilei lunare folosind TanStack Table
 * pentru performanță și extensibilitate îmbunătățite.
 * 
 * Păstrează aceeași funcționalitate ca versiunea originală LunarGrid.
 */
function LunarGridTanStack({ year, month }: LunarGridProps) {
  // Stores
  const { transactions, fetchTransactionsForMonthYear, addTransaction, updateTransaction, deleteTransaction } = useTransactionStore();
  const { user } = useAuthStore();
  const { categoryList, loadCategories, updateCategory, saveCategoryList } = useCategoryStore();
  
  // State
  const [popover, setPopover] = useState<{
    active: boolean;
    day: number;
    category: string;
    subcategory: string;
    anchorRect?: DOMRect;
    initialAmount?: string;
    type: string;
  }>({
    active: false,
    day: 0,
    category: '',
    subcategory: '',
    type: TransactionType.EXPENSE,
  });
  
  const [editingSubcategory, setEditingSubcategory] = useState<{
    category: string;
    subcategory: string;
    mode: 'edit' | 'delete';
  } | null>(null);
  
  const [addingCategory, setAddingCategory] = useState<string | null>(null);
  
  // Stare pentru expandarea categoriilor, persistată în localStorage
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_CATEGORY_EXPAND_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (err) {
      console.error('Error loading expanded categories from localStorage:', err);
      return {};
    }
  });
  
  // Încarcă tranzacțiile la montare și când se schimbă luna/anul
  useEffect(() => {
    console.log(`Loading transactions for ${year}-${month}`);
    fetchTransactionsForMonthYear(year, month);
  }, [year, month, fetchTransactionsForMonthYear]);
  
  // Încarcă categoriile la montare dacă userul este logat
  useEffect(() => {
    if (user?.id) {
      loadCategories(user.id);
    }
  }, [user?.id, loadCategories]);
  
  // Salvează starea de expandare în localStorage
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_CATEGORY_EXPAND_KEY, JSON.stringify(expandedCategories));
  }, [expandedCategories]);
  
  // === Helper functions ===
  
  // Stil CSS condiționat pentru solduri (pozitiv/negativ)
  const getBalanceStyle = (amount: number): string => {
    if (amount > 0) return 'text-green-600';
    if (amount < 0) return 'text-red-600';
    return '';
  };
  
  // Helper pentru a determina tipul tranzacției în funcție de categorie
  const getTransactionTypeForCategory = (category: string): TransactionType => {
    const categoryObj = categoryList.find(c => c.name === category);
    return categoryObj?.defaultType || TransactionType.EXPENSE;
  };
  
  // Formatare valută pentru afișare (RON 0.00)
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 2,
    }).format(amount).replace('RON', '').trim() + ' RON';
  };
  
  // Handler pentru expandare/colapsare categorie
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newState = { ...prev };
      newState[category] = !prev[category];
      return newState;
    });
  };
  
  // Expandare/colapsare toate categoriile
  const toggleAllCategories = (expand: boolean) => {
    const allCategories = categoryList.reduce(
      (acc, cat) => ({ ...acc, [cat.name]: expand }), 
      {} as Record<string, boolean>
    );
    setExpandedCategories(allCategories);
  };
  
  // === Event handlers ===
  
  // Handler pentru click pe celulă: deschide popover
  const handleCellClick = (
    e: React.MouseEvent<HTMLTableCellElement>,
    category: string,
    subcategory: string,
    day: number,
    amount: string,
    type: string
  ) => {
    // Prevent default dacă este double click - să nu interfere cu handlerul de double click
    if (e.detail === 2) return;
    
    setPopover({
      active: true,
      day,
      category,
      subcategory,
      type: type || getTransactionTypeForCategory(category),
      anchorRect: e.currentTarget.getBoundingClientRect(),
      initialAmount: amount,
    });
  };
  
  // Handler pentru double click pe celulă: editare rapidă cu prompt
  const handleCellDoubleClick = (
    e: React.MouseEvent<HTMLTableCellElement>,
    category: string,
    subcategory: string,
    day: number,
    currentAmount: string
  ) => {
    const type = getTransactionTypeForCategory(category);
    const newAmount = window.prompt(
      `Editare rapidă: ${category} > ${subcategory}, ${day}/${month}/${year}`,
      currentAmount === '—' ? '' : currentAmount.replace(' RON', '')
    );
    
    if (newAmount === null) return; // User a anulat
    
    // Verifică dacă input-ul este valid
    const numericValue = parseFloat(newAmount.replace(',', '.'));
    
    if (isNaN(numericValue) && newAmount.trim() !== '') {
      alert('Vă rugăm să introduceți o valoare numerică validă.');
      return;
    }
    
    // Pentru ștergere (input gol)
    if (newAmount.trim() === '' && currentAmount !== '—') {
      const confirm = window.confirm('Confirmați ștergerea tranzacției?');
      if (confirm) {
        // Găsește tranzacția existentă și o șterge
        const date = new Date(year, month - 1, day).toISOString().split('T')[0];
        const existingTransaction = transactions.find(
          t => t.date === date && t.category === category && t.subcategory === subcategory
        );
        
        if (existingTransaction?.id) {
          deleteTransaction(existingTransaction.id);
        }
      }
      return;
    }
    
    // Pentru adăugare/actualizare
    if (!isNaN(numericValue)) {
      const date = new Date(year, month - 1, day).toISOString().split('T')[0];
      
      // Găsește tranzacția existentă pentru actualizare
      const existingTransaction = transactions.find(
        t => t.date === date && t.category === category && t.subcategory === subcategory
      );
      
      if (existingTransaction?.id) {
        // Actualizare
        updateTransaction({
          ...existingTransaction,
          amount: type === TransactionType.INCOME ? Math.abs(numericValue) : -Math.abs(numericValue),
        });
      } else {
        // Adăugare
        addTransaction({
          date,
          category,
          subcategory,
          amount: type === TransactionType.INCOME ? Math.abs(numericValue) : -Math.abs(numericValue),
          description: '',
          status: TransactionStatus.COMPLETED,
          recurring: false,
          frequency: FrequencyType.NONE,
          type,
          user_id: user?.id || '',
        });
      }
    }
  };
  
  // Handler pentru salvare tranzacție din popover
  const handleSavePopover = (data: { amount: string; recurring: boolean; frequency: string }) => {
    const { day, category, subcategory, type } = popover;
    const numericAmount = parseFloat(data.amount.replace(',', '.'));
    
    if (isNaN(numericAmount)) {
      alert('Vă rugăm să introduceți o sumă validă');
      return;
    }
    
    // Formatarea datei pentru stocare
    const date = new Date(year, month - 1, day).toISOString().split('T')[0];
    
    // Găsește tranzacția existentă pentru actualizare
    const existingTransaction = transactions.find(
      t => t.date === date && t.category === category && t.subcategory === subcategory
    );
    
    // Semnul sumei depinde de tipul tranzacției
    const signedAmount = type === TransactionType.INCOME 
      ? Math.abs(numericAmount) 
      : -Math.abs(numericAmount);
    
    if (existingTransaction?.id) {
      // Actualizare tranzacție existentă
      updateTransaction({
        ...existingTransaction,
        amount: signedAmount,
        recurring: data.recurring,
        frequency: data.recurring ? data.frequency as FrequencyType : FrequencyType.NONE,
      });
    } else {
      // Creare tranzacție nouă
      addTransaction({
        date,
        category,
        subcategory,
        amount: signedAmount,
        description: '',
        status: TransactionStatus.COMPLETED,
        recurring: data.recurring,
        frequency: data.recurring ? data.frequency as FrequencyType : FrequencyType.NONE,
        type: type as TransactionType,
        user_id: user?.id || '',
      });
    }
    
    // Închide popover-ul
    setPopover(prev => ({ ...prev, active: false }));
  };
  
  // Handler pentru închidere popover
  const handleClosePopover = () => {
    setPopover(prev => ({ ...prev, active: false }));
  };
  
  // Handler pentru editare subcategorie direct din grid
  const handleEditSubcategory = (category: string, subcategory: string, mode: 'edit' | 'delete' = 'edit') => {
    setEditingSubcategory({ category, subcategory, mode });
  };
  
  // Handler pentru ștergere directă subcategorie
  const handleDeleteSubcategoryDirect = (category: string, subcategory: string) => {
    const confirm = window.confirm(`Confirmați ștergerea subcategoriei ${subcategory}?`);
    if (!confirm || !user?.id) return;
    
    const currentCategory = categoryList.find(c => c.name === category);
    if (!currentCategory) return;
    
    // Verificare dacă subcategoria există și este customizată
    const subIndex = currentCategory.subcategories.findIndex(s => s.name === subcategory);
    if (subIndex === -1 || !currentCategory.subcategories[subIndex].isCustom) return;
    
    // Actualizează lista de categorii
    const updatedCats = categoryList.map(c => {
      if (c.name === category) {
        return {
          ...c,
          subcategories: c.subcategories.filter(s => s.name !== subcategory),
        };
      }
      return c;
    });
    
    // Salvează categoriile actualizate
    saveCategoryList(user.id, updatedCats);
  };
  
  // Verifică dacă o subcategorie este personalizată
  const isCustomSubcategory = (category: string, subcategory: string): boolean => {
    const cat = categoryList.find(c => c.name === category);
    if (!cat) return false;
    
    const sub = cat.subcategories.find(s => s.name === subcategory);
    return !!sub?.isCustom;
  };
  
  // === Setup TanStack Table ===
  const {
    table,
    days,
    dailyBalances,
  } = useLunarGridTable({
    year,
    month,
    transactions,
    expandedCategories,
    formatCurrency,
    getBalanceStyle,
    getTransactionTypeForCategory,
    onToggleCategory: toggleCategory,
    onCellClick: handleCellClick,
    onCellDoubleClick: handleCellDoubleClick,
  });
  
  // === Render ===
  
  return (
    <React.Fragment>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {EXCEL_GRID.TITLE} - {month}/{year}
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => toggleAllCategories(true)}
            className="px-3 py-1 bg-teal-100 rounded hover:bg-teal-200"
            data-testid="expand-all-btn"
          >
            {UI.EXPAND_ALL}
          </button>
          <button
            onClick={() => toggleAllCategories(false)}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            data-testid="collapse-all-btn"
          >
            {UI.COLLAPSE_ALL}
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {/* Header pentru categorie */}
              <th 
                scope="col"
                className="sticky left-0 bg-gray-50 z-10 px-4 py-2 text-left font-bold"
                data-testid="category-column-header"
              >
                {EXCEL_GRID.HEADERS.CATEGORY}
              </th>
              
              {/* Headere pentru zilele lunii */}
              {days.map(day => (
                <th 
                  key={day}
                  scope="col"
                  className="px-4 py-2 text-center font-bold"
                  data-testid={`day-header-${day}`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {/* Rânduri pentru fiecare categorie și subcategoriile lor */}
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id}
                className={row.original.subcategoryKey ? 'hover:bg-gray-50' : 'bg-teal-50'}
                data-testid={row.original.subcategoryKey 
                  ? `subcat-row-${row.original.categoryKey}-${row.original.subcategoryKey}`
                  : `category-row-${row.original.categoryKey}`
                }
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className={cell.column.id === 'categoryKey' 
                      ? 'sticky left-0 z-10' 
                      : 'cursor-pointer'
                    }
                    onClick={cell.column.id !== 'categoryKey' 
                      ? (e) => {
                        // Doar pentru celule subcategorie
                        if (row.original.subcategoryKey) {
                          const day = parseInt(cell.column.id.replace('day-', ''));
                          const amount = cell.getValue() as number;
                          handleCellClick(
                            e as React.MouseEvent<HTMLTableCellElement>,
                            row.original.categoryKey,
                            row.original.subcategoryKey,
                            day,
                            amount !== 0 ? formatCurrency(amount) : '—',
                            getTransactionTypeForCategory(row.original.categoryKey)
                          );
                        }
                      } 
                      : undefined
                    }
                    onDoubleClick={cell.column.id !== 'categoryKey' 
                      ? (e) => {
                        // Doar pentru celule subcategorie
                        if (row.original.subcategoryKey) {
                          const day = parseInt(cell.column.id.replace('day-', ''));
                          const amount = cell.getValue() as number;
                          handleCellDoubleClick(
                            e as React.MouseEvent<HTMLTableCellElement>,
                            row.original.categoryKey,
                            row.original.subcategoryKey,
                            day,
                            amount !== 0 ? formatCurrency(amount) : '—'
                          );
                        }
                      } 
                      : undefined
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            
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
      
      {/* Popover pentru editare tranzacții - identic cu original */}
      {popover.active && (
        <div 
          className="fixed bg-white shadow-xl border rounded-lg p-4 z-50"
          style={{
            top: (popover.anchorRect?.bottom || 0) + 5,
            left: (popover.anchorRect?.left || 0),
          }}
          data-testid="transaction-popover"
        >
          <h3 className="font-bold mb-2">
            {popover.category} &gt; {popover.subcategory}, {popover.day}/{month}/{year}
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm mb-1">Sumă:</label>
            <input
              type="text"
              className="w-full border rounded py-1 px-2"
              defaultValue={popover.initialAmount === '—' ? '' : popover.initialAmount?.replace(' RON', '')}
              autoFocus
              data-testid="amount-input"
              id="amount-input"
            />
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                data-testid="recurring-checkbox"
              />
              Recurentă
            </label>
            
            <div className="mt-2 pl-5">
              <select 
                className="w-full border rounded py-1 px-2"
                defaultValue={FrequencyType.MONTHLY}
                disabled={true}
                data-testid="frequency-select"
              >
                <option value={FrequencyType.DAILY}>Zilnic</option>
                <option value={FrequencyType.WEEKLY}>Săptămânal</option>
                <option value={FrequencyType.MONTHLY}>Lunar</option>
                <option value={FrequencyType.YEARLY}>Anual</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                const amountInput = document.getElementById('amount-input') as HTMLInputElement;
                const recurringCheckbox = document.querySelector('[data-testid="recurring-checkbox"]') as HTMLInputElement;
                const frequencySelect = document.querySelector('[data-testid="frequency-select"]') as HTMLSelectElement;
                
                handleSavePopover({
                  amount: amountInput.value,
                  recurring: recurringCheckbox.checked,
                  frequency: frequencySelect.value,
                });
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              data-testid="save-btn"
            >
              Salvează
            </button>
            <button
              onClick={handleClosePopover}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              data-testid="cancel-btn"
            >
              Anulează
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default LunarGridTanStack;
