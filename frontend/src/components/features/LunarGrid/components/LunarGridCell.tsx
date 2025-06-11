import React from 'react';
import { EditableCell, EditableCellProps } from "../inline-editing/EditableCell";

export interface LunarGridCellProps extends Pick<EditableCellProps, 
  'date' | 'existingTransaction' | 'onSaveTransaction' | 'isSavingTransaction' | 'onTogglePopover' | 'category' | 'subcategory' | 'onDeleteTransaction' | 'validTransactions'
> {
  cellId: string;
  value: string;
  onSave?: (value: string | number) => Promise<void>;
  onSingleClick?: (e: React.MouseEvent) => void;
  className?: string;
  placeholder?: string;
  isSelected?: boolean;
  isFocused?: boolean;
  onFocus?: () => void;
  onClick?: (e: React.MouseEvent) => void;
}

const LunarGridCell: React.FC<LunarGridCellProps> = (props) => {
  return (
    <EditableCell
      cellId={props.cellId}
      value={props.value}
      onSave={props.onSave || (async () => {})}
      onSingleClick={props.onSingleClick || (() => {})}
      validationType="amount"
      className={props.className}
      placeholder={props.placeholder}
      isSelected={props.isSelected}
      isFocused={props.isFocused}
      onFocus={props.onFocus}
      onClick={props.onClick}
      date={props.date}
      category={props.category}
      subcategory={props.subcategory}
      existingTransaction={props.existingTransaction}
      onSaveTransaction={props.onSaveTransaction}
      onDeleteTransaction={props.onDeleteTransaction}
      isSavingTransaction={props.isSavingTransaction}
      onTogglePopover={props.onTogglePopover}
      validTransactions={props.validTransactions}
    />
  );
};

export default LunarGridCell; 
