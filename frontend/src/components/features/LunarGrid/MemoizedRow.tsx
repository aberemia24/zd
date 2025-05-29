import React, { memo, useCallback } from 'react';
import { Row } from '@tanstack/react-table';
import { TransformedTableDataRow } from './hooks/useLunarGridTable';
import { cn } from '../../../styles/cva/shared/utils';
import { tableRow, tableCell } from '../../../styles/cva/data';
import GridCell from './GridCell';

interface MemoizedRowProps {
  row: Row<TransformedTableDataRow>;
  days: number[];
  renderEditableCell: (
    category: string, 
    subcategory: string | undefined, 
    day: number,
    currentValue: string | number
  ) => React.ReactNode;
  getBalanceStyle: (value: number) => string;
  formatMoney: (amount: number) => string;
  toggleRowExpanded: (id: string) => void;
  level?: number;
}

/**
 * Componentă optimizată pentru randarea unui rând din tabel
 * Folosește memo și useCallback pentru a preveni re-render-uri inutile
 */
const MemoizedRow: React.FC<MemoizedRowProps> = ({
  row,
  days,
  renderEditableCell,
  getBalanceStyle,
  formatMoney,
  toggleRowExpanded,
  level = 0,
}) => {
  const { original } = row;
  const isCategory = original.isCategory;
  const isSubcategory = !isCategory && original.subcategory;
  
  // Handler pentru click pe rând de categorie (expandare/colapsare)
  const handleRowClick = useCallback(() => {
    if (isCategory) {
      toggleRowExpanded(row.id);
    }
  }, [isCategory, row.id, toggleRowExpanded]);

  // Stil pentru rândul de categorie/subcategorie
  const rowStyle = cn(
    tableRow(),
    {
      'font-medium': isCategory,
      'bg-white': !isCategory,
      'bg-gray-50': isCategory,
      'cursor-pointer hover:bg-gray-100': isCategory,
      'hover:bg-gray-50': !isCategory
    }
  );

  // Generăm un testId pentru rând
  const testId = `row-${isCategory ? 'category' : 'subcategory'}-${row.id}`;

  return (
    <tr className={rowStyle} data-testid={testId}>
      {/* Celula de categorie/subcategorie */}
      <td 
        className={cn(
          tableCell({ variant: "default" }),
          "sticky left-0 z-10",
          isCategory ? "bg-gray-50 font-semibold" : "bg-white pl-6"
        )}
        onClick={isCategory ? handleRowClick : undefined}
        style={{ paddingLeft: isCategory ? undefined : `${20 + level * 16}px` }}
      >
        <div className="flex items-center">
          {isCategory && (
            <span className="mr-2 text-gray-500">
              {row.getIsExpanded() ? '▼' : '▶'}
            </span>
          )}
          {original.category}
          {isSubcategory && original.subcategory ? ` - ${original.subcategory}` : ''}
        </div>
      </td>

      {/* Celulele pentru fiecare zi din lună */}
      {days.map((day) => {
        const dayKey = `day-${day}` as const;
        const value = original[dayKey] || 0;
        const colorClass = getBalanceStyle(value);
        
        // Pentru categorii, afișăm sumarul (read-only)
        if (isCategory) {
          return (
            <td
              key={day}
              className={cn(tableCell({ variant: "numeric" }), "bg-gray-50")}
            >
              <GridCell
                value={value !== 0 ? formatMoney(value) : "-"}
                colorClass={colorClass}
                isCategory={true}
                testId={`cell-category-${original.category}-${day}`}
                title="Suma calculată automată din subcategorii"
              />
            </td>
          );
        }
        
        // Pentru subcategorii, afișăm celula editabilă sau valoarea
        return (
          <td key={day} className={tableCell({ variant: "numeric" })}>
            {isSubcategory
              ? renderEditableCell(
                  original.category,
                  original.subcategory,
                  day,
                  value
                )
              : <GridCell 
                  value={value !== 0 ? formatMoney(value) : "-"} 
                  colorClass={colorClass}
                  testId={`cell-${original.category}-${day}`}
                />
            }
          </td>
        );
      })}

      {/* Celula de total pentru rând */}
      <td 
        className={cn(
          tableCell({ variant: "numeric" }),
          isCategory ? "bg-gray-50 font-semibold" : ""
        )}
      >
        <GridCell
          value={formatMoney(original.total)}
          colorClass={getBalanceStyle(original.total)}
          isCategory={isCategory}
          testId={`total-${row.id}`}
          title="Total rând"
        />
      </td>
    </tr>
  );
};

// Funcția de comparare pentru memo
const areEqual = (prevProps: MemoizedRowProps, nextProps: MemoizedRowProps) => {
  // Verificăm dacă rândul s-a schimbat (id, date, expandat)
  if (prevProps.row.id !== nextProps.row.id) return false;
  if (prevProps.row.getIsExpanded() !== nextProps.row.getIsExpanded()) return false;
  
  // Verificăm dacă datele originale s-au schimbat
  const prevOriginal = prevProps.row.original;
  const nextOriginal = nextProps.row.original;
  
  // Verificăm dacă suma totală s-a schimbat
  if (prevOriginal.total !== nextOriginal.total) return false;
  
  // Verificăm dacă valorile zilnice s-au schimbat
  for (const day of prevProps.days) {
    const dayKey = `day-${day}` as const;
    if (prevOriginal[dayKey] !== nextOriginal[dayKey]) return false;
  }
  
  // Verificăm dacă funcțiile de render și formatare sunt aceleași referințe
  return (
    prevProps.renderEditableCell === nextProps.renderEditableCell &&
    prevProps.getBalanceStyle === nextProps.getBalanceStyle &&
    prevProps.formatMoney === nextProps.formatMoney &&
    prevProps.toggleRowExpanded === nextProps.toggleRowExpanded &&
    prevProps.level === nextProps.level
  );
};

// Exportăm versiunea memoizată
export default memo(MemoizedRow, areEqual);
