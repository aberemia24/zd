import React from 'react';
import { Plus, Check, X } from 'lucide-react';
import { cn, flex } from '../../../../styles/cva';
import { gridSubcategoryRow, gridSubcategoryState, gridCell, gridInput, gridInteractive } from '../../../../styles/cva/grid';
import Button from '../../../primitives/Button/Button';
import { PLACEHOLDERS, LUNAR_GRID_ACTIONS, BUTTONS as ButtonLabels } from '@shared-constants';

interface LunarGridAddSubcategoryRowProps {
  categoryName: string;
  isInputMode: boolean;
  newSubcategoryName: string;
  onNewSubcategoryNameChange: (name: string) => void;
  onSaveNewSubcategory: () => void;
  onCancelNewSubcategory: () => void;
  onStartAddNewSubcategory: () => void;
  numDataColumns: number;
}

const LunarGridAddSubcategoryRow: React.FC<LunarGridAddSubcategoryRowProps> = ({
  categoryName,
  isInputMode,
  newSubcategoryName,
  onNewSubcategoryNameChange,
  onSaveNewSubcategory,
  onCancelNewSubcategory,
  onStartAddNewSubcategory,
  numDataColumns,
}) => {
  return (
    <tr 
      className={cn(
        gridSubcategoryRow({ variant: "professional" }), 
        gridSubcategoryState({ variant: "adding" })
      )}
      data-testid={`add-subcategory-row-${categoryName}`}
    >
      <td 
        className={cn(
          gridCell({ type: "subcategory" }), 
          gridSubcategoryState({ cell: "backdrop" })
        )}
      >
        {isInputMode ? (
          <div className={flex({ align: "center", gap: "sm" })}>
            <input
              type="text"
              value={newSubcategoryName}
              onChange={(e) => onNewSubcategoryNameChange(e.target.value)}
              placeholder={PLACEHOLDERS.SUBCATEGORY_NAME}
              className={cn(
                gridInput({ variant: "professional", state: "editing" }),
                "flex-1 focus-ring-primary"
              )}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === LUNAR_GRID_ACTIONS.ENTER_KEY) {
                  onSaveNewSubcategory();
                } else if (e.key === LUNAR_GRID_ACTIONS.ESCAPE_KEY) {
                  onCancelNewSubcategory();
                }
              }}
              data-testid={`new-subcategory-input-${categoryName}`}
            />
            <Button
              size="xs"
              variant="primary"
              onClick={onSaveNewSubcategory}
              disabled={!newSubcategoryName.trim()}
              data-testid={`save-subcategory-btn-${categoryName}`}
              className="hover-scale p-1.5"
              title={ButtonLabels.SAVE}
            >
              <Check size={14} />
            </Button>
            <Button
              size="xs"
              variant="secondary"
              onClick={onCancelNewSubcategory}
              data-testid={`cancel-subcategory-btn-${categoryName}`}
              className="hover-scale p-1.5"
              title={ButtonLabels.CANCEL}
            >
              <X size={14} />
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={onStartAddNewSubcategory}
            className={cn(
              gridInteractive({ variant: "addButton", size: "auto" }),
              flex({ align: "center", gap: "sm" })
            )}
            data-testid={`add-subcategory-btn-${categoryName}`}
          >
            <Plus size={14} className="text-professional-primary" />
            <span className="text-professional-body font-medium">{ButtonLabels.ADD_SUBCATEGORY}</span>
          </Button>
        )}
      </td>
      {Array.from({ length: numDataColumns }).map((_, index) => (
        <td 
          key={`add-subcategory-empty-${categoryName}-${index}`} 
          className={cn(gridCell({ type: "value", state: "readonly" }))}
        >
          {/* Empty cell cu subtle styling */}
        </td>
      ))}
    </tr>
  );
};

export default LunarGridAddSubcategoryRow; 