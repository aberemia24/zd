import React from 'react';
import { cn } from '../../../../styles/cva';
import { gridTransactionCell } from '../../../../styles/cva/grid';
import { EditableCell } from '../inline-editing/EditableCell';
import { PLACEHOLDERS } from '@shared-constants';

export interface LunarGridCellProps {
  category: string;
  subcategory: string | undefined;
  day: number;
  currentValue: string | number;
  transactionId: string | null;
  isHighlighted?: boolean; // Pentru highlight la editare din modal
  isFocused?: boolean;     // Pentru navigația cu tastatura
  isSelected?: boolean;    // Pentru navigația cu tastatura
  onSave: (value: string | number) => Promise<void>;
  onSingleClick: (event: React.MouseEvent<Element, MouseEvent>) => void;
}

const LunarGridCell: React.FC<LunarGridCellProps> = ({
  category,
  subcategory,
  day,
  currentValue,
  transactionId,
  isHighlighted,
  isFocused,
  isSelected,
  onSave,
  onSingleClick,
}) => {
  const cellId = `${category}-${subcategory || 'null'}-${day}`;

  let displayValue = "";
  if (currentValue && currentValue !== "-" && currentValue !== "—") {
    if (typeof currentValue === "string") {
      displayValue = currentValue
        .replace(/[^\d,.-]/g, "")
        .replace(/\./g, "") 
        .replace(",", ".");
    } else {
      displayValue = String(currentValue);
    }
  }

  return (
    <EditableCell
      cellId={cellId}
      value={displayValue}
      onSave={onSave}
      onSingleClick={onSingleClick}
      validationType="amount"
      className={cn(
        gridTransactionCell({
          state: transactionId ? "existing" : "new",
        }),
        isHighlighted && "ring-2 ring-blue-500 ring-opacity-75 bg-blue-50 shadow-lg transform scale-105 transition-all duration-200",
        isFocused && "ring-2 ring-purple-500 ring-opacity-50 bg-purple-50",
        isSelected && "bg-blue-100 border-blue-300",
        (isFocused || isSelected) && "transition-all duration-150"
      )}
      data-testid={`editable-cell-${cellId}`}
      placeholder={transactionId ? PLACEHOLDERS.EDIT_TRANSACTION : PLACEHOLDERS.ADD_TRANSACTION}
    />
  );
};

export default LunarGridCell; 