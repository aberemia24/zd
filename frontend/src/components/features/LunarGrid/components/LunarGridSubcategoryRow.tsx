import React from 'react';
import { cn, flex } from '../../../../styles/cva'; // Corectat: import din barrel file-ul CVA
import { gridBadge, gridCellActions, gridActionButton, gridInput } from '../../../../styles/cva/grid'; // Cale relativă ajustată
import Button from '../../../primitives/Button/Button'; // Import default corectat
import { Edit, Trash2, Check, X } from 'lucide-react';
import { UI, FLAGS, LUNAR_GRID_ACTIONS, BUTTONS as ButtonLabels, PLACEHOLDERS } from '@shared-constants';
import { flexRender, CellContext } from '@tanstack/react-table'; // Import necesar

interface LunarGridSubcategoryRowProps {
  categoryName: string; // original.category
  subcategoryName: string; // original.subcategory
  isCustom: boolean;
  cellContext: CellContext<any, any>;
  // Props pentru modul de editare
  isEditing: boolean;
  editingSubcategoryName: string;
  onEditingSubcategoryNameChange: (name: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void; // Pentru a iniția modul de editare
  // Prop pentru delete (rămâne la fel)
  onDelete?: () => void; // Doar dacă isCustom e true
}

const LunarGridSubcategoryRow: React.FC<LunarGridSubcategoryRowProps> = ({
  // categoryName, // Nu pare folosit direct în JSX-ul extras, poate fi eliminat dacă nu e necesar altundeva
  subcategoryName,
  isCustom,
  cellContext,
  isEditing,
  editingSubcategoryName,
  onEditingSubcategoryNameChange,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onDelete,
}) => {
  if (isEditing) {
    return (
      <div className={flex({ align: "center", gap: "sm", width: "full" })}>
        <input
          type="text"
          value={editingSubcategoryName}
          onChange={(e) => onEditingSubcategoryNameChange(e.target.value)}
          placeholder={PLACEHOLDERS.SUBCATEGORY_NAME}
          className={cn(
            gridInput({ variant: "professional", state: "editing" }),
            "flex-1 focus-ring-primary"
          )}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === LUNAR_GRID_ACTIONS.ENTER_KEY) {
              onSaveEdit();
            } else if (e.key === LUNAR_GRID_ACTIONS.ESCAPE_KEY) {
              onCancelEdit();
            }
          }}
          data-testid={`edit-subcategory-input-${subcategoryName}`}
        />
        <Button
          size="xs"
          variant="primary"
          onClick={onSaveEdit}
          disabled={!editingSubcategoryName.trim() || editingSubcategoryName.trim() === subcategoryName}
          data-testid={`save-edit-subcategory-btn-${subcategoryName}`}
          className="hover-scale p-1.5"
          title={ButtonLabels.SAVE}
        >
          <Check size={14} />
        </Button>
        <Button
          size="xs"
          variant="secondary"
          onClick={onCancelEdit}
          data-testid={`cancel-edit-subcategory-btn-${subcategoryName}`}
          className="hover-scale p-1.5"
          title={ButtonLabels.CANCEL}
        >
          <X size={14} />
        </Button>
      </div>
    );
  }

  return (
    <div className={flex({ justify: "between", gap: "sm", width: "full" })}>
      <div className={flex({ align: "center", gap: "md" })}>
        {/* Normal Mode cu professional text și badge */}
        <div className={flex({ align: "center", gap: "md" })}>
          <span className="text-professional-body contrast-high">
            {flexRender(cellContext.column.columnDef.cell, cellContext) as React.ReactNode}
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
      </div>

      {/* Professional Action Buttons cu enhanced hover effects (doar butoanele non-editare) */}
      <div className={cn(
        gridCellActions({ variant: "professional" }),
        "animate-fade-in-up"
      )}>
        {/* Edit button pentru TOATE subcategoriile */}
        <button
          className={cn(
            gridActionButton({ variant: "primary", size: "sm" }),
            "hover-lift"
          )}
          onClick={onStartEdit}
          data-testid={`edit-subcategory-btn-${subcategoryName}`}
          title={UI.SUBCATEGORY_ACTIONS.RENAME_TITLE}
        >
          <Edit size={12} />
        </button>

        {/* Delete button DOAR pentru subcategoriile custom */}
        {isCustom && onDelete && (
          <button
            className={cn(
              gridActionButton({ variant: "danger", size: "sm" }),
              "hover-lift"
            )}
            onClick={onDelete}
            data-testid={`delete-subcategory-btn-${subcategoryName}`}
            title={UI.SUBCATEGORY_ACTIONS.DELETE_CUSTOM_TITLE}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LunarGridSubcategoryRow; 