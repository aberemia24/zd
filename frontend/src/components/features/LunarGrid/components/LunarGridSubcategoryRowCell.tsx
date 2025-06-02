import React from 'react';
import Button from "../../../primitives/Button/Button";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "../../../../styles/cva/shared/utils";
import {
  gridCell,
  gridInput,
  gridBadge,
  gridCellActions,
  gridActionButton
} from "../../../../styles/cva/grid";
import { flex } from "../../../../styles/cva/components/layout";
import { FLAGS, UI } from "@shared-constants";
import { LUNAR_GRID_ACTIONS } from "@shared-constants/ui";

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
  return (
    <div className={flex({ justify: "between", gap: "sm", width: "full" })}>
      <div className={flex({ align: "center", gap: "md" })}>
        {isEditing ? (
          <div className={flex({ align: "center", gap: "sm" })}>
            <input
              type="text"
              value={editingValue}
              onChange={(e) => onEditingValueChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === LUNAR_GRID_ACTIONS.ENTER_KEY && editingValue.trim()) {
                  onSaveEdit();
                } else if (e.key === LUNAR_GRID_ACTIONS.ESCAPE_KEY) {
                  onCancelEdit();
                }
              }}
              className={cn(
                gridInput({ variant: "professional", state: "editing" }),
                "flex-1 animate-scale-in focus-ring-primary"
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
          <div className={flex({ align: "center", gap: "md" })}>
            <span className="text-professional-body contrast-high">
              {subcategory}
            </span>
            {isCustom && (
              <div className={cn(
                gridBadge({ variant: "custom", size: "sm" }),
                "animate-bounce-subtle text-professional-caption"
              )}>
                {FLAGS.CUSTOM}
              </div>
            )}
          </div>
        )}
      </div>
      
      {!isEditing && (
        <div className={cn(
          gridCellActions({ variant: "professional" }),
          "animate-fade-in-up"
        )}>
          <button
            className={cn(
              gridActionButton({ variant: "primary", size: "sm" }),
              "hover-lift"
            )}
            onClick={onStartEdit}
            data-testid={`edit-subcategory-btn-${subcategory}`}
            title={UI.SUBCATEGORY_ACTIONS.RENAME_TITLE}
          >
            <Edit size={12} />
          </button>
          {isCustom && (
            <button
              className={cn(
                gridActionButton({ variant: "danger", size: "sm" }),
                "hover-lift"
              )}
              onClick={onStartDelete}
              data-testid={`delete-subcategory-btn-${subcategory}`}
              title={UI.SUBCATEGORY_ACTIONS.DELETE_CUSTOM_TITLE}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LunarGridSubcategoryRowCell; 