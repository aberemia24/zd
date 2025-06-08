import React from 'react';
import { EditableCell } from "../inline-editing/EditableCell";

interface LunarGridCellProps {
  cellId: string;
  value: string;
  onSave: (value: string | number) => Promise<void>;
  onSingleClick: (e: React.MouseEvent) => void;
  className?: string;
  placeholder?: string;
  isSelected?: boolean;
  isFocused?: boolean;
  onFocus?: () => void;
  onCellSelect?: (cellId: string) => void;
}

const LunarGridCell: React.FC<LunarGridCellProps> = (props) => {
  return (
    <EditableCell
      cellId={props.cellId}
      value={props.value}
      onSave={props.onSave}
      onSingleClick={props.onSingleClick}
      validationType="amount"
      className={props.className}
      placeholder={props.placeholder}
      isSelected={props.isSelected}
      isFocused={props.isFocused}
      onFocus={props.onFocus || (() => props.onCellSelect?.(props.cellId))}
    />
  );
};

export default LunarGridCell; 
