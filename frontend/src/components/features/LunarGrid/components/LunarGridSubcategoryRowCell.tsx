import React, { useState } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
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
  interactiveText,
  flexLayout
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

// 🔧 PERFORMANCE: React.memo pentru a preveni re-renders inutile
const LunarGridSubcategoryRowCell: React.FC<SubcategoryRowCellProps> = React.memo(({
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
    // 🔧 FIX: Prevent default pentru keyboard events
    if (e.key === LUNAR_GRID_ACTIONS.ENTER_KEY || e.key === LUNAR_GRID_ACTIONS.ESCAPE_KEY) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (e.key === LUNAR_GRID_ACTIONS.ENTER_KEY && editingValue.trim()) {
      onSaveEdit();
    } else if (e.key === LUNAR_GRID_ACTIONS.ESCAPE_KEY) {
      onCancelEdit();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && relatedTarget.closest('[data-testid*="save-edit-subcategory"], [data-testid*="cancel-edit-subcategory"]')) {
      return;
    }
    onCancelEdit();
  };

  return (
    <div className={cn("w-full", flexLayout({ direction: "row", justify: "between", align: "center", gap: 2 }))}>
              <div className={flexLayout({ direction: "row", align: "center", gap: 3 })}>
        {isEditing ? (
                      <div className={flexLayout({ direction: "row", align: "center", gap: 2 })}>
            <input
              type="text"
              value={editingValue}
              onChange={(e) => onEditingValueChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
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
              onClick={() => {
                onSaveEdit();
              }}
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
          <div className={cn("w-full", flexLayout({ direction: "row", justify: "between", align: "center", gap: 2 }))}>
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
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          flexLayout({ direction: "row", align: "center", gap: 1 }),
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
});

export default LunarGridSubcategoryRowCell; 