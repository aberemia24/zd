import React from 'react';
import Button from "../../../primitives/Button/Button";
import { LUNAR_GRID, UI } from "@shared-constants"; // Eliminat BUTTONS dacă nu e folosit direct aici

interface LunarGridToolbarProps {
  // isAllExpanded: boolean; // Aceasta va fi derivata din getIsAllRowsExpanded
  onToggleExpandAll: () => void;
  onResetExpanded: () => void;
  orphanTransactionsCount?: number;
  onCleanOrphans?: () => void;
  getIsAllRowsExpanded: () => boolean;
}

const LunarGridToolbar: React.FC<LunarGridToolbarProps> = ({
  onToggleExpandAll,
  onResetExpanded,
  orphanTransactionsCount,
  onCleanOrphans,
  getIsAllRowsExpanded
}) => {
  return (
    <div className="flex items-center gap-2 py-2 mb-2 border-b border-gray-200">
      <Button
        variant="secondary"
        size="sm"
        onClick={onToggleExpandAll}
        data-testid="toggle-expand-all"
      >
        {getIsAllRowsExpanded() ? LUNAR_GRID.COLLAPSE_ALL : LUNAR_GRID.EXPAND_ALL}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={onResetExpanded}
        data-testid="reset-expanded"
      >
        {LUNAR_GRID.RESET_EXPANSION}
      </Button>

      {orphanTransactionsCount && orphanTransactionsCount > 0 && onCleanOrphans && (
        <Button
          variant="danger"
          size="sm"
          onClick={onCleanOrphans}
          data-testid="clean-orphan-transactions"
          title={UI.SUBCATEGORY_ACTIONS.DELETE_ORPHAN_TITLE} // Asigură-te că UI.SUBCATEGORY_ACTIONS.DELETE_ORPHAN_TITLE există
        >
          🗑️ Curăță tranzacții orfane ({orphanTransactionsCount})
        </Button>
      )}
    </div>
  );
};

export default LunarGridToolbar; 