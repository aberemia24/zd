import React from 'react';
import Button from "../../../primitives/Button/Button";
import { Plus, Check, X } from "lucide-react";
import { cn } from "../../../../styles/cva/unified-cva";
import {
  gridSubcategoryRow,
  gridSubcategoryState,
  gridCell,
  gridInput,
  gridInteractive
} from "../../../../styles/cva/grid";
import { BUTTONS, PLACEHOLDERS, LUNAR_GRID_ACTIONS } from "@shared-constants";
import { 
  gridRow,
  button,
  badge,
  textProfessional,
  focusRing,
  hoverScale,
  input,
  flex
} from "../../../../styles/cva/unified-cva";

interface AddSubcategoryRowProps {
  category: string;
  isAdding: boolean;
  inputValue: string;
  totalColumns: number;
  onInputChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onStartAdd: () => void;
}

const LunarGridAddSubcategoryRow: React.FC<AddSubcategoryRowProps> = ({
  category,
  isAdding,
  inputValue,
  totalColumns,
  onInputChange,
  onSave,
  onCancel,
  onStartAdd
}) => {
  return (
    <tr className={cn(
      gridSubcategoryRow({ variant: "professional" }),
      gridSubcategoryState({ variant: "adding" })
    )}>
      <td className={cn(
        gridCell({ type: "subcategory" }),
        gridSubcategoryState({ cell: "backdrop" })
      )}>
        {isAdding ? (
          <div className={flex({ align: "center", gap: "md" })}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={PLACEHOLDERS.SUBCATEGORY_NAME}
              className={cn(
                gridInput({ variant: "default", state: "editing" }),
                "flex-1",
                focusRing({ variant: "primary" })
              )}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === LUNAR_GRID_ACTIONS.ENTER_KEY) {
                  onSave();
                } else if (e.key === LUNAR_GRID_ACTIONS.ESCAPE_KEY) {
                  onCancel();
                }
              }}
              data-testid={`new-subcategory-input-${category}`}
            />
            <button
              type="button"
              onClick={onSave}
              className={cn(
                button({ variant: "ghost", size: "sm" }),
                hoverScale({ intensity: "subtle" })
              )}
              disabled={!inputValue.trim()}
              title={BUTTONS.DONE}
            >
              <Check size={14} />
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                button({ variant: "ghost", size: "sm" }),
                hoverScale({ intensity: "subtle" })
              )}
              title={BUTTONS.CANCEL}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={onStartAdd}
            className={cn(
              gridInteractive({ variant: "button", size: "auto" }),
              flex({ align: "center", gap: "sm" })
            )}
            data-testid={`add-subcategory-${category}`}
          >
            <Plus size={14} className="text-professional-primary" />
            <span className="text-professional-body font-medium">{BUTTONS.ADD_SUBCATEGORY}</span>
          </Button>
        )}
      </td>
      {/* Empty cells */}
      {Array.from({ length: totalColumns - 1 }).map((_, idx) => (
        <td 
          key={`empty-${idx}`}
          className={cn(gridCell({ type: "value", state: "readonly" }))}
        />
      ))}
    </tr>
  );
};

export default LunarGridAddSubcategoryRow; 