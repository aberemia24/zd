import React, { useCallback, useState, useEffect } from 'react';
import { 
  flexRender, 
  Header, 
  Row as TableRow,
  Cell
} from '@tanstack/react-table';
import { useLunarGridTable, TransformedTableDataRow } from './hooks/useLunarGridTable';

// Import DOAR stores și constante existente
import { useTransactionStore } from '../../../stores/transactionStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import { useAuthStore } from '../../../stores/authStore'; // user from here is needed by transactionStore indirectly
import { EXCEL_GRID } from '@shared-constants';
import { MESAJE } from '@shared-constants/messages';
import { TransactionType, FrequencyType } from '@shared-constants/enums';

// Import doar componente existente
import CellTransactionPopover from './CellTransactionPopover';

export interface LunarGridTanStackProps {
  year: number;
  month: number;
}

const LunarGridTanStack: React.FC<LunarGridTanStackProps> = ({ year, month }) => {
  // Folosim DOAR store-uri existente
  // transactions is no longer directly used here, data comes from useLunarGridTable
  const fetchTransactions = useTransactionStore(state => state.fetchTransactions);
  const loading = useTransactionStore(state => state.loading);
  const invalidateMonthCache = useTransactionStore(state => state._invalidateMonthCache);
  const saveTransaction = useTransactionStore(state => state.saveTransaction);
  
  const categories = useCategoryStore(state => state.categories);
  const user = useAuthStore(state => state.user); // Kept as it's likely used by transactionStore (fetch/save)
  
  // State pentru expandare/colapsare categorii
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // State pentru popover de editare
  const [popover, setPopover] = useState<any>(null);
  
  // Încărcăm tranzacțiile la montare și când se schimbă anul/luna
  useEffect(() => {
    fetchTransactions(false);
  }, [year, month, fetchTransactions]);
  
  // Funcții pentru managementul categoriilor - folosind DOAR funcții existente
  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);
  
  // Funcții utilitare pentru expandare/colapsare globală
  const expandAll = useCallback(() => {
    const allExpanded: Record<string, boolean> = {};
    categories.forEach(cat => {
      allExpanded[cat.name] = true;
    });
    setExpandedCategories(allExpanded);
  }, [categories]);
  
  const collapseAll = useCallback(() => {
    const allCollapsed: Record<string, boolean> = {};
    categories.forEach(cat => {
      allCollapsed[cat.name] = false;
    });
    setExpandedCategories(allCollapsed);
  }, [categories]);
  
  // Implementăm handleri pentru evenimente
  const handleCellClick = useCallback((
    e: React.MouseEvent,
    category: string,
    subcategory: string | undefined,
    day: number,
    amount: string,
    type: string
  ) => {
    // Logica pentru click pe celulă - folosind doar funcții existente
    setPopover({
      active: true,
      category,
      subcategory,
      day,
      anchorRect: e.currentTarget.getBoundingClientRect(),
      initialAmount: amount,
      type: determineTransactionType(category) // Utilizează o funcție helper locală
    });
  }, []);
  
  // Handler pentru double click - pentru editare rapidă
  const handleCellDoubleClick = useCallback((
    e: React.MouseEvent,
    category: string,
    subcategory: string | undefined,
    day: number,
    amount: string
  ) => {
    const transactionType = determineTransactionType(category);
    const newAmount = window.prompt(
      EXCEL_GRID.PROMPTS.ENTER_AMOUNT,
      amount
    );
    
    if (newAmount === null) return; // User a anulat
    
    // Validare simplă
    if (!/^\d+(\.\d{1,2})?$/.test(newAmount)) {
      alert(MESAJE.VALIDARE.SUMA_INVALIDA);
      return;
    }
    
    // Construim data
    const date = new Date(year, month - 1, day).toISOString().slice(0, 10);
    
    // Salvăm tranzacția
    saveTransaction({
      amount: Number(newAmount),
      category,
      // TODO: Verifică dacă backend-ul/store-ul gestionează corect '' ca absența subcategoriei sau dacă ar trebui să fie null/undefined.
      subcategory: subcategory || '', 
      type: transactionType,
      date,
      recurring: false,
      currency: 'RON'
    }).then(() => {
      invalidateMonthCache(year, month);
      setTimeout(() => {
        fetchTransactions(true);
      }, 100);
    }).catch(error => {
      console.error('Error saving transaction:', error);
    });
  }, [year, month, saveTransaction, invalidateMonthCache, fetchTransactions]);
  
  // Helper pentru a determina tipul tranzacției - funcție LOCALĂ, nu referință externă
  const determineTransactionType = (category: string): TransactionType => {
    if (category === 'VENITURI') return TransactionType.INCOME;
    if (category === 'ECONOMII') return TransactionType.SAVING;
    return TransactionType.EXPENSE;
  };
  
  // Handler pentru salvare - folosind DOAR funcții existente
  const handleSavePopover = useCallback(async (data: { amount: string; recurring: boolean; frequency: string }) => {
    if (!popover) return;
    
    try {
      const { category, subcategory, day, type } = popover;
      const { amount, recurring, frequency } = data;
      const date = new Date(year, month - 1, day).toISOString().slice(0, 10);
      
      // Folosim DOAR funcția saveTransaction existentă
      await saveTransaction({
        amount: Number(amount),
        category,
        // TODO: Verifică dacă backend-ul/store-ul gestionează corect '' ca absența subcategoriei sau dacă ar trebui să fie null/undefined.
        // Modificat: Se trimite `subcategory` direct. Dacă este `undefined` (ex: pentru VENITURI fără subcategorie specificată),
        // va fi trimis ca atare, permițând backend-ului să interpreteze ca NULL dacă schema o permite.
        subcategory: subcategory, 
        type: type as TransactionType,
        date,
        recurring,
        frequency: recurring ? (frequency as FrequencyType) : undefined,
        currency: 'RON'
      });
      
      // După salvare, invalidăm cache-ul și reîncărcăm datele
      // Folosim DOAR funcțiile existente
      invalidateMonthCache(year, month);
      setTimeout(() => {
        fetchTransactions(true);
      }, 100);
      
      setPopover(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  }, [popover, year, month, saveTransaction, invalidateMonthCache, fetchTransactions]);
  
  // Folosește hook-ul useLunarGridTable pentru logica tabelului
  
  const { 
    table,
    tableContainerRef 
  } = useLunarGridTable(
    year, 
    month, 
    expandedCategories, 
    handleCellClick, 
    handleCellDoubleClick
  );

  // Render cu constante și clase existente
  return (
    <div>
      <div className="flex justify-end space-x-2 mb-2">
        <button 
          onClick={() => expandAll()}
          className="btn btn-secondary" 
          data-testid="expand-all-btn"
        >
          {EXCEL_GRID.TABLE_CONTROLS.EXPAND_ALL}
        </button>
        <button 
          onClick={() => collapseAll()}
          className="btn btn-secondary" 
          data-testid="collapse-all-btn"
        >
          {EXCEL_GRID.TABLE_CONTROLS.COLLAPSE_ALL}
        </button>
      </div>
      
      {/* TanStack Table implementation */}
      <div 
        ref={tableContainerRef}
        className="overflow-auto rounded-lg shadow-token bg-secondary-50 h-[600px]"
      >
        {loading ? (
          <div className="text-center py-token-xl text-secondary-600" data-testid="loading-indicator">
            {EXCEL_GRID.LOADING}
          </div>
        ) : table.getRowModel().rows.length === 0 ? (
          <div className="text-center py-token-xl text-secondary-600" data-testid="no-data-indicator">
            {EXCEL_GRID.NO_DATA}
          </div>
        ) : (
          <table 
            className="w-full text-sm align-middle border-separate border-spacing-0"
            data-testid="lunar-grid-table"
          >
            <thead className="bg-secondary-100 sticky top-0">
              <tr>
                {table.getFlatHeaders().map((header: Header<TransformedTableDataRow, unknown>) => (
                  <th 
                    key={header.id}
                    className="py-3 px-3 text-left font-medium text-secondary-700"
                    style={{ width: header.getSize() }}
                    data-testid={`lunargrid-header-${header.id}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Înlocuim virtualizarea care nu funcționează cu o afișare directă a rândurilor */}
              {table.getRowModel().rows.map((row: TableRow<TransformedTableDataRow>) => {
                return (
                  <tr 
                    key={row.id}
                    className={
                      row.original.isCategory 
                        ? 'bg-secondary-50 hover:bg-secondary-100 cursor-pointer' 
                        : 'hover:bg-secondary-100'
                    }
                    onClick={() => {
                      if (row.original.isCategory) {
                        toggleCategory(row.original.category);
                      }
                    }}
                    data-testid={`row-${row.original.isCategory ? 'category' : 'subcategory'}-${row.original.category}${row.original.subcategory ? `-${row.original.subcategory}` : ''}`}
                  >
                    {row.getVisibleCells().map((cell: Cell<TransformedTableDataRow, unknown>) => (
                      <td 
                        key={cell.id}
                        className="border-t border-secondary-200 py-2 px-3 first:border-l last:border-r"
                        data-testid={`cell-${cell.column.id}-${row.id}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Popover */}
      {popover && (
        <div
          style={{ 
            position: 'absolute', 
            left: popover.anchorRect?.left || 0, 
            top: (popover.anchorRect?.top || 0) + 40, 
            zIndex: 100 
          }}
          data-testid={`popover-cell-${popover.category}-${popover.subcategory}-${popover.day}`}
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
            onCancel={() => setPopover(null)}
          />
        </div>
      )}
    </div>
  );
};

export default LunarGridTanStack;
