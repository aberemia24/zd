/**
 * 🎯 POPOVER WRAPPER - Exemple Practice
 *
 * Acest fișier conține exemple concrete de utilizare a wrapper-ului Popover.
 * Folosește aceste exemple ca template pentru popover-urile tale.
 */

import { Info, MoreHorizontal, Save, Settings, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { Popover } from './Popover';

// =============================================================================
// 1. POPOVER SIMPLU CU INFORMAȚII
// =============================================================================

export const InfoPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      trigger={
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Info size={16} className="text-blue-500" />
        </button>
      }
      open={isOpen}
      onOpenChange={setIsOpen}
      side="top"
      align="center"
      data-testid="info-popover"
    >
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Informații utile</h4>
        <p className="text-xs text-gray-600 max-w-[200px]">
          Acest buton oferă informații suplimentare despre funcționalitatea curentă.
        </p>
      </div>
    </Popover>
  );
};

// =============================================================================
// 2. POPOVER CU FORM SIMPLU
// =============================================================================

interface SimpleFormPopoverProps {
  onSave: (value: string) => void;
  initialValue?: string;
  placeholder?: string;
}

export const SimpleFormPopover: React.FC<SimpleFormPopoverProps> = ({
  onSave,
  initialValue = '',
  placeholder = 'Introduceți valoarea...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    onSave(value);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsOpen(false);
  };

  return (
    <Popover
      trigger={
        <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
          Editează
        </button>
      }
      open={isOpen}
      onOpenChange={setIsOpen}
      maxWidth="280px"
      data-testid="simple-form-popover"
    >
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Editează valoarea</h3>

        <div className="space-y-1">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
          >
            <Save size={12} />
            Salvează
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          >
            <X size={12} />
            Anulează
          </button>
        </div>
      </div>
    </Popover>
  );
};

// =============================================================================
// 3. POPOVER CU MENU DE ACȚIUNI
// =============================================================================

interface ActionMenuPopoverProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onSettings?: () => void;
  showDelete?: boolean;
  showDuplicate?: boolean;
  showSettings?: boolean;
}

export const ActionMenuPopover: React.FC<ActionMenuPopoverProps> = ({
  onEdit,
  onDelete,
  onDuplicate,
  onSettings,
  showDelete = true,
  showDuplicate = false,
  showSettings = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <Popover
      trigger={
        <button className="p-1 rounded hover:bg-gray-100 transition-colors">
          <MoreHorizontal size={16} className="text-gray-600" />
        </button>
      }
      open={isOpen}
      onOpenChange={setIsOpen}
      side="bottom"
      align="end"
      variant="compact"
      data-testid="action-menu-popover"
    >
      <div className="py-1 min-w-[120px]">
        {onEdit && (
          <button
            onClick={() => handleAction(onEdit)}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm flex items-center gap-2 transition-colors"
          >
            <Save size={12} />
            Editează
          </button>
        )}

        {showDuplicate && onDuplicate && (
          <button
            onClick={() => handleAction(onDuplicate)}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm flex items-center gap-2 transition-colors"
          >
            <Info size={12} />
            Duplică
          </button>
        )}

        {showSettings && onSettings && (
          <button
            onClick={() => handleAction(onSettings)}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm flex items-center gap-2 transition-colors"
          >
            <Settings size={12} />
            Setări
          </button>
        )}

        {showDelete && onDelete && (
          <>
            <hr className="my-1 border-gray-200" />
            <button
              onClick={() => handleAction(onDelete)}
              className="w-full px-3 py-2 text-left hover:bg-red-50 text-sm text-red-600 flex items-center gap-2 transition-colors"
            >
              <Trash2 size={12} />
              Șterge
            </button>
          </>
        )}
      </div>
    </Popover>
  );
};

export default {
  InfoPopover,
  SimpleFormPopover,
  ActionMenuPopover
};
