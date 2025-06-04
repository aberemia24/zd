import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Button from "../../../primitives/Button/Button";
import { Edit, Trash2 } from "lucide-react";

// CVA styling imports - MIGRATED TO CVA-V2
import { 
  cn,
  gridCell,
  gridInput,
  badge,
  button,
  textProfessional,
  hoverScale,
  focusRing,
  animations,
  interactiveText
} from "../../../../styles/cva-v2";

import { 
  UI, 
  LUNAR_GRID_ACTIONS,
  FLAGS
} from "@shared-constants";

interface SubcategoryRowCellProps {
  category: string;
  subcategory: string;
  isCustom: boolean;
  isEditing: boolean;
  editingValue: string;
  onEditingValueChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onStartDelete: () => void;
}

const LunarGridSubcategoryRowCell: React.FC<SubcategoryRowCellProps> = ({
  category,
  subcategory,
  isCustom,
  isEditing,
  editingValue,
  onEditingValueChange,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onStartDelete
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === LUNAR_GRID_ACTIONS.ENTER_KEY && editingValue.trim()) {
      onSaveEdit();
    } else if (e.key === LUNAR_GRID_ACTIONS.ESCAPE_KEY) {
      onCancelEdit();
    }
  };

  return (
    <div className="flex justify-between items-center gap-2 w-full">
      <div className="flex items-center gap-3">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editingValue}
              onChange={(e) => onEditingValueChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={onCancelEdit}
              className={cn(
                "flex-1",
                animations({ type: "scale-in" }),
                focusRing({ variant: "primary" })
              )}
              autoFocus
              data-testid={`edit-subcategory-input-${subcategory}`}
            />
            <Button
              size="xs"
              variant="primary"
              onClick={onSaveEdit}
              disabled={!editingValue.trim()}
              data-testid={`save-edit-subcategory-${subcategory}`}
              className="hover-scale"
            >
              ✓
            </Button>
            <Button
              size="xs"
              variant="secondary"
              onClick={onCancelEdit}
              data-testid={`cancel-edit-subcategory-${subcategory}`}
              className="hover-scale"
            >
              ✕
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center gap-2 w-full">
            <span className={cn(
              textProfessional({ variant: "body", contrast: "high" })
            )}>
              {subcategory}
            </span>
            {isCustom && (
              <span className={cn(
                "text-xs",
                animations({ type: "bounce-subtle" }),
                textProfessional({ variant: "caption" })
              )}>
                {FLAGS.CUSTOM}
              </span>
            )}
          </div>
        )}
      </div>
      
      {!isEditing && (
        <div className={cn(
          "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          "animate-fade-in-up"
        )}>
          <button
            onClick={onStartEdit}
            className={cn(
              "p-1",
              hoverScale({ intensity: "subtle" })
            )}
            title={UI.SUBCATEGORY_ACTIONS.RENAME_TITLE}
          >
            <Edit size={14} />
          </button>
          {isCustom && (
            <button
              onClick={onStartDelete}
              className={cn(
                cn("p-1", interactiveText({ variant: "warning" })),
                hoverScale({ intensity: "subtle" })
              )}
              title={UI.SUBCATEGORY_ACTIONS.DELETE_CUSTOM_TITLE}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LunarGridSubcategoryRowCell; 