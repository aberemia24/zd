import React, { memo } from 'react';
import { cn } from '../../../styles/cva/shared/utils';
import { tableCell } from '../../../styles/cva/data';
import GridCell from './GridCell';

interface TableFooterProps {
  days: number[];
  dailyBalances: Record<number, number>;
  monthTotal: number;
  getBalanceStyle: (value: number) => string;
  formatMoney: (amount: number) => string;
}

/**
 * Componentă pentru footer-ul tabelului (rândul de total)
 * Memoizată pentru a preveni re-renderări inutile
 */
const TableFooter: React.FC<TableFooterProps> = ({
  days,
  dailyBalances,
  monthTotal,
  getBalanceStyle,
  formatMoney,
}) => {
  return (
    <tr 
      className={cn(
        "bg-gray-100 font-bold border-t-2 border-gray-300",
        "hover:bg-gray-200 transition-colors duration-150"
      )} 
      data-testid="sold-row"
    >
      {/* Celula de etichetă */}
      <td 
        className={cn(
          tableCell({ variant: "default" }),
          "sticky left-0 bg-gray-100 z-10 font-bold"
        )}
      >
        Total balanță
      </td>
      
      {/* Celule zilnice de total */}
      {days.map((day) => {
        const balance = dailyBalances[day] || 0;
        return (
          <td 
            key={day} 
            className={cn(
              tableCell({ variant: "numeric" }),
              getBalanceStyle(balance),
              "transition-colors duration-150"
            )}
          >
            {balance !== 0 ? formatMoney(balance) : "-"}
          </td>
        );
      })}
      
      {/* Celula de total final */}
      <td 
        className={cn(
          tableCell({ variant: "numeric" }),
          getBalanceStyle(monthTotal),
          "font-bold",
          "transition-colors duration-150"
        )}
      >
        {formatMoney(monthTotal)}
      </td>
    </tr>
  );
};

// Funcția de comparare pentru memoizare
const areEqual = (prevProps: TableFooterProps, nextProps: TableFooterProps) => {
  // Verificăm dacă totalul lunar s-a schimbat
  if (prevProps.monthTotal !== nextProps.monthTotal) return false;
  
  // Verificăm dacă totalurile zilnice s-au schimbat
  const prevDays = Object.keys(prevProps.dailyBalances).map(Number);
  const nextDays = Object.keys(nextProps.dailyBalances).map(Number);
  
  // Verificăm dacă avem aceleași zile
  if (prevDays.length !== nextDays.length) return false;
  
  // Verificăm dacă valorile pentru fiecare zi s-au schimbat
  for (const day of prevProps.days) {
    if (prevProps.dailyBalances[day] !== nextProps.dailyBalances[day]) {
      return false;
    }
  }
  
  // Verificăm dacă funcțiile helper sunt aceleași referințe
  return (
    prevProps.getBalanceStyle === nextProps.getBalanceStyle &&
    prevProps.formatMoney === nextProps.formatMoney
  );
};

// Exportăm versiunea memoizată
export default memo(TableFooter, areEqual);
